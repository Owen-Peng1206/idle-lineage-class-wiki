/**
 * Wiki Application Logic
 * 負責處理資料轉換、渲染圖鑑、與搜尋功能
 */

// ==========================================
// 1. 資料處理與轉換 (Data Management)
// ==========================================

// 將原本以 Key-Value 存放的物件，轉換為陣列，並將原 key 保留在 id 中
function convertObjToArray(obj) {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => {
        return { id: key, ...value };
    });
}

// 建立全域的資料陣列供查詢
const wikiData = {
    items: convertObjToArray(DB?.items || {}),
    // mobs, maps, skills 會在後續模組中使用
};

// ==========================================
// 2. 圖鑑顯示模組 (Item Viewer)
// ==========================================

const itemsGrid = document.getElementById('items-grid');
const emptyState = document.getElementById('items-empty-state');
let currentFilterType = 'all'; // all, wpn, arm, acc, etc, relic
let currentFilterSubType = 'all';
let currentSearchQuery = '';

// 子分類設定
const subFilterOptions = {
    wpn: [
        { id: 'all', name: '全部武器' },
        { id: '1h', name: '單手武器' },
        { id: '2h', name: '雙手武器' },
        { id: 'bow', name: '遠程武器' }
    ],
    arm: [
        { id: 'all', name: '全部防具' },
        { id: 'helm', name: '頭盔' },
        { id: 'armor', name: '盔甲' },
        { id: 'cloak', name: '斗篷' },
        { id: 'shield', name: '盾牌/臂甲' },
        { id: 'gloves', name: '手套' },
        { id: 'boots', name: '長靴' },
        { id: 'tshirt', name: '內衣' }
    ],
    acc: [
        { id: 'all', name: '全部飾品' },
        { id: 'amulet', name: '項鍊' },
        { id: 'ring', name: '戒指' },
        { id: 'belt', name: '腰帶' },
        { id: 'ear', name: '耳環' }
    ],
    etc: [
        { id: 'all', name: '全部雜項' },
        { id: 'mat', name: '製作材料' },
        { id: 'other', name: '其他' }
    ]
};

/**
 * 根據 item 屬性產生顯示的數值與標籤 HTML
 */
function generateItemBadges(item) {
    let badges = '';
    
    if (item.type === 'wpn') {
        badges += `<span class="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded border border-red-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-khanda mr-1"></i>武器</span>`;
        if (item.dmgS || item.dmgL) {
            badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">傷害 ${item.dmgS||0} / ${item.dmgL||0}</span>`;
        }
        if (item.hit) {
            badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">命中 +${item.hit}</span>`;
        }
    } else if (item.type === 'arm') {
        badges += `<span class="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-shield-halved mr-1"></i>防具</span>`;
        if (item.ac) {
            badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">防禦(AC) -${item.ac}</span>`;
        }
    } else if (item.type === 'acc') {
        badges += `<span class="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded border border-purple-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-ring mr-1"></i>飾品</span>`;
    } else if (item.type === 'etc') {
        badges += `<span class="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded border border-green-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-box mr-1"></i>材料/雜項</span>`;
    }

    if (item.safe) {
        badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">安定值 ${item.safe}</span>`;
    }
    
    // 屬性加成
    if (item.str) badges += `<span class="text-xs px-2 py-1 rounded bg-orange-900/40 text-orange-300 mr-2 mb-2 inline-block border border-orange-700/50">力+${item.str}</span>`;
    if (item.dex) badges += `<span class="text-xs px-2 py-1 rounded bg-green-900/40 text-green-300 mr-2 mb-2 inline-block border border-green-700/50">敏+${item.dex}</span>`;
    if (item.con) badges += `<span class="text-xs px-2 py-1 rounded bg-yellow-900/40 text-yellow-300 mr-2 mb-2 inline-block border border-yellow-700/50">體+${item.con}</span>`;
    if (item.int) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">智+${item.int}</span>`;
    if (item.wis) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 mr-2 mb-2 inline-block border border-purple-700/50">精+${item.wis}</span>`;

    return badges;
}

const classIconsMap = {
    'royal': { n: '王族', i: 'fa-chess-king', c: 'text-yellow-400' },
    'knight': { n: '騎士', i: 'fa-shield-halved', c: 'text-blue-400' },
    'elf': { n: '妖精', i: 'fa-leaf', c: 'text-green-400' },
    'mage': { n: '法師', i: 'fa-hat-wizard', c: 'text-purple-400' },
    'dark': { n: '黑妖', i: 'fa-moon', c: 'text-gray-400' },
    'dragon': { n: '龍騎士', i: 'fa-dragon', c: 'text-red-400' },
    'illusion': { n: '幻術士', i: 'fa-eye', c: 'text-pink-400' },
    'warrior': { n: '戰士', i: 'fa-gavel', c: 'text-orange-400' }
};

