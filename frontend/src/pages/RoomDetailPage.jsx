import RoomView from '../components/RoomView'

export default function RoomDetailPage({ wallet, connecting, onConnect }) {
  return <RoomView wallet={wallet} connecting={connecting} onConnect={onConnect} />
}
