export default function HeroImage({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'block' }}>
      <style>{`
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes dw{0%,100%{r:2;opacity:0.4}50%{r:3;opacity:0.9}}
        @keyframes glow{0%,100%{opacity:0.5}50%{opacity:1}}
        #abd{animation:breathe 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}

        @keyframes pair1{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair2{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair3{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair4{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair5{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair6{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair7{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}
        @keyframes pair8{0%,35%,100%{transform:translateY(0)}55%,80%{transform:translateY(9px)}}

        #pair1{animation:pair1 3.2s ease-in-out infinite;      transform-box:fill-box;transform-origin:center}
        #pair2{animation:pair2 3.6s ease-in-out infinite 0.4s; transform-box:fill-box;transform-origin:center}
        #pair3{animation:pair3 3.4s ease-in-out infinite 0.8s; transform-box:fill-box;transform-origin:center}
        #pair4{animation:pair4 3.8s ease-in-out infinite 1.2s; transform-box:fill-box;transform-origin:center}
        #pair5{animation:pair5 3.2s ease-in-out infinite 0.2s; transform-box:fill-box;transform-origin:center}
        #pair6{animation:pair6 3.6s ease-in-out infinite 0.6s; transform-box:fill-box;transform-origin:center}
        #pair7{animation:pair7 3.4s ease-in-out infinite 1.0s; transform-box:fill-box;transform-origin:center}
        #pair8{animation:pair8 3.8s ease-in-out infinite 1.4s; transform-box:fill-box;transform-origin:center}

        .dw {animation:dw 2.2s ease-in-out infinite}
        .dw2{animation:dw 2.2s ease-in-out infinite 0.55s}
        .dw3{animation:dw 2.2s ease-in-out infinite 1.1s}
        .dw4{animation:dw 2.2s ease-in-out infinite 1.65s}
        .glw{animation:glow 2s ease-in-out infinite}
      `}</style>

      <defs>
        <mask id="imagine-text-gaps-693a64" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="680" height="680" fill="white" />
          <rect x="85.917" y="138.5" width="32.085" height="15.333" fill="black" rx="2" />
          <rect x="50" y="289.5" width="55.997" height="15.333" fill="black" rx="2" />
          <rect x="62" y="445.5" width="32.002" height="15.333" fill="black" rx="2" />
          <rect x="168" y="545.5" width="44" height="15.333" fill="black" rx="2" />
          <rect x="172" y="560.389" width="27.206" height="12.972" fill="black" rx="2" />
          <rect x="534" y="138.5" width="44" height="15.333" fill="black" rx="2" />
          <rect x="560" y="289.5" width="44.014" height="15.333" fill="black" rx="2" />
          <rect x="529.834" y="445.5" width="50.164" height="15.333" fill="black" rx="2" />
          <rect x="398" y="545.5" width="55.997" height="15.333" fill="black" rx="2" />
          <rect x="258" y="655.5" width="109.993" height="15.333" fill="black" rx="2" />
        </mask>
      </defs>

      {/* paper lines */}
      <line x1="0" y1="80" x2="680" y2="80" stroke="#e8e8e0" strokeWidth="0.4" />
      <line x1="0" y1="160" x2="680" y2="160" stroke="#e8e8e0" strokeWidth="0.4" />
      <line x1="0" y1="240" x2="680" y2="240" stroke="#e8e8e0" strokeWidth="0.4" />
      <line x1="0" y1="320" x2="680" y2="320" stroke="#e8e8e0" strokeWidth="0.4" />
      <line x1="0" y1="400" x2="680" y2="400" stroke="#e8e8e0" strokeWidth="0.4" />
      <line x1="0" y1="480" x2="680" y2="480" stroke="#e8e8e0" strokeWidth="0.4" />
      <line x1="0" y1="560" x2="680" y2="560" stroke="#e8e8e0" strokeWidth="0.4" mask="url(#imagine-text-gaps-693a64)" />
      <line x1="0" y1="640" x2="680" y2="640" stroke="#e8e8e0" strokeWidth="0.4" />

      {/* web spokes */}
      <line strokeWidth="1" x1="340" y1="330" x2="340" y2="55" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="482" y2="78" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="582" y2="180" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="620" y2="330" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="582" y2="480" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" mask="url(#imagine-text-gaps-693a64)" />
      <line strokeWidth="1" x1="340" y1="330" x2="480" y2="578" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="340" y2="605" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="200" y2="578" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" mask="url(#imagine-text-gaps-693a64)" />
      <line strokeWidth="1" x1="340" y1="330" x2="98" y2="480" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="60" y2="330" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="98" y2="180" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />
      <line strokeWidth="1" x1="340" y1="330" x2="198" y2="78" stroke="#2a2a2a" strokeLinecap="round" opacity="0.2" />

      {/* web rings */}
      <path strokeWidth="0.9" stroke="#2a2a2a" fill="none" strokeLinecap="round" opacity="0.2"
        d="M340,268 Q376,269 398,292 Q420,315 419,330 Q420,353 397,372 Q374,391 340,392 Q306,393 283,372 Q260,351 261,330 Q262,309 285,290 Q308,271 340,268Z" />
      <path strokeWidth="0.8" stroke="#2a2a2a" fill="none" strokeLinecap="round" opacity="0.2"
        d="M340,206 Q412,207 458,246 Q504,285 504,330 Q504,375 458,414 Q412,453 340,454 Q268,455 222,414 Q176,373 176,330 Q176,287 222,248 Q268,209 340,206Z" />
      <path strokeWidth="0.7" stroke="#2a2a2a" fill="none" strokeLinecap="round" opacity="0.2" mask="url(#imagine-text-gaps-693a64)"
        d="M340,144 Q448,145 518,200 Q588,255 588,330 Q588,405 518,460 Q448,515 340,516 Q232,517 162,460 Q92,403 92,330 Q92,257 162,202 Q232,147 340,144Z" />
      <path strokeWidth="0.6" stroke="#2a2a2a" fill="none" strokeLinecap="round" opacity="0.2" mask="url(#imagine-text-gaps-693a64)"
        d="M340,82 Q484,83 578,154 Q648,210 648,330 Q648,450 576,522 Q484,577 340,578 Q196,579 104,524 Q32,448 32,330 Q32,212 104,156 Q196,81 340,82Z" />

      {/* dew drops */}
      <circle className="dw" cx="340" cy="206" r="2" fill="#4e8565" />
      <circle className="dw2" cx="504" cy="330" r="2" fill="#4e8565" />
      <circle className="dw3" cx="340" cy="454" r="2" fill="#4e8565" />
      <circle className="dw4" cx="176" cy="330" r="2" fill="#4e8565" />
      <circle className="dw" cx="458" cy="246" r="1.8" fill="#4e8565" />
      <circle className="dw2" cx="222" cy="248" r="1.8" fill="#4e8565" />
      <circle className="dw3" cx="458" cy="414" r="1.8" fill="#4e8565" />
      <circle className="dw4" cx="222" cy="414" r="1.8" fill="#4e8565" />
      <circle className="dw" cx="412" cy="207" r="1.6" fill="#4e8565" />
      <circle className="dw2" cx="268" cy="209" r="1.6" fill="#4e8565" />

      {/* ── PAIR 1: ll1 + tg1 (plan) move together ── */}
      <g id="pair1">
        <g id="tg1">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="80" y="130" width="72" height="46" rx="4" />
          <text x="90" y="149" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>plan</text>
          <line x1="90" y1="155" x2="142" y2="155" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="90" y1="163" x2="134" y2="163" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="90" y1="171" x2="138" y2="171" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <circle className="glw" cx="144" cy="146" r="3.5" fill="#4e8565" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="141" y1="168" x2="128" y2="162" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="128" y1="162" x2="116" y2="153" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="ll1">
          <line strokeWidth="2.8" x1="328" y1="322" x2="295" y2="298" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="295" y1="298" x2="248" y2="260" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="248" y1="260" x2="214" y2="232" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="214" y1="232" x2="168" y2="194" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="168" y1="194" x2="152" y2="178" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="152" y1="178" x2="144" y2="172" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="144" y1="172" x2="138" y2="175" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="144" y1="172" x2="141" y2="165" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 2: ll2 + tg2 (research) ── */}
      <g id="pair2">
        <g id="tg2">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="44" y="282" width="82" height="48" rx="4" />
          <text x="54" y="300" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>research</text>
          <line x1="54" y1="307" x2="116" y2="307" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="54" y1="315" x2="108" y2="315" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="54" y1="323" x2="112" y2="323" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <circle className="glw" cx="116" cy="296" r="3.5" fill="#4e8565" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="118" y1="326" x2="126" y2="306" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="ll2">
          <line strokeWidth="2.8" x1="326" y1="330" x2="290" y2="320" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="290" y1="320" x2="248" y2="316" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="248" y1="316" x2="208" y2="314" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="208" y1="314" x2="166" y2="316" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="166" y1="316" x2="136" y2="320" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="136" y1="320" x2="122" y2="325" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="122" y1="325" x2="116" y2="332" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="122" y1="325" x2="114" y2="320" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 3: ll3 + tg3 (test) ── */}
      <g id="pair3">
        <g id="tg3">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="56" y="438" width="66" height="46" rx="4" />
          <text x="66" y="456" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>test</text>
          <rect fill="#4e8565" fillOpacity="0.14" stroke="#1a1a1a" strokeWidth="0.8" x="66" y="461" width="18" height="7" rx="2" />
          <rect fill="#4e8565" fillOpacity="0.28" stroke="#1a1a1a" strokeWidth="0.8" x="88" y="461" width="18" height="7" rx="2" />
          <line x1="66" y1="474" x2="112" y2="474" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="128" y1="466" x2="122" y2="484" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="ll3">
          <line strokeWidth="2.8" x1="325" y1="338" x2="294" y2="352" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="294" y1="352" x2="252" y2="376" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="252" y1="376" x2="212" y2="404" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="212" y1="404" x2="172" y2="432" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="172" y1="432" x2="144" y2="454" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="144" y1="454" x2="132" y2="464" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="132" y1="464" x2="126" y2="472" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="132" y1="464" x2="124" y2="458" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 4: ll4 + tg4 (deploy) ── */}
      <g id="pair4">
        <g id="tg4">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="162" y="538" width="76" height="46" rx="4" />
          <text x="172" y="556" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>deploy</text>
          <rect fill="#4e8565" fillOpacity="0.18" stroke="#1a1a1a" strokeWidth="1" x="172" y="561" width="56" height="10" rx="3" />
          <text x="176" y="569" style={{ fontFamily: 'Courier New,monospace', fontSize: '8px', fontWeight: 700, fill: '#4e8565' }}>PUSH</text>
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="228" y1="543" x2="238" y2="538" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="ll4">
          <line strokeWidth="2.8" x1="326" y1="346" x2="304" y2="368" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="304" y1="368" x2="278" y2="400" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="278" y1="400" x2="258" y2="436" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="258" y1="436" x2="244" y2="470" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="244" y1="470" x2="236" y2="502" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="236" y1="502" x2="232" y2="528" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="232" y1="528" x2="230" y2="540" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="230" y1="540" x2="224" y2="546" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="230" y1="540" x2="236" y2="548" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 5: rl1 + tg5 (design) ── */}
      <g id="pair5">
        <g id="tg5">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="528" y="130" width="72" height="46" rx="4" />
          <text x="538" y="149" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>design</text>
          <line x1="538" y1="155" x2="590" y2="155" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="538" y1="163" x2="582" y2="163" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="538" y1="171" x2="586" y2="171" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <circle className="glw" cx="592" cy="149" r="3.5" fill="#4e8565" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="538" y1="168" x2="552" y2="153" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="552" y1="153" x2="562" y2="153" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="rl1">
          <line strokeWidth="2.8" x1="352" y1="322" x2="385" y2="298" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="385" y1="298" x2="432" y2="260" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="432" y1="260" x2="466" y2="232" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="466" y1="232" x2="512" y2="194" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="512" y1="194" x2="528" y2="178" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="528" y1="178" x2="536" y2="172" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="536" y1="172" x2="542" y2="175" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="536" y1="172" x2="539" y2="165" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 6: rl2 + tg6 (review) ── */}
      <g id="pair6">
        <g id="tg6">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="554" y="282" width="78" height="48" rx="4" />
          <text x="564" y="300" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>review</text>
          <line x1="564" y1="307" x2="622" y2="307" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="564" y1="315" x2="614" y2="315" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="564" y1="323" x2="618" y2="323" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <circle className="glw" cx="622" cy="296" r="3.5" fill="#4e8565" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="562" y1="326" x2="554" y2="306" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="rl2">
          <line strokeWidth="2.8" x1="354" y1="330" x2="390" y2="320" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="390" y1="320" x2="432" y2="316" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="432" y1="316" x2="472" y2="314" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="472" y1="314" x2="514" y2="316" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="514" y1="316" x2="544" y2="320" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="544" y1="320" x2="558" y2="325" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="558" y1="325" x2="564" y2="332" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="558" y1="325" x2="566" y2="320" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 7: rl3 + tg7 (monitor) ── */}
      <g id="pair7">
        <g id="tg7">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="524" y="438" width="82" height="46" rx="4" />
          <text x="534" y="456" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>monitor</text>
          <path strokeWidth="1.2" fill="none" stroke="#4e8565" strokeLinecap="round" strokeLinejoin="round"
            d="M534,468 Q544,458 554,464 Q564,470 574,458 Q580,452 588,460" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="552" y1="466" x2="558" y2="484" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="rl3">
          <line strokeWidth="2.8" x1="355" y1="338" x2="386" y2="352" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="386" y1="352" x2="428" y2="376" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="428" y1="376" x2="468" y2="404" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="468" y1="404" x2="508" y2="432" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="508" y1="432" x2="536" y2="454" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="536" y1="454" x2="548" y2="464" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="548" y1="464" x2="554" y2="472" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="548" y1="464" x2="556" y2="458" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── PAIR 8: rl4 + tg8 (document) ── */}
      <g id="pair8">
        <g id="tg8">
          <rect fill="#fafaf6" stroke="#1a1a1a" strokeWidth="1.4" x="392" y="538" width="88" height="46" rx="4" />
          <text x="402" y="556" style={{ fontFamily: 'Courier New,monospace', fontSize: '10px', fontWeight: 700, fill: '#1a1a1a' }}>document</text>
          <line x1="402" y1="562" x2="470" y2="562" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="402" y1="570" x2="462" y2="570" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line x1="402" y1="578" x2="466" y2="578" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
        </g>
        <line strokeWidth="0.9" strokeDasharray="5,4" x1="452" y1="543" x2="454" y2="538" stroke="#4e8565" strokeLinecap="round" opacity="0.55" />
        <g id="rl4">
          <line strokeWidth="2.8" x1="354" y1="346" x2="376" y2="368" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.4" x1="376" y1="368" x2="402" y2="400" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="2.0" x1="402" y1="400" x2="422" y2="436" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.6" x1="422" y1="436" x2="436" y2="470" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.2" x1="436" y1="470" x2="444" y2="502" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="1.0" x1="444" y1="502" x2="448" y2="528" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="448" y1="528" x2="450" y2="540" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="450" y1="540" x2="456" y2="546" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
          <line strokeWidth="0.9" x1="450" y1="540" x2="444" y2="548" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* ── BODY — only torso, legs are in pairs above ── */}
      <g id="spider-body">
        <g id="abd">
          <ellipse fill="#f0f0eb" stroke="#1a1a1a" strokeWidth="2.2" cx="340" cy="355" rx="30" ry="38" />
          <line strokeWidth="0.8" x1="320" y1="332" x2="360" y2="332" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line strokeWidth="0.8" x1="316" y1="342" x2="364" y2="342" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line strokeWidth="0.8" x1="313" y1="352" x2="367" y2="352" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line strokeWidth="0.8" x1="312" y1="362" x2="368" y2="362" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line strokeWidth="0.8" x1="313" y1="372" x2="367" y2="372" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <line strokeWidth="0.8" x1="316" y1="382" x2="364" y2="382" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
          <path fill="#4e8565" fillOpacity="0.2" stroke="#4e8565" strokeWidth="1.2" d="M333,344 Q340,337 347,344 Q340,351 333,344Z" />
          <path fill="#4e8565" fillOpacity="0.2" stroke="#4e8565" strokeWidth="1.2" d="M333,368 Q340,361 347,368 Q340,375 333,368Z" />
          <line strokeWidth="0.9" x1="340" y1="322" x2="340" y2="390" stroke="#4e8565" strokeLinecap="round" opacity="0.3" />
        </g>
        <ellipse fill="#e8e8e3" stroke="#1a1a1a" strokeWidth="2" cx="340" cy="320" rx="22" ry="17" />
        <line strokeWidth="0.7" x1="323" y1="315" x2="357" y2="315" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
        <line strokeWidth="0.7" x1="321" y1="322" x2="359" y2="322" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
        <line strokeWidth="0.7" x1="323" y1="329" x2="357" y2="329" stroke="#1a1a1a" strokeLinecap="round" opacity="0.18" />
        <path strokeWidth="0.9" fill="none" stroke="#1a1a1a" strokeLinecap="round" d="M340,308 Q338,318 340,332" opacity="0.28" />
        <ellipse fill="#ddddd8" stroke="#1a1a1a" strokeWidth="1.4" cx="335" cy="392" rx="5" ry="4" />
        <ellipse fill="#ddddd8" stroke="#1a1a1a" strokeWidth="1.4" cx="345" cy="392" rx="5" ry="4" />
        <line strokeWidth="1.2" strokeDasharray="4,3" x1="340" y1="396" x2="340" y2="430" stroke="#4e8565" strokeLinecap="round" opacity="0.65" />
      </g>

      <text style={{ fontFamily: "'Courier New',monospace", fontSize: '10px', fill: '#4e8565' }} x="262" y="666">agent Spider v2.0</text>
    </svg>
  );
}