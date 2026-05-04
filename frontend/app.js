/* ═══════════════════════════════════════════════════════
   NegotiAI — app.js
   Main Application Logic
   Full Stack Expo 2026 | BTech CSE 2nd Year
═══════════════════════════════════════════════════════ */
'use strict';

/* ═══════════════════════════════════════════
   THREE.JS 3D INTRO
═══════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('c3d');
  const W = ()=>window.innerWidth, H = ()=>window.innerHeight;
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(W(),H());
  renderer.setClearColor(0x03080f,1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03080f, 0.012);

  const camera = new THREE.PerspectiveCamera(52, W()/H(), 0.1, 200);
  camera.position.set(0,0,24);

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0x112233, 1.5));
  const dl1 = new THREE.DirectionalLight(0x00d4ff, 3.5);
  dl1.position.set(8,12,10); scene.add(dl1);
  const dl2 = new THREE.DirectionalLight(0x4422ff, 1.5);
  dl2.position.set(-10,-6,6); scene.add(dl2);
  const dl3 = new THREE.DirectionalLight(0xff6600, 0.6);
  dl3.position.set(0,-10,-8); scene.add(dl3);

  /* ── Core glowing sphere ── */
  const coreMat = new THREE.MeshPhongMaterial({
    color:0x061828, emissive:0x001122, shininess:200,
    transparent:true, opacity:0.95
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(3.0,80,80), coreMat);
  scene.add(core);

  /* Wireframe over sphere */
  const wf = new THREE.Mesh(
    new THREE.SphereGeometry(3.05,20,20),
    new THREE.MeshBasicMaterial({color:0x00d4ff,wireframe:true,transparent:true,opacity:0.09})
  );
  scene.add(wf);

  /* Inner pulsing glow sphere */
  const glowMat = new THREE.MeshBasicMaterial({color:0x00d4ff,transparent:true,opacity:0.06});
  const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(3.4,32,32), glowMat);
  scene.add(glowSphere);

  /* ── Orbit rings ── */
  function ring(r, tube, col, rx, ry, rz){
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(r, tube, 20, 140),
      new THREE.MeshPhongMaterial({color:col,emissive:col,emissiveIntensity:0.5,transparent:true,opacity:0.5})
    );
    m.rotation.set(rx,ry,rz); scene.add(m); return m;
  }
  const r1 = ring(5.5,0.045,0x00d4ff, Math.PI/2.3, 0.4, 0);
  const r2 = ring(7.0,0.032,0x3366ff, Math.PI/3.2,-0.6, 0.3);
  const r3 = ring(8.8,0.022,0x0044aa, Math.PI/1.7, 0.9, 0.5);

  /* ── Orbiting nodes on ring 1 ── */
  const nodeC = [0x00d4ff,0xff8800,0x00ff99,0xff3388,0xffdd00];
  const nodes = nodeC.map((c,i)=>{
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.18,18,18),
      new THREE.MeshPhongMaterial({color:c,emissive:c,emissiveIntensity:0.7})
    );
    scene.add(m);
    return {mesh:m, angle:(i/5)*Math.PI*2, speed:0.25+i*0.05};
  });

  /* ── Floating geometric debris ── */
  const debris=[]; const debC=[0x00d4ff,0x0055ff,0x00ffaa,0xff5599,0xffaa00,0x44ddff,0x7755ff];
  for(let i=0;i<32;i++){
    const s=0.1+Math.random()*0.3;
    const geo=Math.random()>0.5?new THREE.BoxGeometry(s,s,s):new THREE.OctahedronGeometry(s*0.7);
    const mesh=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({
      color:debC[i%debC.length],emissive:debC[i%debC.length],emissiveIntensity:0.35,
      transparent:true,opacity:0.4+Math.random()*0.5
    }));
    const r=10+Math.random()*8, th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI;
    mesh.position.set(r*Math.sin(ph)*Math.cos(th), r*Math.sin(ph)*Math.sin(th), r*Math.cos(ph));
    mesh.userData={spd:0.004+Math.random()*0.01, fp:Math.random()*Math.PI*2, oy:mesh.position.y};
    scene.add(mesh); debris.push(mesh);
  }

  /* ── Data connection lines ── */
  for(let i=0;i<14;i++){
    const a=(i/14)*Math.PI*2, rr=5.5+Math.random()*4;
    const pts=[new THREE.Vector3(0,0,0), new THREE.Vector3(Math.cos(a)*rr,(Math.random()-0.5)*5,Math.sin(a)*rr)];
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({color:0x00d4ff,transparent:true,opacity:0.12})
    ));
  }

  /* ── Star field ── */
  const starPos=new Float32Array(2400*3);
  for(let i=0;i<2400*3;i++) starPos[i]=(Math.random()-0.5)*100;
  const stars=new THREE.BufferGeometry();
  stars.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  scene.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0x2255aa,size:0.1,transparent:true,opacity:0.5})));

  /* ── Mouse parallax ── */
  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{mx=(e.clientX/W()-0.5)*2;my=(e.clientY/H()-0.5)*2;});

  window.addEventListener('resize',()=>{
    camera.aspect=W()/H(); camera.updateProjectionMatrix();
    renderer.setSize(W(),H());
  });

  /* ── Animate ── */
  let t=0, alive=true;
  function animate(){
    if(!alive) return;
    requestAnimationFrame(animate);
    t+=0.013;

    core.rotation.y+=0.003; core.rotation.x+=0.001;
    wf.rotation.y-=0.005; wf.rotation.z+=0.002;
    glowSphere.material.opacity=0.04+Math.sin(t*1.5)*0.035;

    r1.rotation.z+=0.007; r2.rotation.z-=0.005; r3.rotation.y+=0.004;

    nodes.forEach((n,i)=>{
      n.angle+=n.speed*0.013;
      n.mesh.position.x=Math.cos(n.angle)*5.5;
      n.mesh.position.z=Math.sin(n.angle)*5.5*0.5;
      n.mesh.position.y=Math.sin(n.angle*1.4)*2;
    });

    debris.forEach(d=>{
      d.rotation.x+=d.userData.spd; d.rotation.y+=d.userData.spd*0.6;
      d.position.y=d.userData.oy+Math.sin(t+d.userData.fp)*0.5;
    });

    camera.position.x+=(mx*2.5-camera.position.x)*0.04;
    camera.position.y+=(-my*1.8-camera.position.y)*0.04;
    camera.lookAt(0,0,0);

    renderer.render(scene,camera);
  }
  animate();

  /* ── Enter site ── */
  window.enterSite=function(){
    alive=false;
    const intro=document.getElementById('intro');
    intro.classList.add('exit');
    document.getElementById('site').classList.add('visible');
    document.body.style.overflow='auto';
    setTimeout(()=>{ if(intro.parentElement) intro.remove(); }, 1100);
    // Init chart after site is visible and DOM is fully painted
    setTimeout(()=>{
      const pill=document.querySelector('.trend-pill.active');
      if(pill) switchTrend('iphone', pill);
    }, 600);
  };

  /* scroll / touch also triggers enter */
  let entered=false;
  const tryEnter=()=>{if(!entered){entered=true;enterSite();}};
  window.addEventListener('wheel',tryEnter,{passive:true});
  window.addEventListener('touchmove',tryEnter,{passive:true});
  document.body.style.overflow='hidden';
})();

