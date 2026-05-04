/* ═══════════════════════════════════════════════════════
   NegotiAI — advisor.js
   AI Product Recommendation Engine
   Full Stack Expo 2026 | BTech CSE 2nd Year
═══════════════════════════════════════════════════════ */

'use strict';

/* ── PRODUCT DATABASE ─────────────────────────────── */
const ADVISOR_DB = {
  mobile: [
    { name:'Samsung Galaxy S24 Ultra', brand:'Samsung', emoji:'📱', price:116500, mrp:134900, rating:4.8, match:0,
      specs:['6.8" AMOLED 120Hz','200MP Camera','12GB RAM / 256GB','5000mAh Battery','S Pen Included'],
      tags:['camera','gaming','premium','business','photography'],
      why:'Best-in-class camera system with 200MP sensor. S Pen makes it ideal for productivity. Top AI negotiation savings on Amazon.',
      platform:'Amazon India', conv:0 },
    { name:'iPhone 15 Pro 128GB', brand:'Apple', emoji:'📱', price:129900, mrp:134900, rating:4.7, match:0,
      specs:['6.1" Super Retina XDR','48MP ProCamera','A17 Pro Chip','USB-C Fast Charge','Titanium Frame'],
      tags:['premium','camera','ios','business','photography','social media'],
      why:'Best iOS experience, perfect for creative professionals. Price is trending down — great negotiation window.',
      platform:'Flipkart', conv:1 },
    { name:'OnePlus 12 256GB', brand:'OnePlus', emoji:'📱', price:59999, mrp:64999, rating:4.6, match:0,
      specs:['6.82" LTPO AMOLED','50MP Hasselblad Camera','16GB RAM','5400mAh Battery','100W Fast Charge'],
      tags:['gaming','performance','battery','student','fast charging'],
      why:'Flagship performance at mid-range price. 100W charging fills up in 25 minutes. Excellent for students and gamers.',
      platform:'Amazon India', conv:2 },
    { name:'Realme GT 6 5G', brand:'Realme', emoji:'📱', price:31999, mrp:35999, rating:4.4, match:0,
      specs:['6.78" FHD+ 120Hz','50MP Sony Sensor','12GB RAM / 256GB','5500mAh Battery','120W Charging'],
      tags:['budget','gaming','student','battery','value'],
      why:'Incredible value for money. 120W charging and flagship Snapdragon chip at budget price.',
      platform:'Flipkart', conv:3 },
    { name:'Google Pixel 8a', brand:'Google', emoji:'📱', price:52999, mrp:59999, rating:4.5, match:0,
      specs:['6.1" OLED 120Hz','64MP AI Camera','Tensor G3 Chip','4492mAh Battery','7yr OS Updates'],
      tags:['camera','ai','clean android','photography','night mode'],
      why:'Best AI camera features, 7 years of updates. Pure Android experience with Google AI built in.',
      platform:'Flipkart', conv:0 },
    { name:'Vivo V30 Pro 5G', brand:'Vivo', emoji:'📱', price:39999, mrp:44999, rating:4.3, match:0,
      specs:['6.78" AMOLED 120Hz','50MP Zeiss Camera','12GB RAM','4600mAh Battery','80W Flash Charge'],
      tags:['camera','selfie','social media','portrait','ladies'],
      why:'Zeiss optics deliver stunning portrait photos. Front camera is exceptional for selfies and video calls.',
      platform:'Amazon India', conv:2 },
  ],
  laptop: [
    { name:'MacBook Air M3', brand:'Apple', emoji:'💻', price:109900, mrp:114900, rating:4.8, match:0,
      specs:['13.6" Liquid Retina','Apple M3 Chip','8GB Unified RAM','256GB SSD','18hr Battery'],
      tags:['student','creative','thin','battery','premium','design'],
      why:'Unbeatable battery life and performance for students and creatives. Fanless design — completely silent.',
      platform:'Apple Store', conv:1 },
    { name:'Dell XPS 15 i7', brand:'Dell', emoji:'💻', price:134990, mrp:159990, rating:4.6, match:0,
      specs:['15.6" OLED 4K','Intel i7 13th Gen','16GB DDR5','512GB SSD','NVIDIA RTX 4060'],
      tags:['business','video editing','premium','creative','4k'],
      why:'OLED display is stunning for video editing and design work. Powerful GPU handles creative workloads.',
      platform:'Amazon India', conv:0 },
    { name:'ASUS ROG Strix G16', brand:'ASUS', emoji:'💻', price:129990, mrp:149990, rating:4.5, match:0,
      specs:['16" QHD 165Hz Display','Intel i9 / RTX 4060','16GB DDR5','1TB SSD','RGB Keyboard'],
      tags:['gaming','performance','rgb','heavy','streaming'],
      why:'Best gaming laptop in budget. 165Hz display with G-Sync gives competitive advantage in fast-paced games.',
      platform:'Croma', conv:2 },
    { name:'HP Pavilion 15 Ryzen 5', brand:'HP', emoji:'💻', price:54990, mrp:62990, rating:4.3, match:0,
      specs:['15.6" FHD IPS','Ryzen 5 7530U','16GB DDR4','512GB SSD','Backlit Keyboard'],
      tags:['student','budget','office','everyday','value'],
      why:'Solid all-rounder for students and office work. Ryzen 5 handles multitasking easily at an affordable price.',
      platform:'Flipkart', conv:3 },
    { name:'Lenovo ThinkPad E15', brand:'Lenovo', emoji:'💻', price:64990, mrp:74990, rating:4.4, match:0,
      specs:['15.6" IPS Anti-glare','Intel i5 13th Gen','16GB DDR4','512GB SSD','MIL-SPEC Build'],
      tags:['business','office','durability','corporate','professional'],
      why:'Military-grade durability and legendary ThinkPad keyboard. Best for business professionals who travel.',
      platform:'Amazon India', conv:0 },
  ],
  tv: [
    { name:'LG 55" C3 OLED', brand:'LG', emoji:'📺', price:109990, mrp:139990, rating:4.8, match:0,
      specs:['55" OLED 4K 120Hz','Dolby Vision & Atmos','webOS Smart TV','4 HDMI 2.1 Ports','NVIDIA G-Sync'],
      tags:['movies','gaming','home theatre','premium','4k'],
      why:'Best picture quality available at any price. OLED blacks are unmatched for cinematic movie viewing.',
      platform:'Amazon India', conv:2 },
    { name:'Samsung 65" QLED 4K', brand:'Samsung', emoji:'📺', price:109990, mrp:129990, rating:4.6, match:0,
      specs:['65" QLED 4K 120Hz','Quantum HDR','Tizen Smart OS','Gaming Hub','360 Audio'],
      tags:['large room','family','movies','gaming','bright room'],
      why:'Best for large bright rooms. QLED brightness beats OLED in daylight. Gaming Hub for cloud gaming.',
      platform:'Flipkart', conv:3 },
    { name:'Sony Bravia 50" X75L', brand:'Sony', emoji:'📺', price:69990, mrp:82990, rating:4.4, match:0,
      specs:['50" 4K Google TV','X1 4K HDR Processor','Dolby Audio','Google Assistant Built-in','Chromecast'],
      tags:['smart home','streaming','mid-range','google','family'],
      why:'Google TV integrates with your smart home. Best streaming app experience with built-in Chromecast.',
      platform:'Amazon India', conv:0 },
  ],
  audio: [
    { name:'Sony WH-1000XM5', brand:'Sony', emoji:'🎧', price:26500, mrp:34990, rating:4.8, match:0,
      specs:['Industry Best ANC','30hr Battery','Multipoint Connect','LDAC Hi-Res','Speak-to-Chat'],
      tags:['anc','travel','work from home','calls','premium','focus'],
      why:'Best noise cancellation available. Perfect for offices, flights, and focused work.',
      platform:'Amazon India', conv:3 },
    { name:'Apple AirPods Pro 2', brand:'Apple', emoji:'🎵', price:22900, mrp:24900, rating:4.7, match:0,
      specs:['Active Noise Cancellation','Adaptive Audio','MagSafe Charging','6hr Battery','H2 Chip'],
      tags:['ios', 'iphone', 'workout', 'compact', 'calls', 'apple ecosystem'],
      why:'Best for iPhone users. Adaptive Audio adjusts ANC automatically. Seamless Apple device switching.',
      platform:'Flipkart', conv:4 },
    { name:'JBL Flip 6', brand:'JBL', emoji:'🔊', price:11999, mrp:14999, rating:4.5, match:0,
      specs:['12hr Battery','IP67 Waterproof','360° Sound','PartyBoost 2 Speakers','USB-C Charge'],
      tags:['portable','outdoor','waterproof','party','travel','beach'],
      why:'Waterproof and shockproof. Perfect for outdoors, travel, and poolside parties.',
      platform:'Flipkart', conv:0 },
  ],
  appliance: [
    { name:'LG 655L Side-by-Side Fridge', brand:'LG', emoji:'🧊', price:109990, mrp:129990, rating:4.6, match:0,
      specs:['655L Capacity','InstaView Door-in-Door','LinearCooling','Wi-Fi SmartDiagnosis','Hygiene Fresh Filter'],
      tags:['large family', 'premium', 'smart home', 'large kitchen'],
      why:'Smart diagnosis and InstaView window make it the most advanced fridge available.',
      platform:'Flipkart', conv:3 },
    { name:'Dyson V15 Detect', brand:'Dyson', emoji:'🌬️', price:52900, mrp:59900, rating:4.7, match:0,
      specs:['Laser Dust Detection','HEPA Filtration','60min Battery','LCD Screen','7 Attachments'],
      tags:['pet hair', 'allergy', 'premium', 'cordless', 'deep clean'],
      why:'Laser detects microscopic dust invisible to naked eye. Best for allergy sufferers and pet owners.',
      platform:'Amazon India', conv:2 },
    { name:'Samsung 8kg Front Loader', brand:'Samsung', emoji:'🫧', price:41990, mrp:48990, rating:4.5, match:0,
      specs:['8kg Capacity','EcoBubble Technology','AI Control','5 Star Rating','1400 RPM'],
      tags:['family', 'energy saving', 'large load', 'automatic'],
      why:'EcoBubble dissolves detergent 40x faster. AI Control auto-selects best wash cycle.',
      platform:'Croma', conv:1 },
    { name:'Voltas 1.5T 5-Star Split AC', brand:'Voltas', emoji:'❄️', price:32990, mrp:38990, rating:4.4, match:0,
      specs:['1.5 Ton / 5-Star BEE','Inverter Compressor','4-in-1 Convertible Mode','Auto Restart','Anti-Bacterial Filter'],
      tags:['medium room', 'energy saving', 'inverter', 'bedroom', 'family'],
      why:'5-Star BEE rating saves ₹4,000+ in electricity annually vs 3-star. Auto-clean prevents bacteria.',
      platform:'Amazon India', conv:4 },
  ],
  beauty: [
    { name:'Dyson Supersonic Hair Dryer', brand:'Dyson', emoji:'💁', price:32900, mrp:38900, rating:4.7, match:0,
      specs:['110,000 RPM Digital Motor','Intelligent Heat Control','5 Attachments','Flyaway Smoother','3yr Warranty'],
      tags:['ladies','hair','salon','premium','anti-frizz','heat protection'],
      why:'Intelligent heat control prevents extreme heat damage. Dries hair 3x faster than conventional dryers.',
      platform:'Flipkart', conv:0 },
    { name:'Philips Hair Dryer BHD356', brand:'Philips', emoji:'💇', price:2999, mrp:4499, rating:4.4, match:0,
      specs:['2200W Power','ThermoProtect Technology','3 Heat / 2 Speed Settings','Ionic Technology','Foldable Handle'],
      tags:['ladies','hair','budget','everyday','ionic','anti-frizz'],
      why:'ThermoProtect maintains safe drying temperature. Ionic technology reduces frizz. Great everyday value.',
      platform:'Amazon India', conv:2 },
    { name:'Havells Salon Pro Hair Straightener', brand:'Havells', emoji:'✨', price:1899, mrp:2499, rating:4.3, match:0,
      specs:['MCH Heating Technology','240°C Max Temp','Floating Plates','Auto Shut-off','Universal Voltage'],
      tags:['ladies','straightener','styling','budget','travel','everyday'],
      why:'MCH technology heats in 30 seconds. Floating plates glide smoothly without snagging.',
      platform:'Amazon India', conv:3 },
    { name:'Braun Series 9 Pro Shaver', brand:'Braun', emoji:'🪒', price:18999, mrp:24999, rating:4.6, match:0,
      specs:['5-in-1 SmartCare Centre','AutoSense Technology','Wet & Dry','60min Battery','ProLift Trimmer'],
      tags:['men','shaving','grooming','premium','wet dry'],
      why:'AutoSense reads beard density and auto-adjusts power. Self-cleaning dock for zero-effort maintenance.',
      platform:'Flipkart', conv:1 },
  ],
  fashion: [
    { name:'Nike Air Max 2024', brand:'Nike', emoji:'👟', price:9200, mrp:12995, rating:4.5, match:0,
      specs:['Air Max Cushioning','Mesh Upper','Rubber Outsole','Running / Casual','Sizes 6–12'],
      tags:['running','sports','casual','mens','comfortable','daily'],
      why:'Air Max cushioning absorbs impact — perfect for daily runs and casual wear. Iconic style.',
      platform:'Myntra', conv:4 },
    { name:"Puma Men's Training Pack", brand:'Puma', emoji:'🏋️', price:2499, mrp:3999, rating:4.3, match:0,
      specs:['3-Pack T-Shirts','DryCELL Moisture Wicking','Gym / Sports / Casual','S to XXL','Machine Washable'],
      tags:['gym','workout','mens','casual','value','sports'],
      why:'DryCELL technology keeps you dry during workouts. 3-pack value makes it a no-brainer purchase.',
      platform:'Ajio', conv:0 },
    { name:'Ray-Ban Aviator Classic', brand:'Ray-Ban', emoji:'🕶️', price:7800, mrp:9500, rating:4.6, match:0,
      specs:['UV400 Protection','Polarised Lenses','Metal Frame','Unisex','Made in Italy'],
      tags:['sunglasses','fashion','unisex','ladies','mens','summer','travel'],
      why:'Timeless design worn by everyone. UV400 protection and polarised lenses for real eye protection.',
      platform:'Lenskart', conv:3 },
  ],
  gaming: [
    { name:'PlayStation 5 Slim', brand:'Sony', emoji:'🎮', price:44990, mrp:49990, rating:4.8, match:0,
      specs:['Custom AMD RDNA 2','4K 120fps Gaming','Ultra-High Speed SSD','DualSense Controller','Blu-Ray Drive'],
      tags:['gaming','console','4k','exclusive games','family'],
      why:'Best gaming console for exclusive titles. DualSense haptic feedback is a game-changer.',
      platform:'Amazon India', conv:0 },
    { name:'Xbox Series S', brand:'Microsoft', emoji:'🕹️', price:29990, mrp:34990, rating:4.5, match:0,
      specs:['1440p / 120fps','512GB SSD','Game Pass Ready','All-Digital','Quick Resume'],
      tags:['gaming','budget','xbox game pass','compact','online gaming'],
      why:'Most affordable next-gen console. Xbox Game Pass gives 300+ games for ₹499/month.',
      platform:'Flipkart', conv:1 },
    { name:'Logitech G502 X Gaming Mouse', brand:'Logitech', emoji:'🖱️', price:5499, mrp:7999, rating:4.7, match:0,
      specs:['25,600 DPI Sensor','89g Lightweight','LIGHTFORCE Hybrid Switches','11 Programmable Buttons','USB-C'],
      tags:['pc gaming','mouse','fps','esports','competitive'],
      why:'LIGHTFORCE switches are 68% faster than traditional optical switches. Best for competitive FPS gaming.',
      platform:'Amazon India', conv:2 },
  ],
};

