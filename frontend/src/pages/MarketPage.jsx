import { Navigate } from 'react-router-dom'
import Market from '../components/Market'
import PublicListings from '../components/public-listings/PublicListings'

/**
 * /market is the canonical market URL.
 * - Guest / incomplete profile: landing-style public browse
 * - Connected workspace: dark app market shell
 */
export default function MarketPage({ wallet, profileReady }) {
  const inWorkspace = Boolean(wallet?.address && profileReady)

  if (inWorkspace) {
    return <Market wallet={wallet} />
  }

  return <PublicListings />
}

export function ListingsRedirect() {
  return <Navigate to="/market" replace />
}
