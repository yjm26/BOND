/**
 * Right-half mono ribbon field — large, full-bleed, Stripe-scale.
 * Black body + moving highlights. Desktop primary; softer on mobile.
 */
export default function HeroRibbon() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Desktop / large: own the right half */}
      <div className="bond-hero-stage absolute inset-y-[-8%] right-[-6%] hidden w-[68%] md:block lg:w-[62%] xl:right-[-4%] xl:w-[58%]">
        <div className="bond-hero-ribbon absolute inset-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 1000 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="monoPlate" x1="120" y1="0" x2="900" y2="1000" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="28%" stopColor="#111111" />
                <stop offset="55%" stopColor="#050505" />
                <stop offset="78%" stopColor="#171717" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </linearGradient>
              <linearGradient id="monoFold" x1="900" y1="80" x2="80" y2="920" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1f1f1f" />
                <stop offset="40%" stopColor="#080808" />
                <stop offset="100%" stopColor="#242424" />
              </linearGradient>
              <linearGradient id="monoSheen" x1="0" y1="200" x2="1000" y2="800" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="42%" stopColor="#fff" stopOpacity="0.03" />
                <stop offset="50%" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="58%" stopColor="#fff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="monoRim" x1="200" y1="100" x2="820" y2="900" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="45%" stopColor="#fff" stopOpacity="0.18" />
                <stop offset="52%" stopColor="#fff" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#fff" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <filter id="softWide" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="28" />
              </filter>
              <filter id="softMid" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <filter id="softTight" x="-12%" y="-12%" width="124%" height="124%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            <g className="bond-hero-ribbon-spin">
              {/* Back volume */}
              <path
                d="M780 -120
                   C560 40 430 200 390 380
                   C340 620 470 760 650 860
                   C820 960 940 1080 900 1220
                   C720 1080 420 1040 200 880
                   C-20 720 -80 460 40 240
                   C160 40 380 -60 600 -120
                   C680 -140 740 -140 780 -120Z"
                fill="url(#monoPlate)"
                filter="url(#softWide)"
                opacity="0.95"
              />

              {/* Main cloth fold — long diagonal ribbon */}
              <path
                d="M860 40
                   C680 160 580 300 540 460
                   C490 680 610 820 780 920
                   C920 1000 1020 1120 980 1260
                   C820 1140 560 1100 340 960
                   C120 820 40 580 100 360
                   C160 160 360 40 580 -20
                   C700 -50 800 0 860 40Z"
                fill="url(#monoFold)"
                filter="url(#softMid)"
                opacity="0.98"
              />

              {/* Fore band */}
              <path
                d="M780 160
                   C640 260 580 380 560 500
                   C530 680 640 800 780 880
                   C900 940 980 1040 960 1160
                   C860 1070 700 1040 560 980
                   C380 900 300 760 320 620
                   C340 480 460 380 600 300
                   C690 250 750 200 780 160Z"
                fill="#050505"
                filter="url(#softTight)"
                opacity="0.92"
              />

              {/* Specular layers — motion reads from these */}
              <g className="bond-hero-ribbon-sheen">
                <path
                  d="M860 40
                     C680 160 580 300 540 460
                     C490 680 610 820 780 920
                     C920 1000 1020 1120 980 1260
                     C820 1140 560 1100 340 960
                     C120 820 40 580 100 360
                     C160 160 360 40 580 -20
                     C700 -50 800 0 860 40Z"
                  fill="url(#monoSheen)"
                />
                <path
                  d="M780 160
                     C640 260 580 380 560 500
                     C530 680 640 800 780 880
                     C900 940 980 1040 960 1160
                     C860 1070 700 1040 560 980
                     C380 900 300 760 320 620
                     C340 480 460 380 600 300
                     C690 250 750 200 780 160Z"
                  fill="url(#monoRim)"
                  opacity="0.85"
                />
                <path
                  d="M640 220 C560 340 530 470 540 600 C555 760 660 860 780 920"
                  stroke="url(#monoRim)"
                  strokeWidth="26"
                  strokeLinecap="round"
                  filter="url(#softMid)"
                  opacity="0.65"
                />
                <path
                  d="M720 140 C620 280 580 430 590 580 C605 740 720 850 860 910"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.28"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Mobile: compact ribbon corner so it doesn't crush type */}
      <div className="bond-hero-stage absolute -right-8 top-10 h-[340px] w-[70%] opacity-70 md:hidden">
        <div className="bond-hero-ribbon absolute inset-0">
          <div className="bond-hero-ribbon-spin h-full w-full rounded-[40%] bg-[radial-gradient(ellipse_at_30%_40%,#2a2a2a_0%,#0a0a0a_42%,#050505_70%,transparent_78%)] blur-2xl" />
          <div className="bond-hero-ribbon-sheen absolute inset-[12%] rounded-[46%] bg-[linear-gradient(125deg,transparent_30%,rgba(255,255,255,0.35)_48%,transparent_62%)] opacity-70 blur-md" />
        </div>
      </div>

      {/* Seam into paper — only a soft edge, not a full-center wash */}
      <div className="absolute inset-y-0 left-[32%] hidden w-[18%] bg-gradient-to-r from-[#fafafa] via-[#fafafa]/70 to-transparent md:block lg:left-[36%]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fafafa] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fafafa] via-[#fafafa]/80 to-transparent" />
    </div>
  )
}
