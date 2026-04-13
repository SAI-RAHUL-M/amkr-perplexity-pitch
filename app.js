/* ═══════════════════════════════
   AMKR PITCH v3 — App Logic
   ═══════════════════════════════ */

// ── THEME ────────────────────────────
(function(){
  const btn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let t = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', t);
  const moon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sun  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  if (btn) {
    btn.innerHTML = t === 'dark' ? moon : sun;
    btn.addEventListener('click', () => {
      t = t === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', t);
      btn.innerHTML = t === 'dark' ? moon : sun;
      setTimeout(rebuildCharts, 60);
    });
  }
})();

// ── HERO CANVAS ───────────────────────
function initCanvas() {
  const cv = document.getElementById('heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, nodes = [], raf;
  const dark = () => document.documentElement.getAttribute('data-theme') !== 'light';
  function resize() {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
    nodes = [];
    const n = Math.max(30, Math.floor(W * H / 6500));
    for (let i = 0; i < n; i++) nodes.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28, r:Math.random()*2.2+.8, p:Math.random()*Math.PI*2 });
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    const ac = dark() ? '#00d4aa' : '#007a62';
    const lc = dark() ? 'rgba(0,212,170,' : 'rgba(0,122,98,';
    nodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy; n.p+=.018;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
      const s=1+Math.sin(n.p)*.28;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*s,0,Math.PI*2);
      ctx.fillStyle=dark()?'rgba(0,212,170,.45)':'rgba(0,122,98,.35)';
      ctx.fill();
    });
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++) {
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<145) { ctx.beginPath(); ctx.strokeStyle=lc+(1-d/145)*.28+')'; ctx.lineWidth=.75; ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke(); }
    }
    raf=requestAnimationFrame(draw);
  }
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw()});
  resize(); draw();
}

// ── COUNTER ANIMATIONS ─────────────────
function initCounters() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, tgt = parseFloat(el.getAttribute('data-count')), sfx = el.getAttribute('data-sfx')||'', dur = 1400, start = performance.now();
    const step = now => { const t=Math.min((now-start)/dur,1), ease=1-Math.pow(1-t,3); el.textContent=Math.round(tgt*ease)+sfx; if(t<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    obs.unobserve(el);
  }), { threshold:.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

// ── FADE UP ────────────────────────────
function initFadeUps() {
  const sel = '.mcrd,.rcrd,.rcrd2,.icrd,.scn,.tl-item,.hstat,.tgt,.oc,.tsbox,.sig-card,.vt';
  const els = document.querySelectorAll(sel);
  els.forEach(el => el.classList.add('fade-up'));
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = Array.from(e.target.parentElement?.children||[]).filter(c=>c.classList.contains('fade-up'));
    const idx = sibs.indexOf(e.target);
    setTimeout(()=>e.target.classList.add('visible'), idx*70);
    obs.unobserve(e.target);
  }), {threshold:.08});
  els.forEach(el => obs.observe(el));
}

// ── MOAT BAR ANIMATIONS ────────────────
function initMoatBars() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const bar = e.target, w = bar.style.getPropertyValue('--w');
    bar.style.width = '0%';
    bar.style.transition = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = 'width 1.3s cubic-bezier(.16,1,.3,1)'; bar.style.width = w; }));
    obs.unobserve(bar);
  }), {threshold:.5});
  document.querySelectorAll('.mfill').forEach(b => obs.observe(b));
}

// ── NAV ACTIVE ─────────────────────────
function initNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
    links.forEach(a => { const h = a.getAttribute('href')?.replace('#',''); a.classList.toggle('active', h===cur); });
    if (navbar) navbar.style.borderBottomColor = window.scrollY > 50 ? 'var(--brd-str)' : 'var(--brd)';
  }, {passive:true});
}

// ── CSS ────────────────────────────────
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function c() {
  return {
    accent:css('--accent'), pos:css('--pos'), neg:css('--neg'),
    gold:css('--gold'), blue:css('--blue'), text:css('--text'),
    muted:css('--text-muted'), faint:css('--text-faint'),
    brd:css('--brd-str'), card:css('--bg-card'), surf:css('--bg-surf'),
    warn:css('--warn'),
  };
}

// ── CHARTS ─────────────────────────────
Chart.defaults.animation.duration = 850;
const CH = {};
function kill(id) { if(CH[id]){CH[id].destroy();delete CH[id];} }

