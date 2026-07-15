/**
 * Wiki Monster Maps Logic
 * 負責怪物與地圖板塊的渲染
 */

const mapNameTranslations = {
    "training": "隱藏之谷",
    "talking_island": "說話之島",
    "talking_island_port": "說話之島地監",
    "silver_knight": "銀騎士之村",
    "elf_forest": "妖精森林",
    "gludio": "古魯丁外圍",
    "windwood": "風木外圍",
    "desert": "沙漠",
    "kent": "肯特周邊",
    "dragon_valley": "龍之谷",
    "fire_dragon": "火龍窟",
    "giran": "奇岩周邊",
    "heine": "海音周邊",
    "twilight_mt": "黃昏山脈",
    "mirror_forest": "鏡子森林",
    "pirate_wild": "海賊島前半部",
    "pirate_dungeon": "海賊島地監",
    "silent_outer": "沉默洞穴外圍",
    "elf_grave": "精靈墓穴",
    "hidden_cave": "大洞穴隱遁者村莊地區",
    "giant_tomb": "巨人之墓",
    "demon_temple": "魔族神殿",
    "shadow_temple": "暗影神殿",
    "dream_island": "夢幻之島",
    "kent_outer": "肯特城外圍",
    "kent_inner": "肯特城內部",
    "ww_outer": "風木城外圍",
    "ww_inner": "風木城內部",
    "heine_outer": "海音城外圍",
    "heine_inner": "海音城內部",
    "windwood_dungeon": "風木地監",
    "crystal_cave1": "水晶洞穴1F",
    "crystal_cave2": "水晶洞穴2F",
    "crystal_cave3": "水晶洞穴3F",
    "eva_kingdom": "伊娃王國",
    "zone_01": "妖精森林周邊",
    "zone_02": "歐瑞周邊",
    "zone_03": "歐瑞雪原",
    "zone_04": "艾爾摩激戰地",
    "zone_05": "國境要塞",
    "zone_06": "古魯丁地監1樓",
    "zone_07": "古魯丁地監2樓",
    "zone_08": "古魯丁地監3樓",
    "zone_09": "古魯丁地監4樓",
    "zone_10": "古魯丁地監5樓",
    "zone_11": "古魯丁地監6樓",
    "zone_12": "古魯丁地監7樓",
    "zone_13": "說話之島地監1樓",
    "zone_14": "說話之島地監2樓",
    "zone_15": "眠龍洞穴1樓",
    "zone_16": "眠龍洞穴2樓",
    "zone_17": "眠龍洞穴3樓",
    "zone_18": "奇岩地監1樓",
    "zone_19": "奇岩地監2樓",
    "zone_20": "奇岩地監3樓",
    "zone_21": "奇岩地監4樓",
    "zone_22": "沙漠地監1樓",
    "zone_23": "沙漠地監2樓",
    "zone_24": "沙漠地監3樓",
    "zone_25": "沙漠地監4樓",
    "zone_26": "龍之谷地監1樓",
    "zone_27": "龍之谷地監2樓",
    "zone_28": "龍之谷地監3樓",
    "zone_29": "龍之谷地監4樓",
    "zone_30": "龍之谷地監5樓",
    "zone_31": "龍之谷地監6樓",
    "zone_32": "螞蟻洞窟1樓",
    "zone_33": "螞蟻洞窟2樓",
    "zone_34": "地下通道1樓",
    "zone_35": "地下通道2樓",
    "zone_36": "地下通道3樓",
    "zone_37": "象牙塔4樓",
    "zone_38": "象牙塔5樓",
    "zone_39": "象牙塔6樓",
    "zone_40": "象牙塔7樓",
    "zone_41": "象牙塔8樓",
    "hidden_lab_nolife": "隱藏實驗室：無生命",
    "hidden_lab_darkmagic": "隱藏實驗室：黑魔法",
    "hidden_seal_spirit": "隱藏封印：精靈",
    "hidden_seal_monster": "隱藏封印：怪物",
    "hidden_seal_demon": "隱藏封印：惡魔",
    "hidden_antqueen": "隱藏蟻后棲息地",
    "rastabad_cave1": "拉斯塔巴德地下洞穴1",
    "rastabad_cave2": "拉斯塔巴德地下洞穴2",
    "rastabad_cave3": "拉斯塔巴德地下洞穴3",
    "rastabad_gate": "拉斯塔巴德正門",
    "rastabad_beast": "拉斯塔巴德魔獸陣",
    "king_baranka_room": "冥法軍王之室",
    "law_king_room": "法令軍王之室",
    "necro_king_room": "魔獸軍王之室",
    "assassin_king_room": "暗殺軍王之室",
    "thebes_desert": "底比斯沙漠",
    "thebes_pyramid": "底比斯金字塔內部",
    "thebes_temple": "底比斯神殿內部",
    "tikal_area": "提卡爾神廟地區",
    "tikal_deep": "提卡爾神廟地區深處",
    "tikal_altar": "提卡爾 庫庫爾坎祭壇",
    "dark_magic_lab": "黑魔法研究室",
    "necro_training": "魔獸兵訓練場",
    "elder_room": "格蘭肯神殿：長老之室",
    "town_elder_council": "長老會議廳",
    "collapsed_elder_council_hall": "崩壞的長老會議廳", 
    "dark_elf_sanctuary": "黑暗妖精聖地",
    "cursed_dark_elf_sanctuary": "受詛咒的黑暗妖精聖地",
    "antaras_lair": "地龍安塔瑞斯棲息地",
    "fafurion_lair": "水龍法利昂棲息地",
    "valakas_lair": "火龍巴拉卡斯棲息地",
    "oblivion_travel": "前往遺忘之島的船隻",
    "oblivion_island": "遺忘之島 (全區)",
    "pride_f2": "傲慢之塔 2樓",
    "pride_f3": "傲慢之塔 3樓",
    "pride_f4": "傲慢之塔 4樓",
    "pride_f5": "傲慢之塔 5樓",
    "pride_f6": "傲慢之塔 6樓",
    "pride_f7": "傲慢之塔 7樓",
    "pride_f8": "傲慢之塔 8樓",
    "pride_f9": "傲慢之塔 9樓",
    "pride_f10": "傲慢之塔 10樓",
    "pride_f11": "傲慢之塔 11樓",
    "pride_f12": "傲慢之塔 12樓",
    "pride_f13": "傲慢之塔 13樓",
    "pride_f14": "傲慢之塔 14樓",
    "pride_f15": "傲慢之塔 15樓",
    "pride_f16": "傲慢之塔 16樓",
    "pride_f17": "傲慢之塔 17樓",
    "pride_f18": "傲慢之塔 18樓",
    "pride_f19": "傲慢之塔 19樓",
    "pride_f20": "傲慢之塔 20樓",
    "pride_f21": "傲慢之塔 21樓",
    "pride_f22": "傲慢之塔 22樓",
    "pride_f23": "傲慢之塔 23樓",
    "pride_f24": "傲慢之塔 24樓",
    "pride_f25": "傲慢之塔 25樓",
    "pride_f26": "傲慢之塔 26樓",
    "pride_f27": "傲慢之塔 27樓",
    "pride_f28": "傲慢之塔 28樓",
    "pride_f29": "傲慢之塔 29樓",
    "pride_f30": "傲慢之塔 30樓",
    "pride_f31": "傲慢之塔 31樓",
    "pride_f32": "傲慢之塔 32樓",
    "pride_f33": "傲慢之塔 33樓",
    "pride_f34": "傲慢之塔 34樓",
    "pride_f35": "傲慢之塔 35樓",
    "pride_f36": "傲慢之塔 36樓",
    "pride_f37": "傲慢之塔 37樓",
    "pride_f38": "傲慢之塔 38樓",
    "pride_f39": "傲慢之塔 39樓",
    "pride_f40": "傲慢之塔 40樓",
    "pride_f41": "傲慢之塔 41樓",
    "pride_f42": "傲慢之塔 42樓",
    "pride_f43": "傲慢之塔 43樓",
    "pride_f44": "傲慢之塔 44樓",
    "pride_f45": "傲慢之塔 45樓",
    "pride_f46": "傲慢之塔 46樓",
    "pride_f47": "傲慢之塔 47樓",
    "pride_f48": "傲慢之塔 48樓",
    "pride_f49": "傲慢之塔 49樓",
    "pride_f50": "傲慢之塔 50樓",
    "pride_f51": "傲慢之塔 51樓",
    "pride_f52": "傲慢之塔 52樓",
    "pride_f53": "傲慢之塔 53樓",
    "pride_f54": "傲慢之塔 54樓",
    "pride_f55": "傲慢之塔 55樓",
    "pride_f56": "傲慢之塔 56樓",
    "pride_f57": "傲慢之塔 57樓",
    "pride_f58": "傲慢之塔 58樓",
    "pride_f59": "傲慢之塔 59樓",
    "pride_f60": "傲慢之塔 60樓",
    "pride_f61": "傲慢之塔 61樓",
    "pride_f62": "傲慢之塔 62樓",
    "pride_f63": "傲慢之塔 63樓",
    "pride_f64": "傲慢之塔 64樓",
    "pride_f65": "傲慢之塔 65樓",
    "pride_f66": "傲慢之塔 66樓",
    "pride_f67": "傲慢之塔 67樓",
    "pride_f68": "傲慢之塔 68樓",
    "pride_f69": "傲慢之塔 69樓",
    "pride_f70": "傲慢之塔 70樓",
    "pride_f71": "傲慢之塔 71樓",
    "pride_f72": "傲慢之塔 72樓",
    "pride_f73": "傲慢之塔 73樓",
    "pride_f74": "傲慢之塔 74樓",
    "pride_f75": "傲慢之塔 75樓",
    "pride_f76": "傲慢之塔 76樓",
    "pride_f77": "傲慢之塔 77樓",
    "pride_f78": "傲慢之塔 78樓",
    "pride_f79": "傲慢之塔 79樓",
    "pride_f80": "傲慢之塔 80樓",
    "pride_f81": "傲慢之塔 81樓",
    "pride_f82": "傲慢之塔 82樓",
    "pride_f83": "傲慢之塔 83樓",
    "pride_f84": "傲慢之塔 84樓",
    "pride_f85": "傲慢之塔 85樓",
    "pride_f86": "傲慢之塔 86樓",
    "pride_f87": "傲慢之塔 87樓",
    "pride_f88": "傲慢之塔 88樓",
    "pride_f89": "傲慢之塔 89樓",
    "pride_f90": "傲慢之塔 90樓",
    "pride_f91": "傲慢之塔 91樓",
    "pride_f92": "傲慢之塔 92樓",
    "pride_f93": "傲慢之塔 93樓",
    "pride_f94": "傲慢之塔 94樓",
    "pride_f95": "傲慢之塔 95樓",
    "pride_f96": "傲慢之塔 96樓",
    "pride_f97": "傲慢之塔 97樓",
    "pride_f98": "傲慢之塔 98樓",
    "pride_f99": "傲慢之塔 99樓",
    "pride_f100": "傲慢之塔 100樓"    
};

