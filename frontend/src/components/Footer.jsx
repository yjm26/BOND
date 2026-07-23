import { Link } from 'react-router-dom'

const PRODUCT_LINKS = [
  { label: 'Create room', to: '/create' },
  { label: 'Market', to: '/market' },
  { label: 'Docs', to: '/docs' },
]

const RESOURCE_LINKS = [
  { label: 'GitHub', href: 'https://github.com/yjm26/arc-escrow-agent' },
  { label: 'Contract', href: 'https://testnet.arcscan.app/address/0xADf4c67c0D8b2900fA045B1BDbA5d54c803688E5' },
]

export default function Footer() {
  return (
    <footer className="bg-[#20201f] px-6 py-14 text-[#ede9df] sm:px-10 lg:px-14">
      <div className="grid gap-12 border-t border-[#ede9df]/14 pt-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-[#ede9df]/18 bg-[#ede9df] font-mono text-[13px] font-semibold text-[#20201f]">
              B
            </span>
            <span>
              <span className="block text-[15px] font-medium tracking-[-0.02em]">BOND</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-[#ede9df]/44">Arc settlement rooms</span>
            </span>
          </Link>

          <p className="mt-8 max-w-[520px] text-[15px] leading-[1.7] tracking-[-0.01em] text-[#b9b2a5]">
            Private escrow rooms for risky digital work and marketplace deals. Lock USDC on Arc, attach proof, and settle with release, refund, or arbitration.
          </p>

          <div className="mt-8 max-w-[560px] border border-[#d8b15f]/22 bg-[#d8b15f]/[0.07] px-4 py-3 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.16em] text-[#d8b15f]/82">
            Arc Testnet — testing environment only. Do not use production funds.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-2">
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#ede9df]/38">Product</div>
            <div className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <Link key={link.label} to={link.to} className="block text-[14px] text-[#ede9df]/72 transition hover:text-[#ede9df]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#ede9df]/38">Resources</div>
            <div className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block text-[14px] text-[#ede9df]/72 transition hover:text-[#ede9df]">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-[#ede9df]/10 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede9df]/34 sm:flex-row sm:items-center sm:justify-between">
        <span>© BOND / Arc Testnet</span>
        <span>0xADf4c67c0D8b2900fA045B1BDbA5d54c803688E5</span>
      </div>
    </footer>
  )
}
