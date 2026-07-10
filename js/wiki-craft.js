/**
 * Wiki 製作百科模組
 * 讀取遊戲原始 CRAFT_RECIPES 資料，依 NPC（城鎮）分組展示製作配方。
 */

// ==========================================
// NPC 中文名稱與所在城鎮對應表
// ==========================================
const CRAFT_NPC_INFO = {
    npc_moli:         { name: '茉莉',         location: '銀騎士村',   title: '製作',        icon: 'fa-hammer',           color: 'text-amber-400' },
    npc_finn:         { name: '芬',           location: '銀騎士村',   title: '製作',        icon: 'fa-hammer',           color: 'text-amber-400' },
    npc_joel:         { name: '喬爾',         location: '銀騎士村',   title: '製作',        icon: 'fa-hammer',           color: 'text-amber-400' },
    npc_falin:        { name: '法林',         location: '說話之島',   title: '製作',        icon: 'fa-hammer',           color: 'text-amber-400' },
    npc_ryan:         { name: '萊恩',         location: '說話之島',   title: '製作',        icon: 'fa-hammer',           color: 'text-amber-400' },
    npc_ladal:        { name: '拉達爾',       location: '說話之島',   title: '製作',        icon: 'fa-hammer',           color: 'text-amber-400' },
    npc_rabiani:      { name: '拉比安尼',     location: '說話之島',   title: '製作',        icon: 'fa-book',             color: 'text-yellow-300' },
    npc_nalien:       { name: '那翰',         location: '妖精森林',   title: '製作',        icon: 'fa-music',            color: 'text-green-400' },
    npc_narupa:       { name: '娜魯帕',       location: '妖精森林',   title: '製作',        icon: 'fa-leaf',             color: 'text-green-400' },
    npc_elfqueen:     { name: '精靈女皇',     location: '妖精森林',   title: '製作',        icon: 'fa-crown',            color: 'text-emerald-300' },
    npc_elf:          { name: '精靈',         location: '妖精森林',   title: '製作',        icon: 'fa-leaf',             color: 'text-green-300' },
    npc_ent:          { name: '安特',         location: '妖精森林',   title: '製作',        icon: 'fa-tree',             color: 'text-green-600' },
    npc_pan:          { name: '潘',           location: '妖精森林',   title: '製作',        icon: 'fa-fire-flame-curved',color: 'text-orange-400' },
    npc_rekne:        { name: '芮克妮',       location: '妖精森林',   title: '製作',        icon: 'fa-spider',           color: 'text-purple-400' },
    npc_brabo:        { name: '布拉伯',       location: '妖精森林',   title: '製作',        icon: 'fa-sword',            color: 'text-blue-400' },
    npc_robinson:     { name: '羅賓孫',       location: '妖精森林',   title: '製作',        icon: 'fa-bow-arrow',        color: 'text-red-400' },
    npc_moliya:       { name: '莫麗雅',       location: '奇岩',       title: '製作',        icon: 'fa-hat-wizard',       color: 'text-purple-400' },
    npc_hector:       { name: '海克特',       location: '奇岩',       title: '製作',        icon: 'fa-hammer',           color: 'text-slate-400' },
    npc_herbert:      { name: '哈巴特',       location: '奇岩',       title: '製作',        icon: 'fa-scissors',         color: 'text-pink-400' },
    npc_lentis:       { name: '倫提斯',       location: '奇岩',       title: '製作',        icon: 'fa-ring',             color: 'text-cyan-400' },
    npc_sebas:        { name: '賽巴斯',       location: '奇岩',       title: '寶石加工',    icon: 'fa-gem',              color: 'text-sky-400' },
    npc_lumiel:       { name: '琉米埃爾',     location: '海音',       title: '製作',        icon: 'fa-star',             color: 'text-blue-300' },
    npc_ibelbin:      { name: '伊貝爾賓',     location: '歐瑞村莊',   title: '製作',        icon: 'fa-khanda',           color: 'text-red-400' },
    npc_david:        { name: '大衛',         location: '歐瑞村莊',   title: '寶石加工',    icon: 'fa-gem',              color: 'text-cyan-300' },
    npc_upni:         { name: '烏普尼',       location: '亞丁',       title: '製作',        icon: 'fa-scroll',           color: 'text-yellow-400' },
    npc_norse:        { name: '諾斯',         location: '亞丁',       title: '寵物裝備製作',icon: 'fa-paw',              color: 'text-orange-300' },
    npc_bamut:        { name: '巴姆特',       location: '傲慢之塔入口',title: '製作',       icon: 'fa-cloak',            color: 'text-violet-400' },
    npc_tas:          { name: '塔斯',         location: '象牙塔',     title: '製作',        icon: 'fa-flask',            color: 'text-lime-400' },
    npc_dytite:       { name: '迪泰特',       location: '象牙塔',     title: '解除封印',    icon: 'fa-unlock',           color: 'text-indigo-400' },
    npc_mystic_mage:  { name: '神秘的魔法師', location: '象牙塔',     title: '魔杖改造',    icon: 'fa-wand-sparkles',    color: 'text-violet-400' },
    npc_keluya:       { name: '客盧亞',       location: '威頓村',     title: '製作',        icon: 'fa-hammer',           color: 'text-amber-300' },
    npc_zeus_golem:   { name: '宙斯之熔岩高崙',location:'威頓村',    title: '製作',        icon: 'fa-mountain-sun',     color: 'text-orange-500' },
    npc_bartel:       { name: '巴特爾',       location: '希培利亞村莊',title: '製作',       icon: 'fa-gem',              color: 'text-violet-300' },
    npc_pir:          { name: '皮爾',         location: '貝希摩斯',   title: '製作',        icon: 'fa-fire',             color: 'text-red-500' },
    npc_kupu:         { name: '庫普',         location: '沉默洞穴',   title: '製作',        icon: 'fa-hammer',           color: 'text-gray-400' },
    npc_kororanz:     { name: '可羅蘭斯',     location: '沉默洞穴',   title: '製作',        icon: 'fa-book-skull',       color: 'text-slate-300' },
    npc_flame_shadow: { name: '炎魔之影',     location: '炎魔謁見所', title: '製作',        icon: 'fa-fire',             color: 'text-red-400' },
    npc_imp:          { name: '小惡魔',       location: '炎魔謁見所', title: '製作',        icon: 'fa-spider',           color: 'text-red-300' },
    npc_flame_smith:  { name: '炎魔鐵匠',     location: '炎魔謁見所', title: '製作',        icon: 'fa-hammer',           color: 'text-orange-500' },
    npc_flame_aide:   { name: '炎魔的輔佐官', location: '炎魔謁見所', title: '耳環製作',    icon: 'fa-earring',          color: 'text-pink-400' },
};

