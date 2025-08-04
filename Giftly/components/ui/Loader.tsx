import React from "react";

export function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[180px]">
      <svg
        width="130"
        height="90"
        viewBox="0 0 130 90"
        fill="none"
        className="loader-multigift"
        aria-label="loader showing animated moving gift boxes"
        role="img"
      >
        {/* Soft shadow */}
        <ellipse
          cx="65"
          cy="83"
          rx="49"
          ry="7.5"
          fill="#e0e0e0"
          opacity="0.45"
          className="loader-shadow"
        />

        {/* Main gift box */}
        <g className="gift-main">
          <rect
            x="53"
            y="38"
            width="24"
            height="22"
            rx="5"
            fill="url(#boxBlue)"
          />
          <rect x="63" y="38" width="4" height="22" fill="url(#ribbonGold)" />
          <rect
            x="53"
            y="44"
            width="24"
            height="6"
            fill="url(#ribbonGold)"
            opacity="0.95"
          />
          {/* Ribbon bows */}
          <path
            d="M65 38 Q60.5 20 55 38"
            fill="url(#ribbonGold)"
            opacity="0.87"
          />
          <path
            d="M65 38 Q69.5 20 75 38"
            fill="url(#ribbonGold)"
            opacity="0.87"
          />
        </g>

        {/* Side gift box 1 */}
        <g className="gift-side gift1">
          <rect
            x="19"
            y="52"
            width="15"
            height="13"
            rx="3.5"
            fill="url(#boxRed)"
          />
          <rect x="26" y="52" width="2" height="13" fill="url(#ribbonWhite)" />
          <rect
            x="19"
            y="56.5"
            width="15"
            height="2"
            fill="url(#ribbonWhite)"
          />
          <path
            d="M26.5 52 Q23 42 20 52"
            fill="url(#ribbonWhite)"
            opacity="0.8"
          />
          <path
            d="M26.5 52 Q30 42 33 52"
            fill="url(#ribbonWhite)"
            opacity="0.8"
          />
        </g>

        {/* Side gift box 2 */}
        <g className="gift-side gift2">
          <rect
            x="97"
            y="56"
            width="11.5"
            height="11.5"
            rx="3"
            fill="url(#boxPurple)"
          />
          <rect
            x="102.5"
            y="56"
            width="2"
            height="11.5"
            fill="url(#ribbonWhitePink)"
          />
          <rect
            x="97"
            y="61"
            width="11.5"
            height="2"
            fill="url(#ribbonWhitePink)"
          />
          <path
            d="M103.5 56 Q101 50 100 56"
            fill="url(#ribbonWhitePink)"
            opacity="0.8"
          />
          <path
            d="M103.5 56 Q106 50 108 56"
            fill="url(#ribbonWhitePink)"
            opacity="0.8"
          />
        </g>

        {/* Sparkles */}
        {[ [39, 27], [87, 24], [74, 72] ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={1 + 0.25 * i}
            fill={["#fbbf24", "#a3e635", "#f472b"] [i % 3]}
            className="sparkle"
            style={{ animationDelay: `${i * 0.8}s` }}
          />
        ))}

        <defs>
          <linearGradient id="boxBlue" x1="53" y1="49" x2="77" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="1" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="ribbonGold" x1="65" y1="38" x2="65" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e42" />
          </linearGradient>
          <linearGradient id="boxRed" x1="19" y1="58" x2="34" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fca5a5" />
            <stop offset="1" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="ribbonWhite" x1="26" y1="52" x2="26" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#f3f3f3" />
          </linearGradient>
          <linearGradient id="boxPurple" x1="97" y1="61" x2="109" y2="67" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7138f8" />
          </linearGradient>
          <linearGradient id="ribbonWhitePink" x1="103" y1="56" x2="103" y2="67" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fce7f3" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx>{`
        .loader-multigift {
          animation: loader-rise 1.6s cubic-bezier(0.55, 0, 0.45, 1) infinite;
        }

        .gift-main {
          animation: mainGiftMove 2s ease-in-out infinite;
        }

        .gift-side.gift1 {
          animation: sideGift1Move 2.2s ease-in-out infinite alternate;
        }

        .gift-side.gift2 {
          animation: sideGift2Move 2.2s ease-in-out infinite alternate;
          animation-delay: 1s;
        }

        .loader-shadow {
          animation: shadowScale 1.6s ease-in-out infinite;
        }

        .sparkle {
          opacity: 0;
          animation: sparkleFade 3s linear infinite;
        }

        @keyframes loader-rise {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes mainGiftMove {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-14px) scale(1.03);
          }
        }

        @keyframes sideGift1Move {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }

        @keyframes sideGift2Move {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.03);
          }
        }

        @keyframes shadowScale {
          0%, 100% {
            rx: 49;
            ry: 7.5;
            opacity: 0.45;
          }
          50% {
            rx: 40;
            ry: 6;
            opacity: 0.2;
          }
        }

        @keyframes sparkleFade {
          0%, 70%, 100% {
            opacity: 0;
          }
          10%, 30% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}