/* ── CATEGORY META ─────────────────────────────────── */
const CATEGORIES = [
  { id:'mobile',    label:'Mobile Phones',   icon:'📱' },
  { id:'laptop',    label:'Laptops',          icon:'💻' },
  { id:'tv',        label:'Smart TVs',        icon:'📺' },
  { id:'audio',     label:'Audio & Earbuds',  icon:'🎧' },
  { id:'appliance', label:'Home Appliances',  icon:'🏠' },
  { id:'beauty',    label:'Beauty & Grooming',icon:'💅' },
  { id:'fashion',   label:'Fashion & Shoes',  icon:'👟' },
  { id:'gaming',    label:'Gaming',           icon:'🎮' },
];

const FEATURE_SETS = {
  mobile:    ['Camera Quality','Battery Life','Gaming Performance','Slim & Lightweight','Business Use','Student Budget','Fast Charging','5G Ready','Selfie Camera','Premium Build'],
  laptop:    ['Long Battery','Thin & Light','Gaming Performance','Video Editing','Office Work','Programming','Large Screen','Backlit Keyboard','Student Budget','4K Display'],
  tv:        ['Movie Watching','Gaming','Large Room','Small Room','Smart Features','Bright Ambience','4K HDR','Dolby Atmos','Streaming Apps','Sports Viewing'],
  audio:     ['Noise Cancellation','Long Battery','Sports / Workout','Travel Use','Work Calls','Bass Heavy','Premium Sound','Compact / Portable','Waterproof','Wireless'],
  appliance: ['Energy Saving','Large Capacity','Smart Home','Quiet Operation','Auto Clean','Budget Friendly','Quick Operation','Family Size','Compact Design','Premium Brand'],
  beauty:    ['Anti-Frizz','Heat Protection','Fast Drying','Salon Finish','Travel Friendly','Everyday Use','Ionic Technology','Multiple Settings','Long Cord','Budget Friendly'],
  fashion:   ['Running / Sports','Casual Wear','Office Wear','Premium Brand','Budget Friendly','Comfort Fit','Trendy Style','Unisex','Waterproof','Eco Friendly'],
  gaming:    ['4K Graphics','Fast Load Times','Online Multiplayer','Budget Gaming','Compact Size','Game Library','Controller Feel','Streaming / Twitch','Exclusive Titles','Cross Platform'],
};