// ==========================================
// 城鎮分組順序
// ==========================================
const TOWN_ORDER = [
    '銀騎士村', '說話之島', '妖精森林',
    '奇岩', '海音', '歐瑞村莊', '亞丁',
    '傲慢之塔入口', '象牙塔', '威頓村',
    '希培利亞村莊', '貝希摩斯', '沉默洞穴',
    '炎魔謁見所', '席琳神殿'
];

// ==========================================
// 輔助函數
// ==========================================

/** 取得物品名稱（優先查 DB） */
function craftGetItemName(id) {
    if (!id) return id;
    if (id === 'gold') return '💰 金幣';
    if (typeof DB !== 'undefined' && DB.items && DB.items[id]) {
        return DB.items[id].n;
    }
    return id;
}

/** 取得物品圖示顏色 class */
function craftGetItemColorClass(id) {
    if (!id || id === 'gold') return 'text-yellow-400';
    if (typeof DB !== 'undefined' && DB.items && DB.items[id]) {
        const item = DB.items[id];
        if (item.grade === 'legend' || item.gr === 'legend') return 'text-orange-400';
        if (item.grade === 'rare'   || item.gr === 'rare')   return 'text-yellow-400';
        if (item.grade === 'magic'  || item.gr === 'magic')  return 'text-blue-400';
        if (item.type === 'wpn') return 'text-red-300';
        if (item.type === 'arm') return 'text-blue-300';
        if (item.type === 'acc') return 'text-purple-300';
    }
    return 'text-gray-300';
}

/** 取得物品圖示路徑 */
function craftGetItemIconPath(id) {
    if (!id || id === 'gold') return '';
    if (typeof DB !== 'undefined' && DB.items && DB.items[id]) {
        const item = DB.items[id];
        if (typeof getItemIconPath === 'function') {
            return getItemIconPath(item);
        }
    }
    return `idle-lineage-class/assets/icons/items/${encodeURIComponent(id)}.png`;
}

