"use client";
import { useEffect, useRef } from "react";

export default function AgentCows({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 680, H = 700;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    // Let CSS control display size — no fixed px style
    cv.style.display = "block";
    cv.style.background = "transparent";

    const ctx = cv.getContext("2d")!;
    ctx.scale(dpr, dpr);

    let t = 0;
    let raf: number;

    const BK = "#1a1a1a", GR = "#4e8565", PAPER = "transparent", CREAM = "transparent";

    function pl(x1:number,y1:number,x2:number,y2:number,w=1.5,col=BK,op=1){
      ctx.save(); ctx.globalAlpha=op; ctx.strokeStyle=col; ctx.lineWidth=w;
      ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.restore();
    }
    function h(x1:number,y1:number,x2:number,y2:number){ pl(x1,y1,x2,y2,0.6,BK,0.13); }
    function paperLines(){ for(let y=80;y<=H;y+=80) pl(0,y,W,y,0.4,"#e8e8e0"); }

    function antPulse(cx:number,cy:number,phase:number){
      const p=0.45+0.55*Math.sin(t*0.06+phase);
      ctx.globalAlpha=p; ctx.fillStyle=GR;
      ctx.beginPath(); ctx.arc(cx,cy,3+p*2.5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    }
    function glowDot(cx:number,cy:number,phase:number){
      const p=0.4+0.5*Math.sin(t*0.05+phase);
      ctx.globalAlpha=p; ctx.fillStyle=GR;
      ctx.beginPath(); ctx.arc(cx,cy,1.8,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    }
    function silk(x1:number,y1:number,x2:number,y2:number){
      ctx.save(); ctx.strokeStyle=GR; ctx.lineWidth=0.9;
      ctx.setLineDash([4,3]); ctx.globalAlpha=0.5;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.restore();
    }
    function noteCard(x:number,y:number,title:string,sub:string,phase:number){
      ctx.fillStyle="#f8f8f4"; ctx.strokeStyle=BK; ctx.lineWidth=1.3;
      ctx.beginPath(); ctx.roundRect(x,y,70,40,4); ctx.fill(); ctx.stroke();
      h(x+6,y+13,x+64,y+13); h(x+6,y+21,x+58,y+21); h(x+6,y+29,x+60,y+29);
      ctx.fillStyle=BK; ctx.font='bold 8px "Courier New"'; ctx.textAlign="left";
      ctx.fillText(title,x+6,y+11);
      ctx.fillStyle=GR; ctx.font='7px "Courier New"'; ctx.fillText(sub,x+6,y+38);
      glowDot(x+61,y+7,phase);
    }

    // ── COW ──
    function drawCow(
      cx:number,cy:number,dir:number,
      agentId:string,phase:number,drift:number,
      cards:Array<{col:number,row:number,title:string,sub:string}>
    ){
      const x=cx+drift;
      const legDefs=[
        {bx:x+dir*22,off:0},
        {bx:x+dir*22,off:Math.PI},
        {bx:x-dir*22,off:Math.PI},
        {bx:x-dir*22,off:0},
      ];
      const hoofPos:Array<{hx:number,hy:number}>=[];

      legDefs.forEach((leg)=>{
        const sw=Math.sin(t*0.04+phase+leg.off)*0.12;
        const kx=leg.bx+Math.sin(sw)*26, ky=cy+28+Math.cos(sw)*26;
        const lsw=sw*0.5+0.05;
        const hx2=kx+Math.sin(lsw)*24, hy2=ky+Math.cos(lsw)*24;
        hoofPos.push({hx:hx2,hy:hy2});
        ctx.lineCap="round";
        ctx.strokeStyle=CREAM; ctx.lineWidth=12;
        ctx.beginPath(); ctx.moveTo(leg.bx,cy+28); ctx.lineTo(kx,ky); ctx.lineTo(hx2,hy2); ctx.stroke();
        ctx.strokeStyle=BK; ctx.lineWidth=1.8;
        ctx.beginPath(); ctx.moveTo(leg.bx,cy+28); ctx.lineTo(kx,ky); ctx.lineTo(hx2,hy2); ctx.stroke();
        ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(kx,ky,3,0,Math.PI*2); ctx.fill(); ctx.stroke();
        h(leg.bx-4,cy+38,leg.bx+4,cy+38); h(leg.bx-3,cy+46,leg.bx+3,cy+46);
        ctx.fillStyle=BK;
        ctx.beginPath(); ctx.ellipse(hx2,hy2+4,7,3.5,sw*0.3,0,Math.PI*2); ctx.fill();
        pl(hx2,hy2+1,hx2,hy2+7,0.9,PAPER,0.7);
      });

      // udder
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.ellipse(x-dir*2,cy+42,20,11,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      h(x-16,cy+43,x+16,cy+43);
      ctx.strokeStyle=BK; ctx.lineWidth=1;
      [-8,-3,3,8].forEach(dx=>{
        ctx.beginPath(); ctx.moveTo(x-dir*2+dx,cy+51); ctx.lineTo(x-dir*2+dx,cy+57); ctx.stroke();
      });

      // body
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=2.5;
      ctx.beginPath();
      ctx.moveTo(x+dir*54,cy-6);
      ctx.bezierCurveTo(x+dir*56,cy-28,x+dir*32,cy-40,x+dir*10,cy-36);
      ctx.bezierCurveTo(x-dir*10,cy-32,x-dir*42,cy-26,x-dir*54,cy-10);
      ctx.bezierCurveTo(x-dir*58,cy+4,x-dir*50,cy+28,x-dir*24,cy+36);
      ctx.bezierCurveTo(x-dir*8,cy+42,x+dir*8,cy+42,x+dir*28,cy+34);
      ctx.bezierCurveTo(x+dir*48,cy+24,x+dir*58,cy+8,x+dir*54,cy-6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      for(let i=-3;i<=3;i++) h(x+i*16-28,cy-32,x+i*16+28,cy+30);
      [-20,-8,4,16].forEach(dy=>h(x-46,cy+dy,x+46,cy+dy));

      // patches
      ([
        [dir*24,-16,22,14,0.2,0.82],
        [-dir*10,-4,16,11,-0.3,0.80],
        [dir*6,18,13,9,0.1,0.75],
        [-dir*32,-14,9,7,0.4,0.70],
      ] as [number,number,number,number,number,number][]).forEach(([dx,dy,rx,ry,a,op])=>{
        ctx.globalAlpha=op; ctx.fillStyle=BK;
        ctx.beginPath(); ctx.ellipse(x+dx,cy+dy,rx,ry,a,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1; ctx.strokeStyle=BK; ctx.lineWidth=1;
        ctx.beginPath(); ctx.ellipse(x+dx,cy+dy,rx,ry,a,0,Math.PI*2); ctx.stroke();
      });

      // circuit trace
      ctx.strokeStyle=GR; ctx.lineWidth=0.8; ctx.setLineDash([3,3]); ctx.globalAlpha=0.28;
      ctx.beginPath(); ctx.moveTo(x-18,cy-12); ctx.lineTo(x+18,cy-12); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha=1;

      // tail
      const tw=Math.sin(t*0.06+phase)*0.32;
      const tbx=x-dir*52,tby=cy-12;
      ctx.strokeStyle=BK; ctx.lineWidth=2.5; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(tbx,tby);
      ctx.quadraticCurveTo(tbx-dir*12+Math.sin(tw)*18,tby-26,tbx-dir*16+Math.sin(tw*1.4)*14,tby-44);
      ctx.stroke();
      const tipX=tbx-dir*16+Math.sin(tw*1.4)*14,tipY=tby-48;
      ctx.fillStyle="#2a1a0a"; ctx.strokeStyle=BK; ctx.lineWidth=1;
      ctx.beginPath(); ctx.ellipse(tipX,tipY,5,9,tw,0,Math.PI*2); ctx.fill(); ctx.stroke();
      for(let i=-2;i<=2;i++){
        ctx.strokeStyle="#2a1a0a"; ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.moveTo(tipX,tipY); ctx.lineTo(tipX+i*4,tipY-13+Math.abs(i)); ctx.stroke();
      }

      // neck
      const nBX=x+dir*50,nBY=cy-8;
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(nBX,nBY-12);
      ctx.bezierCurveTo(nBX+dir*8,nBY-32,nBX+dir*18,nBY-52,nBX+dir*22,nBY-66);
      ctx.bezierCurveTo(nBX+dir*26,nBY-78,nBX+dir*20,nBY-84,nBX+dir*12,nBY-76);
      ctx.bezierCurveTo(nBX+dir*6,nBY-62,nBX,nBY-44,nBX-dir*4,nBY-16);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      h(nBX+dir*4,nBY-34,nBX+dir*18,nBY-52);
      h(nBX+dir*2,nBY-48,nBX+dir*16,nBY-60);

      // dewlap
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=1.3; ctx.globalAlpha=0.8;
      ctx.beginPath();
      ctx.moveTo(nBX,nBY-14);
      ctx.bezierCurveTo(nBX+dir*10,nBY-2,nBX+dir*24,nBY+4,nBX+dir*32,nBY);
      ctx.bezierCurveTo(nBX+dir*24,nBY-10,nBX+dir*10,nBY-18,nBX,nBY-14);
      ctx.fill(); ctx.stroke(); ctx.globalAlpha=1;

      // collar
      const cX=nBX+dir*12,cY=nBY-36;
      ctx.fillStyle="rgba(78,133,101,0.15)"; ctx.strokeStyle=GR; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.roundRect(cX-12,cY,24,8,3); ctx.fill(); ctx.stroke();
      for(let i=0;i<3;i++) glowDot(cX-7+i*7,cY+4,i*1.3+phase);

      // bolts
      [nBX-dir*8,nBX+dir*6].forEach(bx=>{
        ctx.fillStyle=GR; ctx.strokeStyle=BK; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.arc(bx,nBY-20,4,0,Math.PI*2); ctx.fill(); ctx.stroke();
      });

      // HEAD
      const hx=nBX+dir*30,hy=nBY-80;
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(hx-dir*24,hy+10);
      ctx.bezierCurveTo(hx-dir*28,hy-14,hx-dir*18,hy-30,hx,hy-34);
      ctx.bezierCurveTo(hx+dir*14,hy-30,hx+dir*22,hy-18,hx+dir*24,hy-4);
      ctx.bezierCurveTo(hx+dir*26,hy+8,hx+dir*22,hy+20,hx+dir*18,hy+24);
      ctx.bezierCurveTo(hx+dir*12,hy+30,hx+dir*4,hy+32,hx-dir*4,hy+30);
      ctx.bezierCurveTo(hx-dir*14,hy+28,hx-dir*22,hy+22,hx-dir*24,hy+10);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      h(hx-dir*20,hy-10,hx+dir*20,hy-10);
      h(hx-dir*22,hy+4,hx+dir*22,hy+4);
      h(hx-dir*20,hy+16,hx+dir*18,hy+16);

      // muzzle
      const mz={x:hx+dir*20,y:hy+10};
      ctx.fillStyle=CREAM; ctx.strokeStyle=BK; ctx.lineWidth=1.8;
      ctx.beginPath();
      ctx.moveTo(mz.x,mz.y-14);
      ctx.bezierCurveTo(mz.x+dir*12,mz.y-16,mz.x+dir*20,mz.y-10,mz.x+dir*22,mz.y);
      ctx.bezierCurveTo(mz.x+dir*24,mz.y+12,mz.x+dir*20,mz.y+24,mz.x+dir*10,mz.y+28);
      ctx.bezierCurveTo(mz.x,mz.y+30,mz.x-dir*8,mz.y+26,mz.x-dir*10,mz.y+16);
      ctx.bezierCurveTo(mz.x-dir*12,mz.y+6,mz.x-dir*8,mz.y-8,mz.x,mz.y-14);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      h(mz.x-dir*4,mz.y+8,mz.x+dir*18,mz.y+8);
      ctx.fillStyle=BK;
      ctx.beginPath(); ctx.ellipse(mz.x+dir*4,mz.y+14,3.5,2.5,dir*0.15,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(mz.x+dir*16,mz.y+14,3.5,2.5,dir*0.15,0,Math.PI*2); ctx.fill();

      // chew jaw
      const chew=0.5+0.5*Math.sin(t*0.07+phase);
      ctx.strokeStyle=BK; ctx.lineWidth=1.4;
      ctx.beginPath();
      ctx.moveTo(mz.x-dir*8,mz.y+22);
      ctx.quadraticCurveTo(mz.x+dir*8,mz.y+28+chew*5,mz.x+dir*18,mz.y+22);
      ctx.stroke();
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=1; ctx.globalAlpha=0.55;
      ctx.beginPath(); ctx.ellipse(mz.x+dir*5,mz.y+26+chew*3,12,3.5+chew*2,0,0,Math.PI,false);
      ctx.fill(); ctx.stroke(); ctx.globalAlpha=1;

      // eye
      const ex=hx+dir*6,ey=hy-4;
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.ellipse(ex,ey,8,6.5,dir*0.1,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=GR; ctx.beginPath(); ctx.ellipse(ex,ey,5,4.5,0,0,Math.PI*2); ctx.fill();
      const blink=Math.sin(t*0.035+phase);
      if(blink>0.92){
        ctx.fillStyle=PAPER; ctx.beginPath(); ctx.ellipse(ex,ey,8,1.2,0,0,Math.PI*2); ctx.fill();
      } else {
        ctx.fillStyle=BK; ctx.beginPath(); ctx.ellipse(ex,ey,3,3.5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(ex+dir*1.5,ey-1.5,1.5,0,Math.PI*2); ctx.fill();
      }
      for(let i=-2;i<=2;i++){
        ctx.strokeStyle=BK; ctx.lineWidth=0.9;
        ctx.beginPath(); ctx.moveTo(ex+i*3,ey-5.5); ctx.lineTo(ex+i*3+dir*i*0.5,ey-10); ctx.stroke();
      }

      // ear
      const earX=hx-dir*18,earY=hy-16;
      const ef=Math.sin(t*0.04+phase*1.2)*5;
      ctx.fillStyle=PAPER; ctx.strokeStyle=BK; ctx.lineWidth=1.8;
      ctx.beginPath();
      ctx.moveTo(earX,earY+4);
      ctx.bezierCurveTo(earX-dir*4,earY-10+ef,earX-dir*16,earY-24+ef,earX-dir*22,earY-16+ef);
      ctx.bezierCurveTo(earX-dir*26,earY-8+ef,earX-dir*20,earY+4,earX-dir*8,earY+10);
      ctx.bezierCurveTo(earX-dir*2,earY+14,earX+dir*2,earY+12,earX,earY+4);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#f0c8b8"; ctx.strokeStyle="#d09080"; ctx.lineWidth=0.8; ctx.globalAlpha=0.65;
      ctx.beginPath();
      ctx.moveTo(earX-dir*2,earY+4);
      ctx.bezierCurveTo(earX-dir*6,earY-6+ef,earX-dir*14,earY-18+ef,earX-dir*18,earY-12+ef);
      ctx.bezierCurveTo(earX-dir*20,earY-6+ef,earX-dir*16,earY+4,earX-dir*8,earY+8);
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.globalAlpha=1;

      // horn
      ctx.strokeStyle=BK; ctx.lineWidth=2.8; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(hx-dir*4,hy-30);
      ctx.bezierCurveTo(hx-dir*2,hy-44,hx+dir*10,hy-48,hx+dir*14,hy-42); ctx.stroke();
      ctx.strokeStyle=PAPER; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(hx-dir*2,hy-36); ctx.lineTo(hx+dir*8,hy-44); ctx.stroke();

      // antenna
      pl(hx-dir*2,hy-32,hx-dir*2,hy-50,1.6);
      antPulse(hx-dir*2,hy-52,phase);

      // ID tag
      ctx.fillStyle="rgba(78,133,101,0.12)"; ctx.strokeStyle=GR; ctx.lineWidth=1;
      ctx.beginPath(); ctx.roundRect(hx-22,hy+10,44,11,2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=GR; ctx.font='bold 7px "Courier New"'; ctx.textAlign="center";
      ctx.fillText(agentId,hx,hy+19);

      // note cards
      cards.forEach(card=>{
        const legIdx=card.col*2+card.row;
        const lp=hoofPos[Math.min(legIdx,3)];
        const pullY=Math.sin(t*0.04+lp.hx*0.008)*9;
        const cardX=card.col===0
          ? x+dir*66+(dir>0?4:-74)
          : x-dir*66+(dir>0?-74:4);
        const cardY=card.row===0?cy-20:cy+50;
        silk(lp.hx,lp.hy,cardX+35,cardY+pullY+4);
        noteCard(cardX,cardY+pullY,card.title,card.sub,lp.hx*0.01+phase);
      });
    }

    // ── FARMHOUSE — NO filled background rectangles ──
    function drawFarmhouse(){
      // roof — hand-drawn wobbly outline
      ctx.strokeStyle=BK; ctx.lineWidth=2.2; ctx.lineCap="round";
      // left slope — slightly wobbly
      ctx.beginPath();
      ctx.moveTo(225,187);
      ctx.bezierCurveTo(258,165, 295,142, 340,119);
      ctx.stroke();
      // right slope — slightly wobbly
      ctx.beginPath();
      ctx.moveTo(340,119);
      ctx.bezierCurveTo(385,141, 418,163, 455,187);
      ctx.stroke();
      // base line — very slightly uneven
      ctx.beginPath();
      ctx.moveTo(225,187);
      ctx.bezierCurveTo(280,185, 390,188, 455,187);
      ctx.stroke();
      // roof hatch lines only
      for(let i=1;i<=5;i++){
        const f=i/6;
        h(340,120,340-116*f,120+66*f); h(340,120,340+116*f,120+66*f);
      }
      // ridge line — slightly wobbly
      ctx.strokeStyle=BK; ctx.lineWidth=1; ctx.globalAlpha=0.3;
      ctx.beginPath();
      ctx.moveTo(340,119);
      ctx.bezierCurveTo(341,140, 339,162, 340,187);
      ctx.stroke();
      ctx.globalAlpha=1;

      // barn walls — stroke only with hatch, no fill
      ctx.strokeStyle=BK; ctx.lineWidth=2;
      ctx.beginPath(); ctx.rect(240,186,200,129); ctx.stroke();
      for(let dy=0;dy<118;dy+=15) h(246,194+dy,434,194+dy);
      // vertical plank lines
      for(let dx=0;dx<190;dx+=22) h(246+dx,186,246+dx,315);

      // silos — stroke only
      [[193,228,50,88],[437,240,42,75]].forEach(([sx,sy,sw,sh])=>{
        ctx.strokeStyle=BK; ctx.lineWidth=1.8;
        ctx.beginPath(); ctx.roundRect(sx,sy,sw,sh,4); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(sx+sw/2,sy,sw/2,10,0,0,Math.PI*2); ctx.stroke();
        for(let i=0;i<4;i++) h(sx+4,sy+16+i*18,sx+sw-4,sy+16+i*18);
        // silo vertical lines
        ctx.lineWidth=0.7;
        [0.3,0.6].forEach(f=>{
          h(sx+sw*f,sy,sx+sw*f,sy+sh);
        });
      });

      // door — stroke + inner hatch, no fill
      ctx.strokeStyle=BK; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.roundRect(302,264,76,51,2); ctx.stroke();
      pl(340,264,340,315,1.2); h(302,290,378,290);
      // door panels
      h(302,277,340,277); h(340,277,378,277);
      ctx.fillStyle=GR; ctx.strokeStyle=BK; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(336,292,3,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(344,292,3,0,Math.PI*2); ctx.fill(); ctx.stroke();

      // window frames — stroke only
      [[252,200],[372,200]].forEach(([wx,wy],idx)=>{
        ctx.strokeStyle=BK; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.rect(wx,wy,36,28); ctx.stroke();
        pl(wx+18,wy,wx+18,wy+28,1); pl(wx,wy+14,wx+36,wy+14,1);
        // AI screen — green lines only, no bg fill
        const fl=0.6+0.4*Math.sin(t*0.04+idx*2);
        pl(wx+4,wy+6, wx+30,wy+6, 0.9,GR,fl*0.8);
        pl(wx+4,wy+10,wx+24,wy+10,0.9,GR,fl*0.5);
        pl(wx+4,wy+18,wx+28,wy+18,0.9,GR,fl*0.35);
        glowDot(wx+28,wy+6,idx*2.1);
        ctx.fillStyle=GR; ctx.font='6px "Courier New"'; ctx.textAlign="left"; ctx.globalAlpha=0.65;
        ctx.fillText(idx===0?"AGENT-1":"AGENT-2",wx+2,wy+25); ctx.globalAlpha=1;
      });

      // heartbeat monitors
      [[248,308],[388,308]].forEach(([mx,my],idx)=>{
        const s=0.92+0.08*Math.sin(t*0.07+idx*1.3);
        ctx.save(); ctx.translate(mx+40,my); ctx.scale(s,1);
        ctx.strokeStyle=GR; ctx.lineWidth=1; ctx.globalAlpha=0.6;
        ctx.beginPath();
        ctx.moveTo(-38,0); ctx.lineTo(-26,0); ctx.lineTo(-22,-8);
        ctx.lineTo(-18,10); ctx.lineTo(-14,-8); ctx.lineTo(-10,0); ctx.lineTo(2,0);
        ctx.stroke(); ctx.restore(); ctx.globalAlpha=1;
      });

      // sign — white fill
      ctx.fillStyle="#ffffff"; ctx.strokeStyle=BK; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.roundRect(292,130,96,20,3); ctx.fill(); ctx.stroke();
      ctx.fillStyle=GR; ctx.font='bold 9px "Courier New"'; ctx.textAlign="center";
      ctx.fillText("AGENT FARM HQ",340,144);
      ctx.fillStyle=GR; ctx.font='7px "Courier New"'; ctx.globalAlpha=0.6;
      ctx.fillText("llm router",340,158); ctx.globalAlpha=1;
      pl(340,160,340,178,0.8,GR,0.35);

      // circuit traces on barn
      ctx.strokeStyle=GR; ctx.lineWidth=0.8; ctx.setLineDash([3,3]); ctx.globalAlpha=0.38;
      ctx.beginPath(); ctx.moveTo(288,214); ctx.lineTo(288,236); ctx.lineTo(302,236); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(408,214); ctx.lineTo(408,236); ctx.lineTo(376,236); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha=1;
    }

    function drawSky(){
      // ── SUN — circle with rays all around ──
      const sx=618, sy=50, sr=22;
      ctx.strokeStyle=BK; ctx.lineWidth=1.8; ctx.lineCap="round";
      ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.stroke();
      // 12 rays evenly spaced
      for(let i=0;i<12;i++){
        const angle = (i/12)*Math.PI*2;
        const inner = sr+5;
        const outer = sr+14+(i%3===0?4:0); // vary length slightly
        ctx.strokeStyle=BK; ctx.lineWidth=1.4; ctx.globalAlpha=0.75;
        ctx.beginPath();
        ctx.moveTo(sx+Math.cos(angle)*inner, sy+Math.sin(angle)*inner);
        ctx.lineTo(sx+Math.cos(angle)*outer, sy+Math.sin(angle)*outer);
        ctx.stroke();
        ctx.globalAlpha=1;
      }
      antPulse(sx,sy-sr-18,0);

      // ── CLOUDS — bumpy hand-drawn path ──
      [[82,60,0],[358,44,3]].forEach(([cloudX,cloudY,cphase])=>{
        const drift=Math.sin(t*0.007+cphase)*8;
        const cx=cloudX+drift, cy=cloudY;
        ctx.strokeStyle=BK; ctx.lineWidth=1.6; ctx.lineCap="round"; ctx.lineJoin="round";
        ctx.beginPath();
        // bumpy top using quadratic curves — classic cloud silhouette
        ctx.moveTo(cx+4, cy+14);
        ctx.quadraticCurveTo(cx+0,  cy+14, cx+0,  cy+10);
        ctx.quadraticCurveTo(cx+0,  cy+2,  cx+10, cy+2);
        ctx.quadraticCurveTo(cx+12, cy-8,  cx+22, cy-8);
        ctx.quadraticCurveTo(cx+28, cy-16, cx+38, cy-12);
        ctx.quadraticCurveTo(cx+48, cy-14, cx+52, cy-6);
        ctx.quadraticCurveTo(cx+62, cy-4,  cx+62, cy+4);
        ctx.quadraticCurveTo(cx+62, cy+14, cx+56, cy+14);
        ctx.lineTo(cx+4, cy+14);
        ctx.stroke();
        ctx.fillStyle=GR; ctx.font='7px "Courier New"'; ctx.textAlign="center"; ctx.globalAlpha=0.6;
        ctx.fillText(cphase===0?"llm cloud":"rag store", cx+31, cy+12); ctx.globalAlpha=1;
      });

      // data streams
      ctx.strokeStyle=GR; ctx.lineWidth=1; ctx.setLineDash([5,4]); ctx.globalAlpha=0.3;
      ctx.beginPath(); ctx.moveTo(154,58); ctx.quadraticCurveTo(242,98,290,160); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(416,42); ctx.quadraticCurveTo(432,96,418,160); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha=1;

      // drone
      const bx=(t*0.35)%860-60;
      pl(bx,86,bx+10,82,1.4,BK,0.6); pl(bx+13,83,bx+23,86,1.4,BK,0.6);
      ctx.fillStyle=GR; ctx.font='6px "Courier New"'; ctx.textAlign="left"; ctx.globalAlpha=0.4;
      ctx.fillText("scout",bx,96); ctx.globalAlpha=1;
    }

    function drawHills(){
      // hills — stroke only
      ctx.strokeStyle=BK; ctx.lineWidth=1.8;
      ctx.beginPath();
      ctx.moveTo(0,370); ctx.bezierCurveTo(80,324,180,342,280,330);
      ctx.bezierCurveTo(340,322,400,330,480,340);
      ctx.bezierCurveTo(560,328,640,338,W,354);
      ctx.lineTo(W,415); ctx.lineTo(0,415); ctx.closePath();
      ctx.stroke();
      h(0,386,200,374); h(0,398,180,388);
      h(460,376,W,368); h(440,388,W,380);
    }

    function drawGround(){
      // ground — stroke only with hatch lines
      ctx.strokeStyle=BK; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(0,415); ctx.lineTo(W,415); ctx.stroke();
      for(let y=428;y<468;y+=14) h(0,y,W,y);
      [[44,418],[188,419],[464,418],[612,419]].forEach(([gx,gy])=>{
        pl(gx,gy,gx+2,gy-7,1.3); pl(gx+4,gy,gx+6,gy-6,1.3);
      });
      // sensor bus
      ctx.strokeStyle=GR; ctx.lineWidth=0.8; ctx.setLineDash([4,4]); ctx.globalAlpha=0.3;
      pl(56,428,624,428,0.8,GR,0.3);
      ctx.setLineDash([]); ctx.globalAlpha=1;
      [118,340,562].forEach((sx,i)=>glowDot(sx,428,i*1.6));
      ctx.fillStyle=GR; ctx.font='6px "Courier New"'; ctx.textAlign="left"; ctx.globalAlpha=0.5;
      ctx.fillText("soil sensor bus  //  event stream",144,440); ctx.globalAlpha=1;
    }

    function drawFence(){
      pl(40,384,200,368,2.2); pl(40,394,200,378,1.6);
      [55,89,123,157].forEach(fx=>pl(fx,382,fx,397,2.5));
      pl(480,368,640,384,2.2); pl(480,378,640,394,1.6);
      [496,530,564,598].forEach(fx=>pl(fx,366+(fx-480)*0.04,fx,382+(fx-480)*0.04,2.5));
      glowDot(89,380,0.5); glowDot(530,372,1.8);
    }

    function drawMesh(){
      const p=0.2+0.2*Math.sin(t*0.03);
      ctx.strokeStyle=GR; ctx.lineWidth=1.3; ctx.setLineDash([6,4]); ctx.globalAlpha=p;
      ctx.beginPath(); ctx.moveTo(220,393); ctx.quadraticCurveTo(340,356,450,393); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha=1;
      const mp=0.45+0.45*Math.sin(t*0.05);
      ctx.globalAlpha=mp; ctx.fillStyle=GR;
      ctx.beginPath(); ctx.arc(340,360,4+mp*2.5,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      [[330,350,350,350,1.2,0.5],[323,356,357,356,1,0.36],[316,362,364,362,0.8,0.24]]
        .forEach(([x1,y1,x2,y2,lw,op])=>{
          ctx.strokeStyle=GR; ctx.lineWidth=lw; ctx.globalAlpha=op;
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(340,342,x2,y2); ctx.stroke();
          ctx.globalAlpha=1;
        });
      ctx.fillStyle=GR; ctx.font='7px "Courier New"'; ctx.textAlign="center"; ctx.globalAlpha=0.5;
      ctx.fillText("a2a mesh",340,376); ctx.globalAlpha=1;
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      t++;

      paperLines();
      drawSky();
      drawHills();
      drawGround();
      drawFence();
      drawFarmhouse();
      drawMesh();

      // ── TREE — simple cartoon style ──
      const tx = 68, ty = 370;

      // trunk
      ctx.strokeStyle = BK; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tx - 3, ty);
      ctx.bezierCurveTo(tx - 2, ty - 30, tx + 2, ty - 52, tx, ty - 68);
      ctx.stroke();

      // canopy path helper — reused for clip + stroke
      function canopyPath() {
        ctx.beginPath();
        ctx.moveTo(tx, ty - 68);
        ctx.bezierCurveTo(tx + 8,  ty - 82,  tx + 30, ty - 81, tx + 33, ty - 98);
        ctx.bezierCurveTo(tx + 36, ty - 114, tx + 21, ty - 126, tx + 8,  ty - 122);
        ctx.bezierCurveTo(tx + 11, ty - 137, tx + 2,  ty - 144, tx - 6,  ty - 135);
        ctx.bezierCurveTo(tx - 14, ty - 147, tx - 27, ty - 138, tx - 26, ty - 122);
        ctx.bezierCurveTo(tx - 39, ty - 119, tx - 41, ty - 102, tx - 29, ty - 93);
        ctx.bezierCurveTo(tx - 33, ty - 81,  tx - 18, ty - 72,  tx,      ty - 68);
        ctx.closePath();
      }

      // clip to canopy and fill with pencil hatching
      ctx.save();
      canopyPath();
      ctx.clip();
      // diagonal hatch lines — green, thin, slightly varied spacing
      ctx.strokeStyle = GR; ctx.lineWidth = 0.7; ctx.globalAlpha = 0.55; ctx.lineCap = "round";
      for (let i = -120; i < 120; i += 5) {
        ctx.beginPath();
        ctx.moveTo(tx + i,       ty - 68);
        ctx.lineTo(tx + i + 80,  ty - 148);
        ctx.stroke();
      }
      ctx.restore();

      // canopy outline on top
      ctx.strokeStyle = BK; ctx.lineWidth = 1.6; ctx.globalAlpha = 1;
      canopyPath();
      ctx.stroke();

      // cows
      const g1=Math.sin(t*0.016)*5;
      const g2=Math.sin(t*0.014+1)*5;
      const cowY=570;

      drawCow(148,cowY,+1,"BESSIE-01",0,g1,[
        {col:0,row:0,title:"scan soil",sub:"sensor read"},
        {col:0,row:1,title:"irrigate", sub:"auto-valve"},
        {col:1,row:0,title:"seed plan",sub:"llm decide"},
        {col:1,row:1,title:"harvest",  sub:"yield agent"},
      ]);

      drawCow(532,cowY,-1,"CLARA-02",1.4,g2,[
        {col:0,row:0,title:"ingest",  sub:"rag pipeline"},
        {col:0,row:1,title:"reason",  sub:"chain-thought"},
        {col:1,row:0,title:"reflect", sub:"self-critique"},
        {col:1,row:1,title:"act",     sub:"tool use"},
      ]);

      // cow labels
      ctx.fillStyle=GR; ctx.font='7px "Courier New"'; ctx.textAlign="center"; ctx.globalAlpha=0.75;
      ctx.fillText("BESSIE-01  //  field ops agent",  148+g1,408);
      ctx.fillText("CLARA-02  //  data + yield agent",532+g2,408);
      ctx.globalAlpha=1;

      // signature
      ctx.fillStyle=GR; ctx.font='10px "Courier New"'; ctx.textAlign="center";
      ctx.fillText("agent cows v2.2  //  autonomous farm edition",340,H-12);

      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{width:"100%",display:"block",background:"transparent"}}
    />
  );
}
