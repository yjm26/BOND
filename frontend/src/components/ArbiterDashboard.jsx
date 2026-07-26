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

/** Recent rooms to scan on-chain when API list is empty/partial */
const SCAN_CAP = 40
const READ_BATCH = 12

function getRole(address, owner, isArbiter) {
  if (!address) return 'User'
  if (owner && address.toLowerCase() === owner.toLowerCase()) return 'Owner'
  if (isArbiter) return 'Arbiter'
  return 'User'
}

async function mapPool(items, concurrency, worker) {
  if (!items.length) return []
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const idx = next++
      results[idx] = await worker(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()))
  return results
}

/**
 * Merge API dispute cases with on-chain Disputed rooms.
 * Prefer API ids first (fast path), then light chain scan.
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

  const loaded = await mapPool(disputed, 8, async ({ id, roomData }) => {
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
  const address = wallet?.address || null

  const [owner, setOwner] = useState('')
  const [isActiveArbiter, setIsActiveArbiter] = useState(false)
  // true only until first role resolution for this address
  const [roleReady, setRoleReady] = useState(false)
  const [roleError, setRoleError] = useState('')
  const [disputes, setDisputes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueRefreshing, setQueueRefreshing] = useState(false)
  const [queueError, setQueueError] = useState('')
  const [resolving, setResolving] = useState(false)
  const [txStatus, setTxStatus] = useState(null)

  const roleAddrRef = useRef(null)
  const queueLoadedRef = useRef(false)
  const inflightQueue = useRef(null)
  const mountedRef = useRef(true)

  const role = useMemo(
    () => getRole(address, owner, isActiveArbiter),
    [address, owner, isActiveArbiter],
  )
  const canUseDesk = role === 'Owner' || role === 'Arbiter'
  // Contract is onlyArbiter on resolve/split — owner sees the desk read-only.
  const canDecide = role === 'Arbiter'
  const selectedRoom = useMemo(
    () => disputes.find((room) => room.id === selectedId) || disputes[0] || null,
    [disputes, selectedId],
  )

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Role check: public RPC only — never depends on wallet.provider identity (that was the flicker)
  useEffect(() => {
    if (!address) {
      setRoleReady(false)
      setOwner('')
      setIsActiveArbiter(false)
      roleAddrRef.current = null
      return undefined
    }

    // Same address already resolved — do not flip roleReady / unmount desk
    if (roleAddrRef.current === address.toLowerCase() && roleReady) {
      return undefined
    }

    let cancelled = false
    setRoleReady(false)
    setRoleError('')

    ;(async () => {
      try {
        const contract = getContract(ARC_READ_PROVIDER)
        const [contractOwner, currentIsArbiter] = await Promise.all([
          contract.owner(),
          contract.isArbiter(address).catch(() => false),
        ])
        if (cancelled || !mountedRef.current) return
        setOwner(contractOwner)
        setIsActiveArbiter(Boolean(currentIsArbiter))
        roleAddrRef.current = address.toLowerCase()
        setRoleReady(true)
      } catch (err) {
        if (cancelled || !mountedRef.current) return
        setRoleError(err.message || 'Cannot read arbiter access from contract.')
        setOwner('')
        setIsActiveArbiter(false)
        roleAddrRef.current = address.toLowerCase()
        setRoleReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [address]) // eslint-disable-line react-hooks/exhaustive-deps -- roleReady intentional gate

  const loadDisputes = useCallback(async ({ silent = false } = {}) => {
    if (inflightQueue.current) return inflightQueue.current

    const first = !queueLoadedRef.current
    if (first) setQueueLoading(true)
    else if (!silent) setQueueRefreshing(true)
    setQueueError('')

    const job = (async () => {
      try {
        const loaded = await loadDeskCases()
        if (!mountedRef.current) return
        setDisputes(loaded)
        setSelectedId((current) =>
          loaded.some((room) => room.id === current) ? current : loaded[0]?.id || null,
        )
        queueLoadedRef.current = true
      } catch (err) {
        if (!mountedRef.current) return
        setQueueError(err.message || 'Failed to load dispute desk.')
      } finally {
        if (mountedRef.current) {
          setQueueLoading(false)
          setQueueRefreshing(false)
        }
        inflightQueue.current = null
      }
    })()

    inflightQueue.current = job
    return job
  }, [])

  // Load queue once when access granted — not on every wallet object churn
  useEffect(() => {
    if (!address || !roleReady || !canUseDesk) return
    loadDisputes({ silent: queueLoadedRef.current })
  }, [address, roleReady, canUseDesk, loadDisputes])

  // Reset queue cache when wallet changes
  useEffect(() => {
    queueLoadedRef.current = false
    setDisputes([])
    setSelectedId(null)
    setQueueError('')
  }, [address])

  const runDecision = async (label, action, resolutionTag) => {
    if (!selectedRoom || resolving || !wallet) return
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
      await loadDisputes({ silent: true })
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

  // Gate only while role is unknown OR access denied — never thrash after roleReady
  const showGate = !roleReady || !canUseDesk

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="pb-4">
        <main className="overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)]">
          <div className="p-4 sm:p-5 lg:p-6">
            {showGate ? (
              <ArbiterGate role={role} loadingRole={!roleReady} error={roleError} />
            ) : (
              <>
                <ArbiterHeader
                  role={role}
                  disputes={disputes}
                  loading={queueLoading || queueRefreshing}
                  onRefresh={() => loadDisputes({ silent: false })}
                />
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
