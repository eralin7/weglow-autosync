const https = require('https');
const http  = require('http');

const SUPABASE_URL = 'https://bdyakgmeibpdkisbiykt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeWFrZ21laWJwZGtpc2JpeWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTQzOTMsImV4cCI6MjA4Nzc5MDM5M30.nA187grJR6XFQRmTP6WOM-6-1dZK1EzYNNP2JH9aAMg';

const ACCOUNTS = [
  { name:'Коллаген', domain:'weglow.amocrm.ru',
    token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjIyODdkZTdmMzY4OWEzYTE0Y2Q2MmUxZDI4ZTRjZDkyOWEwMjYyNWJhNmJmZWYwYWQzOTRmZjhkY2M3MzFmNTM2ZDQ5YzdkZGQ5YmU2NDZkIn0.eyJhdWQiOiI4NWRhNjc3ZC0xOGUyLTQ5ZjktYjQ1NC1jYTNhMmVhZTlmMWIiLCJqdGkiOiIyMjg3ZGU3ZjM2ODlhM2ExNGNkNjJlMWQyOGU0Y2Q5MjlhMDI2MjViYTZiZmVmMGFkMzk0ZmY4ZGNjNzMxZjUzNmQ0OWM3ZGRkOWJlNjQ2ZCIsImlhdCI6MTc3MjY1NzYyNCwibmJmIjoxNzcyNjU3NjI0LCJleHAiOjE4OTg5ODU2MDAsInN1YiI6IjExNTQ2MzQ2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTYyMzI2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZjZmNDFlM2EtZGE4Yy00YWE3LWFhMGEtZTEyN2IzODE2NzVjIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.IAfT5CDTKXg_UTQKcVFfrS-ZlF3ZSq7a3Mdf--jy8Z2C1YvprTwcQg2SH2b2FsEVAKDqrSgx8Lc-YblLqv4c--vLzgB5lsr-xafuI9af6QWmrsdk_NXypl7CWhv4N84StT_14icwn_AK2k9xknvagNucqrIssW57ua9tmgddFP3x71mCbia8sFmUdTNW8wB2HJNU7jo6drEmo6VxWSGUxzohV3ux3D4ZjhGsDvEngGfLI4AHrbPsf2WmWFn9mATN0kd4b742Bu1iOELKDnZeu45a63p7AQBd2XUIwxfHCbwmTOMMB-Ea-7HkmDBv-buThHWU-Vcj0krLxx3U0NFuwA',
    crossFieldNames: [],
    ownFieldNames:   ['кофе', 'синий', 'красный', 'умми'],
    // Pipeline splitting: leads from KIDS pipeline → stored as "Ummi"
    kidsPipelineMatch: 'WEGLOW KIDS UMMI' },

  { name:'Кофе (Архив)', domain:'mushrooms.amocrm.ru',
    token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJlZmVhMzE1OGNiMjc4ZjgxYmIwYTllZDcyNDRkMDFjNDdkMDJiMWY1Zjk3NzcyOGJlZGNjY2Q5ODBhMGU4YmRiYzVkNGNlNzYzOTcwZjRjIn0.eyJhdWQiOiJmNDliNzY0ZC1iM2EwLTQzZjQtODczYi0yYzk2ZGEwYmEyNmMiLCJqdGkiOiJiZWZlYTMxNThjYjI3OGY4MWJiMGE5ZWQ3MjQ0ZDAxYzQ3ZDAyYjFmNWY5Nzc3MjhiZWRjY2NkOTgwYTBlOGJkYmM1ZDRjZTc2Mzk3MGY0YyIsImlhdCI6MTc3MjY1Nzc0MSwibmJmIjoxNzcyNjU3NzQxLCJleHAiOjE4OTkwNzIwMDAsInN1YiI6IjIzOTc4NjUiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzI4ODY4NzAsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwibm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiIwMTI3ODQ4NS00NjQ2LTRkMGEtOTQ4Ni1kZDZiNmJmM2M1YTYiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.hHlVdsC4TpTfqdeefNyn4OFXdRMwzEuq7c3QPgrK86gHom2aypje6tx4WLbbwZJ8Jm5aEqctQH9zZF4CliB9oB9bghAn66ElAHSmmhfnxIsrfXWecPErPN9WiD6edBlpyPHaoP6JjhBKmJ2mkBWaeV0U52L50aoglTy5nPRbdKa3kXBFAqZQo3L8_sN5jhvbBwsieAr6F_CAfjYJani_qEAQ9egSeoE8xJBv5S1ll6U28F2NPeRqMYqjPUAAKNtje2eTuRWXk5IsP4OsGaLi4AKctRBvanMvfUmQu-5GJ6XwdOaSuShWw36ryVVijrIQ4mdmbRnZLsZT7Th53ipiYg',
    crossFieldNames: [],
    ownFieldNames:   [],
    // Archive: only data before March 23, 2026
    maxDate: '23.03.2026' },
];