// ──────────────────────────────────────────────────────────────────────────────
// 懶載入的查詢索引（初次呼叫時建立，之後快取）
// ──────────────────────────────────────────────────────────────────────────────
let _craftDropIndex = null;   // itemId → [{mobName, chance, maps[]}]
let _craftNpcIndex  = null;   // itemId → [{npcName, npcLocation}]

/** 建立掉落查詢索引（只在 DB & MOB_DROPS 均已載入後執行一次） */
function _buildCraftDropIndex() {
    if (_craftDropIndex) return;   // 已建立則跳過

    if (typeof MOB_DROPS === 'undefined' || typeof DB === 'undefined' || !DB.mobs || !DB.maps) return;

    // 1. 建立「怪物名稱 → 怪物 ID 列表」反查表（DB.mobs key 是 ID，value.n 是名稱）
    const nameToIds = {};
    for (const [mobId, mob] of Object.entries(DB.mobs)) {
        const n = mob.n;
        if (!nameToIds[n]) nameToIds[n] = [];
        nameToIds[n].push(mobId);
    }

    // 2. 建立「怪物 ID → 地圖名稱列表」正查表
    const mobIdToMapNames = {};
    for (const [mapKey, mobList] of Object.entries(DB.maps)) {
        const mapName = (typeof mapNameTranslations !== 'undefined' && mapNameTranslations[mapKey])
            ? mapNameTranslations[mapKey]
            : (typeof wikiMapNames !== 'undefined' && wikiMapNames[mapKey])
                ? wikiMapNames[mapKey]
                : (DB.towns && DB.towns[mapKey] ? DB.towns[mapKey].n : mapKey);
        for (const mobId of mobList) {
            if (!mobIdToMapNames[mobId]) mobIdToMapNames[mobId] = [];
            if (!mobIdToMapNames[mobId].includes(mapName)) mobIdToMapNames[mobId].push(mapName);
        }
    }

    // 3. 遍歷 MOB_DROPS（key = 怪物名稱）建立 itemId → sources 索引
    const idx = {};
    for (const [mobName, drops] of Object.entries(MOB_DROPS)) {
        // 找到對應的怪物 ID 列表
        const mobIds = nameToIds[mobName] || [];

        // 收集該怪物出現的所有地圖（合併多個同名怪物的地圖）
        const maps = [];
        for (const mid of mobIds) {
            for (const mn of (mobIdToMapNames[mid] || [])) {
                if (!maps.includes(mn)) maps.push(mn);
            }
        }

        for (const [dropItemId, chance] of drops) {
            if (!idx[dropItemId]) idx[dropItemId] = [];
            idx[dropItemId].push({ mobName, chance, maps });
        }
    }

    // 4. 各物品的來源按機率由高到低排序
    for (const key of Object.keys(idx)) {
        idx[key].sort((a, b) => b.chance - a.chance);
    }

    _craftDropIndex = idx;
}

/** 建立「物品 → NPC 製作來源」索引（只建立一次） */
function _buildCraftNpcIndex() {
    if (_craftNpcIndex) return;
    if (typeof CRAFT_RECIPES === 'undefined') return;

    const idx = {};
    for (const [npcId, recipes] of Object.entries(CRAFT_RECIPES)) {
        const info = (typeof CRAFT_NPC_INFO !== 'undefined') ? CRAFT_NPC_INFO[npcId] : null;
        const npcName     = info ? info.name     : npcId;
        const npcLocation = info ? info.location : '';
        for (const recipe of recipes) {
            const rid = recipe.result;
            if (!idx[rid]) idx[rid] = [];
            // 同一 NPC 只記一次
            if (!idx[rid].find(e => e.npcId === npcId)) {
                idx[rid].push({ npcId, npcName, npcLocation });
            }
        }
    }
    _craftNpcIndex = idx;
}