const mapSelector = document.getElementById('map-selector');
const mapMonsterSearch = document.getElementById('map-monster-search');
const mapsGrid = document.getElementById('maps-grid');
const mapsEmptyState = document.getElementById('maps-empty-state');

let currentMapId = '';
let currentMonsterSearchQuery = '';

// 動態翻譯地圖名稱
function getMapName(mapId) {
    if (mapNameTranslations[mapId]) return mapNameTranslations[mapId];
    
    // 動態解析傲慢之塔樓層 (pride_f2 ~ pride_f100)
    if (mapId.startsWith('pride_f')) {
        const floor = mapId.replace('pride_f', '');
        return `傲慢之塔 ${floor}F`;
    }
    // 解析傲慢區間 (pride_2_10, pride_11_20, etc.)
    if (mapId.startsWith('pride_') && mapId.includes('_')) {
        const range = mapId.replace('pride_', '').replace('_', '~');
        return `傲慢之塔 ${range}F (自由區間)`;
    }
    
    return mapId;
}

// 初始化地圖下拉選單
function initMapSelector() {
    if (typeof DB === 'undefined' || !DB.maps) return;
    
    let optionsHtml = '<option value="">-- 請選擇地圖 --</option>';
    optionsHtml += '<option value="all">所有怪物 (不分地圖)</option>';
    
    // 將翻譯過的地圖名稱放入選單
    for (const mapId in DB.maps) {
        const mapName = getMapName(mapId);
        optionsHtml += `<option value="${mapId}">${mapName}</option>`;
    }
    
    if (mapSelector) {
        mapSelector.innerHTML = optionsHtml;
        mapSelector.addEventListener('change', (e) => {
            currentMapId = e.target.value;
            renderMonsters();
        });
    }
    
    if (mapMonsterSearch) {
        mapMonsterSearch.addEventListener('input', (e) => {
            currentMonsterSearchQuery = e.target.value.trim();
            renderMonsters();
        });
    }
}

