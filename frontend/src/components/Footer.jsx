import { Link } from 'react-router-dom'

const PRODUCT_LINKS = [
  { label: 'Create room', to: '/create' },
  { label: 'Market', to: '/listings' },
  { label: 'Docs', to: '/docs' },
]

const RESOURCE_LINKS = [
  { label: 'GitHub', href: 'https://github.com/yjm26/BOND' },
  { label: 'Contract', href: 'https://testnet.arcscan.app/address/0x1A3ea0d24ff15a90417508F38ABD8E173921082A' },
]

export default function Footer() {
  return (
    <footer className="bg-[#111111] px-6 py-10 text-[#fafafa] sm:px-10 sm:py-14 lg:px-14">
      <div className="grid gap-9 border-t border-[#fafafa]/14 pt-8 sm:gap-12 sm:pt-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-11 items-center justify-center border border-[#fafafa]/14 bg-[#0a0a0a]">
              <img src="/brand/bond-logo-white.png" alt="BOND" className="w-9 object-contain" draggable="false" />
            </span>
            <span>
              <span className="block text-[15px] font-medium tracking-[-0.02em]">BOND</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-[#fafafa]/44">Arc settlement rooms</span>
            </span>
          </Link>

          <p className="mt-6 max-w-[520px] text-[14px] leading-[1.65] tracking-[-0.01em] text-[#a3a3a3] sm:mt-8 sm:text-[15px] sm:leading-[1.7]">
            Private rooms for internet deals that need more than a promise. Lock USDC on Arc, keep proof beside the money, and settle through release, refund, or dispute review.
          </p>

          <div className="mt-6 max-w-[560px] border border-[#a3a3a3]/22 bg-[#a3a3a3]/[0.07] px-4 py-3 font-mono text-[9px] uppercase leading-[1.65] tracking-[0.14em] text-[#a3a3a3]/82 sm:mt-8 sm:text-[10px] sm:tracking-[0.16em]">
            Arc Testnet — testing environment only. Do not use production funds.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-2">
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#fafafa]/38">Product</div>
            <div className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <Link key={link.label} to={link.to} className="block text-[14px] text-[#fafafa]/72 transition hover:text-[#fafafa]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#fafafa]/38">Resources</div>
            <div className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block text-[14px] text-[#fafafa]/72 transition hover:text-[#fafafa]">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-3 border-t border-[#fafafa]/10 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#fafafa]/34 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
        <span>© BOND / Arc Testnet</span>
        <span className="max-w-full truncate">0x1A3ea0d24ff15a90417508F38ABD8E173921082A</span>
      </div>
    </footer>
  )
}