/** 取得材料取得來源的 Tooltip HTML（掉落 + 製作） */
function craftGetMaterialTooltipHtml(itemId) {
    if (typeof DB === 'undefined') return '';

    // 確保索引已建立
    _buildCraftDropIndex();
    _buildCraftNpcIndex();

    // ── 掉落來源 ──────────────────────────────────────────────────────────────
    const dropSources = (_craftDropIndex && _craftDropIndex[itemId]) ? _craftDropIndex[itemId] : [];
    const topDrops    = dropSources.slice(0, 8);

    // ── NPC 製作來源 ───────────────────────────────────────────────────────────
    const npcSources = (_craftNpcIndex && _craftNpcIndex[itemId]) ? _craftNpcIndex[itemId] : [];

    // 若兩者皆無，不顯示 tooltip
    if (dropSources.length === 0 && npcSources.length === 0) return '';

    let html = '<div class="font-bold text-white mb-2 border-b border-gray-700 pb-1 text-sm flex items-center gap-2">'
             + '<i class="fa-solid fa-magnifying-glass-location text-primary-400"></i>取得來源</div>';

    // ── 渲染掉落清單 ──────────────────────────────────────────────────────────
    if (topDrops.length > 0) {
        html += '<ul class="space-y-1.5">';
        topDrops.forEach(s => {
            // 遊戲內機率值：有的是 0~100 範圍，有的是 0~1 範圍；依數值大小自動判斷
            const rawChance   = s.chance;
            const pct         = rawChance > 1 ? rawChance : rawChance * 100;
            const decimals    = pct < 0.1 ? 3 : pct < 1 ? 2 : pct < 10 ? 1 : 0;
            const chancePct   = pct.toFixed(decimals) + '%';
            const mapsStr     = s.maps.length > 0 ? s.maps.slice(0, 3).join('、') : '未知地圖';
            const moreMapsTip = s.maps.length > 3 ? ` 等 ${s.maps.length} 個地圖` : '';
            html += `
                <li class="flex flex-col gap-0.5">
                    <div class="flex justify-between items-center text-[12px]">
                        <span class="text-gray-200 font-medium truncate max-w-[11rem]">${s.mobName}</span>
                        <span class="text-green-400 font-mono shrink-0 ml-2">${chancePct}</span>
                    </div>
                    <div class="text-[11px] text-gray-400 leading-tight truncate">
                        <i class="fa-solid fa-location-dot mr-1 opacity-60"></i>${mapsStr}${moreMapsTip}
                    </div>
                </li>`;
        });
        html += '</ul>';

        if (dropSources.length > 8) {
            html += `<div class="text-[11px] text-gray-500 text-center mt-2 pt-1.5 border-t border-gray-700/50">`
                  + `還有 ${dropSources.length - 8} 個怪物來源未顯示</div>`;
        }
    }

    // ── 渲染 NPC 製作清單 ────────────────────────────────────────────────────
    if (npcSources.length > 0) {
        if (topDrops.length > 0) {
            html += '<div class="border-t border-gray-700/60 my-2"></div>';
        }
        html += '<div class="text-[11px] text-amber-400 font-semibold mb-1 flex items-center gap-1">'
              + '<i class="fa-solid fa-hammer opacity-80"></i> NPC 製作</div>';
        html += '<ul class="space-y-0.5">';
        npcSources.forEach(n => {
            html += `<li class="text-[12px] text-gray-300 flex items-center gap-1.5">
                        <i class="fa-solid fa-location-dot text-[10px] text-primary-400 opacity-70"></i>
                        <span class="font-medium text-amber-300">${n.npcName}</span>
                        ${n.npcLocation ? `<span class="text-gray-500">・${n.npcLocation}</span>` : ''}
                     </li>`;
        });
        html += '</ul>';
    }

    return html;
}

