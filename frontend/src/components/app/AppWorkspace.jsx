import AppGate from './AppGate'
import AppHome from './AppHome'

export default function AppWorkspace({ wallet, connecting, connectError, onConnect }) {
  if (!wallet) {
    return <AppGate connecting={connecting} connectError={connectError} onConnect={onConnect} />
  }

  return <AppHome wallet={wallet} />
}
