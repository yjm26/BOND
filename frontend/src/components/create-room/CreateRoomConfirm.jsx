import ConfirmModal from '../ConfirmModal'

export default function CreateRoomConfirm({ open, loading, state, onCancel, onConfirm }) {
  return (
    <ConfirmModal
      open={open}
      title="Create escrow room?"
      description={`This will ask your wallet to create a BOND room for ${state.price || '0'} USDC. Review role, amount, collateral, and seller deadline before confirming.`}
      confirmLabel={loading ? 'Processing…' : 'Create room'}
      cancelLabel="Review"
      tone="primary"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
