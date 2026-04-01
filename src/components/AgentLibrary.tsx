export default function AgentLibrary({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 680 920" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'block' }}>
      <style>{`
        .p{stroke:#1a1a1a;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .pf{stroke:#1a1a1a;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .h{stroke:#1a1a1a;fill:none;stroke-linecap:round;opacity:0.15}
        .g{stroke:#4e8565;fill:none;stroke-linecap:round;stroke-linejoin:round}
        .gf{fill:#4e8565;stroke:#4e8565;stroke-linecap:round}
        .sk{font-family:'Courier New',monospace;font-size:8px;font-weight:700;fill:#1a1a1a}
        .sk2{font-family:'Courier New',monospace;font-size:7px;fill:#4e8565}
        .sk3{font-family:'Courier New',monospace;font-size:9px;font-weight:700;fill:#4e8565}
        .sig{font-family:'Courier New',monospace;font-size:10px;fill:#4e8565}

        @keyframes glow{0%,100%{opacity:0.35}50%{opacity:1}}
        @keyframes antpulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
        @keyframes blink{0%,88%,100%{transform:scaleY(1)}92%,95%{transform:scaleY(0.08)}}
        @keyframes desklamp{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes spindle{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes float1{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes float3{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
        @keyframes meshpulse{0%,100%{opacity:0.2}50%{opacity:0.5}}

        .glw{animation:glow 2.5s ease-in-out infinite}
        .ant{animation:antpulse 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .ant2{animation:antpulse 2.2s ease-in-out infinite 0.7s;transform-box:fill-box;transform-origin:center}
        .ant3{animation:antpulse 2.2s ease-in-out infinite 1.4s;transform-box:fill-box;transform-origin:center}
        #lamp-glow{animation:desklamp 2s ease-in-out infinite}
        .eye-l{animation:blink 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .eye-r{animation:blink 4s ease-in-out infinite 0.15s;transform-box:fill-box;transform-origin:center}
        #spindle-g{animation:spindle 9s linear infinite;transform-box:fill-box;transform-origin:340px 128px}
        #mesh-a{animation:meshpulse 3s ease-in-out infinite}
        #mesh-b{animation:meshpulse 3s ease-in-out infinite 1s}

        #sa1{animation:float1 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        #sa2{animation:float2 3.8s ease-in-out infinite 0.4s;transform-box:fill-box;transform-origin:center}
        #sa3{animation:float3 3.5s ease-in-out infinite 0.8s;transform-box:fill-box;transform-origin:center}
        #sa4{animation:float1 4.0s ease-in-out infinite 1.2s;transform-box:fill-box;transform-origin:center}
        #sa5{animation:float2 3.3s ease-in-out infinite 0.2s;transform-box:fill-box;transform-origin:center}
        #sa6{animation:float3 3.7s ease-in-out infinite 0.6s;transform-box:fill-box;transform-origin:center}
        #sa7{animation:float1 3.6s ease-in-out infinite 1.0s;transform-box:fill-box;transform-origin:center}
        #sa8{animation:float2 4.1s ease-in-out infinite 1.4s;transform-box:fill-box;transform-origin:center}
        #sa9{animation:float3 3.4s ease-in-out infinite 0.3s;transform-box:fill-box;transform-origin:center}
        #sa10{animation:float1 3.9s ease-in-out infinite 0.9s;transform-box:fill-box;transform-origin:center}
        #sa11{animation:float2 3.1s ease-in-out infinite 1.1s;transform-box:fill-box;transform-origin:center}
        #sa12{animation:float3 3.6s ease-in-out infinite 0.5s;transform-box:fill-box;transform-origin:center}
        #sa13{animation:float1 3.3s ease-in-out infinite 0.7s;transform-box:fill-box;transform-origin:center}
        #sa14{animation:float2 3.8s ease-in-out infinite 1.3s;transform-box:fill-box;transform-origin:center}
        #sa15{animation:float3 4.0s ease-in-out infinite 0.1s;transform-box:fill-box;transform-origin:center}
        #sa16{animation:float1 3.5s ease-in-out infinite 0.8s;transform-box:fill-box;transform-origin:center}
        #sa17{animation:float2 3.2s ease-in-out infinite 1.5s;transform-box:fill-box;transform-origin:center}
        #sa18{animation:float3 3.7s ease-in-out infinite 0.4s;transform-box:fill-box;transform-origin:center}
      `}</style>

      {/* paper lines */}
      {[80,160,240,320,400,480,560,640,720,800,880].map(y => (
        <line key={y} x1="0" y1={y} x2="680" y2={y} stroke="#e8e8e0" strokeWidth="0.4"/>
      ))}

      {/* ── BUILDING SHELL ── */}
      <rect className="pf" fill="none" strokeWidth="2" x="30" y="52" width="620" height="760" rx="4"/>
      {[80,108,136].map(y => <line key={y} className="h" strokeWidth="0.5" x1="30" y1={y} x2="650" y2={y}/>)}

      {/* arch window — white background */}
      <path className="pf" style={{fill:'#ffffff'}} strokeWidth="2"
        d="M260,52 Q340,10 420,52 L420,108 L260,108 Z"/>
      {[290,340,390].map(x => <line key={x} className="h" x1={x} y1="12" x2={x === 340 ? 340 : x} y2="108"/>)}
      <line className="p" strokeWidth="1.2" x1="340" y1="52" x2="340" y2="108"/>
      <line className="p" strokeWidth="1.2" x1="270" y1="80" x2="410" y2="80"/>
      <text x="340" y="70" textAnchor="middle" className="sk3" style={{fontSize:'11px'}}>AGENT LIBRARY</text>
      <text x="340" y="84" textAnchor="middle" className="sk2" style={{fontSize:'7px'}}>v1.0  //  open stack  //  always on</text>

      {/* floor */}
      <rect className="pf" fill="none" strokeWidth="1.5" x="30" y="750" width="620" height="62" rx="2"/>
      {[762,774,786].map(y => <line key={y} className="h" x1="30" y1={y} x2="650" y2={y}/>)}
      <line className="g" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.35" x1="60" y1="756" x2="620" y2="756"/>
      <circle className="ant"  cx="120" cy="756" r="2.5" fill="#4e8565" stroke="#4e8565"/>
      <circle className="ant2" cx="340" cy="756" r="2.5" fill="#4e8565" stroke="#4e8565"/>
      <circle className="ant3" cx="560" cy="756" r="2.5" fill="#4e8565" stroke="#4e8565"/>
      <text x="148" y="769" className="sk2" style={{fontSize:'6px'}}>agent bus  //  event stream  //  tool registry</text>

      {/* ── THREE BOOKSHELF UNITS ── */}
      {/* Left: OPS */}
      <rect className="pf" fill="#f5f5f0" strokeWidth="2" x="42" y="130" width="130" height="580" rx="3"/>
      {[252,374,496,618].map(y=><line key={y} className="p" strokeWidth="1.8" x1="42" y1={y} x2="172" y2={y}/>)}
      {[145,160].map(y=><line key={y} className="h" x1="48" y1={y} x2="166" y2={y}/>)}
      <rect className="gf" fillOpacity="0.12" strokeWidth="1" x="54" y="134" width="90" height="12" rx="2"/>
      <text x="99" y="143" textAnchor="middle" className="sk3" style={{fontSize:'7px'}}>OPS AGENTS</text>

      {/* Centre: DATA */}
      <rect className="pf" fill="#f5f5f0" strokeWidth="2" x="275" y="130" width="130" height="580" rx="3"/>
      {[252,374,496,618].map(y=><line key={y} className="p" strokeWidth="1.8" x1="275" y1={y} x2="405" y2={y}/>)}
      {[145,160].map(y=><line key={y} className="h" x1="281" y1={y} x2="399" y2={y}/>)}
      <rect className="gf" fillOpacity="0.12" strokeWidth="1" x="290" y="134" width="80" height="12" rx="2"/>
      <text x="330" y="143" textAnchor="middle" className="sk3" style={{fontSize:'7px'}}>DATA AGENTS</text>

      {/* Right: CREATIVE */}
      <rect className="pf" fill="#f5f5f0" strokeWidth="2" x="508" y="130" width="130" height="580" rx="3"/>
      {[252,374,496,618].map(y=><line key={y} className="p" strokeWidth="1.8" x1="508" y1={y} x2="638" y2={y}/>)}
      {[145,160].map(y=><line key={y} className="h" x1="514" y1={y} x2="632" y2={y}/>)}
      <rect className="gf" fillOpacity="0.12" strokeWidth="1" x="516" y="134" width="98" height="12" rx="2"/>
      <text x="565" y="143" textAnchor="middle" className="sk3" style={{fontSize:'7px'}}>CREATIVE AGENTS</text>

      {/* ── A2A MESH LINES ── */}
      <path id="mesh-a" className="g" strokeWidth="0.9" strokeDasharray="6,5" opacity="0.28"
        d="M172,300 Q207,290 275,300"/>
      <path id="mesh-b" className="g" strokeWidth="0.9" strokeDasharray="6,5" opacity="0.28"
        d="M405,300 Q440,290 508,300"/>
      <path className="g" strokeWidth="0.9" strokeDasharray="6,5" opacity="0.22"
        d="M172,200 Q207,185 275,200"/>
      <path className="g" strokeWidth="0.9" strokeDasharray="6,5" opacity="0.22"
        d="M405,200 Q440,185 508,200"/>
      <text x="200" y="284" className="sk2" style={{fontSize:'6px'}}>a2a</text>
      <text x="432" y="284" className="sk2" style={{fontSize:'6px'}}>a2a</text>

      {/* ── TOOL ROUTER SPINDLE ── */}
      <g id="spindle-g">
        <circle className="pf" fill="#f8f8f4" strokeWidth="1.2" cx="340" cy="128" r="14"/>
        <line className="g" strokeWidth="1" x1="340" y1="114" x2="340" y2="142"/>
        <line className="g" strokeWidth="1" x1="326" y1="128" x2="354" y2="128"/>
        <line className="g" strokeWidth="1" x1="330" y1="118" x2="350" y2="138"/>
        <line className="g" strokeWidth="1" x1="350" y1="118" x2="330" y2="138"/>
        <circle className="gf" cx="340" cy="128" r="4" fillOpacity="0.8"/>
      </g>
      <text x="340" y="152" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>tool router</text>

      {/* ── AGENT BOOK helper — inline per agent ── */}
      {/* OPS SHELF 1 — deploy, monitor, patch */}
      <g id="sa1">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="52"  y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="56"  y1="178" x2="74"  y2="178"/><line className="h" x1="56"  y1="192" x2="74"  y2="192"/><line className="h" x1="56"  y1="206" x2="74"  y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="65" cy="176" r="9"/>
        <g className="eye-l"><circle cx="62" cy="174" r="2.2" fill="#4e8565"/><circle cx="62" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="68" cy="174" r="2.2" fill="#4e8565"/><circle cx="68" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M61,180 Q65,183 69,180"/>
        <line className="p" strokeWidth="1" x1="65" y1="167" x2="65" y2="161"/><circle className="ant" cx="65" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="65" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>deploy</text>
        <text x="65" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>infra agent</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="55" y="226" width="20" height="5" rx="2"/>
      </g>

      <g id="sa2">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="84"  y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="88"  y1="178" x2="106" y2="178"/><line className="h" x1="88"  y1="192" x2="106" y2="192"/><line className="h" x1="88"  y1="206" x2="106" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="97" cy="176" r="9"/>
        <g className="eye-l"><circle cx="94" cy="174" r="2.2" fill="#4e8565"/><circle cx="94" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="100" cy="174" r="2.2" fill="#4e8565"/><circle cx="100" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M93,180 Q97,183 101,180"/>
        <line className="p" strokeWidth="1" x1="97" y1="167" x2="97" y2="161"/><circle className="ant2" cx="97" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="97" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>monitor</text>
        <text x="97" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>uptime</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="87" y="226" width="20" height="5" rx="2"/>
      </g>

      <g id="sa3">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="116" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="120" y1="178" x2="138" y2="178"/><line className="h" x1="120" y1="192" x2="138" y2="192"/><line className="h" x1="120" y1="206" x2="138" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="129" cy="176" r="9"/>
        <g className="eye-l"><circle cx="126" cy="174" r="2.2" fill="#4e8565"/><circle cx="126" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="132" cy="174" r="2.2" fill="#4e8565"/><circle cx="132" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M125,180 Q129,183 133,180"/>
        <line className="p" strokeWidth="1" x1="129" y1="167" x2="129" y2="161"/><circle className="ant3" cx="129" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="129" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>patch</text>
        <text x="129" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>security</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="119" y="226" width="20" height="5" rx="2"/>
      </g>

      {/* OPS SHELF 2 — test, scale, alert */}
      <g id="sa4">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="52"  y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="56"  y1="281" x2="74"  y2="281"/><line className="h" x1="56"  y1="295" x2="74"  y2="295"/><line className="h" x1="56"  y1="309" x2="74"  y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="65" cy="279" r="9"/>
        <g className="eye-l"><circle cx="62" cy="277" r="2.2" fill="#4e8565"/><circle cx="62" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="68" cy="277" r="2.2" fill="#4e8565"/><circle cx="68" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M61,283 Q65,286 69,283"/>
        <line className="p" strokeWidth="1" x1="65" y1="270" x2="65" y2="264"/><circle className="ant" cx="65" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="65" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>test</text>
        <text x="65" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>QA runner</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="55" y="328" width="20" height="5" rx="2"/>
      </g>

      <g id="sa5">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="84"  y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="88"  y1="281" x2="106" y2="281"/><line className="h" x1="88"  y1="295" x2="106" y2="295"/><line className="h" x1="88"  y1="309" x2="106" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="97" cy="279" r="9"/>
        <g className="eye-l"><circle cx="94" cy="277" r="2.2" fill="#4e8565"/><circle cx="94" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="100" cy="277" r="2.2" fill="#4e8565"/><circle cx="100" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M93,283 Q97,286 101,283"/>
        <line className="p" strokeWidth="1" x1="97" y1="270" x2="97" y2="264"/><circle className="ant2" cx="97" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="97" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>scale</text>
        <text x="97" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>k8s agent</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="87" y="328" width="20" height="5" rx="2"/>
      </g>

      <g id="sa6">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="116" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="120" y1="281" x2="138" y2="281"/><line className="h" x1="120" y1="295" x2="138" y2="295"/><line className="h" x1="120" y1="309" x2="138" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="129" cy="279" r="9"/>
        <g className="eye-l"><circle cx="126" cy="277" r="2.2" fill="#4e8565"/><circle cx="126" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="132" cy="277" r="2.2" fill="#4e8565"/><circle cx="132" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M125,283 Q129,286 133,283"/>
        <line className="p" strokeWidth="1" x1="129" y1="270" x2="129" y2="264"/><circle className="ant3" cx="129" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="129" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>alert</text>
        <text x="129" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>incident</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="119" y="328" width="20" height="5" rx="2"/>
      </g>

      {/* DATA SHELF 1 — ingest, analyse, embed */}
      <g id="sa7">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="285" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="289" y1="178" x2="307" y2="178"/><line className="h" x1="289" y1="192" x2="307" y2="192"/><line className="h" x1="289" y1="206" x2="307" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="298" cy="176" r="9"/>
        <g className="eye-l"><circle cx="295" cy="174" r="2.2" fill="#4e8565"/><circle cx="295" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="301" cy="174" r="2.2" fill="#4e8565"/><circle cx="301" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M294,180 Q298,183 302,180"/>
        <line className="p" strokeWidth="1" x1="298" y1="167" x2="298" y2="161"/><circle className="ant" cx="298" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="298" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>ingest</text>
        <text x="298" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>ETL pipe</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="288" y="226" width="20" height="5" rx="2"/>
      </g>

      <g id="sa8">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="317" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="321" y1="178" x2="339" y2="178"/><line className="h" x1="321" y1="192" x2="339" y2="192"/><line className="h" x1="321" y1="206" x2="339" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="330" cy="176" r="9"/>
        <g className="eye-l"><circle cx="327" cy="174" r="2.2" fill="#4e8565"/><circle cx="327" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="333" cy="174" r="2.2" fill="#4e8565"/><circle cx="333" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M326,180 Q330,183 334,180"/>
        <line className="p" strokeWidth="1" x1="330" y1="167" x2="330" y2="161"/><circle className="ant2" cx="330" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="330" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>analyse</text>
        <text x="330" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>insights</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="320" y="226" width="20" height="5" rx="2"/>
      </g>

      <g id="sa9">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="349" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="353" y1="178" x2="371" y2="178"/><line className="h" x1="353" y1="192" x2="371" y2="192"/><line className="h" x1="353" y1="206" x2="371" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="362" cy="176" r="9"/>
        <g className="eye-l"><circle cx="359" cy="174" r="2.2" fill="#4e8565"/><circle cx="359" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="365" cy="174" r="2.2" fill="#4e8565"/><circle cx="365" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M358,180 Q362,183 366,180"/>
        <line className="p" strokeWidth="1" x1="362" y1="167" x2="362" y2="161"/><circle className="ant3" cx="362" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="362" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>embed</text>
        <text x="362" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>vectorise</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="352" y="226" width="20" height="5" rx="2"/>
      </g>

      {/* DATA SHELF 2 — query, report, forecast */}
      <g id="sa10">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="285" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="289" y1="281" x2="307" y2="281"/><line className="h" x1="289" y1="295" x2="307" y2="295"/><line className="h" x1="289" y1="309" x2="307" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="298" cy="279" r="9"/>
        <g className="eye-l"><circle cx="295" cy="277" r="2.2" fill="#4e8565"/><circle cx="295" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="301" cy="277" r="2.2" fill="#4e8565"/><circle cx="301" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M294,283 Q298,286 302,283"/>
        <line className="p" strokeWidth="1" x1="298" y1="270" x2="298" y2="264"/><circle className="ant" cx="298" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="298" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>query</text>
        <text x="298" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>SQL agent</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="288" y="328" width="20" height="5" rx="2"/>
      </g>

      <g id="sa11">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="317" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="321" y1="281" x2="339" y2="281"/><line className="h" x1="321" y1="295" x2="339" y2="295"/><line className="h" x1="321" y1="309" x2="339" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="330" cy="279" r="9"/>
        <g className="eye-l"><circle cx="327" cy="277" r="2.2" fill="#4e8565"/><circle cx="327" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="333" cy="277" r="2.2" fill="#4e8565"/><circle cx="333" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M326,283 Q330,286 334,283"/>
        <line className="p" strokeWidth="1" x1="330" y1="270" x2="330" y2="264"/><circle className="ant2" cx="330" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="330" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>report</text>
        <text x="330" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>dashboard</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="320" y="328" width="20" height="5" rx="2"/>
      </g>

      <g id="sa12">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="349" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="353" y1="281" x2="371" y2="281"/><line className="h" x1="353" y1="295" x2="371" y2="295"/><line className="h" x1="353" y1="309" x2="371" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="362" cy="279" r="9"/>
        <g className="eye-l"><circle cx="359" cy="277" r="2.2" fill="#4e8565"/><circle cx="359" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="365" cy="277" r="2.2" fill="#4e8565"/><circle cx="365" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M358,283 Q362,286 366,283"/>
        <line className="p" strokeWidth="1" x1="362" y1="270" x2="362" y2="264"/><circle className="ant3" cx="362" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="362" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>forecast</text>
        <text x="362" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>time series</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="352" y="328" width="20" height="5" rx="2"/>
      </g>

      {/* CREATIVE SHELF 1 — write, design, compose */}
      <g id="sa13">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="518" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="522" y1="178" x2="540" y2="178"/><line className="h" x1="522" y1="192" x2="540" y2="192"/><line className="h" x1="522" y1="206" x2="540" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="531" cy="176" r="9"/>
        <g className="eye-l"><circle cx="528" cy="174" r="2.2" fill="#4e8565"/><circle cx="528" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="534" cy="174" r="2.2" fill="#4e8565"/><circle cx="534" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M527,180 Q531,184 535,180"/>
        <line className="p" strokeWidth="1" x1="531" y1="167" x2="531" y2="161"/><circle className="ant" cx="531" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="531" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>write</text>
        <text x="531" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>copywriter</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="521" y="226" width="20" height="5" rx="2"/>
      </g>

      <g id="sa14">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="550" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="554" y1="178" x2="572" y2="178"/><line className="h" x1="554" y1="192" x2="572" y2="192"/><line className="h" x1="554" y1="206" x2="572" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="563" cy="176" r="9"/>
        <g className="eye-l"><circle cx="560" cy="174" r="2.2" fill="#4e8565"/><circle cx="560" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="566" cy="174" r="2.2" fill="#4e8565"/><circle cx="566" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M559,180 Q563,184 567,180"/>
        <line className="p" strokeWidth="1" x1="563" y1="167" x2="563" y2="161"/><circle className="ant2" cx="563" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="563" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>design</text>
        <text x="563" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>UI agent</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="553" y="226" width="20" height="5" rx="2"/>
      </g>

      <g id="sa15">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="582" y="165" width="26" height="78" rx="2"/>
        <line className="h" x1="586" y1="178" x2="604" y2="178"/><line className="h" x1="586" y1="192" x2="604" y2="192"/><line className="h" x1="586" y1="206" x2="604" y2="206"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="595" cy="176" r="9"/>
        <g className="eye-l"><circle cx="592" cy="174" r="2.2" fill="#4e8565"/><circle cx="592" cy="174" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="598" cy="174" r="2.2" fill="#4e8565"/><circle cx="598" cy="174" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M591,180 Q595,184 599,180"/>
        <line className="p" strokeWidth="1" x1="595" y1="167" x2="595" y2="161"/><circle className="ant3" cx="595" cy="160" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="595" y="210" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>compose</text>
        <text x="595" y="220" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>music gen</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="585" y="226" width="20" height="5" rx="2"/>
      </g>

      {/* CREATIVE SHELF 2 — narrate, translate, sketch */}
      <g id="sa16">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="518" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="522" y1="281" x2="540" y2="281"/><line className="h" x1="522" y1="295" x2="540" y2="295"/><line className="h" x1="522" y1="309" x2="540" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="531" cy="279" r="9"/>
        <g className="eye-l"><circle cx="528" cy="277" r="2.2" fill="#4e8565"/><circle cx="528" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="534" cy="277" r="2.2" fill="#4e8565"/><circle cx="534" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M527,283 Q531,286 535,283"/>
        <line className="p" strokeWidth="1" x1="531" y1="270" x2="531" y2="264"/><circle className="ant" cx="531" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="531" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>narrate</text>
        <text x="531" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>story gen</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="521" y="328" width="20" height="5" rx="2"/>
      </g>

      <g id="sa17">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="550" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="554" y1="281" x2="572" y2="281"/><line className="h" x1="554" y1="295" x2="572" y2="295"/><line className="h" x1="554" y1="309" x2="572" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="563" cy="279" r="9"/>
        <g className="eye-l"><circle cx="560" cy="277" r="2.2" fill="#4e8565"/><circle cx="560" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="566" cy="277" r="2.2" fill="#4e8565"/><circle cx="566" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M559,283 Q563,286 567,283"/>
        <line className="p" strokeWidth="1" x1="563" y1="270" x2="563" y2="264"/><circle className="ant2" cx="563" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="563" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>translate</text>
        <text x="563" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>i18n agent</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="553" y="328" width="20" height="5" rx="2"/>
      </g>

      <g id="sa18">
        <rect className="pf" fill="#f8f8f4" strokeWidth="1.4" x="582" y="268" width="26" height="78" rx="2"/>
        <line className="h" x1="586" y1="281" x2="604" y2="281"/><line className="h" x1="586" y1="295" x2="604" y2="295"/><line className="h" x1="586" y1="309" x2="604" y2="309"/>
        <circle className="pf" fill="#f5f5f0" strokeWidth="1.2" cx="595" cy="279" r="9"/>
        <g className="eye-l"><circle cx="592" cy="277" r="2.2" fill="#4e8565"/><circle cx="592" cy="277" r="1" fill="#1a1a1a"/></g>
        <g className="eye-r"><circle cx="598" cy="277" r="2.2" fill="#4e8565"/><circle cx="598" cy="277" r="1" fill="#1a1a1a"/></g>
        <path className="p" strokeWidth="1" d="M591,283 Q595,286 599,283"/>
        <line className="p" strokeWidth="1" x1="595" y1="270" x2="595" y2="264"/><circle className="ant3" cx="595" cy="263" r="2" fill="#4e8565" stroke="#4e8565"/>
        <text x="595" y="313" textAnchor="middle" className="sk" style={{fontSize:'7px'}}>sketch</text>
        <text x="595" y="323" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>image gen</text>
        <rect className="gf" fillOpacity="0.15" strokeWidth="0.8" x="585" y="328" width="20" height="5" rx="2"/>
      </g>

      {/* ── LOWER SHELF TAGS (shelves 3 & 4 per unit) ── */}
      {[
        {x:48,y:390,w:118,text:"rollback  //  backup  //  sync  //  cron"},
        {x:48,y:512,w:118,text:"audit  //  comply  //  rotate  //  scan"},
        {x:48,y:634,w:118,text:"route  //  proxy  //  balance  //  cache"},
        {x:281,y:390,w:118,text:"clean  //  label  //  chunk  //  rank"},
        {x:281,y:512,w:118,text:"cluster  //  classify  //  detect  //  score"},
        {x:281,y:634,w:118,text:"stream  //  batch  //  snapshot  //  diff"},
        {x:514,y:390,w:118,text:"summarise  //  rewrite  //  tone  //  seo"},
        {x:514,y:512,w:118,text:"persona  //  roleplay  //  coach  //  tutor"},
        {x:514,y:634,w:118,text:"podcast  //  script  //  slide  //  pitch"},
      ].map((d,i) => (
        <g key={i}>
          <rect className="gf" fillOpacity="0.08" strokeWidth="1" x={d.x} y={d.y} width={d.w} height="8" rx="2"/>
          <text x={d.x+d.w/2} y={d.y+7} textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>{d.text}</text>
        </g>
      ))}

      {/* ── LIBRARIAN AGENT — AI robot sitting behind desk ── */}
      {/* body — behind desk, only upper torso visible */}
      <ellipse className="pf" fill="#f5f5f0" strokeWidth="2"  cx="340" cy="610" rx="22" ry="26"/>
      {[602,612].map(y=><line key={y} className="h" x1="322" y1={y} x2="358" y2={y}/>)}
      {/* collar / chest panel */}
      <rect className="gf" fillOpacity="0.15" strokeWidth="1.2" x="328" y="614" width="24" height="8" rx="3"/>
      <circle className="ant"  cx="332" cy="618" r="1.4" fill="#4e8565"/>
      <circle className="ant2" cx="340" cy="618" r="1.4" fill="#4e8565"/>
      <circle className="ant3" cx="348" cy="618" r="1.4" fill="#4e8565"/>
      {/* arms reaching to desk */}
      <path className="p" strokeWidth="2" d="M320,608 Q306,622 300,638"/>
      <path className="p" strokeWidth="2" d="M360,608 Q374,622 380,638"/>
      {/* neck */}
      <rect className="pf" strokeWidth="1.5" x="334" y="580" width="12" height="10" rx="2"/>
      {/* robot head — square with rounded corners */}
      <rect className="pf" fill="#f8f8f4" strokeWidth="2" x="318" y="554" width="44" height="36" rx="5"/>
      {[560,568].map(y=><line key={y} className="h" strokeWidth="0.5" x1="322" y1={y} x2="358" y2={y}/>)}
      {/* screen face — green display */}
      <rect fill="#4e8565" fillOpacity="0.12" stroke="#4e8565" strokeWidth="1" x="323" y="558" width="34" height="22" rx="3"/>
      {/* eyes — glowing green LEDs */}
      <g className="eye-l">
        <rect x="326" y="562" width="10" height="7" rx="2" fill="#4e8565" fillOpacity="0.8"/>
        <rect x="328" y="563" width="6" height="5" rx="1" fill="#1a1a1a"/>
        <circle cx="330" cy="565" r="1.2" fill="white" fillOpacity="0.8"/>
      </g>
      <g className="eye-r">
        <rect x="344" y="562" width="10" height="7" rx="2" fill="#4e8565" fillOpacity="0.8"/>
        <rect x="346" y="563" width="6" height="5" rx="1" fill="#1a1a1a"/>
        <circle cx="348" cy="565" r="1.2" fill="white" fillOpacity="0.8"/>
      </g>
      {/* mouth — LED bar */}
      <rect x="328" y="572" width="24" height="3" rx="1.5" fill="#4e8565" fillOpacity="0.5"/>
      {/* ear ports */}
      <rect className="pf" x="314" y="562" width="4" height="8" rx="2"/>
      <rect className="pf" x="362" y="562" width="4" height="8" rx="2"/>
      {/* antenna */}
      <line className="p" strokeWidth="1.8" x1="340" y1="554" x2="340" y2="538"/>
      <circle className="ant2" cx="340" cy="536" r="4" fill="#4e8565" stroke="#4e8565"/>
      {/* ID tag */}
      <rect className="gf" fillOpacity="0.12" strokeWidth="1" x="316" y="648" width="48" height="9" rx="2"/>
      <text x="340" y="655" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>LIBRARIAN-00</text>
      {/* desk — drawn AFTER body so it overlaps lower half */}
      <rect className="pf" fill="#f8f8f4" strokeWidth="2" x="220" y="660" width="240" height="70" rx="3"/>
      {[675,690,705].map(y=><line key={y} className="h" x1="226" y1={y} x2="454" y2={y}/>)}
      <rect className="pf" fill="#f0f0eb" strokeWidth="1.5" x="228" y="728" width="14" height="28" rx="2"/>
      <rect className="pf" fill="#f0f0eb" strokeWidth="1.5" x="438" y="728" width="14" height="28" rx="2"/>
      {/* lamp */}
      <line className="p" strokeWidth="2"   x1="390" y1="660" x2="390" y2="634"/>
      <path className="p" strokeWidth="1.8" d="M390,634 Q408,618 418,628"/>
      <ellipse className="pf" fill="#f8f8f4" strokeWidth="1.5" cx="424" cy="634" rx="12" ry="6" transform="rotate(-30,424,634)"/>
      <circle id="lamp-glow" cx="420" cy="638" r="5" fill="#4e8565" fillOpacity="0.18" stroke="#4e8565" strokeWidth="0.8"/>
      {/* terminal */}
      <rect className="pf" fill="#f0f5f2" strokeWidth="1.5" x="240" y="638" width="88" height="58" rx="3"/>
      <rect className="gf" fillOpacity="0.12" strokeWidth="1"  x="244" y="642" width="80" height="50" rx="2"/>
      {[652,660,668,676].map(y=><line key={y} className="g" strokeWidth="0.8" x1="248" y1={y} x2={y===676?304:320} y2={y}/>)}
      <text x="252" y="650" className="sk2" style={{fontSize:'6px'}}>registry v1.0</text>
      <circle className="ant" cx="316" cy="684" r="2.5" fill="#4e8565" stroke="#4e8565"/>
      {/* open book on desk */}
      <path className="pf" fill="#f8f8f4" strokeWidth="1.5"
        d="M344,660 Q340,655 336,660 L332,695 Q340,692 348,695 Z"/>
      {[665,672].map(y=>(
        <g key={y}>
          <line className="h" strokeWidth="0.6" x1="336" y1={y} x2="340" y2={y}/>
          <line className="h" strokeWidth="0.6" x1="341" y1={y} x2="346" y2={y}/>
        </g>
      ))}
      <line className="p" strokeWidth="1" x1="340" y1="657" x2="340" y2="695"/>

      {/* ── CATALOGUE DRAWERS ── */}
      <rect className="pf" style={{fill:'#ffffff'}} strokeWidth="1.8" x="42"  y="756" width="142" height="40" rx="3"/>
      {[768].map(y=><line key={y} className="h" x1="48" y1={y} x2="178" y2={y}/>)}
      <line className="p" strokeWidth="1" x1="113" y1="756" x2="113" y2="796"/>
      <circle className="gf" cx="90"  cy="776" r="3" strokeWidth="1"/>
      <circle className="gf" cx="136" cy="776" r="3" strokeWidth="1"/>
      <text x="113" y="789" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>card catalogue</text>

      <rect className="pf" style={{fill:'#ffffff'}} strokeWidth="1.8" x="500" y="756" width="142" height="40" rx="3"/>
      <line className="h" x1="506" y1="768" x2="636" y2="768"/>
      <line className="p" strokeWidth="1" x1="571" y1="756" x2="571" y2="796"/>
      <circle className="gf" cx="548" cy="776" r="3" strokeWidth="1"/>
      <circle className="gf" cx="594" cy="776" r="3" strokeWidth="1"/>
      <text x="571" y="789" textAnchor="middle" className="sk2" style={{fontSize:'6px'}}>tool manifest</text>

      {/* hanging reference lines */}
      {[170,240,440,510].map(x=>(
        <line key={x} className="g" strokeWidth="0.6" opacity="0.3" strokeDasharray="3,3" x1={x} y1="130" x2={x} y2="560"/>
      ))}

      {/* signature */}
      <text className="sig" x="152" y="900">greater agents  //  agent library  //  open stack  //  v1.0</text>
    </svg>
  );
}
