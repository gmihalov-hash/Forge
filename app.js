// ════════════════════════════════════════════════════════════════════════
// FORGEX – Kompletná fitness PWA
// ════════════════════════════════════════════════════════════════════════

// ───────────────────────── THEMES ─────────────────────────────────────────
const THEMES = {
  forge:    { name:'Forge',    emoji:'🔥', dark:true,  c:{ bg:'#0A0A0A', surf:'#161616', surf2:'#1F1F1F', surf3:'#2A2A2A', txt:'#F5F5F5', txtDim:'#A0A0A0', txtFaint:'#666666', pri:'#FF6B2B', priDim:'#FF6B2B22', acc:'#FFB800', border:'#FFFFFF14', border2:'#FFFFFF22' } },
  electric: { name:'Electric', emoji:'⚡', dark:true,  c:{ bg:'#0D0D0D', surf:'#161616', surf2:'#1F1F1F', surf3:'#2A2A2A', txt:'#F5F5F5', txtDim:'#A0A0A0', txtFaint:'#666666', pri:'#6C63FF', priDim:'#6C63FF22', acc:'#00D4FF', border:'#FFFFFF14', border2:'#FFFFFF22' } },
  vital:    { name:'Vital',    emoji:'💚', dark:true,  c:{ bg:'#0A0A0A', surf:'#141714', surf2:'#1D211D', surf3:'#272C27', txt:'#F5F5F5', txtDim:'#A0A0A0', txtFaint:'#666666', pri:'#00E676', priDim:'#00E67622', acc:'#FFB800', border:'#FFFFFF14', border2:'#FFFFFF22' } },
  arctic:   { name:'Arctic',   emoji:'❄️', dark:true,  c:{ bg:'#0A0E14', surf:'#131923', surf2:'#1C232F', surf3:'#262E3B', txt:'#F5F5F5', txtDim:'#A0AEC0', txtFaint:'#5A6578', pri:'#3B9EFF', priDim:'#3B9EFF22', acc:'#E8F4FF', border:'#FFFFFF14', border2:'#FFFFFF22' } },
  steel:    { name:'Steel',    emoji:'🩶', dark:true,  c:{ bg:'#0F0F0F', surf:'#181818', surf2:'#212121', surf3:'#2B2B2B', txt:'#F5F5F5', txtDim:'#A0A0A0', txtFaint:'#666666', pri:'#9CA3AF', priDim:'#9CA3AF22', acc:'#E5E7EB', border:'#FFFFFF14', border2:'#FFFFFF22' } },
  light:    { name:'Light',    emoji:'☀️', dark:false, c:{ bg:'#FAFAF8', surf:'#FFFFFF', surf2:'#F2F2F0', surf3:'#E8E8E5', txt:'#1A1A1A', txtDim:'#666666', txtFaint:'#999999', pri:'#FF6B2B', priDim:'#FF6B2B14', acc:'#E08E00', border:'#00000010', border2:'#00000018' } },
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
  root.style.setProperty('--bg', t.c.bg);
  root.style.setProperty('--surf', t.c.surf);
  root.style.setProperty('--surf2', t.c.surf2);
  root.style.setProperty('--surf3', t.c.surf3);
  root.style.setProperty('--txt', t.c.txt);
  root.style.setProperty('--txtDim', t.c.txtDim);
  root.style.setProperty('--txtFaint', t.c.txtFaint);
  root.style.setProperty('--pri', t.c.pri);
  root.style.setProperty('--priDim', t.c.priDim);
  root.style.setProperty('--acc', t.c.acc);
  root.style.setProperty('--border', t.c.border);
  root.style.setProperty('--border2', t.c.border2);
  document.body.style.background = t.c.bg;
  const metaTheme = document.querySelector('meta[name=theme-color]');
  if (metaTheme) metaTheme.setAttribute('content', t.c.bg);
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
  // ── Časovač (Dávka 1) ──
  restSeconds:90,            // default dĺžka prestávky medzi sériami
  restAutoStart:true,        // auto spustenie po odkliknutí série
  // ── Progresívne preťaženie (Dávka 1) ──
  progStepUpper:2.5,         // krok váhy pre vrch tela (kg)
  progStepLower:5,           // krok váhy pre nohy (kg)
  progRule:'all_sets',       // 'all_sets' | 'any_set' | 'aggressive' | 'off'
  showRIR:false,             // zobrazovať RIR pole (pre pokročilých); default skryté
};
let PROFILE = { ...DEFAULT_PROFILE, ...(DB.get('profile')||{}) };
function saveProfile(patch){ PROFILE = { ...PROFILE, ...patch }; DB.set('profile', PROFILE); }

let SESSION = DB.get('session') || {};      // aktívny rozpísaný tréning, klúč = day.id
function saveSession(){ DB.set('session', SESSION); }
let HISTORY = DB.get('history') || [];      // dokončené tréningy
function saveHistory(){ DB.set('history', HISTORY); }
let CUSTOM_SPLITS = DB.get('splits') || []; // [{id, name, days:[{id,label,title,subtitle,exercises:[{id,name,sets,reps,note,muscle}]}]}]
function saveSplits(){ DB.set('splits', CUSTOM_SPLITS); }
let ACTIVE_SPLIT_ID = DB.get('activeSplitId') || null; // null = preset PPL, inak ID z CUSTOM_SPLITS
function saveActiveSplitId(){ DB.set('activeSplitId', ACTIVE_SPLIT_ID); }
let NUTRITION_LOG = DB.get('nutrition') || {}; // { 'YYYY-MM-DD': [{...}] }
function saveNutrition(){ DB.set('nutrition', NUTRITION_LOG); }
let WATER_LOG = DB.get('water') || {}; // { 'YYYY-MM-DD': ml }
function saveWater(){ DB.set('water', WATER_LOG); }