/** 渲染材料清單 */
function craftRenderRequirements(req) {
    if (!req || !req.length) return '<span class="text-gray-500">無需材料</span>';
    return req.map(r => {
        // 特殊材料：魔杖改造所需的 +7 以上來源魔杖
        if (r._special && r._displayName) {
            return `<span class="inline-flex items-center gap-1 bg-violet-900/30 text-violet-300 text-xs px-2 py-1 rounded border border-violet-700/40 mr-1 mb-1" title="需要 +7 強化值以上的來源魔杖（不繼承強化值／屬性至成品）">
                        <i class="fa-solid fa-wand-sparkles text-violet-400"></i> ${r._displayName}
                    </span>`;
        }
        if (r.id === 'gold') {
            return `<span class="inline-flex items-center gap-1 bg-yellow-900/30 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-700/40 mr-1 mb-1">
                        <i class="fa-solid fa-coins text-yellow-400"></i> ${r.cnt.toLocaleString()} 金幣
                    </span>`;
        }
        const name = craftGetItemName(r.id);
        const colorCls = craftGetItemColorClass(r.id);
        const iconPath = craftGetItemIconPath(r.id);
        const iconHtml = iconPath ? `<img src="./${iconPath}" class="w-4 h-4 object-contain inline-block" onerror="this.style.display='none'">` : '';
        
        const tooltipHtml = craftGetMaterialTooltipHtml(r.id);
        
        if (tooltipHtml) {
            return `<div class="relative group/material cursor-help inline-block mr-1 mb-1">
                        <span class="inline-flex items-center gap-1 bg-gray-800/60 ${colorCls} text-xs px-2 py-1 rounded border border-gray-700/40 w-full hover:bg-gray-700/80 transition-colors">
                            ${iconHtml}${name} <span class="text-gray-500">×${r.cnt}</span>
                        </span>
                        <!-- 漂浮視窗 Tooltip -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/material:block w-64 p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-50 pointer-events-none opacity-0 group-hover/material:opacity-100 transition-opacity duration-200" style="min-width: 16rem;">
                            ${tooltipHtml}
                            <!-- 下方箭頭 -->
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-600"></div>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-gray-900/95 mt-[-1px]"></div>
                        </div>
                    </div>`;
        } else {
            return `<span class="inline-flex items-center gap-1 bg-gray-800/60 ${colorCls} text-xs px-2 py-1 rounded border border-gray-700/40 mr-1 mb-1" title="${r.id}">
                        ${iconHtml}${name} <span class="text-gray-500">×${r.cnt}</span>
                    </span>`;
        }
    }).join('');
}

/** 渲染成品徽章 */
function craftRenderResultBadge(resultId, yieldCnt) {
    const name = craftGetItemName(resultId);
    const colorCls = craftGetItemColorClass(resultId);
    const yieldTag = yieldCnt && yieldCnt > 1
        ? `<span class="ml-1 bg-yellow-500/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded">×${yieldCnt}</span>`
        : '';
    return `<span class="${colorCls} font-bold text-sm">${name}</span>${yieldTag}`;
}

// ==========================================
// 主渲染函數
// ==========================================