function generateClassIcons(reqStr) {
    if (!reqStr) return '';
    if (reqStr === 'all') {
        return `<div class="mt-2 flex flex-wrap gap-1">
            <span class="bg-gray-800/80 text-gray-300 text-[11px] px-2 py-1 rounded border border-gray-700 flex items-center" title="全職業可裝備">
                <i class="fa-solid fa-users mr-1 text-gray-400"></i>全職業
            </span>
        </div>`;
    }

    const reqs = reqStr.split(',');
    let html = `<div class="mt-2 flex flex-wrap gap-1">`;
    reqs.forEach(r => {
        const cls = classIconsMap[r];
        if (cls) {
            html += `<span class="bg-gray-800/80 text-gray-300 text-[11px] px-2 py-1 rounded border border-gray-700 flex items-center" title="${cls.n}">
                <i class="fa-solid ${cls.i} ${cls.c} mr-1"></i>${cls.n}
            </span>`;
        }
    });
    html += `</div>`;
    return html;
}

const effNamesMap = {
    'cleave': '切割',
    'crush': '重擊',
    'pierce': '穿透',
    'combo': '雙擊',
    'magicstrike': '魔擊',
    'magicburst': '魔爆',
    'mp_drain': '吸收魔力',
    'dice_death': '死神之骰'
};

function getItemEffectsHtml(item) {
    let effects = [];
    
    if (item.eff && effNamesMap[item.eff]) {
        effects.push(`<span class="bg-indigo-900/40 text-indigo-300 text-[11px] px-2 py-1 rounded border border-indigo-700/50"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>${effNamesMap[item.eff]}</span>`);
    }
    
    if (item.spellProc || item.meleeHitSpell) effects.push(`<span class="bg-indigo-900/40 text-indigo-300 text-[11px] px-2 py-1 rounded border border-indigo-700/50"><i class="fa-solid fa-bolt mr-1"></i>魔法發動</span>`);
    if (item.procSkill || item.procStatusSkill) effects.push(`<span class="bg-indigo-900/40 text-indigo-300 text-[11px] px-2 py-1 rounded border border-indigo-700/50"><i class="fa-solid fa-fire mr-1"></i>技能發動</span>`);
    if (item.procPoison) effects.push(`<span class="bg-green-900/40 text-green-300 text-[11px] px-2 py-1 rounded border border-green-700/50"><i class="fa-solid fa-skull mr-1"></i>毒素發動</span>`);
    if (item.ignHardSkin) effects.push(`<span class="bg-orange-900/40 text-orange-300 text-[11px] px-2 py-1 rounded border border-orange-700/50"><i class="fa-solid fa-burst mr-1"></i>貫穿硬皮</span>`);
    if (item.set) effects.push(`<span class="bg-yellow-900/40 text-yellow-300 text-[11px] px-2 py-1 rounded border border-yellow-700/50"><i class="fa-solid fa-layer-group mr-1"></i>套裝效果</span>`);
    
    if (effects.length === 0) return '';
    return `<div class="mt-2 flex flex-wrap gap-1">${effects.join('')}</div>`;
}

