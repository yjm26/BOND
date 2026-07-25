import AppWorkspace from '../components/app/AppWorkspace'

export default function AppPage({ wallet, connecting, connectError, onConnect, onProfileStateChange }) {
  return <AppWorkspace wallet={wallet} connecting={connecting} connectError={connectError} onConnect={onConnect} onProfileStateChange={onProfileStateChange} />
}
