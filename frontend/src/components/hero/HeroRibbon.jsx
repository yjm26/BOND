/**
 * Monochrome Stripe-like ribbon field — right side only.
 * Black body + moving specular highlights so the spin reads clearly.
 */
export default function HeroRibbon() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[min(56vw,720px)] overflow-hidden lg:block"
      aria-hidden="true"
    >
      <div className="bond-hero-ribbon absolute -right-[18%] top-1/2 h-[135%] w-[135%] -translate-y-1/2">
        <svg
          className="h-full w-full"
          viewBox="0 0 800 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Graphite body */}
            <linearGradient id="bondMonoBody" x1="80" y1="40" x2="720" y2="860" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="35%" stopColor="#0a0a0a" />
              <stop offset="70%" stopColor="#141414" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="bondMonoBody2" x1="700" y1="100" x2="120" y2="800" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#222222" />
              <stop offset="45%" stopColor="#0c0c0c" />
              <stop offset="100%" stopColor="#1c1c1c" />
            </linearGradient>

            {/* Specular sweep — the “highlight” that sells the spin */}
            <linearGradient id="bondMonoSheen" x1="0" y1="0" x2="800" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="38%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0.42" />
              <stop offset="58%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bondMonoEdge" x1="200" y1="100" x2="600" y2="780" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <filter id="bondMonoBlur" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
            <filter id="bondMonoSoft" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="bondMonoTight" x="-8%" y="-8%" width="116%" height="116%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
          </defs>

          <g className="bond-hero-ribbon-spin">
            {/* Wide soft plate */}
            <path
              d="M620 -80
                 C480 40 400 160 360 300
                 C310 480 380 600 500 700
                 C640 820 720 920 680 1040
                 C560 940 340 900 180 780
                 C20 660 -20 480 40 300
                 C100 120 260 20 440 -40
                 C520 -70 580 -90 620 -80Z"
              fill="url(#bondMonoBody)"
              filter="url(#bondMonoBlur)"
              opacity="0.92"
            />

            {/* Mid ribbon sheet — longer S curve, closer to Stripe cloth */}
            <path
              d="M680 20
                 C560 120 500 220 470 340
                 C430 500 500 610 600 700
                 C690 780 760 870 740 1000
                 C660 930 500 900 360 820
                 C200 720 120 560 150 400
                 C180 250 320 150 480 80
                 C560 45 630 25 680 20Z"
              fill="url(#bondMonoBody2)"
              filter="url(#bondMonoSoft)"
              opacity="0.96"
            />

            {/* Inner hard ribbon band */}
            <path
              d="M640 120
                 C560 190 520 270 500 360
                 C475 490 535 575 615 640
                 C685 695 735 770 720 870
                 C670 820 575 800 480 760
                 C360 705 300 610 315 500
                 C330 390 420 310 520 250
                 C580 215 620 160 640 120Z"
              fill="#0a0a0a"
              filter="url(#bondMonoTight)"
              opacity="0.9"
            />

            {/* Moving sheen layers */}
            <g className="bond-hero-ribbon-sheen">
              <path
                d="M680 20
                   C560 120 500 220 470 340
                   C430 500 500 610 600 700
                   C690 780 760 870 740 1000
                   C660 930 500 900 360 820
                   C200 720 120 560 150 400
                   C180 250 320 150 480 80
                   C560 45 630 25 680 20Z"
                fill="url(#bondMonoSheen)"
                opacity="0.85"
              />
              <path
                d="M640 120
                   C560 190 520 270 500 360
                   C475 490 535 575 615 640
                   C685 695 735 770 720 870
                   C670 820 575 800 480 760
                   C360 705 300 610 315 500
                   C330 390 420 310 520 250
                   C580 215 620 160 640 120Z"
                fill="url(#bondMonoEdge)"
                opacity="0.75"
              />
              {/* thin highlight ridge */}
              <path
                d="M560 160 C520 250 500 340 495 430 C490 540 540 620 610 680"
                stroke="url(#bondMonoEdge)"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.55"
                filter="url(#bondMonoSoft)"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Keep left column clean — wash only the seam, not the whole hero */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fafafa] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fafafa] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#fafafa]/90 to-transparent" />
    </div>
  )
}
