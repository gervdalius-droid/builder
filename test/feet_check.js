// Pėdutės: one Ø8 × 10 hole per foot under the bottom, rows 50 mm from the front and the back (+ a middle row), counted as feet.
const E=require(process.argv[2]||'../src/engine.js');
const P=(p,a,b)=>{const q=p.place;return [0,1].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]);};
let bad=0,n=0; const B=m=>{bad++; if(bad<10) console.log(m);};
for(const W of [400,600,900,1200]) for(const D of [330,560]) for(const ly of [2,3]) for(const lx of [2,3,4]) for(const bot of ['under','inside']) for(const cols of [1,2]){
  if(cols>1&&W<600) continue;
  const c={W,H:720,D,thick:18,cols,cnc:{bottom:bot,bottomZ:bot==='inside'?60:0,joinery:'confirmat',back:'none',top:'rails',rails:{front:'h',back:'h'},legs:true,feet:true,legsX:lx,legsY:ly},sections:Array.from({length:cols},(_,k)=>({kind:'open',col:k,fill:true,shelves:0}))};
  const r=E.buildCabinet(c,0,'P'), bo=r.panels.find(p=>p.role==='DUGNAS'), Ds=D;
  const holes=bo.holes.filter(h=>h.op==='feet').map(h=>{const w=P(bo,h.x,h.y);return {x:w[0],y:w[1],h};});
  if(holes.length!==lx*ly) B('COUNT '+holes.length+' want '+lx*ly);
  holes.forEach(o=>{ n++; if(o.h.d!==8||o.h.depth!==10||o.h.face!=='B'||o.h.mark) B('HOLE '+JSON.stringify(o.h)); });
  const ys=[...new Set(r.legs.map(l=>Math.round(l.y)))].sort((a,b)=>a-b);
  if(ys[0]!==50||Math.abs(ys[ys.length-1]-(Ds-50))>0.5||ys.length!==ly) B('ROWS '+ys+' D'+Ds);
  r.legs.forEach(l=>{ if(!l.feet||l.d!==50||l.h!==10) B('LEG '+JSON.stringify(l)); if(!holes.some(o=>Math.hypot(o.x-l.x,o.y-l.y)<0.01)) B('FOOT WITHOUT HOLE '+JSON.stringify(l)); });
  const hw=r.hardware.find(h=>/Pėdutės/.test(h.item)); if(!hw||hw.qty!==lx*ly) B('HARDWARE');
  const xxl=E.programs(bo).files.map(f=>f.text).join('\n'); if((xxl.match(/Z=-10 D=8 N="P" F=1/g)||[]).length<lx*ly) B('NOT IN PROGRAM');
}
console.log(`${n} foot holes checked, ${bad} problems`); process.exit(bad?1:0);
