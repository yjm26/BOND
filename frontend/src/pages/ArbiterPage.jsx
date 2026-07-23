import ArbiterDashboard from '../components/ArbiterDashboard'

export default function ArbiterPage({ wallet, connecting, connectError, onConnect }) {
  return <ArbiterDashboard wallet={wallet} connecting={connecting} connectError={connectError} onConnect={onConnect} />
}