function renderCraftWiki() {
    const container = document.getElementById('craft-sections-container');
    if (!container) return;

    // 若 CRAFT_RECIPES 尚未載入則跳出
    if (typeof CRAFT_RECIPES === 'undefined') {
        container.innerHTML = `<div class="text-center text-gray-500 mt-20">
            <i class="fa-solid fa-circle-exclamation text-4xl mb-3"></i>
            <p>製作配方資料尚未載入</p>
        </div>`;
        return;
    }

    // 注入特殊任務兌換到 CRAFT_RECIPES 中
    if (typeof CRAFT_RECIPES !== 'undefined' && typeof CRAFT_NPC_INFO !== 'undefined') {
        const injectRecipes = (npcId, npcData, recipes) => {
            if (!CRAFT_NPC_INFO[npcId]) CRAFT_NPC_INFO[npcId] = npcData;
            if (!CRAFT_RECIPES[npcId]) CRAFT_RECIPES[npcId] = [];
            recipes.forEach(r => {
                if (!CRAFT_RECIPES[npcId].some(cr => cr.result === r.result)) {
                    CRAFT_RECIPES[npcId].push(r);
                }
            });
        };

        // 1. 尤麗婭 (歐林的日記本 / 黑暗哈汀的日記本)
        const yuriaRecipes = [];
        if (typeof YURIA_REWARDS !== 'undefined') {
            YURIA_REWARDS.forEach(r => yuriaRecipes.push({ result: r.id, req: [{ id: 'item_olin_diary', cnt: 1 }] }));
        }
        if (typeof YURIA_HATIN_REWARDS !== 'undefined') {
            YURIA_HATIN_REWARDS.forEach(r => yuriaRecipes.push({ result: r.id, req: [{ id: 'item_hatin_diary', cnt: 1 }] }));
        }
        if (yuriaRecipes.length > 0) injectRecipes('npc_yuria', { name: '尤麗婭', location: '說話之島', title: '任務兌換', icon: 'fa-book-skull', color: 'text-purple-400' }, yuriaRecipes);

        // 2. 希米哲 (藍海賊遺物)
        if (typeof SHIMIZHE_REWARDS !== 'undefined' && typeof SHIMIZHE_COST !== 'undefined') {
            const shimizheRecipes = SHIMIZHE_REWARDS.map(rId => ({ result: rId, req: SHIMIZHE_COST.map(c => ({ id: c[0], cnt: c[1] })) }));
            injectRecipes('npc_shimizhe', { name: '希米哲', location: '海賊島村莊', title: '任務兌換', icon: 'fa-skull-crossbones', color: 'text-blue-400' }, shimizheRecipes);
        }

        // 3. 雷德 (召喚控制戒指)
        if (typeof RED_QUEST_REQS !== 'undefined') {
            injectRecipes('npc_red', { name: '雷德', location: '特殊任務', title: '雷德的復仇', icon: 'fa-ring', color: 'text-red-400' }, [{ result: 'acc_summon_ctrl', req: RED_QUEST_REQS.map(c => ({ id: c[0], cnt: c[1] })) }]);
        }

        // 4. 50級試煉兌換
        if (typeof TRIAL_50_CFG !== 'undefined') {
            Object.values(TRIAL_50_CFG).forEach(cfg => {
                const npcId = 'npc_trial50_' + cfg.npc;
                const recipes = cfg.rewards.map(r => ({ result: r.id, req: [{ id: cfg.exMat, cnt: cfg.exMatCnt || 1 }] }));
                injectRecipes(npcId, { name: cfg.npc, location: '50級試煉', title: '試煉兌換', icon: 'fa-scroll', color: 'text-amber-400' }, recipes);
            });
        }

        // 5. 一般試煉任務 (TRIAL_Q)
        if (typeof TRIAL_Q !== 'undefined') {
            Object.values(TRIAL_Q).forEach(qData => {
                const npcId = 'npc_trial_' + qData.npc;
                const reqs = qData.reqs.map(c => ({ id: c[0], cnt: c[1] }));
                const recipes = qData.rewards.map(rId => ({ result: rId, req: reqs }));
                injectRecipes(npcId, { name: qData.npc, location: '各級別試煉', title: `試煉任務`, icon: 'fa-scroll', color: 'text-emerald-400' }, recipes);
            });
        }

        // 6. 伊奧 (席琳遺骸兌換)
        if (typeof SHERINE_REMAINS !== 'undefined') {
            const ioRecipes = SHERINE_REMAINS.map(r => ({ result: r.id, req: [{ id: 'sherine_crystal', cnt: 1 }] }));
            injectRecipes('npc_io', { name: '伊奧', location: '席琳神殿', title: '遺骸兌換', icon: 'fa-bone', color: 'text-purple-400' }, ioRecipes);
        }

        // 7. 神秘的魔法師 (鋼鐵瑪那魔杖・魔杖改造)
        if (typeof MYSTICWAND_RECIPES !== 'undefined' && typeof MYSTICWAND_MATS !== 'undefined') {
            const mysticWandRecipes = MYSTICWAND_RECIPES.map(r => ({
                result: r.result,
                req: [
                    ...MYSTICWAND_MATS.map(m => ({ id: m.id, cnt: m.cnt })),
                    { id: `_wand_src_${r.src}`, cnt: 1, _displayName: `+7以上 ${r.srcName} ×1`, _special: true }
                ]
            }));
            if (!CRAFT_RECIPES['npc_mystic_mage']) CRAFT_RECIPES['npc_mystic_mage'] = [];
            mysticWandRecipes.forEach(r => {
                if (!CRAFT_RECIPES['npc_mystic_mage'].some(cr => cr.result === r.result)) {
                    CRAFT_RECIPES['npc_mystic_mage'].push(r);
                }
            });
        }
    }

    // 依城鎮分組 NPC
    const townMap = {}; // location -> [{npcId, npcInfo, recipes}]
    Object.entries(CRAFT_RECIPES).forEach(([npcId, recipes]) => {
        const info = CRAFT_NPC_INFO[npcId];
        if (!info) return; // 未登記的 NPC 略過
        const loc = info.location;
        if (!townMap[loc]) townMap[loc] = [];
        townMap[loc].push({ npcId, info, recipes });
    });

    // 按城鎮順序渲染
    let html = '';
    const orderedTowns = [...TOWN_ORDER.filter(t => townMap[t]), ...Object.keys(townMap).filter(t => !TOWN_ORDER.includes(t))];

    orderedTowns.forEach(town => {
        const npcs = townMap[town];
        if (!npcs || !npcs.length) return;

        html += `
        <div class="craft-town-section mb-8" data-town="${town}">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                <i class="fa-solid fa-location-dot text-primary-400"></i>
                <span>${town}</span>
                <span class="text-xs text-gray-500 font-normal ml-2">${npcs.length} 位製作 NPC</span>
            </h2>
            <div class="flex flex-col gap-5">
        `;

        npcs.forEach(({ npcId, info, recipes }) => {
            const npcData = (typeof DB !== 'undefined' && DB.towns)
                ? (() => {
                    for (const town of Object.values(DB.towns)) {
                        const npc = (town.npcs || []).find(n => n.id === npcId);
                        if (npc) return npc;
                    }
                    return null;
                })()
                : null;
            const npcDesc = npcData ? npcData.d : '';

            html += `
            <div class="glass-panel rounded-xl border border-gray-700/50 craft-npc-card" data-npc-id="${npcId}">
                <!-- NPC Header -->
                <div class="flex items-center gap-3 px-5 py-4 bg-gray-800/50 border-b border-gray-700/50 rounded-t-xl">
                    <div class="w-10 h-10 rounded-full bg-gray-900/70 flex items-center justify-center border border-gray-600 flex-shrink-0">
                        <i class="fa-solid ${info.icon} ${info.color} text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-bold text-white text-base">${info.name}</span>
                            <span class="text-xs bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full border border-gray-600/50">${info.title}</span>
                            <span class="text-xs text-gray-500">${recipes.length} 個配方</span>
                        </div>
                        ${npcDesc ? `<p class="text-xs text-gray-400 mt-0.5 leading-relaxed truncate" title="${npcDesc}">${npcDesc}</p>` : ''}
                    </div>
                </div>

                <!-- 配方列表 -->
                <div class="divide-y divide-gray-800/50">
            `;

            recipes.forEach((recipe, idx) => {
                const resultName = craftGetItemName(recipe.result);
                const resultColorCls = craftGetItemColorClass(recipe.result);
                const yieldCnt = recipe.yield || 1;
                const yieldTag = yieldCnt > 1
                    ? `<span class="ml-2 bg-yellow-500/20 text-yellow-400 text-xs px-1.5 py-0.5 rounded">×${yieldCnt}</span>`
                    : '';
                const reqHtml = craftRenderRequirements(recipe.req);
                const resultIconPath = craftGetItemIconPath(recipe.result);
                const resultIconHtml = resultIconPath 
                    ? `<img src="./${resultIconPath}" class="w-8 h-8 object-contain" onerror="this.outerHTML='<i class=\\\'fa-solid fa-box text-gray-500 text-sm\\\'></i>'">`
                    : `<i class="fa-solid fa-box text-gray-500 text-sm"></i>`;

                html += `
                <div class="craft-recipe-row flex flex-col sm:flex-row sm:items-start gap-3 px-5 py-4 hover:bg-gray-800/30 transition-colors last:rounded-b-xl" data-recipe-idx="${idx}">
                    <!-- 成品 -->
                    <div class="flex items-center gap-3 sm:w-56 flex-shrink-0">
                        <div class="w-10 h-10 bg-gray-900/70 rounded-lg border border-gray-700/50 flex items-center justify-center flex-shrink-0">
                            ${resultIconHtml}
                        </div>
                        <div>
                            <div class="flex items-center flex-wrap">
                                <span class="${resultColorCls} font-semibold text-sm">${resultName}</span>${yieldTag}
                            </div>
                            <div class="text-xs text-gray-600 mt-0.5">${recipe.result}</div>
                        </div>
                    </div>

                    <!-- 箭頭 -->
                    <div class="hidden sm:flex items-center text-gray-600 mt-3">
                        <i class="fa-solid fa-arrow-right-long"></i>
                    </div>

                    <!-- 材料 -->
                    <div class="flex-1">
                        <div class="text-xs text-gray-500 mb-1">所需材料</div>
                        <div class="flex flex-wrap">${reqHtml}</div>
                    </div>
                </div>
                `;
            });

            html += `
                </div>
            </div>
            `;
        });

        html += `
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

// ==========================================
// 搜尋功能
// ==========================================
let craftSearchQuery = '';

function filterCraftRecipes(query) {
    craftSearchQuery = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.craft-npc-card');
    const townSections = document.querySelectorAll('.craft-town-section');

    cards.forEach(card => {
        const npcId = card.getAttribute('data-npc-id');
        const info = CRAFT_NPC_INFO[npcId];
        const npcName = info ? info.name : '';
        const npcLocation = info ? info.location : '';

        const rows = card.querySelectorAll('.craft-recipe-row');
        let cardVisible = false;

        if (!craftSearchQuery) {
            rows.forEach(row => row.classList.remove('hidden'));
            cardVisible = true;
        } else {
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(craftSearchQuery) || npcName.toLowerCase().includes(craftSearchQuery) || npcLocation.toLowerCase().includes(craftSearchQuery)) {
                    row.classList.remove('hidden');
                    cardVisible = true;
                } else {
                    row.classList.add('hidden');
                }
            });
        }

        card.style.display = cardVisible ? '' : 'none';
    });

    // 隱藏空城鎮區塊
    townSections.forEach(section => {
        const hasVisible = Array.from(section.querySelectorAll('.craft-npc-card')).some(c => c.style.display !== 'none');
        section.style.display = hasVisible ? '' : 'none';
    });

    // 更新空狀態提示
    const emptyState = document.getElementById('craft-empty-state');
    const container = document.getElementById('craft-sections-container');
    const anyVisible = Array.from(townSections).some(s => s.style.display !== 'none');
    if (emptyState) emptyState.classList.toggle('hidden', anyVisible);
    if (container) container.classList.toggle('hidden', !anyVisible);
}

// ==========================================
// 城鎮/NPC 過濾
// ==========================================
let craftActiveTownFilter = 'all';

function setCraftTownFilter(town) {
    craftActiveTownFilter = town;
    document.querySelectorAll('.craft-town-filter-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-town') === town;
        btn.classList.toggle('bg-primary-600', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-800', !isActive);
        btn.classList.toggle('text-gray-300', !isActive);
        btn.classList.toggle('border-gray-700', !isActive);
    });

    document.querySelectorAll('.craft-town-section').forEach(section => {
        if (town === 'all' || section.getAttribute('data-town') === town) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

function buildCraftTownFilters() {
    const filtersEl = document.getElementById('craft-town-filters');
    if (!filtersEl) return;

    // 取得存在配方的城鎮
    const towns = [...new Set(Object.keys(CRAFT_RECIPES).map(npcId => {
        const info = CRAFT_NPC_INFO[npcId];
        return info ? info.location : null;
    }).filter(Boolean))];
    const orderedTowns = [...TOWN_ORDER.filter(t => towns.includes(t)), ...towns.filter(t => !TOWN_ORDER.includes(t))];

    let html = `<button data-town="all" class="craft-town-filter-btn px-3 py-1.5 rounded-full bg-primary-600 text-white text-xs font-medium transition-colors border border-transparent">全部城鎮</button>`;
    orderedTowns.forEach(town => {
        html += `<button data-town="${town}" class="craft-town-filter-btn px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs font-medium transition-colors border border-gray-700">${town}</button>`;
    });

    filtersEl.innerHTML = html;

    filtersEl.querySelectorAll('.craft-town-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setCraftTownFilter(btn.getAttribute('data-town')));
    });
}

// 初始化
let _craftWikiInited = false;

function initCraftWiki() {
    if (_craftWikiInited) return;
    _craftWikiInited = true;

    renderCraftWiki();
    buildCraftTownFilters();

    // 搜尋欄監聽
    const searchInput = document.getElementById('craft-search');
    if (searchInput) {
        searchInput.addEventListener('input', e => filterCraftRecipes(e.target.value));
    }

    // 全域搜尋欄（tab 切換時連動）
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('input', e => {
            const craftSearchBar = document.getElementById('craft-search');
            if (craftSearchBar && document.getElementById('tab-craft')?.classList.contains('active')) {
                craftSearchBar.value = e.target.value;
                filterCraftRecipes(e.target.value);
            }
        });
    }
}

// 監聽 tab 切換事件
document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-craft') {
        setTimeout(initCraftWiki, 50);
    }
});

// 當所有資料載入完成時，如果目前在製作百科分頁，就進行初始化
document.addEventListener('wikiDataLoaded', () => {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-target') === 'tab-craft') {
        initCraftWiki();
    }
});

// 腳本載入當下也檢查一次
if (document.querySelector('.tab-btn.active')?.getAttribute('data-target') === 'tab-craft') {
    initCraftWiki();
}
