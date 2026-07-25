import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { getContract, getUsdc, waitForTx, ARC_GAS, ARC_GAS_APPROVE, generateJoinCode, hashJoinCode, createInviteLink, CONTRACT_ADDRESS, ensureArcChain, fixSignerNonce, readMany, getLatestNonce } from '../utils/contract'
import { authFetch } from '../lib/api'
import CreateRoomConfirm from './create-room/CreateRoomConfirm'
import CreateRoomForm from './create-room/CreateRoomForm'
import CreateRoomHeader from './create-room/CreateRoomHeader'
import CreateRoomSuccess from './create-room/CreateRoomSuccess'
import CreateRoomSummary from './create-room/CreateRoomSummary'

const MAX_ITEM_BYTES = 160

export default function CreateRoom({ wallet }) {
  const [searchParams] = useSearchParams()
  const [item, setItem] = useState(searchParams.get('item') || '')
  const [price, setPrice] = useState(searchParams.get('price') || '')
  const [collateral, setCollateral] = useState(searchParams.get('collateral') || '')
  const [noCollateral, setNoCollateral] = useState(searchParams.get('collateral') === '0')
  const [deliveryDays, setDeliveryDays] = useState(Number(searchParams.get('deliveryDays')) || 5)
  const counterparty = searchParams.get('counterparty') || ''
  const fromMarket = Boolean(searchParams.get('listingId') || searchParams.get('item'))
  const [creatorIsSeller, setCreatorIsSeller] = useState(searchParams.get('creatorIsSeller') !== 'false')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('')
  const [result, setResult] = useState(() => {
    try {
      const saved = sessionStorage.getItem('bond_last_created')
      if (saved) {
        const data = JSON.parse(saved)
        if (Date.now() - data.ts < 600000) return data
        sessionStorage.removeItem('bond_last_created')
      }
    } catch {}
    return null
  })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const roomState = useMemo(() => ({ item, price, collateral, noCollateral, deliveryDays, creatorIsSeller }), [item, price, collateral, noCollateral, deliveryDays, creatorIsSeller])
  const canSubmit = Boolean(wallet && item.trim() && price.trim())

  const validateRoom = () => {
    const itemValue = item.trim()
    if (!wallet || !itemValue || !price.trim()) return 'Connect wallet and fill item + price first.'
    if (new TextEncoder().encode(itemValue).length > MAX_ITEM_BYTES) return `Item description must stay under ${MAX_ITEM_BYTES} bytes`
    if (deliveryDays < 1 || deliveryDays > 90) return 'Delivery window must be 1–90 days'
    try {
      const priceWei = ethers.parseUnits(price, 6)
      if (priceWei === 0n) return 'Price too small — minimum 0.000001 USDC'
    } catch {
      return 'Invalid price format'
    }
    if (!noCollateral && collateral) {
      try { ethers.parseUnits(collateral, 6) } catch { return 'Invalid collateral format' }
    }
    return ''
  }

  const requestCreate = () => {
    const validationError = validateRoom()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setConfirmOpen(true)
  }

  const handleCreate = async () => {
    const validationError = validateRoom()
    if (validationError) {
      setError(validationError)
      return
    }

    setConfirmOpen(false)
    setLoading(true)
    setError('')
    setStep('Checking limits…')
    let createdSuccessfully = false

    try {
      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      const contract = getContract(signer)
      const restore = await fixSignerNonce(signer)

      try {
        let active, maxActive
        try {
          ;[active, maxActive] = await readMany([
            { method: 'activeRooms', args: [wallet.address] },
            { method: 'MAX_ACTIVE' },
          ], wallet.provider)
        } catch (readErr) {
          console.error('Read error:', readErr)
          throw new Error('Cannot read BOND contract right now. Arc RPC may be busy; your wallet can be on the correct Arc Testnet and still hit this. Please retry in a few seconds.')
        }

        if (active >= maxActive) {
          throw new Error(`You have ${active} active room(s) (max ${maxActive}). Complete, release, or cancel one first.`)
        }

        const usdc = getUsdc(signer)
        const priceWei = ethers.parseUnits(price, 6)
        const collateralValue = noCollateral ? '0' : collateral
        const collateralWei = collateralValue ? ethers.parseUnits(collateralValue, 6) : 0n
        const joinCode = generateJoinCode()
        const joinCodeHash = hashJoinCode(joinCode)
        let nonce = await getLatestNonce(await signer.getAddress(), wallet.provider)

        if (creatorIsSeller && collateralWei > 0n) {
          setStep('Approving USDC…')
          try {
            const approveTx = await usdc.approve(CONTRACT_ADDRESS, collateralWei, { ...ARC_GAS_APPROVE, nonce: nonce++ })
            await waitForTx(wallet.provider, approveTx.hash, 180000)
          } catch (approveErr) {
            console.error('approve failed:', approveErr)
            throw new Error('USDC approve failed: ' + (approveErr.message || 'unknown'))
          }
        }

        setStep('Creating room…')
        const tx = await contract.createRoom(item.trim(), priceWei, collateralWei, joinCodeHash, creatorIsSeller, deliveryDays, { ...ARC_GAS, nonce: nonce++ })
        setStep('Waiting for confirmation…')
        const receipt = await waitForTx(wallet.provider, tx.hash, 180000)

        const event = receipt.logs.find((log) => {
          try { return contract.interface.parseLog(log)?.name === 'RoomCreated' } catch { return false }
        })
        if (!event) throw new Error('RoomCreated event not found in transaction receipt')
        const parsed = contract.interface.parseLog(event)
        if (!parsed?.args?.id) throw new Error('Could not parse room ID from event')

        const roomId = parsed.args.id.toString()
        const inviteLink = createInviteLink(roomId, joinCode)
        const nextResult = { roomId, inviteLink, joinCode, ts: Date.now() }
        setResult(nextResult)
        sessionStorage.setItem('bond_last_created', JSON.stringify(nextResult))
        createdSuccessfully = true

        const listingId = searchParams.get('listingId')
        let backendErr = null
        try {
          const ctrl = new AbortController()
          const t = setTimeout(() => ctrl.abort(), 15000)

          if (listingId) {
            await authFetch(`/api/listings/${listingId}/taken`, {
              method: 'PUT',
              signal: ctrl.signal,
              body: JSON.stringify({ roomId }),
            }, wallet)
            if (counterparty) {
              await authFetch('/api/notifications', {
                method: 'POST',
                signal: ctrl.signal,
                body: JSON.stringify({
                  to: counterparty,
                  message: `Someone opened a deal for "${item}" — Room #${roomId}`,
                  listingId,
                }),
              }, wallet)
            }
          }

          if (counterparty) {
            await authFetch('/api/room-codes', {
              method: 'POST',
              signal: ctrl.signal,
              body: JSON.stringify({
                roomId,
                joinCode,
                counterparty,
                item,
                price,
                listingId,
              }),
            }, wallet)
          }
          clearTimeout(t)
        } catch (e) {
          console.error('Backend sync failed:', e)
          backendErr = 'Seller notification failed — please share the invite link manually.'
        }
        if (backendErr) setError(backendErr)
      } finally {
        restore()
      }
    } catch (err) {
      console.error(err)
      setError(err.reason || err.message || 'Transaction failed')
      setStep('')
    } finally {
      if (!createdSuccessfully) setLoading(false)
      if (createdSuccessfully) {
        setStep('')
        setLoading(false)
      }
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(result.inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return <CreateRoomSuccess result={result} copied={copied} fromMarket={fromMarket} creatorIsSeller={creatorIsSeller} onCopy={copyLink} />
  }

  return (
    <section className="min-h-screen bg-[#000000] px-4 pt-[88px] text-[#fafafa] sm:px-6 lg:px-8">
      <div className="pb-4">
        <main className="overflow-hidden border border-[#fafafa]/10 bg-[#0a0a0a]">
          <div className="p-4 sm:p-5 lg:p-6">
            <CreateRoomHeader fromMarket={fromMarket} creatorIsSeller={creatorIsSeller} />
            <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
              <CreateRoomForm
                state={roomState}
                setters={{ setItem, setPrice, setCollateral, setNoCollateral, setDeliveryDays, setCreatorIsSeller }}
                fromMarket={fromMarket}
                canSubmit={canSubmit}
                loading={loading}
                step={step}
                error={error}
                onRequestCreate={requestCreate}
              />
              <CreateRoomSummary state={roomState} fromMarket={fromMarket} />
            </div>
          </div>
        </main>
      </div>
      <CreateRoomConfirm open={confirmOpen} loading={loading} state={roomState} onCancel={() => setConfirmOpen(false)} onConfirm={handleCreate} />
    </section>
  )
}
