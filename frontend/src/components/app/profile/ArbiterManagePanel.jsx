import { useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { ARC_GAS, ARC_READ_PROVIDER, ensureArcChain, getContract, waitForTx } from '../../../utils/contract'
import { formatAddress } from '../../../utils/constants'

const inputClass = 'h-11 w-full border border-[var(--a-line)] bg-[var(--a-panel)] px-3 text-[13px] text-[var(--a-ink)] outline-none placeholder:text-[var(--a-ink)]/24 focus:border-[var(--a-muted)]/60 disabled:opacity-50'
const primaryButton = 'h-11 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)] disabled:cursor-not-allowed disabled:opacity-40'
const ghostButton = 'h-11 border border-[var(--a-line)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] disabled:cursor-not-allowed disabled:opacity-40'
const MAX_ARBITER_NAME_BYTES = 64

export default function ArbiterManagePanel({ wallet }) {
  const [owner, setOwner] = useState('')
  const [primaryArbiter, setPrimaryArbiter] = useState('')
  const [primaryName, setPrimaryName] = useState('')
  const [currentIsArbiter, setCurrentIsArbiter] = useState(false)
  const [arbiterAddress, setArbiterAddress] = useState('')
  const [arbiterName, setArbiterName] = useState('')
  const [checkAddress, setCheckAddress] = useState('')
  const [checkedArbiter, setCheckedArbiter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accessReady, setAccessReady] = useState(false)
  const [status, setStatus] = useState(null)

  const isOwner = useMemo(
    () => Boolean(wallet?.address && owner && wallet.address.toLowerCase() === owner.toLowerCase()),
    [wallet?.address, owner],
  )
  const walletRole = isOwner ? 'Owner' : currentIsArbiter ? 'Arbiter' : 'User'

  useEffect(() => {
    if (!wallet?.address) {
      setAccessReady(false)
      setOwner('')
      setCurrentIsArbiter(false)
      return undefined
    }

    let stale = false
    ;(async () => {
      try {
        const contract = getContract(ARC_READ_PROVIDER)
        const [contractOwner, arbiter, name, isActiveArbiter] = await Promise.all([
          contract.owner(),
          contract.arbiter().catch(() => ''),
          contract.arbiterName().catch(() => ''),
          contract.isArbiter(wallet.address).catch(() => false),
        ])
        if (stale) return
        setOwner(contractOwner)
        setPrimaryArbiter(arbiter)
        setPrimaryName(name)
        setCurrentIsArbiter(Boolean(isActiveArbiter))
      } catch {
        if (!stale) setStatus({ type: 'err', msg: 'Cannot read owner/arbiter from current contract.' })
      } finally {
        if (!stale) setAccessReady(true)
      }
    })()
    return () => {
      stale = true
    }
  }, [wallet?.address])

  const runArbiterTx = async (label, fn) => {
    setLoading(true)
    setStatus({ type: 'info', msg: label })
    try {
      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      const contract = getContract(signer)
      const tx = await fn(contract)
      setStatus({ type: 'info', msg: `TX sent: ${tx.hash.slice(0, 10)}…` })
      await waitForTx(wallet.provider, tx.hash, 180000)
      setStatus({ type: 'ok', msg: 'Updated arbiter access.' })
      const read = getContract(ARC_READ_PROVIDER)
      setPrimaryArbiter(await read.arbiter().catch(() => primaryArbiter))
      setPrimaryName(await read.arbiterName().catch(() => primaryName))
      if (wallet?.address) {
        setCurrentIsArbiter(await read.isArbiter(wallet.address).catch(() => false))
      }
    } catch (err) {
      setStatus({ type: 'err', msg: err.reason || err.message || 'Arbiter update failed' })
    } finally {
      setLoading(false)
    }
  }

  const addArbiter = () => {
    if (!ethers.isAddress(arbiterAddress)) {
      setStatus({ type: 'err', msg: 'Invalid arbiter address.' })
      return
    }
    if (new TextEncoder().encode(arbiterName.trim()).length > MAX_ARBITER_NAME_BYTES) {
      setStatus({ type: 'err', msg: `Arbiter name must stay under ${MAX_ARBITER_NAME_BYTES} bytes.` })
      return
    }
    runArbiterTx('Adding arbiter…', (contract) =>
      contract.addArbiter(arbiterAddress, arbiterName.trim() || 'BOND Arbiter', ARC_GAS),
    )
  }

  const removeArbiter = () => {
    if (!ethers.isAddress(arbiterAddress)) {
      setStatus({ type: 'err', msg: 'Invalid arbiter address.' })
      return
    }
    runArbiterTx('Removing arbiter…', (contract) => contract.removeArbiter(arbiterAddress, ARC_GAS))
  }

  const checkArbiter = async () => {
    if (!ethers.isAddress(checkAddress)) {
      setStatus({ type: 'err', msg: 'Invalid address to check.' })
      return
    }
    try {
      const contract = getContract(ARC_READ_PROVIDER)
      const [active, name] = await Promise.all([
        contract.isArbiter(checkAddress),
        contract.arbiterDisplayName(checkAddress).catch(() => ''),
      ])
      setCheckedArbiter({ address: checkAddress, active, name })
    } catch (err) {
      setStatus({ type: 'err', msg: err.message || 'Could not check arbiter.' })
    }
  }

  if (!accessReady || (!isOwner && !currentIsArbiter)) return null

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">Manage arbiters</div>
      <h3 className="mt-4 text-[28px] font-medium leading-[1] tracking-[-0.06em] text-[var(--a-ink)]">
        Owner controls dispute access.
      </h3>
      <p className="mt-3 text-[13px] leading-[1.65] text-[var(--a-muted)]">
        Active arbiters can resolve disputed rooms on-chain. Disputed rooms are already frozen until an owner or active arbiter resolves/splits them.
      </p>

      <div className="mt-5 grid gap-px bg-[var(--a-inverse-bg)]/10 p-px text-[13px]">
        {[
          ['Owner', owner ? formatAddress(owner) : '—'],
          [
            'Primary arbiter',
            primaryArbiter ? `${primaryName || 'BOND Arbiter'} · ${formatAddress(primaryArbiter)}` : '—',
          ],
          ['Role', walletRole],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[130px_1fr] bg-[var(--a-panel)] p-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--a-faint)]">{label}</span>
            <span className="text-[var(--a-ink)]">{value}</span>
          </div>
        ))}
      </div>

      {isOwner ? (
        <div className="mt-5 grid gap-3">
          <input
            className={inputClass}
            value={arbiterAddress}
            onChange={(event) => setArbiterAddress(event.target.value)}
            placeholder="Arbiter wallet address"
          />
          <input
            className={inputClass}
            value={arbiterName}
            onChange={(event) => setArbiterName(event.target.value)}
            placeholder="Display name, e.g. BOND Arbiter"
            maxLength={64}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <button className={primaryButton} disabled={loading} onClick={addArbiter}>
              Add arbiter
            </button>
            <button className={ghostButton} disabled={loading} onClick={removeArbiter}>
              Remove arbiter
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 border border-[var(--a-line)] bg-[var(--a-panel)] p-4 text-[13px] leading-[1.6] text-[var(--a-muted)]">
          Only the contract owner can add or remove arbiters.
        </div>
      )}

      <div className="mt-5 grid gap-3 border-t border-[var(--a-line)] pt-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--a-ink)]/40">Check arbiter access</div>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            className={inputClass}
            value={checkAddress}
            onChange={(event) => setCheckAddress(event.target.value)}
            placeholder="Address to check"
          />
          <button className={ghostButton} onClick={checkArbiter}>
            Check
          </button>
        </div>
        {checkedArbiter && (
          <div
            className={`border px-4 py-3 text-[13px] ${
              checkedArbiter.active
                ? 'border-[#8f9a88]/28 bg-[#8f9a88]/10 text-[#8f9a88]'
                : 'border-[var(--a-line)] bg-[var(--a-panel)] text-[var(--a-muted)]'
            }`}
          >
            {formatAddress(checkedArbiter.address)} is{' '}
            {checkedArbiter.active
              ? `active${checkedArbiter.name ? ` as ${checkedArbiter.name}` : ''}`
              : 'not an active arbiter'}
            .
          </div>
        )}
      </div>

      {status && (
        <div
          className={`mt-5 border px-4 py-3 text-[13px] leading-[1.55] ${
            status.type === 'ok'
              ? 'border-[#8f9a88]/28 bg-[#8f9a88]/10 text-[#8f9a88]'
              : status.type === 'err'
                ? 'border-[#b87333]/35 bg-[#b87333]/10 text-[#b87333]'
                : 'border-[var(--a-muted)]/24 bg-[var(--a-muted)]/[0.07] text-[var(--a-muted)]'
          }`}
        >
          {status.msg}
        </div>
      )}
    </div>
  )
}