// 初始化全域物品 Tooltip (避免被 overflow 遮擋)
let mapsGlobalItemTooltip = null;
function initMapsGlobalItemTooltip() {
    if (document.getElementById('maps-global-item-tooltip')) return;
    mapsGlobalItemTooltip = document.createElement('div');
    mapsGlobalItemTooltip.id = 'maps-global-item-tooltip';
    mapsGlobalItemTooltip.className = 'hidden fixed z-[9999] pointer-events-none w-max max-w-[280px] p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl transform -translate-x-1/2 -translate-y-[calc(100%+10px)] transition-opacity duration-200 opacity-0';
    document.body.appendChild(mapsGlobalItemTooltip);

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-hover-item]');
        if (target) {
            const itemId = target.getAttribute('data-hover-item');
            const itemData = typeof DB !== 'undefined' && DB.items ? DB.items[itemId] : null;
            if (itemData && typeof generateItemBadges === 'function') {
                const badges = generateItemBadges(itemData);
                if (badges) {
                    const itemName = itemData.n || itemId;
                    const isLegend = itemData.legend;
                    let textColor = 'text-gray-400';
                    let icon = '';
                    if (isLegend) {
                        textColor = 'text-gold-400 font-bold';
                        icon = '<i class="fa-solid fa-crown text-gold-500 mr-1 text-[10px]"></i>';
                    } else if (itemData.type === 'wpn' || itemData.type === 'arm') {
                        textColor = 'text-blue-300 font-medium';
                    } else if (itemData.type === 'pot' || itemData.type === 'scroll') {
                        textColor = 'text-green-300';
                    }
                    
                    mapsGlobalItemTooltip.innerHTML = `
                        <div class="text-sm font-bold ${textColor} mb-2 border-b border-gray-700 pb-1">${icon}${itemName}</div>
                        <div class="flex flex-wrap">${badges}</div>
                    `;
                    mapsGlobalItemTooltip.classList.remove('hidden');
                    requestAnimationFrame(() => {
                        mapsGlobalItemTooltip.classList.remove('opacity-0');
                        mapsGlobalItemTooltip.classList.add('opacity-100');
                    });
                }
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (mapsGlobalItemTooltip && !mapsGlobalItemTooltip.classList.contains('hidden')) {
            const tooltipRect = mapsGlobalItemTooltip.getBoundingClientRect();
            let x = e.clientX;
            let y = e.clientY;
            
            // 檢查是否超出上方邊界
            if (y - tooltipRect.height - 10 < 0) {
                mapsGlobalItemTooltip.style.transform = `translate(-50%, 20px)`;
            } else {
                mapsGlobalItemTooltip.style.transform = `translate(-50%, calc(-100% - 10px))`;
            }
            // 檢查左右邊界
            if (x - tooltipRect.width/2 < 10) x = tooltipRect.width/2 + 10;
            if (x + tooltipRect.width/2 > window.innerWidth - 10) x = window.innerWidth - tooltipRect.width/2 - 10;

            mapsGlobalItemTooltip.style.left = `${x}px`;
            mapsGlobalItemTooltip.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-hover-item]');
        if (target && mapsGlobalItemTooltip) {
            mapsGlobalItemTooltip.classList.remove('opacity-100');
            mapsGlobalItemTooltip.classList.add('opacity-0');
            setTimeout(() => {
                if (mapsGlobalItemTooltip.classList.contains('opacity-0')) {
                    mapsGlobalItemTooltip.classList.add('hidden');
                }
            }, 200);
        }
    });
}
// 執行初始化
initMapsGlobalItemTooltip();

