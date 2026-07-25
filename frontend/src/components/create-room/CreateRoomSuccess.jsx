import { Link } from 'react-router-dom'

export default function CreateRoomSuccess({ result, copied, fromMarket, creatorIsSeller, onCopy }) {
  return (
    <section className="min-h-screen bg-[#000000] px-4 pt-[88px] text-[#fafafa] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] place-items-center pb-4">
        <div className="w-full max-w-[640px] border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-7">
          <div className="mb-6 border-b border-[#fafafa]/10 pb-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f9a88]">Room created</div>
            <h2 className="mt-4 text-[44px] font-medium leading-[0.94] tracking-[-0.08em] text-[#fafafa]">Share the private invite.</h2>
            {fromMarket && !creatorIsSeller && <p className="mt-3 text-[13px] leading-[1.6] text-[#a3a3a3]">The seller may still need the invite link and join code before funds can move.</p>}
          </div>
          <div className="grid gap-4">
            <div><div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/38">Room ID</div><div className="font-mono text-[18px] text-[#fafafa]">#{result.roomId}</div></div>
            <div><div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/38">Join code</div><code className="block border border-[#fafafa]/10 bg-[#0a0a0a] px-4 py-3 font-mono text-[22px] font-semibold tracking-[0.18em] text-[#8f9a88]">{result.joinCode}</code></div>
            <div><div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/38">Invite link</div><div className="flex gap-2"><input readOnly value={result.inviteLink} className="h-11 min-w-0 flex-1 border border-[#fafafa]/12 bg-[#0a0a0a] px-3 font-mono text-[12px] text-[#fafafa] outline-none" /><button onClick={onCopy} className="h-11 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">{copied ? 'Copied' : 'Copy'}</button></div></div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to={`/room/${result.roomId}?code=${result.joinCode}`} className="flex h-11 flex-1 items-center justify-center border border-[#fafafa] bg-[#fafafa] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Go to room →</Link>
            <Link to="/rooms" className="flex h-11 items-center justify-center border border-[#fafafa]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">My rooms</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