function buildRevChart() {
  kill('rev');
  const cv = document.getElementById('revChart'); if(!cv) return;
  const k = c();
  const labels = ['FY21A','FY22A','FY23A','FY24A','FY25A','FY26E','FY27E','FY28E','FY29E','FY30E'];
  const rev = [6138,7092,6503,6318,6708,7459,8257,8761,9550,10314];
  const margin = [21.7,21.5,17.4,17.3,17.3,17.8,19.5,19.5,20.0,20.5];
  const CUT = 4;
  CH['rev'] = new Chart(cv, {
    data: {
      labels,
      datasets: [
        { type:'bar', label:'Revenue ($M)', data:rev, backgroundColor:labels.map((_,i)=>i<=CUT?k.accent+'55':k.accent+'a0'), borderColor:labels.map((_,i)=>i<=CUT?k.accent+'88':k.accent), borderWidth:labels.map((_,i)=>i<=CUT?1:2), borderRadius:4, yAxisID:'y' },
        { type:'line', label:'EBITDA Margin (%)', data:margin, borderColor:k.gold, backgroundColor:'transparent', borderWidth:2.5, pointRadius:4, pointBackgroundColor:k.gold, tension:.35, yAxisID:'y2', segment:{borderDash:ctx=>ctx.p0DataIndex>=CUT?[5,3]:[]} }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{labels:{color:k.muted,font:{family:'Space Mono',size:11},boxWidth:11,usePointStyle:true}},
        tooltip:{backgroundColor:k.card,titleColor:k.text,bodyColor:k.muted,borderColor:k.brd,borderWidth:1,callbacks:{label:ctx=>ctx.dataset.yAxisID==='y2'?` EBITDA Margin: ${ctx.parsed.y}%`:` Revenue: $${ctx.parsed.y.toLocaleString()}M`}}
      },
      scales:{
        x:{grid:{color:k.brd+'40'},ticks:{color:k.muted,font:{family:'Space Mono',size:10}}},
        y:{grid:{color:k.brd+'40'},ticks:{color:k.accent,font:{family:'Space Mono',size:10},callback:v=>`$${(v/1000).toFixed(1)}B`},position:'left'},
        y2:{grid:{display:false},ticks:{color:k.gold,font:{family:'Space Mono',size:10},callback:v=>`${v}%`},position:'right',min:14,max:24}
      }
    }
  });
}