// Old Ummi account (weglowkids.amocrm.ru) — disabled since April 6, 2026.
// Historical data preserved in ARCHIVE_RAW/ARCHIVE_MANAGERS up to April 5.

const VALID_STAGES = new Set(['заказ','заказ на подтверждение','курьерская доставка','успешно реализовано']);
const SYNC_INTERVAL_MS = 60 * 1000;

// ── HTTP helper ──────────────────────────────────────────────────
function fetchJSON(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = new URL(url);
    const req = https.request({
      hostname: p.hostname,
      path:     p.pathname + p.search,
      method:   opts.method || 'GET',
      headers:  opts.headers || {},
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 204) { resolve({}); return; }
        if (res.statusCode >= 400) { reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0,200)}`)); return; }
        try { resolve(JSON.parse(data)); } catch(e) { resolve({}); }
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── AmoCRM helpers ───────────────────────────────────────────────
const amoGet = (domain, token, path) =>
  fetchJSON(`https://${domain}${path}`, { headers: { Authorization: `Bearer ${token}` } });

async function loadPipelines(acc) {
  const map = {};           // status_id → status_name  (non-shared statuses)
  const pipelineMap = {};   // status_id → pipeline_id  (non-shared statuses)
  const pipelineNames = {}; // pipeline_id → pipeline_name
  const statusByPipeline = {}; // pipeline_id → { status_id → status_name }  (handles shared IDs like 142/143)
  try {
    const d = await amoGet(acc.domain, acc.token, '/api/v4/leads/pipelines?limit=250');
    for (const p of (d?._embedded?.pipelines || [])) {
      pipelineNames[p.id] = p.name;
      statusByPipeline[p.id] = {};
      for (const s of (p._embedded?.statuses || [])) {
        map[s.id] = s.name;
        pipelineMap[s.id] = p.id;
        statusByPipeline[p.id][s.id] = s.name;
      }
    }
    console.log(`[${acc.name}] ${Object.keys(map).length} statuses, ${Object.keys(pipelineNames).length} pipelines loaded`);
    console.log(`[${acc.name}] Pipelines:`, Object.entries(pipelineNames).map(([id,n]) => `${n} (${id})`).join(', '));
  } catch(e) { console.error(`[${acc.name}] pipelines:`, e.message); }
  acc._pipelineMap = pipelineMap;
  acc._pipelineNames = pipelineNames;
  acc._statusByPipeline = statusByPipeline;
  return map;
}

async function findOrderField(acc) {
  try {
    const d = await amoGet(acc.domain, acc.token, '/api/v4/leads/custom_fields?limit=250');
    const fields = d?._embedded?.custom_fields || [];
    console.log(`[${acc.name}] Custom fields (${fields.length}):`);
    fields.forEach(f => console.log(`  ${f.id}: "${f.name}" (${f.field_type})`));

    // Find order date field
    const orderField = fields.find(f => f.name.toLowerCase().includes('дата заказа') && !f.name.toLowerCase().includes('первого'))
                    || fields.find(f => f.name.toLowerCase().includes('заказа') && f.field_type === 'date');
    if (orderField) console.log(`[${acc.name}] ✅ orderField: ${orderField.id} "${orderField.name}"`);
    else console.log(`[${acc.name}] ⚠ No order date field found`);

    // Find cross-product fields
    acc.crossFields = {}; // { fieldName: fieldId }
    for (const name of (acc.crossFieldNames || [])) {
      const f = fields.find(f => f.name.toLowerCase().includes(name));
      if (f) {
        acc.crossFields[f.name] = f.id;
        console.log(`[${acc.name}] ✅ crossField: ${f.id} "${f.name}"`);
      }
    }

    // Find city field
    const cityField = fields.find(f => f.name.toLowerCase() === 'город')
                   || fields.find(f => f.name.toLowerCase().includes('город'));
    if (cityField) {
      acc.cityFieldId = cityField.id;
      console.log(`[${acc.name}] ✅ cityField: ${cityField.id} "${cityField.name}"`);
    } else {
      console.log(`[${acc.name}] ⚠ No city field found`);
    }

    // Find own product fields (numeric qty fields)
    acc.ownFields = {}; // { fieldName: fieldId }
    for (const name of (acc.ownFieldNames || [])) {
      const matched = fields.filter(f =>
        f.name.toLowerCase().includes(name) &&
        !Object.values(acc.crossFields).includes(f.id) // not already a cross field
      );
      for (const f of matched) {
        acc.ownFields[f.name] = f.id;
        console.log(`[${acc.name}] ✅ ownField: ${f.id} "${f.name}"`);
      }
    }

    return orderField ? orderField.id : null;
  } catch(e) { console.error(`[${acc.name}] findOrderField:`, e.message); return null; }
}

// Normalize AmoCRM group name → standard ROP name
const ROP_NAME_MAP = {
  'роп айдана':       'РОП Айдана',
  'айдана роп':       'РОП Айдана',
  'роп аслиддин':     'РОП Аслиддин',
  'роп нурдаулет':    'РОП Нурдаулет',
  'диас роп':         'РОП Диас KIDS',
  'роп диас':         'РОП Диас KIDS',
  'роп айдана kids':  'РОП Айдана KIDS',
  'айдана роп kids':  'РОП Айдана KIDS',
  'роп диас kids':    'РОП Диас KIDS',
  'диас роп kids':    'РОП Диас KIDS',
};
function normalizeRopName(groupName) {
  const lower = groupName.toLowerCase().trim();
  if (ROP_NAME_MAP[lower]) return ROP_NAME_MAP[lower];
  // Fuzzy: check if any key is contained in group name
  for (const [k, v] of Object.entries(ROP_NAME_MAP)) {
    if (lower.includes(k) || k.includes(lower)) return v;
  }
  return null; // not a ROP group
}

async function loadUsers(acc) {
  const map = {};
  const userGroups = {}; // userId → normalized ROP name
  try {
    const d = await amoGet(acc.domain, acc.token, '/api/v4/users?with=group&limit=250');
    for (const u of (d?._embedded?.users || [])) {
      map[u.id] = u.name;
      // Extract group → ROP mapping
      const groups = u?._embedded?.groups || [];
      for (const g of groups) {
        const rop = normalizeRopName(g.name || '');
        if (rop) { userGroups[u.id] = rop; break; }
      }
    }
    console.log(`[${acc.name}] ${Object.keys(map).length} users loaded, ${Object.keys(userGroups).length} with ROP groups`);
  } catch(e) { console.error(`[${acc.name}] users:`, e.message); }
  acc._userGroups = userGroups;
  return map;
}

async function fetchAllLeads(acc) {
  const leads = []; let page = 1;
  while (true) {
    try {
      const d = await amoGet(acc.domain, acc.token, `/api/v4/leads?limit=250&page=${page}`);
      const items = d?._embedded?.leads || [];
      if (!items.length) break;
      leads.push(...items);
      if (items.length < 250) break;
      page++;
      await sleep(150);
    } catch(e) { console.error(`[${acc.name}] page ${page}:`, e.message); break; }
  }
  console.log(`[${acc.name}] ${leads.length} leads fetched`);
  return leads;
}

// ── Parse leads ──────────────────────────────────────────────────
// UTC+5 Almaty timezone offset
const TZ_OFFSET = 5 * 3600;
const fmtDate = ts => {
  // Shift timestamp by +5h so dates match Almaty local time
  const d = new Date((Number(ts) + TZ_OFFSET) * 1000);
  return `${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}.${d.getUTCFullYear()}`;
};

const getField = (lead, id) => id
  ? (lead.custom_fields_values || []).find(x => x.field_id === id)?.values?.[0]?.value ?? null
  : null;

// Parse "dd.mm.yyyy" → Date object
function parseDate(s) {
  const [dd,mm,yy] = s.split('.').map(Number);
  return new Date(yy, mm-1, dd);
}

// Filter parsed results to only include dates strictly before maxDate (dd.mm.yyyy)
function filterByMaxDate(result, maxDateStr) {
  const maxDt = parseDate(maxDateStr);
  // Filter daily
  const filteredDaily = {};
  for (const [date, vals] of Object.entries(result.daily)) {
    if (parseDate(date) < maxDt) filteredDaily[date] = vals;
  }
  // Filter managers
  const filteredMgrs = [];
  for (const m of result.managers) {
    const newDaily = {};
    for (const [date, vals] of Object.entries(m.daily || {})) {
      if (parseDate(date) < maxDt) newDaily[date] = vals;
    }
    if (Object.keys(newDaily).length) {
      let l=0,d=0,b=0;
      for (const v of Object.values(newDaily)) { l+=v[0]||0; d+=v[1]||0; b+=v[2]||0; }
      filteredMgrs.push({ name: m.name, leads:l, deals:d, budget:Math.round(b),
        conv: l>0 ? +(d/l*100).toFixed(1) : 0, avgCheck: d>0 ? Math.round(b/d) : 0, daily: newDaily });
    }
  }
  filteredMgrs.sort((a,b) => b.budget - a.budget);
  // Filter cities
  const filteredCities = {};
  for (const [city, dailyData] of Object.entries(result.cities || {})) {
    const cd = {};
    for (const [date, vals] of Object.entries(dailyData)) {
      if (parseDate(date) < maxDt) cd[date] = vals;
    }
    if (Object.keys(cd).length) filteredCities[city] = cd;
  }
  return { daily: filteredDaily, managers: filteredMgrs, cross: result.cross, products: result.products, cities: filteredCities };
}

// Determine if a lead belongs to the KIDS pipeline
function isKidsPipeline(lead, acc) {
  if (!acc.kidsPipelineMatch || !acc._pipelineNames) return false;
  // Use lead.pipeline_id directly (status_id is NOT unique across pipelines — e.g. 142/143 are shared)
  const pipelineId = lead.pipeline_id;
  if (!pipelineId) return false;
  const pName = (acc._pipelineNames[pipelineId] || '').toUpperCase();
  return pName.includes(acc.kidsPipelineMatch.toUpperCase());
}

function parseLeads(leads, acc, statusMap, userMap, filterPipeline) {
  // filterPipeline: 'kids' | 'main' | null (all)
  const daily = {}, mgrs = {}, cross = {}, products = {}, cities = {}; // cities: { cityName: { deals: N, budget: N } }
  for (const lead of leads) {
    // Pipeline filtering
    if (filterPipeline) {
      const isKids = isKidsPipeline(lead, acc);
      if (filterPipeline === 'kids' && !isKids) continue;
      if (filterPipeline === 'main' && isKids) continue;
    }

    // Use pipeline-specific status name (shared IDs like 142/143 have different names per pipeline)
    const pipelineStatuses = acc._statusByPipeline && lead.pipeline_id ? acc._statusByPipeline[lead.pipeline_id] : null;
    const stage      = ((pipelineStatuses ? pipelineStatuses[lead.status_id] : null) || statusMap[lead.status_id] || '').toLowerCase();
    const validStage = VALID_STAGES.has(stage);
    const mgrName    = userMap[lead.responsible_user_id] || '';
    const budget     = lead.price || 0;
    const cDate      = lead.created_at ? fmtDate(lead.created_at) : null;
    const orderVal   = getField(lead, acc.orderDateFieldId);
    const oDate      = (orderVal && validStage) ? fmtDate(orderVal) : null;

    // Cross-product sales (only valid stages)
    if (validStage && oDate && acc.crossFields) {
      for (const [fieldName, fieldId] of Object.entries(acc.crossFields)) {
        const qty = parseInt(getField(lead, fieldId) || 0);
        if (qty > 0) {
          if (!cross[fieldName]) cross[fieldName] = {};
          cross[fieldName][oDate] = (cross[fieldName][oDate] || 0) + qty;
          // Also store in products as cross
          const key = '⊕ ' + fieldName;
          if (!products[key]) products[key] = { own: false, daily: {} };
          products[key].daily[oDate] = (products[key].daily[oDate] || 0) + qty;
        }
      }
    }
    // Own product quantities (only valid stages)
    if (validStage && oDate && acc.ownFields) {
      for (const [fieldName, fieldId] of Object.entries(acc.ownFields)) {
        const qty = parseInt(getField(lead, fieldId) || 0);
        if (qty > 0) {
          if (!products[fieldName]) products[fieldName] = { own: true, daily: {} };
          products[fieldName].daily[oDate] = (products[fieldName].daily[oDate] || 0) + qty;
        }
      }
    }

    if (cDate) {
      if (!daily[cDate]) daily[cDate] = [0,0,0];
      daily[cDate][0]++;
      if (mgrName) {
        if (!mgrs[mgrName]) mgrs[mgrName] = {leads:0,deals:0,budget:0,daily:{}};
        mgrs[mgrName].leads++;
        if (!mgrs[mgrName].daily[cDate]) mgrs[mgrName].daily[cDate] = [0,0,0];
        mgrs[mgrName].daily[cDate][0]++;
      }
    }
    if (oDate) {
      if (!daily[oDate]) daily[oDate] = [0,0,0];
      daily[oDate][1]++; daily[oDate][2] += budget;
      if (mgrName) {
        if (!mgrs[mgrName]) mgrs[mgrName] = {leads:0,deals:0,budget:0,daily:{}};
        mgrs[mgrName].deals++; mgrs[mgrName].budget += budget;
        if (!mgrs[mgrName].daily[oDate]) mgrs[mgrName].daily[oDate] = [0,0,0];
        mgrs[mgrName].daily[oDate][1]++; mgrs[mgrName].daily[oDate][2] += budget;
      }
      // Collect city from deal (with daily breakdown for period filtering)
      if (acc.cityFieldId) {
        const city = (getField(lead, acc.cityFieldId) || '').trim();
        if (city) {
          if (!cities[city]) cities[city] = {};
          if (!cities[city][oDate]) cities[city][oDate] = [0, 0];
          cities[city][oDate][0]++;
          cities[city][oDate][1] += budget;
        }
      }
    }
  }
  const managers = Object.entries(mgrs).map(([name,v]) => ({
    name, leads:v.leads, deals:v.deals, budget:Math.round(v.budget),
    conv: v.leads>0 ? +(v.deals/v.leads*100).toFixed(1) : 0,
    avgCheck: v.deals>0 ? Math.round(v.budget/v.deals) : 0,
    daily: v.daily,
  })).sort((a,b) => b.budget-a.budget);
  return { daily, managers, cross, products, cities };
}

// ── Supabase ─────────────────────────────────────────────────────
const sbHeaders = {
  'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json', 'Prefer': 'return=minimal',
};
const sbGet  = path => fetchJSON(`${SUPABASE_URL}/rest/v1/${path}`, { headers: sbHeaders });
const sbDel  = path => fetchJSON(`${SUPABASE_URL}/rest/v1/${path}`, { method:'DELETE', headers: sbHeaders });
const sbPost = (path, body) => fetchJSON(`${SUPABASE_URL}/rest/v1/${path}`, { method:'POST', headers: sbHeaders, body: JSON.stringify(body) });

async function sbSave(payload) {
  // Use PATCH (upsert) instead of DELETE+INSERT to avoid race conditions
  const body = JSON.stringify({ data: payload, updated_at: new Date().toISOString() });
  const res = await fetchJSON(`${SUPABASE_URL}/rest/v1/weglow_data?id=eq.1`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body
  });
  return res;
}