const wikiMapNames = {
    "town_silver_knight": "銀騎士村莊",
    "town_elf": "妖精森林村莊",
    "town_talking": "說話之島村莊",
    "town_gludio": "燃柳村莊",
    "town_giran": "奇岩城鎮",
    "town_heine": "海音城鎮",
    "town_oren": "歐瑞村莊",
    "town_aden": "亞丁城鎮",
    "town_ivory_tower": "象牙塔（1~3樓）",
    "town_witon": "威頓村莊",
    "town_sherine": "席琳神殿",
    "town_silent": "沉默洞穴",
    "town_hyperia": "希培利亞",
    "town_behemoth": "貝希摩斯",
    "town_flame_audience": "炎魔謁見所",
    "silver_knight": "銀騎士村周邊",
    "talking_island": "說話之島周邊",
    "zone_01": "妖精森林周邊",
    "talking_island_port": "說話之島港口",
    "elf_forest": "妖魔森林",
    "gludio": "古魯丁周邊",
    "windwood": "風木周邊",
    "desert": "沙漠",
    "kent": "肯特周邊",
    "dragon_valley": "龍之谷",
    "fire_dragon": "火龍窟",
    "giran": "奇岩周邊",
    "heine": "海音周邊",
    "twilight_mt": "黃昏山脈",
    "mirror_forest": "鏡子森林",
    "zone_02": "歐瑞周邊",
    "zone_03": "歐瑞雪原",
    "zone_04": "艾爾摩激戰地",
    "zone_05": "國境要塞",
    "silent_outer": "沉默洞穴周邊",
    "elf_grave": "精靈墓穴",
    "hidden_cave": "大洞穴隱遁者村莊地區",
    "giant_tomb": "古代巨人之墓",
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
    "crystal_cave1": "水晶洞穴1樓",
    "crystal_cave2": "水晶洞穴2樓",
    "crystal_cave3": "水晶洞穴3樓",
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
    "eva_kingdom": "伊娃王國",
    "zone_37": "象牙塔4樓",
    "zone_38": "象牙塔5樓",
    "zone_39": "象牙塔6樓",
    "zone_40": "象牙塔7樓",
    "zone_41": "象牙塔8樓",
    "rastabad_cave1": "拉斯塔巴德地下洞穴1樓",
    "rastabad_cave2": "拉斯塔巴德地下洞穴2樓",
    "rastabad_cave3": "拉斯塔巴德地下洞穴3樓",
    "rastabad_gate": "拉斯塔巴德正門",
    "rastabad_beast": "魔獸訓練場",
    "dark_magic_lab": "黑魔法研究室",
    "necro_training": "冥法軍訓練場",
    "elder_room": "格蘭肯神殿．長老之室",
    "demon_temple": "魔族神殿",
    "shadow_temple": "暗影神殿",
    "training": "新兵修練場",
    "dream_island": "夢幻之島",
    "king_baranka_room": "魔獸君王之室",
    "law_king_room": "法令君王之室",
    "necro_king_room": "冥法君王之室",
    "assassin_king_room": "暗殺君王之室",
    "antaras_lair": "安塔瑞斯棲息地",
    "fafurion_lair": "法利昂洞穴",
    "valakas_lair": "巴拉卡斯巢穴",
    "town_pride": "傲慢之塔1樓",
    "pride_2_10": "傲慢之塔2~10樓",
    "pride_11_20": "傲慢之塔11~20樓",
    "pride_21_30": "傲慢之塔21~30樓",
    "pride_31_40": "傲慢之塔31~40樓",
    "pride_41_50": "傲慢之塔41~50樓",
    "pride_51_60": "傲慢之塔51~60樓",
    "pride_61_70": "傲慢之塔61~70樓",
    "pride_71_80": "傲慢之塔71~80樓",
    "pride_81_90": "傲慢之塔81~90樓",
    "pride_91_100": "傲慢之塔91~100樓",
    "town_rift": "時空裂痕入口",
    "thebes_desert": "底比斯沙漠",
    "thebes_pyramid": "底比斯金字塔內部",
    "thebes_temple": "底比斯 歐西里斯祭壇",
    "town_pirate_village": "海賊島村莊",
    "pirate_wild": "海賊島周邊",
    "pirate_dungeon": "海賊島地監",
    "town_windwood_castle": "風木城",
    "windwood_dungeon": "風木地監",
    "hidden_lab_nolife": "無生命體研究室",
    "hidden_lab_darkmagic": "黑魔法研究室",
    "hidden_seal_spirit": "精靈的封印地",
    "hidden_seal_monster": "魔獸的封印地",
    "hidden_seal_demon": "惡魔的封印地",
    "hidden_antqueen": "螞蟻女王藏身處",
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

let mobMapCache = {};
function getMonsterMapsText(monsterNameStr) {
    if (mobMapCache[monsterNameStr]) return mobMapCache[monsterNameStr];
    
    if (typeof DB === 'undefined' || !DB.mobs) return '未知';
    
    const mobIds = Object.keys(DB.mobs).filter(id => DB.mobs[id].n === monsterNameStr);
    if (mobIds.length === 0) return '未知地圖';
    
    const mapsFound = [];
    if (DB.maps) {
        for (const [mapKey, mobList] of Object.entries(DB.maps)) {
            if (mobList.some(id => mobIds.includes(id))) {
                let mapName = wikiMapNames[mapKey] || (DB.towns && DB.towns[mapKey] ? DB.towns[mapKey].n : mapKey);
                
                if (mapName === mapKey) {
                    if (mapKey.startsWith('pride_f')) {
                        const floor = mapKey.replace('pride_f', '');
                        mapName = `傲慢之塔${floor}樓`;
                    } else if (mapKey === 'oblivion_travel') {
                        mapName = '遺忘之島(乘船處)';
                    } else if (mapKey === 'oblivion_island') {
                        mapName = '遺忘之島';
                    }
                }

                if (!mapsFound.includes(mapName)) {
                    mapsFound.push(mapName);
                }
            }
        }
    }
    
    const result = mapsFound.length > 0 ? mapsFound.join(', ') : '特殊區域/副本';
    mobMapCache[monsterNameStr] = result;
    return result;
}

function getItemDropsHtml(itemId) {
    if (!wikiData.drops) return '';
    const drops = wikiData.drops.filter(d => d.itemId === itemId);
    if (drops.length === 0) {
        return `<div class="text-[11px] text-gray-600 mt-3 border-t border-gray-800/50 pt-2"><i class="fa-solid fa-ghost mr-1"></i>無怪物掉落</div>`;
    }
    
    drops.sort((a, b) => b.chance - a.chance);
    
    let html = `<div class="mt-3 border-t border-gray-800/50 pt-2">
        <div class="text-[11px] text-gray-500 mb-1.5 flex items-center">
            <i class="fa-solid fa-box-open mr-1.5"></i>掉落怪物:
        </div>
        <div class="flex flex-wrap gap-1.5">`;
        
    const maxShow = 6;
    if (drops.length <= maxShow) {
        drops.forEach(d => {
            const mapsText = getMonsterMapsText(d.monster);
            html += `<span class="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded border border-gray-700 cursor-help" title="掉落機率: ${d.chance}%&#10;出沒地圖: ${mapsText}">${d.monster}</span>`;
        });
        html += `</div></div>`;
    } else {
        const toShow = drops.slice(0, 5);
        const toHide = drops.slice(5);
        
        toShow.forEach(d => {
            const mapsText = getMonsterMapsText(d.monster);
            html += `<span class="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded border border-gray-700 cursor-help" title="掉落機率: ${d.chance}%&#10;出沒地圖: ${mapsText}">${d.monster}</span>`;
        });
        
        html += `<span class="bg-primary-900/50 text-primary-300 text-[10px] px-1.5 py-0.5 rounded border border-primary-700/50 cursor-pointer hover:bg-primary-800 transition-colors" onclick="this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex', 'flex-wrap', 'gap-1.5', 'w-full', 'mt-1'); this.remove();">More..</span>`;
        
        html += `<div class="hidden">`;
        toHide.forEach(d => {
            const mapsText = getMonsterMapsText(d.monster);
            html += `<span class="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded border border-gray-700 cursor-help" title="掉落機率: ${d.chance}%&#10;出沒地圖: ${mapsText}">${d.monster}</span>`;
        });
        html += `</div></div></div>`;
    }
    
    return html;
}

/**
 * 依 item.type 取得對應的圖示路徑
 */
function getItemIconPath(item) {
    const folderMap = {
        'wpn': 'weapons',
        'arm': 'armors',
        'acc': 'accessories',
        'etc': 'items',
        'misc': 'items',
        'pot': 'items',
        'scroll': 'items',
        'mat': 'items'
    };
    const folder = folderMap[item.type] || 'items';
    return `idle-lineage-class/assets/icons/${folder}/${encodeURIComponent(item.n)}.png`;
}

/**
 * 渲染單個道具卡片 HTML
 */
function createItemCard(item) {
    const isLegend = item.legend ? true : false;
    const borderClass = isLegend ? 'border-gold-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-gray-800';
    const titleClass = isLegend ? 'text-gold-400 font-bold' : 'text-gray-200 font-semibold';
    
    // 處理描述中的 HTML (原本遊戲中可能有 <br> 等)
    const desc = item.d ? item.d : '<span class="text-gray-600 italic">無說明</span>';

    return `
        <div class="glass-panel p-5 rounded-xl border ${borderClass} hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden">
                        <img src="${getItemIconPath(item)}" alt="${item.n}" class="w-full h-full object-contain"
                            onerror="this.parentElement.style.display='none'">
                    </div>
                    <h4 class="text-lg ${titleClass} flex items-center gap-2">
                        ${isLegend ? '<i class="fa-solid fa-crown text-gold-500 text-sm"></i>' : ''}
                        ${item.n}
                    </h4>
                </div>
                ${item.p ? `<span class="text-xs text-yellow-500 font-mono flex-shrink-0"><i class="fa-solid fa-coins mr-1"></i>${item.p.toLocaleString()}</span>` : ''}
            </div>
            
            <div class="mb-3">
                ${generateItemBadges(item)}
                ${generateClassIcons(item.req)}
                ${getItemEffectsHtml(item)}
            </div>
            
            <div class="mt-auto pt-3 border-t border-gray-800">
                <p class="text-sm text-gray-400 leading-relaxed text-sm">
                    ${desc}
                </p>
                ${getItemDropsHtml(item.id)}
                <div class="mt-3 text-xs text-gray-600 font-mono">
                    ID: ${item.id}
                </div>
            </div>
        </div>
    `;
}

/**
 * 重新渲染卡片網格
 */
function renderItems() {
    if (!itemsGrid) return;
    
    // 如果是套裝分類，轉由專屬的 renderSets 處理
    if (currentFilterType === 'set') {
        renderSets();
        return;
    }
    
    // 根據 filter 與 search 過濾資料
    const filteredItems = wikiData.items.filter(item => {
        // 分類過濾
        let matchType = false;
        
        if (currentFilterType === 'all') {
            matchType = true;
        } else if (currentFilterType === 'relic') {
            matchType = !!item.relic;
        } else {
            // 一般分類 (可以選擇排除或包含遺物，這裡我們如果是一般分類且不是 all，就預設排除 relic 以保持分類乾淨)
            const isTargetType = item.type === currentFilterType || (currentFilterType === 'etc' && item.type === 'misc');
            if (isTargetType && !item.relic) {
                matchType = true;
                
                // 子分類過濾
                if (currentFilterSubType !== 'all') {
                    if (currentFilterType === 'wpn') {
                        if (currentFilterSubType === '1h') matchType = !item.w2h && !item.isBow && !item.isArrow;
                        else if (currentFilterSubType === '2h') matchType = !!item.w2h && !item.isBow && !item.isArrow;
                        else if (currentFilterSubType === 'bow') matchType = !!item.isBow || !!item.isArrow;
                    } else if (currentFilterType === 'arm' || currentFilterType === 'acc') {
                        matchType = item.slot === currentFilterSubType;
                    } else if (currentFilterType === 'etc') {
                        const isMat = item.id.startsWith('mat_') || (item.d && item.d.includes('製作材料'));
                        if (currentFilterSubType === 'mat') matchType = isMat;
                        else if (currentFilterSubType === 'other') matchType = !isMat;
                    }
                }
            }
        }
        
        // 關鍵字過濾 (名稱 or 描述 or ID)
        const keyword = currentSearchQuery.toLowerCase();
        const matchSearch = keyword === '' || 
                            (item.n && item.n.toLowerCase().includes(keyword)) ||
                            (item.d && item.d.toLowerCase().includes(keyword)) ||
                            (item.id.toLowerCase().includes(keyword));
                            
        return matchType && matchSearch;
    });

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        // 大量 DOM 渲染優化，先轉成字串再一次性放入
        itemsGrid.innerHTML = filteredItems.map(createItemCard).join('');
    }
}

