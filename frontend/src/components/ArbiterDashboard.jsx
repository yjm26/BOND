import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppGate from './app/AppGate'
import ArbiterGate from './arbiter/ArbiterGate'
import ArbiterHeader from './arbiter/ArbiterHeader'
import ArbiterStats from './arbiter/ArbiterStats'
import DisputeDetailPanel from './arbiter/DisputeDetailPanel'
import DisputeQueue from './arbiter/DisputeQueue'
import {
  ARC_GAS,
  ARC_READ_PROVIDER,
  ensureArcChain,
  getContract,
  parseRoom,
  waitForTx,
} from '../utils/contract'
import { DISPUTED_STATE, normalizeEvidence, shapeRoom } from './arbiter/arbiterUtils'
import { fetchOpenDisputes, resolveDisputeRecord } from '../lib/disputesApi'
import { fetchRoomEvidence } from '../lib/evidenceApi'

const SCAN_CAP = 60
const READ_BATCH = 10

function getRole(wallet, owner, isArbiter) {
  if (!wallet?.address) return 'User'
  if (owner && wallet.address.toLowerCase() === owner.toLowerCase()) return 'Owner'
  if (isArbiter) return 'Arbiter'
  return 'User'
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const idx = next++
      results[idx] = await worker(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(items.length, 1)) }, () => run()))
  return results
}

/**
 * Merge API dispute cases with on-chain Disputed rooms.
 * Parallel reads; evidence only for rooms that are actually Disputed.
 */
async function loadDeskCases() {
  let apiCases = []
  try {
    apiCases = await fetchOpenDisputes()
  } catch (err) {
    console.warn('disputes API unavailable', err)
  }

  const contract = getContract(ARC_READ_PROVIDER)
  const total = Number(await contract.roomCount())
  const apiById = new Map()

  for (const row of apiCases || []) {
    const id = Number(row.roomId)
    if (!Number.isFinite(id) || id <= 0) continue
    apiById.set(id, row)
  }

  const scanStart = Math.max(1, total - SCAN_CAP + 1)
  const candidateIds = [
    ...new Set([
      ...apiById.keys(),
      ...Array.from({ length: Math.max(0, total - scanStart + 1) }, (_, i) => scanStart + i),
    ]),
  ].sort((a, b) => b - a)

  const roomRows = await mapPool(candidateIds, READ_BATCH, async (id) => {
    try {
      const roomData = parseRoom(await contract.rooms(id))
      if (Number(roomData.state) !== DISPUTED_STATE) return null
      return { id, roomData }
    } catch {
      return null
    }
  })

  const disputed = roomRows.filter(Boolean)

  const loaded = await mapPool(disputed, 6, async ({ id, roomData }) => {
    const [chainEvidence, backend] = await Promise.all([
      contract
        .getAllEvidence(id)
        .then((items) => items.map(normalizeEvidence))
        .catch(() => []),
      fetchRoomEvidence(id).catch(() => []),
    ])

    const apiEvidence = (Array.isArray(backend) ? backend : []).map((e) => ({
      submitter: e.submitter,
      evidenceType: e.evidenceType,
      description: e.description,
      evidenceRef: e.evidenceRef,
      timestamp: Math.floor(Number(e.timestamp || Date.now()) / 1000),
    }))

    const shaped = shapeRoom(id, roomData, [...chainEvidence, ...apiEvidence])
    const api = apiById.get(id)
    if (api?.reason) {
      shaped.apiReason = api.reason
      shaped.disputedBy = api.disputedBy
    }
    return shaped
  })

  loaded.sort((a, b) => (b.disputedAt || b.createdAt) - (a.disputedAt || a.createdAt))
  return loaded
}