// 取得怪物掉落物清單 HTML
function getMonsterDropsHtml(monsterId) {
    const mob = DB.mobs[monsterId];
    const dropKey = mob ? mob.n : monsterId;

    const dropTables = [];
    if (typeof MOB_DROPS !== 'undefined') dropTables.push(MOB_DROPS);
    if (typeof DARK_WEAPON_DROPS !== 'undefined') dropTables.push(DARK_WEAPON_DROPS);
    if (typeof DRAGON_DROPS !== 'undefined') dropTables.push(DRAGON_DROPS);
    if (typeof WARRIOR_DROPS !== 'undefined') dropTables.push(WARRIOR_DROPS);
    if (typeof MEM_DROPS !== 'undefined') dropTables.push(MEM_DROPS);
    if (typeof DARK_CRYSTAL_DROPS !== 'undefined') dropTables.push(DARK_CRYSTAL_DROPS);

    let allDrops = [];
    dropTables.forEach(table => {
        if (table[dropKey]) {
            allDrops = allDrops.concat(table[dropKey]);
        }
    });

    if (allDrops.length === 0) {
        return '<div class="col-span-full text-gray-600 text-xs italic">無掉落資料</div>';
    }
    
    // 合併同物品機率（取最高）
    const mergedDrops = [];
    allDrops.forEach(d => {
        const existing = mergedDrops.find(md => md[0] === d[0]);
        if (existing) {
            existing[1] = Math.max(existing[1], d[1]);
        } else {
            mergedDrops.push([d[0], d[1]]);
        }
    });
    
    // 依機率排序 (低到高)
    const sortedDrops = mergedDrops.sort((a, b) => a[1] - b[1]);
    
    return sortedDrops.map(drop => {
        const itemId = drop[0];
        const chance = drop[1];
        
        const itemData = DB?.items?.[itemId];
        const itemName = itemData ? itemData.n : itemId;
        const isLegend = itemData?.legend;
        
        let textColor = 'text-gray-400';
        let icon = '';
        
        // 依照道具稀有度/類型上色
        if (isLegend) {
            textColor = 'text-gold-400 font-bold';
            icon = '<i class="fa-solid fa-crown text-gold-500 mr-1 text-[10px]"></i>';
        } else if (itemData?.type === 'wpn' || itemData?.type === 'arm') {
            textColor = 'text-blue-300 font-medium';
        } else if (itemData?.type === 'pot' || itemData?.type === 'scroll') {
            textColor = 'text-green-300';
        }

        return `
            <div class="flex justify-between items-center bg-gray-950/50 p-1.5 rounded border border-gray-800/50 text-xs hover:border-gray-600 transition-colors cursor-help" data-hover-item="${itemId}">
                <span class="${textColor} truncate max-w-[70%]">${icon}${itemName}</span>
                <span class="text-gray-500 font-mono">${chance}%</span>
            </div>
        `;
    }).join('');
}

