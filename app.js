// ════════════════════════════════════════════════════════════════════════
// FORGEX – Kompletná fitness PWA
// ════════════════════════════════════════════════════════════════════════

// ───────────────────────── THEMES ─────────────────────────────────────────
const THEMES = {
  forge:    { name:'Forge',    emoji:'🔥', dark:true,  c:{ bg:'#0C0C0E', surf:'#18181C', surf2:'#222228', surf3:'#2E2E36', surf4:'#38383E', txt:'#F2F2F4', txtDim:'#8E8E9E', txtFaint:'#4A4A58', pri:'#FF4D1A', priDim:'#FF4D1A18', priMid:'#FF4D1A44', priLight:'#FF7A50', acc:'#FF9F1C', border:'#FFFFFF0C', border2:'#FFFFFF18', border3:'#FFFFFF28' } },
  electric: { name:'Electric', emoji:'⚡', dark:true,  c:{ bg:'#0D0D12', surf:'#16161F', surf2:'#1F1F2E', surf3:'#28283A', surf4:'#323246', txt:'#F0F0FF', txtDim:'#8888AA', txtFaint:'#44445A', pri:'#7C6FFF', priDim:'#7C6FFF18', priMid:'#7C6FFF44', priLight:'#A99BFF', acc:'#00D4FF', border:'#FFFFFF0C', border2:'#FFFFFF18', border3:'#FFFFFF28' } },
  vital:    { name:'Vital',    emoji:'💚', dark:true,  c:{ bg:'#0C0E0C', surf:'#161C16', surf2:'#1D241D', surf3:'#262E26', surf4:'#303830', txt:'#F2F5F2', txtDim:'#8EA08E', txtFaint:'#4A564A', pri:'#1DB954', priDim:'#1DB95418', priMid:'#1DB95444', priLight:'#4DD87A', acc:'#FFBE0B', border:'#FFFFFF0C', border2:'#FFFFFF18', border3:'#FFFFFF28' } },
  arctic:   { name:'Arctic',   emoji:'❄️', dark:true,  c:{ bg:'#0A0E16', surf:'#131B26', surf2:'#1A2333', surf3:'#222D40', surf4:'#2C384E', txt:'#EEF2FF', txtDim:'#8A9EC0', txtFaint:'#4A5A78', pri:'#4A9EFF', priDim:'#4A9EFF18', priMid:'#4A9EFF44', priLight:'#7BBFFF', acc:'#64FFDA', border:'#FFFFFF0C', border2:'#FFFFFF18', border3:'#FFFFFF28' } },
  steel:    { name:'Steel',    emoji:'🩶', dark:true,  c:{ bg:'#0E0E10', surf:'#1A1A1E', surf2:'#222226', surf3:'#2C2C32', surf4:'#36363E', txt:'#F0F0F2', txtDim:'#888898', txtFaint:'#484858', pri:'#A0A8BE', priDim:'#A0A8BE18', priMid:'#A0A8BE44', priLight:'#C4CCE0', acc:'#D4D8E8', border:'#FFFFFF0C', border2:'#FFFFFF18', border3:'#FFFFFF28' } },
  light:    { name:'Light',    emoji:'☀️', dark:false, c:{ bg:'#F7F7F9', surf:'#FFFFFF', surf2:'#F0F0F4', surf3:'#E4E4EA', surf4:'#D8D8E0', txt:'#18181E', txtDim:'#60607A', txtFaint:'#9090A8', pri:'#FF4D1A', priDim:'#FF4D1A10', priMid:'#FF4D1A30', priLight:'#FF7A50', acc:'#E08E00', border:'#0000000A', border2:'#00000016', border3:'#00000024' } },
};
const THEME_KEYS = Object.keys(THEMES);

function applyTheme(themeKey) {
  let key = themeKey;
  if (key === 'auto') {
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    key = systemDark ? 'forge' : 'light';
  }
  const t = THEMES[key] || THEMES.forge;
  const root = document.documentElement;
  const c = t.c;
  // Všetky nové tokeny
  root.style.setProperty('--bg', c.bg);
  root.style.setProperty('--surf', c.surf);
  root.style.setProperty('--surf2', c.surf2);
  root.style.setProperty('--surf3', c.surf3);
  root.style.setProperty('--surf4', c.surf4);
  root.style.setProperty('--txt', c.txt);
  root.style.setProperty('--txtDim', c.txtDim);
  root.style.setProperty('--txtFaint', c.txtFaint);
  root.style.setProperty('--pri', c.pri);
  root.style.setProperty('--priDim', c.priDim);
  root.style.setProperty('--priMid', c.priMid);
  root.style.setProperty('--priLight', c.priLight);
  root.style.setProperty('--acc', c.acc);
  root.style.setProperty('--border', c.border);
  root.style.setProperty('--border2', c.border2);
  root.style.setProperty('--border3', c.border3);
  document.body.style.background = c.bg;
  const metaTheme = document.querySelector('meta[name=theme-color]');
  if (metaTheme) metaTheme.setAttribute('content', c.bg);
}

// ───────────────────────── CALCULATIONS ─────────────────────────────────
const ACTIVITY_MULT = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };
const ACTIVITY_LABELS = {
  sedentary:'Sedavý (málo/žiadny pohyb)',
  light:'Mierne aktívny (1–3×/týždeň)',
  moderate:'Aktívny (3–5×/týždeň)',
  active:'Veľmi aktívny (6–7×/týždeň)',
  very_active:'Extrémne aktívny (fyzická práca + tréning)',
};
const GOAL_LABELS = { hypertrophy:'Objem (hypertrofia)', strength:'Sila', fat_loss:'Chudnutie', recomp:'Rekompozícia (tvarovanie)' };

function calcBMI(w,h){ if(!w||!h) return null; const m=h/100; return +(w/(m*m)).toFixed(1); }
function bmiCategory(b){ if(b==null) return '–'; if(b<18.5) return 'Podváha'; if(b<25) return 'Normálna váha'; if(b<30) return 'Nadváha'; return 'Obezita'; }
function calcBMR({gender,weightKg,heightCm,age}){ if(!weightKg||!heightCm||!age) return null; const base=10*weightKg+6.25*heightCm-5*age; return Math.round(gender==='female'?base-161:base+5); }
function calcTDEE(bmr,activity){ if(!bmr) return null; return Math.round(bmr*(ACTIVITY_MULT[activity]||1.2)); }
function calcCalorieTarget(tdee,goal){
  if(!tdee) return null;
  if(goal==='fat_loss') return Math.round(tdee*0.8);
  if(goal==='hypertrophy') return Math.round(tdee*1.1);
  if(goal==='strength') return Math.round(tdee*1.05);
  return tdee;
}
function calcMacros({weightKg,calorieTarget,goal}){
  if(!weightKg||!calorieTarget) return null;
  let pPerKg = goal==='fat_loss' ? 2.2 : (goal==='hypertrophy'||goal==='strength') ? 2.0 : 1.8;
  const proteinG = Math.round(weightKg*pPerKg);
  const proteinKcal = proteinG*4;
  const fatPct = goal==='fat_loss' ? 0.25 : 0.3;
  const fatKcal = calorieTarget*fatPct;
  const fatG = Math.round(fatKcal/9);
  const remain = calorieTarget - proteinKcal - fatKcal;
  const carbsG = Math.round(Math.max(remain,0)/4);
  return { proteinG, fatG, carbsG };
}
function calcHydration(w,activity){
  if(!w) return null;
  let base = w*35;
  if(activity==='active') base+=500;
  if(activity==='very_active') base+=750;
  return Math.round(base/50)*50;
}
function calcNavyBodyFat({gender,waistCm,neckCm,hipCm,heightCm}){
  if(!waistCm||!neckCm||!heightCm) return null;
  if(gender==='female'&&!hipCm) return null;
  let bf;
  if(gender==='male'){
    bf = 495/(1.0324-0.19077*Math.log10(waistCm-neckCm)+0.15456*Math.log10(heightCm))-450;
  } else {
    bf = 495/(1.29579-0.35004*Math.log10(waistCm+hipCm-neckCm)+0.221*Math.log10(heightCm))-450;
  }
  if(!isFinite(bf)||bf<0) return null;
  return +bf.toFixed(1);
}
function calcIdealWeight({gender,heightCm}){
  if(!heightCm) return null;
  const inches = heightCm/2.54;
  const over5 = Math.max(inches-60,0);
  const base = gender==='female' ? 45.5 : 50.0;
  return Math.round((base+2.3*over5)*10)/10;
}
function calcBodyAge({age,bmi,activityLevel}){
  if(!age||!bmi) return null;
  let mod=0;
  if(bmi<18.5) mod+=2; else if(bmi>=25&&bmi<30) mod+=2; else if(bmi>=30) mod+=6; else mod-=1;
  const ab={sedentary:3,light:1,moderate:-1,active:-3,very_active:-4};
  mod += ab[activityLevel] ?? 0;
  return Math.max(Math.round(age+mod),15);
}
function calcOneRM(w,reps){ if(!w||!reps) return null; if(reps===1) return w; return Math.round(w*(1+reps/30)); }
function calcWarmupSets(workingWeight){
  if(!workingWeight) return [];
  const round=v=>Math.round(v/2.5)*2.5;
  return [
    {pct:40,weight:round(workingWeight*0.4),reps:'10–12'},
    {pct:60,weight:round(workingWeight*0.6),reps:'6–8'},
    {pct:80,weight:round(workingWeight*0.8),reps:'3–4'},
  ];
}

// ───────────────────────── JEDNOTKY (kg/lbs, cm/inch) ──────────────────
function kgToLbs(kg){ return Math.round(kg*2.20462*10)/10; }
function lbsToKg(lbs){ return Math.round(lbs/2.20462*10)/10; }
function cmToInch(cm){ return Math.round(cm/2.54*10)/10; }
// Zobrazí hmotnosť v jednotkách užívateľa (interne vždy ukladáme kg)
function displayWeight(kg){
  if (kg==null || kg==='') return '';
  return (PROFILE.units==='imperial') ? kgToLbs(kg) : kg;
}
function weightUnit(){ return PROFILE.units==='imperial' ? 'lbs' : 'kg'; }
function lengthUnit(){ return PROFILE.units==='imperial' ? 'in' : 'cm'; }
// Konvertuje zadanú hodnotu (v jednotkách užívateľa) späť na kg pre uloženie
function inputToKg(val){
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return (PROFILE.units==='imperial') ? lbsToKg(n) : n;
}

// ───────────────────────── PROGRESÍVNE PREŤAŽENIE ──────────────────────
// Zistí, či je cvik pre "vrch tela" (menší krok) alebo "nohy" (väčší krok)
const LOWER_MUSCLES = ['quads','hamstrings','glutes','calves'];
function progStepForMuscle(muscle){
  return LOWER_MUSCLES.includes(muscle) ? (PROFILE.progStepLower||5) : (PROFILE.progStepUpper||2.5);
}
// Parsuje horný cieľ z reps stringu ("6–8" -> 8, "12" -> 12, "30–60s" -> null)
function parseTopReps(reps){
  if (!reps) return null;
  const m = String(reps).match(/(\d+)\s*[–-]\s*(\d+)/);
  if (m) return parseInt(m[2],10);
  const single = String(reps).match(/^(\d+)$/);
  if (single) return parseInt(single[1],10);
  return null;
}
function parseBottomReps(reps){
  if (!reps) return null;
  const m = String(reps).match(/(\d+)\s*[–-]\s*(\d+)/);
  if (m) return parseInt(m[1],10);
  const single = String(reps).match(/^(\d+)$/);
  if (single) return parseInt(single[1],10);
  return null;
}
// Vráti najlepší (najťažší) posledný výkon cviku z histórie
function getLastWorkoutForExercise(exId){
  for (let i=HISTORY.length-1;i>=0;i--){
    if (HISTORY[i].data[exId]){
      const sets = (HISTORY[i].data[exId].sets||[]).filter(s=>s.done && s.weight);
      if (sets.length) return sets;
    }
  }
  return null;
}
// Navrhne progres na základe posledného výkonu + nastavení užívateľa
// Vráti { weight, reps, reason } alebo null
function suggestProgression(ex){
  if (PROFILE.progRule==='off') return null;
  const lastSets = getLastWorkoutForExercise(ex.id);
  if (!lastSets) return null;

  const topRep = parseTopReps(ex.reps);
  const bottomRep = parseBottomReps(ex.reps);
  const lastWeight = Math.max(...lastSets.map(s=>parseFloat(s.weight)));
  const setsAtTopWeight = lastSets.filter(s=>parseFloat(s.weight)===lastWeight);
  const step = progStepForMuscle(ex.muscle);

  // Koľko sérií dosiahlo horný rozsah opakovaní
  const repsHitTop = setsAtTopWeight.filter(s=>topRep && parseInt(s.reps,10)>=topRep);

  let shouldAddWeight = false;
  if (PROFILE.progRule==='aggressive') {
    shouldAddWeight = true;
  } else if (PROFILE.progRule==='any_set') {
    shouldAddWeight = repsHitTop.length >= 1;
  } else { // 'all_sets' (default)
    shouldAddWeight = topRep && repsHitTop.length >= setsAtTopWeight.length && setsAtTopWeight.length>0;
  }

  if (shouldAddWeight && topRep) {
    return {
      weight: lastWeight + step,
      reps: bottomRep || topRep,
      reason: `Minule ${lastSets.map(s=>s.reps).join(',')} → pridaj ${step}${weightUnit()}`,
    };
  } else {
    // Zopakuj váhu, cieľ pridať opakovania
    const maxReps = Math.max(...setsAtTopWeight.map(s=>parseInt(s.reps,10)||0));
    return {
      weight: lastWeight,
      reps: topRep ? Math.min(maxReps+1, topRep) : maxReps,
      reason: `Minule ${lastSets.map(s=>s.reps).join(',')} → skús pridať opakovania`,
    };
  }
}

// ───────────────────────── STORAGE ─────────────────────────────────────
const DB = {
  key:k=>`forgex_${k}`,
  get:k=>{ try{ return JSON.parse(localStorage.getItem(DB.key(k))||'null'); } catch{ return null; } },
  set:(k,v)=>localStorage.setItem(DB.key(k),JSON.stringify(v)),
};

const DEFAULT_PROFILE = {
  onboardingComplete:false, name:'', gender:null, age:null, heightCm:null, weightKg:null,
  bodyFatPct:null, waistCm:null, neckCm:null, hipCm:null,
  chestCm:null, shoulderCm:null, thighCm:null, calfCm:null, bicepCm:null,
  goal:null, activityLevel:null, theme:'auto',
  // ── Nastavenia (Dávka 3) ──
  units:'metric',            // 'metric' (kg/cm) | 'imperial' (lbs/inch)
  lang:'sk',                 // 'sk' | 'cz' | 'en' (zatiaľ len SK aktívne)
  notifRest:true,            // notifikácia po prestávke
  notifDaily:false,          // denná pripomienka tréningu
  promoCode:null,            // zadaný promo kód
  premium:false,             // true = bez reklám (odomknuté promo kódom)
  // ── Časovač (Dávka 1) ──
  restSeconds:90,            // default dĺžka prestávky medzi sériami
  restAutoStart:true,        // auto spustenie po odkliknutí série
  // ── Progresívne preťaženie (Dávka 1) ──
  progStepUpper:2.5,         // krok váhy pre vrch tela (kg)
  progStepLower:5,           // krok váhy pre nohy (kg)
  progRule:'all_sets',       // 'all_sets' | 'any_set' | 'aggressive' | 'off'
  showRIR:false,             // zobrazovať RIR pole (pre pokročilých); default skryté
  // ── Home layout (vlastné usporiadanie sekcií) ──
  homeLayout: ['hero','calories','water_streak'], // poradie sekcií; ak chýba sekcia v zozname = vypnutá
  warmupOverrides: {}, // per-cvik override pre zobrazenie rozcvičky (true/false), appka inak navrhuje sama
};
const HOME_SECTIONS_META = {
  hero:        { label:'Dnešný tréning', icon:'🏋️', removable:false },
  calories:    { label:'Kalórie a makrá', icon:'🔥', removable:true },
  water_streak:{ label:'Voda a séria', icon:'💧', removable:true },
};
let PROFILE = { ...DEFAULT_PROFILE, ...(DB.get('profile')||{}) };
function saveProfile(patch){ PROFILE = { ...PROFILE, ...patch }; DB.set('profile', PROFILE); scheduleCloudPush(); }
// Zaisti, že homeLayout je vždy platné pole (ochrana pred starými profilmi z localStorage)
if (!Array.isArray(PROFILE.homeLayout)) PROFILE.homeLayout = [...DEFAULT_PROFILE.homeLayout];

let SESSION = DB.get('session') || {};      // aktívny rozpísaný tréning, klúč = day.id
function saveSession(){ DB.set('session', SESSION); scheduleCloudPush(); }
let HISTORY = DB.get('history') || [];      // dokončené tréningy
function saveHistory(){ DB.set('history', HISTORY); scheduleCloudPush(); }
let CUSTOM_SPLITS = DB.get('splits') || []; // [{id, name, days:[{id,label,title,subtitle,exercises:[{id,name,sets,reps,note,muscle}]}]}]
function saveSplits(){ DB.set('splits', CUSTOM_SPLITS); scheduleCloudPush(); }
let ACTIVE_SPLIT_ID = DB.get('activeSplitId') || null; // null = preset PPL, inak ID z CUSTOM_SPLITS
function saveActiveSplitId(){ DB.set('activeSplitId', ACTIVE_SPLIT_ID); scheduleCloudPush(); }
let NUTRITION_LOG = DB.get('nutrition') || {}; // { 'YYYY-MM-DD': [{...}] }
function saveNutrition(){ DB.set('nutrition', NUTRITION_LOG); scheduleCloudPush(); }
let WATER_LOG = DB.get('water') || {}; // { 'YYYY-MM-DD': ml }
function saveWater(){ DB.set('water', WATER_LOG); scheduleCloudPush(); }
let CUSTOM_FOODS = DB.get('customFoods') || []; // vlastné potraviny užívateľa
function saveCustomFoods(){ DB.set('customFoods', CUSTOM_FOODS); scheduleCloudPush(); }
let RECENT_FOODS = DB.get('recentFoods') || []; // nedávno použité (názvy)
function saveRecentFoods(){ DB.set('recentFoods', RECENT_FOODS); scheduleCloudPush(); }
// Záznamy telesných mier v čase: [{date, weightKg, bodyFatPct, waistCm, chestCm, bicepCm, thighCm, hipCm}]
let BODY_LOG = DB.get('bodyLog') || [];
function saveBodyLog(){ DB.set('bodyLog', BODY_LOG); scheduleCloudPush(); }

// ───────────────────────── CLOUD SYNC (Supabase) ────────────────────────
const SUPABASE_URL = 'https://bbfbvljfmztemoexkkqc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZmJ2bGpmbXp0ZW1vZXhra3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTc1MzQsImV4cCI6MjA5NzQzMzUzNH0.B4cDRlm_DUdCCJSgtMN1m6AF94Zg5N-8Zq3oE2jdJHg';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let CLOUD_USER = null; // prihlásený Supabase užívateľ, alebo null ak nie je prihlásený
let cloudSyncTimer = null;

function getLocalStateSnapshot() {
  return {
    profile: PROFILE, session: SESSION, history: HISTORY, splits: CUSTOM_SPLITS,
    activeSplitId: ACTIVE_SPLIT_ID, nutrition: NUTRITION_LOG, water: WATER_LOG,
    customFoods: CUSTOM_FOODS, recentFoods: RECENT_FOODS, bodyLog: BODY_LOG,
  };
}

function applyCloudState(data) {
  if (!data) return;
  if (data.profile) { PROFILE = { ...DEFAULT_PROFILE, ...data.profile }; DB.set('profile', PROFILE); }
  if (data.session) { SESSION = data.session; DB.set('session', SESSION); }
  if (data.history) { HISTORY = data.history; DB.set('history', HISTORY); }
  if (data.splits) { CUSTOM_SPLITS = data.splits; DB.set('splits', CUSTOM_SPLITS); }
  if ('activeSplitId' in data) { ACTIVE_SPLIT_ID = data.activeSplitId; DB.set('activeSplitId', ACTIVE_SPLIT_ID); }
  if (data.nutrition) { NUTRITION_LOG = data.nutrition; DB.set('nutrition', NUTRITION_LOG); }
  if (data.water) { WATER_LOG = data.water; DB.set('water', WATER_LOG); }
  if (data.customFoods) { CUSTOM_FOODS = data.customFoods; DB.set('customFoods', CUSTOM_FOODS); }
  if (data.recentFoods) { RECENT_FOODS = data.recentFoods; DB.set('recentFoods', RECENT_FOODS); }
  if (data.bodyLog) { BODY_LOG = data.bodyLog; DB.set('bodyLog', BODY_LOG); }
}

// Posiela lokálny stav do cloudu s krátkym debounce, aby sa pri rýchlych zmenách neposielalo zakaždým
function scheduleCloudPush() {
  if (!CLOUD_USER) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(pushStateToCloud, 1500);
}

async function pushStateToCloud() {
  if (!CLOUD_USER) return;
  await supabaseClient.from('user_state').upsert({
    user_id: CLOUD_USER.id,
    data: getLocalStateSnapshot(),
    updated_at: new Date().toISOString(),
  });
}

async function pullStateFromCloud() {
  if (!CLOUD_USER) return;
  const { data, error } = await supabaseClient.from('user_state').select('data').eq('user_id', CLOUD_USER.id).maybeSingle();
  if (!error && data && data.data) {
    applyCloudState(data.data);
  } else {
    // Žiadny cloud záznam ešte neexistuje pre tohto užívateľa – ulož aktuálny lokálny stav ako prvotný
    await pushStateToCloud();
  }
}

async function signUpEmail(email, password) {
  return supabaseClient.auth.signUp({ email, password });
}
async function signInEmail(email, password) {
  return supabaseClient.auth.signInWithPassword({ email, password });
}
async function signOutCloud() {
  await supabaseClient.auth.signOut();
  CLOUD_USER = null;
  currentRoute = 'auth';
  render();
}

function todayKey(){ return new Date().toISOString().split('T')[0]; }

// Vráti aktuálne aktívne dni (vlastný split alebo preset PPL)
function getActiveDays() {
  if (ACTIVE_SPLIT_ID) {
    const split = CUSTOM_SPLITS.find(s=>s.id===ACTIVE_SPLIT_ID);
    if (split) return split.days;
  }
  return []; // žiadny skrytý predvolený split - užívateľ si musí vytvoriť svoj vlastný
}



// ───────────────────────── PRESET TRAINING DATA (PPL z predošlej verzie) ──
const DAYS = [
  {id:'po',label:'Po',title:'PUSH',subtitle:'Hrudník · Ramená · Triceps',
   exercises:[
    {id:'bench',name:'Benchpress',sets:3,reps:'6–8',note:'Retrakcia lopatiek. Lakte 45° k telu. Stop pred uzamknutím.'},
    {id:'incpress',name:'Incline DB Press',sets:3,reps:'8–10',note:'Lavička 30°. Plný stretch a kontrakcia horného hrudníka.'},
    {id:'peckdeck',name:'Peckdeck',sets:3,reps:'10–12',note:'Tlak lakťov k sebe. 1s pauza v max. kontrakcii.'},
    {id:'lateral',name:'Upažovanie v stoji',sets:4,reps:'12–15',note:'Skapulárna rovina (30° pred telom). Posledná séria drop-set.'},
    {id:'french',name:'Francúzsky tlak (EZ)',sets:3,reps:'10–12',note:'Ruky mierne za hlavou. Konštantné napätie dlhej hlavy.'},
    {id:'tricpull',name:'Triceps kladka (lano)',sets:3,reps:'12–15',note:'Lakte pri tele. Roztiahnutie lana v spodnej pozícii.'},
  ]},
  {id:'ut',label:'Ut',title:'PULL',subtitle:'Chrbát · Zadné ramená · Biceps',
   exercises:[
    {id:'latpull',name:'Sťahovanie kladky (široko)',sets:3,reps:'8–10',note:'Vertikálny ťah na hrudník. Pomalá excentrická fáza.'},
    {id:'rowneut',name:'Príťahy s oporou (neutr.)',sets:3,reps:'6–8',note:'Dlane k sebe. Lakte tesne pri rebrách.'},
    {id:'streach',name:'Sťahovanie (vystreté ruky)',sets:3,reps:'12–15',note:'Pohyb len z ramenného kĺbu. Konštantné napätie v latissimoch.'},
    {id:'revpeck',name:'Reverse Peckdeck',sets:3,reps:'12–15',note:'Lopatky zafixované. Čistá izolácia zadného deltoidu.'},
    {id:'hammer',name:'Kladivové zdvihy',sets:3,reps:'10–12',note:'Neutrálny úchop. Buduje brachialis – vytláča biceps nahor.'},
    {id:'ezcurl',name:'Bicepsový zdvih (EZ)',sets:3,reps:'8–10',note:'Podhmat. Lakte zafixované mierne pred telom.'},
  ]},
  {id:'st',label:'St',title:'LEGS',subtitle:'Kvadricepsy · Hamstringy · Lýtka',
   exercises:[
    {id:'hacken',name:'Hacken drep',sets:3,reps:'8–10',note:'Zostup pod paralelu. Panva opretá o podložku celý čas.'},
    {id:'rdl',name:'RDL (Rumunský mŕtvy ťah)',sets:3,reps:'8–10',note:'Tlak panvy dozadu. Stop keď panva prestane ísť vzad.'},
    {id:'legpress',name:'Legpress',sets:3,reps:'10–12',note:'Strážiť spodný chrbát. Neprepínať kolená do zámku.'},
    {id:'legext',name:'Predkopávanie na stroji',sets:3,reps:'12–15',note:'1s stopka v maximálnej kontrakcii nahor.'},
    {id:'legcurl',name:'Zakopávanie na stroji',sets:3,reps:'12–15',note:'Pomalá excentrická fáza. Žiadne hádzanie váhou.'},
    {id:'calf',name:'Výpony na lýtka v stoji',sets:4,reps:'15',note:'Plný stretch dole – 1s pauza – výbušne na špičky.'},
  ]},
  {id:'stv',label:'Štv',title:'UPPER',subtitle:'Hrudník · Chrbát · Ramená',badge:true,
   exercises:[
    {id:'incpress2',name:'Incline DB Press',sets:3,reps:'8–10',note:'Lavička 30°. 2. stimul pre horný hrudník v týždni.'},
    {id:'latpull2',name:'Sťahovanie kladky (úzko)',sets:3,reps:'8–10',note:'Podhmat / V-adaptér. Spodné vlákna latissimov + bicepsy.'},
    {id:'rowover',name:'Príťahy s oporou (nadhmat)',sets:3,reps:'8–10',note:'Dlane dole. Lakte 45–60° od tela. Horný chrbát + trapézy.'},
    {id:'lateral2',name:'Upažovanie v stoji ⬆',sets:3,reps:'12–15',note:'Pridané: 2. stimul pre stredný deltoid v týždni.'},
    {id:'cabcross',name:'Protismerné kladky zo spodu',sets:3,reps:'12–15',note:'Ťah nahor k očiam. Izolácia kľúčovej časti prsného svalu.'},
  ]},
  {id:'pi',label:'Pi',title:'DOWN/ARMS',subtitle:'Nohy (udržanie) · Ruky',badge:true,
   exercises:[
    {id:'legpress2',name:'Legpress / Hackenpress',sets:3,reps:'10–12',note:'Udržiavací stimul. Napumpovanie pred rukami.'},
    {id:'legcurl2',name:'Zakopávanie na stroji ⬇',sets:3,reps:'12–15',note:'Zredukované na 1 izoláciu nôh (predkopávanie vypadlo).'},
    {id:'calfset',name:'Výpony – sediace ⬆',sets:3,reps:'15',note:'Pridané: 2. stimul pre soleus. Plný rozsah pohybu.'},
    {id:'scott',name:'Scottova lavica (EZ) ⬆',sets:3,reps:'10–12',note:'Presunutá SKÔR – lakte pred telom, vnútorná hrúbka.'},
    {id:'inccurl',name:'Incline Dumbbell Curls',sets:3,reps:'10–12',note:'Šikmá lavička 45°. Extrémny stretch dlhej hlavy – finisher.'},
    {id:'triext',name:'Tricepsové extenzie nad hlavou',sets:3,reps:'10–12',note:'Lano spoza hlavy. Stretch dlhej hlavy tricepsu.'},
    {id:'tripush',name:'Tricepsové stláčanie (V)',sets:3,reps:'12–15',note:'Tlak kolmo nadol. Záverečné prekrvenie.'},
  ]},
];

// ───────────────────────── EXERCISE LIBRARY (70+ cvikov) ────────────────
const MUSCLE_LABELS = {
  chest:'Hrudník', back:'Chrbát', shoulders:'Ramená', biceps:'Biceps', triceps:'Triceps',
  quads:'Kvadricepsy', hamstrings:'Hamstringy', glutes:'Sedacie svaly', calves:'Lýtka',
  core:'Brušné svaly', forearms:'Predlaktia',
};
const MUSCLE_GROUP_ORDER = ['chest','back','shoulders','biceps','triceps','quads','hamstrings','glutes','calves','core','forearms'];