function todayKey(){ return new Date().toISOString().split('T')[0]; }

// Vráti aktuálne aktívne dni (vlastný split alebo preset PPL)
function getActiveDays() {
  if (ACTIVE_SPLIT_ID) {
    const split = CUSTOM_SPLITS.find(s=>s.id===ACTIVE_SPLIT_ID);
    if (split) return split.days;
  }
  return DAYS; // preset PPL fallback
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

function vibrate(ms=10){ if(navigator.vibrate) navigator.vibrate(ms); }
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// ═══════════════════════════ ROUTER ═══════════════════════════════════
let currentRoute = PROFILE.onboardingComplete ? 'home' : 'welcome';
let activeTab = 'home';
let activeDayId = DAYS[0].id;
let expandedEx = {};
let lastAutoExpandedDay = null; // sleduje pre ktorý deň už prebehlo auto-rozbalenie

function navigate(route) {
  currentRoute = route;
  render();
  document.getElementById('root').scrollTop = 0;
}

function render() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  applyTheme(PROFILE.theme || 'auto');

  if (!PROFILE.onboardingComplete && currentRoute !== 'welcome' && !currentRoute.startsWith('ob_')) {
    currentRoute = 'welcome';
  }

  const routes = {
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
  };
  const fn = routes[currentRoute] || renderMainApp;
  root.appendChild(fn());

  // Ak beží časovač prestávky, znovu ho zobraz (re-render zmazal #root, nie body)
  if (restTimerInterval && restTimerRemaining>0 && !document.getElementById('rest-timer')) {
    renderRestTimer();
  }
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
  center.appendChild(h('p', {class:'subtitle'}, 'Vykovaj svoju najlepšiu verziu'));

  const bottom = h('div', {style:'padding-bottom:10px'});
  bottom.appendChild(h('button', {class:'btn btn-primary', onClick:()=>navigate('ob_gender')}, 'Začať'));
  bottom.appendChild(h('p', {style:'text-align:center;color:var(--txtFaint);font-size:12px;margin-top:14px'}, 'Tvoje dáta zostávajú v tvojom telefóne'));

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

function obScreen(stepIndex, title, sub, contentBuilder, onNext, nextDisabled, extraBottom) {
  const screen = h('div', {class:'screen'});
  const top = h('div', {class:'safe-top'});
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
  }, ()=>navigate('ob_basics'), !valid);
}

function renderObBasics() {
  const tmp = { age: PROFILE.age, heightCm: PROFILE.heightCm, weightKg: PROFILE.weightKg };
  const valid = tmp.age && tmp.heightCm && tmp.weightKg;
  return obScreen(1, 'Základné údaje', 'Použijeme to na výpočet BMR, TDEE a makier', (content)=>{
    content.appendChild(inputField('Vek', tmp.age, 'napr. 28', 'rokov', v=>{tmp.age=v; }, 'numeric'));
    content.appendChild(inputField('Výška', tmp.heightCm, 'napr. 178', 'cm', v=>{tmp.heightCm=v;}));
    content.appendChild(inputField('Hmotnosť', tmp.weightKg, 'napr. 80', 'kg', v=>{tmp.weightKg=v;}));
  }, ()=>{
    const ageEl = document.querySelectorAll('.input-wrap input')[0];
    const hEl = document.querySelectorAll('.input-wrap input')[1];
    const wEl = document.querySelectorAll('.input-wrap input')[2];
    if (!ageEl.value || !hEl.value || !wEl.value) return;
    saveProfile({ age: parseInt(ageEl.value,10), heightCm: parseFloat(hEl.value), weightKg: parseFloat(wEl.value) });
    navigate('ob_bodyfat');
  }, false);
}

let obBfMode = 'skip';
function renderObBodyFat() {
  let waist='', neck='', hip='', manualBf='';
  return obScreen(2, 'Telesný tuk', 'Voliteľné, ale zlepší presnosť odporúčaní', (content)=>{
    const modeRow = h('div', {style:'display:flex;gap:8px;margin-bottom:20px'});
    const modes = [['manual','Poznám %'],['navy','Vypočítaj'],['skip','Preskočiť']];
    modes.forEach(([key,label])=>{
      const btn = h('button', {class:'btn '+(obBfMode===key?'btn-primary':'btn-outline')+' btn-sm', style:'flex:1', onClick:()=>{obBfMode=key; render();}}, label);
      modeRow.appendChild(btn);
    });
    content.appendChild(modeRow);

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
  }, false);
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
  }, false, h('button',{class:'btn btn-ghost', onClick:()=>navigate('ob_goal')},'Preskočiť'));
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
  }, ()=>navigate('ob_activity'), !valid);
}

