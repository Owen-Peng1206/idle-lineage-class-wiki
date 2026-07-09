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
    "hidden_cave": "隱藏的巨龍谷",
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
    "zone_01": "古魯丁地監1F~2F",
    "zone_02": "古魯丁地監3F~4F",
    "zone_03": "古魯丁地監5F~7F",
    "zone_04": "奇岩地監1F",
    "zone_05": "奇岩地監2F",
    "zone_06": "奇岩地監3F",
    "zone_07": "奇岩地監4F",
    "zone_08": "奇岩地監 (四大長老)",
    "zone_09": "奇岩地監 (底層)",
    "zone_10": "龍之谷地監1F~2F",
    "zone_11": "龍之谷地監3F~4F",
    "zone_12": "龍之谷地監5F~7F",
    "zone_13": "遠古地監1F",
    "zone_14": "遠古地監2F~3F",
    "zone_15": "眠龍洞穴1F",
    "zone_16": "眠龍洞穴2F",
    "zone_17": "眠龍洞穴3F",
    "zone_18": "象牙塔1F~3F",
    "zone_19": "象牙塔4F~5F",
    "zone_20": "象牙塔6F~7F",
    "zone_21": "象牙塔8F",
    "zone_22": "傲慢之塔10F",
    "zone_23": "傲慢之塔20F",
    "zone_24": "傲慢之塔30F",
    "zone_25": "傲慢之塔40F",
    "zone_26": "傲慢之塔50F",
    "zone_27": "傲慢之塔60F",
    "zone_28": "傲慢之塔70F",
    "zone_29": "傲慢之塔80F",
    "zone_30": "傲慢之塔90F",
    "zone_31": "傲慢之塔100F",
    "zone_32": "螞蟻洞穴1F",
    "zone_33": "螞蟻洞穴2F",
    "zone_34": "海底",
    "zone_35": "遺忘之島(東)",
    "zone_36": "遺忘之島(西)",
    "zone_37": "櫻花林",
    "zone_38": "楓葉林",
    "zone_39": "遺忘之島(東)",
    "zone_40": "遺忘之島(西)",
    "zone_41": "遺忘之島(南)",
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
    "dark_magic_lab": "黑魔法研究室",
    "necro_training": "魔獸兵訓練場",
    "elder_room": "格蘭肯神殿：長老之室",
    "antaras_lair": "地龍安塔瑞斯棲息地",
    "fafurion_lair": "水龍法利昂棲息地",
    "valakas_lair": "火龍巴拉卡斯棲息地",
    "oblivion_travel": "前往遺忘之島的船隻",
    "oblivion_island": "遺忘之島 (全區)"
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

// 取得怪物掉落物清單 HTML
function getMonsterDropsHtml(monsterId) {
    const mob = DB.mobs[monsterId];
    const dropKey = mob ? mob.n : monsterId;

    if (typeof MOB_DROPS === 'undefined' || !MOB_DROPS[dropKey]) {
        return '<div class="col-span-full text-gray-600 text-xs italic">無掉落資料</div>';
    }
    
    const drops = MOB_DROPS[dropKey];
    if (drops.length === 0) return '<div class="col-span-full text-gray-600 text-xs italic">無掉落資料</div>';
    
    // 依機率排序 (高到低)
    const sortedDrops = [...drops].sort((a, b) => b[1] - a[1]);
    
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
            <div class="flex justify-between items-center bg-gray-950/50 p-1.5 rounded border border-gray-800/50 text-xs hover:border-gray-600 transition-colors">
                <span class="${textColor} truncate max-w-[70%]" title="${itemName}">${icon}${itemName}</span>
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
            
            return `
                <div class="glass-panel p-5 rounded-xl border ${borderClass} ${bgClass} transition-all duration-300">
                    <div class="flex justify-between items-start mb-3 border-b border-gray-800/80 pb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden">
                                <img src="idle-lineage-class/assets/anim/${encodeURIComponent(mob.n)}/idle_0.png" alt="${mob.n}" class="w-full h-full object-contain"
                                    onerror="this.onerror=null; ${mob.img ? `this.src='${mob.img}'; this.onerror=function(){this.outerHTML='<i class=\\'fa-solid fa-ghost text-gray-500 text-xl\\'></i>'};` : `this.outerHTML='<i class=\\'fa-solid fa-ghost text-gray-500 text-xl\\'></i>';`}">
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
                    
                    <!-- 詳細資訊 (魔法與出沒地圖) -->
                    <div class="flex flex-col gap-1.5 mb-4">
                        ${(function(){
                            let magics = [];
                            if (mob.mag && mob.mag.skn) magics.push(mob.mag.skn);
                            if (mob.mag2 && mob.mag2.skn) magics.push(mob.mag2.skn);
                            if (mob.mag3 && mob.mag3.skn) magics.push(mob.mag3.skn);
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
