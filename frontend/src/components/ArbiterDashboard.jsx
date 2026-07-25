import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
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

function getRole(wallet, owner, isArbiter) {
  if (!wallet?.address) return 'User'
  if (owner && wallet.address.toLowerCase() === owner.toLowerCase()) return 'Owner'
  if (isArbiter) return 'Arbiter'
  return 'User'
}

/**
 * Merge API dispute cases with on-chain Disputed rooms.
 * Prefer chain state for money truth; API supplies reason + off-chain evidence.
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
  const byId = new Map()

  // Seed from API open cases first (may include reason before chain read)
  for (const row of apiCases || []) {
    const id = Number(row.roomId)
    if (!Number.isFinite(id)) continue
    byId.set(id, {
      api: row,
      id,
    })
  }

  // Scan chain for Disputed — authoritative queue
  // Cap scan window for responsiveness; API ids always included
  const apiIds = [...byId.keys()]
  const scanStart = Math.max(1, total - 150)
  const candidateIds = new Set([
    ...apiIds,
    ...Array.from({ length: Math.max(0, total - scanStart + 1) }, (_, i) => scanStart + i),
  ])

  const loaded = []
  for (const id of candidateIds) {
    try {
      const roomData = parseRoom(await contract.rooms(id))
      if (Number(roomData.state) !== DISPUTED_STATE) {
        // keep API-only only if still open and chain not readable — skip non-disputed
        continue
      }
      const chainEvidence = await contract
        .getAllEvidence(id)
        .then((items) => items.map(normalizeEvidence))
        .catch(() => [])
      let apiEvidence = []
      try {
        const backend = await fetchRoomEvidence(id)
        apiEvidence = (Array.isArray(backend) ? backend : []).map((e) => ({
          submitter: e.submitter,
          evidenceType: e.evidenceType,
          description: e.description,
          evidenceRef: e.evidenceRef,
          timestamp: Math.floor(Number(e.timestamp || Date.now()) / 1000),
        }))
      } catch { /* ignore */ }

      const shaped = shapeRoom(id, roomData, [...chainEvidence, ...apiEvidence])
      const api = byId.get(id)?.api
      if (api?.reason) {
        shaped.apiReason = api.reason
        shaped.disputedBy = api.disputedBy
      }
      loaded.push(shaped)
    } catch (err) {
      console.warn(`Failed to read room ${id}`, err)
    }
  }

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
    setQueueLoading(true)
    setQueueError('')
    try {
      const loaded = await loadDeskCases()
      setDisputes(loaded)
      setSelectedId((current) => (loaded.some((room) => room.id === current) ? current : loaded[0]?.id || null))
    } catch (err) {
      setQueueError(err.message || 'Failed to load dispute desk.')
    } finally {
      setQueueLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!wallet) return
    loadRole()
  }, [wallet, loadRole])

  useEffect(() => {
    if (!wallet || !canUseDesk) return
    loadDisputes()
  }, [wallet, canUseDesk, loadDisputes])

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
        <main className="overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)] animate-[bondDeskIn_180ms_cubic-bezier(0.23,1,0.32,1)]">
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
                    loading={queueLoading}
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