function renderObActivity() {
  const LEVELS = [
    ['sedentary','🪑'],['light','🚶'],['moderate','🏃'],['active','🏋️'],['very_active','🔥'],
  ];
  const valid = !!PROFILE.activityLevel;
  return obScreen(5, 'Úroveň aktivity', 'Mimo tréningu – tvoja bežná denná aktivita', (content)=>{
    LEVELS.forEach(([key,emoji])=>content.appendChild(obSelectCard(ACTIVITY_LABELS[key],null,emoji,PROFILE.activityLevel===key,()=>{saveProfile({activityLevel:key}); render();})));
  }, ()=>navigate('ob_results'), !valid);
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
    card.appendChild(h('div',{class:'macro-dot',style:'background:'+color}));
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

function renderMainApp() {
  const screen = h('div', {class:'screen'});

  const topbar = h('div', {id:'topbar'});
  const topRow = h('div', {class:'topbar-row'});
  const titleWrap = h('div');
  titleWrap.appendChild(h('div', {class:'app-title'}, [h('span',{},'ForgeX')]));
  const dateStr = (()=>{ const d=new Date(); const days=['Nedeľa','Pondelok','Utorok','Streda','Štvrtok','Piatok','Sobota']; const months=['jan','feb','mar','apr','máj','jún','júl','aug','sep','okt','nov','dec']; return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`; })();
  titleWrap.appendChild(h('div',{class:'app-sub'}, dateStr));
  topRow.appendChild(titleWrap);
  topbar.appendChild(topRow);

  const tabContent = h('div', {style:'flex:1;display:flex;flex-direction:column;min-height:0', id:'tab-content'});
  const tabRenderers = { home: renderTabHome, training: renderTabTraining, nutrition: renderTabNutrition, stats: renderTabStats, profile: renderTabProfile };
  tabContent.appendChild((tabRenderers[activeTab]||renderTabHome)());

  const bottomNav = h('div', {id:'bottom-nav'});
  const tabs = [['home','🏠','Domov'],['training','🏋️','Tréning'],['nutrition','🍎','Výživa'],['stats','📊','Štatistiky'],['profile','👤','Profil']];
  tabs.forEach(([key,icon,label])=>{
    const btn = h('button', {class:'bnav-btn'+(activeTab===key?' active':''), onClick:()=>{ activeTab=key; render(); }});
    btn.appendChild(h('span',{class:'bnav-icon'},icon));
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
  const row = h('div', {class:'pbar-row'});
  const lbl = h('div', {class:'pbar-label'});
  lbl.appendChild(h('span',{style:'color:var(--txt);font-weight:500'},label));
  lbl.appendChild(h('span',{style:'color:var(--txtDim)'}, `${value} / ${target??'–'} ${unit}`));
  row.appendChild(lbl);
  const track = h('div', {class:'pbar-track'});
  track.appendChild(h('div', {class:'pbar-fill', style:`width:${pct}%;background:${color}`}));
  row.appendChild(track);
  return row;
}

function renderTabHome() {
  const wrap = h('div', {class:'scroll'});
  const bmr = calcBMR(PROFILE);
  const tdee = calcTDEE(bmr, PROFILE.activityLevel);
  const calorieTarget = calcCalorieTarget(tdee, PROFILE.goal);
  const macros = calcMacros({ weightKg:PROFILE.weightKg, calorieTarget, goal:PROFILE.goal });
  const hydrationTarget = calcHydration(PROFILE.weightKg, PROFILE.activityLevel);

  wrap.appendChild(h('h1', {}, 'Vitaj späť' + (PROFILE.name?`, ${PROFILE.name}`:'') + ' 👋'));

  // Regeneračné skóre (placeholder výpočet)
  const recCard = h('div',{class:'card',style:'display:flex;align-items:center;margin-top:18px'});
  recCard.appendChild(h('div',{style:'width:50px;height:50px;border-radius:25px;border:3px solid var(--pri);display:flex;align-items:center;justify-content:center;flex-shrink:0'},
    h('span',{style:'color:var(--pri);font-weight:800;font-size:16px'},'82')));
  const recText = h('div',{style:'margin-left:14px'});
  recText.appendChild(h('p',{style:'color:var(--txt);font-weight:700;font-size:14px'},'Regeneračné skóre'));
  recText.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:2px'},'Pripravený na tréning. Dobrá regenerácia.'));
  recCard.appendChild(recText);
  wrap.appendChild(recCard);

  // Dnešný tréning
  wrap.appendChild(h('p',{class:'section-title'},'DNEŠNÝ TRÉNING'));
  const activeSplitDay = getTodaySplitDay();
  const hasCustomWithWeekdays = ACTIVE_SPLIT_ID && getActiveDays().some(d=>d.weekday!=null);
  if (activeSplitDay) {
    const tCard = h('div',{class:'card card-accent', onClick:()=>{activeDayId=activeSplitDay.id; activeTab='training'; render();}});
    tCard.appendChild(h('p',{style:'color:var(--txt);font-weight:800;font-size:16px'},activeSplitDay.title));
    tCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:4px'},activeSplitDay.subtitle));
    wrap.appendChild(tCard);
  } else if (hasCustomWithWeekdays) {
    // Dnes je oddychový deň (priradené dni týždňa, dnes nič)
    const tCard = h('div',{class:'card'});
    tCard.appendChild(h('p',{style:'color:var(--txt);font-weight:800;font-size:16px'},'Dnes je oddychový deň 😴'));
    tCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:4px'},'Podľa tvojho rozvrhu dnes nemáš naplánovaný tréning. Regenerácia je súčasť progresu.'));
    wrap.appendChild(tCard);
  } else {
    const tCard = h('div',{class:'card card-accent'});
    tCard.appendChild(h('p',{style:'color:var(--txt);font-weight:800;font-size:16px'},'Zatiaľ nemáš naplánovaný split'));
    tCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:4px'},'Vytvor si vlastný tréningový plán v sekcii Tréning'));
    wrap.appendChild(tCard);
  }

  // Makrá dnes
  wrap.appendChild(h('p',{class:'section-title'},'MAKRÁ DNES'));
  const todayNutri = NUTRITION_LOG[todayKey()] || [];
  const consumed = todayNutri.reduce((acc,item)=>({
    cal: acc.cal+(item.calories||0), p: acc.p+(item.protein||0), c: acc.c+(item.carbs||0), f: acc.f+(item.fat||0)
  }), {cal:0,p:0,c:0,f:0});
  const macroCard = h('div',{class:'card'});
  macroCard.appendChild(macroBarRow('Kalórie', consumed.cal, calorieTarget, 'kcal', 'var(--pri)'));
  macroCard.appendChild(macroBarRow('Bielkoviny', consumed.p, macros?.proteinG, 'g', 'var(--acc)'));
  macroCard.appendChild(macroBarRow('Sacharidy', consumed.c, macros?.carbsG, 'g', '#3B9EFF'));
  const lastRow = macroBarRow('Tuky', consumed.f, macros?.fatG, 'g', 'var(--txtDim)');
  lastRow.style.marginBottom = '0';
  macroCard.appendChild(lastRow);
  wrap.appendChild(macroCard);

  // Hydratácia
  wrap.appendChild(h('p',{class:'section-title'},'HYDRATÁCIA'));
  const waterToday = WATER_LOG[todayKey()] || 0;
  const waterCard = h('div',{class:'card',style:'display:flex;align-items:center;justify-content:space-between'});
  const waterLeft = h('div');
  waterLeft.appendChild(h('p',{style:'color:var(--txt);font-weight:700;font-size:18px'}, `${(waterToday/1000).toFixed(2)} / ${hydrationTarget?(hydrationTarget/1000).toFixed(1):'–'} l`));
  waterLeft.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:2px'},'Dnes vypité'));
  waterCard.appendChild(waterLeft);
  const waterBtn = h('button',{class:'btn btn-primary btn-sm', onClick:()=>{ WATER_LOG[todayKey()]=(WATER_LOG[todayKey()]||0)+250; saveWater(); vibrate(); render(); }},'+250ml');
  waterCard.appendChild(waterBtn);
  wrap.appendChild(waterCard);

  // Streak
  wrap.appendChild(h('p',{class:'section-title'},'STREAK'));
  const streak = computeStreak();
  const streakCard = h('div',{class:'card',style:'display:flex;align-items:center;justify-content:space-between'});
  const streakLeft = h('div');
  streakLeft.appendChild(h('p',{style:'color:var(--txt);font-weight:700;font-size:18px'}, `${streak} ${streak===1?'deň':'dní'}`));
  streakLeft.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:2px'}, streak>0?'Pokračuj!':'Začni svoj prvý tréning'));
  streakCard.appendChild(streakLeft);
  streakCard.appendChild(h('span',{style:'font-size:28px'},'🔥'));
  wrap.appendChild(streakCard);

  return wrap;
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
  if (!activeDays.find(d=>d.id===activeDayId)) activeDayId = activeDays[0]?.id;

  const splitHeader = h('div', {style:'padding:16px 20px 0;display:flex;align-items:center;justify-content:space-between'});
  const splitName = ACTIVE_SPLIT_ID ? (CUSTOM_SPLITS.find(s=>s.id===ACTIVE_SPLIT_ID)?.name || 'Môj split') : 'PPL Split (predvolený)';
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
  header.appendChild(h('div',{class:'ex-badge'},`${ex.sets}× ${ex.reps}`));
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
      wRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'weight',-wStep,wVal,rVal)},'−'));
      const wInput = h('input',{class:'stepper-val',type:'number',inputmode:'decimal',value:wVal,placeholder:'0',
        onChange:(e)=>{ setSetVal(day.id,ex.id,si,'weight', inputToKg(e.target.value)); }});
      wRow.appendChild(wInput);
      wRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'weight',wStep,wVal,rVal)},'+'));
      wStepper.appendChild(wRow);
      fields.appendChild(wStepper);

      // Stepper OPAKOVANIA
      const rStepper = h('div',{class:'stepper'});
      rStepper.appendChild(h('div',{class:'stepper-label'}, 'Opakovania'));
      const rRow = h('div',{class:'stepper-row'});
      rRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'reps',-1,wVal,rVal)},'−'));
      const rInput = h('input',{class:'stepper-val',type:'number',inputmode:'numeric',value:rVal,placeholder:'0',
        onChange:(e)=>{ setSetVal(day.id,ex.id,si,'reps', e.target.value); }});
      rRow.appendChild(rInput);
      rRow.appendChild(h('button',{class:'stepper-btn', onClick:()=>adjustSetField(day.id,ex.id,si,'reps',1,wVal,rVal)},'+'));
      rStepper.appendChild(rRow);
      fields.appendChild(rStepper);

      // Veľký check button
      const checkBtn = h('button',{class:'set-check-lg'+(isDone?' done':''), onClick:()=>{
        completeSet(day.id, ex.id, si, wVal, rVal);
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
function adjustSetField(dayId, exId, setIdx, field, delta, currentW, currentR) {
  const sess = (SESSION[dayId]||{})[exId] || {};
  const s = (sess.sets||[])[setIdx] || {};
  let current;
  if (field==='weight') {
    current = s.weight!=null && s.weight!=='' ? parseFloat(displayWeight(parseFloat(s.weight))) : (parseFloat(currentW)||0);
  } else {
    current = s.reps!=null && s.reps!=='' ? parseInt(s.reps,10) : (parseInt(currentR,10)||0);
  }
  let next = current + delta;
  if (next < 0) next = 0;
  if (field==='weight') {
    setSetVal(dayId, exId, setIdx, 'weight', inputToKg(next));
  } else {
    setSetVal(dayId, exId, setIdx, 'reps', String(next));
  }
  render();
}

// Dokončenie série – uloží hodnoty (ak nie sú), zazelení, spustí timer, auto-skok
function completeSet(dayId, exId, setIdx, displayedW, displayedR) {
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
    saveSession();
    // Spusti časovač prestávky (ak je zapnutý auto-start)
    if (PROFILE.restAutoStart && PROFILE.restSeconds>0) {
      startRestTimer(PROFILE.restSeconds);
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
  const overlay = h('div',{class:'modal-overlay', style:'align-items:center', onClick:(e)=>{ if(e.target===overlay){ closeModal(); activeTab='training'; render(); } }});
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

  sheet.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{ closeModal(); activeTab='training'; trainingSubView='history'; render(); }},'Super! 🎉'));
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
const QUICK_FOODS = [
  {name:'Kuracie prsia (100g)',calories:165,protein:31,carbs:0,fat:3.6},
  {name:'Ryža biela (100g varená)',calories:130,protein:2.7,carbs:28,fat:0.3},
  {name:'Vajce (1ks)',calories:78,protein:6.3,carbs:0.6,fat:5.3},
  {name:'Banán (1ks)',calories:105,protein:1.3,carbs:27,fat:0.4},
  {name:'Tvaroh (100g)',calories:98,protein:11,carbs:3.4,fat:4.3},
  {name:'Ovsené vločky (100g)',calories:389,protein:16.9,carbs:66,fat:6.9},
  {name:'Whey proteín (1 dávka 30g)',calories:120,protein:24,carbs:3,fat:1.5},
  {name:'Mandle (30g)',calories:174,protein:6.4,carbs:6.1,fat:15},
];

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

  const sumCard = h('div',{class:'card card-accent',style:'margin-top:18px'});
  sumCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px'},'Denný cieľ'));
  sumCard.appendChild(h('p',{style:'color:var(--pri);font-size:30px;font-weight:800'}, `${Math.round(consumed.cal)} / ${calorieTarget??'–'} kcal`));
  sumCard.appendChild(h('p',{style:'color:var(--txtDim);font-size:12px;margin-top:6px'}, `B: ${consumed.p.toFixed(0)}/${macros?.proteinG??'–'}g · S: ${consumed.c.toFixed(0)}/${macros?.carbsG??'–'}g · T: ${consumed.f.toFixed(0)}/${macros?.fatG??'–'}g`));
  wrap.appendChild(sumCard);

  wrap.appendChild(h('p',{class:'section-title'},'DNEŠNÉ JEDLÁ'));
  if (!todayNutri.length) {
    const empty = h('div',{class:'card',style:'text-align:center;padding:28px 16px'});
    empty.appendChild(h('div',{style:'font-size:32px;margin-bottom:8px'},'🍎'));
    empty.appendChild(h('div',{style:'color:var(--txt);font-weight:700'},'Zatiaľ žiadne jedlá dnes'));
    wrap.appendChild(empty);
  } else {
    todayNutri.forEach((item,idx)=>{
      const row = h('div',{class:'card',style:'margin-bottom:8px;display:flex;align-items:center;justify-content:space-between'});
      const left = h('div');
      left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},item.name));
      left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},`${item.calories} kcal · B:${item.protein}g S:${item.carbs}g T:${item.fat}g`));
      row.appendChild(left);
      const delBtn = h('button',{class:'btn btn-ghost btn-sm', onClick:()=>{
        NUTRITION_LOG[todayKey()].splice(idx,1); saveNutrition(); render();
      }},'✕');
      row.appendChild(delBtn);
      wrap.appendChild(row);
    });
  }

  const addBtn = h('button',{class:'btn btn-primary',style:'margin-top:16px', onClick:()=>openAddFoodModal()},'+ Pridať jedlo');
  wrap.appendChild(addBtn);

  return wrap;
}

function openAddFoodModal() {
  const overlay = h('div',{class:'modal-overlay', onClick:(e)=>{ if(e.target===overlay) closeModal(); }});
  const sheet = h('div',{class:'modal-sheet'});
  sheet.appendChild(h('div',{class:'modal-handle'}));
  sheet.appendChild(h('h2',{style:'margin-bottom:14px'},'Pridať jedlo'));

  QUICK_FOODS.forEach(food=>{
    const row = h('div',{class:'card',style:'margin-bottom:8px;display:flex;align-items:center;justify-content:space-between',
      onClick:()=>{
        if (!NUTRITION_LOG[todayKey()]) NUTRITION_LOG[todayKey()]=[];
        NUTRITION_LOG[todayKey()].push({...food});
        saveNutrition();
        closeModal();
        render();
      }});
    const left = h('div');
    left.appendChild(h('div',{style:'color:var(--txt);font-weight:600;font-size:14px'},food.name));
    left.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:3px'},`${food.calories} kcal · B:${food.protein}g S:${food.carbs}g T:${food.fat}g`));
    row.appendChild(left);
    row.appendChild(h('span',{style:'color:var(--pri);font-size:18px'},'+'));
    sheet.appendChild(row);
  });

  sheet.appendChild(h('button',{class:'btn btn-ghost',style:'margin-top:8px', onClick:closeModal},'Zavrieť'));
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
}
function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
}

// ───────────────────────── TAB: STATS ──────────────────────────────────
let statsSelectedEx = null;
let chartInstance = null;

function renderTabStats() {
  const wrap = h('div',{class:'scroll'});
  wrap.appendChild(h('h1',{},'Štatistiky'));

  if (!HISTORY.length) {
    const empty = h('div',{class:'empty-state'});
    empty.appendChild(h('div',{class:'empty-emoji'},'📊'));
    empty.appendChild(h('div',{class:'empty-title'},'Štatistiky sa zobrazia po prvom tréningu'));
    empty.appendChild(h('div',{class:'empty-sub'},'PR rekordy, grafy progresu, obvody v čase'));
    wrap.appendChild(empty);
    return wrap;
  }

  const allExercises = DAYS.flatMap(d=>d.exercises);
  if (!statsSelectedEx) statsSelectedEx = allExercises[0].id;

  wrap.appendChild(h('p',{class:'section-title'},'PROGRES VÁHY'));
  const chartCard = h('div',{class:'card'});
  const select = h('select',{class:'rir-select', style:'width:100%;text-align:left;padding:10px;margin-bottom:12px',
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
    row.appendChild(h('span',{class:'stat-value',style:'color:var(--pri)'},`${pr.weight}kg × ${pr.reps}`));
    prCard.appendChild(row);
  });
  if (!anyPR) prCard.appendChild(h('p',{style:'color:var(--txtFaint);font-size:13px'},'Žiadne PR zatiaľ'));
  wrap.appendChild(prCard);

  return wrap;
}

function renderChart(exId) {
  const canvas = document.getElementById('progressChart');
  if (!canvas || typeof Chart==='undefined') return;
  if (chartInstance) { chartInstance.destroy(); chartInstance=null; }
  const labels=[], values=[];
  HISTORY.filter(e=>e.data[exId]).forEach(e=>{
    const sets = (e.data[exId].sets||[]).filter(s=>s.done&&s.weight);
    if (!sets.length) return;
    const maxW = Math.max(...sets.map(s=>parseFloat(s.weight||0)));
    const d = new Date(e.date);
    labels.push(`${d.getDate()}.${d.getMonth()+1}`);
    values.push(maxW);
  });
  if (!labels.length) return;
  const priColor = getComputedStyle(document.documentElement).getPropertyValue('--pri').trim();
  chartInstance = new Chart(canvas, {
    type:'line',
    data:{ labels, datasets:[{ label:'Max váha (kg)', data:values, borderColor:priColor, backgroundColor:priColor+'22', pointBackgroundColor:priColor, pointRadius:5, tension:0.3, fill:true }] },
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ x:{ticks:{color:'#888',font:{size:11}},grid:{color:'#ffffff0a'}}, y:{ticks:{color:'#888',font:{size:11}},grid:{color:'#ffffff0a'}} } }
  });
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
    ['📏','Jednotky', PROFILE.units==='imperial'?'lbs / in':'kg / cm', ()=>openUnitsModal()],
    ['⏱','Časovač prestávky', fmtTime(PROFILE.restSeconds||90), ()=>openTimerModal()],
    ['📈','Progresívne preťaženie', progRuleLabel(), ()=>openProgressionModal()],
    ['🎯','Pokročilé (RIR)', PROFILE.showRIR?'Zapnuté':'Vypnuté', ()=>openAdvancedModal()],
    ['🔔','Notifikácie', PROFILE.notifRest?'Zapnuté':'Vypnuté', ()=>openNotifModal()],
    ['🎁','Promo kód', PROFILE.promoCode||null, ()=>openPromoModal()],
    ['🌍','Jazyk','Slovenčina', ()=>alert('Viacjazyčnosť (SK/CZ/EN) pripravujeme v ďalšej aktualizácii.')],
    ['⭐','Predplatné','Free', ()=>alert('ForgeX je momentálne zadarmo. Premium plán pripravujeme.')],
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
  sheet.appendChild(h('button',{class:'btn btn-primary',style:'margin-top:8px', onClick:()=>{ closeModal(); render(); }},'Hotovo'));
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
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
      const inp = h('input',{type,value:val,'data-key':key, inputmode: type==='number'?'decimal':'text'});
      wrap.appendChild(inp);
      sheet.appendChild(wrap);
    });
    // Cieľ
    sheet.appendChild(h('label',{class:'input-label'},'Cieľ'));
    const goalSeg = h('div',{class:'segment',style:'margin-bottom:14px;flex-wrap:wrap'});
    Object.entries(GOAL_LABELS).forEach(([k,v])=>{
      const b = h('button',{class:'segment-btn'+(PROFILE.goal===k?' active':''),style:'flex:1 1 45%', onClick:()=>{ saveProfile({goal:k}); closeModal(); openPersonalDataModal(); }}, v.split(' ')[0]);
      goalSeg.appendChild(b);
    });
    sheet.appendChild(goalSeg);
    // Aktivita
    sheet.appendChild(h('label',{class:'input-label'},'Úroveň aktivity'));
    const actSel = h('select',{class:'chart-select',style:'width:100%;background:var(--surf2);border:1px solid var(--border2);color:var(--txt);border-radius:10px;padding:11px;font-size:14px;margin-bottom:8px'});
    Object.entries(ACTIVITY_LABELS).forEach(([k,v])=>{
      const opt=h('option',{value:k},v); if(PROFILE.activityLevel===k) opt.selected=true; actSel.appendChild(opt);
    });
    actSel.addEventListener('change',(e)=>saveProfile({activityLevel:e.target.value}));
    sheet.appendChild(actSel);

    // Pri zatvorení ulož textové polia (override Hotovo tlačidla cez listener na inputy)
    sheet.querySelectorAll('input[data-key]').forEach(inp=>{
      inp.addEventListener('change',(e)=>{
        const key=e.target.getAttribute('data-key');
        let v=e.target.value;
        if (key==='heightCm') { v = PROFILE.units==='imperial' ? Math.round(parseFloat(v)*2.54*10)/10 : parseFloat(v); }
        else if (key==='weightKg') { v = inputToKg(v); }
        else if (key==='age') { v = parseInt(v,10); }
        saveProfile({[key]: v||null});
      });
    });
  });
}

function openUnitsModal() {
  settingsModal('Jednotky', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Vyber systém jednotiek. Hodnoty sa automaticky prepočítajú.'));
    const seg = h('div',{class:'segment'});
    [['metric','Metrické (kg / cm)'],['imperial','Imperiálne (lbs / in)']].forEach(([k,label])=>{
      seg.appendChild(h('button',{class:'segment-btn'+(PROFILE.units===k?' active':''), onClick:()=>{ saveProfile({units:k}); closeModal(); openUnitsModal(); }}, label));
    });
    sheet.appendChild(seg);
  });
}

function openTimerModal() {
  settingsModal('Časovač prestávky', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Dĺžka prestávky medzi sériami.'));
    // Rýchle voľby
    const quick = h('div',{style:'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px'});
    [30,60,90,120,150,180].forEach(sec=>{
      const active = PROFILE.restSeconds===sec;
      quick.appendChild(h('button',{class:'btn btn-sm '+(active?'btn-primary':'btn-outline'),style:'flex:1 1 28%', onClick:()=>{ saveProfile({restSeconds:sec}); closeModal(); openTimerModal(); }}, fmtTime(sec)));
    });
    sheet.appendChild(quick);
    // Vlastný čas
    sheet.appendChild(h('label',{class:'input-label'},'Vlastný čas (sekundy)'));
    const wrap = h('div',{class:'input-wrap'});
    const inp = h('input',{type:'number',inputmode:'numeric',value:PROFILE.restSeconds||90, onChange:(e)=>{ const v=parseInt(e.target.value,10); if(v>0) saveProfile({restSeconds:v}); }});
    wrap.appendChild(inp); wrap.appendChild(h('span',{class:'unit'},'s'));
    sheet.appendChild(wrap);
    // Auto-start toggle
    const toggleRow = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
    toggleRow.appendChild(h('span',{class:'setting-label'},'Automaticky spustiť po sérii'));
    const tg = h('button',{class:'toggle'+(PROFILE.restAutoStart?' on':''), onClick:()=>{ saveProfile({restAutoStart:!PROFILE.restAutoStart}); closeModal(); openTimerModal(); }});
    tg.appendChild(h('div',{class:'toggle-knob'}));
    toggleRow.appendChild(tg);
    sheet.appendChild(toggleRow);
  });
}

function openProgressionModal() {
  settingsModal('Progresívne preťaženie', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Kedy ti appka navrhne pridať váhu?'));
    const rules = [['all_sets','Po dosiahnutí horného rozsahu na všetkých sériách'],['any_set','Po dosiahnutí horného rozsahu aspoň raz'],['aggressive','Skúsiť pridať každý tréning'],['off','Vypnuté (žiadne návrhy)']];
    rules.forEach(([k,label])=>{
      const row = h('div',{class:'select-card'+(PROFILE.progRule===k?' selected':''), onClick:()=>{ saveProfile({progRule:k}); closeModal(); openProgressionModal(); }});
      row.appendChild(h('div',{class:'label'},[h('div',{class:'label-main',style:'font-size:13px'},label)]));
      if (PROFILE.progRule===k) row.appendChild(h('div',{class:'check-dot'},'✓'));
      sheet.appendChild(row);
    });
    // Krok váhy
    sheet.appendChild(h('label',{class:'input-label',style:'margin-top:8px'},`Prírastok – vrch tela (${weightUnit()})`));
    const w1=h('div',{class:'input-wrap'});
    w1.appendChild(h('input',{type:'number',inputmode:'decimal',value:displayWeight(PROFILE.progStepUpper||2.5),onChange:(e)=>saveProfile({progStepUpper:inputToKg(e.target.value)})}));
    sheet.appendChild(w1);
    sheet.appendChild(h('label',{class:'input-label'},`Prírastok – nohy (${weightUnit()})`));
    const w2=h('div',{class:'input-wrap'});
    w2.appendChild(h('input',{type:'number',inputmode:'decimal',value:displayWeight(PROFILE.progStepLower||5),onChange:(e)=>saveProfile({progStepLower:inputToKg(e.target.value)})}));
    sheet.appendChild(w2);
  });
}

function openAdvancedModal() {
  settingsModal('Pokročilé nastavenia', (sheet)=>{
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Pre skúsenejších cvičencov.'));
    // RIR toggle
    const row = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
    const lbl = h('div',{style:'flex:1'});
    lbl.appendChild(h('div',{class:'setting-label'},'Zobrazovať RIR'));
    lbl.appendChild(h('div',{style:'color:var(--txtFaint);font-size:11px;margin-top:3px;line-height:1.4'},'RIR (Reps In Reserve) = koľko opakovaní by si ešte zvládol. Napr. RIR 2 znamená, že si mohol spraviť ešte 2 opakovania. Pomáha riadiť intenzitu.'));
    row.appendChild(lbl);
    const tg = h('button',{class:'toggle'+(PROFILE.showRIR?' on':''), onClick:()=>{ saveProfile({showRIR:!PROFILE.showRIR}); closeModal(); openAdvancedModal(); }});
    tg.appendChild(h('div',{class:'toggle-knob'}));
    row.appendChild(tg);
    sheet.appendChild(row);
  });
}

function openNotifModal() {
  settingsModal('Notifikácie', (sheet)=>{    const supported = ('Notification' in window);
    if (!supported) {
      sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px'},'Tvoj prehliadač nepodporuje notifikácie. Na iPhone pridaj appku na plochu, aby fungovali.'));
      return;
    }
    const perm = Notification.permission;
    if (perm!=='granted') {
      sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Povoľ notifikácie, aby ťa appka upozornila keď skončí prestávka.'));
      sheet.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{ requestNotifPermission(); closeModal(); }},'🔔 Povoliť notifikácie'));
    } else {
      const toggleRow = h('div',{class:'setting-toggle-row',style:'padding:14px 0'});
      toggleRow.appendChild(h('span',{class:'setting-label'},'Upozornenie po prestávke'));
      const tg = h('button',{class:'toggle'+(PROFILE.notifRest?' on':''), onClick:()=>{ saveProfile({notifRest:!PROFILE.notifRest}); closeModal(); openNotifModal(); }});
      tg.appendChild(h('div',{class:'toggle-knob'}));
      toggleRow.appendChild(tg);
      sheet.appendChild(toggleRow);
    }
  });
}

function openPromoModal() {
  settingsModal('Promo kód', (sheet)=>{
    if (PROFILE.promoCode) {
      sheet.appendChild(h('div',{class:'card card-accent',style:'margin-bottom:14px'},[
        h('div',{style:'color:var(--txtDim);font-size:12px'},'Aktívny kód'),
        h('div',{style:'color:var(--pri);font-size:18px;font-weight:800;margin-top:2px'},PROFILE.promoCode),
      ]));
      sheet.appendChild(h('button',{class:'btn btn-ghost',style:'color:var(--red)', onClick:()=>{ saveProfile({promoCode:null}); closeModal(); openPromoModal(); }},'Odstrániť kód'));
      return;
    }
    sheet.appendChild(h('p',{style:'color:var(--txtDim);font-size:13px;margin-bottom:14px'},'Zadaj promo kód ak ho máš.'));
    const wrap = h('div',{class:'input-wrap'});
    const inp = h('input',{type:'text',placeholder:'napr. FORGEX2026', id:'promo-input', style:'text-transform:uppercase'});
    wrap.appendChild(inp);
    sheet.appendChild(wrap);
    sheet.appendChild(h('button',{class:'btn btn-primary', onClick:()=>{
      const val = (document.getElementById('promo-input')?.value||'').trim().toUpperCase();
      if (!val) return;
      // Demo validácia – reálne kódy budú overené cez backend
      saveProfile({promoCode:val});
      alert('Kód uložený. Bude overený pri pripojení k účtu (pripravujeme).');
      closeModal(); render();
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

function renderSplitManage() {
  const screen = h('div', {class:'screen'});
  const top = h('div', {class:'safe-top', style:'padding:16px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)'});
  top.appendChild(h('button',{class:'icon-btn', onClick:backToTraining},'←'));
  top.appendChild(h('h2',{},'Moje splits'));
  screen.appendChild(top);

  const scroll = h('div',{class:'scroll'});

  // Preset PPL karta
  const presetCard = h('div',{class:'card'+(!ACTIVE_SPLIT_ID?' card-accent':''), style:'margin-bottom:10px;cursor:pointer', onClick:()=>{ ACTIVE_SPLIT_ID=null; saveActiveSplitId(); render(); }});
  const presetTop = h('div',{style:'display:flex;align-items:center;justify-content:space-between'});
  presetTop.appendChild(h('div',{},[
    h('div',{style:'color:var(--txt);font-weight:700;font-size:15px'},'PPL Split (predvolený)'),
    h('div',{style:'color:var(--txtDim);font-size:12px;margin-top:3px'},'5 dní/týždeň · Push/Pull/Legs/Upper/Down'),
  ]));
  if (!ACTIVE_SPLIT_ID) presetTop.appendChild(h('span',{class:'check-dot'},'✓'));
  presetCard.appendChild(presetTop);
  scroll.appendChild(presetCard);

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

function renderSplitNew() {
  const screen = h('div', {class:'screen'});
  const top = h('div', {style:'padding:calc(var(--safeT) + 16px) var(--pad) 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)'});
  top.appendChild(h('button',{class:'icon-btn', onClick:()=>{ CUSTOM_SPLITS.length ? navigate('split_manage') : (activeTab='home', navigate('home')); }},'←'));
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
    splitDraft = generateSplitFromTemplate(newSplitDaysCount, PROFILE.gender);
    navigate('split_preview');
  }},'Zobraziť návrh s cvikmi'));
  // Preskočiť (len ak ešte nemá žiadny split – počas onboardingu)
  if (!CUSTOM_SPLITS.length) {
    bottom.appendChild(h('button',{class:'btn btn-ghost', onClick:()=>{ activeTab='home'; navigate('home'); }},'Preskočiť (použiť predvolený PPL)'));
  }
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
    info.appendChild(h('div',{style:'color:var(--txtDim);font-size:11px;margin-top:2px'},`${ex.sets}× ${ex.reps} · ${MUSCLE_LABELS[ex.muscle]||''}`));
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

function requestNotifPermission() {
  if (!('Notification' in window)) { alert('Tvoj prehliadač nepodporuje notifikácie.'); return; }
  Notification.requestPermission().then(perm=>{
    if (perm==='granted') {
      saveProfile({notifRest:true});
      try { new Notification('ForgeX', { body:'Notifikácie zapnuté ✓' }); } catch(e){}
    }
    render();
  });
}

// Manuálne spustenie časovača (tlačidlo v tréningu)
function manualStartRest() {
  startRestTimer(PROFILE.restSeconds || 90);
}

// ═══════════════════════════ INIT ═══════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

document.addEventListener('DOMContentLoaded', render);
if (document.readyState !== 'loading') render();