/**
 * 渲染套裝列表
 */
function renderSets() {
    if (!itemsGrid) return;
    
    const keyword = currentSearchQuery.toLowerCase();
    const allSets = [];
    
    // 1. 從 DB.sets 提取 (舊版寫法)
    if (typeof DB !== 'undefined' && DB.sets) {
        for (const [setId, setInfo] of Object.entries(DB.sets)) {
            const setItems = setInfo.items.map(itemId => wikiData.items.find(i => i.id === itemId) || DB.items[itemId]).filter(Boolean);
            if (setItems.length === 0) continue;
            
            let effs = [];
            if (setInfo.hp) effs.push(`HP+${setInfo.hp}`);
            if (setInfo.mp) effs.push(`MP+${setInfo.mp}`);
            if (setInfo.hpR) effs.push(`HP回復+${setInfo.hpR}`);
            if (setInfo.mpR) effs.push(`MP回復+${setInfo.mpR}`);
            if (setInfo.ac) effs.push(`AC-${setInfo.ac}`);
            if (setInfo.mr) effs.push(`MR+${setInfo.mr}`);
            if (setInfo.str) effs.push(`力量+${setInfo.str}`);
            if (setInfo.dex) effs.push(`敏捷+${setInfo.dex}`);
            if (setInfo.con) effs.push(`體質+${setInfo.con}`);
            if (setInfo.int) effs.push(`智力+${setInfo.int}`);
            if (setInfo.wis) effs.push(`精神+${setInfo.wis}`);
            if (setInfo.cha) effs.push(`魅力+${setInfo.cha}`);
            
            allSets.push({
                id: setId,
                name: setInfo.n,
                items: setItems,
                effectDesc: effs.length > 0 ? effs.join('、') : '無特別說明',
            });
        }
    }
    
    // 2. 從道具的 set 屬性提取 (新版寫法)
    const newSetsMap = {};
    wikiData.items.forEach(item => {
        if (item.set) {
            if (!newSetsMap[item.set]) {
                newSetsMap[item.set] = { id: item.set, items: [], effectDesc: '', name: '' };
            }
            newSetsMap[item.set].items.push(item);
            
            // 從說明中擷取名稱與效果，例如：【歐林西瑪套裝】...：...</span>
            if (item.d && item.d.includes('【')) {
                const match = item.d.match(/【(.*?)】.*?：(.*?)。?(?:<\/span>|$)/);
                if (match) {
                    newSetsMap[item.set].name = match[1];
                    newSetsMap[item.set].effectDesc = match[2];
                }
            }
        }
    });
    
    for (const key in newSetsMap) {
        const setObj = newSetsMap[key];
        if (!setObj.name) setObj.name = key + ' 套裝';
        if (!setObj.effectDesc) setObj.effectDesc = '請見個別裝備說明';
        
        // 避免重複加入
        if (!allSets.find(s => s.name === setObj.name)) {
            allSets.push(setObj);
        }
    }
    
    // 搜尋過濾
    const filteredSets = allSets.filter(set => {
        if (keyword === '') return true;
        if (set.name && set.name.toLowerCase().includes(keyword)) return true;
        if (set.effectDesc && set.effectDesc.toLowerCase().includes(keyword)) return true;
        if (set.items.some(item => item.n && item.n.toLowerCase().includes(keyword))) return true;
        return false;
    });
    
    if (filteredSets.length === 0) {
        itemsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // 渲染卡片
    itemsGrid.innerHTML = filteredSets.map(set => {
        const itemsHtml = set.items.map(item => `
            <div class="flex items-center gap-2 p-2 bg-gray-950/50 rounded-lg border border-gray-800">
                <div class="w-8 h-8 flex-shrink-0 bg-gray-900 border border-gray-700 rounded flex items-center justify-center">
                    <img src="${getItemIconPath(item)}" alt="${item.n}" class="w-full h-full object-contain" onerror="this.style.display='none'">
                </div>
                <span class="text-sm text-gray-300 font-medium">${item.n}</span>
            </div>
        `).join('');
        
        return `
            <div class="glass-panel p-5 rounded-xl border border-yellow-700/40 hover:-translate-y-1 hover:shadow-lg hover:border-yellow-600/60 transition-all duration-200 flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full pointer-events-none"></div>
                <div class="flex justify-between items-center mb-4 border-b border-gray-800 pb-3 relative z-10">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-yellow-500 text-lg drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"></i>
                        <h4 class="text-lg font-bold text-yellow-400">${set.name}</h4>
                    </div>
                    <span class="text-xs text-yellow-500 bg-yellow-900/30 border border-yellow-700/50 px-2 py-1 rounded">共 ${set.items.length} 件</span>
                </div>
                
                <div class="mb-5 flex-1 relative z-10">
                    <div class="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">包含裝備</div>
                    <div class="grid grid-cols-2 gap-2">
                        ${itemsHtml}
                    </div>
                </div>
                
                <div class="mt-auto pt-3 border-t border-gray-800 bg-gray-900/40 -mx-5 -mb-5 px-5 py-4 rounded-b-xl relative z-10">
                    <div class="text-xs text-yellow-600/80 mb-1 font-bold uppercase tracking-wider"><i class="fa-solid fa-sparkles mr-1"></i>套裝效果</div>
                    <p class="text-sm text-yellow-200/90 font-medium leading-relaxed">
                        ${set.effectDesc}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// 3. 事件綁定 (Event Listeners)
// ==========================================

// 渲染子分類按鈕
const subFiltersContainer = document.getElementById('item-sub-filters');

function renderSubFilters() {
    if (!subFiltersContainer) return;
    
    const options = subFilterOptions[currentFilterType];
    
    // 只有當前分類有子分類，且不是 'all' 或 'relic' 時才顯示
    if (!options || currentFilterType === 'all' || currentFilterType === 'relic') {
        subFiltersContainer.classList.add('hidden');
        subFiltersContainer.innerHTML = '';
        currentFilterSubType = 'all';
        return;
    }
    
    subFiltersContainer.classList.remove('hidden');
    subFiltersContainer.innerHTML = options.map(opt => `
        <button data-subtype="${opt.id}" class="px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
            currentFilterSubType === opt.id 
            ? 'bg-primary-600 text-white border-primary-500 shadow-sm' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-gray-700'
        } sub-filter-btn">
            ${opt.name}
        </button>
    `).join('');
    
    // 綁定子分類按鈕事件
    const subFilterBtns = subFiltersContainer.querySelectorAll('.sub-filter-btn');
    subFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentFilterSubType = e.target.getAttribute('data-subtype');
            renderSubFilters(); // 重新渲染以更新 active 樣式
            renderItems();
        });
    });
}

// 主分類按鈕事件
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 更新主按鈕樣式
        filterBtns.forEach(b => {
            b.classList.remove('bg-primary-600', 'text-white');
            b.classList.add('bg-gray-800', 'text-gray-300');
        });
        e.target.classList.remove('bg-gray-800', 'text-gray-300');
        e.target.classList.add('bg-primary-600', 'text-white');
        
        // 更新過濾狀態並渲染
        currentFilterType = e.target.getAttribute('data-type');
        currentFilterSubType = 'all'; // 切換主分類時，重設子分類
        renderSubFilters();
        renderItems();
    });
});

// 頂部全域搜尋列事件
const globalSearch = document.getElementById('global-search');
globalSearch.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    
    // 如果目前不在 items 頁面，自動切換過去 (為了展示搜尋功能)
    // 這裡我們簡單判定，如果在首頁搜尋，就切換到圖鑑
    const activeSection = document.querySelector('.content-section.active');
    if(activeSection.id !== 'tab-items' && currentSearchQuery !== '') {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            if(btn.getAttribute('data-target') === 'tab-items') {
                btn.click();
            }
        });
    }

    // 只有在 items 頁面才執行 item 的搜尋過濾
    if (document.getElementById('tab-items').classList.contains('active')) {
        renderItems();
    }
});

// 當切換到不同頁籤時，確保資料有被渲染
document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-items') {
        currentSearchQuery = globalSearch.value.trim();
        renderItems();
    }
    if (e.detail === 'tab-drops') {
        if(dropSearchInput) currentDropSearchQuery = dropSearchInput.value.trim();
        renderDrops();
    }
});

// ==========================================
// 4. 掉落物雙向查詢系統 (Drop Lookup)
// ==========================================

// 將 MOB_DROPS 轉換為扁平化的陣列
function buildDropData() {
    const drops = [];
    if (typeof MOB_DROPS !== 'undefined') {
        for (const [monsterName, itemDrops] of Object.entries(MOB_DROPS)) {
            itemDrops.forEach(drop => {
                const itemId = drop[0];
                const chance = drop[1];
                
                // 從 DB 尋找道具名稱，若找不到則使用 ID 兜底
                const itemData = DB?.items?.[itemId];
                const itemName = itemData ? itemData.n : itemId;
                
                let mobData = null;
                if (typeof DB !== 'undefined' && DB.mobs) {
                    mobData = Object.values(DB.mobs).find(m => m.n === monsterName);
                }
                
                drops.push({
                    monster: monsterName,
                    itemId: itemId,
                    itemName: itemName,
                    chance: chance,
                    isLegend: itemData?.legend ? true : false,
                    itemData: itemData,
                    mobData: mobData
                });
            });
        }
    }
    return drops;
}

wikiData.drops = buildDropData();

const dropTableBody = document.getElementById('drop-table-body');
const dropEmptyState = document.getElementById('drop-empty-state');
const dropLimitWarning = document.getElementById('drop-limit-warning');
const dropSearchInput = document.getElementById('drop-search');

let currentDropSearchQuery = '';
let currentDropSort = { column: 'chance', asc: false }; // 預設按機率降序

function sortDropTable(column) {
    if (currentDropSort.column === column) {
        currentDropSort.asc = !currentDropSort.asc;
    } else {
        currentDropSort.column = column;
        currentDropSort.asc = column === 'monster' || column === 'item' ? true : false;
    }
    
    // 更新表頭 icon
    ['monster', 'item', 'chance'].forEach(c => {
        const icon = document.getElementById(`sort-icon-${c}`);
        if(icon) {
            icon.className = 'fa-solid ml-1 opacity-50 ' + (c === currentDropSort.column ? (currentDropSort.asc ? 'fa-sort-up opacity-100 text-gold-400' : 'fa-sort-down opacity-100 text-gold-400') : 'fa-sort');
        }
    });

    renderDrops();
}

// 暴露到全域供 HTML 點擊事件呼叫
window.sortDropTable = sortDropTable;

function renderDrops() {
    if (!dropTableBody) return;
    
    const keyword = currentDropSearchQuery.toLowerCase();
    let filteredDrops = wikiData.drops.filter(d => {
        return keyword === '' || 
               d.monster.toLowerCase().includes(keyword) || 
               d.itemName.toLowerCase().includes(keyword) ||
               d.itemId.toLowerCase().includes(keyword);
    });
    
    // 排序
    filteredDrops.sort((a, b) => {
        let valA, valB;
        if (currentDropSort.column === 'monster') { valA = a.monster; valB = b.monster; }
        else if (currentDropSort.column === 'item') { valA = a.itemName; valB = b.itemName; }
        else { valA = a.chance; valB = b.chance; }
        
        if (valA < valB) return currentDropSort.asc ? -1 : 1;
        if (valA > valB) return currentDropSort.asc ? 1 : -1;
        return 0;
    });

    // 效能與版面考量：限制顯示筆數
    const maxDisplay = 150;
    if (filteredDrops.length > maxDisplay) {
        if(dropLimitWarning) dropLimitWarning.classList.remove('hidden');
        filteredDrops = filteredDrops.slice(0, maxDisplay);
    } else {
        if(dropLimitWarning) dropLimitWarning.classList.add('hidden');
    }
    
    if (filteredDrops.length === 0) {
        dropTableBody.innerHTML = '';
        dropEmptyState.classList.remove('hidden');
    } else {
        dropEmptyState.classList.add('hidden');
        dropTableBody.innerHTML = filteredDrops.map(d => {
            const itemClass = d.isLegend ? 'text-gold-400 font-bold' : 'text-primary-400 font-medium';
            const crown = d.isLegend ? '<i class="fa-solid fa-crown text-gold-500 text-xs mr-1"></i> ' : '';
            
            // 物品圖示
            const itemIconPath = d.itemData ? getItemIconPath(d.itemData) : `idle-lineage-class/assets/icons/items/${encodeURIComponent(d.itemId)}.png`;
            const itemIconHtml = `<img src="./${itemIconPath}" class="w-6 h-6 object-contain inline-block mr-3 flex-shrink-0" onerror="this.outerHTML='<i class=\\\'fa-solid fa-box text-gray-500 text-sm mr-3\\\'></i>'">`;

            // 怪物圖示
            const mobImgFallback = d.mobData && d.mobData.img ? d.mobData.img : '';
            const mobIconPath = `idle-lineage-class/assets/anim/${encodeURIComponent(d.monster)}/idle_0.png`;
            const mobIconHtml = `
                <div class="w-10 h-10 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
                    <img src="./${mobIconPath}" alt="${d.monster}" class="w-full h-full object-contain"
                        onerror="this.onerror=null; ${mobImgFallback ? `this.src='${mobImgFallback}'; this.onerror=function(){this.outerHTML='<i class=\\\'fa-solid fa-ghost text-gray-500 text-sm\\\'></i>'};` : `this.outerHTML='<i class=\\\'fa-solid fa-ghost text-gray-500 text-sm\\\'></i>';`}">
                </div>
            `;

            return `
                <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-gray-200 whitespace-nowrap">
                        <div class="flex items-center">
                            ${mobIconHtml}
                            <span>${d.monster}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 ${itemClass}">
                        <div class="flex items-center">
                            ${itemIconHtml}
                            <div>
                                ${crown}${d.itemName}
                                <div class="text-[10px] text-gray-500 font-mono mt-0.5">${d.itemId}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <span class="inline-block bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">
                            ${d.chance}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

if (dropSearchInput) {
    dropSearchInput.addEventListener('input', (e) => {
        currentDropSearchQuery = e.target.value.trim();
        renderDrops();
    });
}

// 初始化：初次載入時渲染一次
document.addEventListener('DOMContentLoaded', () => {
    // 若遊戲版本存在，顯示它
    if (typeof GAME_VERSION !== 'undefined') {
        const versionEl = document.getElementById('game-version-display');
        if (versionEl) versionEl.textContent = GAME_VERSION;
    }
    
    // 先執行一次渲染（雖然預設在首頁，但先產生好 DOM 讓切換時無延遲）
    renderItems();
    renderDrops();
    sortDropTable('chance'); // 初始化排序圖示
});
