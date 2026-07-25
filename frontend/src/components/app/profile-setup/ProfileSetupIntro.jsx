export default function ProfileSetupIntro({ wallet }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">Profile setup</div>
      <h1 className="mt-5 max-w-[660px] text-[clamp(48px,7vw,92px)] font-medium leading-[0.9] tracking-[-0.08em]">
        Choose the name shown inside BOND.
      </h1>
      <p className="mt-6 max-w-[500px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#c8c1b4]">
        This is the identity counterparties see in rooms, market offers, and dispute context. You can edit it later.
      </p>
      <div className="mt-8 border-l border-[#ede9df]/14 pl-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[#ede9df]/46">
        Wallet<br />
        <span className="text-[#ede9df]">{wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}</span>
      </div>
    </div>
  )
}