const EXERCISE_LIBRARY = [
  // ── HRUDNÍK ──
  {id:'bench',name:'Benchpress (veľká činka)',muscle:'chest',equipment:'barbell',sets:3,reps:'6–8',note:'Retrakcia lopatiek. Lakte 45° k telu. Stop pred uzamknutím.'},
  {id:'inclinebar',name:'Bench press na šikmej lavici',muscle:'chest',equipment:'barbell',sets:3,reps:'6–8',note:'Lavička 30°. Cieli na horný hrudník.'},
  {id:'incpress',name:'Incline Dumbbell Press',muscle:'chest',equipment:'dumbbell',sets:3,reps:'8–10',note:'Lavička 30°. Plný stretch a kontrakcia horného hrudníka.'},
  {id:'flatdb',name:'Bench press s jednoručkami',muscle:'chest',equipment:'dumbbell',sets:3,reps:'8–10',note:'Väčší rozsah pohybu ako s veľkou činkou. Lakte 45°.'},
  {id:'peckdeck',name:'Peckdeck',muscle:'chest',equipment:'machine',sets:3,reps:'10–12',note:'Tlak lakťov k sebe. 1s pauza v maximálnej kontrakcii.'},
  {id:'cabcross',name:'Protismerné kladky zo spodu',muscle:'chest',equipment:'cable',sets:3,reps:'12–15',note:'Ťah nahor k očiam. Izolácia kľúčovej časti prsného svalu.'},
  {id:'cabcrossdown',name:'Protismerné kladky zhora',muscle:'chest',equipment:'cable',sets:3,reps:'12–15',note:'Ťah nadol a k sebe. Izolácia spodnej časti hrudníka.'},
  {id:'dips',name:'Kliky na bradlách (hrudník)',muscle:'chest',equipment:'bodyweight',sets:3,reps:'8–12',note:'Predklon trupu. Lakte mierne von pre väčší dôraz na hrudník.'},
  {id:'pushup',name:'Klasické kliky',muscle:'chest',equipment:'bodyweight',sets:3,reps:'12–20',note:'Telo v jednej línii. Lakte 45° od trupu.'},
  {id:'pecfly',name:'Rozpažovanie s jednoručkami',muscle:'chest',equipment:'dumbbell',sets:3,reps:'10–12',note:'Mierny ohyb v lakťoch. Kontrolovaný spustenie dole.'},

  // ── CHRBÁT ──
  {id:'latpull',name:'Sťahovanie kladky na široko',muscle:'back',equipment:'cable',sets:3,reps:'8–10',note:'Vertikálny ťah na hrudník. Pomalá excentrická fáza.'},
  {id:'latpull2',name:'Sťahovanie kladky na úzko',muscle:'back',equipment:'cable',sets:3,reps:'8–10',note:'Podhmat / V-adaptér. Spodné vlákna latissimov + bicepsy.'},
  {id:'streach',name:'Sťahovanie kladky s vystretými rukami',muscle:'back',equipment:'cable',sets:3,reps:'12–15',note:'Pohyb len z ramenného kĺbu. Konštantné napätie v latissimoch.'},
  {id:'rowneut',name:'Príťahy s oporou (neutrálny úchop)',muscle:'back',equipment:'machine',sets:3,reps:'6–8',note:'Dlane k sebe. Lakte tesne pri rebrách.'},
  {id:'rowover',name:'Príťahy s oporou (nadhmat)',muscle:'back',equipment:'machine',sets:3,reps:'8–10',note:'Dlane dole. Lakte 45–60° od tela. Horný chrbát + trapézy.'},
  {id:'barbellrow',name:'Zohnutý záves s veľkou činkou',muscle:'back',equipment:'barbell',sets:3,reps:'6–10',note:'Trup 45°. Ťah k spodnému brušku. Neguliť spodný chrbát.'},
  {id:'tbarrow',name:'T-bar row',muscle:'back',equipment:'machine',sets:3,reps:'8–10',note:'Hrudník opretý. Ťah lakťami popri trupe.'},
  {id:'onearmrow',name:'Zohnutý záves s jednoručkou',muscle:'back',equipment:'dumbbell',sets:3,reps:'8–12',note:'Opora o lavičku. Ťah lakťom popri trupe, nie do strany.'},
  {id:'pullup',name:'Zhyby na hrazde',muscle:'back',equipment:'bodyweight',sets:3,reps:'6–10',note:'Plný rozsah. Lopatky stiahnuté pred začiatkom ťahu.'},
  {id:'facepull',name:'Face pull',muscle:'back',equipment:'cable',sets:3,reps:'12–15',note:'Ťah k tvári, lakte vysoko. Zadné delty a vonkajšia rotácia.'},
  {id:'hyperext',name:'Hyperextenzie',muscle:'back',equipment:'bodyweight',sets:3,reps:'12–15',note:'Spodný chrbát + sedacie svaly. Bez prehnutia v hornej fáze.'},

  // ── RAMENÁ ──
  {id:'lateral',name:'Upažovanie v stoji (jednoručky)',muscle:'shoulders',equipment:'dumbbell',sets:4,reps:'12–15',note:'Skapulárna rovina (30° pred telom). Posledná séria drop-set.'},
  {id:'revpeck',name:'Reverse Peckdeck',muscle:'shoulders',equipment:'machine',sets:3,reps:'12–15',note:'Lopatky zafixované. Čistá izolácia zadného deltoidu.'},
  {id:'ohp',name:'Tlak nad hlavu (veľká činka)',muscle:'shoulders',equipment:'barbell',sets:3,reps:'6–8',note:'Stoj, jadro spevnené. Tlak vertikálne nad hlavu.'},
  {id:'dbshoulderpress',name:'Tlak na ramená s jednoručkami',muscle:'shoulders',equipment:'dumbbell',sets:3,reps:'8–10',note:'Sed s oporou. Lakte mierne pred telom v spodnej fáze.'},
  {id:'cablelateral',name:'Upažovanie na kladke',muscle:'shoulders',equipment:'cable',sets:3,reps:'12–15',note:'Konštantné napätie počas celého pohybu.'},
  {id:'frontraise',name:'Predpažovanie s jednoručkami',muscle:'shoulders',equipment:'dumbbell',sets:3,reps:'10–12',note:'Predný deltoid. Zdvih do výšky očí, kontrolovaný spustenie.'},
  {id:'arnoldpress',name:'Arnold press',muscle:'shoulders',equipment:'dumbbell',sets:3,reps:'8–10',note:'Rotácia dlaní počas tlaku. Zapája všetky časti deltoidu.'},
  {id:'shrugs',name:'Vzpery trapézov (shrugs)',muscle:'shoulders',equipment:'barbell',sets:3,reps:'10–12',note:'Zdvih ramien priamo nahor. Bez rotácie pliec.'},

  // ── BICEPS ──
  {id:'ezcurl',name:'Bicepsový zdvih (EZ činka)',muscle:'biceps',equipment:'barbell',sets:3,reps:'8–10',note:'Podhmat. Lakte zafixované mierne pred telom.'},
  {id:'hammer',name:'Kladivové zdvihy',muscle:'biceps',equipment:'dumbbell',sets:3,reps:'10–12',note:'Neutrálny úchop. Buduje brachialis – vytláča biceps nahor.'},
  {id:'inccurl',name:'Incline Dumbbell Curls',muscle:'biceps',equipment:'dumbbell',sets:3,reps:'10–12',note:'Šikmá lavička 45°. Extrémny stretch pre dlhú hlavu bicepsu.'},
  {id:'scott',name:'Scottova lavica (EZ činka)',muscle:'biceps',equipment:'barbell',sets:3,reps:'10–12',note:'Lakte pred telom. Vnútorná hrúbka bicepsu. Neuzamykať lakte dole.'},
  {id:'cablecurl',name:'Bicepsový zdvih na kladke',muscle:'biceps',equipment:'cable',sets:3,reps:'12–15',note:'Konštantné napätie počas celého rozsahu pohybu.'},
  {id:'concentrationcurl',name:'Koncentrovaný zdvih',muscle:'biceps',equipment:'dumbbell',sets:3,reps:'12–15',note:'Lakte opretý o stehno. Maximálna izolácia bicepsu.'},

  // ── TRICEPS ──
  {id:'french',name:'Francúzsky tlak (EZ činka)',muscle:'triceps',equipment:'barbell',sets:3,reps:'10–12',note:'Ležmo na lavici, ruky mierne za hlavou. Konštantné napätie dlhej hlavy.'},
  {id:'tricpull',name:'Triceps kladka (lano)',muscle:'triceps',equipment:'cable',sets:3,reps:'12–15',note:'Lakte pri tele. Roztiahnutie lana od seba v spodnej pozícii.'},
  {id:'triext',name:'Tricepsové extenzie nad hlavou',muscle:'triceps',equipment:'cable',sets:3,reps:'10–12',note:'Lano spoza hlavy. Stretch dlhej hlavy tricepsu.'},
  {id:'tripush',name:'Tricepsové stláčanie (V-adaptér)',muscle:'triceps',equipment:'cable',sets:3,reps:'12–15',note:'Tlak kolmo nadol. Lakte pevne pri tele.'},
  {id:'closegripbench',name:'Bench press úzkym úchopom',muscle:'triceps',equipment:'barbell',sets:3,reps:'8–10',note:'Úchop na šírku pliec. Lakte pri tele počas celého pohybu.'},
  {id:'dipstriceps',name:'Kliky na bradlách (triceps)',muscle:'triceps',equipment:'bodyweight',sets:3,reps:'8–12',note:'Vertikálny trup. Lakte tesne pri tele.'},
  {id:'kickback',name:'Tricepsový kickback',muscle:'triceps',equipment:'dumbbell',sets:3,reps:'12–15',note:'Predklon trupu. Extenzia v lakti, ramenná kosť rovnobežne so zemou.'},

  // ── KVADRICEPSY ──
  {id:'hacken',name:'Hacken drep',muscle:'quads',equipment:'machine',sets:3,reps:'8–10',note:'Zostup pod paralelu. Panva neustále opretá o podložku.'},
  {id:'legpress',name:'Legpress',muscle:'quads',equipment:'machine',sets:3,reps:'10–12',note:'Strážiť spodný chrbát (bez podsadenia). Neprepínať kolená do zámku.'},
  {id:'legext',name:'Predkopávanie na stroji',muscle:'quads',equipment:'machine',sets:3,reps:'12–15',note:'1-sekundová stopka v maximálnej kontrakcii nahor.'},
  {id:'backsquat',name:'Drep s veľkou činkou',muscle:'quads',equipment:'barbell',sets:3,reps:'6–8',note:'Činka na zadných deltoidoch. Zostup do paralely, chodidlá na šírku bokov.'},
  {id:'frontsquat',name:'Predný drep',muscle:'quads',equipment:'barbell',sets:3,reps:'6–8',note:'Činka na prednej časti pliec. Vertikálny trup, väčší dôraz na kvadricepsy.'},
  {id:'lungesdb',name:'Výpady s jednoručkami',muscle:'quads',equipment:'dumbbell',sets:3,reps:'10–12',note:'Dlhý krok vpred. Koleno zadnej nohy smerom k zemi.'},
  {id:'splitsquat',name:'Bulharský drep',muscle:'quads',equipment:'dumbbell',sets:3,reps:'10–12',note:'Zadná noha opretá o lavičku. Unilaterálny dôraz na kvadricepsy.'},

  // ── HAMSTRINGY ──
  {id:'rdl',name:'Rumunský mŕtvy ťah (RDL)',muscle:'hamstrings',equipment:'barbell',sets:3,reps:'8–10',note:'Tlak panvy dozadu. Ohyb len do bodu, kedy panva prestane ísť vzad.'},
  {id:'legcurl',name:'Zakopávanie na stroji (ľah)',muscle:'hamstrings',equipment:'machine',sets:3,reps:'12–15',note:'Pomalá excentrická fáza, žiadne hádzanie váhou.'},
  {id:'legcurlseated',name:'Zakopávanie na stroji (sed)',muscle:'hamstrings',equipment:'machine',sets:3,reps:'12–15',note:'Plný rozsah pohybu. Kontrola v hornej kontrakcii.'},
  {id:'gooddmorning',name:'Good morning',muscle:'hamstrings',equipment:'barbell',sets:3,reps:'8–10',note:'Mierny ohyb v kolenách. Predklon z bokov, nie z drieku.'},
  {id:'stiffleg',name:'Mŕtvy ťah na strnulých nohách',muscle:'hamstrings',equipment:'barbell',sets:3,reps:'8–10',note:'Minimálny ohyb kolien. Maximálny stretch hamstringov.'},
  {id:'rdldb',name:'RDL s jednoručkami / trap bar',muscle:'hamstrings',equipment:'dumbbell',sets:3,reps:'8–10',note:'Bezpečnejšia alternatíva veľkej činky pre spodný chrbát. Jednoručky pri tele, tlak panvy dozadu.'},

  // ── SEDACIE SVALY ──
  {id:'hipthrust',name:'Hip thrust',muscle:'glutes',equipment:'barbell',sets:3,reps:'8–12',note:'Lopatky opreté o lavičku. Plná extenzia bokov nahor.'},
  {id:'gluteb',name:'Zanoženie na kladke',muscle:'glutes',equipment:'cable',sets:3,reps:'12–15',note:'Mierny predklon trupu. Izolovaný pohyb v bedrovom kĺbe.'},
  {id:'sumosquat',name:'Sumo drep',muscle:'glutes',equipment:'barbell',sets:3,reps:'8–10',note:'Široký postoj, špičky vytočené. Väčší dôraz na sedacie svaly a adduktory.'},

  // ── LÝTKA ──
  {id:'calf',name:'Výpony na lýtka v stoji',muscle:'calves',equipment:'machine',sets:4,reps:'15',note:'Plný stretch dole – 1s pauza – výbušne na špičky.'},
  {id:'calfseated',name:'Výpony na lýtka (sediace)',muscle:'calves',equipment:'machine',sets:3,reps:'15',note:'Cieli viac na soleus. Plný rozsah pohybu.'},
  {id:'calfpress',name:'Výpony na lýtka na legpress',muscle:'calves',equipment:'machine',sets:3,reps:'15–20',note:'Špičky na spodnom okraji platformy. Plný rozsah.'},

  // ── BRUŠNÉ SVALY ──
  {id:'crunch',name:'Brušné zhyby (crunch)',muscle:'core',equipment:'bodyweight',sets:3,reps:'15–20',note:'Krátky pohyb, kontrakcia hornej časti brucha.'},
  {id:'hangingleg',name:'Zdvih nôh vo zhybe',muscle:'core',equipment:'bodyweight',sets:3,reps:'12–15',note:'Visieť na hrazde. Zdvih nôh kontrolovane, bez švihu.'},
  {id:'cablecrunch',name:'Brušné zhyby na kladke',muscle:'core',equipment:'cable',sets:3,reps:'15–20',note:'Kľak pred kladkou. Flexia drieku, lakte k stehnám.'},
  {id:'plank',name:'Plank (výdrž v podpore)',muscle:'core',equipment:'bodyweight',sets:3,reps:'30–60s',note:'Telo v jednej línii. Jadro spevnené, žiadne prehnutie bokov.'},
  {id:'russiantwist',name:'Russian twist',muscle:'core',equipment:'bodyweight',sets:3,reps:'15–20',note:'Rotácia trupu zo strany na stranu. Jadro neustále napäté.'},

  // ── PREDLAKTIA ──
  {id:'wristcurl',name:'Zdvih zápästia (predlaktia)',muscle:'forearms',equipment:'barbell',sets:3,reps:'15–20',note:'Predlaktia opreté o lavičku. Pohyb len v zápästí.'},
  {id:'reversecurl',name:'Reverse Curl (nadhmat)',muscle:'forearms',equipment:'barbell',sets:3,reps:'12–15',note:'Nadhmat (dlane dole). Cieli brachioradialis – vrchnú časť predlaktia.'},
  {id:'farmercarry',name:'Farmer’s walk',muscle:'forearms',equipment:'dumbbell',sets:3,reps:'20–30m',note:'Vzpriamený postoj, pevný úchop. Statická záťaž na predlaktia.'},
];

function getExerciseById(id) {
  return EXERCISE_LIBRARY.find(e=>e.id===id) || DAYS.flatMap(d=>d.exercises).find(e=>e.id===id);
}

// ───────────────────────── PORADIE CVIKOV (zložené → izolačné) ──────────
// Nižšie číslo = ťažší/zloženejší cvik = patrí skôr v tréningu.
// Odvodené z vybavenia + známych zložených pohybov.
const COMPOUND_IDS = new Set([
  'bench','inclinebar','flatdb','incpress','dips','pushup',          // hrudník zložené
  'pullup','barbellrow','rowneut','rowover','tbarrow','onearmrow','latpull','latpull2', // chrbát zložené
  'ohp','dbshoulderpress','arnoldpress',                            // ramená tlaky
  'backsquat','frontsquat','hacken','legpress','lungesdb','splitsquat', // nohy zložené
  'rdl','stiffleg','gooddmorning','hipthrust','sumosquat',          // hinge/glutes zložené
  'closegripbench','dipstriceps',                                   // triceps zložené
]);
function exerciseOrderRank(ex){
  // 1 = ťažký zložený (veľká činka/bodyweight + compound)
  // 2 = stredný (jednoručky compound, stroje compound)
  // 3 = izolácia (kladky, peckdeck, upažovanie, curls...)
  // 4 = lýtka, brucho, predlaktia (vždy na koniec)
  if (['calves','core','forearms'].includes(ex.muscle)) return 4;
  const isCompound = COMPOUND_IDS.has(ex.id);
  if (isCompound) {
    if (ex.equipment==='barbell' || ex.equipment==='bodyweight') return 1;
    return 2; // dumbbell/machine compound
  }
  return 3; // izolácia (cable, peckdeck, machine isolation, dumbbell isolation)
}
// Zoradí pole cvikov podľa odporúčaného poradia (stabilne – zachová relatívne poradie v rámci ranku)
function sortExercisesByOrder(exercises){
  return exercises
    .map((ex,i)=>({ex,i,rank:exerciseOrderRank(ex)}))
    .sort((a,b)=> a.rank!==b.rank ? a.rank-b.rank : a.i-b.i)
    .map(o=>o.ex);
}
// Zistí, či je poradie cvikov nelogické (izolácia/malá partia pred zloženým cvikom)
function hasIllogicalOrder(exercises){
  let maxRankSoFar = 0;
  for (const ex of exercises){
    const r = exerciseOrderRank(ex);
    if (r < maxRankSoFar) return true; // ťažší cvik prišiel po ľahšom
    maxRankSoFar = Math.max(maxRankSoFar, r);
  }
  return false;
}

// ───────────────────────── SPLIT TEMPLATES (návrh podľa počtu dní) ──────
// Pre každý počet dní (1-7) appka navrhne typ splitu a predvyplní cviky
// z knižnice na základe svalovej skupiny. Užívateľ potom môže upraviť.

function exByMuscle(muscle, excludeIds=[]) {
  return EXERCISE_LIBRARY.filter(e=>e.muscle===muscle && !excludeIds.includes(e.id));
}

// Pre ženy zvýši opakovania (dôraz na vyšší rozsah 12-15) a default váhy budú nižšie
function adjustRepsForGender(reps, gender){
  if (gender!=='female') return reps;
  // Posun silových rozsahov (6-8, 8-10) smerom k 10-15 pre ženy
  const map = {
    '6–8':'10–12', '8–10':'12–15', '10–12':'12–15',
  };
  return map[reps] || reps;
}

function pickExercises(muscles, countPerMuscle=2, gender=null) {
  const picked = [];
  muscles.forEach(m=>{
    const opts = exByMuscle(m);
    opts.slice(0, countPerMuscle).forEach(ex=>picked.push({
      ...ex,
      reps: adjustRepsForGender(ex.reps, gender),
    }));
  });
  return picked;
}

// Ženské varianty splitov – väčší dôraz na glutes, nohy, core
const SPLIT_TEMPLATES_FEMALE = {
  1: { name:'Fullbody (1×/týždeň)', days:[
    { label:'D1', title:'FULLBODY', subtitle:'Celé telo · dôraz nohy/sedacie', muscles:['glutes','quads','back','hamstrings','core'] },
  ]},
  2: { name:'Upper / Lower', days:[
    { label:'D1', title:'UPPER', subtitle:'Vrch tela', muscles:['back','chest','shoulders','triceps'] },
    { label:'D2', title:'LOWER', subtitle:'Sedacie · Nohy · Core', muscles:['glutes','quads','hamstrings','calves','core'] },
  ]},
  3: { name:'Glutes / Upper / Lower', days:[
    { label:'D1', title:'GLUTES', subtitle:'Sedacie svaly · Hamstringy', muscles:['glutes','hamstrings','calves'] },
    { label:'D2', title:'UPPER', subtitle:'Chrbát · Ramená · Ruky', muscles:['back','shoulders','biceps','triceps'] },
    { label:'D3', title:'LOWER', subtitle:'Kvadricepsy · Sedacie · Core', muscles:['quads','glutes','core'] },
  ]},
  4: { name:'Glutes+Lower / Upper ×2', days:[
    { label:'D1', title:'GLUTES A', subtitle:'Sedacie · Hamstringy', muscles:['glutes','hamstrings','calves'] },
    { label:'D2', title:'UPPER A', subtitle:'Chrbát · Ramená', muscles:['back','shoulders','core'] },
    { label:'D3', title:'LOWER B', subtitle:'Kvadricepsy · Sedacie', muscles:['quads','glutes'] },
    { label:'D4', title:'UPPER B', subtitle:'Hrudník · Ruky', muscles:['chest','biceps','triceps'] },
  ]},
  5: { name:'Glutes / Upper / Lower / Glutes / Core', days:[
    { label:'D1', title:'GLUTES', subtitle:'Sedacie · Hamstringy', muscles:['glutes','hamstrings'] },
    { label:'D2', title:'UPPER', subtitle:'Chrbát · Ramená · Ruky', muscles:['back','shoulders','triceps'] },
    { label:'D3', title:'LOWER', subtitle:'Kvadricepsy · Lýtka', muscles:['quads','calves'] },
    { label:'D4', title:'GLUTES B', subtitle:'Sedacie · dôraz objem', muscles:['glutes','hamstrings'] },
    { label:'D5', title:'UPPER+CORE', subtitle:'Hrudník · Core', muscles:['chest','biceps','core'] },
  ]},
  6: { name:'Glutes / Upper / Lower ×2', days:[
    { label:'D1', title:'GLUTES A', subtitle:'Sedacie · Hamstringy', muscles:['glutes','hamstrings'] },
    { label:'D2', title:'UPPER A', subtitle:'Chrbát · Ramená', muscles:['back','shoulders'] },
    { label:'D3', title:'LOWER A', subtitle:'Kvadricepsy · Core', muscles:['quads','core'] },
    { label:'D4', title:'GLUTES B', subtitle:'Sedacie · objem', muscles:['glutes','hamstrings'] },
    { label:'D5', title:'UPPER B', subtitle:'Hrudník · Ruky', muscles:['chest','biceps','triceps'] },
    { label:'D6', title:'LOWER B', subtitle:'Nohy · Lýtka', muscles:['quads','calves'] },
  ]},
  7: { name:'Glutes / Upper / Lower ×2 + Core', days:[
    { label:'D1', title:'GLUTES A', subtitle:'Sedacie · Hamstringy', muscles:['glutes','hamstrings'] },
    { label:'D2', title:'UPPER A', subtitle:'Chrbát · Ramená', muscles:['back','shoulders'] },
    { label:'D3', title:'LOWER A', subtitle:'Kvadricepsy', muscles:['quads','calves'] },
    { label:'D4', title:'GLUTES B', subtitle:'Sedacie · objem', muscles:['glutes','hamstrings'] },
    { label:'D5', title:'UPPER B', subtitle:'Hrudník · Ruky', muscles:['chest','biceps','triceps'] },
    { label:'D6', title:'LOWER B', subtitle:'Nohy · Lýtka', muscles:['quads','calves'] },
    { label:'D7', title:'CORE', subtitle:'Brušné svaly · stabilizácia', muscles:['core'] },
  ]},
};

const SPLIT_TEMPLATES = {
  1: { name:'Fullbody (1×/týždeň)', days:[
    { label:'D1', title:'FULLBODY', subtitle:'Celé telo', muscles:['chest','back','quads','shoulders','hamstrings'] },
  ]},
  2: { name:'Upper / Lower', days:[
    { label:'D1', title:'UPPER', subtitle:'Hrudník · Chrbát · Ramená · Ruky', muscles:['chest','back','shoulders','biceps','triceps'] },
    { label:'D2', title:'LOWER', subtitle:'Nohy · Sedacie svaly', muscles:['quads','hamstrings','glutes','calves'] },
  ]},
  3: { name:'Push / Pull / Legs', days:[
    { label:'D1', title:'PUSH', subtitle:'Hrudník · Ramená · Triceps', muscles:['chest','shoulders','triceps'] },
    { label:'D2', title:'PULL', subtitle:'Chrbát · Biceps', muscles:['back','biceps'] },
    { label:'D3', title:'LEGS', subtitle:'Nohy · Sedacie svaly', muscles:['quads','hamstrings','glutes','calves'] },
  ]},
  4: { name:'Upper / Lower ×2', days:[
    { label:'D1', title:'UPPER A', subtitle:'Hrudník · Chrbát · Ramená', muscles:['chest','back','shoulders'] },
    { label:'D2', title:'LOWER A', subtitle:'Kvadricepsy · Hamstringy', muscles:['quads','hamstrings','calves'] },
    { label:'D3', title:'UPPER B', subtitle:'Ramená · Biceps · Triceps', muscles:['shoulders','biceps','triceps'] },
    { label:'D4', title:'LOWER B', subtitle:'Sedacie svaly · Nohy', muscles:['glutes','quads','hamstrings'] },
  ]},
  5: { name:'PPL + Upper + Down', days:[
    { label:'D1', title:'PUSH', subtitle:'Hrudník · Ramená · Triceps', muscles:['chest','shoulders','triceps'] },
    { label:'D2', title:'PULL', subtitle:'Chrbát · Biceps', muscles:['back','biceps'] },
    { label:'D3', title:'LEGS', subtitle:'Kvadricepsy · Hamstringy · Lýtka', muscles:['quads','hamstrings','calves'] },
    { label:'D4', title:'UPPER', subtitle:'Hrudník · Chrbát · Ramená', muscles:['chest','back','shoulders'] },
    { label:'D5', title:'DOWN/ARMS', subtitle:'Nohy · Ruky', muscles:['quads','biceps','triceps'] },
  ]},
  6: { name:'PPL ×2', days:[
    { label:'D1', title:'PUSH A', subtitle:'Hrudník · Ramená · Triceps', muscles:['chest','shoulders','triceps'] },
    { label:'D2', title:'PULL A', subtitle:'Chrbát · Biceps', muscles:['back','biceps'] },
    { label:'D3', title:'LEGS A', subtitle:'Kvadricepsy · Hamstringy', muscles:['quads','hamstrings','calves'] },
    { label:'D4', title:'PUSH B', subtitle:'Hrudník · Ramená · Triceps', muscles:['chest','shoulders','triceps'] },
    { label:'D5', title:'PULL B', subtitle:'Chrbát · Biceps', muscles:['back','biceps'] },
    { label:'D6', title:'LEGS B', subtitle:'Sedacie svaly · Lýtka', muscles:['glutes','quads','calves'] },
  ]},
  7: { name:'PPL ×2 + Fullbody', days:[
    { label:'D1', title:'PUSH A', subtitle:'Hrudník · Ramená · Triceps', muscles:['chest','shoulders','triceps'] },
    { label:'D2', title:'PULL A', subtitle:'Chrbát · Biceps', muscles:['back','biceps'] },
    { label:'D3', title:'LEGS A', subtitle:'Kvadricepsy · Hamstringy', muscles:['quads','hamstrings'] },
    { label:'D4', title:'PUSH B', subtitle:'Hrudník · Ramená · Triceps', muscles:['chest','shoulders','triceps'] },
    { label:'D5', title:'PULL B', subtitle:'Chrbát · Biceps', muscles:['back','biceps'] },
    { label:'D6', title:'LEGS B', subtitle:'Sedacie svaly · Lýtka', muscles:['glutes','calves'] },
    { label:'D7', title:'FULLBODY', subtitle:'Udržiavací deň', muscles:['core','forearms'] },
  ]},
};

function generateSplitFromTemplate(daysPerWeek, gender) {
  const g = gender || PROFILE.gender;
  const templateSet = (g==='female') ? SPLIT_TEMPLATES_FEMALE : SPLIT_TEMPLATES;
  const tpl = templateSet[daysPerWeek] || templateSet[3];
  const days = tpl.days.map((d,i)=>({
    id: 'd'+(i+1)+'_'+Date.now()+'_'+i,
    label: d.label,
    title: d.title,
    subtitle: d.subtitle,
    weekday: null, // priradenie dňa týždňa (bod 4) – null = nepriradené
    exercises: sortExercisesByOrder(pickExercises(d.muscles, 2, g)).map(ex=>({ id:ex.id, name:ex.name, sets:ex.sets, reps:ex.reps, note:ex.note, muscle:ex.muscle })),
  }));
  return { id:'split_'+Date.now(), name: tpl.name, daysPerWeek, gender:g, days };
}

// Pomocná funkcia: získa template podľa pohlavia (pre náhľad v split_new)
function getTemplate(daysPerWeek, gender){
  const g = gender || PROFILE.gender;
  const templateSet = (g==='female') ? SPLIT_TEMPLATES_FEMALE : SPLIT_TEMPLATES;
  return templateSet[daysPerWeek] || templateSet[3];
}

// ───────────────────────── SEED: V-TAPER (ADONIS) SPLIT ─────────────────
// Jednorazové, idempotentné vloženie 5-dňového splitu zameraného na V-taper.
// Kontrola podľa stabilného ID – pri opätovnom volaní (každý reload appky) sa nič neduplikuje.
const VTAPER_SPLIT_ID = 'split_vtaper_adonis_v1';

function seedVTaperSplit() {
  if (CUSTOM_SPLITS.some(s=>s.id===VTAPER_SPLIT_ID)) return;

  CUSTOM_SPLITS.push({
    id: VTAPER_SPLIT_ID,
    name: 'V-Taper (Adonis ratio)',
    daysPerWeek: 5,
    gender: PROFILE.gender,
    days: [
      { id:'vt_d1', label:'D1', title:'PUSH', subtitle:'Ramená (šírka) · Hrudník · Triceps', weekday:1, exercises:[
        {id:'ohp', name:'Tlak nad hlavu (veľká činka)', sets:4, reps:'6–8', rest:150, muscle:'shoulders', note:'Primárny driver šírky ramien. Stoj, jadro spevnené, tlak vertikálne nad hlavu.'},
        {id:'incpress', name:'Incline Dumbbell Press', sets:3, reps:'8–10', rest:90, muscle:'chest', note:'Lavička 30°. Sekundárny cvik – priorita týždňa sú delty, nie hrudník.'},
        {id:'lateral', name:'Upažovanie v stoji (jednoručky)', sets:4, reps:'12–15', rest:60, muscle:'shoulders', note:'Skapulárna rovina (30° pred telom). Kľúčový cvik pre šírku – necítiť v trapézoch.'},
        {id:'cablelateral', name:'Upažovanie na kladke', sets:3, reps:'15–20', rest:45, muscle:'shoulders', note:'Konštantné napätie počas celého pohybu. Finisher na stredný deltoid.'},
        {id:'french', name:'Francúzsky tlak (EZ činka)', sets:3, reps:'10–12', rest:75, muscle:'triceps', note:'Ruky mierne za hlavou. Konštantné napätie dlhej hlavy.'},
        {id:'tricpull', name:'Triceps kladka (lano)', sets:3, reps:'12–15', rest:60, muscle:'triceps', note:'Lakte pri tele. Roztiahnutie lana v spodnej pozícii.'},
      ]},
      { id:'vt_d2', label:'D2', title:'PULL', subtitle:'Chrbát (šírka) · Zadné delty · Biceps', weekday:2, exercises:[
        {id:'latpull', name:'Sťahovanie kladky na široko', sets:4, reps:'8–10', rest:90, muscle:'back', note:'Vertikálny ťah na hrudník. Hlavný driver šírky chrbáta (laty).'},
        {id:'barbellrow', name:'Zohnutý záves s veľkou činkou', sets:3, reps:'6–10', rest:120, muscle:'back', note:'Trup 45°. Ťah k spodnému brušku. Neguliť spodný chrbát.'},
        {id:'streach', name:'Sťahovanie kladky s vystretými rukami', sets:3, reps:'12–15', rest:60, muscle:'back', note:'Pohyb len z ramenného kĺbu. Konštantné napätie v latissimoch – ďalší driver šírky.'},
        {id:'facepull', name:'Face pull', sets:3, reps:'15–20', rest:45, muscle:'back', note:'Ťah k tvári, lakte vysoko. Zadná delta + vonkajšia rotácia – 3D tvar ramena.'},
        {id:'hammer', name:'Kladivové zdvihy', sets:3, reps:'10–12', rest:60, muscle:'biceps', note:'Neutrálny úchop. Brachialis – vytláča biceps nahor.'},
        {id:'ezcurl', name:'Bicepsový zdvih (EZ činka)', sets:3, reps:'8–10', rest:75, muscle:'biceps', note:'Podhmat. Lakte zafixované mierne pred telom.'},
      ]},
      { id:'vt_d3', label:'D3', title:'LEGS', subtitle:'Kvadricepsy · Hamstringy · Lýtka', weekday:3, exercises:[
        {id:'hacken', name:'Hacken drep', sets:3, reps:'8–10', rest:120, muscle:'quads', note:'Zostup pod paralelu. Panva opretá o podložku celý čas.'},
        {id:'rdldb', name:'RDL s jednoručkami / trap bar', sets:3, reps:'8–10', rest:120, muscle:'hamstrings', note:'Bezpečná alternatíva veľkej činky pre spodný chrbát. Tlak panvy dozadu.'},
        {id:'legpress', name:'Legpress', sets:3, reps:'10–12', rest:90, muscle:'quads', note:'Strážiť spodný chrbát. Neprepínať kolená do zámku.'},
        {id:'legext', name:'Predkopávanie na stroji', sets:3, reps:'12–15', rest:60, muscle:'quads', note:'1s stopka v maximálnej kontrakcii nahor.'},
        {id:'legcurl', name:'Zakopávanie na stroji (ľah)', sets:3, reps:'12–15', rest:60, muscle:'hamstrings', note:'Aktivácia hamstringov. Pomalá excentrická fáza, žiadne hádzanie váhou.'},
        {id:'calf', name:'Výpony na lýtka v stoji', sets:4, reps:'15', rest:45, muscle:'calves', note:'Plný stretch dole – 1s pauza – výbušne na špičky.'},
      ]},
      { id:'vt_d4', label:'D4', title:'UPPER', subtitle:'2. stimul – Ramená · Chrbát · Hrudník + Core', weekday:4, exercises:[
        {id:'incpress', name:'Incline Dumbbell Press', sets:3, reps:'8–10', rest:90, muscle:'chest', note:'2. týždenný stimul pre horný hrudník.'},
        {id:'latpull2', name:'Sťahovanie kladky na úzko', sets:3, reps:'8–10', rest:90, muscle:'back', note:'Podhmat / V-adaptér. Spodné vlákna latissimov.'},
        {id:'rowover', name:'Príťahy s oporou (nadhmat)', sets:3, reps:'8–10', rest:90, muscle:'back', note:'Dlane dole. Vedome bez dôrazu na trapézy – žiadne ťažké shrugovanie v pláne.'},
        {id:'lateral', name:'Upažovanie v stoji (jednoručky)', sets:3, reps:'12–15', rest:60, muscle:'shoulders', note:'2. týždenný stimul pre stredný deltoid – kritické pre šírku ramien.'},
        {id:'cabcross', name:'Protismerné kladky zo spodu', sets:3, reps:'12–15', rest:60, muscle:'chest', note:'Ťah nahor k očiam. Izolácia hrudníka.'},
        {id:'cablecrunch', name:'Brušné zhyby na kladke', sets:3, reps:'15–20', rest:45, muscle:'core', note:'Core 1/2 – výlučne rectus abdominis. Kľak pred kladkou, flexia drieku.'},
      ]},
      { id:'vt_d5', label:'D5', title:'ARMS', subtitle:'Triceps · Biceps · Predlaktia + Core', weekday:5, exercises:[
        {id:'triext', name:'Tricepsové extenzie nad hlavou', sets:3, reps:'10–12', rest:75, muscle:'triceps', note:'Lano spoza hlavy. Stretch dlhej hlavy tricepsu – iný uhol než Deň 1.'},
        {id:'tripush', name:'Tricepsové stláčanie (V-adaptér)', sets:3, reps:'12–15', rest:60, muscle:'triceps', note:'Tlak kolmo nadol. Lakte pevne pri tele.'},
        {id:'inccurl', name:'Incline Dumbbell Curls', sets:3, reps:'10–12', rest:0, muscle:'biceps', note:'SUPERSET A1 – bez pauzy, hneď pokračuj Reverse Curl. Šikmá lavička 45°, extrémny stretch dlhej hlavy = peak bicepsu.'},
        {id:'reversecurl', name:'Reverse Curl (nadhmat)', sets:3, reps:'12–15', rest:60, muscle:'forearms', note:'SUPERSET A2 – nadhmat, cieli brachioradialis. Pauza až po dokončení oboch cvikov páru.'},
        {id:'concentrationcurl', name:'Koncentrovaný zdvih', sets:3, reps:'12–15', rest:60, muscle:'biceps', note:'Lakte opretý o stehno. Druhý driver peaku bicepsu.'},
        {id:'hangingleg', name:'Zdvih nôh vo zhybe', sets:3, reps:'12–15', rest:45, muscle:'core', note:'Core 2/2 – výlučne rectus abdominis, žiadne rotácie/bočné ohyby.'},
      ]},
    ],
  });
  saveSplits();
}



