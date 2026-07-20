// js/wiki-collections.js

/**
 * 收藏圖鑑 (Collections) 模組
 * 完完全全參考遊戲主程式的「收藏」UI設計（包含次分類分頁、排版、卡片樣式等）
 */

const WikiCollections = (() => {
    const state = {
        currentType: 'equip', // 預設顯示裝備 (全部過於龐大，不適合原版分頁設計)
        currentSubCat: '',    // 當前次分類 key
        isLoaded: false
    };

    // --- 分類定義 (直接參照原遊戲) ---
    // EQUIP_CATEGORIES, MISC_CATEGORIES, CARD_STAT_LABEL, CARD_TIERS, WEAPON_TAGS, equipCatKey() 皆已改為由遊戲主程式注入 (index.html 中載入)


    const MISC_BOOK_EXCLUDED = {
        new_item_bless_wpn: true,
        new_item_bless_arm: true,
        new_item_bless_acc: true
    };

    function miscCatKey(id, d) {
        if (!d) return null;
        if (MISC_BOOK_EXCLUDED[id]) return null;
        var t = d.type;
        if (t === 'wpn' || t === 'arm' || t === 'acc') return null;
        if (d.eff === 'card' || id.startsWith('card_')) return null;
        if (t === 'pot' || id.startsWith('potion_')) return 'pot';
        if (t === 'scroll' || id.startsWith('scroll_') || (d.n && d.n.includes('卷軸'))) return 'scroll';
        if (t === 'skillbk' || id.startsWith('bk_') || id.startsWith('mem_')) return 'skillbk';
        if (t === 'etc' || id.startsWith('mat_') || id.startsWith('new_item_')) return 'mat';
        return 'special';
    }

    let OBTAINABLE_MISC = null;
    function buildObtainableMisc() {
        if (OBTAINABLE_MISC) return;
        var S = {};
        function add(id) { if (id && id !== 'gold' && DB.items[id]) S[id] = true; }
        for (var id in DB.items) { var d = DB.items[id]; if (d && (d.gachaWeight || 0) > 0) S[id] = true; }
        function addTable(tbl) {
            if (!tbl || typeof tbl !== 'object') return;
            for (var mob in tbl) { var arr = tbl[mob]; if (!Array.isArray(arr)) continue; arr.forEach(function (e) { add(Array.isArray(e) ? e[0] : e); }); }
        }
        if (typeof MOB_DROPS !== 'undefined') addTable(MOB_DROPS);
        if (typeof DARK_WEAPON_DROPS !== 'undefined') addTable(DARK_WEAPON_DROPS);
        if (typeof DARK_CRYSTAL_DROPS !== 'undefined') addTable(DARK_CRYSTAL_DROPS);
        if (typeof DRAGON_DROPS !== 'undefined') addTable(DRAGON_DROPS);
        if (typeof WARRIOR_DROPS !== 'undefined') addTable(WARRIOR_DROPS);
        if (typeof MEM_DROPS !== 'undefined') addTable(MEM_DROPS);
        try { if (typeof SHOP_LISTS === 'object' && SHOP_LISTS) for (var npc in SHOP_LISTS) { var lst = SHOP_LISTS[npc]; if (Array.isArray(lst)) lst.forEach(add); } } catch (e) {}
        try {
            if (typeof CRAFT_RECIPES === 'object' && CRAFT_RECIPES) for (var cn in CRAFT_RECIPES) {
                var recs = CRAFT_RECIPES[cn]; if (!Array.isArray(recs)) continue;
                recs.forEach(function (r) { if (!r) return; add(r.result); if (Array.isArray(r.req)) r.req.forEach(function (m) { if (m) add(m.id); }); });
            }
        } catch (e) {}
        ['new_item_164', 'new_item_195', 'new_item_165'].forEach(add);
        ['scroll_weapon_b', 'scroll_armor_b', 'new_item_uncurse'].forEach(add);
        ['doll_bag', 'doll_box_high'].forEach(add);
        OBTAINABLE_MISC = S;
    }

    // 資料索引
    const INDEX = {
        equip: {}, // subCatKey -> [items]
        item: {},
        relic: {},
        monster: {}
    };

    function initData() {
        if (state.isLoaded) return;
        
        EQUIP_CATEGORIES.forEach(c => { INDEX.equip[c.key] = []; INDEX.relic[c.key] = []; });
        MISC_CATEGORIES.forEach(c => { INDEX.item[c.key] = []; });
        CARD_REGIONS.forEach(c => { INDEX.monster[c.key] = []; });

        buildObtainableMisc();

        // 整理裝備、道具、遺物
        for (let id in DB.items) {
            let d = DB.items[id];
            if (!d) continue;

            if (d.relic) {
                let ck = equipCatKey(id, d);
                if (ck && INDEX.relic[ck]) INDEX.relic[ck].push({ id, ...d });
            } else if (['wpn', 'arm', 'acc'].includes(d.type)) {
                let ck = equipCatKey(id, d);
                if (ck && INDEX.equip[ck]) INDEX.equip[ck].push({ id, ...d });
            } else if (!['wpn', 'arm', 'acc'].includes(d.type)) {
                if (OBTAINABLE_MISC[id]) {
                    let ck = miscCatKey(id, d);
                    if (ck && INDEX.item[ck]) INDEX.item[ck].push({ id, ...d });
                }
            }
        }

        // 整理怪物
        const prideMaps = Object.keys(DB.maps || {}).filter(k => /^pride_/.test(k));
        CARD_REGIONS.forEach(reg => {
            let maps = (reg.maps === '__pride__') ? prideMaps : reg.maps;
            let added = new Set();
            
            function regMob(mid, mob, mk) {
                if (added.has(mob.n)) return;
                added.add(mob.n);
                INDEX.monster[reg.key].push({ id: mid, name: mob.n, ...mob, maps: maps });
            }

            maps.forEach(mk => {
                let pool = DB.maps[mk]; 
                if (!pool) return;
                pool.forEach(mid => {
                    let mob = DB.mobs[mid]; 
                    if (!mob || !mob.n || mob.race === '血盟' || mob.race === '建築') return;
                    regMob(mid, mob, mk);
                    
                    let seen = {}; seen[mid] = 1; let t = mob.transformTo;
                    while (t && DB.mobs[t] && DB.mobs[t].n && !seen[t]) { 
                        seen[t] = 1; 
                        regMob(t, DB.mobs[t], mk); 
                        t = DB.mobs[t].transformTo; 
                    }
                });
            });

            if (typeof CARD_SPECIAL_MOBS !== 'undefined') {
                for (let sid in CARD_SPECIAL_MOBS) {
                    let sp = CARD_SPECIAL_MOBS[sid];
                    if (sp.region === reg.key && DB.mobs[sid] && DB.mobs[sid].n) {
                        regMob(sid, DB.mobs[sid], '__special_' + sid);
                    }
                }
            }

            // 依等級排序
            INDEX.monster[reg.key].sort((a, b) => (a.lv || 0) - (b.lv || 0));
        });

        // 排序裝備、道具
        const sortByPrice = (a, b) => ((a.p || 0) - (b.p || 0)) || ((a.n || '') < (b.n || '') ? -1 : 1);
        for(let k in INDEX.equip) INDEX.equip[k].sort(sortByPrice);
        for(let k in INDEX.relic) INDEX.relic[k].sort(sortByPrice);
        for(let k in INDEX.item) INDEX.item[k].sort(sortByPrice);

        state.isLoaded = true;
    }

    // UI Render Function
    function render() {
        const grid = document.getElementById('collections-grid');
        if (!grid) return;

        // 如果點擊「全部」按鈕，隱藏原版 UI（原版遊戲無「全部」總覽），顯示提示
        if (state.currentType === 'all') {
            grid.innerHTML = `<div class="col-span-full text-center text-gray-500 py-10">遊戲主程式收集冊無全部總覽，請選擇具體分類（裝備、道具、怪物、遺物）。</div>`;
            return;
        }

        let html = '';

        html += `<div class="mb-4 p-3 bg-slate-800/80 border border-slate-600 rounded text-sm text-slate-300">
            <span class="text-amber-400 font-bold">💡 說明：</span>
            Wiki 看到的總數不一定和玩家遊戲中的數量完全一致。
            因為遊戲主程式設有「動態補登」機制，只要玩家的存檔 (Save Data) 裡擁有某個道具，就算這個道具目前已經絕版、或沒有任何常規獲得管道（例如舊活動道具、被移除的舊材料），遊戲就會把它「動態加入」到你的收藏圖鑑中，讓總數 +1。
        </div>`;
        
        // 1. 渲染次分類標籤列 (Tab Row)
        html += `<div class="flex flex-wrap items-center gap-1 mb-4 p-2 bg-gray-900/50 rounded border border-gray-800">`;
        
        let subCats = [];
        let activeClass = '';
        if (state.currentType === 'equip' || state.currentType === 'relic') {
            subCats = EQUIP_CATEGORIES.filter(c => INDEX[state.currentType][c.key].length > 0);
            activeClass = 'bg-sky-800 border-sky-500 text-sky-100';
        } else if (state.currentType === 'item') {
            subCats = MISC_CATEGORIES.filter(c => INDEX.item[c.key].length > 0);
            activeClass = 'bg-amber-800 border-amber-500 text-amber-100';
        } else if (state.currentType === 'monster') {
            subCats = CARD_REGIONS.filter(c => INDEX.monster[c.key].length > 0);
            activeClass = 'bg-amber-800 border-amber-500 text-amber-100';
        }

        // 確保目前有選中的 subCat
        if (!state.currentSubCat || !subCats.find(c => c.key === state.currentSubCat)) {
            state.currentSubCat = subCats.length > 0 ? subCats[0].key : '';
        }

        let lastGroup = '';
        subCats.forEach(c => {
            if (c.group && c.group !== lastGroup) {
                html += `<span class="text-slate-500 text-[11px] font-bold px-1 ml-2 self-center">${c.group}</span>`;
                lastGroup = c.group;
            }
            let isActive = c.key === state.currentSubCat;
            let baseClass = 'px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded border transition-colors cursor-pointer ';
            let cls = isActive ? activeClass : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700';
            let count = INDEX[state.currentType][c.key].length;
            
            html += `<button onclick="WikiCollections.setSubCat('${c.key}')" class="${baseClass} ${cls}">
                ${c.name} <span class="ml-1 text-[10px] text-slate-400 font-normal opacity-80">(${count})</span>
            </button>`;
        });
        html += `</div>`;

        // 2. 渲染標題區塊 (Head)
        let curCatDef = subCats.find(c => c.key === state.currentSubCat);
        if (!curCatDef) {
            grid.innerHTML = html + `<div class="text-slate-500 p-8 text-center">此類別暫無可收集的項目。</div>`;
            return;
        }

        let titleStr = '';
        let bonusStr = '';
        if (state.currentType === 'equip' || state.currentType === 'relic') {
            titleStr = `<div class="text-xl font-bold ${state.currentType === 'relic' ? 'text-yellow-500' : 'text-sky-200'}">${curCatDef.group}・${curCatDef.name}</div>`;
            if (state.currentType === 'equip' && typeof EQUIP_CAT_BONUS !== 'undefined' && EQUIP_CAT_BONUS[curCatDef.key]) {
                bonusStr = `<div class="text-sm font-bold text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-700/50">全收集完成加成：${EQUIP_CAT_BONUS[curCatDef.key].label}</div>`;
            }
        } else if (state.currentType === 'item') {
            titleStr = `<div class="text-xl font-bold text-amber-200">${curCatDef.name}</div>`;
            if (typeof MISC_CAT_BONUS !== 'undefined' && MISC_CAT_BONUS[curCatDef.key]) {
                bonusStr = `<div class="text-sm font-bold text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-700/50">全收集完成加成：${MISC_CAT_BONUS[curCatDef.key].label}</div>`;
            }
        } else if (state.currentType === 'monster') {
            titleStr = `<div class="text-xl font-bold text-amber-200">${curCatDef.name}</div>`;
            if (curCatDef.stat) {
                let lab = CARD_STAT_LABEL[curCatDef.stat] || curCatDef.stat;
                let bonusLine = [1, 2, 3].map(tt => {
                    return `<span class="${CARD_TIERS[tt - 1].col} font-bold">全${CARD_TIERS[tt - 1].sfx} ${lab}+${curCatDef.vals[tt - 1]}</span>`;
                }).join('<span class="text-slate-600 mx-1">/</span>');
                bonusStr = `<div class="text-sm bg-gray-800/80 px-3 py-1 rounded-full border border-gray-700">完成加成（取最高）：${bonusLine}</div>`;
            }
        }

        html += `<div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <div class="flex items-center gap-4">${titleStr}${bonusStr}</div>
        </div>`;

        // 3. 渲染項目網格 (Grid Cells)
        let items = INDEX[state.currentType][state.currentSubCat] || [];
        
        // 為了與原遊戲完全一致，這裡不使用 tailwind grid 系統，而是用 flex 換行
        html += `<div class="flex flex-wrap gap-2 justify-center">`;
        
        if (items.length === 0) {
            html += `<div class="text-slate-500 p-8">暫無可收集的項目。</div>`;
        } else {
            items.forEach((item, idx) => {
                if (state.currentType === 'monster') {
                    // 怪物卡片樣式 (寬度 136px)
                    // 優先使用 idle_0.png，若無則退回舊靜態圖檔，再無則退回 placeholder
                    let placeholderSrc = `https://placehold.co/64x64/1e293b/334155?text=%3F`;
                    let imgUrl = `idle-lineage-class/assets/anim/${item.name}/idle_0.png`;
                    let fallbackChain = `this.onerror=function(){this.onerror=null;this.src='${placeholderSrc}';};this.src='idle-lineage-class/assets/icons/monsters/${item.name}.png';`;
                    
                    if (typeof mobStillImg === 'function') {
                        let mi = mobStillImg(item.name, undefined, false);
                        let fixPath = p => p.startsWith('assets/') ? 'idle-lineage-class/' + p : p;
                        imgUrl = fixPath(mi.src);
                        let fbs = (mi.fb || []).map(fixPath).concat([placeholderSrc]);
                        if (fbs.length > 0) {
                            let fnStr = `this.onerror=null;this.src='${fbs[fbs.length-1]}';`;
                            for (let i = fbs.length - 2; i >= 0; i--) {
                                fnStr = `this.onerror=function(){${fnStr}};this.src='${fbs[i]}';`;
                            }
                            fallbackChain = fnStr;
                        }
                    }

                    let regionName = '未知地區';
                    let rDef = CARD_REGIONS.find(r => r.key === state.currentSubCat);
                    if (rDef) regionName = rDef.name;

                    const WIKI_CARD_ELE = { fire: '火', water: '水', wind: '風', earth: '地', none: '無', holy: '聖', dark: '闇', undead: '不死', light: '光' };
                    let ele = WIKI_CARD_ELE[item.e] || item.e || '無';
                    let mapsList = (typeof CARD_MOB_MAPS !== 'undefined' && CARD_MOB_MAPS[item.name]) ? CARD_MOB_MAPS[item.name] : (item.maps || []);
                    
                    // 改用 wiki-maps.js 提供的 getMapName 函式與 mapNameTranslations 表，確保能完整翻譯所有地圖
                    mapsList = mapsList.map(k => {
                        let sp = k.match(/^__special_(.+)$/); if (sp && typeof CARD_SPECIAL_MOBS !== 'undefined' && CARD_SPECIAL_MOBS[sp[1]]) return CARD_SPECIAL_MOBS[sp[1]].mapLabel;
                        if (typeof getMapName === 'function') return getMapName(k);
                        if (typeof mapNameTranslations !== 'undefined' && mapNameTranslations[k]) return mapNameTranslations[k];
                        let m = k.match(/^pride_f(\d+)$/); if (m) return '傲慢之塔' + m[1] + '樓';
                        m = k.match(/^pride_(\d+)_(\d+)$/); if (m) return '傲慢之塔' + m[1] + '~' + m[2] + '樓';
                        return typeof _cardMapName === 'function' ? _cardMapName(k) : k;
                    });
                    
                    let seen = {}; mapsList = mapsList.filter(x => (seen[x] ? false : (seen[x] = true)));
                    
                    let tooltipMapsHtml = mapsList.length > 0 
                        ? mapsList.map(m => `<span class="px-2 py-0.5 bg-gray-800 rounded text-xs border border-gray-700">${m}</span>`).join(' ')
                        : `<span class="px-2 py-0.5 bg-gray-800 rounded text-xs border border-gray-700">${regionName}</span>`;

                    let sourceHtml = `
                    <div class="text-left">
                        <div class="text-sm font-bold text-white mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                            <img src="${imgUrl}" class="w-6 h-6 object-contain bg-gray-800 rounded border border-gray-600" onerror="${fallbackChain}">
                            ${item.name} <span class="text-xs font-normal text-gray-400">的卡片</span>
                        </div>
                        <div class="mb-2"><div class="text-xs font-semibold text-primary-400 mb-1">🗺️ 出沒地區</div>
                            <div class="flex flex-wrap gap-1">${tooltipMapsHtml}</div>
                        </div>
                        <div class="text-[11px] text-gray-400 leading-tight">討伐 <span class="text-red-400 font-semibold">${item.name}</span> 有機率掉落其專屬卡片 (普/銀/金卡)。</div>
                    </div>`;

                    let shownMaps = mapsList.slice(0, 5).join('、') + (mapsList.length > 5 ? ' …' : '');

                    let extraInfo = `
                        <div class="text-[11px] text-slate-300 mt-1">HP ${item.hp != null ? item.hp : '?'}・屬性 ${ele}</div>
                        <div class="text-[11px] text-slate-300">AC ${item.ac != null ? item.ac : '?'}・MR ${item.mr != null ? item.mr : '?'}</div>
                        <div class="text-[11px] text-slate-400 leading-tight mt-0.5">出沒：${shownMaps || '—'}</div>
                    `;

                    html += `<div class="relative bg-slate-800/70 border border-slate-600 rounded-lg p-2 flex flex-col items-center gap-1 w-[136px] group/card hover:bg-slate-700 transition-colors js-tooltip-container">
                        <img src="${imgUrl}" alt="${item.name}" class="w-16 h-16 object-contain" onerror="${fallbackChain}">
                        <div class="text-center w-full mt-1">
                            <div class="text-sm font-bold text-white truncate" title="${item.name}">${item.name}</div>
                            <div class="text-[11px] text-slate-500">Lv ${item.lv || '?'}</div>
                            ${extraInfo}
                        </div>
                        <!-- 懸浮視窗 -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/card:block w-[260px] p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-50 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 js-tooltip">
                            ${sourceHtml}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-600 js-tooltip-arrow"></div>
                        </div>
                    </div>`;
                } else {
                    // 裝備/道具/遺物樣式 (寬度 112px)
                    let imgUrl = typeof getItemIconPath === 'function' ? getItemIconPath(item) : (item.img || '');
                    if (imgUrl && imgUrl.startsWith('assets/')) imgUrl = 'idle-lineage-class/' + imgUrl;
                    let color = item.legend ? 'text-amber-300' : (item.c || 'text-white');
                    let badge = '';
                    if (state.currentType === 'relic') badge = '<span class="absolute top-1 right-1 text-[9px] px-1 rounded text-yellow-500 border border-yellow-600/50 bg-black/50 font-bold">遺物</span>';
                    else if (item.legend) badge = '<span class="absolute top-1 right-1 text-[9px] px-1 rounded text-amber-300 bg-black/50 font-bold">傳說</span>';

                    let itemDescHtml = '';
                    if (typeof buildItemDescHTML === 'function') {
                        // 避免 Wiki 未載入完整遊戲模組導致 ReferenceError
                        window.getAttrAffix = window.getAttrAffix || function() { return null; };
                        window.attrCanon = window.attrCanon || function() { return null; };
                        window.reqAllowsClass = window.reqAllowsClass || function(d, cls) { return !d || !d.req || d.req === 'all' || (typeof d.req === 'string' && d.req.split(',').includes(cls)); };
                        window.darkEquipOk = window.darkEquipOk || window.reqAllowsClass;
                        window.illusionEquipOk = window.illusionEquipOk || window.reqAllowsClass;
                        window.dragonEquipOk = window.dragonEquipOk || window.reqAllowsClass;
                        window.warriorEquipOk = window.warriorEquipOk || window.reqAllowsClass;
                        window.royalEquipOk = window.royalEquipOk || window.reqAllowsClass;
                        window.atkSpdApm = window.atkSpdApm || function() { return null; };
                        window.atkSpdFamily = window.atkSpdFamily || function() { return null; };
                        window.hitstunTicks = window.hitstunTicks || function() { return null; };
                        window.castIntervalTicks = window.castIntervalTicks || function() { return null; };
                        window.capEn = window.capEn || function() { return 0; };
                        window.mpOnHitAmount = window.mpOnHitAmount || function() { return 0; };
                        window.weaponHasBleed = window.weaponHasBleed || function() { return false; };
                        window.getWeaponTags = window.getWeaponTags || function() { return []; };
                        window.getAttrMagicProc = window.getAttrMagicProc || function() { return null; };

                        try {
                            let rawHtml = buildItemDescHTML({id: item.id});
                            if (rawHtml) {
                                itemDescHtml = `<div class="mb-2 p-1.5 bg-gray-800/80 rounded border border-gray-700 text-[12px] leading-relaxed text-slate-300 break-words">${rawHtml}</div>`;
                            }
                        } catch (e) {
                            console.error('buildItemDescHTML error:', e);
                        }
                    }

                    let sourceHtml = `
                    <div class="text-left">
                        <div class="text-sm font-bold ${color} mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                            <img src="${imgUrl}" class="w-6 h-6 object-contain bg-gray-800 rounded border border-gray-600" onerror="this.onerror=null;this.src='https://placehold.co/64x64/1e293b/334155?text=%3F';">
                            ${item.n}
                        </div>
                        ${item.relicRole ? `<div class="text-[11px] text-sky-300 font-bold mb-1.5 leading-tight bg-sky-900/20 border-l-2 border-sky-700 pl-1.5 py-0.5"><i class="fa-solid fa-crosshairs mr-1"></i>${item.relicRole}</div>` : ''}
                        ${!itemDescHtml && item.d ? `<div class="text-[11px] text-gray-400 mb-2 leading-tight">${item.d}</div>` : ''}
                        ${itemDescHtml}
                        ${getItemSourceHtml(item.id)}
                    </div>`;

                    html += `<div class="relative bg-slate-800/70 border ${state.currentType === 'relic' ? 'border-sky-700/70' : 'border-slate-600'} rounded-lg p-2 flex flex-col items-center gap-1 w-[112px] group/card hover:bg-slate-700 transition-colors js-tooltip-container">
                        ${badge}
                        <img src="${imgUrl}" alt="${item.n}" class="w-14 h-14 object-contain" onerror="this.onerror=null;this.src='https://placehold.co/56x56/1e293b/334155?text=%3F';">
                        <div class="text-center w-full">
                            <div class="text-xs font-bold ${color} truncate" title="${item.n}">${item.n}</div>
                        </div>
                        <!-- 懸浮視窗 -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/card:block w-[280px] p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-[100] pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 js-tooltip">
                            ${sourceHtml}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-600 js-tooltip-arrow"></div>
                        </div>
                    </div>`;
                }
            });
        }
        
        html += `</div>`;
        grid.innerHTML = html;
        document.getElementById('collections-empty-state').classList.add('hidden');
    }

    function getTranslateName(key) {
        // 處理非標準 NPC (製作台/特殊商店等)
        const special = {
            'default': '一般村莊商店', 'pandora': '潘朵拉',
            'silver_knight': '鐵匠 (銀騎士村)', 'gludin': '鐵匠 (古魯丁)', 'giran': '迪歐 (奇岩)',
            'oren': '鐵匠 (歐瑞)', 'heine': '鐵匠 (海音)', 'werner': '威爾納 (威頓)',
            'aden': '鐵匠 (亞丁)', 'witon': '魔法娃娃商人 (威頓)'
        };
        if (special[key]) return special[key];
        
        // 嘗試從遊戲資料庫中的城鎮 NPC 清單尋找
        if (typeof DB !== 'undefined' && DB.towns) {
            for (let t in DB.towns) {
                let town = DB.towns[t];
                if (town.npcs) {
                    let npc = town.npcs.find(x => x.id === key);
                    if (npc) return `${npc.n} (${town.n})`;
                }
            }
        }
        
        return key.replace('npc_', '');
    }

    function getItemSourceHtml(itemId) {
        let sources = [];
        // Drops
        if (wikiData && wikiData.drops) {
            const drops = wikiData.drops.filter(d => d.itemId === itemId);
            if (drops.length > 0) {
                sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-primary-400 mb-1">⚔️ 怪物掉落</div><div class="flex flex-wrap gap-1">` + 
                    drops.slice(0, 10).map(d => {
                        let chanceText = d.isSpecial ? `<span class="text-amber-400 font-bold">${d.isSpecial}</span> (${d.chance}%)` : `${d.chance}%`;
                        return `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${d.monster} <span class="text-gray-500">(${chanceText})</span></span>`;
                    }).join('') +
                    (drops.length > 10 ? `<span class="px-1.5 py-0.5 text-[10px] text-gray-500">...等 ${drops.length} 隻</span>` : '') +
                    `</div></div>`);
            }
        }
        
        // Craft
        const crafts = [];
        if (typeof CRAFT_RECIPES !== 'undefined') {
            for (let cn in CRAFT_RECIPES) {
                let recs = CRAFT_RECIPES[cn];
                if (!Array.isArray(recs)) continue;
                recs.forEach(r => { if (r && r.result === itemId) crafts.push(getTranslateName(cn)); });
            }
        }
        // 客製化製作區塊 (14-craft-pandora.js)
        if (typeof DEMONKING_RECIPES !== 'undefined') {
            DEMONKING_RECIPES.forEach(r => { if (r && r.result === itemId) crafts.push(getTranslateName('npc_flame_shadow')); });
        }
        if (typeof LUMIEL_RECIPES !== 'undefined') {
            LUMIEL_RECIPES.forEach(r => { if (r && r.result === itemId) crafts.push(getTranslateName('npc_lumiel')); });
        }
        if (typeof MYSTICWAND_RECIPES !== 'undefined') {
            MYSTICWAND_RECIPES.forEach(r => { if (r && r.result === itemId) crafts.push(getTranslateName('npc_mystic_mage')); });
        }
        if (typeof SLAYER_RECIPES !== 'undefined') {
            SLAYER_RECIPES.forEach(r => { if (r && r.result === itemId) crafts.push(getTranslateName('npc_zeus_golem')); });
        }
        if (crafts.length > 0) {
            const uniqueCrafts = [...new Set(crafts)];
            sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-amber-400 mb-1">🔨 製作來源</div><div class="flex flex-wrap gap-1">` +
                uniqueCrafts.map(c => `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${c}</span>`).join('') +
                `</div></div>`);
        }
        // Shop
        if (typeof SHOP_LISTS !== 'undefined') {
            const shops = [];
            for (let npc in SHOP_LISTS) {
                if (SHOP_LISTS[npc].includes(itemId)) shops.push(getTranslateName(npc));
            }
            if (shops.length > 0) {
                const uniqueShops = [...new Set(shops)];
                sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-emerald-400 mb-1">💰 商店購買</div><div class="flex flex-wrap gap-1">` +
                    uniqueShops.map(s => `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${s}</span>`).join('') +
                    `</div></div>`);
            }
        }

        // Boxes
        const thebesItems = ['wpn_thebes_bow', 'wpn_thebes_dual', 'wpn_thebes_2hsword', 'wpn_thebes_wand', 'blt_thebes_osiris', 'acc_thebes_horus', 'acc_thebes_anubis', 'relic_mandra_spirit', 'relic_death_leaf', 'relic_scarab_shin'];
        const tikalItems = ['wpn_kukulkan_spear', 'wpn_kukulkan_gauntlet', 'shd_kukulkan', 'hlm_kukulkan'];
        
        let boxText = '';
        if (thebesItems.includes(itemId)) {
            boxText = '開啟上鎖的歐西里斯初級/高級寶箱獲得 (巴特爾製作)';
        } else if (tikalItems.includes(itemId)) {
            boxText = '開啟上鎖的庫庫爾坎初級/高級寶箱獲得 (巴特爾製作)';
        }
        
        if (boxText) {
            sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-purple-400 mb-1">🎁 寶箱取得</div><div class="flex flex-wrap gap-1">` +
                `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${boxText}</span>` +
                `</div></div>`);
        }
        
        let initText = '';
        if (itemId === 'wpn_11') initText = '創立新角色(王族/騎士/法師/妖精/黑妖)時自動取得';
        else if (itemId === 'wpn_shortbow') initText = '創立新角色(妖精)時自動取得';
        else if (itemId === 'wpn_10') initText = '創立新角色(幻術士/龍騎士)時自動取得';
        else if (itemId === 'wpn_1') initText = '創立新角色(戰士)時自動取得';
        else if (itemId === 'arm_74') initText = '創立新角色(妖精)時自動取得';
        else if (itemId === 'amr_jacket') initText = '創立新角色(妖精除外)時自動取得';
        
        if (initText) {
            sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-pink-400 mb-1">✨ 初始裝備</div><div class="flex flex-wrap gap-1">` +
                `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${initText}</span>` +
                `</div></div>`);
        }

        if (sources.length === 0) {
            sources.push(`<div class="text-[11px] text-gray-500 italic mt-1">目前無已知的常規掉落或製作來源。</div>`);
        }
        return sources.join('');
    }

    // --- Public API ---
    return {
        init: () => {
            initData();
            
            // 綁定主過濾器 (裝備、道具、怪物、遺物)
            const btns = document.querySelectorAll('#collection-filters .filter-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    btns.forEach(b => {
                        b.classList.remove('bg-primary-600', 'text-white');
                        b.classList.add('bg-gray-800', 'text-gray-300');
                    });
                    const targetBtn = e.currentTarget;
                    targetBtn.classList.remove('bg-gray-800', 'text-gray-300');
                    targetBtn.classList.add('bg-primary-600', 'text-white');
                    
                    const newType = targetBtn.getAttribute('data-type');
                    // 若切換大分類，自動選中該分類的第一個次分類
                    if (state.currentType !== newType && newType !== 'all') {
                        state.currentType = newType;
                        state.currentSubCat = ''; 
                    } else {
                        state.currentType = newType;
                    }
                    render();
                });
            });

            // 初始化時觸發第一個非all按鈕
            const equipBtn = document.querySelector('#collection-filters .filter-btn[data-type="equip"]');
            if (equipBtn && state.currentType === 'equip') {
                equipBtn.click();
            } else {
                render();
            }
        },
        setSubCat: (catKey) => {
            state.currentSubCat = catKey;
            render();
        }
    };
})();

document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-collections') {
        WikiCollections.init();
    }
});