/* ── STATE ─────────────────────────────────────────── */
let advState = {
  step: 1,
  category: '',
  budget: 50000,
  features: [],
  usecase: '',
  priorities: ['Performance','Value for Money','Brand Reputation','After-Sales Support','Design & Build'],
};

/* ── INIT ─────────────────────────────────────────── */
function initAdvisor() {
  renderCategoryGrid();
  setupBudgetSlider();
  setupDragRank();
  renderFeatureChips();
}

/* ── STEP NAVIGATION ──────────────────────────────── */
function advGoTo(step) {
  // Validate before going forward
  if (step > advState.step) {
    if (advState.step === 1 && !advState.category) {
      showAdvError('Please select a category first.'); return;
    }
    if (advState.step === 2 && advState.budget < 500) {
      showAdvError('Please set a budget.'); return;
    }
  }
  advState.step = step;
  document.querySelectorAll('.adv-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.adv-step-dot').forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (i + 1 < step) d.classList.add('done');
    if (i + 1 === step) d.classList.add('active');
  });
  const panel = document.getElementById('advPanel' + step);
  if (panel) panel.classList.add('active');
  document.getElementById('advisor').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showAdvError(msg) {
  let el = document.getElementById('advError');
  if (!el) { el = document.createElement('div'); el.id = 'advError'; el.style.cssText = 'background:rgba(220,38,38,0.1);border:1px solid #dc2626;color:#dc2626;border-radius:4px;padding:10px 14px;font-size:0.8rem;font-weight:600;margin-top:8px;'; document.querySelector('.adv-nav')?.before(el); }
  el.textContent = '⚠️ ' + msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

/* ── STEP 1: CATEGORY ─────────────────────────────── */
function renderCategoryGrid() {
  const grid = document.getElementById('advCatGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="adv-cat ${advState.category === c.id ? 'sel' : ''}" onclick="selectCategory('${c.id}',this)">
      <span class="ac-icon">${c.icon}</span>
      <span class="ac-label">${c.label}</span>
    </div>`).join('');
}
function selectCategory(id, el) {
  advState.category = id;
  document.querySelectorAll('.adv-cat').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  renderFeatureChips();
}

/* ── STEP 2: BUDGET ───────────────────────────────── */
function setupBudgetSlider() {
  const sl = document.getElementById('advBudgetSlider');
  if (!sl) return;
  sl.addEventListener('input', function () {
    advState.budget = parseInt(this.value);
    updateBudgetDisplay();
    updateSliderGradient(this);
  });
  updateBudgetDisplay();
  updateSliderGradient(sl);
}
function updateBudgetDisplay() {
  const el = document.getElementById('advBudgetDisplay');
  if (el) el.textContent = '₹' + advState.budget.toLocaleString('en-IN');
}
function updateSliderGradient(sl) {
  const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
  sl.style.background = `linear-gradient(to right,var(--accent) ${pct}%,#222 ${pct}%)`;
}

/* ── STEP 3: FEATURES ─────────────────────────────── */
function renderFeatureChips() {
  const wrap = document.getElementById('advFeatureWrap');
  if (!wrap) return;
  const set = FEATURE_SETS[advState.category] || FEATURE_SETS.mobile;
  wrap.innerHTML = set.map(f => `
    <div class="adv-chip ${advState.features.includes(f) ? 'sel' : ''}" onclick="toggleFeature('${f}',this)">${f}</div>
  `).join('');
}
function toggleFeature(f, el) {
  el.classList.toggle('sel');
  if (advState.features.includes(f)) advState.features = advState.features.filter(x => x !== f);
  else advState.features.push(f);
}

/* ── STEP 4: PRIORITIES DRAG RANK ─────────────────── */
function setupDragRank() {
  const list = document.getElementById('advRankList');
  if (!list) return;
  let dragging = null;
  list.querySelectorAll('.adv-rank-item').forEach(item => {
    item.addEventListener('dragstart', () => { dragging = item; item.style.opacity = '0.5'; });
    item.addEventListener('dragend', () => { item.style.opacity = '1'; dragging = null; updateRankNumbers(); });
    item.addEventListener('dragover', e => { e.preventDefault(); if (dragging && dragging !== item) list.insertBefore(dragging, item); });
  });
}
function updateRankNumbers() {
  const items = document.querySelectorAll('.adv-rank-item');
  advState.priorities = [];
  items.forEach((item, i) => {
    item.querySelector('.adv-rank-num').textContent = i + 1;
    advState.priorities.push(item.dataset.value);
  });
}

/* ── STEP 5: USE CASE ─────────────────────────────── */
// Reads from textarea on analyze

/* ── ANALYZE & SCORE ─────────────────────────────── */
function startAnalysis() {
  advState.usecase = (document.getElementById('advUsecase')?.value || '').toLowerCase();

  const loading = document.getElementById('advLoading');
  const results = document.getElementById('advResults');
  const wizard  = document.getElementById('advWizardInner');

  wizard.style.display = 'none';
  loading.style.display = 'block';
  results.classList.remove('show');

  const steps = ['🔍 Scanning your preferences…', '📊 Analysing 500+ products…', '💡 Matching features to your needs…', '⚖️ Comparing prices across 40 platforms…', '🤖 Generating personalised recommendations…'];
  const stepEls = document.querySelectorAll('.adv-ls');
  let si = 0;
  const stepTimer = setInterval(() => {
    if (si > 0 && stepEls[si - 1]) stepEls[si - 1].classList.remove('active');
    if (si < stepEls.length) { stepEls[si].classList.add('active'); si++; }
    else clearInterval(stepTimer);
  }, 600);

  setTimeout(() => {
    clearInterval(stepTimer);
    loading.style.display = 'none';
    const scored = scoreProducts();
    renderResults(scored);
    results.classList.add('show');
  }, 3800);
}

function scoreProducts() {
  const pool = ADVISOR_DB[advState.category] || [];
  const usecaseLower = advState.usecase.toLowerCase();

  // Extract meaningful keywords from use case (words > 2 chars)
  const usecaseWords = usecaseLower.split(/\s+/).filter(w => w.length > 2);

  const scored = pool.map(p => {
    let score = 0;

    // Budget fit (0–40 pts) — no hard cutoff, just score lower if over
    if (p.price <= advState.budget) score += 40;
    else if (p.price <= advState.budget * 1.1) score += 28;
    else if (p.price <= advState.budget * 1.25) score += 15;
    else if (p.price <= advState.budget * 1.5) score += 5;
    else score += 1; // still show, just rank low

    // Feature match (0–30 pts)
    const tagScore = advState.features.filter(f =>
      p.tags.some(t => t.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(t.toLowerCase()))
    ).length;
    score += Math.min(tagScore * 8, 30);

    // Use case keyword match (0–20 pts)
    if (usecaseLower) {
      const matches = usecaseWords.filter(kw =>
        p.tags.join(' ').includes(kw) ||
        p.why.toLowerCase().includes(kw) ||
        p.name.toLowerCase().includes(kw) ||
        p.specs.join(' ').toLowerCase().includes(kw)
      );
      score += Math.min(matches.length * 5, 20);
    }

    // Rating boost (0–10 pts)
    score += Math.round((p.rating - 4.0) * 20);

    // Build personalised "why" explanation
    const why = buildPersonalisedWhy(p, usecaseWords);

    return { ...p, match: Math.min(Math.round(score), 99), why };
  })
  .sort((a, b) => b.match - a.match)
  .slice(0, 5);

  // ALWAYS return results — never empty
  return scored;
}

function buildPersonalisedWhy(p, usecaseWords) {
  const parts = [];

  // 1. Budget context
  const budgetDiff = p.price - advState.budget;
  if (budgetDiff <= 0) {
    parts.push(`Fits your ₹${advState.budget.toLocaleString('en-IN')} budget with ₹${Math.abs(budgetDiff).toLocaleString('en-IN')} to spare.`);
  } else {
    parts.push(`Just ₹${budgetDiff.toLocaleString('en-IN')} above your budget — worth the stretch for what it offers.`);
  }

  // 2. Feature match sentences
  const matchedFeatures = advState.features.filter(f =>
    p.tags.some(t => t.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(t.toLowerCase()))
  );
  if (matchedFeatures.length > 0) {
    parts.push(`Matches your interest in ${matchedFeatures.slice(0,3).join(', ')}.`);
  }

  // 3. Use case keyword match — mention what the user said
  if (usecaseWords.length > 0) {
    const hitWords = usecaseWords.filter(kw =>
      p.tags.join(' ').includes(kw) ||
      p.why.toLowerCase().includes(kw) ||
      p.specs.join(' ').toLowerCase().includes(kw)
    );
    if (hitWords.length > 0) {
      parts.push(`Based on your use case ("${advState.usecase.slice(0,60)}${advState.usecase.length>60?'…':''}"): great fit for ${hitWords.slice(0,2).join(' and ')}.`);
    } else if (advState.usecase.trim()) {
      parts.push(`For your use case: "${advState.usecase.slice(0,60)}${advState.usecase.length>60?'…':''}" — ${p.why.split('.')[0]}.`);
    }
  }

  // 4. Always add the core product strength
  parts.push(p.why.split('.')[0] + '.');

  return parts.join(' ');
}

function renderResults(products) {
  const topPick = products[0];
  const catMeta = CATEGORIES.find(c => c.id === advState.category) || {};
  const allOverBudget = products.every(p => p.price > advState.budget);
  const someOverBudget = products.some(p => p.price > advState.budget);

  // Budget notice — shown only when results exist but are over budget
  const budgetNotice = allOverBudget
    ? `<div style="background:rgba(232,160,32,0.12);border:1px solid rgba(232,160,32,0.35);border-radius:6px;padding:12px 16px;margin-bottom:20px;font-size:0.82rem;color:var(--gold);">
        💡 No products in this category fit ₹${advState.budget.toLocaleString('en-IN')} exactly — showing the closest options. Consider increasing your budget slightly to get the best value.
       </div>`
    : someOverBudget
    ? `<div style="background:rgba(232,160,32,0.08);border:1px solid rgba(232,160,32,0.2);border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:0.8rem;color:var(--gold);">
        💡 Some options are slightly above your budget but are the best fit for your needs.
       </div>`
    : '';

  document.getElementById('advResults').innerHTML = `
    <div class="adv-result-intro">
      <h3>🎯 Here are your best ${catMeta.label || ''} options</h3>
      <p>Based on your ₹${advState.budget.toLocaleString('en-IN')} budget${advState.usecase ? `, your use case, ` : ', '}and selected features — sorted by AI match score.</p>
    </div>
    ${budgetNotice}
    <div class="adv-result-summary">
      <div class="adv-sum-chip"><strong>₹${advState.budget.toLocaleString('en-IN')}</strong>Your Budget</div>
      <div class="adv-sum-chip"><strong>${products.length}</strong>Options Found</div>
      <div class="adv-sum-chip"><strong>${advState.features.length || 'Any'}</strong>Features Matched</div>
      <div class="adv-sum-chip"><strong>${topPick.match}%</strong>Top Match Score</div>
    </div>
    <div class="adv-result-grid">
      ${products.map((p, i) => {
        const overBudget = p.price > advState.budget;
        return `
        <div class="arc ${i === 0 ? 'top-pick' : ''}">
          ${i === 0 ? '<div class="arc-top-label">🏆 AI Top Pick for You</div>' : ''}
          <div class="arc-body">
            <span class="arc-emoji">${p.emoji}</span>
            <div class="arc-name">${p.name}</div>
            <div class="arc-brand">${p.brand} · ${p.platform}</div>
            <div class="arc-price-row">
              <span class="arc-price" style="${overBudget ? 'color:var(--gold)' : ''}">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="arc-mrp">₹${p.mrp.toLocaleString('en-IN')}</span>
              <span class="arc-saving">Save ₹${(p.mrp - p.price).toLocaleString('en-IN')}</span>
              ${overBudget ? `<span style="font-size:0.65rem;color:var(--gold);padding:2px 6px;background:rgba(232,160,32,0.12);border-radius:3px;">+₹${(p.price-advState.budget).toLocaleString('en-IN')} over</span>` : ''}
            </div>
            <div class="arc-match-wrap">
              <div class="arc-match-label"><span>AI Match Score</span><span>${p.match}%</span></div>
              <div class="arc-bar"><div class="arc-bar-fill" style="width:0" data-width="${p.match}"></div></div>
            </div>
            <div class="arc-specs">
              ${p.specs.slice(0, 4).map(s => `<div class="arc-spec"><span class="si">✦</span><span class="sv">${s}</span></div>`).join('')}
            </div>
            <div class="arc-why">
              <strong>Why this for you?</strong>
              <p>${p.why}</p>
            </div>
            <div class="arc-btns">
              <button class="arc-btn-nego" onclick="startNegotiateProduct(${p.conv || 0})">⚡ Negotiate Price</button>
              <button class="arc-btn-alert" onclick="openAlertModal('p1','${p.name.replace(/'/g,"\\'")}')">🔔 Set Alert</button>
            </div>
          </div>
        </div>`}).join('')}
    </div>

    <div class="adv-compare-wrap">
      <h5>📊 Side-by-Side Comparison</h5>
      <div style="overflow-x:auto;">
        <table class="adv-tbl">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>AI Match</th>
              <th>Rating</th>
              <th>Why It Suits You</th>
              <th>Platform</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((p, i) => `
              <tr class="${i === 0 ? 'pick-row' : ''}">
                <td style="color:${i === 0 ? 'white' : '#777'};font-weight:${i === 0 ? '700' : '400'};">${i === 0 ? '🏆 ' : ''}${p.name}</td>
                <td class="${i === 0 ? 'best' : ''}" style="${p.price > advState.budget ? 'color:var(--gold)' : ''}">₹${p.price.toLocaleString('en-IN')}</td>
                <td class="${i === 0 ? 'best' : ''}">${p.match}%</td>
                <td>${'⭐'.repeat(Math.round(p.rating))} ${p.rating}</td>
                <td style="color:#555;max-width:200px;">${p.why.split('.')[0]}.</td>
                <td style="color:#444;">${p.platform}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="adv-reset-wrap">
      <button class="adv-reset" onclick="resetAdvisor()">← Start Over with Different Preferences</button>
    </div>`;

  // Animate bars after render
  setTimeout(() => {
    document.querySelectorAll('.arc-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 200);
}

function resetAdvisor() {
  advState = { step: 1, category: '', budget: 50000, features: [], usecase: '', priorities: ['Performance','Value for Money','Brand Reputation','After-Sales Support','Design & Build'] };
  document.getElementById('advWizardInner').style.display = 'block';
  document.getElementById('advLoading').style.display = 'none';
  document.getElementById('advResults').classList.remove('show');
  document.getElementById('advResults').innerHTML = '';
  renderCategoryGrid();
  renderFeatureChips();
  updateBudgetDisplay();
  const sl = document.getElementById('advBudgetSlider');
  if (sl) { sl.value = 50000; updateSliderGradient(sl); }
  advGoTo(1);
}