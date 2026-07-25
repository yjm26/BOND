import { useEffect, useState } from 'react'
import { ARC_READ_PROVIDER, getContract } from '../../utils/contract'

/**
 * Whether the connected wallet may open the disputes desk (owner or arbiter).
 * Uses public RPC (stable) and does not flash false on every re-render.
 */
export default function useDisputeAccess(wallet) {
  const [canAccessDisputes, setCanAccessDisputes] = useState(false)

  useEffect(() => {
    if (!wallet?.address) {
      setCanAccessDisputes(false)
      return
    }

    let stale = false

    ;(async () => {
      try {
        const contract = getContract(ARC_READ_PROVIDER)
        const [owner, activeArbiter] = await Promise.all([
          contract.owner().catch(() => ''),
          contract.isArbiter(wallet.address).catch(() => false),
        ])
        if (stale) return
        const isOwner = Boolean(owner && wallet.address.toLowerCase() === String(owner).toLowerCase())
        setCanAccessDisputes(isOwner || Boolean(activeArbiter))
      } catch {
        if (!stale) setCanAccessDisputes(false)
      }
    })()

    return () => {
      stale = true
    }
  }, [wallet?.address])

  return canAccessDisputes
}