// ═══════════════════════════ UI HELPERS ═══════════════════════════════
function h(tag, attrs={}, children=[]) {
  const el = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  }
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if (c==null) return;
    const isNode = c instanceof Node;
    el.appendChild(isNode ? c : document.createTextNode(String(c)));
  });
  return el;
}

// Promo kódy – mapujú kód na zmeny profilu, ktoré sa po uplatnení uložia
const PROMO_CODES = {
  'FORGEX-NOADS': { premium: true },
};

// Manuálny AdSense banner – vkladá <ins class="adsbygoogle"> a hneď nechá Google naplniť reklamu
function adBanner() {
  const wrap = h('div',{style:'margin:16px 0;min-height:50px;overflow:hidden'});
  const ins = h('ins',{
    class:'adsbygoogle', style:'display:block',
    'data-ad-client':'ca-pub-9909275615095854',
    'data-ad-format':'auto',
    'data-full-width-responsive':'true',
  });
  wrap.appendChild(ins);
  setTimeout(()=>{ try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){} }, 0);
  return wrap;
}

function vibrate(ms=10){ if(navigator.vibrate) navigator.vibrate(ms); }
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// ═══════════════════════════ ROUTER ═══════════════════════════════════
let currentRoute = 'auth'; // prepísané po overení Supabase session v initApp()
let activeTab = 'home';
let activeDayId = DAYS[0].id;
let expandedEx = {};
let lastAutoExpandedDay = null; // sleduje pre ktorý deň už prebehlo auto-rozbalenie

function navigate(route) {
  // Pri zmene obrazovky chceme scroll hore – vynuluj predošlý scroller pred renderom
  const prevScroller = document.getElementById('root')?.querySelector('.scroll');
  if (prevScroller) prevScroller.scrollTop = 0;
  currentRoute = route;
  render();
  const newScroller = document.getElementById('root')?.querySelector('.scroll');
  if (newScroller) newScroller.scrollTop = 0;
}

function render() {
  const root = document.getElementById('root');
  // Zapamätaj si scroll pozíciu aktuálnej skrolovacej plochy (aby obraz neskákal hore)
  const prevScroller = root.querySelector('.scroll');
  const prevScrollTop = prevScroller ? prevScroller.scrollTop : 0;

  root.innerHTML = '';
  applyTheme(PROFILE.theme || 'auto');

  if (!CLOUD_USER) {
    currentRoute = 'auth';
  } else if (!PROFILE.onboardingComplete && currentRoute !== 'welcome' && !currentRoute.startsWith('ob_')) {
    currentRoute = 'welcome';
  }

  const routes = {
    auth: renderAuthScreen,
    welcome: renderWelcome,
    ob_gender: renderObGender,
    ob_basics: renderObBasics,
    ob_bodyfat: renderObBodyFat,
    ob_measurements: renderObMeasurements,
    ob_goal: renderObGoal,
    ob_activity: renderObActivity,
    ob_results: renderObResults,
    home: renderMainApp,
    split_manage: renderSplitManage,
    split_new: renderSplitNew,
    split_preview: renderSplitPreview,
    split_edit_day: renderSplitEditDay,
    workout_mode: renderWorkoutMode,
    home_customize: renderHomeCustomize,
    loading_plan: renderLoadingPlan,
  };
  const fn = routes[currentRoute] || renderMainApp;
  root.appendChild(fn());

  // Obnov scroll pozíciu (ak existuje skrolovacia plocha a mali sme kam scrollnuté)
  if (prevScrollTop > 0) {
    const newScroller = root.querySelector('.scroll');
    if (newScroller) newScroller.scrollTop = prevScrollTop;
  }

  // Ak beží časovač prestávky, znovu ho zobraz (re-render zmazal #root, nie body)
  if (restTimerInterval && restTimerRemaining>0 && !document.getElementById('rest-timer')) {
    renderRestTimer();
  }
}


// ═══════════════════════════ AUTH SCREEN ═══════════════════════════════
let authMode = 'login'; // 'login' | 'signup'
let authEmail = '';
let authPassword = '';
let authError = '';
let authLoading = false;
let authInfo = '';

function renderAuthScreen() {
  const screen = h('div', {class:'screen'});
  const safe = h('div', {class:'scroll safe-top safe-bot'});

  const center = h('div', {style:'display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:24px'});
  center.appendChild(h('div', {style:'width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,var(--pri),var(--acc));display:flex;align-items:center;justify-content:center;margin-bottom:16px'},
    h('span', {style:'font-size:36px;font-weight:900;color:#fff'}, 'X')));
  center.appendChild(h('h1', {}, 'ForgeX'));
  center.appendChild(h('p', {class:'subtitle'}, authMode==='login' ? 'Prihlás sa do svojho účtu' : 'Vytvor si nový účet'));
  safe.appendChild(center);

  const emailWrap = h('div', {style:'margin-bottom:14px'});
  emailWrap.appendChild(h('label', {class:'input-label'}, 'Email'));
  const emailRow = h('div', {class:'input-wrap'});
  emailRow.appendChild(h('input', {type:'email', inputmode:'email', placeholder:'tvoj@email.sk', value:authEmail, autocomplete:'email',
    onInput:(e)=>{ authEmail = e.target.value; }}));
  emailWrap.appendChild(emailRow);
  safe.appendChild(emailWrap);

  const passWrap = h('div', {style:'margin-bottom:8px'});
  passWrap.appendChild(h('label', {class:'input-label'}, 'Heslo'));
  const passRow = h('div', {class:'input-wrap'});
  passRow.appendChild(h('input', {type:'password', placeholder:'••••••••', value:authPassword, autocomplete: authMode==='login'?'current-password':'new-password',
    onInput:(e)=>{ authPassword = e.target.value; }}));
  passWrap.appendChild(passRow);
  safe.appendChild(passWrap);

  if (authError) safe.appendChild(h('p', {style:'color:var(--red);font-size:13px;margin-bottom:10px'}, authError));
  if (authInfo) safe.appendChild(h('p', {style:'color:var(--pri);font-size:13px;margin-bottom:10px'}, authInfo));

  const submit = async () => {
    authError = ''; authInfo = '';
    const email = authEmail.trim();
    if (!email || !authPassword) { authError = 'Vyplň email aj heslo.'; render(); return; }
    if (authPassword.length < 6) { authError = 'Heslo musí mať aspoň 6 znakov.'; render(); return; }
    authLoading = true; render();
    try {
      if (authMode === 'signup') {
        const { data, error } = await signUpEmail(email, authPassword);
        if (error) { authError = error.message; }
        else if (!data.session) { authInfo = 'Registrácia prebehla. Skontroluj email a potvrď účet, potom sa prihlás.'; authMode = 'login'; }
        else { CLOUD_USER = data.user; await pullStateFromCloud(); currentRoute = PROFILE.onboardingComplete ? 'home' : 'welcome'; }
      } else {
        const { data, error } = await signInEmail(email, authPassword);
        if (error) { authError = error.message; }
        else { CLOUD_USER = data.user; await pullStateFromCloud(); currentRoute = PROFILE.onboardingComplete ? 'home' : 'welcome'; }
      }
    } catch(e) {
      authError = 'Nepodarilo sa pripojiť. Skontroluj internetové pripojenie.';
    }
    authLoading = false;
    render();
  };

  safe.appendChild(h('button', {class:'btn btn-primary', style:'margin-top:8px', onClick:submit},
    authLoading ? 'Načítavam…' : (authMode==='login' ? 'Prihlásiť sa' : 'Registrovať sa')));

  safe.appendChild(h('button', {class:'btn btn-ghost', style:'margin-top:10px', onClick:()=>{
    authMode = authMode==='login' ? 'signup' : 'login';
    authError = ''; authInfo = '';
    render();
  }}, authMode==='login' ? 'Nemáš účet? Registruj sa' : 'Už máš účet? Prihlás sa'));

  screen.appendChild(safe);
  return screen;
}

// ═══════════════════════════ ONBOARDING SCREENS ════════════════════════

function progressDots(total, current) {
  const wrap = h('div', {class:'dots'});
  for (let i=0;i<total;i++) wrap.appendChild(h('div', {class:'dot'+(i===current?' active':'')}));
  return wrap;
}

function renderWelcome() {
  const screen = h('div', {class:'screen'});
  const safe = h('div', {class:'scroll safe-top safe-bot', style:'display:flex;flex-direction:column;justify-content:space-between'});

  const center = h('div', {style:'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center'});
  center.appendChild(h('div', {style:'width:88px;height:88px;border-radius:24px;background:linear-gradient(135deg,var(--pri),var(--acc));display:flex;align-items:center;justify-content:center;margin-bottom:20px'},
    h('span', {style:'font-size:44px;font-weight:900;color:#fff'}, 'X')));
  center.appendChild(h('h1', {}, 'ForgeX'));
  center.appendChild(h('p', {class:'subtitle'}, 'Forged by effort, not luck.'));

  const bottom = h('div', {style:'padding-bottom:10px'});
  bottom.appendChild(h('button', {class:'btn btn-primary', onClick:()=>navigate('ob_gender')}, 'Začať'));
  bottom.appendChild(h('p', {style:'text-align:center;color:var(--txtFaint);font-size:12px;margin-top:14px'}, 'Tvoje dáta sú bezpečne zálohované v cloude'));

  safe.appendChild(center);
  safe.appendChild(bottom);
  screen.appendChild(safe);
  return screen;
}

function obSelectCard(label, sublabel, emoji, selected, onPress) {
  const card = h('div', {class:'select-card'+(selected?' selected':''), onClick:()=>{vibrate();onPress();}});
  if (emoji) card.appendChild(h('div',{class:'emoji'},emoji));
  const labelWrap = h('div', {class:'label'});
  labelWrap.appendChild(h('div', {class:'label-main'}, label));
  if (sublabel) labelWrap.appendChild(h('div', {class:'label-sub'}, sublabel));
  card.appendChild(labelWrap);
  if (selected) card.appendChild(h('div', {class:'check-dot'}, '✓'));
  return card;
}

function inputField(labelText, value, placeholder, unit, onChange, type='decimal') {
  const wrap = h('div', {style:'margin-bottom:14px'});
  wrap.appendChild(h('label', {class:'input-label'}, labelText));
  const row = h('div', {class:'input-wrap'});
  const input = h('input', {
    type: type==='decimal' ? 'number' : 'text',
    inputmode: type,
    placeholder,
    value: value||'',
    onInput: (e)=>onChange(e.target.value),
  });
  row.appendChild(input);
  if (unit) row.appendChild(h('span', {class:'unit'}, unit));
  wrap.appendChild(row);
  return wrap;
}

function obScreen(stepIndex, title, sub, contentBuilder, onNext, nextDisabled, extraBottom, prevRoute) {
  const screen = h('div', {class:'screen'});
  const top = h('div', {class:'safe-top', style:'position:relative'});
  if (prevRoute) {
    top.appendChild(h('button',{class:'icon-btn', style:'position:absolute;left:20px;top:calc(var(--safeT) + 12px);z-index:2', onClick:()=>navigate(prevRoute)},'←'));
  }
  top.appendChild(progressDots(7, stepIndex));
  screen.appendChild(top);

  const scroll = h('div', {class:'scroll', style:'padding-top:8px'});
  scroll.appendChild(h('h2',{},title));
  if (sub) scroll.appendChild(h('p',{class:'subtitle'},sub));
  const content = h('div', {style:'margin-top:22px'});
  contentBuilder(content);
  scroll.appendChild(content);
  screen.appendChild(scroll);

  const bottom = h('div', {class:'safe-bot', style:'padding:16px 20px;display:flex;flex-direction:column;gap:10px'});
  const nextBtn = h('button', {class:'btn btn-primary', onClick:onNext}, 'Pokračovať');
  if (nextDisabled) nextBtn.disabled = true;
  bottom.appendChild(nextBtn);
  if (extraBottom) bottom.appendChild(extraBottom);
  screen.appendChild(bottom);

  return screen;
}

function renderObGender() {
  const valid = !!PROFILE.gender;
  return obScreen(0, 'Aké je tvoje pohlavie?', 'Potrebné pre presný výpočet BMR a makronutrientov', (content)=>{
    content.appendChild(obSelectCard('Muž', null, '♂️', PROFILE.gender==='male', ()=>{ saveProfile({gender:'male'}); render(); }));
    content.appendChild(obSelectCard('Žena', null, '♀️', PROFILE.gender==='female', ()=>{ saveProfile({gender:'female'}); render(); }));
    if (!valid) content.appendChild(h('p',{style:'color:var(--txtFaint);font-size:12px;text-align:center;margin-top:14px'},'👆 Vyber jednu možnosť pre pokračovanie'));
  }, ()=>navigate('ob_basics'), !valid, null, 'welcome');
}

function renderObBasics() {
  return obScreen(1, 'Základné údaje', 'Použijeme to na výpočet BMR, TDEE a makier', (content)=>{
    content.appendChild(inputField('Meno (voliteľné)', PROFILE.name||'', 'napr. Gabriel', '', v=>{}, 'text'));
    content.appendChild(inputField('Vek', PROFILE.age||'', 'napr. 28', 'rokov', v=>{}, 'numeric'));
    content.appendChild(inputField('Výška', PROFILE.heightCm||'', 'napr. 178', 'cm', v=>{}));
    content.appendChild(inputField('Hmotnosť', PROFILE.weightKg||'', 'napr. 80', 'kg', v=>{}));
  }, ()=>{
    const inputs = document.querySelectorAll('.input-wrap input');
    const nameVal = inputs[0].value.trim();
    const ageVal = inputs[1].value;
    const hVal = inputs[2].value;
    const wVal = inputs[3].value;
    // Validácia rozsahov (bod 3 - validácia čísel)
    const age = parseInt(ageVal,10), height = parseFloat(hVal), weight = parseFloat(wVal);
    if (!ageVal || !hVal || !wVal) return;
    if (age < 10 || age > 100) { alert('Zadaj vek medzi 10 a 100 rokmi.'); return; }
    if (height < 100 || height > 250) { alert('Zadaj výšku medzi 100 a 250 cm.'); return; }
    if (weight < 30 || weight > 300) { alert('Zadaj hmotnosť medzi 30 a 300 kg.'); return; }
    saveProfile({ name: nameVal||'', age, heightCm: height, weightKg: weight });
    navigate('ob_bodyfat');
  }, false, null, 'ob_gender');
}

let obBfMode = null; // null = nič nevybraté (predtým 'skip' čo pôsobilo ako aktívna voľba)
function renderObBodyFat() {
  let waist='', neck='', hip='', manualBf='';
  return obScreen(2, 'Telesný tuk', 'Voliteľné, ale zlepší presnosť odporúčaní', (content)=>{
    const modeRow = h('div', {style:'display:flex;gap:8px;margin-bottom:20px'});
    const modes = [['manual','Poznám %'],['navy','Vypočítaj z obvodov']];
    modes.forEach(([key,label])=>{
      const btn = h('button', {class:'btn '+(obBfMode===key?'btn-primary':'btn-outline')+' btn-sm', style:'flex:1', onClick:()=>{obBfMode=key; render();}}, label);
      modeRow.appendChild(btn);
    });
    content.appendChild(modeRow);

    if (!obBfMode) {
      content.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:20px 0'},
        'Vyber jednu z možností hore, alebo preskoč a doplň neskôr v Profile.'));
    }
    if (obBfMode==='manual') {
      content.appendChild(inputField('Telesný tuk', '', 'napr. 18', '%', v=>manualBf=v));
    }
    if (obBfMode==='navy') {
      const info = h('div', {class:'card', style:'margin-bottom:14px'});
      info.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;line-height:1.5'},
        'Navy metóda počíta % tuku z obvodov. Zmeraj páskou na hladine pupka (pas), pod ohryzkom (krk)'+(PROFILE.gender==='female'?' a v najširšom bode bokov.':'.')));
      content.appendChild(info);
      content.appendChild(inputField('Obvod pása', '', 'napr. 85', 'cm', v=>{waist=v; updateNavyPreview();}));
      content.appendChild(inputField('Obvod krku', '', 'napr. 38', 'cm', v=>{neck=v; updateNavyPreview();}));
      if (PROFILE.gender==='female') content.appendChild(inputField('Obvod bokov', '', 'napr. 98', 'cm', v=>{hip=v; updateNavyPreview();}));
      const resultCard = h('div', {id:'navy-result', class:'card card-accent', style:'display:none'});
      resultCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px'},'Odhadovaný telesný tuk'));
      resultCard.appendChild(h('p',{id:'navy-value',style:'color:var(--pri);font-size:28px;font-weight:800;margin-top:2px'},'–'));
      content.appendChild(resultCard);

      function updateNavyPreview() {
        const result = calcNavyBodyFat({ gender:PROFILE.gender, waistCm:parseFloat(waist), neckCm:parseFloat(neck), hipCm:parseFloat(hip), heightCm:PROFILE.heightCm });
        const card = document.getElementById('navy-result');
        const val = document.getElementById('navy-value');
        if (result) { card.style.display='block'; val.textContent = result+'%'; }
        else if (card) card.style.display='none';
      }
    }
  }, ()=>{
    let bf = null;
    if (obBfMode==='manual') {
      const inp = document.querySelector('.input-wrap input');
      if (inp && inp.value) bf = parseFloat(inp.value);
    }
    if (obBfMode==='navy') {
      const inputs = document.querySelectorAll('.input-wrap input');
      const w = parseFloat(inputs[0]?.value), n = parseFloat(inputs[1]?.value), hp = inputs[2]?.value ? parseFloat(inputs[2].value) : null;
      const result = calcNavyBodyFat({ gender:PROFILE.gender, waistCm:w, neckCm:n, hipCm:hp, heightCm:PROFILE.heightCm });
      bf = result;
      saveProfile({ waistCm:w||null, neckCm:n||null, hipCm:hp||null });
    }
    saveProfile({ bodyFatPct: bf });
    navigate('ob_measurements');
  }, false, h('button',{class:'btn btn-ghost', onClick:()=>{ saveProfile({bodyFatPct:null}); navigate('ob_measurements'); }},'Preskočiť'), 'ob_basics');
}

function renderObMeasurements() {
  return obScreen(3, 'Obvody tela', 'Voliteľné – pre sledovanie progresu v čase. Môžeš preskočiť a doplniť neskôr.', (content)=>{
    content.appendChild(inputField('Hrudník','','napr. 102','cm',()=>{}));
    content.appendChild(inputField('Ramená','','napr. 118','cm',()=>{}));
    content.appendChild(inputField('Stehno','','napr. 58','cm',()=>{}));
    content.appendChild(inputField('Lýtko','','napr. 38','cm',()=>{}));
    content.appendChild(inputField('Biceps','','napr. 36','cm',()=>{}));
  }, ()=>{
    const inputs = document.querySelectorAll('.input-wrap input');
    saveProfile({
      chestCm: inputs[0].value?parseFloat(inputs[0].value):null,
      shoulderCm: inputs[1].value?parseFloat(inputs[1].value):null,
      thighCm: inputs[2].value?parseFloat(inputs[2].value):null,
      calfCm: inputs[3].value?parseFloat(inputs[3].value):null,
      bicepCm: inputs[4].value?parseFloat(inputs[4].value):null,
    });
    navigate('ob_goal');
  }, false, h('button',{class:'btn btn-ghost', onClick:()=>navigate('ob_goal')},'Preskočiť'), 'ob_bodyfat');
}

function renderObGoal() {
  const GOALS = [
    {key:'hypertrophy', label:'Objem', sub:'Maximalizácia rastu svalov', emoji:'💪'},
    {key:'strength', label:'Sila', sub:'Progres v 1RM, výkon', emoji:'🏋️'},
    {key:'fat_loss', label:'Chudnutie', sub:'Kalorický deficit, definícia', emoji:'🔥'},
    {key:'recomp', label:'Rekompozícia', sub:'Tvarovanie, udržanie váhy', emoji:'⚖️'},
  ];
  const valid = !!PROFILE.goal;
  return obScreen(4, 'Aký je tvoj cieľ?', 'Toto určí tvoje kalorické a makro odporúčania', (content)=>{
    GOALS.forEach(g=>content.appendChild(obSelectCard(g.label,g.sub,g.emoji,PROFILE.goal===g.key,()=>{saveProfile({goal:g.key}); render();})));
    if (!valid) content.appendChild(h('p',{style:'color:var(--txtFaint);font-size:12px;text-align:center;margin-top:14px'},'👆 Vyber jednu možnosť pre pokračovanie'));
  }, ()=>navigate('ob_activity'), !valid, null, 'ob_measurements');
}

function renderObActivity() {
  const LEVELS = [
    ['sedentary','🪑'],['light','🚶'],['moderate','🏃'],['active','🏋️'],['very_active','🔥'],
  ];
  const valid = !!PROFILE.activityLevel;
  return obScreen(5, 'Úroveň aktivity', 'Mimo tréningu – tvoja bežná denná aktivita', (content)=>{
    LEVELS.forEach(([key,emoji])=>content.appendChild(obSelectCard(ACTIVITY_LABELS[key],null,emoji,PROFILE.activityLevel===key,()=>{saveProfile({activityLevel:key}); render();})));
    if (!valid) content.appendChild(h('p',{style:'color:var(--txtFaint);font-size:12px;text-align:center;margin-top:14px'},'👆 Vyber jednu možnosť pre pokračovanie'));
  }, ()=>navigate('ob_results'), !valid, null, 'ob_goal');
}

function renderObResults() {
  const screen = h('div', {class:'screen'});
  const scroll = h('div', {class:'scroll safe-top'});

  const bmi = calcBMI(PROFILE.weightKg, PROFILE.heightCm);
  const bmr = calcBMR(PROFILE);
  const tdee = calcTDEE(bmr, PROFILE.activityLevel);
  const calorieTarget = calcCalorieTarget(tdee, PROFILE.goal);
  const macros = calcMacros({ weightKg:PROFILE.weightKg, calorieTarget, goal:PROFILE.goal });
  const hydration = calcHydration(PROFILE.weightKg, PROFILE.activityLevel);
  const bodyAge = calcBodyAge({ age:PROFILE.age, bmi, activityLevel:PROFILE.activityLevel });

  scroll.appendChild(h('h2',{},'Tvoj profil je hotový 🎯'));
  scroll.appendChild(h('p',{class:'subtitle'},'Na základe tvojich údajov sme vypočítali:'));

  const mainCard = h('div',{class:'card card-accent', style:'margin-top:20px'});
  mainCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px'},'Denný kalorický cieľ'));
  mainCard.appendChild(h('p',{style:'color:var(--pri);font-size:36px;font-weight:800;margin-top:2px'}, (calorieTarget??'–')+' kcal'));
  mainCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:4px'}, 'Cieľ: '+(GOAL_LABELS[PROFILE.goal]??'–')));
  scroll.appendChild(mainCard);

  const macroGrid = h('div',{class:'macro-grid'});
  [['Bielkoviny',macros?.proteinG,'var(--pri)'],['Sacharidy',macros?.carbsG,'var(--acc)'],['Tuky',macros?.fatG,'var(--txtDim)']].forEach(([label,val,color])=>{
    const card = h('div',{class:'macro-card'});
    card.appendChild(h('div',{class:'macro-card-dot',style:'background:'+color}));
    card.appendChild(h('p',{style:'color:var(--txt);font-size:18px;font-weight:800;margin-top:6px'}, (val??'–')+' '+'g'));
    card.appendChild(h('p',{style:'color:var(--txtDim);font-size:11px;margin-top:2px'}, label));
    macroGrid.appendChild(card);
  });
  scroll.appendChild(macroGrid);

  const statsCard = h('div',{class:'card',style:'margin-top:20px'});
  [
    ['BMI', bmi!=null?`${bmi} (${bmiCategory(bmi)})`:'–'],
    ['BMR (bazálny metabolizmus)', bmr?`${bmr} kcal`:'–'],
    ['TDEE (celkový výdaj)', tdee?`${tdee} kcal`:'–'],
    ['Telesný vek', bodyAge?`${bodyAge} rokov`:'–'],
    ['Denná hydratácia', hydration?`${(hydration/1000).toFixed(1)} l`:'–'],
  ].forEach(([label,val])=>{
    const row = h('div',{class:'stat-row'});
    row.appendChild(h('span',{class:'stat-label'},label));
    row.appendChild(h('span',{class:'stat-value'},val));
    statsCard.appendChild(row);
  });
  scroll.appendChild(statsCard);

  const noteCard = h('div',{class:'card',style:'margin-top:16px'});
  noteCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;line-height:1.5'},
    '💡 Tieto hodnoty sú odporúčania na základe overených vzorcov (Mifflin-St Jeor). Appka ich bude postupne upresňovať na základe tvojho reálneho progresu.'));
  scroll.appendChild(noteCard);

  screen.appendChild(scroll);

  const bottom = h('div',{class:'safe-bot',style:'padding:16px 20px'});
  bottom.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{ saveProfile({onboardingComplete:true}); newSplitDaysCount = (PROFILE.gender==='female'?3:3); navigate('split_new'); }},'Zostaviť môj tréning →'));
  screen.appendChild(bottom);

  return screen;
}


// ═══════════════════════════ MAIN APP (Tab Navigation) ═════════════════

// SVG ikony pre bottom nav
const NAV_ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  training: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 8.5V6a1 1 0 0 1 1-1h1.5"/><path d="M20.5 8.5V6a1 1 0 0 0-1-1H18"/><path d="M3 15.5V18a1 1 0 0 0 1 1h1.5"/><path d="M20.5 15.5V18a1 1 0 0 1-1 1H18"/></svg>`,
  nutrition: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 6v6l4 2"/></svg>`,
  stats: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

