import { useEffect, useState } from 'react'
import { getContract } from '../../utils/contract'

export default function useDisputeAccess(wallet) {
  const [canAccessDisputes, setCanAccessDisputes] = useState(false)

  useEffect(() => {
    if (!wallet?.address || !wallet?.provider) {
      setCanAccessDisputes(false)
      return
    }

    let stale = false
    setCanAccessDisputes(false)

    ;(async () => {
      try {
        const contract = getContract(wallet.provider)
        const [owner, activeArbiter] = await Promise.all([
          contract.owner().catch(() => ''),
          contract.isArbiter(wallet.address).catch(() => false),
        ])
        if (stale) return
        setCanAccessDisputes(Boolean(owner && wallet.address.toLowerCase() === owner.toLowerCase()) || Boolean(activeArbiter))
      } catch {
        if (!stale) setCanAccessDisputes(false)
      }
    })()

    return () => { stale = true }
  }, [wallet?.address, wallet?.provider])

  return canAccessDisputes
}
