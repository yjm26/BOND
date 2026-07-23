import { Navigate } from 'react-router-dom'

export default function OffersRedirectPage() {
  return <Navigate to="/market?offers=1" replace />
}