function renderMainApp() {
  const screen = h('div', {class:'screen'});

  // Topbar – nové logo ForgeX
  const topbar = h('div', {id:'topbar'});
  const topRow = h('div', {class:'topbar-row'});
  const logo = h('div', {class:'app-logo'});
  logo.appendChild(h('span',{class:'app-logo-forge'},'Forge'));
  logo.appendChild(h('span',{class:'app-logo-x'},'X'));
  const dateEl = h('div',{});
  logo.appendChild(dateEl);
  const dateStr = (()=>{
    const d=new Date();
    const days=['Ne','Po','Ut','St','Št','Pi','So'];
    const months=['jan','feb','mar','apr','máj','jún','júl','aug','sep','okt','nov','dec'];
    return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]}`;
  })();
  const titleBlock = h('div');
  titleBlock.appendChild(logo);
  titleBlock.appendChild(h('div',{class:'app-date'}, dateStr));
  topRow.appendChild(titleBlock);
  topbar.appendChild(topRow);

  const tabContent = h('div', {style:'flex:1;display:flex;flex-direction:column;min-height:0', id:'tab-content'});
  const tabRenderers = { home: renderTabHome, training: renderTabTraining, nutrition: renderTabNutrition, stats: renderTabStats, profile: renderTabProfile };
  tabContent.appendChild((tabRenderers[activeTab]||renderTabHome)());

  // Bottom nav s SVG ikonami
  const bottomNav = h('div', {id:'bottom-nav'});
  const TABS = [
    ['home','Domov'],['training','Tréning'],['nutrition','Výživa'],['stats','Štatistiky'],['profile','Profil']
  ];
  TABS.forEach(([key,label])=>{
    const btn = h('button', {class:'bnav-btn'+(activeTab===key?' active':''), onClick:()=>{ activeTab=key; render(); }});
    const iconWrap = h('div',{class:'bnav-icon'});
    iconWrap.innerHTML = NAV_ICONS[key] || '';
    btn.appendChild(iconWrap);
    btn.appendChild(h('span',{},label));
    bottomNav.appendChild(btn);
  });

  screen.appendChild(topbar);
  screen.appendChild(tabContent);
  screen.appendChild(bottomNav);
  return screen;
}

// ───────────────────────── TAB: HOME ───────────────────────────────────
function macroBarRow(label, value, target, unit, color) {
  const pct = target ? Math.min((value/target)*100,100) : 0;
  const row = h('div', {class:'macro-row'});
  row.appendChild(h('div',{class:'macro-dot',style:`background:${color}`}));
  row.appendChild(h('span',{class:'macro-label'},label));
  const track = h('div',{class:'macro-track'});
  track.appendChild(h('div',{class:'macro-fill',style:`width:${pct}%;background:${color}`}));
  row.appendChild(track);
  row.appendChild(h('span',{class:'macro-val'},`${value}/${target??'–'}${unit}`));
  return row;
}

// Kalorický SVG kruh
function calRingSVG(consumed, target) {
  const size = 80;
  const r = 32;
  const cx = size/2, cy = size/2;
  const circumference = 2 * Math.PI * r;
  const pct = target ? Math.min(consumed/target, 1) : 0;
  const dash = pct * circumference;
  const gap = circumference - dash;
  // Farba: zelená ak pod cieľom, červená ak nad
  const over = target && consumed > target;
  return `<svg width="${size}" height="${size}" class="cal-ring-svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surf3)" stroke-width="6"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
      stroke="${over?'var(--red)':'var(--pri)'}" stroke-width="6"
      stroke-dasharray="${dash} ${gap}"
      stroke-dashoffset="${circumference/4}"
      stroke-linecap="round"
      transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
      font-size="14" font-weight="800" fill="var(--txt)" font-family="-apple-system,sans-serif"
      letter-spacing="-0.5">${Math.round(pct*100)}%</text>
  </svg>`;
}

function renderTabHome() {
  const wrap = h('div', {class:'scroll',style:'padding-top:14px'});

  // Greeting (vždy hore, nie je súčasť konfigurovateľných sekcií)
  const greeting = h('div',{style:'margin-bottom:16px'});
  const hour = new Date().getHours();
  const greetWord = hour<12?'Dobré ráno':'Zdravím';
  greeting.appendChild(h('div',{style:'color:var(--txtFaint);font-size:13px;font-weight:600;letter-spacing:.3px;text-transform:uppercase;margin-bottom:4px'},greetWord));
  greeting.appendChild(h('h1',{style:'margin:0'},PROFILE.name||'Forgex'));
  wrap.appendChild(greeting);

  // Vykresli sekcie v poradí podľa homeLayout (chýbajúca sekcia = vypnutá)
  const layout = PROFILE.homeLayout && PROFILE.homeLayout.length ? PROFILE.homeLayout : DEFAULT_PROFILE.homeLayout;
  const renderers = { hero: renderHomeSectionHero, calories: renderHomeSectionCalories, water_streak: renderHomeSectionWaterStreak };
  // Hero ide vždy samostatne (full width), zvyšok sekcií sa v landscape zobrazí v 2-stĺpcovej mriežke
  const heroKey = layout.find(k=>k==='hero');
  const restKeys = layout.filter(k=>k!=='hero');
  if (heroKey && renderers[heroKey]) wrap.appendChild(renderers[heroKey]());
  if (restKeys.length) {
    const grid = h('div',{class:'landscape-grid',style:'margin-bottom:8px'});
    restKeys.forEach(key=>{
      const fn = renderers[key];
      if (fn) grid.appendChild(fn());
    });
    wrap.appendChild(grid);
  }

  // Tlačidlo na úpravu rozloženia – decentné, na konci
  wrap.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:4px;font-size:12px', onClick:()=>navigate('home_customize')},'⚙ Upraviť domovskú obrazovku'));

  if (!PROFILE.premium) wrap.appendChild(adBanner());

  return wrap;
}

function renderHomeSectionHero() {
  const activeSplitDay = getTodaySplitDay();
  const hasCustomWithWeekdays = ACTIVE_SPLIT_ID && getActiveDays().some(d=>d.weekday!=null);
  const heroCard = h('div',{class:'hero-card',style:'margin-bottom:14px'});
  heroCard.appendChild(h('div',{class:'hero-title'},'DNEŠNÝ TRÉNING'));

  if (activeSplitDay) {
    const exCount = activeSplitDay.exercises?.length||0;
    const doneEx = activeSplitDay.exercises?.filter(ex=>isExDone(activeSplitDay.id,ex)).length||0;
    heroCard.appendChild(h('div',{class:'hero-name'},activeSplitDay.title));
    heroCard.appendChild(h('div',{class:'hero-sub'},activeSplitDay.subtitle));
    const badge = h('div',{class:'hero-badge'});
    badge.innerHTML = `▶ Začať&nbsp;&nbsp;·&nbsp;&nbsp;${doneEx}/${exCount} cvikov`;
    heroCard.appendChild(badge);
    heroCard.addEventListener('click',()=>{
      activeDayId = activeSplitDay.id;
      workoutModeDayId = activeSplitDay.id;
      const nextIdx = activeSplitDay.exercises?.findIndex(ex=>!isExDone(activeSplitDay.id,ex));
      workoutModeExIdx = (nextIdx==null||nextIdx<0) ? 0 : nextIdx;
      navigate('workout_mode');
    });
  } else if (hasCustomWithWeekdays) {
    heroCard.appendChild(h('div',{class:'hero-name'},'Oddychový deň 😴'));
    heroCard.appendChild(h('div',{class:'hero-sub'},'Dnes nemáš naplánovaný tréning. Regenerácia je súčasť progresu.'));
  } else {
    heroCard.appendChild(h('div',{class:'hero-name'},'Nastav si split'));
    heroCard.appendChild(h('div',{class:'hero-sub'},'Vytvor tréningový plán a začni sledovať progres'));
    const badge = h('div',{class:'hero-badge'});
    badge.textContent = '+ Vytvoriť split';
    heroCard.appendChild(badge);
    heroCard.addEventListener('click',()=>{ activeTab='training'; navigate('home'); });
  }
  return heroCard;
}

function renderHomeSectionCalories() {
  const bmr = calcBMR(PROFILE);
  const tdee = calcTDEE(bmr, PROFILE.activityLevel);
  const calorieTarget = calcCalorieTarget(tdee, PROFILE.goal);
  const macros = calcMacros({ weightKg:PROFILE.weightKg, calorieTarget, goal:PROFILE.goal });
  const todayNutri = NUTRITION_LOG[todayKey()] || [];
  const consumed = todayNutri.reduce((acc,item)=>({
    cal: acc.cal+(item.calories||0), p: acc.p+(item.protein||0), c: acc.c+(item.carbs||0), f: acc.f+(item.fat||0)
  }), {cal:0,p:0,c:0,f:0});

  const calCard = h('div',{class:'card',style:'margin-bottom:14px'});
  const calWrap = h('div',{class:'cal-ring-wrap',style:'margin-bottom:14px'});
  const ringEl = h('div',{class:'cal-ring-svg'});
  ringEl.innerHTML = calRingSVG(Math.round(consumed.cal), calorieTarget);
  calWrap.appendChild(ringEl);

  const calInfo = h('div',{class:'cal-ring-info'});
  calInfo.appendChild(h('div',{class:'cal-ring-kcal'},`${Math.round(consumed.cal)}`));
  calInfo.appendChild(h('div',{class:'cal-ring-label'},`z ${calorieTarget??'–'} kcal`));
  const remain = calorieTarget ? calorieTarget - Math.round(consumed.cal) : null;
  if (remain!=null) {
    const over = remain < 0;
    calInfo.appendChild(h('div',{class:'cal-ring-remain',style:over?'color:var(--red)':''}, over?`+${Math.abs(remain)} kcal nad cieľom`:`${remain} kcal zostáva`));
  }
  calWrap.appendChild(calInfo);
  calCard.appendChild(calWrap);

  calCard.appendChild(macroBarRow('Bielkoviny',Math.round(consumed.p),macros?.proteinG,'g','var(--acc)'));
  calCard.appendChild(macroBarRow('Sacharidy',Math.round(consumed.c),macros?.carbsG,'g','var(--blue)'));
  calCard.appendChild(macroBarRow('Tuky',Math.round(consumed.f),macros?.fatG,'g','var(--txtDim)'));
  return calCard;
}

function renderHomeSectionWaterStreak() {
  const hydrationTarget = calcHydration(PROFILE.weightKg, PROFILE.activityLevel);
  const bottomRow = h('div',{style:'display:flex;gap:10px;margin-bottom:8px'});

  const waterToday = WATER_LOG[todayKey()] || 0;
  const waterCard = h('div',{class:'card',style:'flex:1'});
  waterCard.appendChild(h('div',{style:'color:var(--txtFaint);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px'},'VODA'));
  waterCard.appendChild(h('div',{style:'color:var(--txt);font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.5px'},`${(waterToday/1000).toFixed(1)}l`));
  waterCard.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;margin-bottom:8px'},`z ${hydrationTarget?(hydrationTarget/1000).toFixed(1):'–'} l`));
  waterCard.appendChild(h('button',{class:'btn btn-primary',style:'padding:9px 0;font-size:13px',onClick:()=>{ WATER_LOG[todayKey()]=(WATER_LOG[todayKey()]||0)+250; saveWater(); vibrate(); render(); }},'+250ml'));
  bottomRow.appendChild(waterCard);

  const streak = computeStreak();
  const streakCard = h('div',{class:'card',style:'flex:1;display:flex;flex-direction:column;justify-content:space-between'});
  streakCard.appendChild(h('div',{style:'color:var(--txtFaint);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px'},'SÉRIA'));
  const streakNum = h('div',{style:'display:flex;align-items:baseline;gap:6px'});
  streakNum.appendChild(h('span',{style:'color:var(--txt);font-size:32px;font-weight:800;letter-spacing:-2px;font-variant-numeric:tabular-nums'},String(streak)));
  streakNum.appendChild(h('span',{style:'color:var(--txtFaint);font-size:12px'},'dní'));
  streakCard.appendChild(streakNum);
  streakCard.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;margin-top:4px'},streak>0?'Pokračuj 💪':'Začni dnes'));
  bottomRow.appendChild(streakCard);

  return bottomRow;
}

function getTodaySplitDay() {
  const activeDays = getActiveDays();
  if (!activeDays.length) return null;
  const dow = new Date().getDay(); // 0=Ne,1=Po...

  // Ak je to vlastný split a má priradené dni týždňa, použijeme ich
  if (ACTIVE_SPLIT_ID) {
    const withWeekdays = activeDays.filter(d=>d.weekday!=null);
    if (withWeekdays.length) {
      const todayDay = withWeekdays.find(d=>d.weekday===dow);
      if (todayDay) return todayDay;
      // Dnes nie je tréningový deň podľa priradenia
      return null;
    }
    // Vlastný split bez priradených dní: rotácia (prvý nedokončený)
    const firstUnfinished = activeDays.find(d=>!d.exercises.every(ex=>isExDone(d.id,ex)));
    return firstUnfinished || activeDays[0];
  }

  // Preset PPL – fixný na dni týždňa
  const map = {1:'po',2:'ut',3:'st',4:'stv',5:'pi'};
  const id = map[dow];
  return activeDays.find(d=>d.id===id) || null;
}

function computeStreak() {
  if (!HISTORY.length) return 0;
  const dates = [...new Set(HISTORY.map(e=>e.date.split('T')[0]))].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  for (let i=0;i<dates.length;i++) {
    const d = new Date(dates[i]);
    const diffDays = Math.round((cursor - d) / 86400000);
    if (diffDays <= 1) { streak++; cursor = d; } else break;
  }
  return streak;
}


// ───────────────────────── TAB: TRAINING ───────────────────────────────
let trainingSubView = 'plan'; // plan | history

function renderTabTraining() {
  const wrap = h('div', {style:'flex:1;display:flex;flex-direction:column;min-height:0'});
  const activeDays = getActiveDays();

  // Žiadny split ešte neexistuje - jasná výzva na vytvorenie, žiadny skrytý default
  if (!activeDays.length) {
    const empty = h('div',{class:'scroll',style:'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px'});
    empty.appendChild(h('div',{style:'font-size:40px;margin-bottom:14px'},'🏋️'));
    empty.appendChild(h('h2',{style:'margin-bottom:8px'},'Zatiaľ nemáš tréningový plán'));
    empty.appendChild(h('p',{class:'subtitle',style:'margin-bottom:20px'},'Appka ti navrhne split na základe tvojich údajov. Vyber si počet dní a poďme na to.'));
    empty.appendChild(h('button',{class:'btn btn-primary',onClick:()=>{ newSplitDaysCount=3; navigate('split_new'); }},'+ Vytvoriť môj tréningový plán'));
    wrap.appendChild(empty);
    return wrap;
  }

  if (!activeDays.find(d=>d.id===activeDayId)) activeDayId = activeDays[0]?.id;

  const splitHeader = h('div', {style:'padding:16px 20px 0;display:flex;align-items:center;justify-content:space-between'});
  const splitName = CUSTOM_SPLITS.find(s=>s.id===ACTIVE_SPLIT_ID)?.name || 'Môj split';
  splitHeader.appendChild(h('div',{style:'color:var(--txtDim);font-size:12px;font-weight:600'}, '📋 '+splitName));
  splitHeader.appendChild(h('button',{class:'btn btn-ghost btn-sm', onClick:()=>navigate('split_manage')}, '⚙️ Splits'));
  wrap.appendChild(splitHeader);

  const sub = h('div', {style:'display:flex;gap:6px;padding:12px 20px 0'});
  ['plan','history'].forEach(v=>{
    const btn = h('button',{class:'btn btn-sm '+(trainingSubView===v?'btn-primary':'btn-outline'), style:'flex:1', onClick:()=>{trainingSubView=v; render();}}, v==='plan'?'Plán':'História');
    sub.appendChild(btn);
  });
  wrap.appendChild(sub);

  const dayTabs = h('div', {style:'display:flex;gap:6px;padding:14px 20px;overflow-x:auto'});
  activeDays.forEach(day=>{
    const isComplete = day.exercises.length>0 && day.exercises.every(ex=>isExDone(day.id,ex));
    const btn = h('button', {
      class:'btn btn-sm', style:`flex-shrink:0;background:${activeDayId===day.id?'var(--pri)':'var(--surf3)'};color:${activeDayId===day.id?'#fff':'var(--txtDim)'}`,
      onClick:()=>{ activeDayId=day.id; render(); }
    }, day.label + (isComplete?' ✓':''));
    dayTabs.appendChild(btn);
  });
  if (trainingSubView==='plan') wrap.appendChild(dayTabs);

  const content = h('div', {class:'scroll', style:'padding-top:0'});
  if (trainingSubView==='plan') content.appendChild(renderDayPlan(activeDays));
  else content.appendChild(renderHistoryView(activeDays));
  wrap.appendChild(content);

  return wrap;
}

function isExDone(dayId, ex) {
  const sess = (SESSION[dayId]||{})[ex.id] || {};
  const doneSets = (sess.sets||[]).filter(s=>s.done).length;
  return doneSets >= ex.sets;
}

function getPrevBest(exId) {
  let best = null;
  HISTORY.forEach(e=>{
    if (!e.data[exId]) return;
    (e.data[exId].sets||[]).filter(s=>s.done&&s.weight).forEach(s=>{
      if (!best || parseFloat(s.weight)>parseFloat(best.weight)) best=s;
    });
  });
  return best;
}

// Epley odhad 1RM
function estimate1RM(weight, reps) {
  if (!weight || !reps) return 0;
  return reps<=1 ? weight : weight * (1 + reps/30);
}

function getBestE1RM(exId) {
  let best = 0;
  HISTORY.forEach(e=>{
    if (!e.data[exId]) return;
    (e.data[exId].sets||[]).filter(s=>s.done&&s.weight&&s.reps).forEach(s=>{
      const e1rm = estimate1RM(parseFloat(s.weight), parseInt(s.reps,10));
      if (e1rm>best) best = e1rm;
    });
  });
  return best;
}

function renderDayPlan(activeDays) {
  const days = activeDays || getActiveDays();
  const day = days.find(d=>d.id===activeDayId);
  if (!day) {
    const empty = h('div',{class:'empty-state'});
    empty.appendChild(h('div',{class:'empty-emoji'},'🏋️'));
    empty.appendChild(h('div',{class:'empty-title'},'Žiadny tréningový deň'));
    return empty;
  }
  if (!day.exercises.length) {
    const empty = h('div',{class:'empty-state'});
    empty.appendChild(h('div',{class:'empty-emoji'},'➕'));
    empty.appendChild(h('div',{class:'empty-title'},'Tento deň nemá žiadne cviky'));
    empty.appendChild(h('div',{class:'empty-sub'},'Uprav split a pridaj cviky'));
    const btn = h('button',{class:'btn btn-primary btn-sm',style:'margin-top:14px',onClick:()=>navigate('split_manage')},'Upraviť split');
    empty.appendChild(btn);
    return empty;
  }
  const totalSets = day.exercises.reduce((a,e)=>a+e.sets,0);
  const doneEx = day.exercises.filter(ex=>isExDone(day.id,ex)).length;
  const pct = Math.round((doneEx/day.exercises.length)*100);

  // Auto-rozbalenie prvého nedokončeného cviku pri vstupe na deň (len raz)
  if (lastAutoExpandedDay !== day.id) {
    lastAutoExpandedDay = day.id;
    const firstUndone = day.exercises.find(ex=>!isExDone(day.id,ex));
    if (firstUndone) expandedEx[firstUndone.id] = true;
  }

  const container = h('div',{});

  const header = h('div',{class:'day-header'});
  const left = h('div');
  left.appendChild(h('div',{class:'day-title',style:'color:var(--pri)'},day.title));
  left.appendChild(h('div',{class:'day-sub'},day.subtitle));
  if (day.badge) { const b=h('span',{class:'pr-badge',style:'margin-top:6px;display:inline-flex'},'⬆ upravené'); left.appendChild(b); }
  header.appendChild(left);
  const right = h('div',{style:'text-align:right'});
  right.appendChild(h('div',{class:'sets-big',style:'color:var(--pri)'},totalSets));
  right.appendChild(h('div',{class:'sets-label'},'sérií'));
  header.appendChild(right);
  container.appendChild(header);

  const progWrap = h('div',{class:'pbar-row',style:'margin-bottom:14px'});
  const progLbl = h('div',{class:'pbar-label'});
  progLbl.appendChild(h('span',{},`${doneEx}/${day.exercises.length} cvikov`));
  progLbl.appendChild(h('span',{},`${pct}%`));
  progWrap.appendChild(progLbl);
  const progTrack = h('div',{class:'pbar-track'});
  progTrack.appendChild(h('div',{class:'pbar-fill',style:`width:${pct}%;background:var(--pri)`}));
  progWrap.appendChild(progTrack);
  container.appendChild(progWrap);

  // Počet dokončených sérií (pre tlačidlo Ukončiť)
  const doneSetsCount = day.exercises.reduce((a,ex)=>{
    const sess=(SESSION[day.id]||{})[ex.id]||{};
    return a + (sess.sets||[]).filter(s=>s.done).length;
  },0);

  if (doneEx===day.exercises.length) {
    const banner = h('div',{class:'card',style:'background:var(--greenDim);border-color:var(--green);text-align:center;margin-bottom:12px'});
    banner.appendChild(h('div',{style:'font-size:28px;margin-bottom:6px'},'💪'));
    banner.appendChild(h('div',{style:'font-weight:700;color:var(--green);font-size:15px'},'Všetky cviky splnené!'));
    banner.appendChild(h('div',{style:'color:var(--txtDim);font-size:12px;margin-top:3px'},`${totalSets} sérií dokončených`));
    const saveBtn = h('button',{class:'btn',style:'margin-top:12px;background:var(--green);color:#fff',onClick:()=>finishWorkout(day)},'✓ Ukončiť a uložiť tréning');
    banner.appendChild(saveBtn);
    container.appendChild(banner);
  } else if (doneSetsCount>0) {
    // Tréning rozrobený – ponúkni ukončiť aj keď nie je všetko hotové
    const partialBar = h('div',{class:'card',style:'margin-bottom:12px;display:flex;align-items:center;gap:12px'});
    const info = h('div',{style:'flex:1'});
    info.appendChild(h('div',{style:'color:var(--txt);font-weight:700;font-size:14px'},`${doneSetsCount} sérií · ${doneEx}/${day.exercises.length} cvikov`));
    info.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:2px'},'Môžeš ukončiť aj nedokončený tréning'));
    partialBar.appendChild(info);
    partialBar.appendChild(h('button',{class:'btn btn-sm',style:'background:var(--green);color:#fff',onClick:()=>{
      if (doneEx<day.exercises.length && !confirm(`Ukončiť tréning? Máš ${doneEx}/${day.exercises.length} cvikov. Uloží sa to čo si spravil.`)) return;
      finishWorkout(day);
    }},'✓ Ukončiť')); 
    container.appendChild(partialBar);
  }

  // Manuálne tlačidlo časovača prestávky
  const timerBtn = h('button',{class:'btn btn-outline',style:'margin-bottom:14px',onClick:()=>manualStartRest()},
    `⏱ Spustiť prestávku (${fmtTime(PROFILE.restSeconds||90)})`);
  container.appendChild(timerBtn);

  // Tlačidlo Workout mód (cvičím teraz)
  if (doneEx < day.exercises.length) {
    const woBtn = h('button',{class:'btn btn-primary',style:'margin-bottom:14px',onClick:()=>{
      workoutModeExIdx = day.exercises.findIndex(ex=>!isExDone(day.id,ex));
      if (workoutModeExIdx<0) workoutModeExIdx=0;
      workoutModeDayId = day.id;
      navigate('workout_mode');
    }},'▶ Spustiť tréning (workout mód)');
    container.appendChild(woBtn);
  }

  day.exercises.forEach((ex,idx)=>container.appendChild(renderExerciseCard(day,ex,idx)));

  const resetBtn = h('button',{class:'btn btn-ghost',style:'margin-top:16px',onClick:()=>{
    if(!confirm('Resetovať celý deň? Dáta sa stratia.')) return;
    SESSION[day.id]={}; saveSession(); render();
  }},'🔄 Resetovať deň');
  container.appendChild(resetBtn);

  return container;
}

function renderExerciseCard(day, ex, idx) {
  const sess = (SESSION[day.id]||{})[ex.id] || {};
  const done = isExDone(day.id, ex);
  const isExpanded = !!expandedEx[ex.id];

  const card = h('div',{class:'ex-card'+(done?' ex-done':'')});
  const header = h('div',{class:'ex-header',onClick:()=>{expandedEx[ex.id]=!expandedEx[ex.id]; render();}});
  header.appendChild(h('div',{class:'ex-num'}, done?'✓':String(idx+1)));
  header.appendChild(h('div',{class:'ex-name'},ex.name));
  header.appendChild(h('div',{class:'ex-badge'},`${ex.sets}× ${ex.reps}`+(exRestLabel(ex)?` · ⏱${exRestLabel(ex)}`:'')));
  header.appendChild(h('div',{style:'color:var(--txtFaint);font-size:12px;margin-left:4px'}, isExpanded?'▲':'▼'));
  card.appendChild(header);
  card.appendChild(h('div',{class:'ex-note'},ex.note));

  if (isExpanded) {
    const body = h('div',{class:'ex-body'});

    // Návrh progresívneho preťaženia
    const suggestion = suggestProgression(ex);
    if (suggestion) {
      body.appendChild(h('div',{class:'prog-hint'}, '📈 ' + suggestion.reason));
    } else {
      const prevBest = getPrevBest(ex.id);
      if (prevBest) {
        body.appendChild(h('div',{style:'font-size:11px;color:var(--txtFaint);margin-bottom:10px'},
          ['Predch. max: ', h('span',{style:'color:var(--pri);font-weight:700'},`${displayWeight(prevBest.weight)}${weightUnit()} × ${prevBest.reps}`)]));
      }
    }

    // Predvyplnené hodnoty: cieľ z plánu + návrh progresu
    const targetReps = parseBottomReps(ex.reps) || 8;
    const suggestedWeight = suggestion ? suggestion.weight : null;
    const suggestedReps = suggestion ? suggestion.reps : targetReps;

    // ── Rozcvičovacie série (warm-up) ──
    // Appka navrhuje rozcvičku pre zložené cviky (rank 1-2), užívateľ si ju môže kedykoľvek
    // sám zapnúť/vypnúť pre konkrétny cvik (princíp "appka vedie, ty rozhoduješ")
    const exRank = exerciseOrderRank(ex);
    const warmupSuggestedByDefault = exRank <= 2; // zložené cviky
    const warmupKey = `warmup_${ex.id}`;
    if (!PROFILE.warmupOverrides) PROFILE.warmupOverrides = {};
    const warmupOverride = PROFILE.warmupOverrides[warmupKey]; // true/false/undefined
    const showWarmup = warmupOverride!=null ? warmupOverride : warmupSuggestedByDefault;
    const refWeight = sess.sets?.[0]?.weight ? parseFloat(sess.sets[0].weight) : suggestedWeight;

    const warmupWrap = h('div',{style:'margin-bottom:12px'});
    const warmupToggleRow = h('div',{style:'display:flex;align-items:center;gap:8px;margin-bottom:8px'});
    warmupToggleRow.appendChild(h('span',{style:'font-size:12px;color:var(--txtDim);flex:1'},'🔥 Rozcvičovacie série'));
    const wTg = h('button',{class:'toggle'+(showWarmup?' on':''), style:'transform:scale(.8)'});
    wTg.appendChild(h('div',{class:'toggle-knob'}));
    wTg.addEventListener('click',()=>{
      PROFILE.warmupOverrides[warmupKey] = !showWarmup;
      saveProfile({warmupOverrides:PROFILE.warmupOverrides});
      render();
    });
    warmupToggleRow.appendChild(wTg);
    warmupWrap.appendChild(warmupToggleRow);

    if (showWarmup) {
      if (refWeight) {
        const sets = calcWarmupSets(refWeight);
        const wuCard = h('div',{class:'card',style:'background:var(--surf2);margin-bottom:4px;padding:10px 12px'});
        sets.forEach(s=>{
          wuCard.appendChild(h('div',{style:'display:flex;justify-content:space-between;font-size:12px;padding:3px 0'},[
            h('span',{style:'color:var(--txtFaint)'},`${s.pct}%`),
            h('span',{style:'color:var(--txt);font-weight:600'},`${displayWeight(s.weight)} ${weightUnit()} × ${s.reps}`),
          ]));
        });
        warmupWrap.appendChild(wuCard);
      } else {
        warmupWrap.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;padding:4px 0'},'Zadaj váhu prvej série, rozcvička sa vypočíta automaticky.'));
      }
    }
    body.appendChild(warmupWrap);

    for (let si=0; si<ex.sets; si++) {
      const s = (sess.sets||[])[si] || {};
      const isDone = !!s.done;
      // Hodnoty: uložené, alebo predvyplnené z návrhu/cieľa
      const wVal = s.weight!=null && s.weight!=='' ? displayWeight(parseFloat(s.weight)) : (suggestedWeight!=null ? displayWeight(suggestedWeight) : '');
      const rVal = s.reps!=null && s.reps!=='' ? s.reps : suggestedReps;

      const block = h('div',{class:'set-block'+(isDone?' done':''), id:`setblock-${ex.id}-${si}`});
      const top = h('div',{class:'set-block-top'});
      top.appendChild(h('div',{class:'set-block-label'}, `Séria ${si+1}`));
      if (s.weight && s.reps) {
        top.appendChild(h('div',{style:'font-size:11px;color:var(--txtFaint)'}, `${wVal}${weightUnit()} × ${rVal}`));
      }
      block.appendChild(top);

      const fields = h('div',{class:'set-fields'});

      // Stepper VÁHA
      const wStepper = h('div',{class:'stepper'});
      wStepper.appendChild(h('div',{class:'stepper-label'}, `Váha (${weightUnit()})`));
      const wRow = h('div',{class:'stepper-row'});
      const wStep = progStepForMuscle(ex.muscle);
      wRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'weight',-wStep)},'−'));
      const wInput = h('input',{class:'stepper-val',type:'number',inputmode:'decimal',value:wVal,placeholder:'0',
        id:`w-${ex.id}-${si}`,
        onChange:(e)=>{ setSetVal(day.id,ex.id,si,'weight', inputToKg(e.target.value)); if (si===0) render(); }});
      wRow.appendChild(wInput);
      wRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'weight',wStep)},'+'));
      wStepper.appendChild(wRow);
      fields.appendChild(wStepper);

      // Stepper OPAKOVANIA
      const rStepper = h('div',{class:'stepper'});
      rStepper.appendChild(h('div',{class:'stepper-label'}, 'Opakovania'));
      const rRow = h('div',{class:'stepper-row'});
      rRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'reps',-1)},'−'));
      const rInput = h('input',{class:'stepper-val',type:'number',inputmode:'numeric',value:rVal,placeholder:'0',
        id:`r-${ex.id}-${si}`,
        onChange:(e)=>{ setSetVal(day.id,ex.id,si,'reps', e.target.value); }});
      rRow.appendChild(rInput);
      rRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'reps',1)},'+'));
      rStepper.appendChild(rRow);
      fields.appendChild(rStepper);

      // Veľký check button
      const checkBtn = h('button',{class:'set-check-lg'+(isDone?' done':''), onClick:()=>{
        // Načítaj aktuálne hodnoty z inputov (môžu byť upravené stepperom bez re-renderu)
        const curW = document.getElementById(`w-${ex.id}-${si}`)?.value || wVal;
        const curR = document.getElementById(`r-${ex.id}-${si}`)?.value || rVal;
        completeSet(day.id, ex.id, si, curW, curR, ex.rest);
      }},'✓');
      fields.appendChild(checkBtn);

      block.appendChild(fields);
      body.appendChild(block);
    }

    // RIR (len pre pokročilých – zapína sa v nastaveniach)
    if (PROFILE.showRIR) {
      const rirWrap = h('div',{class:'rir-inline'});
      rirWrap.appendChild(h('label',{title:'Reps In Reserve – koľko opakovaní by si ešte zvládol. 2 = mohol si spraviť ešte 2.'},'RIR (rezerva):'));
      const rirSel = h('select',{onChange:(e)=>{ setExField(day.id,ex.id,'rir',e.target.value); }});
      rirSel.appendChild(h('option',{value:''},'–'));
      [0,1,2,3,4].forEach(r=>{
        const opt = h('option',{value:r},String(r));
        if (String(sess.rir)===String(r)) opt.selected=true;
        rirSel.appendChild(opt);
      });
      rirWrap.appendChild(rirSel);
      body.appendChild(rirWrap);
    }

    // Poznámka
    const noteArea = h('textarea',{class:'note-input',rows:'2',placeholder:'Poznámka k cviku...', style:'margin-top:8px', onChange:(e)=>{ setExNote(day.id,ex.id,e.target.value); }});
    noteArea.value = sess.note || '';
    body.appendChild(noteArea);

    card.appendChild(body);
  }

  return card;
}

// Stepper +/- úprava – ak ešte nie je hodnota uložená, použije zobrazenú (predvyplnenú)
function adjustSetField(dayId, exId, setIdx, field, delta) {
  const inputId = (field==='weight'?'w-':'r-') + exId + '-' + setIdx;
  const input = document.getElementById(inputId);
  const current = parseFloat(input?.value) || 0;
  let next = current + delta;
  if (next < 0) next = 0;
  // Zaokrúhli váhu na 1 desatinné miesto (kvôli 2.5 krokom)
  if (field==='weight') next = Math.round(next*10)/10;
  // Aktualizuj input priamo (bez re-renderu => obraz neskáče)
  if (input) input.value = next;
  // Ulož do session (váhu konvertuj späť na kg)
  if (field==='weight') {
    setSetVal(dayId, exId, setIdx, 'weight', inputToKg(next));
  } else {
    setSetVal(dayId, exId, setIdx, 'reps', String(next));
  }
}

// Dokončenie série – uloží hodnoty (ak nie sú), zazelení, spustí timer, auto-skok
function completeSet(dayId, exId, setIdx, displayedW, displayedR, restSeconds) {
  if (!SESSION[dayId]) SESSION[dayId]={};
  if (!SESSION[dayId][exId]) SESSION[dayId][exId]={};
  if (!SESSION[dayId][exId].sets) SESSION[dayId][exId].sets=[];
  while (SESSION[dayId][exId].sets.length<=setIdx) SESSION[dayId][exId].sets.push({});
  const s = SESSION[dayId][exId].sets[setIdx];

  if (!s.done) {
    // Zaznamenaj čas začiatku tréningu pri prvej dokončenej sérii
    if (!SESSION[dayId]._startedAt) SESSION[dayId]._startedAt = Date.now();
    // Pri zaškrtnutí ulož predvyplnené hodnoty ak ešte nie sú zadané
    if (s.weight==null || s.weight==='') s.weight = inputToKg(displayedW);
    if (s.reps==null || s.reps==='') s.reps = String(displayedR);
    s.done = true;
    vibrate(15);

    // Okamžitá oslava nového osobného maxima (e1RM) pri uložení série
    const w = parseFloat(s.weight)||0;
    const r = parseInt(s.reps,10)||0;
    if (w>0 && r>0) {
      const prevE1RM = getBestE1RM(exId);
      const newE1RM = estimate1RM(w,r);
      if (newE1RM > prevE1RM && prevE1RM > 0) {
        const ex = getExerciseById(exId);
        vibrate(40);
        showToast(`🏆 Nové osobné maximum! ${ex?ex.name+': ':''}${displayWeight(w)}${weightUnit()} × ${r}`, 3000);
      }
    }

    saveSession();
    // Spusti časovač prestávky (ak je zapnutý auto-start)
    if (PROFILE.restAutoStart) {
      const seconds = (restSeconds!=null) ? restSeconds : (PROFILE.restSeconds||90);
      if (seconds>0) startRestTimer(seconds);
    }
    render();
  } else {
    s.done = false;
    saveSession();
    render();
  }
}

function setExField(dayId, exId, field, val) {
  if (!SESSION[dayId]) SESSION[dayId]={};
  if (!SESSION[dayId][exId]) SESSION[dayId][exId]={};
  SESSION[dayId][exId][field]=val;
  saveSession();
}

function setSetVal(dayId, exId, setIdx, field, value) {
  if (!SESSION[dayId]) SESSION[dayId]={};
  if (!SESSION[dayId][exId]) SESSION[dayId][exId]={};
  if (!SESSION[dayId][exId].sets) SESSION[dayId][exId].sets=[];
  while (SESSION[dayId][exId].sets.length<=setIdx) SESSION[dayId][exId].sets.push({});
  SESSION[dayId][exId].sets[setIdx][field]=value;
  saveSession();
}
function setExNote(dayId, exId, val) {
  if (!SESSION[dayId]) SESSION[dayId]={};
  if (!SESSION[dayId][exId]) SESSION[dayId][exId]={};
  SESSION[dayId][exId].note=val;
  saveSession();
}
function toggleSetDone(dayId, exId, setIdx) {
  if (!SESSION[dayId]) SESSION[dayId]={};
  if (!SESSION[dayId][exId]) SESSION[dayId][exId]={};
  if (!SESSION[dayId][exId].sets) SESSION[dayId][exId].sets=[];
  while (SESSION[dayId][exId].sets.length<=setIdx) SESSION[dayId][exId].sets.push({});
  SESSION[dayId][exId].sets[setIdx].done = !SESSION[dayId][exId].sets[setIdx].done;
  saveSession();
  vibrate();
  render();
}

function finishWorkout(day) {
  const data = SESSION[day.id] || {};
  const startedAt = data._startedAt || null;

  // Vypočítaj štatistiky tréningu
  let totalVolume = 0;      // kg × opakovania
  let totalSets = 0;
  let totalReps = 0;
  const newPRs = [];

  day.exercises.forEach(ex=>{
    const exData = data[ex.id];
    if (!exData || !exData.sets) return;
    const doneSets = exData.sets.filter(s=>s.done && s.weight);
    if (!doneSets.length) return;
    // PR pred týmto tréningom (z histórie)
    const prevBest = getPrevBest(ex.id);
    const prevMax = prevBest ? parseFloat(prevBest.weight) : 0;
    let sessionMax = 0;
    doneSets.forEach(s=>{
      const w = parseFloat(s.weight)||0;
      const r = parseInt(s.reps,10)||0;
      totalVolume += w*r;
      totalReps += r;
      totalSets++;
      if (w > sessionMax) sessionMax = w;
    });
    if (sessionMax > prevMax && prevMax > 0) {
      newPRs.push({ name: ex.name, weight: sessionMax });
    }
  });

  const durationMin = startedAt ? Math.max(1, Math.round((Date.now()-startedAt)/60000)) : null;

  // Porovnanie s minulým rovnakým tréningom (objem)
  let prevVolume = null;
  for (let i=HISTORY.length-1;i>=0;i--){
    if (HISTORY[i].dayId===day.id && HISTORY[i].stats){
      prevVolume = HISTORY[i].stats.volume;
      break;
    }
  }

  const stats = { volume: Math.round(totalVolume), sets: totalSets, reps: totalReps, durationMin, prCount: newPRs.length };

  // Ulož do histórie
  const entry = { id: Date.now().toString(), date: new Date().toISOString(), dayId: day.id, data: JSON.parse(JSON.stringify(data)), stats };
  HISTORY.push(entry);
  saveHistory();

  // Vyčisti session pre tento deň (tréning je hotový a uložený)
  delete SESSION[day.id];
  saveSession();
  stopRestTimer();

  // Zobraz súhrn
  showWorkoutSummary(day, stats, newPRs, prevVolume);
}

function showWorkoutSummary(day, stats, newPRs, prevVolume) {
  const overlay = h('div',{class:'modal-overlay', style:'align-items:center', onClick:(e)=>{ if(e.target===overlay){ closeModal(); activeTab='training'; navigate('home'); } }});
  const sheet = h('div',{class:'modal-sheet', style:'border-radius:20px;margin:0 16px;max-width:420px'});

  sheet.appendChild(h('div',{style:'text-align:center;font-size:44px;margin-bottom:8px'},'💪'));
  sheet.appendChild(h('h2',{style:'text-align:center;margin-bottom:4px'},'Tréning dokončený!'));
  sheet.appendChild(h('p',{style:'text-align:center;color:var(--txtDim);font-size:13px;margin-bottom:20px'},day.title));

  // Štatistické karty
  const statsGrid = h('div',{style:'display:flex;gap:10px;margin-bottom:14px'});
  const statItems = [
    [stats.durationMin ? `${stats.durationMin}` : '–', stats.durationMin ? 'minút' : 'čas', '⏱'],
    [`${stats.sets}`, 'sérií', '🔢'],
    [`${displayWeight(stats.volume)}`, `${weightUnit()} objem`, '🏋️'],
  ];
  statItems.forEach(([val,label,icon])=>{
    const card = h('div',{class:'card',style:'flex:1;text-align:center;padding:14px 8px'});
    card.appendChild(h('div',{style:'font-size:20px;margin-bottom:4px'},icon));
    card.appendChild(h('div',{style:'color:var(--txt);font-size:18px;font-weight:800'},val));
    card.appendChild(h('div',{style:'color:var(--txtDim);font-size:10px;margin-top:2px'},label));
    statsGrid.appendChild(card);
  });
  sheet.appendChild(statsGrid);

  // Porovnanie objemu s minulým tréningom
  if (prevVolume!=null && prevVolume>0) {
    const diff = stats.volume - prevVolume;
    const pct = Math.round((diff/prevVolume)*100);
    const better = diff>=0;
    const compCard = h('div',{class:'card',style:`margin-bottom:14px;background:${better?'var(--greenDim)':'var(--surf2)'};border-color:${better?'var(--green)':'var(--border)'}`});
    compCard.appendChild(h('div',{style:`color:${better?'var(--green)':'var(--txtDim)'};font-size:13px;font-weight:600;text-align:center`},
      better ? `📈 O ${pct}% väčší objem ako minule (+${displayWeight(Math.abs(diff))} ${weightUnit()})` : `Objem o ${Math.abs(pct)}% nižší ako minule`));
    sheet.appendChild(compCard);
  }

  // Nové PR
  if (newPRs.length) {
    const prCard = h('div',{class:'card',style:'margin-bottom:14px;background:#F59E0B18;border-color:var(--amber)'});
    prCard.appendChild(h('div',{style:'color:var(--amber);font-size:13px;font-weight:700;margin-bottom:6px'},`🏆 ${newPRs.length} ${newPRs.length===1?'nový rekord':'nové rekordy'}!`));
    newPRs.forEach(pr=>{
      prCard.appendChild(h('div',{style:'color:var(--txt);font-size:12px;margin-top:3px'},`${pr.name}: ${displayWeight(pr.weight)} ${weightUnit()}`));
    });
    sheet.appendChild(prCard);
  }

  sheet.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{ closeModal(); activeTab='training'; trainingSubView='history'; navigate('home'); }},'Super! 🎉'));
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

function findDayAnywhere(dayId) {
  const inActive = getActiveDays().find(d=>d.id===dayId);
  if (inActive) return inActive;
  const inPreset = DAYS.find(d=>d.id===dayId);
  if (inPreset) return inPreset;
  for (const split of CUSTOM_SPLITS) {
    const found = split.days.find(d=>d.id===dayId);
    if (found) return found;
  }
  return null;
}

function renderHistoryView() {
  const wrap = h('div',{style:'padding-top:8px'});
  if (!HISTORY.length) {
    const empty = h('div',{class:'empty-state'});
    empty.appendChild(h('div',{class:'empty-emoji'},'📋'));
    empty.appendChild(h('div',{class:'empty-title'},'Žiadna história'));
    empty.appendChild(h('div',{class:'empty-sub'},'Dokonči tréning a ulož ho'));
    wrap.appendChild(empty);
    return wrap;
  }
  const grouped = {};
  HISTORY.slice().reverse().forEach(entry=>{
    const date = entry.date.split('T')[0];
    if (!grouped[date]) grouped[date]=[];
    grouped[date].push(entry);
  });
  const months=['jan','feb','mar','apr','máj','jún','júl','aug','sep','okt','nov','dec'];
  Object.entries(grouped).forEach(([date,entries])=>{
    const d = new Date(date);
    wrap.appendChild(h('p',{class:'section-title'}, `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`));
    entries.forEach(entry=>{
      const day = findDayAnywhere(entry.dayId);
      if (!day) return;
      const totalSets = Object.values(entry.data).reduce((a,ex)=>a+(ex.sets||[]).filter(s=>s.done).length,0);
      const card = h('div',{class:'card',style:'margin-bottom:8px'});
      const topRow = h('div',{style:'display:flex;align-items:center;justify-content:space-between'});
      const left = h('div');
      left.appendChild(h('div',{style:'font-weight:700;font-size:15px;color:var(--pri)'},day.title));
      left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},`${day.subtitle} · ${totalSets} sérií`));
      topRow.appendChild(left);
      const delBtn = h('button',{class:'btn btn-ghost btn-sm', onClick:()=>{
        if(!confirm('Zmazať tento záznam?')) return;
        HISTORY = HISTORY.filter(e=>e.id!==entry.id); saveHistory(); render();
      }},'🗑');
      topRow.appendChild(delBtn);
      card.appendChild(topRow);

      day.exercises.forEach(ex=>{
        const exData = entry.data[ex.id];
        if (!exData) return;
        const doneSets = (exData.sets||[]).filter(s=>s.done);
        if (!doneSets.length) return;
        const best = doneSets.reduce((b,s)=> (!b||parseFloat(s.weight||0)>parseFloat(b.weight||0))?s:b, null);
        const row = h('div',{style:'display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid var(--border);margin-top:8px'});
        row.appendChild(h('div',{style:'font-size:13px;font-weight:500;color:var(--txt)'},ex.name));
        row.appendChild(h('div',{style:'font-size:12px;color:var(--pri);font-weight:700'}, best?`${best.weight||'–'}kg × ${best.reps||'–'}`:'–'));
        card.appendChild(row);
      });
      wrap.appendChild(card);
    });
  });
  return wrap;
}


// ───────────────────────── TAB: NUTRITION ──────────────────────────────
// Databáza potravín – hodnoty na 100g (alebo na kus, podľa unit).
// unit: 'g' = hodnoty na 100g, 'ks' = hodnoty na 1 kus
const FOOD_CATEGORIES = {
  meat:'Mäso a ryby', dairy:'Mliečne výrobky', grains:'Obilniny a pečivo',
  fruit:'Ovocie', veg:'Zelenina', nuts:'Orechy a semená',
  legumes:'Strukoviny', fats:'Tuky a oleje', sweets:'Sladké a snacky',
  drinks:'Nápoje', supplements:'Doplnky výživy', other:'Ostatné',
};

const FOOD_DB = [
  // ── MÄSO A RYBY (na 100g) ──
  {name:'Kuracie prsia',cat:'meat',unit:'g',per:100,calories:165,protein:31,carbs:0,fat:3.6},
  {name:'Kuracie stehno (bez kože)',cat:'meat',unit:'g',per:100,calories:177,protein:24,carbs:0,fat:8.5},
  {name:'Morčacie prsia',cat:'meat',unit:'g',per:100,calories:135,protein:30,carbs:0,fat:1},
  {name:'Hovädzie (chudé)',cat:'meat',unit:'g',per:100,calories:187,protein:26,carbs:0,fat:9},
  {name:'Bravčová panenka',cat:'meat',unit:'g',per:100,calories:143,protein:26,carbs:0,fat:4},
  {name:'Bravčové karé',cat:'meat',unit:'g',per:100,calories:231,protein:22,carbs:0,fat:16},
  {name:'Mleté hovädzie (15% tuk)',cat:'meat',unit:'g',per:100,calories:215,protein:19,carbs:0,fat:15},
  {name:'Losos',cat:'meat',unit:'g',per:100,calories:208,protein:20,carbs:0,fat:13},
  {name:'Tuniak (vo vlastnej šťave)',cat:'meat',unit:'g',per:100,calories:116,protein:26,carbs:0,fat:1},
  {name:'Treska',cat:'meat',unit:'g',per:100,calories:82,protein:18,carbs:0,fat:0.7},
  {name:'Krevety',cat:'meat',unit:'g',per:100,calories:99,protein:24,carbs:0,fat:0.3},
  {name:'Šunka kuracia',cat:'meat',unit:'g',per:100,calories:110,protein:18,carbs:1,fat:4},
  {name:'Slanina',cat:'meat',unit:'g',per:100,calories:541,protein:37,carbs:1.4,fat:42},

  // ── MLIEČNE VÝROBKY ──
  {name:'Tvaroh polotučný',cat:'dairy',unit:'g',per:100,calories:98,protein:11,carbs:3.4,fat:4.3},
  {name:'Tvaroh nízkotučný',cat:'dairy',unit:'g',per:100,calories:72,protein:13,carbs:3.5,fat:0.3},
  {name:'Grécky jogurt biely',cat:'dairy',unit:'g',per:100,calories:97,protein:9,carbs:4,fat:5},
  {name:'Jogurt biely (3%)',cat:'dairy',unit:'g',per:100,calories:61,protein:3.5,carbs:4.7,fat:3.3},
  {name:'Skyr',cat:'dairy',unit:'g',per:100,calories:63,protein:11,carbs:4,fat:0.2},
  {name:'Cottage cheese',cat:'dairy',unit:'g',per:100,calories:98,protein:11,carbs:3.4,fat:4.3},
  {name:'Mlieko polotučné',cat:'dairy',unit:'g',per:100,calories:47,protein:3.4,carbs:4.8,fat:1.5},
  {name:'Syr eidam (30%)',cat:'dairy',unit:'g',per:100,calories:280,protein:26,carbs:0,fat:19},
  {name:'Mozzarella',cat:'dairy',unit:'g',per:100,calories:280,protein:22,carbs:2,fat:21},
  {name:'Parmezán',cat:'dairy',unit:'g',per:100,calories:392,protein:36,carbs:3,fat:26},
  {name:'Maslo',cat:'dairy',unit:'g',per:100,calories:717,protein:0.9,carbs:0.1,fat:81},
  {name:'Vajce',cat:'dairy',unit:'ks',per:1,calories:78,protein:6.3,carbs:0.6,fat:5.3},
  {name:'Vaječný bielok',cat:'dairy',unit:'ks',per:1,calories:17,protein:3.6,carbs:0.2,fat:0.1},

  // ── OBILNINY A PEČIVO ──
  {name:'Ryža biela (varená)',cat:'grains',unit:'g',per:100,calories:130,protein:2.7,carbs:28,fat:0.3},
  {name:'Ryža hnedá (varená)',cat:'grains',unit:'g',per:100,calories:112,protein:2.6,carbs:23,fat:0.9},
  {name:'Ovsené vločky',cat:'grains',unit:'g',per:100,calories:389,protein:16.9,carbs:66,fat:6.9},
  {name:'Cestoviny (varené)',cat:'grains',unit:'g',per:100,calories:131,protein:5,carbs:25,fat:1.1},
  {name:'Zemiaky (varené)',cat:'grains',unit:'g',per:100,calories:87,protein:2,carbs:20,fat:0.1},
  {name:'Sladké zemiaky',cat:'grains',unit:'g',per:100,calories:86,protein:1.6,carbs:20,fat:0.1},
  {name:'Quinoa (varená)',cat:'grains',unit:'g',per:100,calories:120,protein:4.4,carbs:21,fat:1.9},
  {name:'Chlieb celozrnný',cat:'grains',unit:'g',per:100,calories:247,protein:13,carbs:41,fat:4.2},
  {name:'Rožok',cat:'grains',unit:'ks',per:1,calories:140,protein:4.5,carbs:27,fat:1.5},
  {name:'Ryžové chlebíčky',cat:'grains',unit:'ks',per:1,calories:28,protein:0.6,carbs:6,fat:0.2},
  {name:'Kuskus (varený)',cat:'grains',unit:'g',per:100,calories:112,protein:3.8,carbs:23,fat:0.2},
  {name:'Pohánka (varená)',cat:'grains',unit:'g',per:100,calories:92,protein:3.4,carbs:20,fat:0.6},

  // ── OVOCIE ──
  {name:'Banán',cat:'fruit',unit:'ks',per:1,calories:105,protein:1.3,carbs:27,fat:0.4},
  {name:'Jablko',cat:'fruit',unit:'ks',per:1,calories:95,protein:0.5,carbs:25,fat:0.3},
  {name:'Pomaranč',cat:'fruit',unit:'ks',per:1,calories:62,protein:1.2,carbs:15,fat:0.2},
  {name:'Jahody',cat:'fruit',unit:'g',per:100,calories:32,protein:0.7,carbs:7.7,fat:0.3},
  {name:'Čučoriedky',cat:'fruit',unit:'g',per:100,calories:57,protein:0.7,carbs:14,fat:0.3},
  {name:'Hrozno',cat:'fruit',unit:'g',per:100,calories:69,protein:0.7,carbs:18,fat:0.2},
  {name:'Ananás',cat:'fruit',unit:'g',per:100,calories:50,protein:0.5,carbs:13,fat:0.1},
  {name:'Mango',cat:'fruit',unit:'g',per:100,calories:60,protein:0.8,carbs:15,fat:0.4},
  {name:'Avokádo',cat:'fruit',unit:'ks',per:1,calories:240,protein:3,carbs:12,fat:22},

  // ── ZELENINA ──
  {name:'Brokolica',cat:'veg',unit:'g',per:100,calories:34,protein:2.8,carbs:7,fat:0.4},
  {name:'Paradajka',cat:'veg',unit:'g',per:100,calories:18,protein:0.9,carbs:3.9,fat:0.2},
  {name:'Uhorka',cat:'veg',unit:'g',per:100,calories:15,protein:0.7,carbs:3.6,fat:0.1},
  {name:'Paprika',cat:'veg',unit:'g',per:100,calories:31,protein:1,carbs:6,fat:0.3},
  {name:'Mrkva',cat:'veg',unit:'g',per:100,calories:41,protein:0.9,carbs:10,fat:0.2},
  {name:'Špenát',cat:'veg',unit:'g',per:100,calories:23,protein:2.9,carbs:3.6,fat:0.4},
  {name:'Cuketa',cat:'veg',unit:'g',per:100,calories:17,protein:1.2,carbs:3.1,fat:0.3},
  {name:'Šampiňóny',cat:'veg',unit:'g',per:100,calories:22,protein:3.1,carbs:3.3,fat:0.3},
  {name:'Cibuľa',cat:'veg',unit:'g',per:100,calories:40,protein:1.1,carbs:9,fat:0.1},
  {name:'Kukurica',cat:'veg',unit:'g',per:100,calories:86,protein:3.2,carbs:19,fat:1.2},

  // ── ORECHY A SEMENÁ ──
  {name:'Mandle',cat:'nuts',unit:'g',per:100,calories:579,protein:21,carbs:22,fat:50},
  {name:'Vlašské orechy',cat:'nuts',unit:'g',per:100,calories:654,protein:15,carbs:14,fat:65},
  {name:'Arašidy',cat:'nuts',unit:'g',per:100,calories:567,protein:26,carbs:16,fat:49},
  {name:'Arašidové maslo',cat:'nuts',unit:'g',per:100,calories:588,protein:25,carbs:20,fat:50},
  {name:'Kešu',cat:'nuts',unit:'g',per:100,calories:553,protein:18,carbs:30,fat:44},
  {name:'Chia semienka',cat:'nuts',unit:'g',per:100,calories:486,protein:17,carbs:42,fat:31},
  {name:'Ľanové semienka',cat:'nuts',unit:'g',per:100,calories:534,protein:18,carbs:29,fat:42},

  // ── STRUKOVINY ──
  {name:'Šošovica (varená)',cat:'legumes',unit:'g',per:100,calories:116,protein:9,carbs:20,fat:0.4},
  {name:'Cícer (varený)',cat:'legumes',unit:'g',per:100,calories:164,protein:9,carbs:27,fat:2.6},
  {name:'Fazuľa červená (varená)',cat:'legumes',unit:'g',per:100,calories:127,protein:9,carbs:23,fat:0.5},
  {name:'Tofu',cat:'legumes',unit:'g',per:100,calories:76,protein:8,carbs:1.9,fat:4.8},
  {name:'Hrach (varený)',cat:'legumes',unit:'g',per:100,calories:84,protein:5,carbs:16,fat:0.4},
  {name:'Edamame',cat:'legumes',unit:'g',per:100,calories:121,protein:12,carbs:9,fat:5},

  // ── TUKY A OLEJE ──
  {name:'Olivový olej',cat:'fats',unit:'g',per:100,calories:884,protein:0,carbs:0,fat:100},
  {name:'Kokosový olej',cat:'fats',unit:'g',per:100,calories:862,protein:0,carbs:0,fat:100},

  // ── SLADKÉ A SNACKY ──
  {name:'Horká čokoláda (70%)',cat:'sweets',unit:'g',per:100,calories:546,protein:7.8,carbs:46,fat:31},
  {name:'Med',cat:'sweets',unit:'g',per:100,calories:304,protein:0.3,carbs:82,fat:0},
  {name:'Proteínová tyčinka',cat:'sweets',unit:'ks',per:1,calories:200,protein:20,carbs:20,fat:7},
  {name:'Ryžový nákyp',cat:'sweets',unit:'g',per:100,calories:130,protein:3,carbs:25,fat:2},

  // ── NÁPOJE ──
  {name:'Coca-Cola',cat:'drinks',unit:'g',per:100,calories:42,protein:0,carbs:10.6,fat:0},
  {name:'Pomarančový džús',cat:'drinks',unit:'g',per:100,calories:45,protein:0.7,carbs:10,fat:0.2},
  {name:'Pivo (svetlé)',cat:'drinks',unit:'g',per:100,calories:43,protein:0.5,carbs:3.6,fat:0},
  {name:'Káva (čierna)',cat:'drinks',unit:'g',per:100,calories:2,protein:0.1,carbs:0,fat:0},

  // ── DOPLNKY VÝŽIVY ──
  {name:'Whey proteín',cat:'supplements',unit:'g',per:30,calories:120,protein:24,carbs:3,fat:1.5},
  {name:'Kazeín',cat:'supplements',unit:'g',per:30,calories:110,protein:24,carbs:3,fat:0.5},
  {name:'Gainer',cat:'supplements',unit:'g',per:100,calories:380,protein:20,carbs:65,fat:4},
  {name:'BCAA',cat:'supplements',unit:'g',per:10,calories:40,protein:0,carbs:0,fat:0},
];

// Spätná kompatibilita – starý názov
const QUICK_FOODS = FOOD_DB;

// ── VÝŽIVA: pomocné funkcie ──
const MEAL_TYPES = [
  {key:'breakfast', label:'Raňajky', icon:'🌅'},
  {key:'lunch', label:'Obed', icon:'☀️'},
  {key:'dinner', label:'Večera', icon:'🌙'},
  {key:'snack', label:'Snack', icon:'🍎'},
];

// Vypočíta makrá pre zadané množstvo (gramy alebo kusy) z definície potraviny
function computeFoodMacros(food, amount) {
  // food.per = referenčné množstvo (napr. 100g alebo 1ks), amount = skutočné
  const ratio = amount / food.per;
  return {
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10)/10,
    carbs: Math.round(food.carbs * ratio * 10)/10,
    fat: Math.round(food.fat * ratio * 10)/10,
  };
}

// Pridá jedlo do denníka
function logFood(food, amount, mealType) {
  const macros = computeFoodMacros(food, amount);
  const entry = {
    name: food.name,
    amount, unit: food.unit, per: food.per,
    baseCalories: food.calories, baseProtein: food.protein, baseCarbs: food.carbs, baseFat: food.fat,
    ...macros,
    meal: mealType || 'snack',
    cat: food.cat,
  };
  if (!NUTRITION_LOG[todayKey()]) NUTRITION_LOG[todayKey()]=[];
  NUTRITION_LOG[todayKey()].push(entry);
  saveNutrition();
  // Pridaj do nedávnych (max 12, bez duplicít)
  RECENT_FOODS = RECENT_FOODS.filter(f=>f.name!==food.name);
  RECENT_FOODS.unshift({ name:food.name, cat:food.cat, unit:food.unit, per:food.per, calories:food.calories, protein:food.protein, carbs:food.carbs, fat:food.fat });
  if (RECENT_FOODS.length>12) RECENT_FOODS = RECENT_FOODS.slice(0,12);
  saveRecentFoods();
}

// Predvolený typ jedla podľa dennej doby
function defaultMealType() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 14) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}


function renderTabNutrition() {
  const wrap = h('div', {class:'scroll'});
  const bmr = calcBMR(PROFILE);
  const tdee = calcTDEE(bmr, PROFILE.activityLevel);
  const calorieTarget = calcCalorieTarget(tdee, PROFILE.goal);
  const macros = calcMacros({ weightKg:PROFILE.weightKg, calorieTarget, goal:PROFILE.goal });

  wrap.appendChild(h('h1',{},'Výživa'));

  const todayNutri = NUTRITION_LOG[todayKey()] || [];
  const consumed = todayNutri.reduce((acc,item)=>({
    cal: acc.cal+(item.calories||0), p: acc.p+(item.protein||0), c: acc.c+(item.carbs||0), f: acc.f+(item.fat||0)
  }), {cal:0,p:0,c:0,f:0});

  // Súhrnná karta s progress barmi
  const sumCard = h('div',{class:'card card-accent',style:'margin-top:18px'});
  sumCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px'},'Denný cieľ'));
  sumCard.appendChild(h('p',{style:'color:var(--pri);font-size:30px;font-weight:800'}, `${Math.round(consumed.cal)} / ${calorieTarget??'–'} kcal`));
  const remain = calorieTarget ? calorieTarget - Math.round(consumed.cal) : null;
  if (remain!=null) {
    sumCard.appendChild(h('p',{style:`color:${remain>=0?'var(--txtDim)':'var(--red)'};font-size:12px;margin-top:2px`},
      remain>=0 ? `Zostáva ${remain} kcal` : `Prekročené o ${Math.abs(remain)} kcal`));
  }
  // makro bary
  const mg = h('div',{style:'margin-top:12px'});
  mg.appendChild(macroBarRow('Bielkoviny', Math.round(consumed.p), macros?.proteinG, 'g', 'var(--acc)'));
  mg.appendChild(macroBarRow('Sacharidy', Math.round(consumed.c), macros?.carbsG, 'g', '#3B9EFF'));
  const tukRow = macroBarRow('Tuky', Math.round(consumed.f), macros?.fatG, 'g', 'var(--txtDim)');
  tukRow.style.marginBottom='0';
  mg.appendChild(tukRow);
  sumCard.appendChild(mg);
  wrap.appendChild(sumCard);

  // Jedlá rozdelené podľa typu
  if (!todayNutri.length) {
    const empty = h('div',{class:'card',style:'text-align:center;padding:28px 16px;margin-top:16px'});
    empty.appendChild(h('div',{style:'font-size:32px;margin-bottom:8px'},'🍎'));
    empty.appendChild(h('div',{style:'color:var(--txt);font-weight:700'},'Zatiaľ žiadne jedlá dnes'));
    empty.appendChild(h('div',{style:'color:var(--txtDim);font-size:13px;margin-top:4px'},'Pridaj prvé jedlo nižšie'));
    wrap.appendChild(empty);
  } else {
    MEAL_TYPES.forEach(meal=>{
      const items = todayNutri.map((it,idx)=>({it,idx})).filter(x=>(x.it.meal||'snack')===meal.key);
      if (!items.length) return;
      const mealCal = items.reduce((a,x)=>a+(x.it.calories||0),0);
      wrap.appendChild(h('p',{class:'section-title'}, `${meal.icon} ${meal.label.toUpperCase()} · ${mealCal} kcal`));
      items.forEach(({it,idx})=>{
        const row = h('div',{class:'card',style:'margin-bottom:8px;display:flex;align-items:center'});
        const left = h('div',{style:'flex:1;min-width:0'});
        const amountLabel = it.unit==='ks' ? `${it.amount}ks` : `${it.amount}g`;
        left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},`${it.name} · ${amountLabel}`));
        left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},`${it.calories} kcal · B:${it.protein}g S:${it.carbs}g T:${it.fat}g`));
        row.appendChild(left);
        // Editovať
        const editBtn = h('button',{class:'btn btn-ghost btn-sm', onClick:()=>{
          // Nájdi pôvodnú potravinu v DB
          const food = [...CUSTOM_FOODS,...FOOD_DB].find(f=>f.name===it.name) ||
            { name:it.name, cat:it.cat||'other', unit:it.unit||'g', per:it.per||100,
              calories:it.baseCalories||it.calories, protein:it.baseProtein||it.protein,
              carbs:it.baseCarbs||it.carbs, fat:it.baseFat||it.fat };
          foodPickerMeal = it.meal || meal.key;
          openAddFoodModal(idx);
          setTimeout(()=>openPortionDialog(food),50);
        }},'✏️');
        row.appendChild(editBtn);
        // Zmazať
        const delBtn = h('button',{class:'btn btn-ghost btn-sm', onClick:()=>{
          NUTRITION_LOG[todayKey()].splice(idx,1); saveNutrition(); render();
        }},'✕');
        row.appendChild(delBtn);
        wrap.appendChild(row);
      });
    });
  }

  const addBtn = h('button',{class:'btn btn-primary',style:'margin-top:16px', onClick:()=>openAddFoodModal()},'+ Pridať jedlo');
  wrap.appendChild(addBtn);

  if (!PROFILE.premium) wrap.appendChild(adBanner());

  return wrap;
}

// ── Stav pickera jedál ──
let foodPickerTab = 'suggest';
let foodPickerCat = null;
let foodPickerMeal = null;
let foodPickerEditIdx = null;

// Návrhy jedál podľa typu
const MEAL_SUGGESTIONS = {
  breakfast: ['Ovsené vločky','Vajce','Skyr','Grécky jogurt biely','Tvaroh nízkotučný','Banán','Whey proteín','Cottage cheese'],
  lunch: ['Kuracie prsia','Ryža biela (varená)','Brokolica','Losos','Šošovica (varená)','Cestoviny (varené)','Morčacie prsia'],
  dinner: ['Kuracie prsia','Losos','Hovädzie (chudé)','Brokolica','Špenát','Treska','Tofu','Cuketa'],
  snack: ['Tvaroh polotučný','Mandle','Proteínová tyčinka','Arašidové maslo','Cottage cheese','Banán'],
};
function getSuggestedFoods(mealType) {
  const names = MEAL_SUGGESTIONS[mealType] || [];
  return names.map(n=>[...CUSTOM_FOODS,...FOOD_DB].find(f=>f.name===n)).filter(Boolean);
}

function openAddFoodModal(editIdx=null) {
  foodPickerMeal = defaultMealType();
  foodPickerTab = 'suggest';
  foodPickerCat = null;
  foodPickerEditIdx = editIdx;
  renderFoodPicker();
}

function renderFoodPicker() {
  document.querySelectorAll('.food-picker-overlay').forEach(o=>o.remove());
  const overlay = h('div',{class:'food-picker-overlay modal-overlay',style:'align-items:flex-end',onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{style:'background:var(--surf);border-radius:20px 20px 0 0;width:100%;height:72vh;display:flex;flex-direction:column;overflow:hidden'});

  // Fixná hlavička
  const head = h('div',{style:'flex-shrink:0;padding:16px 20px 0'});
  head.appendChild(h('div',{class:'modal-handle'}));
  const headRow = h('div',{style:'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px'});
  headRow.appendChild(h('h2',{},foodPickerEditIdx!=null?'Upraviť jedlo':'Pridať jedlo'));
  headRow.appendChild(h('button',{class:'btn btn-ghost btn-sm',onClick:closeModal},'Zavrieť'));
  head.appendChild(headRow);

  // Meal type selector
  const mealSeg = h('div',{class:'segment',style:'margin-bottom:10px'});
  MEAL_TYPES.forEach(m=>{
    const btn = h('button',{class:'segment-btn'+(foodPickerMeal===m.key?' active':''),style:'font-size:11px',onClick:()=>{
      foodPickerMeal=m.key;
      mealSeg.querySelectorAll('.segment-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      if(foodPickerTab==='suggest') refreshFoodPickerContent();
    }}, m.icon+' '+m.label);
    mealSeg.appendChild(btn);
  });
  head.appendChild(mealSeg);

  // Taby
  const tabs = h('div',{style:'display:flex;gap:5px;overflow-x:auto;padding-bottom:10px'});
  [['suggest','💡 Návrhy'],['search','🔍 Hľadať'],['recent','🕐 Nedávne'],['custom','⭐ Vlastné'],['categories','📂 Všetky']].forEach(([k,label])=>{
    const btn = h('button',{class:'btn btn-sm '+(foodPickerTab===k?'btn-primary':'btn-outline'),style:'flex-shrink:0',id:'ftab-'+k,onClick:()=>{
      foodPickerTab=k; foodPickerCat=null; refreshFoodPickerContent();
    }},label);
    tabs.appendChild(btn);
  });
  head.appendChild(tabs);
  sheet.appendChild(head);

  // Scrollovateľný obsah – scroll je vnútri sheetu, nie na celom viewporte (iOS fix)
  const contentWrap = h('div',{style:'flex:1;overflow-y:auto;padding:0 20px calc(var(--safeB) + 16px);-webkit-overflow-scrolling:touch'});
  contentWrap.appendChild(h('div',{id:'food-picker-content'}));
  sheet.appendChild(contentWrap);

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  refreshFoodPickerContent();
}

function refreshFoodPickerContent() {
  ['suggest','search','recent','custom','categories'].forEach(k=>{
    const b=document.getElementById('ftab-'+k);
    if(b) b.className='btn btn-sm '+(foodPickerTab===k?'btn-primary':'btn-outline');
  });
  const content = document.getElementById('food-picker-content');
  if (!content) return;
  content.innerHTML = '';

  if (foodPickerTab==='suggest') {
    if (RECENT_FOODS.length) {
      content.appendChild(h('p',{class:'section-title',style:'margin-top:8px'},'NEDÁVNE'));
      RECENT_FOODS.slice(0,4).forEach(food=>content.appendChild(foodRow(food)));
    }
    const suggested = getSuggestedFoods(foodPickerMeal);
    const mealLabel = MEAL_TYPES.find(m=>m.key===foodPickerMeal)?.label?.toUpperCase()||'';
    content.appendChild(h('p',{class:'section-title'},'ODPORÚČANÉ PRE '+mealLabel));
    suggested.forEach(food=>content.appendChild(foodRow(food)));
  }
  else if (foodPickerTab==='search') {
    content.appendChild(h('button',{class:'btn btn-outline btn-sm',style:'width:100%;margin-bottom:10px',onClick:()=>startBarcodeScan()},'📷 Skenovať čiarový kód (EAN)'));
    const wrap=h('div',{class:'input-wrap'});
    const inp=h('input',{type:'text',placeholder:'Napíš názov potraviny...',id:'food-search-input'});
    inp.addEventListener('input',()=>refreshSearchResults());
    wrap.appendChild(inp); content.appendChild(wrap);
    content.appendChild(h('div',{id:'food-search-results'}));
    setTimeout(refreshSearchResults, 50);
  }
  else if (foodPickerTab==='recent') {
    if (!RECENT_FOODS.length) content.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:24px'},'Zatiaľ žiadne nedávne'));
    else RECENT_FOODS.forEach(food=>content.appendChild(foodRow(food)));
  }
  else if (foodPickerTab==='custom') {
    content.appendChild(h('button',{class:'btn btn-outline btn-sm',style:'width:100%;margin-bottom:12px',onClick:()=>openCreateFoodModal()},'+ Vytvoriť vlastnú potravinu'));
    if (!CUSTOM_FOODS.length) content.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:16px'},'Zatiaľ žiadne vlastné'));
    else CUSTOM_FOODS.forEach((food,i)=>content.appendChild(foodRow(food,()=>{ if(!confirm('Zmazať?')) return; CUSTOM_FOODS.splice(i,1); saveCustomFoods(); refreshFoodPickerContent(); })));
  }
  else if (foodPickerTab==='categories') {
    if (!foodPickerCat) {
      const grid=h('div',{style:'display:grid;grid-template-columns:1fr 1fr;gap:8px'});
      Object.entries(FOOD_CATEGORIES).forEach(([key,label])=>{
        const count=FOOD_DB.filter(f=>f.cat===key).length;
        if(!count) return;
        const btn=h('button',{class:'btn btn-outline',style:'flex-direction:column;padding:12px 8px;height:auto',onClick:()=>{foodPickerCat=key;refreshFoodPickerContent();}});
        btn.appendChild(h('div',{style:'font-size:13px;font-weight:700'},label));
        btn.appendChild(h('div',{style:'font-size:11px;color:var(--txtDim);margin-top:2px'},count+' položiek'));
        grid.appendChild(btn);
      });
      content.appendChild(grid);
    } else {
      content.appendChild(h('button',{class:'btn btn-ghost btn-sm',style:'margin-bottom:10px',onClick:()=>{foodPickerCat=null;refreshFoodPickerContent();}},'← Späť'));
      FOOD_DB.filter(f=>f.cat===foodPickerCat).forEach(food=>content.appendChild(foodRow(food)));
    }
  }
}

function refreshSearchResults() {
  const results=document.getElementById('food-search-results');
  if(!results) return;
  const q=(document.getElementById('food-search-input')?.value||'').trim().toLowerCase();
  results.innerHTML='';
  let pool=[...CUSTOM_FOODS,...FOOD_DB];
  if(q) pool=pool.filter(f=>f.name.toLowerCase().includes(q));
  else pool=pool.slice(0,12);
  if(!pool.length) { results.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:24px'},'Nič sa nenašlo.')); return; }
  pool.slice(0,40).forEach(food=>results.appendChild(foodRow(food)));
}

function foodRow(food, onDelete) {
  const row=h('div',{class:'card',style:'margin-bottom:8px;display:flex;align-items:center'});
  const left=h('div',{style:'flex:1;min-width:0;cursor:pointer',onClick:()=>openPortionDialog(food)});
  left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},food.name));
  const perLabel=food.unit==='ks'?'1 ks':food.per+'g';
  left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},food.calories+' kcal/'+perLabel+' · B:'+food.protein+' S:'+food.carbs+' T:'+food.fat));
  row.appendChild(left);
  if(onDelete) row.appendChild(h('button',{class:'btn btn-ghost btn-sm',style:'color:var(--red)',onClick:onDelete},'🗑'));
  else row.appendChild(h('span',{style:'color:var(--pri);font-size:22px;padding:0 4px;cursor:pointer',onClick:()=>openPortionDialog(food)},'+'));
  return row;
}

function openPortionDialog(food) {
  document.querySelectorAll('.food-picker-overlay').forEach(o=>o.remove());
  const isKs=food.unit==='ks';
  let amount=isKs?1:food.per;
  if(foodPickerEditIdx!=null){ const ex=(NUTRITION_LOG[todayKey()]||[])[foodPickerEditIdx]; if(ex) amount=ex.amount||amount; }

  const overlay=h('div',{class:'modal-overlay',style:'z-index:320;align-items:flex-end',onClick:(e)=>{ if(e.target===overlay){ overlay.remove(); renderFoodPicker(); } }});
  const sheet=h('div',{style:'background:var(--surf);border-radius:20px 20px 0 0;width:100%;padding:20px 20px calc(var(--safeB)+20px)'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:2px'},food.name));
  sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:10px'},isKs?'Počet kusov':'Gramáž'));

  const preview=h('div',{class:'card card-accent',style:'margin-bottom:10px'});
  function updatePreview(){ preview.innerHTML=''; const m=computeFoodMacros(food,amount); preview.appendChild(h('div',{style:'color:var(--pri);font-size:22px;font-weight:800'},m.calories+' kcal')); preview.appendChild(h('div',{style:'color:var(--txtDim);font-size:13px;margin-top:4px'},'B: '+m.protein+'g · S: '+m.carbs+'g · T: '+m.fat+'g')); }
  updatePreview(); sheet.appendChild(preview);

  const step=isKs?1:10;
  const sr=h('div',{class:'stepper-row',style:'margin-bottom:10px'});
  sr.appendChild(h('button',{class:'stepper-btn',onClick:()=>{ amount=Math.max(isKs?1:5,amount-step); inp.value=amount; updatePreview(); }},'−'));
  const inp=h('input',{class:'stepper-val',type:'number',inputmode:'decimal',value:amount,id:'portion-input'});
  inp.addEventListener('input',(e)=>{ amount=parseFloat(e.target.value)||0; updatePreview(); });
  sr.appendChild(inp);
  sr.appendChild(h('button',{class:'stepper-btn',onClick:()=>{ amount+=step; inp.value=amount; updatePreview(); }},'+'));
  sheet.appendChild(sr);

  if(!isKs){
    const quick=h('div',{style:'display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap'});
    [50,100,150,200,250].forEach(g=>{ quick.appendChild(h('button',{class:'btn btn-outline btn-sm',style:'flex:1',onClick:()=>{ amount=g; inp.value=g; updatePreview(); }},g+'g')); });
    sheet.appendChild(quick);
  }

  const btnLabel=foodPickerEditIdx!=null?'Uložiť zmenu':'Pridať do denníka';
  sheet.appendChild(h('button',{class:'btn btn-primary',onClick:()=>{
    if(amount<=0) return;
    if(!NUTRITION_LOG[todayKey()]) NUTRITION_LOG[todayKey()]=[];
    const macros=computeFoodMacros(food,amount);
    const entry={name:food.name,amount,unit:food.unit,per:food.per,baseCalories:food.calories,baseProtein:food.protein,baseCarbs:food.carbs,baseFat:food.fat,...macros,meal:foodPickerMeal,cat:food.cat};
    if(foodPickerEditIdx!=null){ NUTRITION_LOG[todayKey()][foodPickerEditIdx]=entry; }
    else {
      NUTRITION_LOG[todayKey()].push(entry);
      RECENT_FOODS=RECENT_FOODS.filter(f=>f.name!==food.name);
      RECENT_FOODS.unshift({name:food.name,cat:food.cat,unit:food.unit,per:food.per,calories:food.calories,protein:food.protein,carbs:food.carbs,fat:food.fat});
      if(RECENT_FOODS.length>12) RECENT_FOODS=RECENT_FOODS.slice(0,12);
      saveRecentFoods();
    }
    saveNutrition(); overlay.remove(); closeModal();
    showToast(foodPickerEditIdx!=null?'✓ Zmenené':'✓ Pridané');
    foodPickerEditIdx=null; render();
  }},btnLabel));
  overlay.appendChild(sheet); document.body.appendChild(overlay);
}

function openCreateFoodModal() {
  document.querySelectorAll('.food-picker-overlay').forEach(o=>o.remove());
  const overlay=h('div',{class:'modal-overlay',style:'z-index:320;align-items:flex-end',onClick:(e)=>{ if(e.target===overlay){ overlay.remove(); renderFoodPicker(); } }});
  const sheet=h('div',{style:'background:var(--surf);border-radius:20px 20px 0 0;width:100%;padding:20px 20px calc(var(--safeB)+20px);max-height:85vh;overflow-y:auto'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:4px'},'Vlastná potravina'));
  sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Hodnoty na 100g alebo na 1 kus.'));
  [['Názov','name','text'],['Kalórie (kcal)','calories','number'],['Bielkoviny (g)','protein','number'],['Sacharidy (g)','carbs','number'],['Tuky (g)','fat','number']].forEach(([label,key,type])=>{
    sheet.appendChild(h('label',{class:'input-label'},label));
    const wrap=h('div',{class:'input-wrap'}); wrap.appendChild(h('input',{type,inputmode:type==='number'?'decimal':'text',id:'cf-'+key})); sheet.appendChild(wrap);
  });
  sheet.appendChild(h('label',{class:'input-label'},'Jednotka'));
  let cfUnit='g';
  const useg=h('div',{class:'segment',style:'margin-bottom:14px'});
  [['g','Na 100g'],['ks','Na 1 kus']].forEach(([k,label])=>{
    const b=h('button',{class:'segment-btn'+(cfUnit===k?' active':''),onClick:()=>{ cfUnit=k; useg.querySelectorAll('.segment-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); }},label);
    useg.appendChild(b);
  });
  sheet.appendChild(useg);
  sheet.appendChild(h('button',{class:'btn btn-primary',onClick:()=>{
    const name=document.getElementById('cf-name')?.value.trim();
    if(!name){alert('Zadaj názov.');return;}
    const food={name,cat:'other',unit:cfUnit,per:cfUnit==='ks'?1:100,calories:parseFloat(document.getElementById('cf-calories')?.value)||0,protein:parseFloat(document.getElementById('cf-protein')?.value)||0,carbs:parseFloat(document.getElementById('cf-carbs')?.value)||0,fat:parseFloat(document.getElementById('cf-fat')?.value)||0,custom:true};
    CUSTOM_FOODS.unshift(food); saveCustomFoods(); overlay.remove(); foodPickerTab='custom'; renderFoodPicker();
  }},'Uložiť potravinu'));
  overlay.appendChild(sheet); document.body.appendChild(overlay);
}

let barcodeReader=null;

function startBarcodeScan() {
  document.querySelectorAll('.food-picker-overlay').forEach(o=>o.remove());

  function stopScan() {
    if (barcodeReader) { try{ barcodeReader.reset(); }catch(e){} barcodeReader=null; }
    // Zastav video stream
    const v = document.getElementById('scan-video');
    if (v && v.srcObject) { v.srcObject.getTracks().forEach(t=>t.stop()); v.srcObject=null; }
  }

  const overlay=h('div',{class:'modal-overlay',style:'z-index:320;align-items:flex-end',
    onClick:(e)=>{ if(e.target===overlay){ stopScan(); overlay.remove(); renderFoodPicker(); } }});
  const sheet=h('div',{style:'background:var(--surf);border-radius:20px 20px 0 0;width:100%;padding:20px 20px calc(var(--safeB)+20px)'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:6px'},'Skenovanie EAN'));
  sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:12px'},'Zadaj kód zo škatule, alebo naskenovaj kamerou.'));

  // Manuálne – primárne (vždy funguje)
  const mr=h('div',{style:'display:flex;gap:8px;margin-bottom:16px'});
  const mw=h('div',{class:'input-wrap',style:'flex:1;margin-bottom:0'});
  const mi=h('input',{type:'number',inputmode:'numeric',placeholder:'EAN kód (8–13 číslic)',id:'ean-input'});
  mw.appendChild(mi); mr.appendChild(mw);
  mr.appendChild(h('button',{class:'btn btn-primary btn-sm',onClick:()=>{
    const ean=(document.getElementById('ean-input')?.value||'').trim();
    if(!ean){alert('Zadaj kód.');return;}
    stopScan(); overlay.remove(); lookupBarcode(ean);
  }},'Hľadať'));
  sheet.appendChild(mr);

  // Kamera sekcia
  const isHttps = location.protocol==='https:' || location.hostname==='localhost';
  const hasCamera = !!navigator.mediaDevices?.getUserMedia;
  const hasZXing = typeof ZXing !== 'undefined';

  if (!isHttps) {
    sheet.appendChild(h('div',{class:'card',style:'text-align:center;padding:16px;margin-bottom:10px'},[
      h('div',{style:'color:var(--txtDim);font-size:13px'},'📷 Kamera funguje len cez https://'),
      h('div',{style:'color:var(--txtFaint);font-size:11px;margin-top:4px'},'Na GitHub Pages to bude fungovať. Manuálne zadanie funguje vždy.'),
    ]));
  } else if (!hasCamera) {
    sheet.appendChild(h('div',{class:'card',style:'text-align:center;padding:16px;margin-bottom:10px'},[
      h('div',{style:'color:var(--txtDim);font-size:13px'},'Kamera nie je dostupná v tomto prehliadači'),
    ]));
  } else {
    // Kamera je dostupná – zobraz UI a spusti
    sheet.appendChild(h('p',{class:'section-title'},'KAMERA'));
    const vw=h('div',{style:'position:relative;border-radius:12px;overflow:hidden;background:#111;aspect-ratio:4/3;margin-bottom:8px'});
    const video=h('video',{id:'scan-video',style:'width:100%;height:100%;object-fit:cover;display:block'});
    video.setAttribute('playsinline',''); // iOS Safari vyžaduje bez hodnoty
    video.setAttribute('muted','');
    video.setAttribute('autoplay','');
    vw.appendChild(video);
    // Zameriavací rámik
    vw.appendChild(h('div',{style:'position:absolute;top:50%;left:10%;right:10%;height:2px;background:var(--pri);box-shadow:0 0 10px var(--pri);transform:translateY(-50%);pointer-events:none'}));
    sheet.appendChild(vw);
    const statusEl=h('p',{id:'scan-status',style:'color:var(--txtDim);font-size:12px;text-align:center;margin-bottom:10px'},'Spúšťam kameru...');
    sheet.appendChild(statusEl);

    function setStatus(msg, isError=false) {
      if(statusEl) { statusEl.textContent=msg; statusEl.style.color=isError?'var(--red)':'var(--txtDim)'; }
    }

    // Spusti kameru cez getUserMedia priamo (iOS Safari kompatibilné)
    setTimeout(async ()=>{
      try {
        // iOS Safari: environment camera, bez facingMode môže otvoriť prednú
        const constraints = {
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoEl = document.getElementById('scan-video');
        if (!videoEl || !document.body.contains(overlay)) { stream.getTracks().forEach(t=>t.stop()); return; }
        videoEl.srcObject = stream;
        await videoEl.play().catch(()=>{});
        setStatus('Namieriť kameru na čiarový kód');

        // Teraz spusti ZXing ak je dostupný
        if (hasZXing) {
          try {
            barcodeReader = new ZXing.BrowserMultiFormatReader();
            // Použij existujúci video element
            barcodeReader.decodeFromVideoElement(videoEl, (result, err)=>{
              if (result) {
                const code = result.getText();
                stopScan(); overlay.remove(); lookupBarcode(code);
              }
            });
          } catch(e) {
            // ZXing error – zostane len video, manuálne zadanie funguje
            setStatus('Skener aktívny – alebo zadaj kód ručne vyššie');
          }
        } else {
          setStatus('Kamera spustená – zadaj EAN kód zo škatule ručne vyššie');
        }
      } catch(err) {
        let msg = 'Kamera nedostupná – použi manuálne zadanie.';
        if (err.name==='NotAllowedError') msg = 'Prístup ku kamere odmietnutý. Povol ho v nastaveniach Safari → Webové stránky → Kamera.';
        else if (err.name==='NotFoundError') msg = 'Žiadna kamera nenájdená.';
        setStatus(msg, true);
      }
    }, 100);
  }

  sheet.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:4px',onClick:()=>{
    stopScan(); overlay.remove(); renderFoodPicker();
  }},'Zavrieť'));
  overlay.appendChild(sheet); document.body.appendChild(overlay);
}

async function lookupBarcode(ean) {
  const lo=h('div',{class:'modal-overlay',style:'z-index:340;align-items:center'});
  const lb=h('div',{style:'background:var(--surf);border-radius:20px;margin:0 32px;padding:32px 20px;text-align:center'});
  lb.appendChild(h('div',{style:'font-size:32px;margin-bottom:12px'},'🔍'));
  lb.appendChild(h('div',{style:'color:var(--txt);font-size:14px'},'Hľadám '+ean+'...'));
  lo.appendChild(lb); document.body.appendChild(lo);
  try {
    const resp=await fetch('https://world.openfoodfacts.org/api/v2/product/'+ean+'.json?fields=product_name,nutriments');
    const data=await resp.json();
    lo.remove();
    if(data.status===1&&data.product){
      const p=data.product; const n=p.nutriments||{};
      const food={name:p.product_name||'Produkt '+ean,cat:'other',unit:'g',per:100,calories:Math.round(n['energy-kcal_100g']||0),protein:Math.round((n.proteins_100g||0)*10)/10,carbs:Math.round((n.carbohydrates_100g||0)*10)/10,fat:Math.round((n.fat_100g||0)*10)/10};
      if(!food.calories&&!food.protein){alert('"'+food.name+'" nemá výživové údaje. Zadaj ručne.'); renderFoodPicker(); return;}
      openPortionDialog(food);
    } else {
      if(confirm('Produkt '+ean+' sa nenašiel. Zadať ručne?')) openCreateFoodModal();
      else renderFoodPicker();
    }
  } catch(e){ lo.remove(); alert('Chyba internetu.'); renderFoodPicker(); }
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(o=>o.remove());
}

// ───────────────────────── TAB: STATS ──────────────────────────────────
let statsSelectedEx = null;
let chartInstance = null;
let bodyChartInstance = null;
let statsSubView = 'training'; // training | body | week
let bodyMetric = 'weightKg';   // ktorá miera sa zobrazuje v grafe

function renderTabStats() {
  const wrap = h('div',{class:'scroll'});
  wrap.appendChild(h('h1',{},'Štatistiky'));

  // Podzáložky
  const sub = h('div',{class:'segment',style:'margin-top:16px;margin-bottom:4px'});
  [['training','Tréning'],['body','Telo'],['week','Týždeň']].forEach(([k,label])=>{
    sub.appendChild(h('button',{class:'segment-btn'+(statsSubView===k?' active':''), onClick:()=>{ statsSubView=k; render(); }}, label));
  });
  wrap.appendChild(sub);

  if (statsSubView==='training') renderStatsTraining(wrap);
  else if (statsSubView==='body') renderStatsBody(wrap);
  else if (statsSubView==='week') renderStatsWeek(wrap);

  if (!PROFILE.premium) wrap.appendChild(adBanner());

  return wrap;
}

function renderStatsTraining(wrap) {
  if (!HISTORY.length) {
    const empty = h('div',{class:'empty-state'});
    empty.appendChild(h('div',{class:'empty-emoji'},'📊'));
    empty.appendChild(h('div',{class:'empty-title'},'Štatistiky sa zobrazia po prvom tréningu'));
    empty.appendChild(h('div',{class:'empty-sub'},'PR rekordy a grafy progresu cvikov'));
    wrap.appendChild(empty);
    return;
  }

  // Zoznam cvikov ktoré majú históriu
  const exIdsInHistory = new Set();
  HISTORY.forEach(e=>Object.keys(e.data||{}).forEach(id=>{ if(id!=='_startedAt') exIdsInHistory.add(id); }));
  const allExercises = [];
  exIdsInHistory.forEach(id=>{
    const ex = getExerciseById(id);
    if (ex) allExercises.push(ex);
  });
  if (!allExercises.length) {
    wrap.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:24px'},'Žiadne dáta o cvikoch'));
    return;
  }
  if (!statsSelectedEx || !allExercises.find(e=>e.id===statsSelectedEx)) statsSelectedEx = allExercises[0].id;

  wrap.appendChild(h('p',{class:'section-title'},'PROGRES VÁHY'));
  const chartCard = h('div',{class:'card'});
  const select = h('select',{style:'width:100%;text-align:left;padding:11px;margin-bottom:12px;background:var(--surf2);border:1px solid var(--border2);color:var(--txt);border-radius:10px;font-size:14px',
    onChange:(e)=>{ statsSelectedEx=e.target.value; render(); }});
  allExercises.forEach(ex=>{
    const opt = h('option',{value:ex.id},ex.name);
    if (ex.id===statsSelectedEx) opt.selected=true;
    select.appendChild(opt);
  });
  chartCard.appendChild(select);
  const canvas = h('canvas',{id:'progressChart',height:'180'});
  chartCard.appendChild(canvas);
  wrap.appendChild(chartCard);
  setTimeout(()=>renderChart(statsSelectedEx), 30);

  wrap.appendChild(h('p',{class:'section-title'},'OSOBNÉ REKORDY (PR)'));
  const prCard = h('div',{class:'card'});
  let anyPR = false;
  allExercises.forEach(ex=>{
    const pr = getPrevBest(ex.id);
    if (!pr) return;
    anyPR = true;
    const row = h('div',{class:'stat-row'});
    row.appendChild(h('span',{class:'stat-label'},ex.name));
    row.appendChild(h('span',{class:'stat-value',style:'color:var(--pri)'},`${displayWeight(parseFloat(pr.weight))}${weightUnit()} × ${pr.reps}`));
    prCard.appendChild(row);
  });
  if (!anyPR) prCard.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px'},'Žiadne PR zatiaľ'));
  wrap.appendChild(prCard);
}

function renderChart(exId) {
  const canvas = document.getElementById('progressChart');
  if (!canvas || typeof Chart==='undefined') return;
  if (chartInstance) { chartInstance.destroy(); chartInstance=null; }
  const labels=[], values=[], e1rmValues=[];
  HISTORY.filter(e=>e.data[exId]).forEach(e=>{
    const sets = (e.data[exId].sets||[]).filter(s=>s.done&&s.weight);
    if (!sets.length) return;
    const maxW = Math.max(...sets.map(s=>parseFloat(s.weight||0)));
    const maxE1RM = Math.max(...sets.map(s=>estimate1RM(parseFloat(s.weight||0), parseInt(s.reps,10)||0)));
    const d = new Date(e.date);
    labels.push(`${d.getDate()}.${d.getMonth()+1}`);
    values.push(PROFILE.units==='imperial' ? kgToLbs(maxW) : maxW);
    e1rmValues.push(PROFILE.units==='imperial' ? kgToLbs(maxE1RM) : maxE1RM);
  });
  if (!labels.length) return;
  const priColor = getComputedStyle(document.documentElement).getPropertyValue('--pri').trim();
  const amberColor = getComputedStyle(document.documentElement).getPropertyValue('--amber').trim() || '#F59E0B';
  chartInstance = new Chart(canvas, {
    type:'line',
    data:{ labels, datasets:[
      { label:`Max váha (${weightUnit()})`, data:values, borderColor:priColor, backgroundColor:priColor+'22', pointBackgroundColor:priColor, pointRadius:5, tension:0.3, fill:true },
      { label:`Odhad 1RM (${weightUnit()})`, data:e1rmValues.map(v=>Math.round(v*10)/10), borderColor:amberColor, backgroundColor:amberColor+'00', pointBackgroundColor:amberColor, pointRadius:3, borderDash:[5,4], tension:0.3, fill:false },
    ] },
    options:{ responsive:true, plugins:{legend:{display:true, labels:{color:'#888', font:{size:11}}}}, scales:{ x:{ticks:{color:'#888',font:{size:11}},grid:{color:'#ffffff0a'}}, y:{ticks:{color:'#888',font:{size:11}},grid:{color:'#ffffff0a'}} } }
  });
}

// ── ŠTATISTIKY: TELO ──
const BODY_METRICS = [
  {key:'weightKg', label:'Hmotnosť', unit:()=>weightUnit(), conv:(v)=>PROFILE.units==='imperial'?kgToLbs(v):v},
  {key:'bodyFatPct', label:'Telesný tuk', unit:()=>'%', conv:(v)=>v},
  {key:'waistCm', label:'Pás', unit:()=>lengthUnit(), conv:(v)=>PROFILE.units==='imperial'?cmToInch(v):v},
  {key:'chestCm', label:'Hrudník', unit:()=>lengthUnit(), conv:(v)=>PROFILE.units==='imperial'?cmToInch(v):v},
  {key:'bicepCm', label:'Biceps', unit:()=>lengthUnit(), conv:(v)=>PROFILE.units==='imperial'?cmToInch(v):v},
  {key:'thighCm', label:'Stehno', unit:()=>lengthUnit(), conv:(v)=>PROFILE.units==='imperial'?cmToInch(v):v},
];

function renderStatsBody(wrap) {
  // Tlačidlo pridať záznam
  wrap.appendChild(h('button',{class:'btn btn-primary',style:'margin-top:14px;margin-bottom:6px', onClick:()=>openBodyLogModal()},'+ Zaznamenať mieru'));

  if (!BODY_LOG.length) {
    const empty = h('div',{class:'empty-state'});
    empty.appendChild(h('div',{class:'empty-emoji'},'📏'));
    empty.appendChild(h('div',{class:'empty-title'},'Zatiaľ žiadne záznamy tela'));
    empty.appendChild(h('div',{class:'empty-sub'},'Zaznamenaj váhu a obvody, sleduj zmeny v čase'));
    wrap.appendChild(empty);
    return;
  }

  // Výber metriky
  const metricsWithData = BODY_METRICS.filter(m=>BODY_LOG.some(e=>e[m.key]!=null));
  if (!metricsWithData.find(m=>m.key===bodyMetric)) bodyMetric = metricsWithData[0]?.key || 'weightKg';

  const metricRow = h('div',{style:'display:flex;gap:6px;overflow-x:auto;margin:14px 0 10px'});
  metricsWithData.forEach(m=>{
    metricRow.appendChild(h('button',{class:'btn btn-sm '+(bodyMetric===m.key?'btn-primary':'btn-outline'),style:'flex-shrink:0', onClick:()=>{ bodyMetric=m.key; render(); }}, m.label));
  });
  wrap.appendChild(metricRow);

  // Graf
  const chartCard = h('div',{class:'card'});
  const canvas = h('canvas',{id:'bodyChart',height:'180'});
  chartCard.appendChild(canvas);
  wrap.appendChild(chartCard);
  setTimeout(()=>renderBodyChart(bodyMetric), 30);

  // Zmena od začiatku
  const metric = BODY_METRICS.find(m=>m.key===bodyMetric);
  const withVals = BODY_LOG.filter(e=>e[bodyMetric]!=null).sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (withVals.length>=2) {
    const first = withVals[0][bodyMetric];
    const last = withVals[withVals.length-1][bodyMetric];
    const diff = Math.round((last-first)*10)/10;
    const card = h('div',{class:'card',style:'margin-top:10px;display:flex;justify-content:space-between;align-items:center'});
    card.appendChild(h('div',{},[
      h('div',{style:'color:var(--txtDim);font-size:12px'},'Zmena od začiatku'),
      h('div',{style:`color:${diff===0?'var(--txt)':(diff>0?'var(--green)':'var(--pri)')};font-size:20px;font-weight:800;margin-top:2px`},
        `${diff>0?'+':''}${metric.conv(diff).toFixed(1)} ${metric.unit()}`),
    ]));
    card.appendChild(h('div',{style:'text-align:right'},[
      h('div',{style:'color:var(--txtDim);font-size:11px'},`Teraz: ${metric.conv(last).toFixed(1)} ${metric.unit()}`),
      h('div',{style:'color:var(--txtFaint);font-size:11px;margin-top:2px'},`Štart: ${metric.conv(first).toFixed(1)} ${metric.unit()}`),
    ]));
    wrap.appendChild(card);
  }

  // História záznamov
  wrap.appendChild(h('p',{class:'section-title'},'HISTÓRIA ZÁZNAMOV'));
  const months=['jan','feb','mar','apr','máj','jún','júl','aug','sep','okt','nov','dec'];
  BODY_LOG.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach((entry,i)=>{
    const d = new Date(entry.date);
    const row = h('div',{class:'card',style:'margin-bottom:8px;display:flex;justify-content:space-between;align-items:center'});
    const left = h('div',{style:'flex:1'});
    left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:13px'},`${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`));
    const parts = [];
    if (entry.weightKg!=null) parts.push(`${displayWeight(entry.weightKg)}${weightUnit()}`);
    if (entry.bodyFatPct!=null) parts.push(`${entry.bodyFatPct}% tuk`);
    if (entry.waistCm!=null) parts.push(`pás ${PROFILE.units==='imperial'?cmToInch(entry.waistCm):entry.waistCm}${lengthUnit()}`);
    left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'}, parts.join(' · ')||'—'));
    row.appendChild(left);
    const idx = BODY_LOG.indexOf(entry);
    row.appendChild(h('button',{class:'btn btn-ghost btn-sm',style:'color:var(--red)', onClick:()=>{
      if(!confirm('Zmazať tento záznam?')) return;
      BODY_LOG.splice(idx,1); saveBodyLog(); render();
    }},'🗑'));
    wrap.appendChild(row);
  });
}

function renderBodyChart(metricKey) {
  const canvas = document.getElementById('bodyChart');
  if (!canvas || typeof Chart==='undefined') return;
  if (bodyChartInstance) { bodyChartInstance.destroy(); bodyChartInstance=null; }
  const metric = BODY_METRICS.find(m=>m.key===metricKey);
  const sorted = BODY_LOG.filter(e=>e[metricKey]!=null).sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (!sorted.length) return;
  // Ak len 1 bod, pridaj ho dvakrát aby sa čiara zobrazila
  const labels = sorted.map(e=>{ const d=new Date(e.date); return `${d.getDate()}.${d.getMonth()+1}`; });
  const values = sorted.map(e=>metric.conv(e[metricKey]));
  if (sorted.length===1) { labels.push(labels[0]); values.push(values[0]); }
  const priColor = getComputedStyle(document.documentElement).getPropertyValue('--pri').trim();
  bodyChartInstance = new Chart(canvas, {
    type:'line',
    data:{ labels, datasets:[{ label:`${metric.label} (${metric.unit()})`, data:values, borderColor:priColor, backgroundColor:priColor+'22', pointBackgroundColor:priColor, pointRadius:6, tension:0.3, fill:true }] },
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#888',font:{size:11}},grid:{color:'#ffffff0a'}}, y:{ticks:{color:'#888',font:{size:11}},grid:{color:'#ffffff0a'}} } }
  });
}

function openBodyLogModal() {
  const overlay = h('div',{class:'modal-overlay', onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{class:'modal-sheet'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:4px'},'Zaznamenať mieru'));
  sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Vyplň čo chceš sledovať. Prázdne polia sa preskočia.'));

  const fields = [
    [`Hmotnosť (${weightUnit()})`,'weightKg', PROFILE.weightKg?displayWeight(PROFILE.weightKg):''],
    ['Telesný tuk (%)','bodyFatPct', PROFILE.bodyFatPct||''],
    [`Pás (${lengthUnit()})`,'waistCm', ''],
    [`Hrudník (${lengthUnit()})`,'chestCm', ''],
    [`Biceps (${lengthUnit()})`,'bicepCm', ''],
    [`Stehno (${lengthUnit()})`,'thighCm', ''],
  ];
  fields.forEach(([label,key,val])=>{
    sheet.appendChild(h('label',{class:'input-label'},label));
    const wrap = h('div',{class:'input-wrap'});
    wrap.appendChild(h('input',{type:'number',inputmode:'decimal','data-bkey':key, value:val, id:`bl-${key}`}));
    sheet.appendChild(wrap);
  });

  sheet.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{
    const entry = { date: new Date().toISOString() };
    let any = false;
    const lengthKeys = ['waistCm','chestCm','bicepCm','thighCm'];
    fields.forEach(([_,key])=>{
      const raw = document.getElementById(`bl-${key}`)?.value;
      if (raw && raw.trim()!=='') {
        let v = parseFloat(raw);
        if (key==='weightKg') v = inputToKg(raw);
        else if (lengthKeys.includes(key) && PROFILE.units==='imperial') v = Math.round(v*2.54*10)/10;
        entry[key] = v;
        any = true;
      }
    });
    if (!any) { alert('Vyplň aspoň jednu hodnotu.'); return; }
    BODY_LOG.push(entry);
    saveBodyLog();
    // Aktualizuj aj aktuálnu váhu v profile
    if (entry.weightKg) saveProfile({weightKg: entry.weightKg});
    if (entry.bodyFatPct) saveProfile({bodyFatPct: entry.bodyFatPct});
    closeModal();
    render();
  }},'Uložiť záznam'));

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

// ── ŠTATISTIKY: TÝŽDEŇ ──
function renderStatsWeek(wrap) {
  // Tréningy za posledných 7 a predošlých 7 dní
  const now = Date.now();
  const day = 86400000;
  const thisWeek = HISTORY.filter(e=> now - new Date(e.date).getTime() <= 7*day);
  const lastWeek = HISTORY.filter(e=>{ const diff = now - new Date(e.date).getTime(); return diff > 7*day && diff <= 14*day; });

  const sumWeek = (arr)=>arr.reduce((a,e)=>({
    count: a.count+1,
    volume: a.volume + (e.stats?.volume || 0),
    sets: a.sets + (e.stats?.sets || 0),
  }), {count:0, volume:0, sets:0});
  const tw = sumWeek(thisWeek);
  const lw = sumWeek(lastWeek);

  wrap.appendChild(h('p',{class:'section-title'},'POSLEDNÝCH 7 DNÍ'));

  // Karty
  const grid = h('div',{style:'display:flex;gap:10px;margin-bottom:10px'});
  [['Tréningy',tw.count,lw.count,''],['Série',tw.sets,lw.sets,''],['Objem',Math.round(displayWeight(tw.volume)),Math.round(displayWeight(lw.volume)),weightUnit()]].forEach(([label,val,prev,unit])=>{
    const card = h('div',{class:'card',style:'flex:1;text-align:center;padding:14px 6px'});
    card.appendChild(h('div',{style:'color:var(--txt);font-size:20px;font-weight:800'}, `${val}${unit?' '+unit:''}`));
    card.appendChild(h('div',{style:'color:var(--txtDim);font-size:10px;margin-top:2px'},label));
    if (prev>0) {
      const diff = val - prev;
      card.appendChild(h('div',{style:`color:${diff>=0?'var(--green)':'var(--txtFaint)'};font-size:10px;margin-top:3px`}, `${diff>=0?'+':''}${diff} vs min.`));
    }
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  if (!thisWeek.length) {
    wrap.appendChild(h('div',{class:'card',style:'text-align:center;padding:20px;margin-top:6px'},[
      h('div',{style:'font-size:28px;margin-bottom:6px'},'📅'),
      h('div',{style:'color:var(--txtDim);font-size:13px'},'Tento týždeň ešte žiadny tréning. Šup do toho!'),
    ]));
  }

  // Tréningové dni v týždni (kalendárik)
  wrap.appendChild(h('p',{class:'section-title'},'POSLEDNÝCH 14 DNÍ'));
  const calCard = h('div',{class:'card'});
  const calRow = h('div',{style:'display:flex;gap:4px;justify-content:space-between;flex-wrap:wrap'});
  const trainedDays = new Set(HISTORY.map(e=>e.date.split('T')[0]));
  const dayNames=['Ne','Po','Ut','St','Št','Pi','So'];
  for (let i=13;i>=0;i--){
    const d = new Date(now - i*day);
    const key = d.toISOString().split('T')[0];
    const trained = trainedDays.has(key);
    const cell = h('div',{style:'display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:38px'});
    cell.appendChild(h('div',{style:'color:var(--txtFaint);font-size:9px'}, dayNames[d.getDay()]));
    cell.appendChild(h('div',{style:`width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:${trained?'var(--pri)':'var(--surf3)'};color:${trained?'#fff':'var(--txtFaint)'}`}, trained?'✓':String(d.getDate())));
    calRow.appendChild(cell);
  }
  calCard.appendChild(calRow);
  wrap.appendChild(calCard);

  // Streak
  const streak = computeStreak();
  wrap.appendChild(h('p',{class:'section-title'},'SÉRIA'));
  const streakCard = h('div',{class:'card',style:'display:flex;align-items:center;justify-content:space-between'});
  streakCard.appendChild(h('div',{},[
    h('div',{style:'color:var(--txt);font-size:20px;font-weight:800'},`${streak} ${streak===1?'deň':'dní'}`),
    h('div',{style:'color:var(--txtDim);font-size:12px;margin-top:2px'},'za sebou'),
  ]));
  streakCard.appendChild(h('span',{style:'font-size:28px'},'🔥'));
  wrap.appendChild(streakCard);
}


// ───────────────────────── TAB: PROFILE ────────────────────────────────
function renderTabProfile() {
  const wrap = h('div',{class:'scroll'});
  wrap.appendChild(h('h1',{},'Profil'));

  const avatarRow = h('div',{style:'display:flex;align-items:center;margin-top:18px'});
  avatarRow.appendChild(h('div',{class:'avatar'}, (PROFILE.name||'U')[0].toUpperCase()));
  const nameWrap = h('div',{style:'margin-left:14px'});
  nameWrap.appendChild(h('div',{style:'color:var(--txt);font-weight:700;font-size:17px'}, PROFILE.name||'Užívateľ'));
  nameWrap.appendChild(h('div',{class:'tier-badge'},'FREE'));
  avatarRow.appendChild(nameWrap);
  wrap.appendChild(avatarRow);

  wrap.appendChild(h('p',{class:'section-title'},'MÔJ PROFIL'));
  const profCard = h('div',{class:'card'});
  [
    ['Cieľ', GOAL_LABELS[PROFILE.goal]??'–'],
    ['Aktivita', ACTIVITY_LABELS[PROFILE.activityLevel]??'–'],
    ['Hmotnosť', PROFILE.weightKg?`${displayWeight(PROFILE.weightKg)} ${weightUnit()}`:'–'],
    ['Výška', PROFILE.heightCm?`${PROFILE.units==='imperial'?cmToInch(PROFILE.heightCm)+' in':PROFILE.heightCm+' cm'}`:'–'],
  ].forEach(([label,val])=>{
    const row = h('div',{class:'stat-row'});
    row.appendChild(h('span',{class:'stat-label'},label));
    row.appendChild(h('span',{class:'stat-value'},val));
    profCard.appendChild(row);
  });
  wrap.appendChild(profCard);

  wrap.appendChild(h('p',{class:'section-title'},'TÉMA APLIKÁCIE'));
  const themeGrid = h('div',{class:'theme-grid'});
  THEME_KEYS.forEach(key=>{
    themeGrid.appendChild(themeSwatch(key, THEMES[key].name, THEMES[key].emoji, THEMES[key].c.pri, THEMES[key].c.bg));
  });
  themeGrid.appendChild(themeSwatch('auto','Auto','⚙️','var(--txtDim)','var(--surf2)'));
  wrap.appendChild(themeGrid);

  wrap.appendChild(h('p',{class:'section-title'},'NASTAVENIA'));
  const settingsCard = h('div',{class:'card',style:'padding:0'});
  const settings = [
    ['👤','Osobné údaje',null, ()=>openPersonalDataModal()],
    ['🔑','Zmeniť heslo',null, ()=>openChangePasswordModal()],
    ['📏','Jednotky', PROFILE.units==='imperial'?'lbs / in':'kg / cm', ()=>openUnitsModal()],
    ['⏱','Časovač prestávky', fmtTime(PROFILE.restSeconds||90), ()=>openTimerModal()],
    ['📈','Progresívne preťaženie', progRuleLabel(), ()=>openProgressionModal()],
    ['🎯','Pokročilé (RIR)', PROFILE.showRIR?'Zapnuté':'Vypnuté', ()=>openAdvancedModal()],
    ['🔔','Notifikácie', PROFILE.notifRest?'Zapnuté':'Vypnuté', ()=>openNotifModal()],
    ['🎁','Promo kód', PROFILE.promoCode||null, ()=>openPromoModal()],
    ['🌍','Jazyk','Slovenčina', ()=>alert('Viacjazyčnosť (SK/CZ/EN) pripravujeme v ďalšej aktualizácii.')],
    ['⭐','Predplatné', PROFILE.premium?'Premium (bez reklám)':'Free', ()=>alert(PROFILE.premium ? 'Máš odomknutú verziu bez reklám.' : 'ForgeX je momentálne zadarmo. Premium plán pripravujeme.')],
    ['🚪','Odhlásiť sa', CLOUD_USER?.email||null, ()=>{ if(confirm('Naozaj sa chceš odhlásiť?')) signOutCloud(); }],
  ];
  settings.forEach(([icon,label,val,onClick],i)=>{
    const row = h('div',{class:'setting-row', style: i<settings.length-1 ? 'border-bottom:1px solid var(--border)' : '', onClick});
    row.appendChild(h('span',{class:'setting-icon'},icon));
    row.appendChild(h('span',{class:'setting-label'},label));
    if (val) row.appendChild(h('span',{class:'setting-value'},val));
    row.appendChild(h('span',{class:'setting-arrow'},'›'));
    settingsCard.appendChild(row);
  });
  wrap.appendChild(settingsCard);

  // Reset appky
  wrap.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:16px;color:var(--red)',onClick:()=>{
    if(!confirm('Vymazať VŠETKY dáta a začať odznova? Toto sa nedá vrátiť.')) return;
    localStorage.clear();
    location.reload();
  }},'Vymazať všetky dáta'));

  return wrap;
}

function progRuleLabel(){
  const map = {all_sets:'Po všetkých sériách', any_set:'Aspoň 1 séria', aggressive:'Každý tréning', off:'Vypnuté'};
  return map[PROFILE.progRule]||'Po všetkých sériách';
}

// ── SETTINGS MODALY ──
function settingsModal(title, contentBuilder) {
  const overlay = h('div',{class:'modal-overlay', onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{class:'modal-sheet'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:16px'},title));
  contentBuilder(sheet);
  sheet.appendChild(h('button',{class:'btn btn-primary',style:'margin-top:8px', onClick:()=>{
    closeModal();
    showToast('✓ Uložené');
    render();
  }},'Hotovo'));
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

function showToast(msg, duration=2000) {
  const existing = document.getElementById('toast-msg');
  if (existing) existing.remove();
  const toast = h('div',{id:'toast-msg', style:`
    position:fixed;bottom:calc(var(--safeB) + 80px);left:50%;transform:translateX(-50%);
    background:#22C55E;color:#fff;font-size:14px;font-weight:700;
    padding:10px 20px;border-radius:12px;z-index:400;
    box-shadow:0 4px 16px #0004;pointer-events:none;
    animation:fadeInUp .2s ease;
  `}, msg);
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(), duration);
}

function openPersonalDataModal() {
  settingsModal('Osobné údaje', (sheet)=>{
    const fields = [
      ['Meno','name','text',PROFILE.name||''],
      ['Vek','age','number',PROFILE.age||''],
      [`Výška (${PROFILE.units==='imperial'?'in':'cm'})`,'heightCm','number', PROFILE.heightCm ? (PROFILE.units==='imperial'?cmToInch(PROFILE.heightCm):PROFILE.heightCm) : ''],
      [`Hmotnosť (${weightUnit()})`,'weightKg','number', PROFILE.weightKg ? displayWeight(PROFILE.weightKg) : ''],
    ];
    fields.forEach(([label,key,type,val])=>{
      sheet.appendChild(h('label',{class:'input-label'},label));
      const wrap = h('div',{class:'input-wrap'});
      const inp = h('input',{type, value:val, 'data-key':key, inputmode: type==='number'?'decimal':'text'});
      // Ukladaj pri každom blur (iPhone nevyvolá change bez blur)
      inp.addEventListener('blur',(e)=>{
        const k=e.target.getAttribute('data-key');
        let v=e.target.value;
        if (!v.trim()) return;
        if (k==='heightCm') v = PROFILE.units==='imperial' ? Math.round(parseFloat(v)*2.54*10)/10 : parseFloat(v);
        else if (k==='weightKg') v = inputToKg(v);
        else if (k==='age') v = parseInt(v,10);
        saveProfile({[k]: v||null});
      });
      wrap.appendChild(inp);
      sheet.appendChild(wrap);
    });

    // Cieľ – aktualizuj segment bez close/reopen
    sheet.appendChild(h('label',{class:'input-label'},'Cieľ'));
    const goalSeg = h('div',{class:'segment',style:'margin-bottom:10px;flex-wrap:wrap', id:'goal-seg'});
    Object.entries(GOAL_LABELS).forEach(([k,v])=>{
      const b = h('button',{class:'segment-btn'+(PROFILE.goal===k?' active':''),style:'flex:1 1 45%',
        onClick:()=>{
          const oldTarget = calcCalorieTarget(calcTDEE(calcBMR(PROFILE), PROFILE.activityLevel), PROFILE.goal);
          saveProfile({goal:k});
          goalSeg.querySelectorAll('.segment-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          const newTarget = calcCalorieTarget(calcTDEE(calcBMR(PROFILE), PROFILE.activityLevel), PROFILE.goal);
          updateGoalPreview(oldTarget, newTarget);
        }}, v.split(' ')[0]);
      goalSeg.appendChild(b);
    });
    // Živý náhľad zmeny kalorického cieľa
    const goalPreview = h('div',{id:'goal-preview',style:'display:none;margin-bottom:14px'});
    sheet.appendChild(goalPreview);
    function updateGoalPreview(oldT, newT) {
      goalPreview.innerHTML = '';
      if (oldT==null || newT==null || oldT===newT) { goalPreview.style.display='none'; return; }
      goalPreview.style.display='block';
      const diff = newT - oldT;
      const card = h('div',{class:'card',style:'background:var(--priDim);border-color:var(--pri)'});
      card.appendChild(h('div',{style:'color:var(--txtDim);font-size:12px;margin-bottom:4px'},'⚡ Cieľ zmenený — nový denný kalorický cieľ:'));
      card.appendChild(h('div',{style:'display:flex;align-items:baseline;gap:8px'},[
        h('span',{style:'color:var(--pri);font-size:22px;font-weight:800'},`${newT} kcal`),
        h('span',{style:'color:var(--txtFaint);font-size:13px;text-decoration:line-through'},`${oldT} kcal`),
        h('span',{style:`color:${diff>0?'var(--green)':'var(--blue)'};font-size:12px;font-weight:700`},`${diff>0?'+':''}${diff}`),
      ]));
      card.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;margin-top:6px'},'Makrá (bielkoviny/sacharidy/tuky) sa prepočítali automaticky.'));
      goalPreview.appendChild(card);
    }
    sheet.appendChild(goalSeg);

    // Aktivita
    sheet.appendChild(h('label',{class:'input-label'},'Úroveň aktivity'));
    const actSel = h('select',{style:'width:100%;background:var(--surf2);border:1px solid var(--border2);color:var(--txt);border-radius:10px;padding:11px;font-size:14px;margin-bottom:8px'});
    Object.entries(ACTIVITY_LABELS).forEach(([k,v])=>{
      const opt=h('option',{value:k},v); if(PROFILE.activityLevel===k) opt.selected=true; actSel.appendChild(opt);
    });
    actSel.addEventListener('change',(e)=>{
      const oldTarget = calcCalorieTarget(calcTDEE(calcBMR(PROFILE), PROFILE.activityLevel), PROFILE.goal);
      saveProfile({activityLevel:e.target.value});
      const newTarget = calcCalorieTarget(calcTDEE(calcBMR(PROFILE), PROFILE.activityLevel), PROFILE.goal);
      updateGoalPreview(oldTarget, newTarget);
    });
    sheet.appendChild(actSel);
  });
}

function openUnitsModal() {
  settingsModal('Jednotky', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Vyber systém jednotiek. Hodnoty sa automaticky prepočítajú.'));
    const seg = h('div',{class:'segment'});
    [['metric','Metrické (kg / cm)'],['imperial','Imperiálne (lbs / in)']].forEach(([k,label])=>{
      const b = h('button',{class:'segment-btn'+(PROFILE.units===k?' active':''),
        onClick:()=>{
          saveProfile({units:k});
          seg.querySelectorAll('.segment-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
        }}, label);
      seg.appendChild(b);
    });
    sheet.appendChild(seg);
  });
}

function openChangePasswordModal() {
  let newPass = '', confirmPass = '', error = '', info = '', loading = false;

  const overlay = h('div',{class:'modal-overlay', onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{class:'modal-sheet'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:16px'},'Zmeniť heslo'));

  const msgWrap = h('div',{});
  sheet.appendChild(msgWrap);

  sheet.appendChild(h('label',{class:'input-label'},'Nové heslo'));
  const passWrap = h('div',{class:'input-wrap',style:'margin-bottom:14px'});
  passWrap.appendChild(h('input',{type:'password', placeholder:'••••••••', autocomplete:'new-password',
    onInput:(e)=>{ newPass = e.target.value; }}));
  sheet.appendChild(passWrap);

  sheet.appendChild(h('label',{class:'input-label'},'Potvrď nové heslo'));
  const confirmWrap = h('div',{class:'input-wrap',style:'margin-bottom:8px'});
  confirmWrap.appendChild(h('input',{type:'password', placeholder:'••••••••', autocomplete:'new-password',
    onInput:(e)=>{ confirmPass = e.target.value; }}));
  sheet.appendChild(confirmWrap);

  const submitBtn = h('button',{class:'btn btn-primary', style:'margin-top:8px'}, 'Zmeniť heslo');
  submitBtn.addEventListener('click', async ()=>{
    error = ''; info = '';
    if (!newPass || newPass.length<6) { error='Heslo musí mať aspoň 6 znakov.'; renderMsg(); return; }
    if (newPass !== confirmPass) { error='Heslá sa nezhodujú.'; renderMsg(); return; }
    loading = true; submitBtn.textContent = 'Ukladám…'; submitBtn.disabled = true;
    try {
      const { error: err } = await supabaseClient.auth.updateUser({ password: newPass });
      if (err) { error = err.message; renderMsg(); }
      else { closeModal(); showToast('✓ Heslo zmenené'); }
    } catch(e) {
      error = 'Nepodarilo sa zmeniť heslo. Skontroluj pripojenie.'; renderMsg();
    }
    loading = false; submitBtn.textContent = 'Zmeniť heslo'; submitBtn.disabled = false;
  });
  sheet.appendChild(submitBtn);

  function renderMsg() {
    msgWrap.innerHTML = '';
    if (error) msgWrap.appendChild(h('p',{style:'color:var(--red);font-size:13px;margin-bottom:10px'}, error));
    if (info) msgWrap.appendChild(h('p',{style:'color:var(--pri);font-size:13px;margin-bottom:10px'}, info));
  }

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

// Pomocná funkcia pre toggle – aktualizuje DOM priamo bez close/reopen (iOS Safari fix)
function toggleSetting(key, tgEl, labelEl) {
  const newVal = !PROFILE[key];
  saveProfile({[key]: newVal});
  if (tgEl) {
    tgEl.className = 'toggle' + (newVal ? ' on' : '');
  }
  if (labelEl) labelEl.textContent = newVal ? 'Zapnuté' : 'Vypnuté';
}

function makeToggle(profileKey, extraOnToggle) {
  const tg = h('button',{class:'toggle'+(PROFILE[profileKey]?' on':'')});
  tg.appendChild(h('div',{class:'toggle-knob'}));
  tg.addEventListener('click',()=>{
    toggleSetting(profileKey, tg);
    if (extraOnToggle) extraOnToggle(PROFILE[profileKey]);
  });
  return tg;
}

function openTimerModal() {
  settingsModal('Časovač prestávky', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Dĺžka prestávky medzi sériami.'));
    const quick = h('div',{style:'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px'});
    [30,60,90,120,150,180].forEach(sec=>{
      const btn = h('button',{class:'btn btn-sm '+(PROFILE.restSeconds===sec?'btn-primary':'btn-outline'),style:'flex:1 1 28%',
        onClick:()=>{
          saveProfile({restSeconds:sec});
          sheet.querySelectorAll('.rest-quick-btn').forEach(b=>b.className='btn btn-sm btn-outline');
          btn.className='btn btn-sm btn-primary';
        }});
      btn.className += ' rest-quick-btn';
      btn.textContent = fmtTime(sec);
      quick.appendChild(btn);
    });
    sheet.appendChild(quick);
    sheet.appendChild(h('label',{class:'input-label'},'Vlastný čas (sekundy)'));
    const wrap = h('div',{class:'input-wrap'});
    const inp = h('input',{type:'number',inputmode:'numeric',value:PROFILE.restSeconds||90});
    inp.addEventListener('change',(e)=>{ const v=parseInt(e.target.value,10); if(v>0) saveProfile({restSeconds:v}); });
    wrap.appendChild(inp); wrap.appendChild(h('span',{class:'unit'},'s'));
    sheet.appendChild(wrap);
    const toggleRow = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
    toggleRow.appendChild(h('span',{class:'setting-label'},'Automaticky spustiť po sérii'));
    toggleRow.appendChild(makeToggle('restAutoStart'));
    sheet.appendChild(toggleRow);
  });
}

function openProgressionModal() {
  settingsModal('Progresívne preťaženie', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Kedy ti appka navrhne pridať váhu?'));
    const rules = [['all_sets','Po dosiahnutí horného rozsahu na všetkých sériách'],['any_set','Po dosiahnutí horného rozsahu aspoň raz'],['aggressive','Skúsiť pridať každý tréning'],['off','Vypnuté (žiadne návrhy)']];
    rules.forEach(([k,label])=>{
      const row = h('div',{class:'select-card'+(PROFILE.progRule===k?' selected':''),
        onClick:()=>{
          saveProfile({progRule:k});
          sheet.querySelectorAll('.select-card').forEach(c=>c.className='select-card');
          row.className='select-card selected';
          row.querySelector('.check-dot')?.remove() || row.appendChild(h('div',{class:'check-dot'},'✓'));
        }});
      row.appendChild(h('div',{class:'label'},[h('div',{class:'label-main',style:'font-size:13px'},label)]));
      if (PROFILE.progRule===k) row.appendChild(h('div',{class:'check-dot'},'✓'));
      sheet.appendChild(row);
    });
    sheet.appendChild(h('label',{class:'input-label',style:'margin-top:8px'},`Prírastok – vrch tela (${weightUnit()})`));
    const w1=h('div',{class:'input-wrap'});
    const i1=h('input',{type:'number',inputmode:'decimal',value:displayWeight(PROFILE.progStepUpper||2.5)});
    i1.addEventListener('change',(e)=>saveProfile({progStepUpper:inputToKg(e.target.value)}));
    w1.appendChild(i1); sheet.appendChild(w1);
    sheet.appendChild(h('label',{class:'input-label'},`Prírastok – nohy (${weightUnit()})`));
    const w2=h('div',{class:'input-wrap'});
    const i2=h('input',{type:'number',inputmode:'decimal',value:displayWeight(PROFILE.progStepLower||5)});
    i2.addEventListener('change',(e)=>saveProfile({progStepLower:inputToKg(e.target.value)}));
    w2.appendChild(i2); sheet.appendChild(w2);
  });
}

function openAdvancedModal() {
  settingsModal('Pokročilé nastavenia', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Pre skúsenejších cvičencov.'));
    const row = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
    const lbl = h('div',{style:'flex:1'});
    lbl.appendChild(h('div',{class:'setting-label'},'Zobrazovať RIR'));
    lbl.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;margin-top:3px;line-height:1.4'},'RIR (Reps In Reserve) = koľko opakovaní by si ešte zvládol. Napr. RIR 2 znamená, že si mohol spraviť ešte 2 opakovania.'));
    row.appendChild(lbl);
    row.appendChild(makeToggle('showRIR'));
    sheet.appendChild(row);
  });
}

function openNotifModal() {
  settingsModal('Notifikácie', (sheet)=>{
    const supported = ('Notification' in window);
    if (!supported) {
      sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px'},'Tvoj prehliadač nepodporuje notifikácie. Na iPhone pridaj appku na plochu, aby fungovali.'));
      return;
    }
    const perm = Notification.permission;
    if (perm==='denied') {
      sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:10px'},'Notifikácie sú zablokované na úrovni systému.'));
      sheet.appendChild(h('p',{style:'color:var(--txtFaint);font-size:12px;line-height:1.5'},'Povoľ ich v Nastaveniach telefónu → Safari (alebo Chrome) → Webové stránky → ForgeX → Notifikácie, potom sa vráť sem.'));
    } else if (perm!=='granted') {
      sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Povoľ notifikácie, aby ťa appka upozornila keď skončí prestávka.'));
      const btn = h('button',{class:'btn btn-primary'},'🔔 Povoliť notifikácie');
      btn.addEventListener('click', async ()=>{
        btn.disabled = true;
        btn.textContent = 'Čakám na povolenie...';
        await requestNotifPermission();
        // Po vyriešení (granted/denied) prekresli modal nanovo - nezatvárať predčasne
        closeModal();
        openNotifModal();
      });
      sheet.appendChild(btn);
    } else {
      const toggleRow = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
      toggleRow.appendChild(h('span',{class:'setting-label'},'Upozornenie po prestávke'));
      toggleRow.appendChild(makeToggle('notifRest'));
      sheet.appendChild(toggleRow);
      const toggleRow2 = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
      toggleRow2.appendChild(h('span',{class:'setting-label'},'Denná pripomienka tréningu'));
      toggleRow2.appendChild(makeToggle('notifDaily'));
      sheet.appendChild(toggleRow2);
      sheet.appendChild(h('p',{style:'color:var(--txtFaint);font-size:11px;margin-top:10px;line-height:1.5'},'Notifikácie sú povolené na úrovni systému. Vypnutím prepínačov hore appka jednoducho neposiela upozornenia, aj keď povolenie zostáva platné.'));
    }
  });
}

function openPromoModal() {
  settingsModal('Promo kód', (sheet)=>{
    if (PROFILE.promoCode) {
      sheet.appendChild(h('div',{class:'card card-accent',style:'margin-bottom:14px'},[
        h('div',{style:'color:var(--txtDim);font-size:12px'},'Aktívny kód'),
        h('div',{style:'color:var(--pri);font-size:18px;font-weight:800;margin-top:2px'},PROFILE.promoCode),
        PROFILE.premium ? h('div',{style:'color:var(--green);font-size:12px;margin-top:6px'},'✓ Reklamy vypnuté') : null,
      ]));
      sheet.appendChild(h('button',{class:'btn btn-ghost',style:'color:var(--red)', onClick:()=>{ saveProfile({promoCode:null, premium:false}); closeModal(); openPromoModal(); }},'Odstrániť kód'));
      return;
    }
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Zadaj promo kód ak ho máš.'));
    const errEl = h('p',{style:'color:var(--red);font-size:13px;margin-bottom:10px;display:none'});
    sheet.appendChild(errEl);
    const wrap = h('div',{class:'input-wrap'});
    const inp = h('input',{type:'text',placeholder:'napr. FORGEX-NOADS',id:'promo-input', style:'text-transform:uppercase'});
    wrap.appendChild(inp);
    sheet.appendChild(wrap);
    sheet.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{
      const val = (document.getElementById('promo-input')?.value||'').trim().toUpperCase();
      if (!val) return;
      const promo = PROMO_CODES[val];
      if (!promo) { errEl.textContent='Neplatný kód.'; errEl.style.display='block'; return; }
      saveProfile({promoCode:val, ...promo});
      closeModal();
      showToast(promo.premium ? '✓ Reklamy vypnuté' : '✓ Kód uplatnený');
      render();
    }},'Uplatniť kód'));
  });
}

function themeSwatch(key, name, emoji, priColor, bgColor) {
  const active = (PROFILE.theme||'auto')===key;
  const wrapEl = h('div',{class:'theme-swatch-wrap'});
  const swatch = h('div',{
    class:'theme-swatch',
    style:`background:${bgColor};border-color:${active?priColor:'transparent'}`,
    onClick:()=>{ vibrate(); saveProfile({theme:key}); render(); }
  });
  swatch.appendChild(h('div',{class:'theme-swatch-dot',style:`background:${priColor}`}));
  swatch.appendChild(h('span',{style:'font-size:16px'},emoji));
  wrapEl.appendChild(swatch);
  wrapEl.appendChild(h('div',{class:'theme-swatch-name',style:active?`color:${priColor}`:''},name));
  return wrapEl;
}

// ═══════════════════════════ SPLIT BUILDER ═════════════════════════════

let splitEditingId = null;   // ID splitu ktorý sa práve edituje (v split_edit_day)
let splitEditingDayId = null; // ID konkrétneho dňa v rámci splitu, ktorý sa edituje
let newSplitDaysCount = 3;    // vybraný počet dní v split_new
let splitDraft = null;        // vygenerovaný návrh splitu čakajúci na potvrdenie (split_preview)

function backToTraining() {
  activeTab = 'training';
  navigate('home');
}

// ═══════════════════════════ WORKOUT MÓD ═══════════════════════════════
let workoutModeDayId = null;
let workoutModeExIdx = 0;

// ═══════════════════════════ HOME CUSTOMIZE ═════════════════════════════
function renderHomeCustomize() {
  const screen = h('div',{class:'screen'});
  const top = h('div',{style:'padding:calc(var(--safeT) + 16px) var(--pad) 16px;display:flex;align-items:center;gap:12px;border-bottom:0.5px solid var(--border)'});
  top.appendChild(h('button',{class:'icon-btn', onClick:()=>{ activeTab='home'; navigate('home'); }},'←'));
  top.appendChild(h('h2',{},'Domovská obrazovka'));
  screen.appendChild(top);

  const scroll = h('div',{class:'scroll'});
  scroll.appendChild(h('p',{class:'subtitle',style:'margin-bottom:16px'},'Zapni, vypni alebo presuň sekcie. "Dnešný tréning" je vždy zapnutý.'));

  // Aktívne sekcie (v poradí) + neaktívne (na konci, sivé)
  const layout = [...(PROFILE.homeLayout && PROFILE.homeLayout.length ? PROFILE.homeLayout : DEFAULT_PROFILE.homeLayout)];
  const allKeys = Object.keys(HOME_SECTIONS_META);
  const inactiveKeys = allKeys.filter(k=>!layout.includes(k));

  scroll.appendChild(h('p',{class:'section-title'},'ZAPNUTÉ SEKCIE (poradie zhora nadol)'));
  const activeList = h('div',{id:'home-active-list'});
  scroll.appendChild(activeList);

  scroll.appendChild(h('p',{class:'section-title'},'VYPNUTÉ'));
  const inactiveList = h('div',{id:'home-inactive-list'});
  scroll.appendChild(inactiveList);

  function renderLists() {
    activeList.innerHTML=''; inactiveList.innerHTML='';
    layout.forEach((key,idx)=>{
      const meta = HOME_SECTIONS_META[key];
      if (!meta) return;
      const row = h('div',{class:'ex-card', style:'margin-bottom:8px'});
      const inner = h('div',{style:'display:flex;align-items:center;gap:10px;padding:12px 14px'});
      inner.appendChild(h('div',{style:'font-size:18px'},meta.icon));
      inner.appendChild(h('div',{style:'flex:1;color:var(--txt);font-weight:600;font-size:14px'},meta.label));
      if (idx>0) {
        inner.appendChild(h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px', onClick:()=>{
          [layout[idx-1],layout[idx]]=[layout[idx],layout[idx-1]];
          saveProfile({homeLayout:[...layout]}); renderLists();
        }},'↑'));
      }
      if (idx<layout.length-1) {
        inner.appendChild(h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px', onClick:()=>{
          [layout[idx+1],layout[idx]]=[layout[idx],layout[idx+1]];
          saveProfile({homeLayout:[...layout]}); renderLists();
        }},'↓'));
      }
      if (meta.removable) {
        inner.appendChild(h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px;color:var(--red)', onClick:()=>{
          layout.splice(idx,1);
          saveProfile({homeLayout:[...layout]}); renderLists();
        }},'✕'));
      } else {
        inner.appendChild(h('span',{style:'color:var(--txtFaint);font-size:10px;padding:0 4px'},'vždy zapnuté'));
      }
      row.appendChild(inner);
      activeList.appendChild(row);
    });

    const currentInactive = allKeys.filter(k=>!layout.includes(k));
    if (!currentInactive.length) {
      inactiveList.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:16px'},'Všetky sekcie sú zapnuté'));
    }
    currentInactive.forEach(key=>{
      const meta = HOME_SECTIONS_META[key];
      const row = h('div',{class:'ex-card', style:'margin-bottom:8px;opacity:.55'});
      const inner = h('div',{style:'display:flex;align-items:center;gap:10px;padding:12px 14px'});
      inner.appendChild(h('div',{style:'font-size:18px'},meta.icon));
      inner.appendChild(h('div',{style:'flex:1;color:var(--txtDim);font-weight:600;font-size:14px'},meta.label));
      inner.appendChild(h('button',{class:'btn btn-outline btn-sm', onClick:()=>{
        layout.push(key);
        saveProfile({homeLayout:[...layout]}); renderLists();
      }},'+ Zapnúť'));
      row.appendChild(inner);
      inactiveList.appendChild(row);
    });
  }
  renderLists();

  // Reset na predvolené
  scroll.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:8px', onClick:()=>{
    saveProfile({homeLayout:[...DEFAULT_PROFILE.homeLayout]});
    layout.length=0; layout.push(...DEFAULT_PROFILE.homeLayout);
    renderLists();
    showToast('✓ Obnovené predvolené');
  }},'Obnoviť predvolené poradie'));

  screen.appendChild(scroll);

  const bottom = h('div',{style:'padding:16px var(--pad) calc(var(--safeB) + 16px)'});
  bottom.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{ activeTab='home'; navigate('home'); }},'Hotovo'));
  screen.appendChild(bottom);

  return screen;
}

function renderWorkoutMode() {
  const days = getActiveDays();
  const day = days.find(d=>d.id===workoutModeDayId);
  const screen = h('div',{class:'screen'});

  if (!day || !day.exercises.length) {
    activeTab='training'; navigate('home'); return screen;
  }

  if (workoutModeExIdx >= day.exercises.length) workoutModeExIdx = day.exercises.length-1;
  if (workoutModeExIdx < 0) workoutModeExIdx = 0;
  const ex = day.exercises[workoutModeExIdx];
  const sess = (SESSION[day.id]||{})[ex.id] || {};

  const top = h('div',{style:'padding:calc(var(--safeT) + 14px) var(--pad) 14px;background:var(--surf);border-bottom:1px solid var(--border);flex-shrink:0'});
  const topRow = h('div',{style:'display:flex;align-items:center;justify-content:space-between'});
  topRow.appendChild(h('button',{class:'icon-btn', onClick:()=>{ stopRestTimer(); activeTab='training'; navigate('home'); }},'✕'));
  topRow.appendChild(h('div',{style:'color:var(--txt);font-weight:800;font-size:15px'}, day.title));
  const dots = h('div',{style:'display:flex;gap:4px'});
  day.exercises.forEach((e,i)=>{
    const dn = isExDone(day.id,e);
    dots.appendChild(h('div',{style:`width:7px;height:7px;border-radius:50%;background:${i===workoutModeExIdx?'var(--pri)':(dn?'var(--green)':'var(--surf3)')}`}));
  });
  topRow.appendChild(dots);
  top.appendChild(topRow);
  screen.appendChild(top);

  const scroll = h('div',{class:'scroll',style:'display:flex;flex-direction:column'});

  scroll.appendChild(h('div',{style:'color:var(--txtDim);font-size:12px;font-weight:600;margin-bottom:4px'}, `Cvik ${workoutModeExIdx+1} z ${day.exercises.length}`));
  scroll.appendChild(h('div',{style:'color:var(--pri);font-size:24px;font-weight:800;line-height:1.1;margin-bottom:6px'}, ex.name));
  scroll.appendChild(h('div',{style:'color:var(--txtDim);font-size:13px;margin-bottom:2px'}, `Cieľ: ${ex.sets} série × ${ex.reps} opakovaní · ${MUSCLE_LABELS[ex.muscle]||''}`+(exRestLabel(ex)?` · pauza ${exRestLabel(ex)}`:'')));
  scroll.appendChild(h('div',{class:'ex-note',style:'padding:10px 0 16px 0'}, ex.note));

  const suggestion = suggestProgression(ex);
  if (suggestion) {
    scroll.appendChild(h('div',{class:'prog-hint',style:'margin-bottom:14px'}, '📈 ' + suggestion.reason));
  }

  const targetReps = parseBottomReps(ex.reps) || 8;
  const suggestedWeight = suggestion ? suggestion.weight : null;
  const suggestedReps = suggestion ? suggestion.reps : targetReps;

  // ── Rozcvičovacie série (warm-up) – rovnaký princíp ako v normálnom zobrazení ──
  const exRankWO = exerciseOrderRank(ex);
  const warmupSuggestedByDefaultWO = exRankWO <= 2;
  const warmupKeyWO = `warmup_${ex.id}`;
  if (!PROFILE.warmupOverrides) PROFILE.warmupOverrides = {};
  const warmupOverrideWO = PROFILE.warmupOverrides[warmupKeyWO];
  const showWarmupWO = warmupOverrideWO!=null ? warmupOverrideWO : warmupSuggestedByDefaultWO;
  const refWeightWO = suggestedWeight!=null ? suggestedWeight : (sess.sets?.[0]?.weight ? parseFloat(sess.sets[0].weight) : null);

  const warmupWrapWO = h('div',{style:'margin-bottom:14px'});
  const warmupToggleRowWO = h('div',{style:'display:flex;align-items:center;gap:8px;margin-bottom:8px'});
  warmupToggleRowWO.appendChild(h('span',{style:'font-size:12px;color:var(--txtDim);flex:1'},'🔥 Rozcvičovacie série'));
  const wTgWO = h('button',{class:'toggle'+(showWarmupWO?' on':''), style:'transform:scale(.8)'});
  wTgWO.appendChild(h('div',{class:'toggle-knob'}));
  wTgWO.addEventListener('click',()=>{
    PROFILE.warmupOverrides[warmupKeyWO] = !showWarmupWO;
    saveProfile({warmupOverrides:PROFILE.warmupOverrides});
    render();
  });
  warmupToggleRowWO.appendChild(wTgWO);
  warmupWrapWO.appendChild(warmupToggleRowWO);
  if (showWarmupWO && refWeightWO) {
    const setsWO = calcWarmupSets(refWeightWO);
    const wuCardWO = h('div',{class:'card',style:'background:var(--surf2);padding:10px 12px'});
    setsWO.forEach(s=>{
      wuCardWO.appendChild(h('div',{style:'display:flex;justify-content:space-between;font-size:12px;padding:3px 0'},[
        h('span',{style:'color:var(--txtFaint)'},`${s.pct}%`),
        h('span',{style:'color:var(--txt);font-weight:600'},`${displayWeight(s.weight)} ${weightUnit()} × ${s.reps}`),
      ]));
    });
    warmupWrapWO.appendChild(wuCardWO);
  }
  scroll.appendChild(warmupWrapWO);

  for (let si=0; si<ex.sets; si++) {
    const s = (sess.sets||[])[si] || {};
    const isDone = !!s.done;
    const wVal = s.weight!=null && s.weight!=='' ? displayWeight(parseFloat(s.weight)) : (suggestedWeight!=null ? displayWeight(suggestedWeight) : '');
    const rVal = s.reps!=null && s.reps!=='' ? s.reps : suggestedReps;

    const block = h('div',{class:'set-block'+(isDone?' done':'')});
    const topB = h('div',{class:'set-block-top'});
    topB.appendChild(h('div',{class:'set-block-label'}, `Séria ${si+1}`));
    block.appendChild(topB);
    const fields = h('div',{class:'set-fields'});

    const wStep = progStepForMuscle(ex.muscle);
    const wStepper = h('div',{class:'stepper'});
    wStepper.appendChild(h('div',{class:'stepper-label'}, `Váha (${weightUnit()})`));
    const wRow = h('div',{class:'stepper-row'});
    wRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'weight',-wStep)},'−'));
    wRow.appendChild(h('input',{class:'stepper-val',type:'number',inputmode:'decimal',value:wVal,placeholder:'0',id:`w-${ex.id}-${si}`,
      onChange:(e)=>{ setSetVal(day.id,ex.id,si,'weight', inputToKg(e.target.value)); }}));
    wRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'weight',wStep)},'+'));
    wStepper.appendChild(wRow);
    fields.appendChild(wStepper);

    const rStepper = h('div',{class:'stepper'});
    rStepper.appendChild(h('div',{class:'stepper-label'}, 'Opakovania'));
    const rRow = h('div',{class:'stepper-row'});
    rRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'reps',-1)},'−'));
    rRow.appendChild(h('input',{class:'stepper-val',type:'number',inputmode:'numeric',value:rVal,placeholder:'0',id:`r-${ex.id}-${si}`,
      onChange:(e)=>{ setSetVal(day.id,ex.id,si,'reps', e.target.value); }}));
    rRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'reps',1)},'+'));
    rStepper.appendChild(rRow);
    fields.appendChild(rStepper);

    const checkBtn = h('button',{class:'set-check-lg'+(isDone?' done':''), onClick:()=>{
      const curW = document.getElementById(`w-${ex.id}-${si}`)?.value || wVal;
      const curR = document.getElementById(`r-${ex.id}-${si}`)?.value || rVal;
      completeSet(day.id, ex.id, si, curW, curR, ex.rest);
    }},'✓');
    fields.appendChild(checkBtn);
    block.appendChild(fields);
    scroll.appendChild(block);
  }

  screen.appendChild(scroll);

  const bottom = h('div',{style:'padding:12px var(--pad) calc(var(--safeB) + 12px);background:var(--surf);border-top:1px solid var(--border);display:flex;gap:10px;flex-shrink:0'});
  const prevBtn = h('button',{class:'btn btn-outline',style:'flex:1', onClick:()=>{
    if (workoutModeExIdx>0) { workoutModeExIdx--; stopRestTimer(); render(); }
  }},'← Predošlý');
  if (workoutModeExIdx===0) prevBtn.disabled = true;
  bottom.appendChild(prevBtn);

  const isLast = workoutModeExIdx === day.exercises.length-1;
  if (isLast) {
    bottom.appendChild(h('button',{class:'btn btn-primary',style:'flex:1;background:var(--green)', onClick:()=>{
      stopRestTimer(); finishWorkout(day);
    }},'✓ Ukončiť'));
  } else {
    bottom.appendChild(h('button',{class:'btn btn-primary',style:'flex:1', onClick:()=>{
      workoutModeExIdx++; stopRestTimer(); render();
    }},'Ďalší cvik →'));
  }
  screen.appendChild(bottom);

  return screen;
}

function renderSplitManage() {
  const screen = h('div', {class:'screen'});
  const top = h('div', {style:'padding:calc(var(--safeT) + 16px) 20px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)'});
  top.appendChild(h('button',{class:'icon-btn', onClick:backToTraining},'←'));
  top.appendChild(h('h2',{},'Moje splits'));
  screen.appendChild(top);

  const scroll = h('div',{class:'scroll'});

  if (!CUSTOM_SPLITS.length) {
    scroll.appendChild(h('div',{class:'card',style:'text-align:center;padding:24px;margin-bottom:14px'},[
      h('div',{style:'color:var(--txtDim);font-size:13px'},'Zatiaľ nemáš žiadny split. Vytvor si svoj prvý tréningový plán nižšie.'),
    ]));
  }

  // Vlastné splits
  CUSTOM_SPLITS.forEach(split=>{
    const isActive = ACTIVE_SPLIT_ID===split.id;
    const card = h('div',{class:'card'+(isActive?' card-accent':''), style:'margin-bottom:10px'});
    const topRow = h('div',{style:'display:flex;align-items:center;justify-content:space-between;cursor:pointer', onClick:()=>{ ACTIVE_SPLIT_ID=split.id; saveActiveSplitId(); render(); }});
    topRow.appendChild(h('div',{},[
      h('div',{style:'color:var(--txt);font-weight:700;font-size:15px'},split.name),
      h('div',{style:'color:var(--txtDim);font-size:12px;margin-top:3px'},`${split.daysPerWeek} dní/týždeň · ${split.days.map(d=>d.title).join(' / ')}`),
    ]));
    if (isActive) topRow.appendChild(h('span',{class:'check-dot'},'✓'));
    card.appendChild(topRow);

    const actionsRow = h('div',{style:'display:flex;gap:8px;margin-top:12px'});
    actionsRow.appendChild(h('button',{class:'btn btn-outline btn-sm', style:'flex:1', onClick:(e)=>{ e.stopPropagation(); splitEditingId=split.id; navigate('split_edit_day'); }},'✏️ Upraviť'));
    actionsRow.appendChild(h('button',{class:'btn btn-outline btn-sm', style:'flex:1;color:var(--red)', onClick:(e)=>{
      e.stopPropagation();
      if (!confirm(`Naozaj zmazať split "${split.name}"?`)) return;
      CUSTOM_SPLITS = CUSTOM_SPLITS.filter(s=>s.id!==split.id);
      saveSplits();
      if (ACTIVE_SPLIT_ID===split.id) { ACTIVE_SPLIT_ID=null; saveActiveSplitId(); }
      render();
    }},'🗑 Zmazať'));
    card.appendChild(actionsRow);
    scroll.appendChild(card);
  });

  screen.appendChild(scroll);

  const bottom = h('div',{class:'safe-bot',style:'padding:16px 20px'});
  bottom.appendChild(h('button',{class:'btn btn-primary', onClick:()=>navigate('split_new')},'+ Vytvoriť nový split'));
  screen.appendChild(bottom);

  return screen;
}

// ═══════════════════════════ LOADING PLAN (D2) ══════════════════════════
// Stav pripravovaného splitu - parametre uložené pred spustením loading animácie
let pendingSplitDays = null;
let pendingSplitGender = null;

function startSplitGeneration(daysCount, gender) {
  pendingSplitDays = daysCount;
  pendingSplitGender = gender;
  navigate('loading_plan');
}

const LOADING_STEPS = [
  'Analyzujem tvoj cieľ...',
  'Vyberám vhodné cviky...',
  'Vyvažujem svalové skupiny...',
  'Kovám tvoj plán...',
  'Posledné úpravy...',
];

function renderLoadingPlan() {
  const screen = h('div',{class:'screen'});
  const wrap = h('div',{class:'lp-wrap'});

  const glow = h('div',{class:'lp-anvil-glow'});
  glow.appendChild(h('div',{class:'lp-ring r1'}));
  glow.appendChild(h('div',{class:'lp-ring r2'}));
  glow.appendChild(h('div',{class:'lp-ring r3'}));
  glow.appendChild(h('div',{class:'lp-hammer'},'🔨'));
  wrap.appendChild(glow);

  wrap.appendChild(h('div',{class:'lp-title'},'Pripravujem tvoj plán'));
  const stepEl = h('div',{class:'lp-step', id:'lp-step-text'}, LOADING_STEPS[0]);
  wrap.appendChild(stepEl);

  const track = h('div',{class:'lp-progress-track'});
  const fill = h('div',{class:'lp-progress-fill', id:'lp-progress-fill'});
  track.appendChild(fill);
  wrap.appendChild(track);

  screen.appendChild(wrap);

  // Po vykreslení spusti animáciu krokov a na konci vygeneruj reálny split
  setTimeout(()=>runLoadingSequence(), 30);

  return screen;
}

function runLoadingSequence() {
  const totalDuration = 2200; // ms
  const stepCount = LOADING_STEPS.length;
  const stepDuration = totalDuration / stepCount;

  LOADING_STEPS.forEach((text, i)=>{
    setTimeout(()=>{
      const stepEl = document.getElementById('lp-step-text');
      const fillEl = document.getElementById('lp-progress-fill');
      if (stepEl) { stepEl.style.opacity=0; setTimeout(()=>{ stepEl.textContent=text; stepEl.style.opacity=1; },150); }
      if (fillEl) fillEl.style.width = `${Math.round(((i+1)/stepCount)*100)}%`;
    }, i*stepDuration);
  });

  setTimeout(()=>{
    // Vygeneruj reálny návrh splitu a prejdi na náhľad
    splitDraft = generateSplitFromTemplate(pendingSplitDays, pendingSplitGender);
    navigate('split_preview');
  }, totalDuration + 250);
}

function renderSplitNew() {
  const screen = h('div', {class:'screen'});
  const top = h('div', {style:'padding:calc(var(--safeT) + 16px) var(--pad) 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)'});
  // Počas onboardingu (žiadny split, žiadna história) ide späť na výsledky; inak na správu splitov
  const isOnboardingContext = !CUSTOM_SPLITS.length && !HISTORY.length;
  top.appendChild(h('button',{class:'icon-btn', onClick:()=>{
    isOnboardingContext ? navigate('ob_results') : navigate('split_manage');
  }},'←'));
  top.appendChild(h('h2',{},'Nový split'));
  screen.appendChild(top);

  const scroll = h('div',{class:'scroll'});
  scroll.appendChild(h('p',{class:'subtitle'},'Vyber koľko dní týždenne chceš cvičiť. Appka navrhne osvedčený split a predvyplní cviky.'));

  const grid = h('div',{style:'display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:20px'});
  for (let n=1;n<=7;n++) {
    const btn = h('button',{
      class:'btn '+(newSplitDaysCount===n?'btn-primary':'btn-outline'),
      style:'aspect-ratio:1;padding:0;font-size:18px',
      onClick:()=>{ newSplitDaysCount=n; render(); }
    }, String(n));
    grid.appendChild(btn);
  }
  scroll.appendChild(grid);

  const tpl = getTemplate(newSplitDaysCount, PROFILE.gender);
  const previewCard = h('div',{class:'card card-accent',style:'margin-top:20px'});
  previewCard.appendChild(h('div',{style:'color:var(--txtDim);font-size:12px'},'Navrhovaný typ splitu'+(PROFILE.gender==='female'?' (ženský)':'')));
  previewCard.appendChild(h('div',{style:'color:var(--pri);font-size:18px;font-weight:800;margin-top:4px'},tpl.name));
  const dayList = h('div',{style:'margin-top:10px;display:flex;flex-direction:column;gap:6px'});
  tpl.days.forEach(d=>{
    dayList.appendChild(h('div',{style:'display:flex;justify-content:space-between;font-size:13px'},[
      h('span',{style:'color:var(--txt);font-weight:600'},d.title),
      h('span',{style:'color:var(--txtDim)'},d.subtitle),
    ]));
  });
  previewCard.appendChild(dayList);
  scroll.appendChild(previewCard);

  screen.appendChild(scroll);

  const bottom = h('div',{style:'padding:16px var(--pad) calc(var(--safeB) + 16px);display:flex;flex-direction:column;gap:10px'});
  bottom.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{
    startSplitGeneration(newSplitDaysCount, PROFILE.gender);
  }},'Zobraziť návrh s cvikmi'));
  screen.appendChild(bottom);

  return screen;
}

const WEEKDAYS = [
  {key:1,short:'Po',name:'Pondelok'},
  {key:2,short:'Ut',name:'Utorok'},
  {key:3,short:'St',name:'Streda'},
  {key:4,short:'Št',name:'Štvrtok'},
  {key:5,short:'Pi',name:'Piatok'},
  {key:6,short:'So',name:'Sobota'},
  {key:0,short:'Ne',name:'Nedeľa'},
];

function renderSplitPreview() {
  if (!splitDraft) { navigate('split_new'); return h('div',{class:'screen'}); }
  const screen = h('div', {class:'screen'});
  const top = h('div', {style:'padding:calc(var(--safeT) + 16px) var(--pad) 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)'});
  top.appendChild(h('button',{class:'icon-btn', onClick:()=>navigate('split_new')},'←'));
  top.appendChild(h('h2',{},'Návrh splitu'));
  screen.appendChild(top);

  const scroll = h('div',{class:'scroll'});
  scroll.appendChild(h('div',{style:'color:var(--pri);font-size:20px;font-weight:800'},splitDraft.name));
  scroll.appendChild(h('p',{class:'subtitle',style:'margin-top:4px'},'Toto je návrh. Súhlasíš s ním, alebo si chceš cviky upraviť?'));

  // Každý deň s konkrétnymi cvikmi + priradenie dňa týždňa
  splitDraft.days.forEach((day, di)=>{
    const dayCard = h('div',{class:'card',style:'margin-top:14px'});
    dayCard.appendChild(h('div',{style:'display:flex;align-items:center;justify-content:space-between;margin-bottom:4px'},[
      h('div',{style:'color:var(--txt);font-weight:800;font-size:16px'},`${day.label} · ${day.title}`),
    ]));
    dayCard.appendChild(h('div',{style:'color:var(--txtDim);font-size:12px;margin-bottom:10px'},day.subtitle));

    // Priradenie dňa týždňa
    const weekdayRow = h('div',{style:'display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px'});
    WEEKDAYS.forEach(wd=>{
      const selected = day.weekday===wd.key;
      const btn = h('button',{
        class:'btn btn-sm',
        style:`flex:1;min-width:38px;padding:7px 0;background:${selected?'var(--pri)':'var(--surf3)'};color:${selected?'#fff':'var(--txtDim)'}`,
        onClick:()=>{
          // Zruš ten istý deň u iných dní (jeden weekday = jeden tréning)
          splitDraft.days.forEach(d=>{ if(d.weekday===wd.key) d.weekday=null; });
          day.weekday = selected ? null : wd.key;
          render();
        }
      }, wd.short);
      weekdayRow.appendChild(btn);
    });
    dayCard.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;margin-bottom:4px'},'Deň v týždni (voliteľné):'));
    dayCard.appendChild(weekdayRow);

    // Zoznam cvikov
    day.exercises.forEach((ex,i)=>{
      const exRow = h('div',{style:'display:flex;align-items:center;gap:10px;padding:6px 0'+(i<day.exercises.length-1?';border-bottom:1px solid var(--border)':'')});
      exRow.appendChild(h('div',{class:'ex-num',style:'width:22px;height:22px;font-size:10px'},String(i+1)));
      const info = h('div',{style:'flex:1'});
      info.appendChild(h('div',{style:'color:var(--txt);font-size:13px;font-weight:500'},ex.name));
      info.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px'},`${ex.sets}× ${ex.reps}`));
      exRow.appendChild(info);
      dayCard.appendChild(exRow);
    });

    scroll.appendChild(dayCard);
  });

  screen.appendChild(scroll);

  const bottom = h('div',{style:'padding:16px var(--pad) calc(var(--safeB) + 16px);display:flex;flex-direction:column;gap:10px'});
  bottom.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{
    // Súhlasím – ulož split tak ako je
    CUSTOM_SPLITS.push(splitDraft);
    saveSplits();
    ACTIVE_SPLIT_ID = splitDraft.id;
    saveActiveSplitId();
    splitDraft = null;
    backToTraining();
  }},'✓ Súhlasím, použiť tento split'));
  bottom.appendChild(h('button',{class:'btn btn-outline', onClick:()=>{
    // Chcem upraviť – ulož a otvor editor
    CUSTOM_SPLITS.push(splitDraft);
    saveSplits();
    ACTIVE_SPLIT_ID = splitDraft.id;
    saveActiveSplitId();
    splitEditingId = splitDraft.id;
    splitDraft = null;
    navigate('split_edit_day');
  }},'✏️ Chcem upraviť cviky'));
  screen.appendChild(bottom);

  return screen;
}

function renderSplitEditDay() {
  const split = CUSTOM_SPLITS.find(s=>s.id===splitEditingId);
  const screen = h('div', {class:'screen'});

  if (!split) {
    const top = h('div', {style:'padding:calc(var(--safeT) + 16px) var(--pad) 16px;display:flex;align-items:center;gap:12px'});
    top.appendChild(h('button',{class:'icon-btn', onClick:()=>navigate('split_manage')},'←'));
    top.appendChild(h('h2',{},'Split nenájdený'));
    screen.appendChild(top);
    return screen;
  }

  if (!splitEditingDayId || !split.days.find(d=>d.id===splitEditingDayId)) {
    splitEditingDayId = split.days[0]?.id;
  }

  const top = h('div', {style:'padding:calc(var(--safeT) + 16px) var(--pad) 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)'});
  top.appendChild(h('button',{class:'icon-btn', onClick:()=>navigate('split_manage')},'←'));
  const titleWrap = h('div',{style:'flex:1'});
  const nameInput = h('input',{value:split.name, style:'background:transparent;border:none;outline:none;color:var(--txt);font-size:18px;font-weight:800;width:100%',
    onChange:(e)=>{ split.name=e.target.value; saveSplits(); }});
  titleWrap.appendChild(nameInput);
  top.appendChild(titleWrap);
  screen.appendChild(top);

  const dayTabs = h('div',{style:'display:flex;gap:6px;padding:14px var(--pad);overflow-x:auto'});
  split.days.forEach(d=>{
    const btn = h('button',{class:'btn btn-sm', style:`flex-shrink:0;background:${splitEditingDayId===d.id?'var(--pri)':'var(--surf3)'};color:${splitEditingDayId===d.id?'#fff':'var(--txtDim)'}`,
      onClick:()=>{ splitEditingDayId=d.id; render(); }}, d.label);
    dayTabs.appendChild(btn);
  });
  screen.appendChild(dayTabs);

  const day = split.days.find(d=>d.id===splitEditingDayId);
  const scroll = h('div',{class:'scroll',style:'padding-top:0'});

  const dayTitleRow = h('div',{style:'margin-bottom:16px'});
  const dayTitleInput = h('input',{value:day.title, class:'set-input', style:'font-size:16px;font-weight:700;text-align:left;padding:10px 12px;margin-bottom:8px',
    onChange:(e)=>{ day.title=e.target.value; saveSplits(); render(); }});
  const daySubInput = h('input',{value:day.subtitle, class:'set-input', style:'font-size:13px;text-align:left;padding:10px 12px;color:var(--txtDim)',
    onChange:(e)=>{ day.subtitle=e.target.value; saveSplits(); }});
  dayTitleRow.appendChild(h('label',{class:'input-label'},'Názov dňa'));
  dayTitleRow.appendChild(dayTitleInput);
  dayTitleRow.appendChild(h('label',{class:'input-label',style:'margin-top:8px'},'Podtitul'));
  dayTitleRow.appendChild(daySubInput);
  scroll.appendChild(dayTitleRow);

  // Priradenie dňa v týždni
  scroll.appendChild(h('label',{class:'input-label'},'Deň v týždni (voliteľné)'));
  const weekdayRow = h('div',{style:'display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px'});
  WEEKDAYS.forEach(wd=>{
    const selected = day.weekday===wd.key;
    const btn = h('button',{
      class:'btn btn-sm',
      style:`flex:1;min-width:38px;padding:7px 0;background:${selected?'var(--pri)':'var(--surf3)'};color:${selected?'#fff':'var(--txtDim)'}`,
      onClick:()=>{
        split.days.forEach(d=>{ if(d.weekday===wd.key) d.weekday=null; });
        day.weekday = selected ? null : wd.key;
        saveSplits(); render();
      }
    }, wd.short);
    weekdayRow.appendChild(btn);
  });
  scroll.appendChild(weekdayRow);

  scroll.appendChild(h('p',{class:'section-title'},`CVIKY (${day.exercises.length})`));

  // Upozornenie na nelogické poradie + tlačidlo na auto-zoradenie
  if (day.exercises.length>=2 && hasIllogicalOrder(day.exercises)) {
    const warn = h('div',{class:'card',style:'background:#F59E0B18;border-color:var(--amber);margin-bottom:10px'});
    warn.appendChild(h('div',{style:'color:var(--amber);font-size:12px;font-weight:600;line-height:1.5'},
      '⚠️ Odporúčané poradie: zložené cviky (drep, tlaky, ťahy) na začiatok, izolácie a malé partie na koniec.'));
    warn.appendChild(h('button',{class:'btn btn-sm',style:'margin-top:10px;background:var(--amber);color:#1a1a1a', onClick:()=>{
      day.exercises = sortExercisesByOrder(day.exercises);
      saveSplits(); render();
    }},'↕ Zoradiť automaticky'));
    scroll.appendChild(warn);
  } else if (day.exercises.length>=2) {
    // Poradie je OK – ponúkni tlačidlo na zoradenie aj tak (decentné)
    scroll.appendChild(h('button',{class:'btn btn-ghost btn-sm',style:'margin-bottom:10px;width:100%', onClick:()=>{
      day.exercises = sortExercisesByOrder(day.exercises);
      saveSplits(); render();
    }},'↕ Zoradiť (zložené → izolačné)'));
  }

  if (!day.exercises.length) {
    const empty = h('div',{class:'card', style:'text-align:center;padding:24px'});
    empty.appendChild(h('div',{style:'color:var(--txtDim);font-size:13px'},'Zatiaľ žiadne cviky v tomto dni'));
    scroll.appendChild(empty);
  }

  day.exercises.forEach((ex,idx)=>{
    const row = h('div',{class:'ex-card', style:'margin-bottom:8px'});
    const rowInner = h('div',{style:'display:flex;align-items:center;gap:8px;padding:12px 14px'});
    rowInner.appendChild(h('div',{class:'ex-num'},String(idx+1)));
    const info = h('div',{style:'flex:1;min-width:0'});
    info.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},ex.name));
    info.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:2px'},`${ex.sets}× ${ex.reps} · ${MUSCLE_LABELS[ex.muscle]||''}`+(exRestLabel(ex)?` · ⏱${exRestLabel(ex)}`:'')));
    rowInner.appendChild(info);

    // Tlačidlo VÝMENY cviku za alternatívu z rovnakej partie
    const swapBtn = h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px', onClick:()=>openExerciseSwapModal(day, idx)},'↻');
    const upBtn = h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px', onClick:()=>{
      if (idx===0) return;
      [day.exercises[idx-1],day.exercises[idx]]=[day.exercises[idx],day.exercises[idx-1]];
      saveSplits(); render();
    }},'↑');
    const downBtn = h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px', onClick:()=>{
      if (idx===day.exercises.length-1) return;
      [day.exercises[idx+1],day.exercises[idx]]=[day.exercises[idx],day.exercises[idx+1]];
      saveSplits(); render();
    }},'↓');
    const delBtn = h('button',{class:'btn btn-ghost btn-sm', style:'padding:6px 9px;color:var(--red)', onClick:()=>{
      day.exercises.splice(idx,1); saveSplits(); render();
    }},'✕');
    rowInner.appendChild(swapBtn); rowInner.appendChild(upBtn); rowInner.appendChild(downBtn); rowInner.appendChild(delBtn);
    row.appendChild(rowInner);
    scroll.appendChild(row);
  });

  const addBtn = h('button',{class:'btn btn-outline', style:'margin-top:8px', onClick:()=>openExercisePickerModal(day)},'+ Pridať cvik z knižnice');
  scroll.appendChild(addBtn);

  screen.appendChild(scroll);

  const bottom = h('div',{style:'padding:16px var(--pad) calc(var(--safeB) + 16px)'});
  bottom.appendChild(h('button',{class:'btn btn-primary', onClick:()=>navigate('split_manage')},'Hotovo'));
  screen.appendChild(bottom);

  return screen;
}

// Modal na výmenu cviku za alternatívu z rovnakej svalovej partie
function openExerciseSwapModal(day, exIdx) {
  const currentEx = day.exercises[exIdx];
  const overlay = h('div',{class:'modal-overlay', onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{class:'modal-sheet', style:'max-height:80vh'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:4px'},'Vymeniť cvik'));
  sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'}, `Alternatívy pre: ${MUSCLE_LABELS[currentEx.muscle]||'cvik'}`));

  const alternatives = EXERCISE_LIBRARY.filter(e=>e.muscle===currentEx.muscle && e.id!==currentEx.id);
  alternatives.forEach(ex=>{
    const row = h('div',{class:'card',style:'margin-bottom:8px;display:flex;align-items:center;justify-content:space-between',
      onClick:()=>{
        day.exercises[exIdx] = { id:ex.id, name:ex.name, sets:ex.sets, reps:adjustRepsForGender(ex.reps, PROFILE.gender), note:ex.note, muscle:ex.muscle };
        saveSplits();
        closeModal();
        render();
      }});
    const left = h('div');
    left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},ex.name));
    left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},`${ex.sets}× ${ex.reps} · ${ex.equipment}`));
    row.appendChild(left);
    row.appendChild(h('span',{style:'color:var(--pri);font-size:16px'},'↻'));
    sheet.appendChild(row);
  });
  if (!alternatives.length) sheet.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:20px'},'Žiadne alternatívy v knižnici'));

  sheet.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:8px', onClick:closeModal},'Zavrieť'));
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}

let pickerMuscleFilter = 'all';
function openExercisePickerModal(day) {
  pickerMuscleFilter = 'all'; // reset pri každom otvorení
  const overlay = h('div',{class:'modal-overlay', onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{class:'modal-sheet', style:'max-height:80vh'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:12px'},'Vyber cvik'));

  const filterRow = h('div',{id:'picker-filters', style:'display:flex;gap:6px;overflow-x:auto;padding-bottom:12px;margin-bottom:8px'});
  const allBtn = h('button',{class:'btn btn-sm btn-primary', 'data-filter':'all', style:'flex-shrink:0', onClick:()=>{ pickerMuscleFilter='all'; refreshPicker(); }},'Všetky');
  filterRow.appendChild(allBtn);
  MUSCLE_GROUP_ORDER.forEach(m=>{
    const btn = h('button',{class:'btn btn-sm btn-outline', 'data-filter':m, style:'flex-shrink:0', onClick:()=>{ pickerMuscleFilter=m; refreshPicker(); }}, MUSCLE_LABELS[m]);
    filterRow.appendChild(btn);
  });
  sheet.appendChild(filterRow);

  const listWrap = h('div',{id:'picker-list'});
  sheet.appendChild(listWrap);
  sheet.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:8px', onClick:closeModal},'Zavrieť'));
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);

  function refreshPicker() {
    // Aktualizuj vysvietenie filtračných tlačidiel
    const filters = document.getElementById('picker-filters');
    if (filters) {
      filters.querySelectorAll('button[data-filter]').forEach(b=>{
        const active = b.getAttribute('data-filter')===pickerMuscleFilter;
        b.className = 'btn btn-sm ' + (active?'btn-primary':'btn-outline');
      });
    }
    const list = document.getElementById('picker-list');
    if (!list) return;
    list.innerHTML='';
    const filtered = pickerMuscleFilter==='all' ? EXERCISE_LIBRARY : EXERCISE_LIBRARY.filter(e=>e.muscle===pickerMuscleFilter);
    filtered.forEach(ex=>{
      const row = h('div',{class:'card',style:'margin-bottom:8px;display:flex;align-items:center;justify-content:space-between',
        onClick:()=>{
          day.exercises.push({ id:ex.id, name:ex.name, sets:ex.sets, reps:adjustRepsForGender(ex.reps, PROFILE.gender), note:ex.note, muscle:ex.muscle });
          saveSplits();
          closeModal();
          render();
        }});
      const left = h('div');
      left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},ex.name));
      left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},`${MUSCLE_LABELS[ex.muscle]} · ${ex.sets}× ${ex.reps}`));
      row.appendChild(left);
      row.appendChild(h('span',{style:'color:var(--pri);font-size:18px'},'+'));
      list.appendChild(row);
    });
    if (!filtered.length) list.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px;text-align:center;padding:20px'},'Žiadne cviky v tejto kategórii'));
  }
  refreshPicker();
}

// ═══════════════════════════ REST TIMER ════════════════════════════════
let restTimerInterval = null;
let restTimerRemaining = 0;

function startRestTimer(seconds) {
  stopRestTimer();
  restTimerRemaining = seconds;
  renderRestTimer();
  restTimerInterval = setInterval(()=>{
    restTimerRemaining--;
    if (restTimerRemaining <= 0) {
      stopRestTimer();
      vibrate([200,100,200]);
      if (PROFILE.notifRest) showRestDoneNotification();
    } else {
      updateRestTimerDisplay();
    }
  }, 1000);
}

function stopRestTimer() {
  if (restTimerInterval) { clearInterval(restTimerInterval); restTimerInterval=null; }
  const el = document.getElementById('rest-timer');
  if (el) el.remove();
}

function addRestTime(delta) {
  restTimerRemaining = Math.max(0, restTimerRemaining + delta);
  if (restTimerRemaining===0) { stopRestTimer(); return; }
  updateRestTimerDisplay();
}

function fmtTime(s) {
  const m = Math.floor(s/60);
  const sec = s%60;
  return m>0 ? `${m}:${String(sec).padStart(2,'0')}` : `${sec}s`;
}

function exRestLabel(ex) {
  if (ex.rest===0) return 'superset';
  if (ex.rest!=null) return fmtTime(ex.rest);
  return null;
}

function renderRestTimer() {
  let el = document.getElementById('rest-timer');
  if (el) el.remove();
  el = h('div',{id:'rest-timer'});
  const inner = h('div',{class:'rest-timer-inner'});
  const timeWrap = h('div',{});
  timeWrap.appendChild(h('div',{class:'rest-time',id:'rest-time-val'}, fmtTime(restTimerRemaining)));
  timeWrap.appendChild(h('div',{class:'rest-label'},'Prestávka'));
  inner.appendChild(timeWrap);
  const btns = h('div',{class:'rest-btns'});
  btns.appendChild(h('button',{class:'rest-mini-btn', onClick:()=>addRestTime(-15)},'−15s'));
  btns.appendChild(h('button',{class:'rest-mini-btn', onClick:()=>addRestTime(15)},'+15s'));
  btns.appendChild(h('button',{class:'rest-mini-btn', onClick:()=>stopRestTimer()},'Skip'));
  inner.appendChild(btns);
  el.appendChild(inner);
  document.body.appendChild(el);
}

function updateRestTimerDisplay() {
  const val = document.getElementById('rest-time-val');
  if (val) val.textContent = fmtTime(restTimerRemaining);
  else renderRestTimer();
}

function showRestDoneNotification() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try { new Notification('ForgeX', { body:'Prestávka skončila – späť do akcie! 💪', icon:'icons/icon-192.png' }); } catch(e){}
  }
}

async function requestNotifPermission() {
  if (!('Notification' in window)) { alert('Tvoj prehliadač nepodporuje notifikácie.'); return 'unsupported'; }
  try {
    const perm = await Notification.requestPermission();
    if (perm==='granted') {
      saveProfile({notifRest:true});
      try { new Notification('ForgeX', { body:'Notifikácie zapnuté ✓' }); } catch(e){}
    }
    return perm;
  } catch(e) {
    return 'denied';
  }
}

// Manuálne spustenie časovača (tlačidlo v tréningu)
function manualStartRest() {
  startRestTimer(PROFILE.restSeconds || 90);
}

// ═══════════════════════════ INIT ═══════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

// Generuje malé iskry vyletujúce z loga počas splash animácie
function spawnSparks() {
  const wrap = document.querySelector('.splash-logo-wrap');
  if (!wrap) return;
  for (let i=0;i<20;i++) {
    const spark = document.createElement('div');
    spark.className = 'splash-spark';
    const size = 2 + Math.random()*3;
    const angle = Math.random()*Math.PI*2;
    const dist = 50 + Math.random()*80;
    spark.style.width = size+'px';
    spark.style.height = size+'px';
    spark.style.left = '50%';
    spark.style.top = '50%';
    spark.style.setProperty('--sx', Math.cos(angle)*dist+'px');
    spark.style.setProperty('--sy', Math.sin(angle)*dist+'px');
    const delay = 0.4 + Math.random()*1.1; // rozložené na dlhší úsek
    spark.style.animation = `sparkFly ${0.7+Math.random()*0.6}s ease-out ${delay}s forwards`;
    wrap.appendChild(spark);
  }
}

async function initApp() {
  seedVTaperSplit();   // ← NOVÉ, musí byť pred render()
  // Appka sa vykresľuje "pod" splash screenom, takže keď splash zmizne, je hneď pripravená
  render();
  spawnSparks();
  setTimeout(()=>{ if (document.getElementById('splash')) spawnSparks(); }, 1400); // druhá vlna iskier
  const splash = document.getElementById('splash');
  const SPLASH_DURATION = 2500; // ms – celkový čas zobrazenia splash screenu
  setTimeout(()=>{
    if (!splash) return;
    splash.classList.add('fade-out');
    setTimeout(()=> splash.remove(), 380);
  }, SPLASH_DURATION);

  // Over existujúcu Supabase session (napr. po reštarte appky) a stiahni cloud dáta
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session?.user) {
      CLOUD_USER = data.session.user;
      await pullStateFromCloud();
      currentRoute = PROFILE.onboardingComplete ? 'home' : 'welcome';
    }
  } catch(e) {
    console.error('Cloud session check failed', e);
  }
  render();
}

document.addEventListener('DOMContentLoaded', initApp);
if (document.readyState !== 'loading') initApp();


