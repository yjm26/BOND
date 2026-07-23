import ProfileSettings from '../components/app/ProfileSettings'

export default function ProfilePage({ wallet, connecting, connectError, onConnect }) {
  return <ProfileSettings wallet={wallet} connecting={connecting} connectError={connectError} onConnect={onConnect} />
}
