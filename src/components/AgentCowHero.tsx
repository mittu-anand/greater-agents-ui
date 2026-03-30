import React from 'react';

/**
 * AgentCowDashboard - A high-fidelity, hand-coded SVG dashboard
 * replicating the "agent Cows v1.0 | Cyber-Farm System" design.
 */
export default function AgentCowDashboard({ className = "" }: { className?: string }) {
  // Common style variables for cleaner code
  const STROKE_DARK = "#1a1a1a";
  const STROKE_LIGHT = "#e8e8e0";
  const FILL_OFFWHITE = "#fafaf6";
  const FILL_GREY = "#f0f0eb";
  const ACCENT_GREEN = "#4e8565";
  const FONT_TECH = "'Courier New',monospace";

  return (
    <svg 
      viewBox="0 0 1000 600" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      style={{ display: 'block', backgroundColor: '#fdfdfb' }}
    >
      <style>{`
        /* Reuse keyframes from your spider component */
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes glow{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes subtle_float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        
        /* Apply animations to core structures */
        .cow-body { animation: breathe 3.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .glw { animation: glow 2s ease-in-out infinite; }
        
        /* Animation delays for different elements to add life */
        .cow-left { animation-delay: 0s; }
        .cow-right { animation-delay: 1.75s; }
        .note { animation: subtle_float 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        
        /* Styling defaults */
        .grid-line { stroke: ${STROKE_LIGHT}; stroke-width: 0.5; }
        .data-text { font-family: ${FONT_TECH}; font-size: 11px; font-weight: bold; fill: ${STROKE_DARK}; }
        .green-text { font-family: ${FONT_TECH}; font-size: 11px; fill: ${ACCENT_GREEN}; }
        .metadata-text { font-family: ${FONT_TECH}; font-size: 10px; fill: ${STROKE_DARK}; opacity: 0.7; }
      `}</style>

      {/* --- LAYER 1: BACKGROUND (Ruled Paper & Base Farm) --- */}
      <g id="grid-background">
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="0" y1={i * 50} x2="1000" y2={i * 50} className="grid-line" />
        ))}
      </g>

      {/* Scattered Data Drops */}
      {[ [180, 180], [330, 200], [520, 150], [680, 200], [840, 180] ].map(([cx, cy], i) => (
         <path key={i} d={`M${cx},${cy} Q${cx-10},${cy-20} ${cx},${cy-30} Q${cx+10},${cy-20} ${cx},${cy}`} fill="${ACCENT_GREEN}" fillOpacity="0.4" />
      ))}

      {/* Farm Elements (Barn, Silo, Fences) */}
      <g id="farm-structures" transform="translate(380, 420)">
        {/* Farmhouse Path */}
        <path d="M0,80 L0,30 L40,0 L80,30 L80,80 Z" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="2" />
        <rect x="25" y="50" width="15" height="30" fill="${STROKE_DARK}" opacity="0.1" /> {/* Door */}
        
        {/* Silo Path */}
        <path d="M90,80 L90,10 Q110,0 130,10 L130,80 Z" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="2" />
        
        {/* Fencing repeating lines */}
        <g transform="translate(-150, 80)">
          <line x1="0" y1="0" x2="300" y2="0" stroke="${STROKE_DARK}" strokeWidth="1.5" />
          {[...Array(6)].map((_, i) => (
             <line key={i} x1={i * 50} y1="-10" x2={i * 50} y2="0" stroke="${STROKE_DARK}" strokeWidth="1.5" />
          ))}
        </g>
      </g>
      <path d="M100,550 Q500,560 900,550" stroke="${STROKE_LIGHT}" strokeWidth="0.8" fill="none" opacity="0.4"/> {/* Stylized Ground */}
      {[ [120, 545], [300, 552], [650, 548], [880, 550] ].map(([x,y], i) => (
         <line key={i} x1={x} y1={y} x2={x+15} y2={y-5} stroke="${ACCENT_GREEN}" strokeWidth="0.7" />
      ))}


      {/* --- LAYER 2: TASK NOTES & NETWORK LINES --- */}
      {/* Defined as groups with unique charts */}

      {/* 1. GRAZE_PROTO (Top Left) */}
      <g className="note" transform="translate(100, 100)" style={{ animationDelay: '0s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">GRAZE_PROTO</text>
        <line x1="10" y1="28" x2="100" y2="28" stroke="${STROKE_DARK}" strokeLinecap="round" opacity="0.2" />
        <line x1="10" y1="34" x2="80" y2="34" stroke="${STROKE_DARK}" strokeLinecap="round" opacity="0.2" />
        <circle className="glw" cx="102" cy="15" r="3" fill="${ACCENT_GREEN}" />
      </g>

      {/* 2. PASTURE_MGMT (Upper Middle Left) */}
      <g className="note" transform="translate(260, 90)" style={{ animationDelay: '1.2s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">PASTURE_MGMT</text>
        <path d="M10,34 L100,26" stroke="${STROKE_DARK}" strokeWidth="0.8" opacity="0.2" fill="none" /> {/* Micro-chart */}
        <circle className="glw" cx="102" cy="15" r="3" fill="${ACCENT_GREEN}" style={{ animationDelay: '0.5s' }} />
      </g>

      {/* 3. FEED_OPTIMIZATION (Upper Middle Right) */}
      <g className="note" transform="translate(680, 80)" style={{ animationDelay: '0.8s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">FEED_OPTIMIZATION</text>
        <line x1="10" y1="28" x2="100" y2="28" stroke="${STROKE_DARK}" strokeLinecap="round" opacity="0.2" />
        <circle className="glw" cx="102" cy="15" r="3" fill="${ACCENT_GREEN}" style={{ animationDelay: '0.2s' }} />
      </g>

      {/* 4. HERD_HEALTH_CHECK (Top Right) */}
      <g className="note" transform="translate(850, 90)" style={{ animationDelay: '1.6s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">HERD_HEALTH</text>
        <path d="M10,26 L30,34 L60,26 L100,34" stroke="${STROKE_DARK}" strokeWidth="0.8" opacity="0.2" fill="none" /> {/* Micro-chart */}
        <circle className="glw" cx="102" cy="15" r="3" fill="${ACCENT_GREEN}" style={{ animationDelay: '0.7s' }} />
      </g>

      {/* Data connection network lines */}
      {[
        ["M190,140 Q180,180 230,220", 0.4], ["M330,130 Q330,200 270,220", 0.4], 
        ["M780,120 Q800,160 760,190", 0.4], ["M920,130 Q900,180 880,210", 0.4],
        ["M500,180 L500,100", 0.3, "5,5"] // Central hub link
      ].map(([d, op, dash], i) => (
         <path key={i} d={d} stroke="${STROKE_DARK}" strokeWidth="1" strokeDasharray={dash} opacity={op} fill="none" />
      ))}
      <circle cx="500" cy="180" r="3" fill="${STROKE_DARK}" />


      {/* --- LAYER 3: AGENT COWS & LOCAL NOTES --- */}

      {/* --- AGENT COW: LEFT (#1) --- */}
      {/* We hand-coded complex paths to ensure this looks like a cow (udder, horns, sturdy torso) */}
      <g id="cow-left-container" transform="translate(250, 310)">
        {/* Cow Structure */}
        <g className="cow-body cow-left">
          {/* Complex sturdy body/torso path */}
          <path d="M-80,0 Q-90,-80 50,-90 Q170,-90 180,-10 L180,70 Q100,90 -20,70 Q-80,60 -80,0" fill="${FILL_GREY}" stroke="${STROKE_DARK}" strokeWidth="2.5" />
          
          {/* Underside & Udder Detail */}
          <path d="M-20,70 Q50,90 120,70" fill="none" stroke="${STROKE_DARK}" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="60" cy="85" rx="10" ry="12" fill="${FILL_GREY}" stroke="${STROKE_DARK}" strokeWidth="1.5" /> {/* Udder */}
          {[55, 65].map(cx => <circle key={cx} cx={cx} cy="92" r="2.5" fill="${ACCENT_GREEN}" fillOpacity="0.4" stroke="${ACCENT_GREEN}" strokeWidth="0.8"/>)} {/* Teats with green accent */}

          {/* Legs */}
          {[ [-60, 60], [-40, 60], [140, 70], [160, 70] ].map(([x,y], i) => (
             <line key={i} x1={x} y1={y} x2={x} y2={y+60} stroke="${STROKE_DARK}" strokeWidth="4" strokeLinecap="round" />
          ))}

          {/* Internal Tech Band (the requested tech texture) */}
          <rect x="0" y="-80" width="80" height="150" fill="${ACCENT_GREEN}" fillOpacity="0.1" rx="4" />
          <line x1="40" y1="-80" x2="40" y2="70" stroke="${STROKE_DARK}" strokeWidth="0.8" opacity="0.2" />
          {[ -60, -20, 20 ].map(y => <line key={y} x1="5" y1={y} x2="75" y2={y} stroke="${STROKE_DARK}" strokeWidth="0.7" opacity="0.15" />)}
          <circle cx="20" cy="-20" r="3" fill="${ACCENT_GREEN}" /> {/* Green internal data point */}
          
          {/* Head, Neck, Eye, & Nose */}
          <path d="M180,20 Q240,20 250,70 Q250,130 190,130 L180,120 Z" fill="${FILL_GREY}" stroke="${STROKE_DARK}" strokeWidth="2.5" />
          <path d="M220,50 L230,20" fill="none" stroke="${STROKE_DARK}" strokeWidth="2" /> {/* Horn */}
          <circle cx="215" cy="70" r="4" fill="${STROKE_DARK}" />
          <rect className="glw" x="212" y="67" width="6" height="6" fill="${ACCENT_GREEN}" fillOpacity="0.5" rx="1" /> {/* Eye tech glow */}
          <path d="M210,120 Q220,115 230,120" fill="none" stroke="${STROKE_DARK}" opacity="0.3" strokeWidth="1.5" /> {/* Muzzle */}
          
          {/* Tech Ear Tag */}
          <g transform="translate(190, 60)">
             <rect width="25" height="18" rx="2" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1" />
             <text x="3" y="12" className="green-text" style={{ fontSize: '9px' }}>C_A</text>
             <circle className="glw" cx="22" cy="4" r="2" fill="${ACCENT_GREEN}" />
          </g>
        </g>
      </g>

      {/* Local Notes for Cow #1 (Left) */}
      {/* 5. CLIMATE_DATA */}
      <g className="note" transform="translate(60, 210)" style={{ animationDelay: '2.4s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">CLIMATE_DATA</text>
        <rect x="10" y="26" width="30" height="8" fill="${ACCENT_GREEN}" fillOpacity="0.1" /> {/* Micro-bars */}
        <rect x="45" y="26" width="30" height="8" fill="${ACCENT_GREEN}" fillOpacity="0.3" />
      </g>
      {/* 6. MILK_ANALYSIS */}
      <g className="note" transform="translate(20, 310)" style={{ animationDelay: '3.6s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">MILK_ANALYSIS</text>
        <line x1="10" y1="28" x2="100" y2="28" stroke="${STROKE_DARK}" strokeLinecap="round" opacity="0.2" />
      </g>
      {[ ["M170,230 L230,240", 0.4, "3,2"], ["M130,330 L220,310", 0.4, "3,2"] ].map(([d, op, dash], i) => (
         <path key={i} d={d} stroke="${STROKE_DARK}" strokeWidth="1" strokeDasharray={dash} opacity={op} fill="none" />
      ))}
      <text x="210" y="260" className="metadata-text">pair1</text>
      <text x="190" y="315" className="metadata-text">pair2</text>


      {/* --- CENTRAL FARMHUB NODE --- */}
      <g className="note" transform="translate(450, 310)">
        <rect width="100" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">Hub_CORE</text>
        <line x1="10" y1="28" x2="90" y2="28" stroke="${STROKE_DARK}" strokeLinecap="round" opacity="0.2" />
      </g>
      <line x1="500" y1="350" x2="500" y2="400" stroke="${STROKE_DARK}" strokeWidth="1.2" opacity="0.6" />


      {/* --- AGENT COW: RIGHT (#2) --- */}
      {/* This is a mirrored, sturdy cow with identical details */}
      <g id="cow-right-container" transform="translate(750, 310) scale(-1, 1)">
        {/* Cow Structure */}
        <g className="cow-body cow-right">
          <path d="M-80,0 Q-90,-80 50,-90 Q170,-90 180,-10 L180,70 Q100,90 -20,70 Q-80,60 -80,0" fill="${FILL_GREY}" stroke="${STROKE_DARK}" strokeWidth="2.5" />
          
          <path d="M-20,70 Q50,90 120,70" fill="none" stroke="${STROKE_DARK}" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="60" cy="85" rx="10" ry="12" fill="${FILL_GREY}" stroke="${STROKE_DARK}" strokeWidth="1.5" />
          {[55, 65].map(cx => <circle key={cx} cx={cx} cy="92" r="2.5" fill="${ACCENT_GREEN}" fillOpacity="0.4" stroke="${ACCENT_GREEN}" strokeWidth="0.8"/>)}

          {[ [-60, 60], [-40, 60], [140, 70], [160, 70] ].map(([x,y], i) => (
             <line key={i} x1={x} y1={y} x2={x} y2={y+60} stroke="${STROKE_DARK}" strokeWidth="4" strokeLinecap="round" />
          ))}

          <rect x="0" y="-80" width="80" height="150" fill="${ACCENT_GREEN}" fillOpacity="0.1" rx="4" />
          <line x1="40" y1="-80" x2="40" y2="70" stroke="${STROKE_DARK}" strokeWidth="0.8" opacity="0.2" />
          {[ -60, -20, 20 ].map(y => <line key={y} x1="5" y1={y} x2="75" y2={y} stroke="${STROKE_DARK}" strokeWidth="0.7" opacity="0.15" />)}
          
          <path d="M180,20 Q240,20 250,70 Q250,130 190,130 L180,120 Z" fill="${FILL_GREY}" stroke="${STROKE_DARK}" strokeWidth="2.5" />
          <path d="M220,50 L230,20" fill="none" stroke="${STROKE_DARK}" strokeWidth="2" />
          <circle cx="215" cy="70" r="4" fill="${STROKE_DARK}" />
          <rect className="glw" x="212" y="67" width="6" height="6" fill="${ACCENT_GREEN}" fillOpacity="0.5" rx="1" />
          <path d="M210,120 Q220,115 230,120" fill="none" stroke="${STROKE_DARK}" opacity="0.3" strokeWidth="1.5" />
          
          <g transform="translate(190, 60)">
             <rect width="25" height="18" rx="2" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1" />
             <text x="3" y="12" className="green-text" style={{ fontSize: '9px' }}>C_A</text>
             <circle className="glw" cx="22" cy="4" r="2" fill="${ACCENT_GREEN}" />
          </g>
        </g>
      </g>

      {/* Local Notes for Cow #2 (Right) */}
      {/* (Flipped nodes need special text positioning) */}
      {/* 7. EQUIPMENT_STATUS (Bottom Right) */}
      <g className="note" transform="translate(800, 210)" style={{ animationDelay: '2.8s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">EQU_STATUS</text>
        <rect x="10" y="26" width="30" height="8" fill="${ACCENT_GREEN}" fillOpacity="0.1" />
        <rect x="45" y="26" width="30" height="8" fill="${ACCENT_GREEN}" fillOpacity="0.3" />
        <text x="80" y="32" className="metadata-text">#fafaf6</text> {/* Specific metadata label */}
      </g>
      {/* 8. liv_move_v1 (Far Right) */}
      <g className="note" transform="translate(880, 310)" style={{ animationDelay: '4.0s' }}>
        <rect width="110" height="40" rx="4" fill="${FILL_OFFWHITE}" stroke="${STROKE_DARK}" strokeWidth="1.2" />
        <text x="10" y="20" className="data-text">liv_move_v1</text>
        <line x1="10" y1="28" x2="100" y2="28" stroke="${STROKE_DARK}" strokeLinecap="round" opacity="0.2" />
      </g>
      {[ ["M840,330 Q830,300 780,300", 0.4, "3,2"], ["M960,350 Q960,380 900,400", 0.4, "3,2"] ].map(([d, op, dash], i) => (
         <path key={i} d={d} stroke="${STROKE_DARK}" strokeWidth="1" strokeDasharray={dash} opacity={op} fill="none" />
      ))}
      <text x="800" y="300" className="metadata-text">pair2</text>


      {/* --- FOOTER & HEADER --- */}
      <text x="500" y="580" textAnchor="middle" className="green-text" style={{ fontSize: '13px' }}>
        agent Cows v1.0 | Cyber-Farm System
      </text>

      <text x="500" y="30" textAnchor="middle" className="metadata-text" style={{ fontSize: '12px', opacity: 1 }}>
        CYBER-AGRICULTURE PROTOCOL v1.0
      </text>

    </svg>
  );
}