// ── Caches ───────────────────────────────────────────────────────
const statusCache = {}, fieldCache = {}, userCache = {};

// ── Main sync ────────────────────────────────────────────────────
let lastSync='', syncStatus='Ожидание...', syncErrors=[], isSyncing=false;

async function syncAll() {
  if (isSyncing) { console.log('[SKIP] Already syncing'); return; }
  isSyncing = true;
  const t0 = Date.now();
  console.log(`\n[${new Date().toISOString()}] ══ SYNC START ══`);
  syncErrors = [];
  const RAW = {}, MANAGERS = {}, CROSS_SALES = {}, PRODUCTS = {}, CITIES = {};

  for (const acc of ACCOUNTS) {
    try {
      if (!statusCache[acc.name]) { statusCache[acc.name] = await loadPipelines(acc); await sleep(200); }
      if (fieldCache[acc.name] === undefined) { fieldCache[acc.name] = await findOrderField(acc); await sleep(200); }
      if (!userCache[acc.name])  { userCache[acc.name]  = await loadUsers(acc);     await sleep(200); }
      acc.orderDateFieldId = fieldCache[acc.name];

      const leads = await fetchAllLeads(acc);

      if (acc.kidsPipelineMatch) {
        // Split leads by pipeline: main → Коллаген, kids → Ummi
        const mainResult = parseLeads(leads, acc, statusCache[acc.name], userCache[acc.name], 'main');
        const kidsResult = parseLeads(leads, acc, statusCache[acc.name], userCache[acc.name], 'kids');

        RAW[acc.name] = mainResult.daily; MANAGERS[acc.name] = mainResult.managers;
        CROSS_SALES[acc.name] = mainResult.cross; PRODUCTS[acc.name] = mainResult.products;

        RAW['Ummi'] = kidsResult.daily; MANAGERS['Ummi'] = kidsResult.managers;
        CROSS_SALES['Ummi'] = kidsResult.cross; PRODUCTS['Ummi'] = kidsResult.products;

        // Merge cities from both pipelines (daily format)
        for (const src of [mainResult.cities, kidsResult.cities]) {
          for (const [city, dailyData] of Object.entries(src || {})) {
            if (!CITIES[city]) CITIES[city] = {};
            for (const [date, vals] of Object.entries(dailyData)) {
              if (!CITIES[city][date]) CITIES[city][date] = [0, 0];
              CITIES[city][date][0] += vals[0]; CITIES[city][date][1] += vals[1];
            }
          }
        }

        const mainDeals  = mainResult.managers.reduce((s,m) => s+m.deals, 0);
        const mainBudget = mainResult.managers.reduce((s,m) => s+m.budget, 0);
        console.log(`[${acc.name}] ✅ ${Object.keys(mainResult.daily).length} дней | ${mainDeals} сделок | ${(mainBudget/1e6).toFixed(1)}M ₸`);

        const kidsDeals  = kidsResult.managers.reduce((s,m) => s+m.deals, 0);
        const kidsBudget = kidsResult.managers.reduce((s,m) => s+m.budget, 0);
        console.log(`[Ummi/KIDS] ✅ ${Object.keys(kidsResult.daily).length} дней | ${kidsDeals} сделок | ${(kidsBudget/1e6).toFixed(1)}M ₸`);
      } else {
        let parsed = parseLeads(leads, acc, statusCache[acc.name], userCache[acc.name], null);
        // Apply maxDate filter for archive accounts (e.g. "Кофе (Архив)" — only dates before cutoff)
        if (acc.maxDate) parsed = filterByMaxDate(parsed, acc.maxDate);
        const { daily, managers, cross, products, cities: accCities } = parsed;
        RAW[acc.name] = daily; MANAGERS[acc.name] = managers; CROSS_SALES[acc.name] = cross; PRODUCTS[acc.name] = products;
        for (const [city, dailyData] of Object.entries(accCities || {})) {
          if (!CITIES[city]) CITIES[city] = {};
          for (const [date, vals] of Object.entries(dailyData)) {
            if (!CITIES[city][date]) CITIES[city][date] = [0, 0];
            CITIES[city][date][0] += vals[0]; CITIES[city][date][1] += vals[1];
          }
        }

        const deals  = managers.reduce((s,m) => s+m.deals, 0);
        const budget = managers.reduce((s,m) => s+m.budget, 0);
        console.log(`[${acc.name}] ✅ ${Object.keys(daily).length} дней | ${deals} сделок | ${(budget/1e6).toFixed(1)}M ₸`);
      }
    } catch(e) {
      console.error(`[${acc.name}] ❌`, e.message);
      syncErrors.push(`${acc.name}: ${e.message}`);
      delete statusCache[acc.name]; delete fieldCache[acc.name]; delete userCache[acc.name];
    }
  }

  // Build MGR_TO_ROP from AmoCRM user groups (auto-detected)
  const MGR_TO_ROP_AUTO = {};
  for (const acc of ACCOUNTS) {
    const ug = acc._userGroups || {};
    const umap = userCache[acc.name] || {};
    for (const [uid, ropName] of Object.entries(ug)) {
      const mgrName = umap[uid];
      if (mgrName && ropName) MGR_TO_ROP_AUTO[mgrName] = ropName;
    }
  }
  // Hardcoded: БОТА AI is its own ROP group
  MGR_TO_ROP_AUTO['БОТА AI'] = 'БОТА AI';
  console.log(`[MGR_TO_ROP] ${Object.keys(MGR_TO_ROP_AUTO).length} managers mapped to ROPs`);

  // Preserve AD_SPEND, ROP_PLANS, MGR_TO_ROP, ARCHIVE, RNP_EXCEL from previous data
  let AD_SPEND = {}, ROP_PLANS = {}, prevMgrToRop = {};
  let ARCHIVE_RAW = {}, ARCHIVE_MANAGERS = {}, RNP_EXCEL = {}, AI_ADVICE = null;
  let preserveOk = false;
  try {
    const r = await sbGet('weglow_data?id=eq.1&select=data');
    if (r && r[0] && r[0].data) {
      if (r[0].data.AD_SPEND && Object.keys(r[0].data.AD_SPEND).length > 0) {
        // Fix corrupted UTF-8 keys (e.g. "Колл\uFFFDген" → "Коллаген")
        for (const [k, v] of Object.entries(r[0].data.AD_SPEND)) {
          const clean = k.replace(/\uFFFD/g, '');
          if (clean.includes('олл') && clean.includes('ген')) AD_SPEND['Коллаген'] = v;
          else AD_SPEND[k] = v;
        }
      }
      if (r[0].data.ROP_PLANS && Object.keys(r[0].data.ROP_PLANS).length > 0) ROP_PLANS = r[0].data.ROP_PLANS;
      if (r[0].data.MGR_TO_ROP) prevMgrToRop = r[0].data.MGR_TO_ROP;
      if (r[0].data.ARCHIVE_RAW) ARCHIVE_RAW = r[0].data.ARCHIVE_RAW;
      if (r[0].data.ARCHIVE_MANAGERS) ARCHIVE_MANAGERS = r[0].data.ARCHIVE_MANAGERS;
      if (r[0].data.RNP_EXCEL) RNP_EXCEL = r[0].data.RNP_EXCEL;
      if (r[0].data.AI_ADVICE) AI_ADVICE = r[0].data.AI_ADVICE;
      preserveOk = true;
      console.log(`[PRESERVE] AD_SPEND: ${Object.keys(AD_SPEND).length} keys, ROP_PLANS: ${Object.keys(ROP_PLANS).length} keys, ARCHIVE: ${Object.keys(ARCHIVE_RAW).length} accs, RNP_EXCEL: ${Object.keys(RNP_EXCEL).length} keys`);
    } else {
      console.warn('[PRESERVE] Supabase returned empty/null data, keeping previous values');
    }
  } catch(e) {
    console.error('[PRESERVE] Failed to read previous data:', e.message);
  }

  // Merge auto-detected MGR_TO_ROP with previous (keep old mappings for archived managers, auto wins on conflict)
  const finalMgrToRop = { ...prevMgrToRop, ...MGR_TO_ROP_AUTO };

  const savePayload = { RAW, MANAGERS, AD_SPEND, ROP_PLANS, MGR_TO_ROP: finalMgrToRop, CROSS_SALES, PRODUCTS, CITIES, ARCHIVE_RAW, ARCHIVE_MANAGERS, RNP_EXCEL, updatedAt: new Date().toISOString() };
  console.log(`[Cities] ${Object.keys(CITIES).length} городов: ${Object.entries(CITIES).sort((a,b)=>b[1].deals-a[1].deals).slice(0,5).map(([c,v])=>`${c}(${v.deals})`).join(', ')}`);
  if (AI_ADVICE) savePayload.AI_ADVICE = AI_ADVICE;
  await sbSave(savePayload);

  const elapsed = ((Date.now()-t0)/1000).toFixed(1);
  lastSync = new Date().toISOString();
  syncStatus = syncErrors.length ? `Частично за ${elapsed}с (${syncErrors.length} ошибок)` : `✅ OK за ${elapsed}с`;
  console.log(`[DONE] ${syncStatus}\n`);
  isSyncing = false;
}

