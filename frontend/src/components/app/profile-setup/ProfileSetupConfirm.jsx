import ConfirmModal from '../../ConfirmModal'

export default function ProfileSetupConfirm({ pendingProfile, onCancel, onConfirm }) {
  return (
    <ConfirmModal
      open={Boolean(pendingProfile)}
      tone="dark"
      eyebrow="Profile setup"
      title="Save this workspace profile?"
      description="BOND will save your display name, X profile, and Discord handle as local workspace preferences for this wallet."
      confirmLabel="Save profile"
      cancelLabel="Review"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
