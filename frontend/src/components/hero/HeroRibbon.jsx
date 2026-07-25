/**
 * Soft Stripe-like gradient ribbon for landing hero only.
 * Pure CSS/SVG — no wallet, no app chrome.
 */
export default function HeroRibbon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full overflow-hidden lg:w-[58%]" aria-hidden="true">
      <div className="bond-hero-ribbon absolute -right-[8%] top-[-12%] h-[140%] w-[120%] lg:-right-[4%] lg:w-[110%]">
        <svg className="h-full w-full" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bondRibbonA" x1="120" y1="80" x2="780" y2="820" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="22%" stopColor="#818cf8" />
              <stop offset="48%" stopColor="#e879f9" />
              <stop offset="72%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="bondRibbonB" x1="80" y1="700" x2="820" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#f472b6" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.88" />
            </linearGradient>
            <filter id="bondRibbonBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <filter id="bondRibbonSoft" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <g className="bond-hero-ribbon-spin" style={{ transformOrigin: '460px 420px' }}>
            <path
              d="M760 -40 C620 80 560 180 520 300 C470 460 540 560 640 640 C760 740 820 820 780 980 C700 900 520 860 380 780 C220 680 140 540 160 380 C180 220 300 120 460 40 C580 -20 700 -60 760 -40Z"
              fill="url(#bondRibbonA)"
              filter="url(#bondRibbonBlur)"
              opacity="0.88"
            />
            <path
              d="M820 40 C700 140 640 230 600 340 C550 490 610 590 700 670 C790 740 860 820 840 960 C760 900 600 870 470 800 C300 710 210 560 230 400 C250 250 380 150 540 80 C650 35 760 10 820 40Z"
              fill="url(#bondRibbonB)"
              filter="url(#bondRibbonSoft)"
              opacity="0.78"
            />
            <path
              d="M700 120 C620 200 580 280 560 370 C530 500 590 580 670 640 C740 690 790 760 770 860 C720 820 620 800 520 760 C390 700 320 600 330 480 C340 360 430 280 540 220 C620 180 670 150 700 120Z"
              fill="url(#bondRibbonA)"
              opacity="0.55"
            />
          </g>
        </svg>
      </div>

      {/* soft white wash so copy stays readable on the left */}
      <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#fafafa] via-[#fafafa]/88 to-transparent lg:w-[28%]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fafafa] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#fafafa]/80 to-transparent" />
    </div>
  )
}