function renderMonsters() {
    if (!mapsGrid || typeof DB === 'undefined' || !DB.mobs) return;
    
    let targetMobs = [];
    
    if (currentMapId === '' || currentMapId === 'all') {
        // 如果選擇 "all"，顯示所有怪物
        targetMobs = Object.keys(DB.mobs);
    } else {
        // 取得該地圖的怪物清單
        targetMobs = DB.maps[currentMapId] || [];
    }
    
    const keyword = currentMonsterSearchQuery.toLowerCase();
    
    const filteredMobs = targetMobs.filter(mobId => {
        const mob = DB.mobs[mobId];
        if (!mob) return false;
        
        const matchKeyword = keyword === '' || 
                             (mob.n && mob.n.toLowerCase().includes(keyword)) || 
                             mobId.toLowerCase().includes(keyword);
                             
        // 若為全部地圖且無關鍵字，不渲染避免效能問題
        if (currentMapId === 'all' && keyword === '') return false;
        
        return matchKeyword;
    });

    if (filteredMobs.length === 0) {
        mapsGrid.innerHTML = '';
        mapsEmptyState.classList.remove('hidden');
        if (currentMapId === 'all' && keyword === '') {
            mapsEmptyState.querySelector('p').textContent = '請輸入關鍵字搜尋，或選擇特定地圖以查看怪物';
        } else {
            mapsEmptyState.querySelector('p').textContent = '該地圖找不到符合條件的怪物';
        }
    } else {
        mapsEmptyState.classList.add('hidden');
        
        // 為了效能，最多顯示 100 筆
        const displayMobs = filteredMobs.slice(0, 100);
        
        mapsGrid.innerHTML = displayMobs.map(mobId => {
            const mob = DB.mobs[mobId];
            const isBoss = mob.boss || mob.s === 'L'; // 簡單判定王或大型怪
            const borderClass = isBoss ? 'border-red-900/50 shadow-[0_0_15px_rgba(153,27,27,0.15)]' : 'border-gray-800 hover:border-gray-700';
            const titleClass = isBoss ? 'text-red-400 font-bold' : 'text-gray-200 font-semibold';
            const bgClass = isBoss ? 'bg-gradient-to-br from-gray-900 to-red-950/20' : 'bg-gray-900/40';
            
            const encodedMobN = encodeURIComponent(mob.n);
            const fallbackImg = mob.img 
                ? `this.onerror=null; this.src='${mob.img}'; this.onerror=function(){this.outerHTML='<i class=\\'fa-solid fa-ghost text-gray-500 text-xl\\'></i>'};`
                : `this.outerHTML='<i class=\\'fa-solid fa-ghost text-gray-500 text-xl\\'></i>';`;
            const onerrorStr = `this.onerror=null; this.src='idle-lineage-class/assets/anim/${encodedMobN}/d4/idle_0.png'; this.onerror=function(){ ${fallbackImg} }`;
            
            return `
                <div class="glass-panel p-5 rounded-xl border ${borderClass} ${bgClass} transition-all duration-300">
                    <div class="flex justify-between items-start mb-3 border-b border-gray-800/80 pb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden">
                                <img src="idle-lineage-class/assets/anim/${encodedMobN}/idle_0.png" alt="${mob.n}" class="w-full h-full object-contain cursor-pointer" data-hover-image
                                    onerror="${onerrorStr}">
                            </div>
                            <div>
                                <h4 class="text-lg ${titleClass}">
                                    ${isBoss ? '<i class="fa-solid fa-skull text-red-500 mr-1 text-sm"></i>' : ''}
                                    ${mob.n}
                                </h4>
                                <div class="text-[10px] text-gray-500 font-mono">ID: ${mobId}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs font-bold text-gray-400 mb-1">Lv.${mob.lv}</div>
                            <div class="text-xs text-red-400 bg-red-900/20 px-2 py-0.5 rounded border border-red-900/50">
                                <i class="fa-solid fa-heart mr-1"></i>${mob.hp}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 怪物屬性 -->
                    <div class="flex flex-wrap gap-1.5 mb-3">
                        ${mob.beh === '主動' ? `<span class="bg-red-900/40 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-800">主動攻擊</span>` : `<span class="bg-green-900/40 text-green-300 text-[10px] px-2 py-0.5 rounded border border-green-800">被動</span>`}
                        <span class="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded border border-gray-700">AC ${mob.ac}</span>
                        ${mob.weak ? `<span class="bg-blue-900/40 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-800">怕${mob.weak}</span>` : ''}
                        ${mob.race ? `<span class="bg-purple-900/40 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-800">${mob.race}</span>` : ''}
                        ${(function(){
                            const eleMap = { 'fire': '火', 'water': '水', 'wind': '風', 'earth': '地' };
                            const eleText = mob.e && eleMap[mob.e] ? eleMap[mob.e] : null;
                            if (eleText) {
                                return '<span class="bg-indigo-900/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-800">屬性: ' + eleText + '</span>';
                            }
                            return '';
                        })()}
                    </div>
                    
                    <!-- 數值面板 -->
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-1.5 mb-3">
                        <div class="bg-gray-950/60 p-1.5 rounded border border-gray-800/80 flex justify-between items-center text-[11px]">
                            <span class="text-gray-500"><i class="fa-solid fa-heart text-red-500/70 mr-1 w-3 text-center"></i>HP</span>
                            <span class="text-gray-300 font-medium">${mob.hp || 0}</span>
                        </div>
                        <div class="bg-gray-950/60 p-1.5 rounded border border-gray-800/80 flex justify-between items-center text-[11px]">
                            <span class="text-gray-500"><i class="fa-solid fa-khanda text-blue-400/70 mr-1 w-3 text-center"></i>攻擊</span>
                            <span class="text-gray-300 font-medium">${mob.dmg ? (mob.dmg[0] + (mob.db||0)) + '~' + (mob.dmg[1] + (mob.db||0)) : '0'}</span>
                        </div>
                        <div class="bg-gray-950/60 p-1.5 rounded border border-gray-800/80 flex justify-between items-center text-[11px]">
                            <span class="text-gray-500"><i class="fa-solid fa-crosshairs text-green-400/70 mr-1 w-3 text-center"></i>命中</span>
                            <span class="text-gray-300 font-medium">${mob.hit || 0}</span>
                        </div>
                        <div class="bg-gray-950/60 p-1.5 rounded border border-gray-800/80 flex justify-between items-center text-[11px]">
                            <span class="text-gray-500"><i class="fa-solid fa-shield-halved text-purple-400/70 mr-1 w-3 text-center"></i>魔防</span>
                            <span class="text-gray-300 font-medium">${mob.mr || 0}%</span>
                        </div>
                        <div class="bg-gray-950/60 p-1.5 rounded border border-gray-800/80 flex justify-between items-center text-[11px]">
                            <span class="text-gray-500"><i class="fa-solid fa-angles-up text-amber-400/70 mr-1 w-3 text-center"></i>經驗</span>
                            <span class="text-gray-300 font-medium">${mob.exp || 0}</span>
                        </div>
                        <div class="bg-gray-950/60 p-1.5 rounded border border-gray-800/80 flex justify-between items-center text-[11px]">
                            <span class="text-gray-500"><i class="fa-solid fa-coins text-gold-500/70 mr-1 w-3 text-center"></i>金幣</span>
                            <span class="text-gold-400 font-medium">${mob.goldMin || 0}~${mob.goldMax || 0}</span>
                        </div>
                    </div>
                    
                    <!-- 詳細資訊 (魔法與出沒地圖) -->
                    <div class="flex flex-col gap-1.5 mb-4">
                        ${(function(){
                            let magics = [];
                            if (mob.mag && mob.mag.skn) magics.push(mob.mag.skn);
                            if (mob.mag2 && mob.mag2.skn) magics.push(mob.mag2.skn);
                            if (mob.mag3 && mob.mag3.skn) magics.push(mob.mag3.skn);
                            if (mob.mag4 && mob.mag4.skn) magics.push(mob.mag4.skn);
                            if (magics.length > 0) {
                                return '<div class="text-[11px] text-amber-400 bg-amber-900/20 px-2 py-1 rounded border border-amber-900/50"><i class="fa-solid fa-wand-magic-sparkles mr-1.5"></i>魔法: ' + magics.join(', ') + '</div>';
                            }
                            return '';
                        })()}
                        ${(function(){
                            const mobMaps = [];
                            for (const mapId in DB.maps) {
                                if (DB.maps[mapId].includes(mobId)) {
                                    mobMaps.push(getMapName(mapId));
                                }
                            }
                            if (mobMaps.length > 0) {
                                return '<div class="text-[11px] text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-900/50 leading-relaxed"><i class="fa-solid fa-map-location-dot mr-1.5"></i>出沒: ' + mobMaps.join('、') + '</div>';
                            }
                            return '<div class="text-[11px] text-gray-500 bg-gray-900/40 px-2 py-1 rounded border border-gray-800"><i class="fa-solid fa-map-location-dot mr-1.5"></i>出沒: 未知 / 特殊生成</div>';
                        })()}
                    </div>
                    
                    <!-- 掉落物區塊 -->
                    <div>
                        <div class="text-xs font-semibold text-gray-400 mb-2 border-l-2 border-gold-500 pl-2">可能掉落物 (機率)</div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                            ${getMonsterDropsHtml(mobId)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-monsters') {
        if (!mapSelector.options.length || mapSelector.options.length <= 1) {
            initMapSelector();
        }
        renderMonsters();
    }
});
