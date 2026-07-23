import RoomMetricCard from './RoomMetricCard'

export default function RoomTermsPanel({ room, priceUSDC, taxUSDC, totalUSDC, hasCollateral }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RoomMetricCard label="Item price" value={`${priceUSDC} USDC`} />
      <RoomMetricCard label="Total to fund" value={`${totalUSDC} USDC`} note={`Includes ${taxUSDC} USDC platform fee.`} tone="warning" />
      {Number(room.value) > 0 && <RoomMetricCard label="Locked escrow" value={`${room.value} USDC`} note="Held on-chain until release, refund, or dispute resolution." tone="success" />}
      {hasCollateral && <RoomMetricCard label="Seller collateral" value={`${room.collateralAmount} USDC`} note="Guarantee locked by seller when required." tone="warning" />}
    </div>
  )
}
