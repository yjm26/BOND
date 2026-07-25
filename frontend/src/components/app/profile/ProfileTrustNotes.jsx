export default function ProfileTrustNotes() {
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/40">Trust notes</div>
      <div className="mt-5 grid gap-3 text-[13px] leading-[1.65] text-[#a3a3a3]">
        <p>Profile data is stored locally for this prototype. It helps the workspace feel personal, but it is not public reputation.</p>
        <p>X and Discord are not verified yet. Do not treat them as authenticated identity until OAuth-backed connection exists.</p>
        <p>Escrow trust still comes from room terms: wallet addresses, locked USDC, proof, deadlines, and dispute path.</p>
      </div>
    </div>
  )
}