export default function ArbiterDashboard({ wallet, connecting, connectError, onConnect }) {
  const [owner, setOwner] = useState('')
  const [isActiveArbiter, setIsActiveArbiter] = useState(false)
  const [roleLoading, setRoleLoading] = useState(true)
  const [roleError, setRoleError] = useState('')
  const [disputes, setDisputes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState('')
  const [resolving, setResolving] = useState(false)
  const [txStatus, setTxStatus] = useState(null)
  const hasLoadedQueue = useRef(false)
  const inflightQueue = useRef(null)

  const role = useMemo(() => getRole(wallet, owner, isActiveArbiter), [wallet, owner, isActiveArbiter])
  const canUseDesk = role === 'Owner' || role === 'Arbiter'
  const selectedRoom = disputes.find((room) => room.id === selectedId) || disputes[0] || null

  const loadRole = useCallback(async () => {
    if (!wallet?.provider || !wallet?.address) return
    setRoleLoading(true)
    setRoleError('')
    try {
      const contract = getContract(wallet.provider)
      const [contractOwner, currentIsArbiter] = await Promise.all([
        contract.owner(),
        contract.isArbiter(wallet.address).catch(() => false),
      ])
      setOwner(contractOwner)
      setIsActiveArbiter(currentIsArbiter)
    } catch (err) {
      setRoleError(err.message || 'Cannot read arbiter access from contract.')
    } finally {
      setRoleLoading(false)
    }
  }, [wallet?.address, wallet?.provider])

  const loadDisputes = useCallback(async () => {
    if (inflightQueue.current) return inflightQueue.current

    // Only full-screen/queue skeleton on first load — later refreshes stay quiet
    if (!hasLoadedQueue.current) setQueueLoading(true)
    setQueueError('')

    const job = (async () => {
      try {
        const loaded = await loadDeskCases()
        setDisputes(loaded)
        setSelectedId((current) => (loaded.some((room) => room.id === current) ? current : loaded[0]?.id || null))
        hasLoadedQueue.current = true
      } catch (err) {
        setQueueError(err.message || 'Failed to load dispute desk.')
      } finally {
        setQueueLoading(false)
        inflightQueue.current = null
      }
    })()

    inflightQueue.current = job
    return job
  }, [])

  useEffect(() => {
    if (!wallet) return
    loadRole()
  }, [wallet, loadRole])

  useEffect(() => {
    if (!wallet || !canUseDesk) return
    loadDisputes()
  }, [wallet?.address, canUseDesk, loadDisputes])

  const runDecision = async (label, action, resolutionTag) => {
    if (!selectedRoom || resolving) return
    setResolving(true)
    setTxStatus({ type: 'info', msg: label })
    try {
      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      const contract = getContract(signer)
      const tx = await action(contract)
      setTxStatus({ type: 'info', msg: `TX sent: ${tx.hash.slice(0, 10)}…` })
      await waitForTx(wallet.provider, tx.hash, 180000)
      try {
        await resolveDisputeRecord(wallet, selectedRoom.id, resolutionTag || 'on-chain')
      } catch (e) {
        console.warn('dispute record resolve failed', e)
      }
      setTxStatus({ type: 'ok', msg: 'Decision confirmed on Arc.' })
      await loadDisputes()
    } catch (err) {
      setTxStatus({ type: 'err', msg: err.reason || err.message || 'Decision failed.' })
    } finally {
      setResolving(false)
    }
  }

  const resolveTo = (winner) =>
    runDecision(
      'Resolving disputed room…',
      (contract) => contract.arbiterResolve(selectedRoom.id, winner, ARC_GAS),
      winner?.toLowerCase() === selectedRoom.seller?.toLowerCase() ? 'release-seller' : 'refund-buyer',
    )
  const splitRoom = () =>
    runDecision('Splitting disputed room…', (contract) => contract.arbiterSplit(selectedRoom.id, ARC_GAS), 'split')

  if (!wallet) {
    return <AppGate connecting={connecting} connectError={connectError} onConnect={onConnect} />
  }

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="pb-4">
        <main className="overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)]">
          <div className="p-4 sm:p-5 lg:p-6">
            {roleLoading || !canUseDesk ? (
              <ArbiterGate role={role} loadingRole={roleLoading} error={roleError} />
            ) : (
              <>
                <ArbiterHeader role={role} disputes={disputes} loading={queueLoading} onRefresh={loadDisputes} />
                <p className="mb-4 max-w-[52ch] text-[13px] leading-[1.55] text-[var(--a-muted)]">
                  Dispute desk merges on-chain Disputed rooms with API case notes and evidence. Money moves only from arbiter transactions.
                </p>
                <ArbiterStats disputes={disputes} />
                <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
                  <DisputeQueue
                    disputes={disputes}
                    selectedId={selectedRoom?.id}
                    onSelect={(room) => {
                      setSelectedId(room.id)
                      setTxStatus(null)
                    }}
                    loading={queueLoading && disputes.length === 0}
                    error={queueError}
                  />
                  <DisputeDetailPanel
                    room={selectedRoom}
                    role={role}
                    resolving={resolving}
                    txStatus={txStatus}
                    onResolve={resolveTo}
                    onSplit={splitRoom}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </section>
  )
}
