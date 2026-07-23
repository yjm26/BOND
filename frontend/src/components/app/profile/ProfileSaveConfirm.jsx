import ConfirmModal from '../../ConfirmModal'

export default function ProfileSaveConfirm({ pendingProfile, onCancel, onConfirm }) {
  return (
    <ConfirmModal
      open={Boolean(pendingProfile)}
      title="Save profile changes?"
      description="This updates your local BOND workspace profile for this wallet. Social handles remain self-reported until verified connections ship."
      confirmLabel="Save profile"
      cancelLabel="Review"
      tone="primary"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
