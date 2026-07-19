/**
 * Wiki 製作百科模組
 * 讀取遊戲原始 CRAFT_RECIPES 資料，依 NPC（城鎮）分組展示製作配方。
 */

// ==========================================
// NPC 中文名稱與所在城鎮對應表
// ==========================================
// CRAFT_NPC_INFO and TOWN_ORDER have been moved to wiki-app.js
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

    // 3. 遍歷各掉落表（key = 怪物名稱）建立 itemId → sources 索引
    const idx = {};
    const dropTables = [];
    if (typeof MOB_DROPS !== 'undefined') dropTables.push(MOB_DROPS);
    if (typeof DARK_WEAPON_DROPS !== 'undefined') dropTables.push(DARK_WEAPON_DROPS);
    if (typeof DRAGON_DROPS !== 'undefined') dropTables.push(DRAGON_DROPS);
    if (typeof WARRIOR_DROPS !== 'undefined') dropTables.push(WARRIOR_DROPS);
    if (typeof MEM_DROPS !== 'undefined') dropTables.push(MEM_DROPS);
    if (typeof DARK_CRYSTAL_DROPS !== 'undefined') dropTables.push(DARK_CRYSTAL_DROPS);

    dropTables.forEach(table => {
        for (const [mobName, drops] of Object.entries(table)) {
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
                // 避免同一怪物重複加入（取最高機率）
                const existing = idx[dropItemId].find(e => e.mobName === mobName);
                if (existing) {
                    existing.chance = Math.max(existing.chance, chance);
                } else {
                    idx[dropItemId].push({ mobName, chance, maps });
                }
            }
        }
    });

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

    // ── 特殊道具硬編碼來源 ────────────────────────────────────────────────────
    let specialSourcesHtml = '';
    if (itemId === 'sherine_crystal') {
        specialSourcesHtml = `
            <ul class="space-y-1.5 mb-2">
                <li class="flex flex-col gap-0.5">
                    <div class="flex justify-between items-center text-[12px]">
                        <span class="text-green-300 font-medium truncate max-w-[11rem]">席琳的世界 怪物掉落</span>
                        <span class="text-green-400/80 font-mono shrink-0 ml-2 text-[10px]">極低機率</span>
                    </div>
                    <div class="text-[11px] text-gray-400 leading-tight">
                        <i class="fa-solid fa-location-dot mr-1 opacity-60"></i>任何難度皆可掉落 (隨等級變動)
                    </div>
                </li>
            </ul>
        `;
    } else if (itemId && itemId.startsWith('item_pride_pass_')) {
        const tier = itemId.split('_').pop();
        specialSourcesHtml = `
            <ul class="space-y-1.5 mb-2">
                <li class="flex flex-col gap-0.5">
                    <div class="flex justify-between items-center text-[12px]">
                        <span class="text-amber-300 font-medium truncate max-w-[11rem]">解除封印</span>
                    </div>
                    <div class="text-[11px] text-gray-400 leading-tight">
                        <i class="fa-solid fa-box-open mr-1 opacity-60"></i>雙擊使用「封印的傲慢之塔傳送符(${tier}F)」獲得
                    </div>
                </li>
            </ul>
        `;
    } else if (itemId === 'panacea_white') {
        specialSourcesHtml = `
            <ul class="space-y-1.5 mb-2">
                <li class="flex flex-col gap-0.5">
                    <div class="flex justify-between items-center text-[12px]">
                        <span class="text-slate-100 font-medium truncate max-w-[11rem]">重置配點回收</span>
                    </div>
                    <div class="text-[11px] text-gray-400 leading-tight">
                        <i class="fa-solid fa-recycle mr-1 opacity-60"></i>使用「回憶蠟燭」重置能力值時，回收已使用的萬能藥獲得
                    </div>
                </li>
            </ul>
        `;
    }

    // 若皆無來源，不顯示 tooltip
    if (dropSources.length === 0 && npcSources.length === 0 && !specialSourcesHtml) return '';

    let html = '<div class="font-bold text-white mb-2 border-b border-gray-700 pb-1 text-sm flex items-center gap-2">'
             + '<i class="fa-solid fa-magnifying-glass-location text-primary-400"></i>取得來源</div>';

    if (specialSourcesHtml) {
        html += specialSourcesHtml;
    }

    // ── 渲染掉落清單 ──────────────────────────────────────────────────────────
    if (topDrops.length > 0) {
        html += '<ul class="space-y-1.5">';
        topDrops.forEach(s => {
            // 遊戲內機率值已經是百分比（例如 1 = 1%, 0.1 = 0.1%）
            const pct         = s.chance;
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
        // 特殊材料：客製化裝備需求
        if (r._special && r._displayName) {
            const title = r._tooltip || "特殊條件裝備";
            const icon = r._icon || "fa-wand-sparkles";
            return `<span class="inline-flex items-center gap-1 bg-violet-900/30 text-violet-300 text-xs px-2 py-1 rounded border border-violet-700/40 mr-1 mb-1" title="${title}">
                        <i class="fa-solid ${icon} text-violet-400"></i> ${r._displayName}
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
            return `<div class="relative group/material cursor-help inline-block mr-1 mb-1 js-tooltip-container">
                        <span class="inline-flex items-center gap-1 bg-gray-800/60 ${colorCls} text-xs px-2 py-1 rounded border border-gray-700/40 w-full hover:bg-gray-700/80 transition-colors">
                            ${iconHtml}${name} <span class="text-gray-500">×${r.cnt}</span>
                        </span>
                        <!-- 漂浮視窗 Tooltip -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/material:block w-64 p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-50 pointer-events-none opacity-0 group-hover/material:opacity-100 transition-opacity duration-200 js-tooltip" style="min-width: 16rem;">
                            ${tooltipHtml}
                            <!-- 下方箭頭 -->
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-600 js-tooltip-arrow"></div>
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-gray-900/95 mt-[-1px] js-tooltip-arrow"></div>
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

    // 特殊製作已經在 wiki-app.js 的 injectSpecialWikiCrafts() 中被注入


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