/* ═══════════════════════════════════════════
   PRODUCT DATA
═══════════════════════════════════════════ */
const PRODUCTS=[
  {id:'p1',cat:'mobile',emoji:'📱',name:'Samsung Galaxy S24 Ultra 256GB',platform:'Amazon India',orig:129999,curr:118999,trend:'down',trendTxt:'↓ Falling',pred:'Likely to drop ₹4,000–₹6,000 in 2 weeks during upcoming sale.',conv:0},
  {id:'p2',cat:'mobile',emoji:'📱',name:'iPhone 15 Pro 128GB Natural Titanium',platform:'Flipkart',orig:134900,curr:129900,trend:'down',trendTxt:'↓ Falling',pred:'Festival season discounts expected. Wait 10 days for best price.',conv:1},
  {id:'p3',cat:'mobile',emoji:'📱',name:'OnePlus 12 256GB Silky Black',platform:'Amazon India',orig:64999,curr:59999,trend:'stable',trendTxt:'→ Stable',pred:'Price stable for 45 days. Good time to negotiate now.',conv:2},
  {id:'p4',cat:'mobile',emoji:'📱',name:'Realme GT 6 5G 128GB',platform:'Flipkart',orig:35999,curr:31999,trend:'down',trendTxt:'↓ Falling',pred:'Consistent downward trend. Another ₹2,000 drop expected soon.',conv:3},
  {id:'p5',cat:'laptop',emoji:'💻',name:'MacBook Air M3 8GB 256GB',platform:'Apple Store',orig:114900,curr:109900,trend:'down',trendTxt:'↓ Falling',pred:'Education discount season approaching. May hit ₹1,04,000 next month.',conv:1},
  {id:'p6',cat:'laptop',emoji:'💻',name:'Dell XPS 15 Core i7 13th Gen',platform:'Amazon India',orig:159990,curr:134990,trend:'down',trendTxt:'↓ Falling',pred:'Strong downward trend last 3 months. Consider buying now.',conv:0},
  {id:'p7',cat:'laptop',emoji:'💻',name:'HP Pavilion 15 Ryzen 5 16GB',platform:'Flipkart',orig:62990,curr:54990,trend:'stable',trendTxt:'→ Stable',pred:'Price stable. AI negotiation likely to save ₹3,000–₹5,000.',conv:3},
  {id:'p8',cat:'laptop',emoji:'💻',name:'ASUS ROG Strix G16 RTX 4060',platform:'Croma',orig:149990,curr:129990,trend:'up',trendTxt:'↑ Rising',pred:'Gaming laptop demand up. Buy now before further price rise.',conv:2},
  {id:'p9',cat:'tv',emoji:'📺',name:'LG 55" C3 OLED 4K Smart TV',platform:'Amazon India',orig:139990,curr:109990,trend:'down',trendTxt:'↓ Falling',pred:'OLED TV prices fall 8% every quarter. Great buy window now.',conv:2},
  {id:'p10',cat:'tv',emoji:'📺',name:'Samsung 65" QLED 4K Neo Series',platform:'Flipkart',orig:129990,curr:109990,trend:'down',trendTxt:'↓ Falling',pred:'End-of-year clearance likely to push another ₹8,000 drop.',conv:4},
  {id:'p11',cat:'tv',emoji:'📺',name:'Sony Bravia 50" X75L 4K Google TV',platform:'Amazon India',orig:82990,curr:69990,trend:'stable',trendTxt:'→ Stable',pred:'Stable for 2 months. Ideal time to negotiate using competitor price.',conv:0},
  {id:'p12',cat:'appliance',emoji:'🧊',name:'LG 655L Side-by-Side Refrigerator',platform:'Flipkart',orig:129990,curr:109990,trend:'down',trendTxt:'↓ Falling',pred:'Appliance upgrade season approaching. Expect 10% off next month.',conv:3},
  {id:'p13',cat:'appliance',emoji:'🌬️',name:'Dyson V15 Detect Cordless Vacuum',platform:'Amazon India',orig:59900,curr:52900,trend:'stable',trendTxt:'→ Stable',pred:'Stable for 60 days. Good time to try AI negotiation for 8% off.',conv:2},
  {id:'p14',cat:'appliance',emoji:'🫧',name:'Samsung 8kg Front Load Washing Machine',platform:'Croma',orig:48990,curr:41990,trend:'down',trendTxt:'↓ Falling',pred:'Last month of model year. Expected ₹4,000 clearance discount soon.',conv:1},
  {id:'p15',cat:'appliance',emoji:'❄️',name:'Voltas 1.5 Ton 5 Star Split AC',platform:'Amazon India',orig:38990,curr:32990,trend:'down',trendTxt:'↓ Falling',pred:'Post-summer price correction. Likely to drop another ₹2,500 in 2 weeks.',conv:4},
  {id:'p16',cat:'audio',emoji:'🎧',name:'Sony WH-1000XM5 Wireless ANC',platform:'Amazon India',orig:34990,curr:26990,trend:'down',trendTxt:'↓ Falling',pred:'XM6 launch expected in Q2. XM5 prices will continue to fall.',conv:3},
  {id:'p17',cat:'audio',emoji:'🎵',name:'JBL Flip 6 Portable Speaker',platform:'Flipkart',orig:14999,curr:11999,trend:'stable',trendTxt:'→ Stable',pred:'Price stable. Negotiate with competitor price for ₹1,000+ off.',conv:0},
  {id:'p18',cat:'audio',emoji:'🎤',name:'Apple AirPods Pro 2nd Gen',platform:'Amazon India',orig:24900,curr:22900,trend:'down',trendTxt:'↓ Falling',pred:'AirPods 4 launched. Pro 2 prices expected to drop ₹3,000 more.',conv:2},
  {id:'p19',cat:'fashion',emoji:'👟',name:'Nike Air Max 2024 Running Shoes',platform:'Myntra',orig:12995,curr:9995,trend:'down',trendTxt:'↓ Falling',pred:'End-of-season sale starting soon. Price could drop below ₹8,500.',conv:4},
  {id:'p20',cat:'fashion',emoji:'👜',name:"Puma Men's Training T-Shirt 3-Pack",platform:'Ajio',orig:3999,curr:2499,trend:'down',trendTxt:'↓ Falling',pred:'Flash sale season. Bundle deal likely to offer 30%+ off packs.',conv:0},
  {id:'p21',cat:'fashion',emoji:'🕶️',name:'Ray-Ban Aviator Classic Gold',platform:'Lenskart',orig:9500,curr:7800,trend:'stable',trendTxt:'→ Stable',pred:'Stable for 3 months. AI can negotiate ₹500–₹900 off directly.',conv:3},
];

const DEMOS=[
  {emoji:'📱',name:'Samsung Galaxy S24 Ultra 256GB — Amazon India',orig:'₹1,29,999',termTitle:'negotiai — samsung-s24-ultra.py',initMsg:'Scanning market… Found same product at ₹1,18,000 on Flipkart. Seller has ~12% negotiation room. Ready to begin.',
   chat:[{f:'ai',t:'Competitor price on Flipkart: ₹1,18,000. Starting first offer.'},{f:'ai',t:'"Hi! I can see this Samsung S24 Ultra for ₹1,18,000 on Flipkart. Can you match ₹1,12,000 for an immediate same-day purchase?"'},{f:'sel',t:'"Sorry, best we can do is ₹1,24,000. Already discounted."'},{f:'ai',t:'Counter detected. Applying bundle + urgency strategy…'},{f:'ai',t:'"If I add a case and charger to the order, can we agree on ₹1,15,000? I will pay right now."'},{f:'sel',t:'"Okay — ₹1,16,500 is my absolute final. Deal?"'},{f:'ai',t:'✅ DEAL LOCKED at ₹1,16,500 | You saved ₹13,499 (10.4% off)'}],
   fp:'₹1,16,500',sv:'Saved ₹13,499'},
  {emoji:'💻',name:'MacBook Air M3 8GB 256GB — Apple Store India',orig:'₹1,14,900',termTitle:'negotiai — macbook-air-m3.py',initMsg:'Scanning competitors… Croma listing at ₹1,09,900. Education store pricing available. Analysing discount room.',
   chat:[{f:'ai',t:'Market scan done. Education store: ₹1,09,900. Reseller margin ~8%.'},{f:'ai',t:'"Hello! MacBook Air M3 is available at ₹1,09,900 at Croma. Can you offer ₹1,06,000 with a student discount?"'},{f:'sel',t:'"We cannot go below MRP on Apple products. Best is ₹1,12,000."'},{f:'ai',t:'Applying education discount + accessory bundle strategy…'},{f:'ai',t:'"If you include a free Magic Mouse or Apple Care+, can we close at ₹1,09,000 today?"'},{f:'sel',t:'"We can add a free sleeve and bring it to ₹1,10,500. Final."'},{f:'ai',t:'✅ DEAL LOCKED at ₹1,10,500 + free sleeve | Saved ₹4,400'}],
   fp:'₹1,10,500',sv:'Saved ₹4,400'},
  {emoji:'📺',name:'LG 55" C3 OLED 4K Smart TV — Amazon India',orig:'₹1,09,990',termTitle:'negotiai — lg-oled-55.py',initMsg:'Scanning TV prices… Flipkart has same model at ₹99,990. High inventory month — strong negotiation opportunity.',
   chat:[{f:'ai',t:'Flipkart: ₹99,990. High stock levels detected — seller motivation to clear inventory.'},{f:'ai',t:'"I see this LG OLED listed at ₹99,990 on Flipkart. Can you match ₹97,000 with free installation?"'},{f:'sel',t:'"We can offer ₹1,04,990 with free installation."'},{f:'ai',t:'Pushing with EMI + accessory angle…'},{f:'ai',t:'"If I go for the 0% EMI plan and buy an HDMI cable bundle, can we do ₹1,00,000 flat with installation?"'},{f:'sel',t:'"Deal — ₹1,01,000 with free installation + 1 year extended warranty."'},{f:'ai',t:'✅ DEAL LOCKED at ₹1,01,000 + free install + warranty | Saved ₹8,990'}],
   fp:'₹1,01,000',sv:'Saved ₹8,990'},
  {emoji:'🎧',name:'Sony WH-1000XM5 Wireless ANC — Amazon India',orig:'₹34,990',termTitle:'negotiai — sony-xm5.py',initMsg:'Scanning audio market… Croma has XM5 at ₹26,990. XM6 launch detected — strong price pressure on XM5.',
   chat:[{f:'ai',t:'XM6 just launched — XM5 is in clearance phase. Strong discount window.'},{f:'ai',t:'"Sony XM6 just launched. I can get XM5 for ₹26,990 on Croma. Can you match ₹25,500 for an instant purchase today?"'},{f:'sel',t:'"₹27,500 is the lowest we can go on XM5 right now."'},{f:'ai',t:'Applying clearance + product cycle pressure…'},{f:'ai',t:'"With XM6 now available, can you bring it to ₹26,000 and include the carry pouch?"'},{f:'sel',t:'"₹26,500 with the original Sony carry pouch. Final."'},{f:'ai',t:'✅ DEAL LOCKED at ₹26,500 + carry pouch | Saved ₹8,490'}],
   fp:'₹26,500',sv:'Saved ₹8,490'},
  {emoji:'👟',name:'Nike Air Max 2024 Running Shoes — Myntra',orig:'₹12,995',termTitle:'negotiai — nike-airmax-2024.py',initMsg:'Scanning fashion deals… End-of-season detected. Flipkart has same size at ₹9,499. Good negotiation window.',
   chat:[{f:'ai',t:'End-of-season sale data found. Flipkart: ₹9,499 for the same size.'},{f:'ai',t:'"Hi! Same Nike Air Max 2024 is listed for ₹9,499 on Flipkart right now. Can you match ₹9,000 with free delivery?"'},{f:'sel',t:'"Best during sale is ₹9,995. Free delivery already included."'},{f:'ai',t:'Applying competitor + bundle tactic — 3 items in cart…'},{f:'ai',t:'"I also have Nike socks and a cap in my cart. For all three together, can you do ₹8,800 for the shoes?"'},{f:'sel',t:'"For the bundle — shoes at ₹9,200 + 20% off socks and cap."'},{f:'ai',t:'✅ DEAL LOCKED — Shoes at ₹9,200 + bundle discount | Saved ₹3,795'}],
   fp:'₹9,200',sv:'Saved ₹3,795'},
];