function buildEpsChart() {
  kill('eps');
  const cv = document.getElementById('epsChart'); if(!cv) return;
  const k = c();
  const qtrs = ["Q1'24","Q2'24","Q3'24","Q4'24","Q1'25","Q2'25","Q3'25","Q4'25"];
  const actual = [0.32,0.41,0.55,0.50,0.26,0.42,0.63,0.69];
  const est    = [0.30,0.38,0.48,0.47,0.26,0.38,0.54,0.43];
  CH['eps'] = new Chart(cv, {
    type:'bar',
    data:{
      labels:qtrs,
      datasets:[
        { label:'Actual EPS ($)', data:actual, backgroundColor:actual.map((a,i)=>a>=est[i]?k.pos+'cc':k.neg+'cc'), borderRadius:4 },
        { label:'Consensus Est.', data:est, type:'line', borderColor:k.muted+'bb', backgroundColor:'transparent', borderWidth:1.5, borderDash:[4,3], pointRadius:3, pointBackgroundColor:k.muted, tension:0 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{labels:{color:k.muted,font:{family:'Space Mono',size:10},boxWidth:10,usePointStyle:true}},
        tooltip:{backgroundColor:k.card,titleColor:k.text,bodyColor:k.muted,borderColor:k.brd,borderWidth:1,
          callbacks:{afterBody:items=>{const i=items[0].dataIndex,b=((actual[i]/est[i]-1)*100).toFixed(0);return[`Beat: ${b>0?'+':''}${b}%`]}}
        }
      },
      scales:{
        x:{grid:{display:false},ticks:{color:k.muted,font:{family:'Space Mono',size:9}}},
        y:{grid:{color:k.brd+'40'},ticks:{color:k.muted,font:{family:'Space Mono',size:10},callback:v=>`$${v}`}}
      }
    }
  });
}

function buildAseChart() {
  kill('ase');
  const cv = document.getElementById('aseChart'); if(!cv) return;
  const k = c();
  const labels = ['2018','2019','2020','2021','2022','2023','2024','2025'];
  const asePS  = [0.66,0.86,0.74,0.81,0.62,1.09,1.23,1.74];
  const amkrNow = Array(labels.length).fill(1.65);
  CH['ase'] = new Chart(cv, {
    type:'line',
    data:{
      labels,
      datasets:[
        { label:'ASE P/S Multiple', data:asePS, borderColor:k.blue, backgroundColor:k.blue+'18', fill:true, borderWidth:2.5, pointRadius:5, pointBackgroundColor:labels.map((_,i)=>asePS[i]===Math.max(...asePS)?k.gold:k.blue), tension:.3 },
        { label:'AMKR Today (1.65×)', data:amkrNow, borderColor:k.accent, backgroundColor:'transparent', borderWidth:2, borderDash:[6,3], pointRadius:0, tension:0 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{labels:{color:k.muted,font:{family:'Space Mono',size:11},boxWidth:11,usePointStyle:true}},
        tooltip:{backgroundColor:k.card,titleColor:k.text,bodyColor:k.muted,borderColor:k.brd,borderWidth:1}
      },
      scales:{
        x:{grid:{color:k.brd+'40'},ticks:{color:k.muted,font:{family:'Space Mono',size:11}}},
        y:{grid:{color:k.brd+'40'},ticks:{color:k.muted,font:{family:'Space Mono',size:10},callback:v=>`${v.toFixed(1)}×`},min:0.4,max:2.0}
      }
    }
  });
}

function buildPsChart() {
  kill('ps');
  const cv = document.getElementById('psChart'); if(!cv) return;
  const k = c();
  const mults = [1.0,1.2,1.65,1.74,2.0,2.5,3.0,3.5,4.0,4.5];
  const labels = ['1.0×','1.2×\nBear','1.65×\nToday','1.74×\nASE','2.0×\nBase','2.5×','3.0×\nBull','3.5×','4.0×','4.5×'];
  const prices = mults.map(m => parseFloat((7459*m/247).toFixed(2)));
  const bgs = mults.map(m => m<1.65?k.neg+'88':m===1.65?k.warn+'bb':m<=2.0?k.accent+'aa':m<=3.0?k.pos+'aa':k.pos+'66');
  CH['ps'] = new Chart(cv, {
    type:'bar',
    data:{
      labels,
      datasets:[
        { label:'Implied Price/Share', data:prices, backgroundColor:bgs, borderRadius:5, borderSkipped:'bottom' },
        { label:'Current Price ($52.42)', data:Array(mults.length).fill(52.42), type:'line', borderColor:k.gold, backgroundColor:'transparent', borderWidth:2, borderDash:[6,3], pointRadius:0, tension:0 }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{labels:{color:k.muted,font:{family:'Space Mono',size:11},boxWidth:11,usePointStyle:true}},
        tooltip:{backgroundColor:k.card,titleColor:k.text,bodyColor:k.muted,borderColor:k.brd,borderWidth:1,
          callbacks:{label:ctx=>{if(ctx.dataset.type==='line')return' Current: $52.42';const u=((ctx.parsed.y/52.42-1)*100).toFixed(1);return` $${ctx.parsed.y.toFixed(2)} (${u>0?'+':''}${u}%)`}}
        }
      },
      scales:{
        x:{grid:{display:false},ticks:{color:k.muted,font:{family:'Space Mono',size:9}}},
        y:{grid:{color:k.brd+'40'},ticks:{color:k.muted,font:{family:'Space Mono',size:10},callback:v=>`$${v}`}}
      }
    }
  });
}

// ── INTERACTIVE DCF ────────────────────
function initSliders() {
  const BASE=6708, BASE_EM=0.173, SHARES=247, CUR=52.42;
  function update() {
    const rg=parseFloat(document.getElementById('sl-rev')?.value||11.2)/100;
    const im=parseFloat(document.getElementById('sl-mgn')?.value||30)/100;
    const ps=parseFloat(document.getElementById('sl-ps')?.value||2.0);
    const wc=parseFloat(document.getElementById('sl-wacc')?.value||10);
    document.getElementById('sv-rev').textContent=`${(rg*100).toFixed(1)}%`;
    document.getElementById('sv-mgn').textContent=`${(im*100).toFixed(0)}%`;
    document.getElementById('sv-ps').textContent=`${ps.toFixed(1)}×`;
    document.getElementById('sv-wacc').textContent=`${wc.toFixed(1)}%`;
    const rev26=BASE*(1+rg);
    const ebitda26=BASE*BASE_EM+(rev26-BASE)*im;
    const em=(ebitda26/rev26*100).toFixed(1);
    const price=(rev26*ps/SHARES).toFixed(2);
    const upside=((price/CUR-1)*100).toFixed(1);
    document.getElementById('out-rev').textContent=`$${Math.round(rev26).toLocaleString()}M`;
    document.getElementById('out-ebitda').textContent=`$${Math.round(ebitda26).toLocaleString()}M`;
    document.getElementById('out-em').textContent=`${em}%`;
    document.getElementById('out-price').textContent=`$${price}`;
    const uel=document.getElementById('out-up');
    uel.textContent=`${upside>=0?'+':''}${upside}% upside`;
    uel.className=`oc-up ${parseFloat(upside)>=0?'pos':'neg'}`;
  }
  ['sl-rev','sl-mgn','sl-ps','sl-wacc'].forEach(id=>document.getElementById(id)?.addEventListener('input',update));
  update();
}

// ── REBUILD ALL ────────────────────────
function rebuildCharts() {
  buildRevChart(); buildEpsChart(); buildAseChart(); buildPsChart();
}

// ── INIT ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initCounters();
  initFadeUps();
  initMoatBars();
  initNav();
  initSliders();
  rebuildCharts();
});
