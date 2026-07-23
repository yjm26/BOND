import { useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { ARC_GAS, ensureArcChain, getContract, waitForTx } from '../../../utils/contract'
import { formatAddress } from '../../../utils/constants'

const inputClass = 'h-11 w-full border border-[#ede9df]/12 bg-[#111110] px-3 text-[13px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/24 focus:border-[#d8b15f]/60 disabled:opacity-50'
const primaryButton = 'h-11 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40'
const ghostButton = 'h-11 border border-[#ede9df]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40'
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
  const [status, setStatus] = useState(null)

  const isOwner = useMemo(() => Boolean(wallet?.address && owner && wallet.address.toLowerCase() === owner.toLowerCase()), [wallet?.address, owner])
  const walletRole = isOwner ? 'Owner' : currentIsArbiter ? 'Arbiter' : 'User'

  useEffect(() => {
    if (!wallet?.provider) return
    let stale = false
    ;(async () => {
      try {
        const contract = getContract(wallet.provider)
        const [contractOwner, arbiter, name, isActiveArbiter] = await Promise.all([
          contract.owner(),
          contract.arbiter().catch(() => ''),
          contract.arbiterName().catch(() => ''),
          wallet?.address ? contract.isArbiter(wallet.address).catch(() => false) : false,
        ])
        if (stale) return
        setOwner(contractOwner)
        setPrimaryArbiter(arbiter)
        setPrimaryName(name)
        setCurrentIsArbiter(isActiveArbiter)
      } catch (err) {
        if (!stale) setStatus({ type: 'err', msg: 'Cannot read owner/arbiter from current contract.' })
      }
    })()
    return () => { stale = true }
  }, [wallet?.address, wallet?.provider])

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
      const read = getContract(wallet.provider)
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
    runArbiterTx('Adding arbiter…', (contract) => contract.addArbiter(arbiterAddress, arbiterName.trim() || 'BOND Arbiter', ARC_GAS))
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
      const contract = getContract(wallet.provider)
      const [active, name] = await Promise.all([
        contract.isArbiter(checkAddress),
        contract.arbiterDisplayName(checkAddress).catch(() => ''),
      ])
      setCheckedArbiter({ address: checkAddress, active, name })
    } catch (err) {
      setStatus({ type: 'err', msg: err.message || 'Could not check arbiter.' })
    }
  }

  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Manage arbiters</div>
      <h3 className="mt-4 text-[28px] font-medium leading-[1] tracking-[-0.06em] text-[#ede9df]">Owner controls dispute access.</h3>
      <p className="mt-3 text-[13px] leading-[1.65] text-[#b9b2a5]">Active arbiters can resolve disputed rooms on-chain. Disputed rooms are already frozen until an owner or active arbiter resolves/splits them.</p>

      <div className="mt-5 grid gap-px bg-[#ede9df]/10 p-px text-[13px]">
        {[
          ['Owner', owner ? formatAddress(owner) : '—'],
          ['Primary arbiter', primaryArbiter ? `${primaryName || 'BOND Arbiter'} · ${formatAddress(primaryArbiter)}` : '—'],
          ['Role', walletRole],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[130px_1fr] bg-[#111110] p-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/34">{label}</span>
            <span className="text-[#ede9df]">{value}</span>
          </div>
        ))}
      </div>

      {isOwner ? (
        <div className="mt-5 grid gap-3">
          <input className={inputClass} value={arbiterAddress} onChange={(event) => setArbiterAddress(event.target.value)} placeholder="Arbiter wallet address" />
          <input className={inputClass} value={arbiterName} onChange={(event) => setArbiterName(event.target.value)} placeholder="Display name, e.g. BOND Arbiter" maxLength={64} />
          <div className="grid gap-2 sm:grid-cols-2">
            <button className={primaryButton} disabled={loading} onClick={addArbiter}>Add arbiter</button>
            <button className={ghostButton} disabled={loading} onClick={removeArbiter}>Remove arbiter</button>
          </div>
        </div>
      ) : (
        <div className="mt-5 border border-[#ede9df]/10 bg-[#111110] p-4 text-[13px] leading-[1.6] text-[#b9b2a5]">Only the contract owner can add or remove arbiters.</div>
      )}

      <div className="mt-5 grid gap-3 border-t border-[#ede9df]/10 pt-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/40">Check arbiter access</div>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input className={inputClass} value={checkAddress} onChange={(event) => setCheckAddress(event.target.value)} placeholder="Address to check" />
          <button className={ghostButton} onClick={checkArbiter}>Check</button>
        </div>
        {checkedArbiter && (
          <div className={`border px-4 py-3 text-[13px] ${checkedArbiter.active ? 'border-[#b7c8a3]/28 bg-[#b7c8a3]/10 text-[#b7c8a3]' : 'border-[#ede9df]/10 bg-[#111110] text-[#b9b2a5]'}`}>
            {formatAddress(checkedArbiter.address)} is {checkedArbiter.active ? `active${checkedArbiter.name ? ` as ${checkedArbiter.name}` : ''}` : 'not an active arbiter'}.
          </div>
        )}
      </div>

      {status && (
        <div className={`mt-5 border px-4 py-3 text-[13px] leading-[1.55] ${status.type === 'ok' ? 'border-[#b7c8a3]/28 bg-[#b7c8a3]/10 text-[#b7c8a3]' : status.type === 'err' ? 'border-[#c98b4a]/35 bg-[#c98b4a]/10 text-[#c98b4a]' : 'border-[#d8b15f]/24 bg-[#d8b15f]/[0.07] text-[#d8b15f]'}`}>{status.msg}</div>
      )}
    </div>
  )
}