const TRENDS={
  iphone:{name:'iPhone 15 Pro — 12 Month Price History',labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],actual:[134900,134900,132900,131900,129900,128900,127900,124900,122900,null,null,null],predicted:[null,null,null,null,null,null,null,124900,121000,118000,115500,114900],predTitle:'Price Predicted to Drop ₹4,000–₹6,000 Next Month',predDesc:'Based on 12-month history, new model launch rumours, and festival season data — iPhone 15 Pro is expected to fall ₹4,000–₹6,000 in the next 3–5 weeks.',badge:'📉 BUY LATER'},
  samsung:{name:'Samsung Galaxy S24 Ultra — 12 Month Price History',labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],actual:[134900,132900,130900,129999,129999,127000,124000,120000,118000,null,null,null],predicted:[null,null,null,null,null,null,null,120000,116500,113000,111000,109900],predTitle:'Consistent Downward Trend — Best Window in 3 Weeks',predDesc:'S24 Ultra has fallen ₹25,000 since launch. AI predicts another ₹6,000–₹9,000 drop aligned with upcoming Big Billion Days sale.',badge:'📉 BUY LATER'},
  macbook:{name:'MacBook Air M3 — 12 Month Price History',labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],actual:[119900,117900,116900,115900,114900,113900,112900,110900,109900,null,null,null],predicted:[null,null,null,null,null,null,null,110900,108900,107000,106000,104900],predTitle:'Gradual Decline — Education Discount Season Approaching',predDesc:'MacBook Air M3 on a steady decline. Education discount season in Feb–Mar predicted to push prices to ₹1,04,000. Wait 4–6 weeks for best price.',badge:'📉 BUY LATER'},
  sony:{name:'Sony WH-1000XM5 — 12 Month Price History',labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],actual:[34990,34990,33990,32990,31990,29990,28490,26990,26490,null,null,null],predicted:[null,null,null,null,null,null,null,26990,25500,24000,22500,21990],predTitle:'Sharp Decline Predicted — XM6 Launch Driving XM5 Down',predDesc:'Sony XM6 launch triggered fast clearance of XM5 stock. AI expects price to reach ₹21,990–₹22,500 within 6 weeks.',badge:'📉 BUY LATER'},
  lg:{name:'LG 55" C3 OLED TV — 12 Month Price History',labels:['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],actual:[149990,144990,139990,134990,129990,124990,119990,114990,109990,null,null,null],predicted:[null,null,null,null,null,null,null,114990,107000,103000,99990,97000],predTitle:'OLED Prices Falling Fast — Buy Window Open Now',predDesc:'OLED TV prices drop 7–9% every quarter historically. LG C3 expected to cross below ₹1,00,000 in 6–8 weeks.',badge:'📉 BUY SOON'},
};

let trendChart=null, currentDemo=0, demoRunning=false, typingEl=null;
let activeAlerts=JSON.parse(localStorage.getItem('negotiai_alerts')||'[]');

/* ── Render products ── */
function renderProducts(cat, query=''){
  const grid=document.getElementById('productGrid');
  const info=document.getElementById('searchResultInfo');
  let list=cat==='all'?PRODUCTS:PRODUCTS.filter(p=>p.cat===cat);
  if(query){
    list=list.filter(p=>
      p.name.toLowerCase().includes(query)||
      p.platform.toLowerCase().includes(query)||
      p.cat.toLowerCase().includes(query)
    );
  }
  if(info){
    if(query||cat!=='all'){
      info.innerHTML=`Showing <strong>${list.length}</strong> product${list.length!==1?'s':''}${query?` for "<strong>${query}</strong>"`:''}`;
    } else {
      info.innerHTML=`Showing all <strong>${list.length}</strong> products`;
    }
  }
  if(list.length===0){
    grid.innerHTML=`<div class="col-12"><div class="no-results"><div class="nr-icon">🔍</div><h5>No products found</h5><p>Try a different keyword or reset the filter.</p><button class="btn-solid" style="font-size:0.82rem;padding:10px 24px;margin-top:16px;" onclick="clearSearch();filterCat('all',document.querySelector('.cat-tab'))">Reset Search</button></div></div>`;
    return;
  }
  grid.innerHTML=list.map(p=>{
    const alerted=activeAlerts.some(a=>a.pid===p.id);
    const tc=p.trend==='down'?'trend-down':p.trend==='up'?'trend-up':'trend-stable';
    const save=p.orig-p.curr, pct=Math.round(save/p.orig*100);
    const dropScore = dropProbabilityCache[p.id] || null;
    const dropBar = dropScore ? `
      <div class="drop-prob-row" title="Score calculated using 4 weighted features — INT428 Unit III: Feature Engineering">
        <div class="drop-prob-label">
          <span>Drop Probability</span>
          <span class="drop-label dp-${dropScore.label.toLowerCase().replace(' ','-')}">${dropScore.label}</span>
        </div>
        <div class="drop-prob-bar">
          <div class="drop-prob-fill dp-fill-${dropScore.label.toLowerCase().replace(' ','-')}" style="width:${dropScore.score}%"></div>
        </div>
        <span class="drop-score-num">${dropScore.score}%</span>
      </div>` : `<div class="drop-prob-row loading"><div class="drop-skeleton"></div></div>`;
    return`<div class="col-6 col-md-4 col-lg-3">
      <div class="product-card" id="pcard-${p.id}">
        <div class="prod-img">${p.emoji}</div>
        <div class="prod-title">${p.name}</div>
        <div class="prod-platform"><i class="fas fa-store me-1"></i>${p.platform}</div>
        <div class="prod-prices">
          <span class="prod-orig">₹${p.orig.toLocaleString('en-IN')}</span>
          <span class="prod-curr">₹${p.curr.toLocaleString('en-IN')}</span>
          <span class="prod-trend ${tc}">${p.trendTxt}</span>
        </div>
        ${save>0?`<div style="font-size:0.72rem;color:#27ae60;margin-bottom:8px;font-weight:600;">Already down ₹${save.toLocaleString('en-IN')} (${pct}%) from MRP</div>`:''}
        ${dropBar}
        <div class="ai-prediction">🤖 ${p.pred}</div>
        <button class="prod-alert-btn ${alerted?'alerted':''}" onclick="openAlertModal('${p.id}','${p.name.replace(/'/g,"\\'")}')">
          ${alerted?'✅ Alert Active':'🔔 Set Price Alert'}
        </button>
        <button class="prod-negotiate-btn" onclick="openNegoChatbot('${p.id}')">⚡ Negotiate Now</button>
      </div>
    </div>`;
  }).join('');
}


/* ── Alert modal ── */
function openAlertModal(pid,pname){
  document.getElementById('modalProduct').value=pid;
  document.getElementById('modalTitle').textContent='🔔 Set Alert — '+pname;
  document.getElementById('modalEmail').value='';
  document.getElementById('modalMsg').textContent='';
  document.getElementById('alertType').value='drop';
  document.getElementById('targetPriceRow').style.display='none';
  new bootstrap.Modal(document.getElementById('alertModal')).show();
}
function confirmAlert(){
  const email=document.getElementById('modalEmail').value.trim();
  const pid=document.getElementById('modalProduct').value;
  const type=document.getElementById('alertType').value;
  const msg=document.getElementById('modalMsg');
  if(!email||!email.includes('@')||!email.includes('.')){msg.style.color='#e74c3c';msg.textContent='⚠️ Please enter a valid email address.';return;}
  if(type==='target'){const t=document.getElementById('targetPrice').value;if(!t||isNaN(t)){msg.style.color='#e74c3c';msg.textContent='⚠️ Please enter a valid target price.';return;}}
  const prod=PRODUCTS.find(p=>p.id===pid);
  activeAlerts=activeAlerts.filter(a=>a.pid!==pid);
  activeAlerts.push({pid,email,type,product:prod.name,emoji:prod.emoji,curr:prod.curr,time:new Date().toLocaleTimeString()});
  localStorage.setItem('negotiai_alerts',JSON.stringify(activeAlerts));
  msg.style.color='#27ae60';msg.textContent=`✅ Alert set! We'll email ${email} when the price changes.`;
  setTimeout(()=>{
    bootstrap.Modal.getInstance(document.getElementById('alertModal')).hide();
    renderProducts('all');
    renderAlerts();
    showToast(prod.emoji,prod.name,`Alert active for ${email}. We'll notify you when the price drops!`,false);
    simulateNotifications();
  },1200);
}
function subscribeGlobal(){
  const email=document.getElementById('globalEmail').value.trim();
  const msg=document.getElementById('globalAlertMsg');
  if(!email||!email.includes('@')||!email.includes('.')){msg.style.color='#ff6b6b';msg.innerHTML='⚠️ Please enter a valid email address.';return;}
  activeAlerts=activeAlerts.filter(a=>a.pid!=='global');
  activeAlerts.push({pid:'global',email,type:'any',product:'All Products (Global Watch)',emoji:'🌐',curr:0,time:new Date().toLocaleTimeString()});
  localStorage.setItem('negotiai_alerts',JSON.stringify(activeAlerts));
  msg.style.color='#00e676';
  msg.innerHTML=`✅ <strong>You're subscribed!</strong> We'll send price drop and trend alerts to <strong>${email}</strong> in real time.`;
  document.getElementById('globalEmail').value='';
  renderAlerts();
  setTimeout(()=>simulateNotifications(),2000);
}
function renderAlerts(){
  const list=document.getElementById('alertList');
  const count=document.getElementById('alertCount');
  count.textContent=activeAlerts.length;
  if(!activeAlerts.length){list.innerHTML='<p style="color:#aaa;font-size:0.88rem;text-align:center;padding:20px;">No alerts yet. Set an alert on any product above.</p>';return;}
  list.innerHTML=activeAlerts.map(a=>`
    <div class="alert-item">
      <div class="a-icon">${a.emoji}</div>
      <div class="a-info"><div class="a-name">${a.product}</div><div class="a-email">${a.email} · Set at ${a.time}</div></div>
      <span class="a-status status-watching">WATCHING</span>
      <button onclick="removeAlert('${a.pid}')" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:0.8rem;margin-left:6px;">✕</button>
    </div>`).join('');
}
function removeAlert(pid){activeAlerts=activeAlerts.filter(a=>a.pid!==pid);localStorage.setItem('negotiai_alerts',JSON.stringify(activeAlerts));renderAlerts();renderProducts('all');}

/* ── Toasts ── */
function showToast(emoji,title,desc,isRise){
  const d=document.createElement('div');
  d.className='notif-card'+(isRise?' rise':'');
  d.innerHTML=`<div class="notif-icon">${emoji}</div><div class="notif-body"><div class="notif-title">${title}</div><div class="notif-desc">${desc}</div></div><button class="notif-close" onclick="this.parentElement.remove()">✕</button>`;
  document.getElementById('toastContainer').appendChild(d);
  setTimeout(()=>{if(d.parentElement)d.remove();},6000);
}
function simulateNotifications(){
  if(!activeAlerts.length)return;
  const drops=[
    {emoji:'📱',title:'iPhone 15 Pro — Price Dropped!',desc:'Price fell from ₹1,29,900 to ₹1,25,700 on Flipkart. Save ₹4,200 now!',rise:false},
    {emoji:'💻',title:'MacBook Air M3 — AI Prediction Alert',desc:'NegotiAI predicts a ₹3,500 drop in next 14 days. Consider waiting!',rise:false},
    {emoji:'📺',title:'Samsung 65" QLED — Price Drop Alert!',desc:'Price dropped ₹6,000 on Amazon India. Now at ₹1,03,990!',rise:false},
    {emoji:'🎧',title:'Sony XM5 — Sharp Drop Detected!',desc:'Price fell ₹2,500 overnight. Down to ₹24,490 on Amazon. Act now!',rise:false},
    {emoji:'📈',title:'ASUS ROG Strix — Price Rising!',desc:'Gaming laptop up ₹3,000 due to component shortage. Buy before further rise.',rise:true},
  ];
  let i=0;const iv=setInterval(()=>{if(i>=drops.length){clearInterval(iv);return;}showToast(drops[i].emoji,drops[i].title,drops[i].desc,drops[i].rise);i++;},3500);
}

/* ── Trend chart ── */
function switchTrend(key,el){
  if(!el) return;
  document.querySelectorAll('.trend-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  const d=TRENDS[key];
  document.getElementById('chartProductName').textContent=d.name;
  document.getElementById('predTitle').textContent=d.predTitle;
  document.getElementById('predDesc').textContent=d.predDesc;
  document.getElementById('predBadge').textContent=d.badge;
  if(trendChart)trendChart.destroy();
  trendChart=new Chart(document.getElementById('trendChart').getContext('2d'),{
    type:'line',
    data:{labels:d.labels,datasets:[
      {label:'Actual Price (₹)',data:d.actual,borderColor:'#0f3460',backgroundColor:'rgba(15,52,96,0.07)',tension:0.4,pointRadius:4,pointBackgroundColor:'#0f3460',borderWidth:2.5,spanGaps:false},
      {label:'AI Prediction (₹)',data:d.predicted,borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,0.06)',tension:0.4,pointRadius:4,pointBackgroundColor:'#00d4ff',borderWidth:2.5,borderDash:[6,4],spanGaps:false},
    ]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ₹${ctx.parsed.y?.toLocaleString('en-IN')||'N/A'}`}}},scales:{y:{ticks:{callback:v=>'₹'+v.toLocaleString('en-IN'),font:{size:10}},grid:{color:'#e8eef8'}},x:{grid:{display:false}}}}
  });
  // Feature 4: fetch AI price insight
  fetchPriceInsight(d.name, d.labels, d.actual, d.predicted);
}

/* Feature 4: AI Price Insight */
async function fetchPriceInsight(productName, labels, actual, predicted){
  const box = document.getElementById('aiInsightBox');
  const loading = document.getElementById('aiInsightLoading');
  const content = document.getElementById('aiInsightContent');
  if(!box) return;
  loading.style.display = 'block';
  content.style.display = 'none';

  const dataPoints = labels.map((m,i) => ({
    month: m,
    price: actual[i] || predicted[i] || null
  })).filter(d => d.price);

  try {
    const res = await fetch('http://localhost:5000/api/price-insight', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ product: productName, data_points: dataPoints })
    });
    const data = await res.json();
    document.getElementById('aiInsightTrend').textContent = data.trend || '';
    document.getElementById('aiInsightRec').textContent   = data.recommendation || '';
    loading.style.display = 'none';
    content.style.display = 'block';
  } catch(e) {
    loading.style.display = 'none';
    content.style.display = 'block';
    document.getElementById('aiInsightTrend').textContent = 'Price trend analysis is available when the Flask backend is running.';
    document.getElementById('aiInsightRec').textContent   = 'Start app.py to see live AI-generated insights. (Unit VI — Data Analysis with AI)';
  }
}

/* ── FEATURE 5: Drop Probability Cache & Fetch ── */
let dropProbabilityCache = {};

async function fetchDropProbabilities(){
  try {
    const res = await fetch('http://localhost:5000/api/drop-probability', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ products: PRODUCTS.map(p=>({id:p.id,orig:p.orig,curr:p.curr,trend:p.trend,platform:p.platform})) })
    });
    const data = await res.json();
    if(data.ok && data.results){
      data.results.forEach(r => { dropProbabilityCache[r.id] = r; });
      renderProducts(currentCat, (document.getElementById('searchInput').value||'').toLowerCase().trim());
    }
  } catch(e) {
    // backend not running — silently skip
  }
}

/* ── FEATURE 1: AI Negotiation Chatbot ── */
let negoHistory = [];
let negoLastMsg = '';

function populateNegotiationDropdown(){
  const sel = document.getElementById('negoProdSelect');
  if(!sel) return;
  sel.innerHTML = PRODUCTS.map(p =>
    `<option value="${p.id}" data-curr="${p.curr}" data-name="${p.name}">${p.emoji} ${p.name} — ₹${p.curr.toLocaleString('en-IN')}</option>`
  ).join('');
  sel.addEventListener('change', updateNegoPrice);
  updateNegoPrice();
}

function updateNegoPrice(){
  const sel = document.getElementById('negoProdSelect');
  const opt = sel.options[sel.selectedIndex];
  const curr = opt.dataset.curr;
  const disp = document.getElementById('negoListedPrice');
  if(disp) disp.textContent = '₹' + parseInt(curr).toLocaleString('en-IN');
  // default target to 10% below current
  const inp = document.getElementById('negoTarget');
  if(inp && !inp.value) inp.value = Math.round(parseInt(curr)*0.9);
}

function openNegoChatbot(productId){
  document.getElementById('demo').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{
    const sel = document.getElementById('negoProdSelect');
    if(sel){ sel.value = productId; updateNegoPrice(); }
  }, 500);
}

async function startNegoChatbot(){
  const sel    = document.getElementById('negoProdSelect');
  const opt    = sel.options[sel.selectedIndex];
  const target = parseInt(document.getElementById('negoTarget').value);
  if(!target || target <= 0){ alert('Please enter a valid target price.'); return; }

  const product   = opt.dataset.name;
  const curr      = parseInt(opt.dataset.curr);
  negoHistory     = [];
  negoLastMsg     = '';

  const msgBox = document.getElementById('chatbotMessages');
  msgBox.innerHTML = '';
  appendChatMsg('user', `I want to buy ${product}. Listed at ₹${curr.toLocaleString('en-IN')}. My target is ₹${target.toLocaleString('en-IN')}.`);

  negoHistory.push({ role:'user', content:`I want to buy ${product}. Listed at ₹${curr.toLocaleString('en-IN')}. My target is ₹${target.toLocaleString('en-IN')}.` });

  await callNegoAPI(product, curr, target);
}

async function sendNegoMessage(){
  const inp = document.getElementById('chatbotInput');
  const msg = inp.value.trim();
  if(!msg) return;
  inp.value = '';

  const sel    = document.getElementById('negoProdSelect');
  const opt    = sel.options[sel.selectedIndex];
  const product   = opt.dataset.name;
  const curr      = parseInt(opt.dataset.curr);
  const target    = parseInt(document.getElementById('negoTarget').value)||0;

  appendChatMsg('user', msg);
  negoHistory.push({ role:'user', content: msg });
  await callNegoAPI(product, curr, target);
}

async function callNegoAPI(product, currPrice, target){
  const btn    = document.getElementById('negoStartBtn');
  const status = document.getElementById('cbStatus');
  btn.disabled = true;
  status.textContent = '⟳ Thinking…';
  status.style.color = '#00d4ff';

  const typingId = appendTypingIndicator();
  try {
    const res = await fetch('http://localhost:5000/api/negotiate', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ product, curr_price: currPrice, target_price: target, history: negoHistory })
    });
    const data = await res.json();
    removeTypingIndicator(typingId);
    appendChatMsg('ai', data.reply);
    negoLastMsg = data.reply;
    negoHistory.push({ role:'assistant', content: data.reply });
    document.getElementById('negoCopyBtn').style.display = 'inline-flex';
  } catch(e) {
    removeTypingIndicator(typingId);
    appendChatMsg('ai', '⚠️ Backend not running. Start app.py (Flask) on port 5000 to use real AI negotiation.');
  }
  btn.disabled = false;
  status.textContent = 'Ready';
  status.style.color = '#27ae60';
}

function appendChatMsg(role, text){
  const box = document.getElementById('chatbotMessages');
  const d   = document.createElement('div');
  d.className = `cb-msg ${role === 'ai' ? 'cb-ai' : 'cb-user'}`;
  const avatar = role === 'ai' ? '<div class="cb-avatar">AI</div>' : '';
  const userAvatar = role === 'user' ? '<div class="cb-avatar user-av">You</div>' : '';
  // Format AI messages: bold [NegotiAI thinking…] and [Message to Seller]
  let formatted = text
    .replace(/\[NegotiAI thinking[^\]]*\]/g, m => `<span class="cb-thinking">${m}</span>`)
    .replace(/\[Message to Seller\]/g, '<span class="cb-msg-label">Message to Seller</span>');
  d.innerHTML = `${avatar}<div class="cb-bubble">${formatted}</div>${userAvatar}`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function appendTypingIndicator(){
  const box = document.getElementById('chatbotMessages');
  const d   = document.createElement('div');
  const id  = 'typing-' + Date.now();
  d.id = id;
  d.className = 'cb-msg cb-ai';
  d.innerHTML = '<div class="cb-avatar">AI</div><div class="cb-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  return id;
}
function removeTypingIndicator(id){ const el = document.getElementById(id); if(el) el.remove(); }

function copyLastMessage(){
  if(!negoLastMsg) return;
  navigator.clipboard.writeText(negoLastMsg).then(()=>{
    const btn = document.getElementById('negoCopyBtn');
    btn.textContent = '✅ Copied!';
    setTimeout(()=>{ btn.textContent = '📋 Copy Negotiation Pitch'; }, 2000);
  });
}

/* Keep old selectDemo / runDemo for any back-compat calls */
function startNegotiateProduct(idx){ openNegoChatbot(PRODUCTS[idx]?.id || PRODUCTS[0].id); }

/* ── FEATURE 2: Prompt Engineering Demo ── */
let currentPDTechnique = 'zero-shot';
const PD_EXPLAINS = {
  'zero-shot': '<strong>Zero-shot</strong> — The model gets only the question, no examples. Tests raw model knowledge.',
  'few-shot':  '<strong>Few-shot</strong> — The model gets 2 example Q&A pairs before the question. Guides tone and format.',
  'cot':       '<strong>Chain-of-Thought</strong> — The model is instructed to think step by step. Produces deeper, more reasoned answers.'
};

function selectPDTab(technique, el){
  currentPDTechnique = technique;
  document.querySelectorAll('.pd-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pdExplain').innerHTML = PD_EXPLAINS[technique] || '';
  document.getElementById('pdPromptCode').textContent = 'Click "Run Prompt" to see the prompt';
  document.getElementById('pdOutput').innerHTML = '<div class="pd-placeholder">Click the button below to run this prompt technique live.</div>';
}

async function runPromptDemo(){
  const product   = document.getElementById('pdProductSelect').value;
  const technique = currentPDTechnique;
  const btn       = document.getElementById('pdRunBtn');
  const promptEl  = document.getElementById('pdPromptCode');
  const outputEl  = document.getElementById('pdOutput');

  btn.disabled = true;
  btn.textContent = '⟳ Calling AI…';
  promptEl.textContent = 'Sending to Groq LLaMA 3.3…';
  outputEl.innerHTML   = '<div class="pd-loading"><div class="typing-dots"><span></span><span></span><span></span></div><span>AI is generating response…</span></div>';

  try {
    const res  = await fetch('http://localhost:5000/api/prompt-demo', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ product, technique })
    });
    const data = await res.json();
    promptEl.textContent = data.prompt_sent || '(prompt not returned)';
    outputEl.innerHTML   = `<div class="pd-ai-output">${data.reply.replace(/\n/g,'<br>')}</div>`;
  } catch(e) {
    promptEl.textContent = 'Backend not running — start app.py to see live prompts.';
    outputEl.innerHTML   = '<div class="pd-placeholder">⚠️ Start Flask backend (app.py) on port 5000 to run live prompt demos.</div>';
  }
  btn.disabled = false;
  btn.textContent = '▶ Run Prompt Live';
}

/* ── FEATURE 3: AI Natural Language Search ── */
let aiSearchMode = false;

function toggleAISearch(){
  aiSearchMode = !aiSearchMode;
  const inp   = document.getElementById('searchInput');
  const badge = document.getElementById('aiSearchBadge');
  const label = document.getElementById('searchModeLabel');
  const btn   = document.getElementById('aiSearchToggle');
  const sbtn  = document.getElementById('aiSearchBtn');
  const sfab  = document.querySelector('.sbtn');

  if(aiSearchMode){
    inp.placeholder = 'Describe what you need — e.g. phone for gaming under ₹40,000 with good battery';
    badge.style.display = 'inline-flex';
    label.textContent   = '🤖 AI Search (Gemini)';
    btn.textContent     = 'Switch to Keyword Search';
    btn.classList.add('active-toggle');
    sbtn.style.display  = 'inline-flex';
    if(sfab) sfab.style.display = 'none';
  } else {
    inp.placeholder     = 'Search — iPhone, Sony headphones, Samsung TV…';
    badge.style.display = 'none';
    label.textContent   = '🔍 Keyword Search';
    btn.textContent     = 'Switch to AI Search ✨';
    btn.classList.remove('active-toggle');
    sbtn.style.display  = 'none';
    if(sfab) sfab.style.display = 'inline-flex';
    renderProducts(currentCat, '');
  }
}

async function runAISearch(){
  const query = document.getElementById('searchInput').value.trim();
  if(!query){ alert('Please describe what you are looking for.'); return; }

  const info  = document.getElementById('searchResultInfo');
  const grid  = document.getElementById('productGrid');
  info.innerHTML = '🤖 AI is searching… <span class="ai-searching-dot"></span>';
  grid.innerHTML  = '<div class="col-12 text-center" style="padding:40px;"><div class="typing-dots big"><span></span><span></span><span></span></div><p style="color:#555;margin-top:12px;font-size:0.85rem;">Gemini NLP is matching your query…</p></div>';

  // send product list with tags for NLP matching
  const productList = PRODUCTS.map(p => ({
    id: p.id, name: p.name, cat: p.cat, curr: p.curr,
    platform: p.platform, tags: p.trendTxt ? [p.trendTxt] : []
  }));

  try {
    const res  = await fetch('http://localhost:5000/api/nl-search', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ query, products: productList })
    });
    const data = await res.json();

    if(data.ok && data.matches && data.matches.length > 0){
      const matchMap = {};
      data.matches.forEach(m => { matchMap[m.id] = m.reason; });
      const matchedProducts = data.matches
        .map(m => PRODUCTS.find(p => p.id === m.id))
        .filter(Boolean);

      info.innerHTML = `🤖 AI found <strong>${matchedProducts.length}</strong> matches for "<strong>${query}</strong>" · <em style="color:#555;font-size:0.8rem;">Gemini 1.5 Flash · NLP Intent Matching · Unit IV</em>`;
      grid.innerHTML = matchedProducts.map(p => {
        const reason    = matchMap[p.id] || '';
        const alerted   = activeAlerts.some(a=>a.pid===p.id);
        const tc        = p.trend==='down'?'trend-down':p.trend==='up'?'trend-up':'trend-stable';
        const save      = p.orig-p.curr;
        const pct       = Math.round(save/p.orig*100);
        const dropScore = dropProbabilityCache[p.id];
        const dropBar   = dropScore ? `<div class="drop-prob-row" title="INT428 Unit III: Feature Engineering"><div class="drop-prob-label"><span>Drop Probability</span><span class="drop-label dp-${dropScore.label.toLowerCase().replace(' ','-')}">${dropScore.label}</span></div><div class="drop-prob-bar"><div class="drop-prob-fill dp-fill-${dropScore.label.toLowerCase().replace(' ','-')}" style="width:${dropScore.score}%"></div></div><span class="drop-score-num">${dropScore.score}%</span></div>` : '';
        return `<div class="col-6 col-md-4 col-lg-3">
          <div class="product-card ai-matched-card">
            <div class="ai-matched-badge">✨ AI Matched</div>
            <div class="prod-img">${p.emoji}</div>
            <div class="prod-title">${p.name}</div>
            <div class="prod-platform"><i class="fas fa-store me-1"></i>${p.platform}</div>
            <div class="prod-prices">
              <span class="prod-orig">₹${p.orig.toLocaleString('en-IN')}</span>
              <span class="prod-curr">₹${p.curr.toLocaleString('en-IN')}</span>
              <span class="prod-trend ${tc}">${p.trendTxt}</span>
            </div>
            ${save>0?`<div style="font-size:0.72rem;color:#27ae60;margin-bottom:6px;font-weight:600;">↓ ₹${save.toLocaleString('en-IN')} (${pct}%) off MRP</div>`:''}
            ${dropBar}
            <div class="ai-match-reason">💬 ${reason}</div>
            <button class="prod-negotiate-btn" onclick="openNegoChatbot('${p.id}')">⚡ Negotiate Now</button>
          </div>
        </div>`;
      }).join('');
    } else {
      info.innerHTML = `No AI matches found. Falling back to keyword search…`;
      handleSearch();
    }
  } catch(e) {
    info.innerHTML = `⚠️ AI search needs Flask backend. Showing keyword results instead.`;
    handleSearch();
  }
}

window.addEventListener('scroll',()=>{
  const btn=document.getElementById('backTop');
  if(btn) btn.classList.toggle('show',window.scrollY>300);
});

/* ── Init on DOM ready ── */
document.addEventListener('DOMContentLoaded',()=>{
  renderProducts('all');
  renderAlerts();
  renderReviews();
  initScrollReveal();
  initStatCounters();
  initProtection();
  initAdvisor();
  populateNegotiationDropdown();
  // Feature 5: fetch drop probabilities (fills in bars)
  fetchDropProbabilities();

  // Wire Sign Out — clears auth and goes back to login
  const signinLink = document.querySelector('.nav-signin');
  if(signinLink && sessionStorage.getItem('negotiai_auth')){
    signinLink.textContent = 'Sign Out';
    signinLink.href = '#';
    signinLink.addEventListener('click', e => {
      e.preventDefault();
      sessionStorage.removeItem('negotiai_auth');
      window.location.href = 'login.html';
    });
  }

  const atSel=document.getElementById('alertType');
  if(atSel) atSel.addEventListener('change',function(){
    document.getElementById('targetPriceRow').style.display=this.value==='target'?'block':'none';
  });

  // Enter key on search
  const si=document.getElementById('searchInput');
  if(si) si.addEventListener('keydown',e=>{if(e.key==='Escape')clearSearch();});
});

/* ══════════════════════════════════════
   SEARCH
══════════════════════════════════════ */
let currentCat='all';
function handleSearch(){
  const q=(document.getElementById('searchInput').value||'').toLowerCase().trim();
  const clearBtn=document.getElementById('clearBtn');
  clearBtn.classList.toggle('show', q.length>0);
  renderProducts(currentCat, q);
}
function clearSearch(){
  document.getElementById('searchInput').value='';
  document.getElementById('clearBtn').classList.remove('show');
  renderProducts(currentCat,'');
}
function filterCat(cat,el){
  currentCat=cat;
  document.querySelectorAll('.cat-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const q=(document.getElementById('searchInput').value||'').toLowerCase().trim();
  renderProducts(cat,q);
}

/* ══════════════════════════════════════
   REVIEWS DATA & RENDERING
══════════════════════════════════════ */
const DEFAULT_REVIEWS=[
  {name:'Priya Sharma',role:'Software Engineer, Bengaluru',rating:5,text:'I was about to buy a laptop for ₹85,000. NegotiAI got me the same one for ₹72,500. I just clicked one button and watched it happen.',product:'Dell XPS 15',saved:12500,userSubmitted:false},
  {name:'Rahul Mehta',role:'IT Manager, Mumbai',rating:5,text:'Got the alert at 2 AM saying Samsung TV dropped ₹6,000. Bought it immediately. Never would have caught that without NegotiAI watching it for me.',product:'Samsung 65" QLED',saved:64000,userSubmitted:false},
  {name:'Ananya Iyer',role:'Teacher, Chennai',rating:5,text:'The trend chart told me to wait 3 weeks before buying the iPhone. I waited. Price dropped exactly as predicted. This thing is genuinely smart.',product:'iPhone 15 Pro',saved:5800,userSubmitted:false},
  {name:'Vikram Nair',role:'Freelancer, Pune',rating:5,text:'NegotiAI negotiated 14% off my Sony headphones in under a minute. I was shocked. Absolute game changer for online shopping.',product:'Sony WH-1000XM5',saved:4900,userSubmitted:false},
  {name:'Sneha Kapoor',role:'Student, Delhi',rating:4,text:'Set a price alert for the MacBook and within 3 days it notified me of a ₹3,500 drop. Bought instantly. Really impressed with the accuracy.',product:'MacBook Air M3',saved:3500,userSubmitted:false},
  {name:'Arjun Reddy',role:'Entrepreneur, Hyderabad',rating:5,text:'Ordered 15 monitors for my startup. NegotiAI unlocked a bulk discount that saved me over ₹40,000. My accountant thought I was lying.',product:'Dell Monitors (×15)',saved:40000,userSubmitted:false},
];
function loadReviews(){
  const stored=localStorage.getItem('negotiai_reviews');
  if(stored) return [...DEFAULT_REVIEWS,...JSON.parse(stored)];
  return [...DEFAULT_REVIEWS];
}
function saveUserReview(r){
  const stored=JSON.parse(localStorage.getItem('negotiai_reviews')||'[]');
  stored.push(r);
  localStorage.setItem('negotiai_reviews',JSON.stringify(stored));
}
function renderReviews(){
  const reviews=loadReviews();
  const grid=document.getElementById('reviewsGrid');
  if(!grid)return;
  grid.innerHTML=reviews.map(r=>{
    const stars='★'.repeat(r.rating)+'☆'.repeat(5-r.rating);
    const initials=r.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return`<div class="col-md-4">
      <div class="testi-card">
        <div class="stars">${stars}</div>
        <p class="testi-text">"${r.text}"</p>
        <div class="testi-person">
          <div class="testi-avatar" style="background:${r.userSubmitted?'#533483':'#0f3460'}">${initials}</div>
          <div>
            <div class="testi-name">${r.name}</div>
            <div class="testi-role">${r.role}${r.product?` · ${r.product}`:''}</div>
          </div>
          ${r.saved?`<div class="saving-pill">Saved ₹${Number(r.saved).toLocaleString('en-IN')}</div>`:''}
          ${r.userSubmitted?'<div class="user-review-badge">New</div>':''}
        </div>
      </div>
    </div>`;
  }).join('');
}
function submitReview(){
  const name=document.getElementById('reviewName').value.trim();
  const role=document.getElementById('reviewRole').value.trim();
  const product=document.getElementById('reviewProduct').value.trim();
  const saved=document.getElementById('reviewSaved').value.trim();
  const text=document.getElementById('reviewText').value.trim();
  const ratingEl=document.querySelector('input[name="rating"]:checked');
  const starErr=document.getElementById('starError');

  // Validate
  if(!ratingEl){starErr.style.display='block';return;}
  starErr.style.display='none';
  if(!name){document.getElementById('reviewName').focus();document.getElementById('reviewName').style.borderColor='#e74c3c';return;}
  document.getElementById('reviewName').style.borderColor='';
  if(!text||text.length<20){document.getElementById('reviewText').focus();document.getElementById('reviewText').style.borderColor='#e74c3c';return;}
  document.getElementById('reviewText').style.borderColor='';

  const review={name,role:role||'NegotiAI User',product,saved:saved?Number(saved):0,rating:Number(ratingEl.value),text,userSubmitted:true,time:new Date().toLocaleString()};
  saveUserReview(review);
  renderReviews();

  // Reset form
  document.getElementById('reviewName').value='';
  document.getElementById('reviewRole').value='';
  document.getElementById('reviewProduct').value='';
  document.getElementById('reviewSaved').value='';
  document.getElementById('reviewText').value='';
  document.querySelectorAll('input[name="rating"]').forEach(r=>r.checked=false);

  const succ=document.getElementById('reviewSuccess');
  succ.style.display='block';
  setTimeout(()=>succ.style.display='none',4000);

  // Scroll to newly added review
  setTimeout(()=>{
    const grid=document.getElementById('reviewsGrid');
    if(grid) grid.lastElementChild.scrollIntoView({behavior:'smooth',block:'center'});
  },300);
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function initScrollReveal(){
  const els=document.querySelectorAll('.reveal');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
  },{threshold:0.12});
  els.forEach(el=>obs.observe(el));
}

/* ══════════════════════════════════════
   ANIMATED STAT COUNTERS
══════════════════════════════════════ */
function initStatCounters(){
  const targets=[
    {el:document.getElementById('sc1'),end:'₹8,400',prefix:'₹',suffix:'',val:8400},
    {el:document.getElementById('sc2'),end:'94%',prefix:'',suffix:'%',val:94},
    {el:document.getElementById('sc3'),end:'2.1M+',prefix:'',suffix:'M+',val:2.1},
    {el:document.getElementById('sc4'),end:'40+',prefix:'',suffix:'+',val:40},
  ];
  const statsBar=document.querySelector('.stats-bar');
  if(!statsBar)return;
  const obs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      targets.forEach(t=>{
        if(!t.el)return;
        let startTime=null;const duration=1600;
        function step(ts){
          if(!startTime)startTime=ts;
          const prog=Math.min((ts-startTime)/duration,1);
          const eased=1-Math.pow(1-prog,3);
          const cur=Math.round(eased*t.val*10)/10;
          if(t.suffix==='M+') t.el.textContent=cur.toFixed(1)+'M+';
          else if(t.suffix==='+') t.el.textContent=Math.round(cur)+'+';
          else if(t.prefix==='₹') t.el.textContent='₹'+Math.round(cur).toLocaleString('en-IN');
          else t.el.textContent=Math.round(cur)+'%';
          if(prog<1)requestAnimationFrame(step);
          else t.el.textContent=t.end;
        }
        requestAnimationFrame(step);
      });
      obs.disconnect();
    }
  },{threshold:0.5});
  obs.observe(statsBar);
}/* ══════════════════════════════════════
   BUYER PROTECTION CENTER
══════════════════════════════════════ */

// Sample orders data
const ORDERS = [
  {id:'ORD-2024-001', emoji:'📱', name:'Samsung Galaxy S24 Ultra 256GB', seller:'TechDeals India', date:'12 Jan 2026', price:'₹1,16,500', saved:'₹13,499', status:'delivered', statusLabel:'Delivered'},
  {id:'ORD-2024-002', emoji:'💻', name:'MacBook Air M3 8GB 256GB', seller:'Apple Premium Reseller', date:'8 Jan 2026', price:'₹1,10,500', saved:'₹4,400', status:'delivered', statusLabel:'Delivered'},
  {id:'ORD-2024-003', emoji:'🎧', name:'Sony WH-1000XM5 Wireless ANC', seller:'AudioWorld', date:'3 Jan 2026', price:'₹26,500', saved:'₹8,490', status:'disputed', statusLabel:'Disputed'},
  {id:'ORD-2024-004', emoji:'👟', name:'Nike Air Max 2024 Running Shoes', seller:'SportZone', date:'29 Dec 2025', price:'₹9,200', saved:'₹3,795', status:'transit', statusLabel:'In Transit'},
  {id:'ORD-2024-005', emoji:'📺', name:'LG 55" C3 OLED 4K Smart TV', seller:'Electronics Hub', date:'22 Dec 2025', price:'₹1,01,000', saved:'₹8,990', status:'processing', statusLabel:'Processing'},
];

const DISPUTES = [
  {id:'DIS-001', orderId:'ORD-2024-003', product:'Sony WH-1000XM5', issue:'Damaged product — left ear cup cracked on arrival', filed:'3 Jan 2026', status:'open', statusLabel:'Under Review', progress:35},
  {id:'DIS-002', orderId:'ORD-2023-098', product:'OnePlus 12 256GB', issue:'Wrong colour variant delivered (Black instead of Green)', filed:'15 Dec 2025', status:'resolved', statusLabel:'Resolved', progress:100},
  {id:'DIS-003', orderId:'ORD-2023-087', product:'JBL Flip 6 Speaker', issue:'Missing charging cable and user manual', filed:'1 Dec 2025', status:'escalated', statusLabel:'Escalated', progress:70},
];

function renderOrders(){
  const c = document.getElementById('ordersContainer');
  if(!c) return;
  c.innerHTML = ORDERS.map(o => `
    <div class="order-card">
      <div class="order-emoji">${o.emoji}</div>
      <div class="order-info">
        <div class="order-name">${o.name}</div>
        <div class="order-meta">
          ${o.id} &nbsp;·&nbsp; ${o.seller} &nbsp;·&nbsp; ${o.date}<br>
          <strong>${o.price}</strong> &nbsp;<span style="color:var(--mint);font-weight:700;">Saved ${o.saved}</span>
        </div>
      </div>
      <span class="order-status os-${o.status}">${o.statusLabel}</span>
      <div class="order-actions">
        ${o.status==='delivered'?`
          <button class="oa-btn primary" onclick="quickVerify('${o.id}')">🔍 Verify</button>
          <button class="oa-btn" onclick="showTab('complaint',document.querySelectorAll('.protect-tab')[2]);prefillOrder('${o.id}')">⚠️ Report Issue</button>
          <button class="oa-btn" onclick="showTab('refund',document.querySelectorAll('.protect-tab')[4]);document.getElementById('rOrderId').value='${o.id}'">💰 Refund</button>
        `:o.status==='transit'?`
          <button class="oa-btn primary" onclick="trackOrder('${o.id}')">📡 Track</button>
          <button class="oa-btn danger" onclick="cancelOrder('${o.id}')">✕ Cancel</button>
        `:o.status==='disputed'?`
          <button class="oa-btn" onclick="showTab('disputes',document.querySelectorAll('.protect-tab')[3])">⚖️ View Dispute</button>
        `:o.status==='processing'?`
          <button class="oa-btn danger" onclick="cancelOrder('${o.id}')">✕ Cancel Order</button>
        `:''}
      </div>
    </div>`).join('');
}

function renderDisputes(){
  const c = document.getElementById('disputeContainer');
  if(!c) return;
  c.innerHTML = DISPUTES.map(d => `
    <div class="dispute-card">
      <div class="dispute-header">
        <div>
          <div class="dispute-id">${d.id} — ${d.product}</div>
          <div style="font-size:0.74rem;color:var(--muted);margin-top:3px;">Order ${d.orderId} &nbsp;·&nbsp; Filed ${d.filed}</div>
          <div style="font-size:0.8rem;margin-top:6px;color:var(--ink);">${d.issue}</div>
        </div>
        <span class="dispute-badge db-${d.status}">${d.statusLabel}</span>
      </div>
      <div style="font-size:0.74rem;color:var(--muted);margin-bottom:6px;">Resolution Progress</div>
      <div class="dispute-meter"><div class="dispute-fill" style="width:${d.progress}%"></div></div>
      <div class="dispute-labels"><span>Filed</span><span>Under Review</span><span>Seller Response</span><span>Resolved</span></div>
      ${d.status!=='resolved'?`<button class="oa-btn danger" style="font-size:0.74rem;margin-top:6px;" onclick="escalateDispute('${d.id}')">🚨 Escalate to Senior Team</button>`:`<div style="background:#dcfce7;color:#16a34a;border-radius:4px;padding:8px 12px;font-size:0.78rem;font-weight:600;margin-top:6px;">✅ This dispute was resolved in your favour. Refund processed.</div>`}
    </div>`).join('');
}

/* Tab switching */
function showTab(tabId, el){
  document.querySelectorAll('.protect-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.protect-tab').forEach(t=>t.classList.remove('active'));
  const panel = document.getElementById('tab-'+tabId);
  if(panel) panel.classList.add('active');
  if(el) el.classList.add('active');
}

/* 10-step verification */
let verifyState = {};
function resetVerification(){
  const sel = document.getElementById('verifyOrderSelect');
  if(!sel.value){ return; }
  verifyState = {};
  for(let i=1;i<=10;i++){
    const step = document.getElementById('vs'+i);
    const btn = document.getElementById('vbtn'+i);
    step.classList.remove('done','failed');
    btn.disabled = i>1;
    btn.textContent = btn.getAttribute('data-label')||btn.textContent;
  }
  // Reset button labels
  const labels=['Mark as OK','Confirm Match','No Damage Found','All Items Present','Price Confirmed','Correct Variant','Device OK','Warranty Valid','Seller Verified','Deal Matches'];
  labels.forEach((lbl,i)=>{ const b=document.getElementById('vbtn'+(i+1)); if(b) b.textContent=lbl; });
  document.getElementById('verifyProgress').textContent='Step 1 of 10 — Click the button on each step to proceed.';
  document.getElementById('verifyResult').style.display='none';
  document.getElementById('reportFailBtn').style.display='none';
}
function markStep(num, result){
  const step = document.getElementById('vs'+num);
  const btn = document.getElementById('vbtn'+num);
  verifyState[num] = result;
  step.classList.add(result==='pass'?'done':'failed');
  btn.disabled = true;
  btn.textContent = result==='pass'?'✓ Done':'✗ Issue Found';
  // Unlock next
  if(num < 10){
    const nextBtn = document.getElementById('vbtn'+(num+1));
    if(nextBtn) nextBtn.disabled = false;
  }
  const done = Object.keys(verifyState).length;
  document.getElementById('verifyProgress').textContent = `${done} of 10 checks completed`;
  if(done===10){
    const allPass = Object.values(verifyState).every(v=>v==='pass');
    const res = document.getElementById('verifyResult');
    res.style.display='block';
    if(allPass){
      res.className='verify-result pass';
      res.innerHTML='✅ <strong>All 10 checks passed!</strong> Your order is verified as genuine, complete, and matches your NegotiAI deal. You\'re good to go!';
      document.getElementById('reportFailBtn').style.display='none';
    } else {
      res.className='verify-result fail';
      const failed = Object.entries(verifyState).filter(([k,v])=>v==='failed').length;
      res.innerHTML=`⚠️ <strong>${failed} check${failed>1?'s':''} failed.</strong> Your order has issues. Please file a complaint immediately so we can resolve this.`;
      document.getElementById('reportFailBtn').style.display='inline-block';
    }
  }
}
function markStepFail(num){ markStep(num,'failed'); }

function quickVerify(orderId){
  showTab('verify', document.querySelectorAll('.protect-tab')[1]);
  const sel = document.getElementById('verifyOrderSelect');
  // Find matching option
  Array.from(sel.options).forEach(opt=>{ if(opt.value===orderId) sel.value=orderId; });
  resetVerification();
  sel.scrollIntoView({behavior:'smooth', block:'center'});
}

/* Issue type toggle */
let selectedIssues = [];
function toggleIssue(el, type){
  el.classList.toggle('selected');
  if(selectedIssues.includes(type)) selectedIssues = selectedIssues.filter(i=>i!==type);
  else selectedIssues.push(type);
}

/* Severity */
let selectedSeverity = '';
function setSeverity(level, el){
  document.querySelectorAll('.sev-btn').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
  selectedSeverity = level;
}

/* Photo upload preview */
function handlePhotos(e){
  const files = Array.from(e.target.files).slice(0,6);
  const preview = document.getElementById('photoPreview');
  preview.innerHTML = files.map(f=>{
    const url = URL.createObjectURL(f);
    return `<img src="${url}" class="preview-img" alt="evidence"/>`;
  }).join('') + (files.length<3?Array(3-files.length).fill('<div class="preview-placeholder">📷</div>').join(''):'');
}

/* Submit complaint */
function submitComplaint(){
  const orderId = document.getElementById('cOrderId').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const desc = document.getElementById('cDesc').value.trim();
  const errEl = document.getElementById('cErr');
  const issErr = document.getElementById('issueErr');

  issErr.style.display = selectedIssues.length===0 ? 'block' : 'none';
  if(!orderId||!email||!email.includes('@')||!desc||desc.length<20||selectedIssues.length===0||!selectedSeverity){
    errEl.style.display='block';
    errEl.textContent='⚠️ Please fill in all required fields (Order ID, email, issue type, severity, and description of at least 20 characters).';
    return;
  }
  errEl.style.display='none';

  const ticketId = 'CMP-' + Date.now().toString().slice(-6);
  document.getElementById('cTicketId').textContent = ticketId;
  document.getElementById('ct1time').textContent = new Date().toLocaleString();
  document.getElementById('complaintTimeline').style.display='block';

  // Save to localStorage
  const complaints = JSON.parse(localStorage.getItem('negotiai_complaints')||'[]');
  complaints.push({ticketId, orderId, email, issues:selectedIssues, severity:selectedSeverity, desc, time:new Date().toISOString()});
  localStorage.setItem('negotiai_complaints', JSON.stringify(complaints));

  // Reset form fields
  document.getElementById('cOrderId').value='';
  document.getElementById('cEmail').value='';
  document.getElementById('cDesc').value='';
  document.querySelectorAll('.issue-chip').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('.sev-btn').forEach(b=>b.classList.remove('sel'));
  selectedIssues=[]; selectedSeverity='';

  showToast('⚠️','Complaint Submitted','Ticket #'+ticketId+' created. Our team will review within 24 hours.',true);
}

function prefillOrder(id){
  document.getElementById('cOrderId').value = id;
}

/* Submit refund */
function submitRefund(){
  const orderId = document.getElementById('rOrderId').value.trim();
  const amount = document.getElementById('rAmount').value.trim();
  const method = document.getElementById('rMethod').value;
  const reason = document.getElementById('rReason').value;
  const errEl = document.getElementById('rErr');
  const succEl = document.getElementById('refundSuccess');

  if(!orderId||!amount||!method||!reason){
    errEl.style.display='block';
    errEl.textContent='⚠️ Please fill in all required fields.';
    succEl.style.display='none';
    return;
  }
  errEl.style.display='none';
  const refId = 'REF-'+Date.now().toString().slice(-6);
  succEl.style.display='block';
  succEl.innerHTML=`✅ <strong>Refund request #${refId} submitted!</strong><br>₹${Number(amount).toLocaleString('en-IN')} will be credited to your ${method} within 5–7 business days. You will receive a confirmation email shortly.`;

  // Save
  const refunds = JSON.parse(localStorage.getItem('negotiai_refunds')||'[]');
  refunds.push({refId, orderId, amount, method, reason, time:new Date().toISOString()});
  localStorage.setItem('negotiai_refunds',JSON.stringify(refunds));

  document.getElementById('rOrderId').value='';
  document.getElementById('rAmount').value='';
  document.getElementById('rMethod').value='';
  document.getElementById('rReason').value='';
  document.getElementById('rNotes').value='';
  showToast('💰','Refund Request Filed','#'+refId+' — ₹'+Number(amount).toLocaleString('en-IN')+' being processed.',false);
}

/* Track / Cancel helpers */
function trackOrder(id){
  showToast('📡','Tracking '+id,'Your order is 45 km away and will arrive by tomorrow 6 PM.',false);
}
function cancelOrder(id){
  if(confirm('Cancel order '+id+'? This cannot be undone.')){
    showToast('✕','Order '+id+' Cancelled','Cancellation confirmed. Refund will be processed within 5–7 days.',true);
  }
}
function escalateDispute(id){
  showToast('🚨','Dispute '+id+' Escalated','Assigned to Senior Resolution Team. Expected response within 48 hours.',true);
}

// Init protection center on DOMContentLoaded (handled in existing listener)
function initProtection(){
  renderOrders();
  renderDisputes();
  // add fail buttons to verify steps
  document.querySelectorAll('.vstep').forEach((step,i)=>{
    const num = i+1;
    const div = step.querySelector('.vstep-action');
    if(div){
      const failBtn = document.createElement('button');
      failBtn.textContent = '✗ Report Issue';
      failBtn.style.cssText='margin-left:6px;padding:6px 14px;border-radius:3px;border:1.5px solid #dc2626;background:transparent;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:Manrope,sans-serif;color:#dc2626;transition:all 0.15s;';
      failBtn.disabled = num > 1;
      failBtn.id = 'vfail'+num;
      failBtn.onclick = ()=>markStep(num,'failed');
      div.appendChild(failBtn);
    }
  });
}