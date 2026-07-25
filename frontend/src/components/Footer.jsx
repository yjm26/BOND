import { Link } from 'react-router-dom'

const PRODUCT_LINKS = [
  { label: 'Create room', to: '/create' },
  { label: 'Market', to: '/market' },
  { label: 'Docs', to: '/docs' },
  { label: 'App', to: '/app' },
]

const RESOURCE_LINKS = [
  { label: 'GitHub', href: 'https://github.com/yjm26/BOND' },
  { label: 'Contract', href: 'https://testnet.arcscan.app/address/0x1A3ea0d24ff15a90417508F38ABD8E173921082A' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#fafafa]/10 bg-[#0a0a0a] px-6 py-12 text-[#fafafa] sm:px-10 sm:py-14 lg:px-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-9 w-11 items-center justify-center border border-[#fafafa]/12 bg-[#111111]">
                <img src="/brand/bond-logo-white.png" alt="BOND" className="w-9 object-contain" draggable="false" />
              </span>
              <span>
                <span className="block text-[15px] font-medium tracking-[-0.02em]">BOND</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#fafafa]/40">
                  Build on Arc
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-[360px] text-[14px] leading-[1.55] tracking-[-0.01em] text-[#a3a3a3]">
              Escrow rooms and a market for deals that need locked USDC and a clear exit.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/35">Product</div>
              <div className="space-y-3">
                {PRODUCT_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-[14px] text-[#fafafa]/70 transition duration-160 ease-out hover:text-[#fafafa]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/35">Resources</div>
              <div className="space-y-3">
                {RESOURCE_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[14px] text-[#fafafa]/70 transition duration-160 ease-out hover:text-[#fafafa]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#fafafa]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/35">
            © BOND · Build on Arc
          </span>
          <a
            href="https://testnet.arcscan.app/address/0x1A3ea0d24ff15a90417508F38ABD8E173921082A"
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-full truncate font-mono text-[10px] tracking-[0.04em] text-[#fafafa]/35 transition hover:text-[#fafafa]/60"
          >
            0x1A3e…082A
          </a>
        </div>
      </div>
    </footer>
  )
}