// ── HTTP Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/sync') {
    syncAll().catch(console.error);
    res.end(JSON.stringify({ message: 'Sync triggered' }));
    return;
  }
  if (req.url === '/clear-cache') {
    ACCOUNTS.forEach(a => { delete statusCache[a.name]; delete fieldCache[a.name]; delete userCache[a.name]; });
    res.end(JSON.stringify({ message: 'Cache cleared' }));
    return;
  }

  res.end(JSON.stringify({
    status: isSyncing ? '⏳ syncing' : '✅ idle',
    lastSync, syncStatus, syncErrors,
    nextSync: lastSync ? new Date(new Date(lastSync).getTime() + SYNC_INTERVAL_MS).toISOString() : 'soon',
    accounts: ACCOUNTS.map(a => ({
      name: a.name, domain: a.domain,
      orderDateFieldId: fieldCache[a.name] ?? 'не найдено',
      statuses: Object.keys(statusCache[a.name]||{}).length,
      users:    Object.keys(userCache[a.name]||{}).length,
    })),
    endpoints: { status:'GET /', sync:'GET /sync', clearCache:'GET /clear-cache' }
  }, null, 2));
}).listen(PORT, () => {
  console.log(`🚀 WeGlow AutoSync | port ${PORT} | interval ${SYNC_INTERVAL_MS/1000}s`);
  syncAll();
  setInterval(syncAll, SYNC_INTERVAL_MS);
});
