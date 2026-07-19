/**
 * Wiki Application Logic
 * 負責處理資料轉換、渲染圖鑑、與搜尋功能
 */

// ==========================================
// 1. 資料處理與轉換 (Data Management)
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
    npc_atelier:      { name: '亞提利歐',     location: '長老會議廳', title: '製作',        icon: 'fa-hammer',           color: 'text-purple-400' },
};

const TOWN_ORDER = [
    '銀騎士村', '說話之島', '妖精森林',
    '奇岩', '海音', '歐瑞村莊', '亞丁',
    '傲慢之塔入口', '象牙塔', '威頓村',
    '希培利亞村莊', '貝希摩斯', '沉默洞穴',
    '炎魔謁見所', '席琳神殿', '長老會議廳'
];

function injectSpecialWikiCrafts() {
    if (typeof CRAFT_RECIPES === 'undefined') return;

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
                { id: `_wand_src_${r.src}`, cnt: 1, _displayName: `+7以上 ${r.srcName} ×1`, _special: true, _tooltip: '需要 +7 強化值以上的來源魔杖（不繼承強化值／屬性至成品）', _icon: 'fa-wand-sparkles' }
            ]
        }));
        injectRecipes('npc_mystic_mage', { name: '神秘的魔法師', location: '象牙塔', title: '魔杖改造', icon: 'fa-wand-sparkles', color: 'text-violet-400' }, mysticWandRecipes);
    }

    // 8. 宙斯之熔岩高崙 (滅魔裝備)
    if (typeof SLAYER_RECIPES !== 'undefined' && typeof SLAYER_SRC_NAME !== 'undefined') {
        const slayerRecipes = SLAYER_RECIPES.map(r => ({
            result: r.result,
            req: [
                ...(r.mats || []).map(m => ({ id: m.id, cnt: m.cnt })),
                { id: `_slayer_src`, cnt: 1, _displayName: `+7以上 ${SLAYER_SRC_NAME} ×1`, _special: true, _tooltip: '需要 +7 強化值以上的來源裝備（不繼承強化值／屬性至成品）', _icon: 'fa-shield-halved' }
            ]
        }));
        injectRecipes('npc_zeus_golem', { name: '宙斯之熔岩高崙', location: '威頓村', title: '製作', icon: 'fa-mountain-sun', color: 'text-orange-500' }, slayerRecipes);
    }
    // 9. 炎魔之影 (惡魔王武器客製)
    if (typeof DEMONKING_RECIPES !== 'undefined' && typeof DEMONKING_MATS !== 'undefined') {
        const demonRecipes = DEMONKING_RECIPES.map(r => ({
            result: r.result,
            req: [
                ...DEMONKING_MATS.map(m => ({ id: m.id, cnt: m.cnt })),
                { id: `_demon_src_${r.src}`, cnt: 1, _displayName: `+11以上 ${r.srcName} ×1`, _special: true, _tooltip: '需要 +11 強化值以上的來源裝備', _icon: 'fa-khanda' }
            ]
        }));
        injectRecipes('npc_flame_shadow', { name: '炎魔之影', location: '炎魔謁見所', title: '客製製作', icon: 'fa-fire', color: 'text-red-500' }, demonRecipes);
    }

    // 10. 琉米埃爾 (神聖執行團裝備)
    if (typeof LUMIEL_RECIPES !== 'undefined') {
        const lumielRecipes = LUMIEL_RECIPES.map(r => ({
            result: r.result,
            req: [
                ...(r.mats || []).map(m => ({ id: m.id, cnt: m.cnt })),
                { id: `_lumiel_src_${r.src}`, cnt: 1, _displayName: `+7以上 ${r.srcName} ×1`, _special: true, _tooltip: '需要 +7 強化值以上的來源裝備', _icon: 'fa-shield-halved' }
            ]
        }));
        injectRecipes('npc_lumiel', { name: '琉米埃爾', location: '海音村莊', title: '客製製作', icon: 'fa-hammer', color: 'text-yellow-400' }, lumielRecipes);
    }

}

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
let currentFilterSubSubType = 'all';
let currentSearchQuery = '';
let currentPropertyFilters = [];
let propertyFilterMode = 'AND'; // 'AND' or 'OR'
let currentClassFilters = []; // empty = all classes
let filterRelicOnly = false;
const propertyFiltersContainer = document.getElementById('item-property-filters-container');

// 子分類設定
const subFilterOptions = {
    wpn: [
        { id: 'all', name: '全部武器' },
        { id: '1h', name: '單手武器' },
        { id: '2h', name: '雙手武器' },
        { id: 'ranged', name: '遠距武器' },
        { id: 'sword', name: '劍' },
        { id: 'dagger', name: '匕首' },
        { id: 'blunt', name: '斧頭/鈍器' },
        { id: 'spear', name: '矛/槍' },
        { id: 'wand', name: '法杖' },
        { id: 'bow', name: '弓' },
        { id: 'crossbow', name: '十字弓' },
        { id: 'arrow', name: '箭矢' },
        { id: 'dual', name: '雙刀' },
        { id: 'claw', name: '鋼爪' },
        { id: 'chainsword', name: '鎖鏈劍' },
        { id: 'kiringku', name: '奇古獸' }
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
        { id: 'ear', name: '耳環' },
        { id: 'pet', name: '寵物裝備' }
    ],
    etc: [
        { id: 'all', name: '全部雜項' },
        { id: 'mat', name: '製作材料' },
        { id: 'other', name: '其他' }
    ],
    relic: [
        { id: 'all', name: '全部遺物' },
        { id: 'dagger', name: '匕首' },
        { id: 'sword1', name: '單手劍' },
        { id: 'sword2', name: '雙手劍' },
        { id: 'katana', name: '武士刀' },
        { id: 'blunt1', name: '單手鈍器' },
        { id: 'blunt2', name: '雙手鈍器' },
        { id: 'spear', name: '矛' },
        { id: 'claw', name: '鋼爪' },
        { id: 'dual', name: '雙刀' },
        { id: 'chainsword', name: '鎖鏈劍' },
        { id: 'bow', name: '弓' },
        { id: 'xbow', name: '十字弓' },
        { id: 'wand', name: '魔杖' },
        { id: 'qigu', name: '奇古獸' },
        { id: 'quiver', name: '箭筒' },
        { id: 'wpn_other', name: '其他武器' },
        { id: 'helm', name: '頭盔' },
        { id: 'armor', name: '盔甲' },
        { id: 'shin', name: '脛甲' },
        { id: 'tshirt', name: '內衣' },
        { id: 'cloak', name: '斗篷' },
        { id: 'boots', name: '長靴' },
        { id: 'gloves', name: '手套' },
        { id: 'shield', name: '盾牌' },
        { id: 'armguard', name: '臂甲' },
        { id: 'amulet', name: '項鍊' },
        { id: 'ring', name: '戒指' },
        { id: 'belt', name: '腰帶' },
        { id: 'ear', name: '耳環' },
        { id: 'pet', name: '寵物裝備' }

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
            badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">命中 ${item.hit > 0 ? '+' : ''}${item.hit}</span>`;
        }
    } else if (item.type === 'arm') {
        badges += `<span class="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-shield-halved mr-1"></i>防具</span>`;
        if (item.ac) {
            badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">防禦(AC) ${item.ac < 0 ? '+' : '-'}${Math.abs(item.ac)}</span>`;
        }
    } else if (item.type === 'acc') {
        badges += `<span class="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded border border-purple-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-ring mr-1"></i>飾品</span>`;
    } else if (item.type === 'etc') {
        badges += `<span class="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded border border-green-700/50 mr-2 mb-2 inline-block"><i class="fa-solid fa-box mr-1"></i>材料/雜項</span>`;
    }

    if (item.safe) {
        badges += `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 mr-2 mb-2 inline-block">安定值 ${item.safe}</span>`;
    }
    
    // 基本屬性
    if (item.str) badges += `<span class="text-xs px-2 py-1 rounded bg-orange-900/40 text-orange-300 mr-2 mb-2 inline-block border border-orange-700/50">力 ${item.str > 0 ? '+' : ''}${item.str}</span>`;
    if (item.dex) badges += `<span class="text-xs px-2 py-1 rounded bg-green-900/40 text-green-300 mr-2 mb-2 inline-block border border-green-700/50">敏 ${item.dex > 0 ? '+' : ''}${item.dex}</span>`;
    if (item.con) badges += `<span class="text-xs px-2 py-1 rounded bg-yellow-900/40 text-yellow-300 mr-2 mb-2 inline-block border border-yellow-700/50">體 ${item.con > 0 ? '+' : ''}${item.con}</span>`;
    if (item.int) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">智 ${item.int > 0 ? '+' : ''}${item.int}</span>`;
    if (item.wis) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 mr-2 mb-2 inline-block border border-purple-700/50">精 ${item.wis > 0 ? '+' : ''}${item.wis}</span>`;
    if (item.cha) badges += `<span class="text-xs px-2 py-1 rounded bg-pink-900/40 text-pink-300 mr-2 mb-2 inline-block border border-pink-700/50">魅 ${item.cha > 0 ? '+' : ''}${item.cha}</span>`;

    // 戰鬥與生存屬性
    if (item.mhp) badges += `<span class="text-xs px-2 py-1 rounded bg-red-900/40 text-red-300 mr-2 mb-2 inline-block border border-red-700/50">HP ${item.mhp > 0 ? '+' : ''}${item.mhp}</span>`;
    if (item.mmp) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">MP ${item.mmp > 0 ? '+' : ''}${item.mmp}</span>`;
    if (item.hpR) badges += `<span class="text-xs px-2 py-1 rounded bg-red-900/40 text-red-300 mr-2 mb-2 inline-block border border-red-700/50">HP回 ${item.hpR > 0 ? '+' : ''}${item.hpR}</span>`;
    if (item.mpR) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">MP回 ${item.mpR > 0 ? '+' : ''}${item.mpR}</span>`;
    if (item.mr) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 mr-2 mb-2 inline-block border border-purple-700/50">魔防 ${item.mr > 0 ? '+' : ''}${item.mr}</span>`;
    if (item.dr) badges += `<span class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 mr-2 mb-2 inline-block border border-gray-700">減傷 ${item.dr > 0 ? '+' : ''}${item.dr}</span>`;
    if (item.er) badges += `<span class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 mr-2 mb-2 inline-block border border-gray-700">ER ${item.er > 0 ? '+' : ''}${item.er}</span>`;

    // 攻擊額外屬性
    if (item.meleeDmg) badges += `<span class="text-xs px-2 py-1 rounded bg-red-900/40 text-red-300 mr-2 mb-2 inline-block border border-red-700/50">近傷 ${item.meleeDmg > 0 ? '+' : ''}${item.meleeDmg}</span>`;
    if (item.meleeHit) badges += `<span class="text-xs px-2 py-1 rounded bg-red-900/40 text-red-300 mr-2 mb-2 inline-block border border-red-700/50">近命 ${item.meleeHit > 0 ? '+' : ''}${item.meleeHit}</span>`;
    if (item.rangedDmg) badges += `<span class="text-xs px-2 py-1 rounded bg-green-900/40 text-green-300 mr-2 mb-2 inline-block border border-green-700/50">遠傷 ${item.rangedDmg > 0 ? '+' : ''}${item.rangedDmg}</span>`;
    if (item.rangedHit) badges += `<span class="text-xs px-2 py-1 rounded bg-green-900/40 text-green-300 mr-2 mb-2 inline-block border border-green-700/50">遠命 ${item.rangedHit > 0 ? '+' : ''}${item.rangedHit}</span>`;
    if (item.mdmg) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 mr-2 mb-2 inline-block border border-purple-700/50">魔傷 ${item.mdmg > 0 ? '+' : ''}${item.mdmg}</span>`;
    if (item.extraMp) badges += `<span class="text-xs px-2 py-1 rounded bg-cyan-900/40 text-cyan-300 mr-2 mb-2 inline-block border border-cyan-700/50">額外MP ${item.extraMp > 0 ? '+' : ''}${item.extraMp}</span>`;
    if (item.weightCap) badges += `<span class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 mr-2 mb-2 inline-block border border-gray-700">負重 ${item.weightCap > 0 ? '+' : ''}${item.weightCap}</span>`;

    // 屬性抗性
    if (item.resFire) badges += `<span class="text-xs px-2 py-1 rounded bg-red-900/40 text-red-400 mr-2 mb-2 inline-block border border-red-700/50">火抗 ${item.resFire > 0 ? '+' : ''}${item.resFire}</span>`;
    if (item.resWater) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-400 mr-2 mb-2 inline-block border border-blue-700/50">水抗 ${item.resWater > 0 ? '+' : ''}${item.resWater}</span>`;
    if (item.resEarth) badges += `<span class="text-xs px-2 py-1 rounded bg-yellow-900/40 text-yellow-400 mr-2 mb-2 inline-block border border-yellow-700/50">地抗 ${item.resEarth > 0 ? '+' : ''}${item.resEarth}</span>`;
    if (item.resWind) badges += `<span class="text-xs px-2 py-1 rounded bg-green-900/40 text-green-400 mr-2 mb-2 inline-block border border-green-700/50">風抗 ${item.resWind > 0 ? '+' : ''}${item.resWind}</span>`;
    if (item.resNone) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-400 mr-2 mb-2 inline-block border border-purple-700/50">無抗 ${item.resNone > 0 ? '+' : ''}${item.resNone}%</span>`;

    // 異常抗性與免疫
    if (item.stunResist) badges += `<span class="text-xs px-2 py-1 rounded bg-orange-900/40 text-orange-300 mr-2 mb-2 inline-block border border-orange-700/50">抗暈 ${item.stunResist > 0 ? '+' : ''}${item.stunResist}</span>`;
    if (item.freezeResist) badges += `<span class="text-xs px-2 py-1 rounded bg-indigo-900/40 text-indigo-300 mr-2 mb-2 inline-block border border-indigo-700/50">抗冰 ${item.freezeResist > 0 ? '+' : ''}${item.freezeResist}</span>`;
    
    if (item.immFreeze) badges += `<span class="text-xs px-2 py-1 rounded bg-indigo-900/40 text-indigo-300 mr-2 mb-2 inline-block border border-indigo-700/50">免疫冰凍</span>`;
    if (item.immPoison) badges += `<span class="text-xs px-2 py-1 rounded bg-emerald-900/40 text-emerald-300 mr-2 mb-2 inline-block border border-emerald-700/50">免疫中毒</span>`;
    if (item.immParalyze) badges += `<span class="text-xs px-2 py-1 rounded bg-gray-700/40 text-gray-300 mr-2 mb-2 inline-block border border-gray-600">免疫麻痺</span>`;
    if (item.immStone) badges += `<span class="text-xs px-2 py-1 rounded bg-stone-700/80 text-stone-300 mr-2 mb-2 inline-block border border-stone-600">免疫石化</span>`;
    if (item.immSlow) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">免疫緩速</span>`;
    if (item.immHold) badges += `<span class="text-xs px-2 py-1 rounded bg-yellow-900/40 text-yellow-300 mr-2 mb-2 inline-block border border-yellow-700/50">免疫木乃伊</span>`;

    if (item.thorns) badges += `<span class="text-xs px-2 py-1 rounded bg-red-900/40 text-red-300 mr-2 mb-2 inline-block border border-red-700/50">反擊 ${item.thorns}</span>`;

    // 寵物專屬屬性
    if (item.petDmg) badges += `<span class="text-xs px-2 py-1 rounded bg-orange-900/40 text-orange-300 mr-2 mb-2 inline-block border border-orange-700/50">寵物傷害 ${item.petDmg > 0 ? '+' : ''}${item.petDmg}</span>`;
    if (item.petHit) badges += `<span class="text-xs px-2 py-1 rounded bg-orange-900/40 text-orange-300 mr-2 mb-2 inline-block border border-orange-700/50">寵物命中 ${item.petHit > 0 ? '+' : ''}${item.petHit}</span>`;
    if (item.petAc) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">寵物防禦(AC) ${item.petAc < 0 ? '+' : '-'}${Math.abs(item.petAc)}</span>`;
    if (item.petMr) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 mr-2 mb-2 inline-block border border-purple-700/50">寵物魔防 ${item.petMr > 0 ? '+' : ''}${item.petMr}</span>`;
    if (item.petInt) badges += `<span class="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300 mr-2 mb-2 inline-block border border-blue-700/50">寵物智力 ${item.petInt > 0 ? '+' : ''}${item.petInt}</span>`;
    if (item.petWis) badges += `<span class="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300 mr-2 mb-2 inline-block border border-purple-700/50">寵物精神 ${item.petWis > 0 ? '+' : ''}${item.petWis}</span>`;

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
    'dice_death': '死神之骰',
    'moonburst': '月光爆裂',
    'haste': '自我加速',
    'immStone': '免疫石化'
};

function getItemEffectsHtml(item) {
    let effects = [];
    
    const addBadge = (text, icon = 'fa-wand-magic-sparkles', color = 'indigo') => {
        effects.push(`<span class="bg-${color}-900/40 text-${color}-300 text-[11px] px-2 py-1 rounded border border-${color}-700/50"><i class="fa-solid ${icon} mr-1"></i>${text}</span>`);
    };

    if (item.unBonus) addBadge('不死／狼人加成', 'fa-skull', 'orange');
    if (item.eff === 'pierce') addBadge(`穿透 ${item.pierceChance !== undefined ? item.pierceChance : 100}%`, 'fa-arrows-down-to-line', 'indigo');
    if (item.alsoPierce) addBadge(`穿透 ${item.pierceChance !== undefined ? item.pierceChance : 100}%`, 'fa-arrows-down-to-line', 'indigo');
    if (item.eff === 'moonburst') addBadge('月光爆裂', 'fa-moon', 'indigo');
    if (item.eff === 'dice_death') addBadge('即死', 'fa-skull-crossbones', 'red');
    if (item.eff === 'haste') addBadge('自我加速', 'fa-person-running', 'indigo');
    if (item.eff === 'crush') addBadge('重擊', 'fa-hammer', 'indigo');
    if (item.eff === 'cleave') addBadge('切割', 'fa-scissors', 'indigo');
    if (item.eff === 'combo') addBadge(`雙擊 ${item.comboRate || 0}%`, 'fa-khanda', 'indigo');
    if (item.weakExpose) addBadge('弱點曝光', 'fa-eye', 'purple');
    if (item.vampPct) addBadge(`吸取HP ${Math.round(item.vampPct * 100)}%`, 'fa-droplet', 'red');
    if (item.ignHardSkin) addBadge('貫穿硬皮', 'fa-burst', 'orange');
    if (item.redSpecter) addBadge('紅惡靈逆襲', 'fa-ghost', 'red');
    if (item.blueSpecter) addBadge('藍惡靈奪魔', 'fa-ghost', 'blue');
    if (item.rapidfire) addBadge(`連射 ${item.rapidfire}%`, 'fa-angles-right', 'green');
    if (item.block) addBadge(`格檔 ${item.block}%`, 'fa-shield', 'blue');
    if (item.immStone) addBadge('免疫石化', 'fa-hill-rockslide', 'stone');
    if (item.immPoison) addBadge('免疫中毒', 'fa-skull', 'emerald');
    if (item.unique) addBadge('唯一', 'fa-star', 'yellow');
    if (item.eff === 'magicstrike') addBadge('魔擊', 'fa-bolt', 'indigo');
    if (item.eff === 'magicburst') addBadge('魔爆', 'fa-bomb', 'indigo');
    if (item.eff === 'mp_drain') addBadge('吸收魔力', 'fa-droplet', 'blue');
    
    if (item.meleeHitSpell) addBadge(`命中施法 (${item.meleeHitSpell.skn || '附加法術'})`, 'fa-bolt', 'indigo');
    if (item.spellProc) addBadge(`攻擊施法 (${item.spellProc.skn || '附加法術'})`, 'fa-bolt', 'indigo');
    
    if (item.procSkill) {
        let _procName = (typeof DB !== 'undefined' && DB.skills && DB.skills[item.procSkill]) ? DB.skills[item.procSkill].n : '技能';
        addBadge(`${item.procOnHit ? '命中施法' : '攻擊施法'} (${_procName})`, 'fa-fire', 'indigo');
    }
    if (item.procSkill2 && item.procSkill2.skId) {
        let _procName = (typeof DB !== 'undefined' && DB.skills && DB.skills[item.procSkill2.skId]) ? DB.skills[item.procSkill2.skId].n : '技能';
        addBadge(`攻擊施法 (${_procName})`, 'fa-fire', 'indigo');
    }
    if (item.procPoisonPct) addBadge('附毒', 'fa-vial-virus', 'green');
    if (item.iaiCrit) addBadge('居合必定爆擊', 'fa-bolt', 'indigo');
    if (item.heavyBonusDmg) addBadge(`重擊額外傷害 +${item.heavyBonusDmg}`, 'fa-hammer', 'indigo');
    
    if (item.procStatusSkill) {
        let _statusName = (typeof DB !== 'undefined' && DB.skills && DB.skills[item.procStatusSkill.skId]) ? DB.skills[item.procStatusSkill.skId].n : '異常狀態';
        addBadge(`異常攻擊 (${_statusName})`, 'fa-skull', 'purple');
    }
    
    if (item.procPoison) addBadge(`中毒 ${item.procPoison.rate || 0}%`, 'fa-skull', 'green');
    else if (item.procPoisonRate) addBadge(`中毒 ${item.procPoisonRate}%`, 'fa-skull', 'green');
    
    if (item.procInstakill) {
        let _ikCond = item.procInstakill.tag === 'undead' ? '不死系' : (item.procInstakill.hpBelow ? '低HP' : '非首領');
        addBadge(`即死 (${_ikCond})`, 'fa-skull-crossbones', 'red');
    }
    
    if (item.procBonusDmg) addBadge(`額外傷害 ${item.procBonusDmg.rate}%`, 'fa-plus', 'red');
    if (item.procDmgReduce) addBadge(`傷害減免 ${item.procDmgReduce.rate}%`, 'fa-minus', 'blue');
    if (item.allLures) addBadge('全部誘捕狀態', 'fa-magnet', 'purple');
    
    if (item.eleBonusDmg) {
        let _bonusEleName = { fire:'火', water:'水', wind:'風', earth:'地' }[item.eleBonusDmg.ele] || '特定屬性';
        addBadge(`屬性專攻 (${_bonusEleName})`, 'fa-fire-flame-curved', 'orange');
    }
    if (item.counterAllEle) addBadge('剋制所有屬性', 'fa-arrows-to-circle', 'orange');
    if (item.counterEles) {
        let _eleNames = item.counterEles.map(e => ({ earth: '地', wind: '風', fire: '火', water: '水' }[e] || e)).join('、');
        addBadge(`剋制 (${_eleNames})`, 'fa-arrows-to-circle', 'orange');
    }
    
    if (item.procBurn) addBadge(`灼燒${item.procBurn.rate ? ` ${item.procBurn.rate}%` : ''}`, 'fa-fire', 'red');
    if (item.onHitEleDmg) {
        let _eleName = { fire:'火焰', water:'寒冰', wind:'風雷', earth:'大地', none:'無屬性' }[item.onHitEleDmg.ele] || '屬性';
        addBadge(`${_eleName}附傷`, 'fa-bolt', 'indigo');
    }
    
    if (item.freeChill) addBadge('施放寒冰氣息免魔', 'fa-snowflake', 'blue');
    if (item.windHelm) addBadge('施放加速免魔', 'fa-wind', 'teal');
    if (item.noConsume && item.isArrow) addBadge('箭矢不消耗', 'fa-infinity', 'gray');
    if (item.oneHand && item.isBow) addBadge('單手持握', 'fa-hand', 'amber');
    
    if (item.ele && item.ele !== 'none') {
        let _wpnEleName = { fire:'火', water:'水', wind:'風', earth:'地' }[item.ele] || item.ele;
        addBadge(`攻擊轉${_wpnEleName}屬性`, 'fa-wand-magic-sparkles', 'indigo');
    }
    
    if (item.skillDmgMult) {
        let _skillNames = Object.keys(item.skillDmgMult).map(skId => (typeof DB !== 'undefined' && DB.skills && DB.skills[skId]) ? DB.skills[skId].n : skId);
        addBadge(`技能增幅 (${_skillNames.join('、')})`, 'fa-arrow-trend-up', 'indigo');
    }
    
    if (item.autoCastMpMult && item.autoCastMpMult > 1) addBadge(`自動施法代價 (MP×${item.autoCastMpMult})`, 'fa-droplet-slash', 'blue');
    if (item.autoCastDmgMult && item.autoCastDmgMult > 1) addBadge(`自動施法增幅 (傷害×${item.autoCastDmgMult})`, 'fa-arrow-trend-up', 'indigo');
    
    if (item.silencedBonusDmg) addBadge('沉默專攻', 'fa-comment-slash', 'purple');
    if (item.poisonedBonusDmg) addBadge('中毒專攻', 'fa-skull', 'green');
    if (item.slowedBonusDmg) addBadge('緩速專攻', 'fa-person-walking-with-cane', 'blue');
    if (item.immParalyzeBonusDmg) addBadge('強韌專攻', 'fa-dumbbell', 'orange');
    
    if (typeof weaponHasBleed === 'function' && weaponHasBleed(item.id)) addBadge('出血', 'fa-droplet', 'red');
    if (typeof getWeaponTags === 'function') {
        let tags = getWeaponTags(item.id);
        if (tags.includes('單手劍')) addBadge('反擊', 'fa-shield-halved', 'blue');
        if (tags.includes('武士刀')) addBadge('居合', 'fa-khanda', 'indigo');
        if (tags.includes('單手鈍器')) addBadge('鈍擊', 'fa-gavel', 'orange');
        if (tags.includes('雙刀')) addBadge('雙刃', 'fa-swords', 'red');
        if (tags.includes('鋼爪')) addBadge('重擊 +5%', 'fa-hand-back-fist', 'indigo');
    }
    
    if (typeof WAND_LIGHTARROW_IDS !== 'undefined' && WAND_LIGHTARROW_IDS.includes(item.id)) addBadge('共鳴 (免費光箭)', 'fa-star', 'yellow');

    if (item.set) addBadge('套裝效果', 'fa-layer-group', 'yellow');

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
    "town_hyperia": "希培利亞村莊",
    "town_behemoth": "貝希摩斯",
    "town_flame_audience": "炎魔謁見所",
    "town_elder_council": "長老會議廳",
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
    "dark_elf_sanctuary": "黑暗妖精聖地",
    "cursed_dark_elf_sanctuary": "受詛咒的黑暗妖精聖地",
    "collapsed_elder_council_hall": "崩壞的長老會議廳",
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
    "tikal_area": "提卡爾神廟地區",
    "tikal_deep": "提卡爾神廟地區深處",
    "tikal_altar": "提卡爾 庫庫爾坎祭壇",
    "town_pirate_village": "海賊島村莊",
    "pirate_wild": "海賊島周邊",
    "pirate_dungeon": "海賊島地監",
    "kent_outer": "肯特外門區",
    "kent_inner": "肯特內城",
    "town_kent_castle": "肯特城",
    "ww_outer": "風木外門區",
    "ww_inner": "風木內城",
    "town_windwood_castle": "風木城",
    "windwood_dungeon": "風木地監",
    "heine_outer": "海音外門區",
    "heine_inner": "海音內城",
    "town_heine_castle": "海音城",
    "hidden_lab_nolife": "無生命體研究室",
    "hidden_lab_darkmagic": "黑魔法研究室",
    "hidden_seal_spirit": "精靈的封印地",
    "hidden_seal_monster": "魔獸的封印地",
    "hidden_seal_demon": "惡魔的封印地",
    "hidden_antqueen": "螞蟻女王藏身處",
    "oblivion_travel": "前往遺忘之島的船隻",
    "oblivion_island": "遺忘之島",
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
    "pride_f100": "傲慢之塔 100樓",
    "sunrise_castle": "日出之國城墎",
    "sunrise_east": "日出之國東之地",
    "sunrise_west": "日出之國西之地",
    "sunrise_north": "日出之國北之地"
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

function getMonsterDropTooltipHtml(d) {
    const mapsText = getMonsterMapsText(d.monster);
    const chanceText = d.isSpecial ? `<span class="text-xs text-amber-400 font-bold">${d.isSpecial}</span> (${d.chance}%)` : `${d.chance}%`;
    return `
        <div class="relative group/monster cursor-help inline-block js-tooltip-container">
            <span class="bg-gray-800 text-gray-300 text-[10px] px-1.5 py-0.5 rounded border border-gray-700 hover:bg-gray-700/80 transition-colors inline-flex items-center">
                ${d.monster} <span class="text-[9px] text-amber-500/80 ml-1">${d.chance}%</span>
            </span>
            <!-- 漂浮視窗 Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/monster:block w-max max-w-[220px] p-2.5 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-50 pointer-events-none opacity-0 group-hover/monster:opacity-100 transition-opacity duration-200 js-tooltip">
                <div class="text-xs text-yellow-400 mb-1.5 font-medium border-b border-gray-700/80 pb-1.5 flex items-center justify-between gap-3">
                    <span><i class="fa-solid fa-cube mr-1"></i>掉落機率</span>
                    <span>${chanceText}</span>
                </div>
                <div class="text-xs text-gray-300 flex items-start gap-1.5 leading-relaxed">
                    <i class="fa-solid fa-map-location-dot mt-0.5 text-gray-400 shrink-0"></i>
                    <span class="break-words whitespace-normal">${mapsText}</span>
                </div>
                <!-- 下方箭頭 -->
                <div class="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-600 js-tooltip-arrow"></div>
                <div class="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-gray-900/95 mt-[-1px] js-tooltip-arrow"></div>
            </div>
        </div>`;
}

function getItemDropsHtml(itemId) {
    if (!wikiData.drops) return '';
    const drops = wikiData.drops.filter(d => d.itemId === itemId);
    
    let finalHtml = '';
    
    // 1. 搜尋商店
    const shopSources = [];
    if (typeof SHOP_LISTS !== 'undefined') {
        for (const [npcId, items] of Object.entries(SHOP_LISTS)) {
            if (items.includes(itemId)) {
                let npcName = npcId;
                let townName = '未知';
                if (typeof DB !== 'undefined' && DB.towns) {
                    for (const [tId, tInfo] of Object.entries(DB.towns)) {
                        if (tInfo.npcs) {
                            const foundNpc = tInfo.npcs.find(n => n.id === npcId);
                            if (foundNpc) {
                                npcName = foundNpc.n;
                                townName = tInfo.n;
                                break;
                            }
                        }
                    }
                }
                shopSources.push(`${townName} - ${npcName}`);
            }
        }
    }
    
    // 2. 搜尋製作
    const craftSources = [];
    if (typeof CRAFT_RECIPES !== 'undefined' && typeof CRAFT_NPC_INFO !== 'undefined') {
        for (const [npcId, recipes] of Object.entries(CRAFT_RECIPES)) {
            if (recipes.some(r => r.result === itemId)) {
                const npcInfo = CRAFT_NPC_INFO[npcId];
                if (npcInfo) {
                    const sourceStr = `${npcInfo.location} - ${npcInfo.name}`;
                    if (!craftSources.includes(sourceStr)) craftSources.push(sourceStr);
                }
            }
        }
    }

    // 3. 搜尋任務與兌換
    const questSources = [];
    if (typeof TRIAL_Q !== 'undefined') {
        const clsNames = {
            'knight': '騎士',
            'mage': '法師',
            'elf': '妖精',
            'dark': '黑妖',
            'illusion': '幻術士',
            'warrior': '戰士',
            'dragon': '龍騎士',
            'royal': '王族'
        };
        
        // 一般試煉任務 (TRIAL_Q)
        for (const [qKey, qData] of Object.entries(TRIAL_Q)) {
            if (qData.rewards && qData.rewards.includes(itemId)) {
                const clsStr = clsNames[qData.cls] || qData.cls;
                const sourceStr = `${clsStr} ${qData.lv}級試煉 - ${qData.npc}`;
                if (!questSources.includes(sourceStr)) questSources.push(sourceStr);
            }
        }
        
        // 50級試煉最終兌換 (TRIAL_50_CFG)
        if (typeof TRIAL_50_CFG !== 'undefined') {
            for (const [clsId, cfg] of Object.entries(TRIAL_50_CFG)) {
                if (cfg.rewards && cfg.rewards.some(r => r.id === itemId)) {
                    const clsStr = clsNames[clsId] || clsId;
                    const sourceStr = `${clsStr} 50級試煉兌換 - ${cfg.npc}`;
                    if (!questSources.includes(sourceStr)) questSources.push(sourceStr);
                }
            }
        }

        // 尤麗婭兌換
        if (typeof YURIA_REWARDS !== 'undefined' && YURIA_REWARDS.some(r => r.id === itemId)) {
            questSources.push('歐林的日記本兌換 - 尤麗婭');
        }
        if (typeof YURIA_HATIN_REWARDS !== 'undefined' && YURIA_HATIN_REWARDS.some(r => r.id === itemId)) {
            questSources.push('黑暗哈汀的日記本兌換 - 尤麗婭');
        }

        // 希米哲兌換
        if (typeof SHIMIZHE_REWARDS !== 'undefined' && SHIMIZHE_REWARDS.includes(itemId)) {
            questSources.push('藍海賊遺物兌換 - 希米哲');
        }

        // 雷德的復仇
        if (itemId === 'acc_summon_ctrl') {
            questSources.push('雷德的復仇任務 - 雷德');
        }
        
        // 入盟禮
        if (typeof PLEDGE_GIFT !== 'undefined' && PLEDGE_GIFT.some(g => g.id === itemId)) {
            questSources.push('加入血盟自動發放 - 入盟禮');
        }
    }

    // 4. 搜尋寶箱
    const boxSources = [];
    const thebesItems = ['wpn_thebes_bow', 'wpn_thebes_dual', 'wpn_thebes_2hsword', 'wpn_thebes_wand', 'blt_thebes_osiris', 'acc_thebes_horus', 'acc_thebes_anubis', 'relic_mandra_spirit', 'relic_death_leaf', 'relic_scarab_shin'];
    if (thebesItems.includes(itemId)) {
        boxSources.push('開啟上鎖的歐西里斯初級/高級寶箱獲得 (巴特爾製作)');
    }
    const tikalItems = ['wpn_kukulkan_spear', 'wpn_kukulkan_gauntlet', 'shd_kukulkan', 'hlm_kukulkan'];
    if (tikalItems.includes(itemId)) {
        boxSources.push('開啟上鎖的庫庫爾坎初級/高級寶箱獲得 (巴特爾製作)');
    }

    // 5. 初始裝備
    const initSources = [];
    if (itemId === 'wpn_11') {
        initSources.push('創立新角色(王族/騎士/法師/妖精/黑妖)時自動取得');
    } else if (itemId === 'wpn_shortbow') {
        initSources.push('創立新角色(妖精)時自動取得');
    } else if (itemId === 'wpn_10') {
        initSources.push('創立新角色(幻術士/龍騎士)時自動取得');
    } else if (itemId === 'wpn_1') {
        initSources.push('創立新角色(戰士)時自動取得');
    } else if (itemId === 'arm_74') {
        initSources.push('創立新角色(妖精)時自動取得');
    } else if (itemId === 'amr_jacket') {
        initSources.push('創立新角色(妖精除外)時自動取得');
    }

    if (shopSources.length > 0 || craftSources.length > 0 || questSources.length > 0 || boxSources.length > 0 || initSources.length > 0) {
        finalHtml += `<div class="mt-3 border-t border-gray-800/50 pt-2">`;
        if (shopSources.length > 0) {
            finalHtml += `<div class="text-[11px] text-gray-400 mb-1 flex flex-wrap items-center">
                <i class="fa-solid fa-shop mr-1.5 text-blue-400"></i>販售: ${shopSources.join('、')}
            </div>`;
        }
        if (craftSources.length > 0) {
            finalHtml += `<div class="text-[11px] text-gray-400 flex flex-wrap items-center ${shopSources.length > 0 ? 'mt-1' : ''}">
                <i class="fa-solid fa-hammer mr-1.5 text-amber-400"></i>製作: ${craftSources.join('、')}
            </div>`;
        }
        if (questSources.length > 0) {
            finalHtml += `<div class="text-[11px] text-gray-400 flex flex-wrap items-center ${(shopSources.length > 0 || craftSources.length > 0) ? 'mt-1' : ''}">
                <i class="fa-solid fa-scroll mr-1.5 text-emerald-400"></i>任務: ${questSources.join('、')}
            </div>`;
        }
        if (boxSources.length > 0) {
            finalHtml += `<div class="text-[11px] text-gray-400 flex flex-wrap items-center ${(shopSources.length > 0 || craftSources.length > 0 || questSources.length > 0) ? 'mt-1' : ''}">
                <i class="fa-solid fa-box-open mr-1.5 text-purple-400"></i>寶箱: ${boxSources.join('、')}
            </div>`;
        }
        if (initSources.length > 0) {
            finalHtml += `<div class="text-[11px] text-gray-400 flex flex-wrap items-center ${(shopSources.length > 0 || craftSources.length > 0 || questSources.length > 0 || boxSources.length > 0) ? 'mt-1' : ''}">
                <i class="fa-solid fa-gift mr-1.5 text-pink-400"></i>初始: ${initSources.join('、')}
            </div>`;
        }
        finalHtml += `</div>`;
    }

    if (drops.length > 0) {
        drops.sort((a, b) => b.chance - a.chance);
        
        let dropClass = finalHtml ? "mt-2 pt-2 border-t border-gray-800/50" : "mt-3 border-t border-gray-800/50 pt-2";
        let html = `<div class="${dropClass}">
            <div class="text-[11px] text-gray-500 mb-1.5 flex items-center">
                <i class="fa-solid fa-box-open mr-1.5"></i>掉落怪物:
            </div>
            <div class="flex flex-wrap gap-1.5">`;
            
        const maxShow = 6;
        if (drops.length <= maxShow) {
            drops.forEach(d => {
                html += getMonsterDropTooltipHtml(d);
            });
            html += `</div></div>`;
        } else {
            const toShow = drops.slice(0, 5);
            const toHide = drops.slice(5);
            
            toShow.forEach(d => {
                html += getMonsterDropTooltipHtml(d);
            });
            
            html += `<span class="bg-primary-900/50 text-primary-300 text-[10px] px-2.5 py-0.5 rounded border border-primary-700/50 cursor-pointer hover:bg-primary-800 transition-colors flex items-center justify-center font-medium" onclick="this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex', 'flex-wrap', 'gap-1.5', 'w-full', 'mt-1'); this.remove();">More..</span>`;
            
            html += `<div class="hidden">`;
            toHide.forEach(d => {
                html += getMonsterDropTooltipHtml(d);
            });
            html += `</div></div></div>`;
        }
        finalHtml += html;
    } else if (!finalHtml) {
        finalHtml = `<div class="text-[11px] text-gray-600 mt-3 border-t border-gray-800/50 pt-2"><i class="fa-solid fa-ghost mr-1"></i>無怪物掉落</div>`;
    }

    return finalHtml;
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
 * 取得套裝中文名稱
 */
function getSetTranslation(setId) {
    if (window.setTranslationMap && window.setTranslationMap[setId]) {
        return window.setTranslationMap[setId];
    }
    const fallbackMap = {
        'leather': '皮', 'bone': '骷髏', 'dk': '死亡騎士', 'silver': '銀釘',
        'oasis': '歐西斯', 'gnome': '侏儒', 'mage': '法師', 'kurt': '克特',
        'steel': '鋼鐵', 'mr': '抗魔', 'guard': '守護', 'kinglord': '四大軍王',
        'demon': '惡魔', 'darkelf': '黑暗妖精', 'orin': '歐林與西瑪',
        'icequeen_charm': '冰之女王魅力', 'frost': '寒冰', 'bluepirate': '藍海賊',
        'emperor': '真．冥皇'
    };
    return fallbackMap[setId] || setId;
}

/**
 * 渲染單個道具卡片 HTML
 */
function createItemCard(item) {
    const isLegend = item.legend ? true : false;
    const borderClass = isLegend ? 'border-gold-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-gray-800';
    const titleClass = isLegend ? 'text-gold-400 font-bold' : 'text-gray-200 font-semibold';
    
    // 1. 標題與特殊標籤區塊
    let setEffectHtml = item.set ? `<div class="text-green-400 text-[11px] font-bold mt-1.5"><i class="fa-solid fa-layer-group mr-1"></i>${getSetTranslation(item.set)} 套裝效果</div>` : '';
    const desc = item.d ? `<div class="text-[11px] text-gray-400 italic mt-2 leading-relaxed border-l-2 border-gray-700 pl-2 py-0.5">${item.d}</div>` : '';

    // 2. 武器專屬數值區
    let wpnStatsHtml = '';
    if (item.type === 'wpn' && !item.isArrow) {
        let hitText = item.isBow ? '遠距離命中' : '近距離命中';
        let dmgText = item.isBow ? '遠距離傷害' : '近距離傷害';
        let hitVal = (item.hit || 0) + (item.isBow ? (item.rangedHit || 0) : (item.meleeHit || 0));
        let dmgVal = (item.dmgBonus || 0) + (item.isBow ? (item.rangedDmg || 0) : (item.meleeDmg || 0));
        let apm = 0;
        if (typeof atkSpdApm === 'function') {
            apm = atkSpdApm(null, item.id);
        } else {
            apm = item.spd ? Math.floor(100 / item.spd) : 60;
        }
        
        wpnStatsHtml = `
            <div class="mt-2.5 border border-gray-700/50 rounded bg-gray-900/50 p-2 shadow-inner">
                <div class="text-[11px] text-yellow-500 font-bold mb-1.5 flex items-center border-b border-gray-800 pb-1"><i class="fa-solid fa-khanda mr-1.5"></i>武器專屬數值</div>
                <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-gray-300 mb-1.5">
                    <div class="flex justify-between"><span>傷害力:</span> <span class="text-white">${item.dmgS || 0} / ${item.dmgL || 0}</span></div>
                    <div class="flex justify-between"><span>${hitText}:</span> <span class="text-white">${hitVal > 0 ? '+'+hitVal : hitVal}</span></div>
                    <div class="flex justify-between"><span>${dmgText}:</span> <span class="text-white">${dmgVal > 0 ? '+'+dmgVal : dmgVal}</span></div>
                    ${item.mdmg ? `<div class="flex justify-between"><span>魔法傷害:</span> <span class="text-white">${item.mdmg > 0 ? '+' : ''}${item.mdmg}</span></div>` : '<div></div>'}
                </div>
                <div class="text-[10px] text-gray-400 mt-1 border-t border-gray-800 pt-1.5 bg-gray-950/50 p-1.5 rounded flex items-center justify-between">
                    <span class="text-blue-300 font-medium"><i class="fa-solid fa-bolt mr-1"></i>基準攻擊速度:</span>
                    <span class="text-gray-200">${apm} <span class="text-gray-500 text-[9px]">次/分</span></span>
                </div>
            </div>
        `;
    }

    // 3. 防具、飾品防禦與生存區
    let defStatsHtml = '';
    let hasDefStats = item.ac || item.mr || item.resFire || item.resWater || item.resEarth || item.resWind || item.resNone || item.dr || item.er;
    if (hasDefStats) {
        defStatsHtml = `
            <div class="mt-2.5 border border-gray-700/50 rounded bg-gray-900/50 p-2 shadow-inner">
                <div class="text-[11px] text-blue-400 font-bold mb-1.5 flex items-center border-b border-gray-800 pb-1"><i class="fa-solid fa-shield-halved mr-1.5"></i>防禦與生存數值</div>
                <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-gray-300">
                    ${item.ac ? `<div class="flex justify-between"><span>防禦力(AC):</span> <span class="text-white">${item.ac < 0 ? item.ac : '-'+Math.abs(item.ac)}</span></div>` : ''}
                    ${item.mr ? `<div class="flex justify-between"><span>魔法防禦(MR):</span> <span class="text-white">${item.mr > 0 ? '+' : ''}${item.mr}</span></div>` : ''}
                    ${item.dr ? `<div class="flex justify-between"><span>額外減傷:</span> <span class="text-white">${item.dr > 0 ? '+' : ''}${item.dr}</span></div>` : ''}
                    ${item.er ? `<div class="flex justify-between"><span>迴避率(ER):</span> <span class="text-white">${item.er > 0 ? '+' : ''}${item.er}</span></div>` : ''}
                    ${item.resFire ? `<div class="flex justify-between"><span>火屬性抗性:</span> <span class="text-red-400">${item.resFire > 0 ? '+' : ''}${item.resFire}</span></div>` : ''}
                    ${item.resWater ? `<div class="flex justify-between"><span>水屬性抗性:</span> <span class="text-blue-400">${item.resWater > 0 ? '+' : ''}${item.resWater}</span></div>` : ''}
                    ${item.resEarth ? `<div class="flex justify-between"><span>地屬性抗性:</span> <span class="text-yellow-600">${item.resEarth > 0 ? '+' : ''}${item.resEarth}</span></div>` : ''}
                    ${item.resNone ? `<div class="flex justify-between col-span-2"><span>無屬性魔法抗性:</span> <span class="text-purple-400">${item.resNone > 0 ? '+' : ''}${item.resNone}%</span></div>` : ''}
                    ${item.resWind ? `<div class="flex justify-between"><span>風屬性抗性:</span> <span class="text-green-400">${item.resWind > 0 ? '+' : ''}${item.resWind}</span></div>` : ''}
                </div>
                ${(item.slot === 'shield' && item.n && item.n.includes('臂甲')) ? `
                <div class="text-[10px] text-gray-400 mt-1.5 border-t border-gray-800 pt-1.5 bg-gray-950/50 p-1.5 rounded">
                    <div class="text-blue-300 font-medium mb-0.5"><i class="fa-solid fa-hand-fist mr-1"></i>臂甲特效:</div>
                    <div class="ml-1 text-gray-300">隨強化等級動態增加額外減傷、傷害或 HP 加成。</div>
                </div>` : ''}
            </div>
        `;
    }

    // 4. 基礎人物能力加成 (紫色)
    let baseStatsHtml = '';
    let hasBaseStats = item.str || item.dex || item.con || item.int || item.wis || item.cha || item.hp || item.mp || item.mhp || item.mmp || item.hpR || item.mpR || item.regenHp || item.weightCap;
    if (hasBaseStats) {
        baseStatsHtml = `
            <div class="mt-2.5 border border-purple-900/40 rounded bg-purple-950/20 p-2 shadow-inner">
                <div class="text-[11px] text-purple-400 font-bold mb-1.5 flex items-center border-b border-purple-900/50 pb-1"><i class="fa-solid fa-user-plus mr-1.5"></i>基礎人物能力加成</div>
                <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-purple-300">
                    ${item.str ? `<div class="flex justify-between"><span>力量(STR):</span> <span class="text-purple-200">${item.str > 0 ? '+' : ''}${item.str}</span></div>` : ''}
                    ${item.dex ? `<div class="flex justify-between"><span>敏捷(DEX):</span> <span class="text-purple-200">${item.dex > 0 ? '+' : ''}${item.dex}</span></div>` : ''}
                    ${item.con ? `<div class="flex justify-between"><span>體質(CON):</span> <span class="text-purple-200">${item.con > 0 ? '+' : ''}${item.con}</span></div>` : ''}
                    ${item.int ? `<div class="flex justify-between"><span>智力(INT):</span> <span class="text-purple-200">${item.int > 0 ? '+' : ''}${item.int}</span></div>` : ''}
                    ${item.wis ? `<div class="flex justify-between"><span>精神(WIS):</span> <span class="text-purple-200">${item.wis > 0 ? '+' : ''}${item.wis}</span></div>` : ''}
                    ${item.cha ? `<div class="flex justify-between"><span>魅力(CHA):</span> <span class="text-purple-200">${item.cha > 0 ? '+' : ''}${item.cha}</span></div>` : ''}
                    ${item.hp ? `<div class="flex justify-between"><span>HP加成:</span> <span class="text-purple-200">${item.hp > 0 ? '+' : ''}${item.hp}</span></div>` : ''}
                    ${item.mp ? `<div class="flex justify-between"><span>MP加成:</span> <span class="text-purple-200">${item.mp > 0 ? '+' : ''}${item.mp}</span></div>` : ''}
                    ${item.mhp ? `<div class="flex justify-between"><span>HP上限:</span> <span class="text-purple-200">${item.mhp > 0 ? '+' : ''}${item.mhp}</span></div>` : ''}
                    ${item.mmp ? `<div class="flex justify-between"><span>MP上限:</span> <span class="text-purple-200">${item.mmp > 0 ? '+' : ''}${item.mmp}</span></div>` : ''}
                    ${item.hpR ? `<div class="flex justify-between"><span>HP恢復:</span> <span class="text-purple-200">${item.hpR > 0 ? '+' : ''}${item.hpR}</span></div>` : ''}
                    ${item.regenHp ? `<div class="flex justify-between"><span>HP自然恢復:</span> <span class="text-purple-200">${item.regenHp > 0 ? '+' : ''}${item.regenHp}</span></div>` : ''}
                    ${item.mpR ? `<div class="flex justify-between"><span>MP恢復:</span> <span class="text-purple-200">${item.mpR > 0 ? '+' : ''}${item.mpR}</span></div>` : ''}
                    ${item.weightCap ? `<div class="flex justify-between"><span>負重上限:</span> <span class="text-purple-200">${item.weightCap > 0 ? '+' : ''}${item.weightCap}</span></div>` : ''}
                </div>
            </div>
        `;
    }

    // 5. 魔力與特殊回復數值
    let mpSpecialHtml = '';
    let hasMpSpecial = item.mpDrain || item.extraMp || item.id === 'wpn_crystal_wand' || item.id === 'wpn_mana_wand';
    if (hasMpSpecial) {
        mpSpecialHtml = `
            <div class="mt-2.5 border border-cyan-900/40 rounded bg-cyan-950/20 p-2 shadow-inner">
                <div class="text-[11px] text-cyan-400 font-bold mb-1.5 flex items-center border-b border-cyan-900/50 pb-1"><i class="fa-solid fa-droplet mr-1.5"></i>魔力與特殊回復數值</div>
                <div class="text-[10px] text-cyan-300 space-y-1 ml-1">
                    ${item.id === 'wpn_mana_wand' || item.mpDrain ? `<div class="flex items-start"><i class="fa-solid fa-caret-right mt-[3px] mr-1 text-cyan-500"></i><span>命中恢復MP: 命中時恢復一定量 MP (隨強化等級動態變化)</span></div>` : ''}
                    ${item.id === 'wpn_crystal_wand' ? `<div class="flex items-start"><i class="fa-solid fa-caret-right mt-[3px] mr-1 text-cyan-500"></i><span>MP自然恢復升級: 超過安定值將帶來額外回魔量</span></div>` : ''}
                    ${item.extraMp ? `<div class="flex items-start"><i class="fa-solid fa-caret-right mt-[3px] mr-1 text-cyan-500"></i><span>額外魔法點數加成: ${item.extraMp > 0 ? '+' : ''}${item.extraMp}</span></div>` : ''}
                </div>
            </div>
        `;
    }

    // 6. 寵物專屬屬性 (橙色)
    let petStatsHtml = '';
    let hasPetStats = item.petDmg || item.petHit || item.petAc || item.petMr || item.petInt || item.petWis || item.summonDmg || item.summonHit || item.petDmgAll || item.petHitAll || item.petSkillDmgMult;
    if (hasPetStats) {
        petStatsHtml = `
            <div class="mt-2.5 border border-orange-900/40 rounded bg-orange-950/20 p-2 shadow-inner">
                <div class="text-[11px] text-orange-400 font-bold mb-1.5 flex items-center border-b border-orange-900/50 pb-1"><i class="fa-solid fa-paw mr-1.5"></i>寵物/召喚 專屬屬性加成</div>
                <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-orange-300">
                    ${item.petDmg ? `<div class="flex justify-between col-span-2"><span>寵物傷害:</span> <span class="text-orange-200">${item.petDmg > 0 ? '+' : ''}${item.petDmg} <span class="text-[9px] text-orange-400/80 ml-1">(每強化+1額外+1,上限+5)</span></span></div>` : ''}
                    ${item.petHit ? `<div class="flex justify-between col-span-2"><span>寵物命中:</span> <span class="text-orange-200">${item.petHit > 0 ? '+' : ''}${item.petHit} <span class="text-[9px] text-orange-400/80 ml-1">(每強化+1額外+1,上限+5)</span></span></div>` : ''}
                    ${item.petAc ? `<div class="flex justify-between col-span-2"><span>寵物防禦(AC):</span> <span class="text-orange-200">${item.petAc < 0 ? item.petAc : '-'+Math.abs(item.petAc)} <span class="text-[9px] text-orange-400/80 ml-1">(每強化防禦再-1,上限-5)</span></span></div>` : ''}
                    ${item.petMr ? `<div class="flex justify-between"><span>寵物魔防:</span> <span class="text-orange-200">${item.petMr > 0 ? '+' : ''}${item.petMr}</span></div>` : ''}
                    ${item.petInt ? `<div class="flex justify-between col-span-2"><span>寵物智力:</span> <span class="text-orange-200">${item.petInt > 0 ? '+' : ''}${item.petInt} <span class="text-[9px] text-orange-400/80 ml-1">(技能傷害+${item.petInt})</span></span></div>` : ''}
                    ${item.petWis ? `<div class="flex justify-between col-span-2"><span>寵物精神:</span> <span class="text-orange-200">${item.petWis > 0 ? '+' : ''}${item.petWis} <span class="text-[9px] text-orange-400/80 ml-1">(MP上限+${item.petWis * 5}·MP恢復+${item.petWis})</span></span></div>` : ''}
                    ${item.summonDmg ? `<div class="flex justify-between"><span>召喚物傷害:</span> <span class="text-orange-200">${item.summonDmg > 0 ? '+' : ''}${item.summonDmg}</span></div>` : ''}
                    ${item.summonHit ? `<div class="flex justify-between"><span>召喚物命中:</span> <span class="text-orange-200">${item.summonHit > 0 ? '+' : ''}${item.summonHit}</span></div>` : ''}
                    ${item.petDmgAll ? `<div class="flex justify-between"><span>全體寵物傷害:</span> <span class="text-orange-200">${item.petDmgAll > 0 ? '+' : ''}${item.petDmgAll}</span></div>` : ''}
                    ${item.petHitAll ? `<div class="flex justify-between"><span>全體寵物命中:</span> <span class="text-orange-200">${item.petHitAll > 0 ? '+' : ''}${item.petHitAll}</span></div>` : ''}
                    ${item.petSkillDmgMult ? `<div class="flex justify-between"><span>寵物技能傷害:</span> <span class="text-orange-200">x${item.petSkillDmgMult}</span></div>` : ''}
                </div>
            </div>
        `;
    }

    // 6.5 進階戰鬥數值 (綠色)
    let advStatsHtml = '';
    let advMap = {
        meleeCrit: '武器近距離爆擊率加成(%)', meleeCritDmg: '武器近距離爆擊傷害(%)',
        rangedCrit: '武器遠距離爆擊率(%)', rangedCritDmg: '武器遠程爆擊傷害(%)',
        magicCrit: '魔法爆擊率(%)', magicCritDmg: '魔法爆擊傷害(%)',
        mcrit: '近距離爆擊率(%)', rcrit: '遠距離爆擊率(%)',rcritdmg: '遠距離爆擊傷害(%)',
        mcritDmg: '近距離爆擊率傷害(%)', magicHit: '魔法命中',
        atkDoubleChance: '雙重攻擊機率(%)', painReflect: '反彈痛苦',
        magicDrNonEle: '無屬性魔法減免', stormInterval: '風暴間隔縮短',
        skillAddDmg: '技能額外傷害', skillDmgMult: '技能傷害倍率',
        comboRate: '雙擊機率(%)', vampPct: '吸血機率(%)',
        healPct: '治癒量(%)', heal: '治癒加成', healBase: '治癒基數', healDice: '治癒骰數',
        extraDmg: '泛用額外傷害', extraHit: '泛用額外命中',
        meleeDmg: '近距離額外傷害', meleeHit: '近距離命中', 
        rangedDmg: '遠距離額外傷害', rangedHit: '遠距離命中', mdmg: '魔法傷害',
        atkSpd: '攻擊速度(固定)',
        pierceChance: '穿透機率(%)',
        lifesteal: '吸血', vamp: '吸血', drain: '吸收生命/魔力', potionBonus: '藥水恢復量(%)',
        expBonus: '經驗值加成(%)', goldBonus: '金幣加成(%)',
        extraMpPerEn: '額外魔法點數(每階)', mpROverSafe: '突破安定值：每超過1階，MP自然恢復量',
        mpOnHitAmt: '命中回魔量', dmgMult: '總傷害倍率', multiDmg: '多段傷害次數',
        teamDmgReducePct: '隊伍減傷(%)',
        sleepResist: '抗睡眠(%)',
        poisonResist: '抗中毒(%)', paralyzeResist: '抗麻痺(%)',
        slowResist: '抗緩速(%)'

    };
    let hasAdvStats = Object.keys(advMap).some(k => item[k]);
    if (hasAdvStats) {
        let advItems = [];
        const getSkillName = id => (typeof DB !== 'undefined' && DB.skills && DB.skills[id] && DB.skills[id].n) || '技能';
        for(let k in advMap) {
            if(item[k]) {
                if (typeof item[k] === 'object' && !Array.isArray(item[k])) {
                    let descArr = [];
                    for (let skId in item[k]) {
                        descArr.push(`${getSkillName(skId)} x${item[k][skId]}`);
                    }
                    advItems.push(`<div class="flex justify-between col-span-2"><span>${advMap[k]}:</span> <span class="text-emerald-200 text-right leading-tight break-keep ml-2">${descArr.join(', ')}</span></div>`);
                } else {
                    let prefix = '+';
                    if (String(item[k]).startsWith('-')) prefix = '';
                    if (k.toLowerCase().includes('mult') && typeof item[k] === 'number') prefix = 'x';
                    advItems.push(`<div class="flex justify-between"><span>${advMap[k]}:</span> <span class="text-emerald-200">${prefix}${item[k]}</span></div>`);
                }
            }
        }
        advStatsHtml = `
            <div class="mt-2.5 border border-emerald-900/40 rounded bg-emerald-950/20 p-2 shadow-inner">
                <div class="text-[11px] text-emerald-400 font-bold mb-1.5 flex items-center border-b border-emerald-900/50 pb-1"><i class="fa-solid fa-gauge-high mr-1.5"></i>進階戰鬥數值</div>
                <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-emerald-300">
                    ${advItems.join('')}
                </div>
            </div>
        `;
    }

    // 7. 裝備特效標籤 (Effects) - 粉紅色
    let effectsHtml = '';
    let effArr = [];
    const eleName = e => ({ fire:'火', water:'水', wind:'風', earth:'地', none:'無' }[e] || e || '指定');
    const skillName = id => (typeof DB !== 'undefined' && DB.skills && DB.skills[id] && DB.skills[id].n) || '技能';
    const pctText = v => `${Math.round(v * 100)}%`;

    if (item.eff && typeof effNamesMap !== 'undefined' && effNamesMap[item.eff]) effArr.push(effNamesMap[item.eff]);
    let magicObj2 = item.spellProc || item.meleeHitSpell;
    if (magicObj2) {
        let spellName = magicObj2.skn || '魔法';
        effArr.push(`發動: ${spellName}`);
    }
    let procSkillId2 = item.procSkill || (item.procStatusSkill && item.procStatusSkill.skId);
    if (procSkillId2) {
        let skName = (typeof DB !== 'undefined' && DB.skills && DB.skills[procSkillId2]) ? DB.skills[procSkillId2].n : '技能';
        effArr.push(`發動: ${skName}`);
    }

    // 整合 relicPurposeLabels 的詳細描述
    if (item.frozenBonusDmg) effArr.push(`一般攻擊命中冰凍中的敵人時，追加 ${item.frozenBonusDmg} 點固定傷害`);
    if (item.waterFreezeProc) effArr.push(`施放原本不具冰凍效果的水屬性傷害魔法時，${item.waterFreezeProc.pct}% 機率附加冰凍 ${item.waterFreezeProc.dur} 秒`);
    if (item.relicRole) effArr.push(`用途定位（${item.relicRole}）`);
    if (item.reqAvatar) effArr.push(`裝備限制（僅限${item.reqAvatar}；其他角色無法裝備）`);
    if (item.petDmgReduce) effArr.push(`寵物護甲（裝備的寵物受到傷害-${Math.round(item.petDmgReduce * 100)}%）`);
    if (item.petBleed) effArr.push('寵物出血（一般攻擊命中疊加8秒出血；每層每秒造成該次傷害20%，最多5層）');
    if (item.armguard) {
        if (!item.noEnhance) {
            let ag = item.armguard;
            if (ag.stat === 'mhp') effArr.push(`臂甲（每強化+1 HP+10。特效隨強化解鎖：+5時 HP+${ag.th[0]} / +7時 HP+${ag.th[1]} / +9時 HP+${ag.th[2]}）`);
            else if (ag.stat && ag.stat !== 'none') {
                let _agLbl = ag.stat === 'dr' ? '額外減傷' : ag.stat === 'magicDmg' ? '魔法傷害' : ag.stat === 'rangedDmg' ? '遠距離傷害' : ag.stat === 'meleeDmg' ? '近距離傷害' : ag.stat;
                effArr.push(`臂甲（每強化+1 HP+10。特效隨強化解鎖：+5時 ${_agLbl}+${ag.th[0]} / +7時 ${_agLbl}+${ag.th[1]} / +9時 ${_agLbl}+${ag.th[2]}）`);
            } else effArr.push('臂甲（每強化+1 HP+10）');
        } else {
            effArr.push('臂甲（裝於副手，可與雙手武器並用）');
        }
    }
    if (item.mrPerWis) effArr.push(`精神屏障（每1點最終精神，MR+${item.mrPerWis}）`);
    if (item.type === 'wpn' && item.mr) effArr.push(`魔防(MR)+${item.mr}`);
    if (item.freeChill) effArr.push('施放寒冰氣息不消耗魔力');
    if (item.windHelm) effArr.push('施放加速術／強力加速術不消耗魔力（裝備或放在背包皆有效）');
    if (item.noConsume && item.isArrow) effArr.push('箭矢不會消耗');
    if (item.oneHand && item.isBow) effArr.push('可單手持握');
    
    if (item.qigu) effArr.push('奇古獸攻擊（一般攻擊必定命中並視為魔法傷害，受MR減免；奇古獸精通時無視MR）');
    if (item.qiguProc === 'phantom') effArr.push('幻影衝擊 1%＋每強化1%（造成基礎80～160的無屬性魔法傷害，不受MR減免）');
    if (item.qiguProc === 'mindbreak') effArr.push('心靈破壞 1%＋每強化1%（以自身最大MP 5%為基礎魔法傷害，不消耗MP；奇古獸精通時無視MR）');
    if (item.mpRPerEn) effArr.push(`MP自然恢復每強化+${item.mpRPerEn}`);
    if (item.mdmgEnFrom7Max3) effArr.push('魔法傷害成長（+7起魔法傷害+1，之後每強化+1，最高+3）');
    if (item.equipHaste) effArr.push('裝備加速（常駐加速，與加速術／自我加速藥水不重疊）');
    if (item.dragonStrike) effArr.push(`龍的一擊 ${item.dragonStrike}%（每次一般攻擊皆判定且不論命中；對全體造成1D力量+25固定物理傷害）`);
    if (item.procBurstPoison) {
        let p = item.procBurstPoison;
        effArr.push(`猛爆劇毒 ${p.rateBase == null ? 1 : p.rateBase}%＋每強化${p.ratePerEn == null ? 1 : p.ratePerEn}%（每秒100點真實傷害，持續5秒，最多1層）`);
    }
    if (item.hardWear) effArr.push(`碎甲（命中時額外削減${item.hardWear}點硬皮）`);
    if (item.strawCurse) effArr.push(`稻草詛咒 ${item.strawCurse.rate}%（命中時附加${item.strawCurse.stacks || 3}層；後續每次受攻擊消耗1層並追加80點水屬性固定魔法傷害）`);
    if (item.stunHitBonus) effArr.push(`衝擊之暈強化（暈眩命中率+${item.stunHitBonus}%）`);
    if (item.vanderStunHit) effArr.push('范德劍術（施放衝擊之暈時，本次近距離命中+1）');
    if (item.killHealHp) effArr.push(`擊殺敵人時吞噬其殘存的生氣，恢復 ${item.killHealHp}點 HP）`);
    if (item.firePrisonMult) effArr.push(`餘燼與咒火共鳴，使「火牢」造成的傷害加倍。`);
    if (item.immSilence) effArr.push(`罩不住頭顱卻護住了心神——免疫沉默。`);

    if (item.statusHealHp) effArr.push(`受到異常狀態侵襲時反而激發生機，恢復 ${item.statusHealHp}點 HP）`);

    if (item.mpReduce) effArr.push(`MP消耗減免 ${item.mpReduce}`);
    if (item.equipExtraAtk) effArr.push(`一般攻擊次數+${item.equipExtraAtk}`);
    if (item.reqJustice) effArr.push(`限正義性向施放（性向值 ≥ 1000）`);
    if (item.justiceHeal) effArr.push(`受施法者性向影響：正義值越高恢復量越高（滿正義 +20%・中立/邪惡無提升）`);

    if (item.abnormalResist) effArr.push(`異常狀態抵抗+${item.abnormalResist}%`);
    if (item.immStone) effArr.push('免疫石化');
    if (item.immPoison) effArr.push('免疫中毒');
    if (item.immParalyze) effArr.push('免疫麻痺');
    if (item.immBurn) effArr.push('免疫灼燒');
    if (item.immFreeze) effArr.push('免疫冰凍');
    if (item.immSleep) effArr.push('免疫睡眠');
    if (item.immSlow) effArr.push('免疫緩速');
    if (item.immHold) effArr.push('免疫木乃伊');
    if (item.immStun) effArr.push('免疫暈眩');

    if (item.atkSpdPct) effArr.push(`攻擊速度${item.atkSpdPct > 0 ? '+' : ''}${item.atkSpdPct}%`);
    if (item.hpRegenFaster) effArr.push(`快速再生（HP自然恢復間隔縮短${item.hpRegenFaster}秒）`);
    if (item.fireballBurst) effArr.push('爆裂火球（將已學會的「燃燒的火球」升級為威力更強的「爆裂的火球」）');
    if (item.noEvade) effArr.push('沉重代價（無法進行一般迴避；暗隱術的必定迴避不受影響）');
    if (item.summonCtrl) effArr.push('召喚控制（可指定召喚物；28～48級召喚上限由5隻提高至6隻）');
    if (item.autoReviveScroll) effArr.push('巨靈守護（傭兵或寵物死亡時立即消耗1張復活卷軸使其復活）');
    if (item.meleeHaste) effArr.push(`裝備近戰武器時攻速+${item.meleeHaste}%`);
    if (item.polyAtkSpdPct) effArr.push(`變身時攻速+${item.polyAtkSpdPct}%`);
    if (item.moveSpeedPct) effArr.push(`移動速度${item.moveSpeedPct > 0 ? '+' : ''}${item.moveSpeedPct}%`);
    if (item.hitstunReduce) effArr.push(`受擊硬直縮短${(item.hitstunReduce / 10).toFixed(1)}秒`);
    if (item.aggroHide) effArr.push('隱匿仇恨（較不容易成為敵人目標）');
    if (item.aggroWeight) effArr.push(`${item.aggroWeight > 0 ? '提高' : '降低'}仇恨（${item.aggroWeight > 0 ? '更' : '較不'}容易被攻擊）`);

    if (item.auraDmg) effArr.push(`傷害光環（每${((item.auraDmg.interval || 10) / 10).toFixed(1)}秒對全體敵人造成${item.auraDmg.dmg}點傷害）`);
    if (item.thorns) effArr.push(`受擊反傷（反彈${item.thorns}點傷害）`);
    if (item.dmgReflect) effArr.push(`傷害反射 ${item.dmgReflect}%（免疫該次一般攻擊並反射傷害）`);
    if (item.hurtExplode) effArr.push(`受擊爆裂（自己與全體敵人受到${item.hurtExplode}點火焰魔法傷害）`);
    if (item.hurtRapidfire) effArr.push('受擊反制（受到傷害時立即觸發一次連射；經典模式亦生效）');
    if (item.counterBarrierX2) effArr.push('反擊屏障強化（反擊傷害×2）');
    if (item.crushDr) effArr.push(`重擊防護（受到重擊傷害-${item.crushDr}%）`);
    if (item.physDrGated) effArr.push(`物理防護（一般攻擊傷害-${item.physDrGated}%，每3秒一次）`);
    if (item.fireNullify) effArr.push('火焰化解（每10秒可免疫一次火屬性傷害）');
    if (item.wearerEle) effArr.push(`${eleName(item.wearerEle)}之化身（自身轉為${eleName(item.wearerEle)}屬性，承受傷害套用屬性剋制）`);
    if (item.stealth) effArr.push('常駐隱身（不主動吸引一般怪物）');

    if (item.fullHpMult) effArr.push(`滿血狙擊（對滿血敵人一般攻擊傷害×${item.fullHpMult}）`);
    if (item.fullHpMultTriple) effArr.push(`滿血三重矢（首箭傷害×${item.fullHpMultTriple}）`);
    if (item.fullHpMpHalf) effArr.push('滿血施法（自身滿血時魔力消耗減半）');
    if (item.lowHpPotionX2) effArr.push('瀕危急救（低HP時藥水恢復量×2）');
    if (item.lowMpRegenBonus) effArr.push(`魔力枯竭回復（MP低於15%時，MP自然恢復+${item.lowMpRegenBonus}）`);
    if (item.hotHealMult) effArr.push(`持續治癒強化（持續回復量×${item.hotHealMult}）`);
    if (item.onDmgHeal) effArr.push(`受擊自癒（每${item.onDmgHealCd || 5}秒自動施放${skillName(item.onDmgHeal)}）`);
    if (item.poisonHealMult) effArr.push(`毒素轉生（受到毒性持續傷害時，改為恢復其${pctText(item.poisonHealMult)}的HP）`);
    if (item.poisonMult) effArr.push(`劇毒增幅（附加劇毒傷害×${item.poisonMult}）`);

    if (item.dotCrit) effArr.push('持續傷害爆擊（我方中毒、出血等持續傷害可爆擊）');
    if (item.eleWpnMult) effArr.push(`${eleName(item.eleWpnMult.ele)}武器強化（對應屬性一般攻擊傷害×${item.eleWpnMult.mult}）`);
    if (item.hardSkinMult) effArr.push(`破甲專攻（攻擊有硬皮的敵人傷害×${item.hardSkinMult}）`);
    if (item.softMult) effArr.push(`柔軟專攻（攻擊無硬皮的敵人傷害×${item.softMult}）`);
    
    if (item.heavyRatePct) effArr.push(`重擊率額外+${item.heavyRatePct}%`);
    if (item.heavyMult) effArr.push(`重擊威力（重擊傷害×${item.heavyMult}）`);
    if (item.missGrazeRate) effArr.push(`擦傷補正（未命中時${item.missGrazeRate}%改判為擦傷，造成50%傷害且不會爆擊）`);
    if (item.hitEchoMagic) effArr.push(`元素爆破 ${item.hitEchoMagic.rate}%（命中後追加等同本次一般攻擊傷害的${eleName(item.hitEchoMagic.ele)}屬性魔法傷害）`);
    if (item.onHitWet) effArr.push('潮濕（命中後持續10秒；下一次風屬性傷害×2並解除）');
    if (item.onHitCastSkill) effArr.push(`命中施法（每${item.onHitCastSkill.cdSec || 5}秒觸發${skillName(item.onHitCastSkill.skId)}）`);
    if (item.onHitEleVuln) effArr.push(`元素弱點（命中使目標受到的${eleName(item.onHitEleVuln)}屬性傷害提高）`);
    if (item.windSpellProcRate) effArr.push(`風魔法共振 ${item.windSpellProcRate}%（主動施放風屬性傷害魔法時追加龍捲風）`);
    if (item.hasteStrike) effArr.push('加速突擊（加速時命中與傷害+30；命中後失去加速）');
    if (item.selfBreakProc) effArr.push(`易碎爆發（3%造成1.5倍傷害，但自身傷害降低${item.selfBreakProc.dur || 5}秒）`);
    if (item.stoneInstakill) effArr.push('石化斬殺（命中石化中的非首領敵人時即死）');
    if (item.instakillFull) effArr.push(`滿血斬殺 ${pctText(item.instakillFull)}（命中滿血非首領敵人時即死）`);
    
    if (item.procFireSkillRate) effArr.push(`火焰法術 ${item.procFireSkillRate}%（攻擊時隨機施放火屬性傷害魔法）`);
    if (item.procHealFlat) effArr.push(`命中治癒 ${item.procHealFlat.rate}%（恢復${item.procHealFlat.hp}點HP）`);
    if (item.rapidMax) effArr.push('最大連射（連射發動時，固定射出目前可用的最大額外箭數）');
    if (item.bonespike) effArr.push('骨刺爆裂（連射額外箭命中累積骨刺，最多10層；下一次一般攻擊命中引爆，每層20點固定傷害）');
    if (item.critDmgLowHp) effArr.push(`背水爆擊（HP低於${item.critDmgLowHp.hp}時，近距離爆擊傷害+${item.critDmgLowHp.add}%）`);
    if (item.castOnHurt) effArr.push(`護身反擊 ${item.castOnHurt.rate}%（玩家受到物理或魔法傷害時，免費施放目前設定的自動攻擊傷害法術）`);

    if (item.lvDmgDiv || item.lvHitDiv) effArr.push(`等級成長（每${item.lvDmgDiv || item.lvHitDiv}級，傷害與命中提高）`);
    if (item.highestAttrPlus) effArr.push('主屬性強化（目前最高的六維屬性+1；並列皆增加）');
    if (item.swordStr) effArr.push(`握劍強化（主手裝備單手劍或雙手劍時，力量+${item.swordStr}）`);
    if (item.raceBonus) effArr.push(`${item.raceBonus.race}剋星（對${item.raceBonus.race}傷害×${item.raceBonus.mult}）`);
    if (item.raceFlat) effArr.push(`${item.raceFlat.race}剋星（對${item.raceFlat.race}額外傷害+${item.raceFlat.add}）`);
    if (item.giantBonus) effArr.push('巨人剋星（攻擊巨人額外造成1D20傷害）');
    if (item.weakHitBonus) effArr.push(`弱點洞察（屬性剋制時額外傷害+${item.weakHitBonus}）`);

    if (item.partnerHit) {
        let names = Object.keys(item.partnerHit).map(n => `${n}命中+${item.partnerHit[n]}`);
        if (names.length) effArr.push(`夥伴強化（${names.join('、')}）`);
    }
    if (item.trackBoost) effArr.push('追蹤強化（指定怪物出現率由50%提高至70%）');
    if (item.showMobEle) effArr.push('元素洞察（顯示敵人的屬性）');
    if (item.relicDropX2) effArr.push('遺物尋寶（遺物掉落判定次數×2）');

    // 其餘原本的特效標籤
    if (item.procPoison) effArr.push("毒素發動");
    if (item.ignHardSkin) effArr.push("貫穿硬皮");
    if (item.unBonus) effArr.push("不死系加成");
    if (item.stunResist) effArr.push(`抗暈+${item.stunResist}`);
    if (item.freezeResist) effArr.push(`抗冰+${item.freezeResist}`);

    if (item.rapidfire) effArr.push(`連射`);
    if (item.noConsume) effArr.push(`不會消耗`);
    // if (item.relic) effArr.push(`遺物`);
    if (item.procInstakill || item.instakill) effArr.push(`機率即死`);
    if (item.procBonusDmg) effArr.push(`機率額外傷害`);
    if (item.procDmgReduce) effArr.push(`機率減傷`);
    if (item.procBurn) effArr.push(`附加灼燒`);
    if (item.procPoisonRate) effArr.push(`附加中毒(機率)`);
    if (item.onHitEleDmg) effArr.push(`附加屬性傷害`);
    if (item.weakExpose) effArr.push(`弱點曝光`);
    if (item.redSpecter) effArr.push(`紅惡靈逆襲`);
    if (item.blueSpecter) effArr.push(`藍惡靈奪魔`);
    if (item.shatter) effArr.push(`粉碎`);
    if (item.allLures) effArr.push(`持有全部誘捕狀態`);
    if (item.darkPoison) effArr.push(`一般攻擊命中 50% 機率使目標中毒：每秒該次攻擊 60% 傷害、持續 5 秒、最多 1 層（取較高傷害並刷新；劇毒精通→100%、每秒 200%）`);
    if (item.noBleed) effArr.push(`不觸發出血`);
    if (item.mpOnHit) effArr.push(`命中恢復MP`);
    if (item.ele) effArr.push(`武器屬性: ${{fire:'火',water:'水',earth:'地',wind:'風'}[item.ele] || item.ele}`);
    if (item.grantSkills) effArr.push(`賦予特殊技能`);
    if (item.loadFreeRegen) effArr.push(`負重不影響HP恢復`);

    if (effArr.length > 0) {
        effectsHtml = `
            <div class="mt-2.5 border border-pink-900/40 rounded bg-pink-950/20 p-2 shadow-inner">
                <div class="text-[11px] text-pink-400 font-bold mb-1.5 flex items-center border-b border-pink-900/50 pb-1"><i class="fa-solid fa-sparkles mr-1.5"></i>裝備特效標籤</div>
                <div class="text-[11px] text-pink-300 leading-relaxed font-medium space-y-1">
                    ${effArr.map(e => `<div class="flex items-start"><span class="text-pink-500 mr-1 mt-[2px] text-[9px]"><i class="fa-solid fa-caret-right"></i></span><span>${e}</span></div>`).join('')}
                </div>
            </div>
        `;
    }

    // 7. 通用系統與限制資訊
    let safeText;
    if (item.noEnhance) {
        safeText = '<span class="text-red-400 font-bold bg-red-900/30 px-1.5 py-0.5 rounded border border-red-800/50">無法強化</span>';
    } else {
        safeText = `<span class="text-gray-200">${item.safe !== undefined ? item.safe : 0}</span>`;
    }
    
    let systemHtml = `
        <div class="mt-auto border-t border-gray-800 pt-2.5">
            <div class="bg-gray-900/40 p-2 rounded border border-gray-800/50">
                <div class="text-[10px] text-gray-500 mb-1 font-medium"><i class="fa-solid fa-users-gear mr-1"></i>適用職業:</div>
                <div class="mb-2">
                    ${generateClassIcons(item.req).replace('mt-2', 'mt-1')}
                </div>
                <div class="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/50 pt-2">
                    <div class="flex items-center"><i class="fa-solid fa-shield mr-1.5 text-gray-500"></i>安定值: &nbsp;${safeText}</div>
                    ${ITEM_WEIGHTS[item.n] !== undefined ? `<div class="flex items-center"><i class="fa-solid fa-weight-hanging mr-1.5 text-gray-500"></i>重量: <span class="text-gray-200 ml-1">${ITEM_WEIGHTS[item.n]}</span></div>` : '<div></div>'}
                </div>
            </div>
            ${item.p ? `
            <div class="flex items-center justify-center text-[10px] text-yellow-600 font-mono mt-2 bg-yellow-900/10 p-1 rounded border border-yellow-900/30">
                <i class="fa-solid fa-coins mr-1.5 text-yellow-500"></i>販賣價格: <span class="ml-1 text-yellow-500 font-bold text-[11px]">${item.p.toLocaleString()}</span>
            </div>` : ''}
        </div>
    `;

    return `
        <div class="glass-panel p-4 rounded-xl border ${borderClass} hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col h-full bg-gray-950/80">
            <!-- 1. 標題區 -->
            <div class="flex items-start gap-3 mb-2">
                <div class="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src="${getItemIconPath(item)}" alt="${item.n}" class="w-8 h-8 object-contain cursor-pointer drop-shadow-md" data-hover-image
                        onerror="this.parentElement.style.display='none'">
                </div>
                <div class="flex-1 pt-0.5">
                    <h4 class="text-[15px] ${titleClass} flex items-center gap-1.5 leading-tight tracking-wide">
                        ${item.n}
                    </h4>
                    <div class="flex flex-wrap gap-1 mt-1.5">
                        ${isLegend ? '<span class="text-[9px] bg-gold-900/60 text-gold-300 px-1.5 py-0.5 rounded border border-gold-700/60 font-medium tracking-widest"><i class="fa-solid fa-crown mr-1"></i>傳說</span>' : ''}
                        ${item.type === 'wpn' ? '<span class="text-[9px] bg-red-900/50 text-red-300 px-1.5 py-0.5 rounded border border-red-700/50"><i class="fa-solid fa-khanda mr-1"></i>武器</span>' : ''}
                        ${item.type === 'arm' ? '<span class="text-[9px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50"><i class="fa-solid fa-shield-halved mr-1"></i>防具</span>' : ''}
                        ${item.type === 'acc' ? '<span class="text-[9px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded border border-purple-700/50"><i class="fa-solid fa-ring mr-1"></i>飾品</span>' : ''}
                        ${(item.type === 'etc' || item.type === 'misc' || item.type === 'pot' || item.type === 'mat') ? '<span class="text-[9px] bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded border border-green-700/50"><i class="fa-solid fa-box mr-1"></i>消耗品/材料</span>' : ''}
                    </div>
                </div>
            </div>
            
            ${setEffectHtml}
            ${desc}
            
            <div class="flex-1 flex flex-col mb-3">
                ${wpnStatsHtml}
                ${defStatsHtml}
                ${baseStatsHtml}
                ${mpSpecialHtml}
                ${petStatsHtml}
                ${advStatsHtml}
                ${effectsHtml}
            </div>
            
            ${getItemDropsHtml(item.id)}
            <div class="mt-3">
                ${systemHtml}
            </div>
            <div class="mt-2 text-center text-[10px] text-gray-700 font-mono border-t border-gray-800/30 pt-1.5">
                ID: ${item.id}
            </div>
        </div>
    `;
}

/**
 * 分頁狀態（無限捲動）
 */
const ITEMS_PER_PAGE = 24;
let itemsCurrentPage = 0;
let itemsFilteredCache = [];
let itemsIsLoading = false;
let itemsScrollObserver = null;

function setupItemsInfiniteScroll() {
    if (itemsScrollObserver) { itemsScrollObserver.disconnect(); itemsScrollObserver = null; }
    const sentinel = document.getElementById('items-scroll-sentinel');
    if (!sentinel) return;
    const scrollContainer = document.getElementById('content-container');
    itemsScrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !itemsIsLoading) appendNextPageItems();
    }, { root: scrollContainer, threshold: 0.1 });
    itemsScrollObserver.observe(sentinel);
}

function appendNextPageItems() {
    if (itemsIsLoading) return;
    const batch = itemsFilteredCache.slice(
        itemsCurrentPage * ITEMS_PER_PAGE,
        (itemsCurrentPage + 1) * ITEMS_PER_PAGE
    );
    if (batch.length === 0) {
        const s = document.getElementById('items-scroll-sentinel');
        if (s) s.remove();
        if (itemsScrollObserver) { itemsScrollObserver.disconnect(); itemsScrollObserver = null; }
        return;
    }
    itemsIsLoading = true;
    itemsCurrentPage++;
    const frag = document.createDocumentFragment();
    batch.forEach(item => {
        const w = document.createElement('div');
        w.innerHTML = createItemCard(item);
        frag.appendChild(w.firstElementChild);
    });
    const sentinel = document.getElementById('items-scroll-sentinel');
    if (sentinel) itemsGrid.insertBefore(frag, sentinel);
    else itemsGrid.appendChild(frag);
    const countEl = document.getElementById('items-count-display');
    if (countEl) {
        const shown = Math.min(itemsCurrentPage * ITEMS_PER_PAGE, itemsFilteredCache.length);
        countEl.textContent = '顯示 ' + shown + ' / ' + itemsFilteredCache.length + ' 件';
    }
    itemsIsLoading = false;
}

/**
 * 重新渲染卡片網格（分頁 + 無限捲動版，避免一次性渲染大量 DOM）
 */
function matchItemSubType(item, type, subType) {
    if (subType === 'all') return true;
    if (type === 'wpn') {
        if (subType === '1h') return !item.w2h && !item.isBow && !item.isArrow && !/箭$/.test(item.n || '');
        else if (subType === '2h') return !!item.w2h && !item.isBow && !item.isArrow && !/箭$/.test(item.n || '');
        else if (subType === 'ranged') return !!item.isBow || !!item.isArrow || !!item.ranged || /箭$/.test(item.n || '');
        else if (subType === 'arrow') return !!item.isArrow || /箭$/.test(item.n || '');
        else {
            let n = item.n || '';
            let isKiringku = !!item.qigu;
            let isChainsword = !!item.chainsword;
            let isClaw = n.includes('鋼爪');
            let isDual = n.includes('雙刀');
            let isCrossbow = item.isBow && /十字弓|弩/.test(n);
            let isBow = item.isBow && !isCrossbow;
            let isWand = item.isWand || /魔杖|法杖|水晶球/.test(n) || (/杖/.test(n) && !/權杖/.test(n));
            let isSpear = /矛|槍|戟/.test(n);
            let isBlunt = /斧|鎚|錘|槌|棒|棍|鐮/.test(n);
            let isDagger = /匕首|小刀|之刺|尾刺|毒牙|犬齒|指甲|千刃牙|鱗片|刺針|刺劍/.test(n);
            
            if (subType === 'kiringku') return isKiringku;
            else if (subType === 'chainsword') return isChainsword;
            else if (subType === 'claw') return isClaw;
            else if (subType === 'dual') return isDual;
            else if (subType === 'crossbow') return isCrossbow;
            else if (subType === 'bow') return isBow;
            else if (subType === 'wand') return isWand;
            else if (subType === 'spear') return isSpear && !isWand; // 避免某些衝突
            else if (subType === 'blunt') return isBlunt && !isWand;
            else if (subType === 'dagger') return isDagger && !isWand;
            else if (subType === 'sword') return !isKiringku && !isChainsword && !isClaw && !isDual && !item.isBow && !item.isArrow && !isWand && !isSpear && !isBlunt && !isDagger;
        }
    } else if (type === 'arm' || type === 'acc') {
        if (subType === 'pet') {
            return item.slot === 'petwpn' || item.slot === 'petarm' || item.slot === 'pet';
        } else {
            return item.slot === subType;
        }
    } else if (type === 'pet') {
        if (subType === 'petwpn') return item.slot === 'petwpn';
        if (subType === 'petarm') return item.slot === 'petarm';
        return item.slot === 'petwpn' || item.slot === 'petarm' || item.slot === 'pet';
    } else if (type === 'etc') {
        const isMat = item.id.startsWith('mat_') || (item.d && item.d.includes('製作材料'));
        if (subType === 'mat') return isMat;
        else if (subType === 'other') return !isMat;
    }
    return false;
}

const RELIC_WEAPON_TAGS = {
    relic_goblin_blade:['單手劍'], relic_gremlin_club:['單手鈍器'], relic_husky_bone:['單手鈍器'], relic_doberman_fang:['匕首'],
    relic_gladiator_scimitar:['單手劍'], relic_icefield_pick:['單手鈍器'], relic_werewolf_mace:['單手鈍器'], relic_orc_nail:['匕首'], relic_pan_staff:['矛'], relic_elastic_rib:['雙刀'],
    relic_golem_fist:['雙手鈍器'], relic_orc_cleaver:['單手劍'], relic_strong_femur:['單手鈍器'], relic_forgotten_spear:['矛'], relic_spider_claw:['鋼爪'], relic_hobgoblin_grinder:['單手劍'], relic_orc_butcher:['單手劍'], relic_orc_pole:['矛'], relic_sparta_grudge:['雙刀'], relic_shark_teeth:['匕首'],
    relic_guard_spear:['矛'], relic_crab_claw:['鋼爪'], relic_venom_fang:['雙手劍'], relic_ratman_skewer:['矛'], relic_lizardman_cleaver:['矛'],
    relic_ohm_maul:['雙手鈍器'], relic_parrot_beak:['雙手劍'], relic_pirate_scimitar:['單手劍'], relic_scorpion_sting:['匕首'], relic_harvey_claw:['單手劍'], relic_guard_pike:['矛'], relic_ogi_greataxe:['雙手鈍器'],
    relic_darkthief_claw:['鋼爪'], relic_fighter_axe:['雙手鈍器'],
    relic_darkelf_grindblade:['單手劍','武士刀'],
    relic_wisp_remnant:['單手劍','武士刀'], relic_summoner_whip:['單手鈍器'], relic_griffin_claw:['鋼爪'], relic_croc_fang:['雙手劍'], relic_icestone_maul:['雙手鈍器'],
    relic_mutant_lamia_scale:['匕首'], relic_thorn_needle:['匕首'], relic_giant_toothpick:['雙手劍'], relic_veteran_greatsword:['雙手劍'], relic_giant_throwstone:['雙手鈍器'], relic_armor_spareblade:['雙刀'],
    relic_aruba_haste:['單手鈍器'], relic_ashwarrior_flamesword:['單手劍'], relic_deadgeneral_greatsword:['雙手劍'], relic_darkscorpion_pincers:['雙刀'],
    relic_medusa_stinger:['單手鈍器'], relic_silent_venom:['矛'],
    relic_axetaurus_brutalaxe:['雙手鈍器'],
    relic_lizard_tongue:['矛'], relic_killerbee_sting:['匕首'], relic_ancient_spider_claw:['單手劍','武士刀'], relic_guardian_greatsword:['雙手劍'],
    relic_eto_whip:['矛'], relic_serpent_fang:['矛'], relic_kaira_fang:['匕首'], relic_mud_idol:['雙手鈍器'], relic_teo_hammer:['單手鈍器'],
    relic_executor_axe:['單手鈍器'], relic_healer_wand:['單手鈍器'], relic_minotaur_flail:['單手鈍器'],
    relic_executor_skewer:['矛'], relic_weathered_obelisk:['雙手鈍器'], relic_shadow_stinger:['匕首'], relic_soulreaper_dual:['雙刀'],
    relic_ghoul_fang:['單手劍'], relic_sparto_shard:['單手劍'], relic_pirate_dual:['雙刀'], relic_lava_fists:['單手鈍器'],
    relic_fireking_blast:['雙手劍'], relic_waterking_caress:['鋼爪'],
    relic_cerberus_pin:['鋼爪'], relic_dark_metal_club:['單手鈍器'], relic_ash_fist:['單手鈍器'], relic_ant_pincer:['單手劍','武士刀'], relic_reaper_scythe:['雙手劍'],
    relic_mage_dagger:['匕首'],
    relic_bk_lance:['矛']
};

function getRelicCatKey(item) {
    if (!item) return null;
    let d = item;
    let id = item.id;
    if (d.type === 'wpn') {
        if (d.isArrow) return d.relic ? 'quiver' : null;
        if (d.isBow) return /十字弓|弩/.test(d.n || '') ? 'xbow' : 'bow';
        if (d.qigu) return 'qigu';
        if (d.chainsword) return 'chainsword';
        
        const isWandWeapon = !!(d && d.type === 'wpn' && (d.isWand || /魔杖|法杖/.test(d.n || '') || (/杖/.test(d.n || '') && !/權杖/.test(d.n || ''))));
        const WAND_LIGHTARROW_IDS = ['relic_amp_staff', 'relic_elder_thunder', 'relic_cerberus_wand', 'relic_evillizard_eye', 'relic_lightbeam_wand', 'relic_warlock_grimoire'];
        if (isWandWeapon || WAND_LIGHTARROW_IDS.includes(id)) return 'wand';
        
        let tags = RELIC_WEAPON_TAGS[id] || [];
        if (tags.includes('武士刀')) return 'katana';
        if (tags.includes('雙刀')) return 'dual';
        if (tags.includes('鋼爪')) return 'claw';
        if (tags.includes('匕首')) return 'dagger';
        if (tags.includes('雙手劍')) return 'sword2';
        if (tags.includes('單手劍')) return 'sword1';
        if (tags.includes('雙手鈍器')) return 'blunt2';
        if (tags.includes('單手鈍器')) return 'blunt1';
        if (tags.includes('矛')) return 'spear';

        if (/水晶球/.test(d.n || '')) return 'wand';
        if (d.eff === 'pierce') return 'spear';
        if (d.eff === 'cleave') return 'sword2';
        if (d.eff === 'crush') return d.w2h ? 'blunt2' : 'blunt1';
        return 'wpn_other';
    }
    if (d.type === 'arm') {
        if (d.armguard) return 'armguard';
        if (d.slot === 'helm') return 'helm';
        if (d.slot === 'armor') return 'armor';
        if (d.slot === 'shin') return 'shin';
        if (d.slot === 'tshirt') return 'tshirt';
        if (d.slot === 'cloak') return 'cloak';
        if (d.slot === 'boots') return 'boots';
        if (d.slot === 'gloves') return 'gloves';
        if (d.slot === 'shield') return 'shield';
        if (d.slot === 'petarm') return 'pet';
        return null;
    }
    if (d.type === 'acc') {
        if (d.slot === 'amulet') return 'amulet';
        if (d.slot === 'ring') return 'ring';
        if (d.slot === 'belt') return 'belt';
        if (d.slot === 'ear1' || d.slot === 'ear2' || d.slot === 'ear') return 'ear';
        if (d.slot === 'pet' || d.slot === 'petwpn') return 'pet';
        if (d.slot === 'doll') return 'doll';
        return null;
    }
    return null;
}

function renderItems() {
    if (!itemsGrid) return;
    
    // 確保 wikiData.items 已載入（修正首次切換時可能因載入時序問題導致為空的狀況）
    if (wikiData.items.length === 0 && typeof DB !== 'undefined' && DB.items) {
        wikiData.items = convertObjToArray(DB.items);
    }
    
    if (currentFilterType === 'set') { renderSets(); return; }

    itemsFilteredCache = wikiData.items.filter(item => {
        let matchType = false;
        if (currentFilterType === 'all') {
            matchType = true;
        } else if (currentFilterType === 'relic') {
            matchType = !!item.relic;
            if (matchType && currentFilterSubType !== 'all') {
                matchType = (currentFilterSubType === getRelicCatKey(item));
            }
        } else {
            const isTargetType = item.type === currentFilterType
                || (currentFilterType === 'etc' && item.type === 'misc')
                || (currentFilterType === 'acc' && (item.slot === 'petwpn' || item.slot === 'petarm' || item.slot === 'pet'));
            if (isTargetType && !item.relic) {
                matchType = true;
                if (currentFilterSubType !== 'all') {
                    matchType = matchItemSubType(item, currentFilterType, currentFilterSubType);
                }
            }
        }
        const keyword = currentSearchQuery.toLowerCase();
        const matchSearch = keyword === ''
            || (item.n && item.n.toLowerCase().includes(keyword))
            || (item.d && item.d.toLowerCase().includes(keyword))
            || (item.id.toLowerCase().includes(keyword));
        // 屬性篩選 (AND / OR 邏輯)
        let matchProperty = true;
        if (currentPropertyFilters.length > 0) {
            const checkOneProp = (prop) => {
                if (prop === 'hasSpellProc') return !!(item.spellProc || item.procSkill || item.meleeHitSpell || item.eff === 'magicstrike' || item.eff === 'magicburst' || item.procSkill2);
                if (prop === 'hasPierce') return !!(item.eff === 'pierce' || item.alsoPierce);
                if (prop === 'hasVamp') return !!(item.vampPct || item.eff === 'mp_drain');
                if (prop === 'hasCrushCleave') return !!(item.eff === 'crush' || item.eff === 'cleave');
                if (prop === 'combo') return item.eff === 'combo';
                if (prop === 'petAc') return !!(item.petAc && item.petAc !== 0);
                if (prop === 'skillDmgMult') return !!(item.skillDmgMult && Object.keys(item.skillDmgMult).length > 0);
                if (['unBonus','ignHardSkin','weakExpose','immFreeze','immPoison','immParalyze','immStone','immSlow','immHold','summonCtrl','petBleed'].includes(prop)) return !!item[prop];
                return !!(item[prop] && item[prop] > 0);
            };
            if (propertyFilterMode === 'OR') {
                matchProperty = currentPropertyFilters.some(p => checkOneProp(p));
            } else {
                matchProperty = currentPropertyFilters.every(p => checkOneProp(p));
            }
        }
        // 職業篩選 (複選 OR 邏輯)
        let matchClass = true;
        if (currentClassFilters.length > 0) {
            if (!item.req) {
                matchClass = false;
            } else if (item.req === 'all') {
                matchClass = true;
            } else {
                const reqArr = item.req.split(',').map(s => s.trim());
                matchClass = currentClassFilters.some(c => reqArr.includes(c));
            }
        }
        // 遗物篩選
        const matchRelic = !filterRelicOnly || !!item.relic;
        return matchType && matchSearch && matchProperty && matchClass && matchRelic;
    });

    if (itemsFilteredCache.length === 0) {
        itemsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');
    itemsCurrentPage = 0;
    itemsIsLoading = false;
    const total = itemsFilteredCache.length;
    itemsGrid.innerHTML =
        '<div id="items-count-display" class="col-span-full text-xs text-gray-500 mb-1 px-1">顯示 0 / ' + total + ' 件</div>'
        + '<div id="items-scroll-sentinel" class="col-span-full h-4"></div>';
    appendNextPageItems();
    if (total > ITEMS_PER_PAGE) {
        setupItemsInfiniteScroll();
    } else {
        const s = document.getElementById('items-scroll-sentinel');
        if (s) s.remove();
    }
}

/**
 * 渲染套裝列表
 */
async function renderSets() {
    if (!itemsGrid) return;
    
    // 動態解析主程式，提取真實套裝效果，避免手動更新
    if (!window.realSetEffectMap) {
        window.realSetEffectMap = {};
        window.setTranslationMap = {};
        try {
            const res = await fetch('./idle-lineage-class/js/02-stats-recompute.js');
            const text = await res.text();
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.includes('setCheck[') && line.includes('//')) {
                    const setMatch = line.match(/setCheck\['([^']+)'\]/);
                    if (!setMatch) continue;
                    const setKey = setMatch[1];
                    
                    const commentPart = line.substring(line.indexOf('//') + 2).trim();
                    const nameMatch = commentPart.match(/([^：:\s(]+)套裝/);
                    const effectMatch = commentPart.match(/：\s*(.+)$/);
                    
                    if (nameMatch) {
                        const parts = nameMatch[1].split(' ');
                        const finalName = parts.pop().trim();
                        if (finalName) window.setTranslationMap[setKey] = finalName;
                    }
                    if (effectMatch) {
                        let eff = effectMatch[1].trim();
                        // 移除程式實作相關的註解
                        eff = eff.replace(/（[^）]+(?:已於|提前|管線|皆加)[^）]+）/g, '').trim();
                        window.realSetEffectMap[setKey] = eff;
                    }
                }
            }
        } catch (e) {
            console.error('Failed to fetch dynamic set data (likely running locally on file:// protocol). Using hardcoded fallback.', e);
            
            window.setTranslationMap = {
                'bluepirate': '藍海賊',
                'emperor': '真．冥皇',
                'frost': '寒冰',
                'icequeen_charm': '冰之女王魅力',
                'orin': '歐林與西瑪'
            };
            
            window.realSetEffectMap = {
                'leather': 'AC-3',
                'bone': 'AC-2、HP+10',
                'dk': 'AC-4、變身真‧死亡騎士',
                'silver': 'AC-3',
                'oasis': 'AC-3',
                'gnome': 'AC-1、HP+5',
                'mage': 'MP+50、MP自然恢復+1',
                'kurt': 'AC-4、變身真‧克特',
                'steel': 'AC-2、傷害減免+2',
                'mr': 'MR+5',
                'guard': 'AC-1',
                'kinglord': 'HP/MP+30、HP/MP自然恢復+10、魅力+3',
                'demon': 'AC-2、HP自然恢復+5、變身惡魔',
                'darkelf': 'AC-3、HP自然恢復-2、MP自然恢復-7、變身高等黑暗精靈 (遠距傷害/命中+5、攻速+30%)',
                'orin': 'AC-5、HP+50',
                'icequeen_charm': 'AC-5、HP+100、MP自然恢復+4、水屬抗性+20',
                'frost': 'AC-5、HP+100、HP自然恢復+8、MP自然恢復+4、MR+15、水屬抗性+20',
                'bluepirate': 'AC-1、HP+10',
                'emperor': '防禦-20、HP+100、MP+20、HP自然恢復+10、攻速額外+30%、近/遠額外傷害+5'
            };
        }
    }
    
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
    
    const realSetEffectMap = {
        'leather': 'AC-3',
        'bone': 'AC-2、HP+10',
        'dk': 'AC-4、變身真‧死亡騎士',
        'silver': 'AC-3',
        'oasis': 'AC-3',
        'gnome': 'AC-1、HP+5',
        'mage': 'MP+50、MP自然恢復+1',
        'kurt': 'AC-4、變身真‧克特',
        'steel': 'AC-2、傷害減免+2',
        'mr': 'MR+5',
        'guard': 'AC-1',
        'kinglord': 'HP/MP+30、HP/MP自然恢復+10、魅力+3',
        'demon': 'AC-2、HP自然恢復+5、變身惡魔',
        'darkelf': 'AC-3、HP自然恢復-2、MP自然恢復-7、變身高等黑暗精靈 (遠距傷害/命中+5、攻速+30%)',
        'orin': 'AC-5、HP+50',
        'icequeen_charm': 'AC-5、HP+100、MP自然恢復+4、水屬抗性+20',
        'frost': 'AC-5、HP+100、HP自然恢復+8、MP自然恢復+4、MR+15、水屬抗性+20',
        'bluepirate': 'AC-1、HP+10',
        'emperor': '防禦-20、HP+100、MP+20、HP自然恢復+10、攻速額外+30%、近/遠額外傷害+5'
    };

    for (const key in newSetsMap) {
        const setObj = newSetsMap[key];
        
        // 尋找是否在舊版 DB.sets 已經有定義此套裝 (透過比對包含的道具)
        const existingSet = allSets.find(s => s.items.some(i => setObj.items.some(si => si.id === i.id)));
        
        if (existingSet) {
            // 若已存在，則將新找到的同套裝道具合併進去，並略過新增此 setObj
            setObj.items.forEach(newItem => {
                if (!existingSet.items.find(i => i.id === newItem.id)) {
                    existingSet.items.push(newItem);
                }
            });
            continue;
        }

        if (!setObj.name) {
            const translated = window.setTranslationMap[key];
            setObj.name = (translated || key) + ' 套裝';
        }
        
        // 套用真實的套裝效果（優先使用我們動態提取的字典）
        if (window.realSetEffectMap[key]) {
            setObj.effectDesc = window.realSetEffectMap[key];
        } else if (!setObj.effectDesc || setObj.effectDesc === '請見個別裝備說明') {
            setObj.effectDesc = '請見個別裝備說明';
        }
        
        // 避免重複加入
        if (!allSets.find(s => s.name === setObj.name)) {
            allSets.push(setObj);
        }
    }
    
    // 另外替所有已加入的 DB.sets 補上真實效果（如果字典裡有對應的）
    // DB.sets 的 key 是 set_0 ~ set_13，這裡手動對應一下：
    const SET_CODE_MAP = {
        'set_0': 'leather', 'set_1': 'oasis', 'set_2': 'gnome', 'set_3': 'silver',
        'set_4': 'bone', 'set_5': 'steel', 'set_6': 'mage', 'set_7': 'dk',
        'set_8': 'kurt', 'set_9': 'mr', 'set_10': 'guard', 'set_11': 'kinglord',
        'set_12': 'demon', 'set_13': 'darkelf'
    };
    allSets.forEach(s => {
        if (s.id && SET_CODE_MAP[s.id]) {
            const code = SET_CODE_MAP[s.id];
            if (window.realSetEffectMap[code]) {
                s.effectDesc = window.realSetEffectMap[code];
            }
        }
    });
    
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
                    <img src="${getItemIconPath(item)}" alt="${item.n}" class="w-full h-full object-contain cursor-pointer" data-hover-image onerror="this.style.display='none'">
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
const subSubFiltersContainer = document.getElementById('item-sub-sub-filters');

function renderSubFilters() {
    if (!subFiltersContainer) return;
    
    const options = subFilterOptions[currentFilterType];
    
    // 只有當前分類有子分類，且不是 'all' 時才顯示
    if (!options || currentFilterType === 'all') {
        subFiltersContainer.classList.add('hidden');
        subFiltersContainer.innerHTML = '';
        currentFilterSubType = 'all';
        if (subSubFiltersContainer) {
            subSubFiltersContainer.classList.add('hidden');
            subSubFiltersContainer.innerHTML = '';
            currentFilterSubSubType = 'all';
        }
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
            currentFilterSubSubType = 'all'; // 切換子分類時重設次級子分類
            renderSubFilters(); // 重新渲染以更新 active 樣式
            renderItems();
        });
    });

    // 處理次級子分類 (只在 relic 下的 wpn, arm, acc 有)
    if (subSubFiltersContainer) {
        if (currentFilterType === 'relic' && currentFilterSubType !== 'all') {
            const subOptions = subFilterOptions[currentFilterSubType];
            if (subOptions) {
                subSubFiltersContainer.classList.remove('hidden');
                subSubFiltersContainer.innerHTML = subOptions.map(opt => `
                    <button data-subsubtype="${opt.id}" class="px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                        currentFilterSubSubType === opt.id 
                        ? 'bg-primary-600 text-white border-primary-500 shadow-sm' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-gray-700'
                    } sub-sub-filter-btn">
                        ${opt.name}
                    </button>
                `).join('');
                
                // 綁定次級子分類按鈕事件
                const subSubFilterBtns = subSubFiltersContainer.querySelectorAll('.sub-sub-filter-btn');
                subSubFilterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        currentFilterSubSubType = e.target.getAttribute('data-subsubtype');
                        renderSubFilters();
                        renderItems();
                    });
                });
            } else {
                subSubFiltersContainer.classList.add('hidden');
                subSubFiltersContainer.innerHTML = '';
            }
        } else {
            subSubFiltersContainer.classList.add('hidden');
            subSubFiltersContainer.innerHTML = '';
        }
    }
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
        currentFilterSubSubType = 'all';
        renderSubFilters();
        renderItems();
    });
});

// 頂部全域搜尋列事件（加防抖，避免每字觸發重渲染）
const globalSearch = document.getElementById('global-search');
let itemsSearchDebounce = null;
globalSearch.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();

    // 如果目前不在 items 頁面，自動切換過去
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection.id !== 'tab-items' && currentSearchQuery !== '') {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-target') === 'tab-items') {
                btn.click();
            }
        });
    }

    // 防抖：300ms 後才觸發渲染
    clearTimeout(itemsSearchDebounce);
    if (document.getElementById('tab-items').classList.contains('active')) {
        itemsSearchDebounce = setTimeout(() => renderItems(), 300);
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

// 將各大掉落表轉換為扁平化的陣列
function buildDropData() {
    const drops = [];
    
    // 收集所有掉落表
    const dropTables = [];
    if (typeof MOB_DROPS !== 'undefined') dropTables.push(MOB_DROPS);
    if (typeof DARK_WEAPON_DROPS !== 'undefined') dropTables.push(DARK_WEAPON_DROPS);
    if (typeof DRAGON_DROPS !== 'undefined') dropTables.push(DRAGON_DROPS);
    if (typeof WARRIOR_DROPS !== 'undefined') dropTables.push(WARRIOR_DROPS);
    if (typeof MEM_DROPS !== 'undefined') dropTables.push(MEM_DROPS);
    if (typeof DARK_CRYSTAL_DROPS !== 'undefined') dropTables.push(DARK_CRYSTAL_DROPS);

    dropTables.forEach(table => {
        for (const [monsterName, itemDrops] of Object.entries(table)) {
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
                
                // 避免重複加入
                const existing = drops.find(d => d.monster === monsterName && d.itemId === itemId);
                if (existing) {
                    if (chance > existing.chance) existing.chance = chance;
                } else {
                    drops.push({
                        monster: monsterName,
                        itemId: itemId,
                        itemName: itemName,
                        chance: chance,
                        isLegend: itemData?.legend ? true : false,
                        itemData: itemData,
                        mobData: mobData
                    });
                }
            });
        }
    });

    // 注入特殊事件掉落 (來自 05-kill-progression.js)
    const specialDrops = [
        // 幼龍蛋
        { itemId: 'item_dragon_egg', monster: '安塔瑞斯', chance: 100, isSpecial: '首次擊殺必定獲得' },
        { itemId: 'item_dragon_egg', monster: '法利昂', chance: 100, isSpecial: '首次擊殺必定獲得' },
        { itemId: 'item_dragon_egg', monster: '巴拉卡斯', chance: 100, isSpecial: '首次擊殺必定獲得' },
        // 試煉與任務特殊掉落
        { itemId: 'item_dantes_letter', monster: '黑暗妖精將軍', chance: 1, isSpecial: '騎士 50 級試煉' },
        { itemId: 'item_ancient_book', monster: '巨大兵蟻', chance: 1, isSpecial: '妖精 50 級試煉' },
        { itemId: 'item_chaos_key', monster: '黑暗棲林者', chance: 1, isSpecial: '黑妖 50 級試煉' },
        { itemId: 'item_royal_order', monster: '小惡魔', chance: 1, isSpecial: '王族 50 級試煉' },
        { itemId: 'new_item_241', monster: '黑騎士搜索隊', chance: 1, isSpecial: '王族限定' },
        { itemId: 'new_item_241', monster: '血盟敵人', chance: 100, isSpecial: '擊敗血盟敵人必得' },
        { itemId: 'item_elf_whisper', monster: '精靈墓穴', chance: 1, isSpecial: '騎士 50 級試煉 (限10個)' },
        { itemId: 'item_sealed_intel', monster: '魔族暗殺團', chance: 100, isSpecial: '妖精 50 級試煉 (首次)' },
        { itemId: 'item_spy_report', monster: '魔族暗殺團', chance: 100, isSpecial: '法師 50 級試煉 (首次)' },
        // 祝福卷軸
        { itemId: 'new_item_bless_wpn', monster: '血盟敵人', chance: 0.1, isSpecial: '血盟敵人額外掉寶' },
        { itemId: 'new_item_bless_arm', monster: '血盟敵人', chance: 0.1, isSpecial: '血盟敵人額外掉寶' },
        { itemId: 'new_item_bless_acc', monster: '血盟敵人', chance: 0.01, isSpecial: '血盟敵人額外掉寶' },
        // 精通之證
        { itemId: 'item_mastery_proof', monster: '精通任務頭目', chance: 100, isSpecial: '接取精通任務後必得' }
    ];

    specialDrops.forEach(sp => {
        const itemData = DB?.items?.[sp.itemId];
        const itemName = itemData ? itemData.n : sp.itemId;
        let mobData = null;
        if (typeof DB !== 'undefined' && DB.mobs) {
            mobData = Object.values(DB.mobs).find(m => m.n === sp.monster);
        }
        drops.push({
            monster: sp.monster,
            itemId: sp.itemId,
            itemName: itemName,
            chance: sp.chance,
            isLegend: itemData?.legend ? true : false,
            itemData: itemData,
            mobData: mobData,
            isSpecial: sp.isSpecial
        });
    });

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
    
    // 確保 wikiData.drops 已載入（修正首次切換時可能因載入時序問題導致為空的狀況）
    if (wikiData.drops.length === 0 && typeof DB !== 'undefined' && DB.mobs) {
        wikiData.drops = buildDropData();
    }
    
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
            const itemIconHtml = `<img src="./${itemIconPath}" class="w-6 h-6 object-contain inline-block mr-3 flex-shrink-0 cursor-pointer" data-hover-image onerror="this.outerHTML='<i class=\\\'fa-solid fa-box text-gray-500 text-sm mr-3\\\'></i>'">`;

            // 怪物圖示
            const mobImgFallback = d.mobData && d.mobData.img ? d.mobData.img : '';
            const mobIconPath = `idle-lineage-class/assets/anim/${encodeURIComponent(d.monster)}/idle_0.png`;
            const mobIconHtml = `
                <div class="w-10 h-10 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
                    <img src="./${mobIconPath}" alt="${d.monster}" class="w-full h-full object-contain cursor-pointer" data-hover-image
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
    let dropSearchDebounce = null;
    dropSearchInput.addEventListener('input', (e) => {
        currentDropSearchQuery = e.target.value.trim();
        clearTimeout(dropSearchDebounce);
        dropSearchDebounce = setTimeout(() => renderDrops(), 300);
    });
}

// 初始化：啟動時只做必要設定，不預渲染大量道具列表
function initWikiApp() {
    // 注入特殊任務兌換到 CRAFT_RECIPES 中
    injectSpecialWikiCrafts();

    // 若遊戲版本存在，顯示它
    if (typeof GAME_VERSION !== 'undefined') {
        const versionEl = document.getElementById('game-version-display');
        if (versionEl) versionEl.textContent = GAME_VERSION;
    }

    // 初始化掉落排序圖示（輕量操作）
    sortDropTable('chance');

    // 若當前 tab 是 items 或 drops，才渲染（避免在首頁時也觸發大量渲染）
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn) {
        const activeId = activeTabBtn.getAttribute('data-target');
        if (activeId === 'tab-items') renderItems();
        if (activeId === 'tab-drops') renderDrops();
    }
}

initWikiApp();
document.addEventListener('wikiDataLoaded', initWikiApp);

function initPropertyFilters() {
    const propertyGroups = [
        { name: '基本屬性', options: [
            { id: 'str', name: '力量' }, { id: 'dex', name: '敏捷' }, { id: 'con', name: '體質' },
            { id: 'int', name: '智力' }, { id: 'wis', name: '精神' }, { id: 'cha', name: '魅力' }
        ]},
        { name: '戰鬥能力', options: [
            { id: 'meleeDmg', name: '近戰傷害' }, { id: 'meleeHit', name: '近戰命中' },
            { id: 'rangedDmg', name: '遠距傷害' }, { id: 'rangedHit', name: '遠距命中' },
            { id: 'mdmg', name: '魔法傷害' }, { id: 'dr', name: '減傷' }, { id: 'er', name: '閃避(ER)' },
            { id: 'atkSpdPct', name: '攻擊速度(%)' }, { id: 'extraMp', name: '額外魔法加成' },
            { id: 'skillDmgMult', name: '技能傷害倍率' }
        ]},
        { name: '生存屬性', options: [
            { id: 'mhp', name: '最大HP' }, { id: 'mmp', name: '最大MP' },
            { id: 'hpR', name: 'HP恢復' }, { id: 'mpR', name: 'MP恢復' },
            { id: 'mr', name: '魔法防禦' }, { id: 'weightCap', name: '負重提升' }
        ]},
        { name: '屬性抗性', options: [
            { id: 'resFire', name: '火抗' }, { id: 'resWater', name: '水抗' },
            { id: 'resEarth', name: '地抗' }, { id: 'resWind', name: '風抗' },
            { id: 'resNone', name: '無抗' }, { id: 'stunResist', name: '抗暈' }, { id: 'freezeResist', name: '抗冰' }
        ]},
        { name: '特殊效果', options: [
            { id: 'hasSpellProc', name: '發動魔法' }, { id: 'unBonus', name: '不死/狼人加成' },
            { id: 'hasPierce', name: '武器穿透' }, { id: 'hasVamp', name: '吸血/吸魔' },
            { id: 'combo', name: '武器雙擊' }, { id: 'hasCrushCleave', name: '重擊/切割' },
            { id: 'ignHardSkin', name: '貫穿硬皮' }, { id: 'weakExpose', name: '弱點曝光' },
            { id: 'rapidfire', name: '遠距連射' }, { id: 'thorns', name: '反擊' }, { id: 'block', name: '盾牌格檔' }
        ]},
        { name: '免疫效果', options: [
            { id: 'immFreeze', name: '免疫冰凍' }, { id: 'immPoison', name: '免疫中毒' },
            { id: 'immParalyze', name: '免疫麻痺' }, { id: 'immStone', name: '免疫石化' },
            { id: 'immSlow', name: '免疫緩速' }, { id: 'immHold', name: '免疫木乃伊' }
        ]},
        { name: '寵物/召喚屬性', options: [
            { id: 'petDmg', name: '寵物傷害' }, { id: 'petHit', name: '寵物命中' },
            { id: 'petAc', name: '寵物防禦(AC)' }, { id: 'petMr', name: '寵物魔防' },
            { id: 'petInt', name: '寵物智力' }, { id: 'petWis', name: '寵物精神' },
            { id: 'petDmgAll', name: '全體寵物傷害' }, { id: 'petHitAll', name: '全體寵物命中' },
            { id: 'petSkillDmgMult', name: '寵物技能傷害倍率' },
            { id: 'summonDmg', name: '召喚物傷害' }, { id: 'summonHit', name: '召喚物命中' },
            { id: 'summonCtrl', name: '召喚控制' },
            { id: 'petDmgReduce', name: '寵物護甲' }, { id: 'petBleed', name: '寵物出血' }
        ]}
    ];

    if (!propertyFiltersContainer) return;

    const buildHtml = () => {
        let h = '<button id="toggle-property-filters" class="flex items-center text-sm text-gray-400 hover:text-gold-400 mb-2 transition-colors focus:outline-none">'
            + '<i class="fa-solid fa-filter mr-2"></i>進階屬性篩選'
            + '<i class="fa-solid fa-chevron-down ml-2 transition-transform duration-300" id="filter-chevron"></i>'
            + '</button>';
        h += '<div id="property-filters-panel" class="hidden glass-panel p-4 rounded-xl border border-gray-800 mb-2">';
        h += '<div class="flex items-center flex-wrap gap-2 mb-4 pb-3 border-b border-gray-800">';
        h += '<span class="text-xs text-gray-500 mr-1">多條件邏輯：</span>';
        h += '<button id="prop-mode-and" class="px-2.5 py-1 text-xs rounded border font-semibold transition-colors prop-mode-btn bg-primary-600 border-primary-500 text-white" data-mode="AND">AND</button>';
        h += '<button id="prop-mode-or" class="px-2.5 py-1 text-xs rounded border font-semibold transition-colors prop-mode-btn bg-gray-800 border-gray-700 text-gray-400" data-mode="OR">OR</button>';
        h += '<span id="prop-mode-desc" class="text-xs text-gray-400 ml-1">— 勾選條件<strong class="text-primary-400">全部符合</strong>才顯示</span>';
        h += '<div class="ml-auto">';
        h += '<button id="clear-property-filters" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-800/60 hover:text-red-100 border border-red-800/50 hover:border-red-600 text-xs font-semibold transition-all">';
        h += '<i class="fa-solid fa-rotate-left"></i>清除所有篩選</button>';
        h += '</div></div>';
        // Class filter row (multi-select checkboxes)
        h += '<div class="flex flex-wrap items-center gap-2 mt-4 mb-1 border-t border-gray-800 pt-3">';
        h += '<span class="text-xs font-semibold text-gray-500 w-full mb-1">職業篩選 <span class="text-gray-600 font-normal">(可複選，不選 = 全部)  篩選邏輯：OR（勾選的職業任一符合即顯示）</span></span>';
        [
          { id: 'royal',    name: '王族',   icon: 'fa-chess-king',    color: 'text-yellow-400' },
          { id: 'knight',   name: '騎士',   icon: 'fa-shield-halved', color: 'text-blue-400'   },
          { id: 'elf',      name: '妖精',   icon: 'fa-leaf',          color: 'text-green-400'  },
          { id: 'mage',     name: '法師',   icon: 'fa-hat-wizard',    color: 'text-purple-400' },
          { id: 'dark',     name: '黑妖',   icon: 'fa-moon',          color: 'text-gray-400'   },
          { id: 'dragon',   name: '龍騎士', icon: 'fa-dragon',        color: 'text-red-400'    },
          { id: 'illusion', name: '幻術士', icon: 'fa-eye',           color: 'text-pink-400'   },
          { id: 'warrior',  name: '戰士',   icon: 'fa-gavel',         color: 'text-orange-400' }
        ].forEach(cls => {
            h += `<label class="flex items-center space-x-2 text-[13px] text-gray-300 bg-gray-900/50 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white transition-colors border border-gray-800 hover:border-gray-600 select-none"><input type="checkbox" value="${cls.id}" class="form-checkbox class-checkbox rounded border-gray-600 bg-gray-800 w-3.5 h-3.5"><i class="fa-solid ${cls.icon} ${cls.color} mr-1 ml-1"></i><span>${cls.name}</span></label>`;
        });
        h += '</div>';
        // Relic-only toggle
        h += '<div class="flex flex-wrap items-center gap-2 mt-3 mb-1 border-t border-gray-800 pt-3">';
        h += '<span class="text-xs font-semibold text-gray-500 w-full mb-1">快捷篩選</span>';
        h += '<label class="flex items-center space-x-2 text-[13px] text-amber-300 bg-amber-900/20 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-amber-900/40 hover:text-amber-100 transition-colors border border-amber-800/40 hover:border-amber-600 select-none">';
        h += '<input type="checkbox" id="relic-only-toggle" class="form-checkbox rounded border-gray-600 bg-gray-800 w-3.5 h-3.5 accent-amber-400">';
        h += '<i class="fa-solid fa-scroll ml-1 mr-0.5"></i><span>只顯示遺物</span></label>';
        h += '</div>';
      
        h += '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">';
        propertyGroups.forEach(group => {
            h += '<div><h4 class="text-xs font-semibold text-gray-500 mb-3 border-b border-gray-800 pb-1">' + group.name + '</h4>';
            h += '<div class="flex flex-wrap gap-2">';
            group.options.forEach(opt => {
                h += '<label class="flex items-center space-x-2 text-[13px] text-gray-300 bg-gray-900/50 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white transition-colors border border-gray-800 hover:border-gray-600 select-none">';
                h += '<input type="checkbox" value="' + opt.id + '" class="form-checkbox text-primary-500 rounded border-gray-600 bg-gray-800 property-checkbox w-3.5 h-3.5 focus:ring-primary-500 focus:ring-offset-gray-900">';
                h += '<span>' + opt.name + '</span></label>';
            });
            h += '</div></div>';
        });
        h += '</div>';
        h += '</div></div>';
        h += '</div>';  
        return h;
    };

    propertyFiltersContainer.innerHTML = buildHtml();

    const toggleBtn = document.getElementById('toggle-property-filters');
    const panel = document.getElementById('property-filters-panel');
    const chevron = document.getElementById('filter-chevron');

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        chevron.style.transform = panel.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    panel.addEventListener('change', (e) => {
        if (e.target.classList.contains('property-checkbox')) {
            currentPropertyFilters = Array.from(panel.querySelectorAll('.property-checkbox:checked')).map(cb => cb.value);
            renderItems();
        }
    });

    panel.addEventListener('change', (e2) => {
        if (e2.target.classList.contains('class-checkbox')) {
            currentClassFilters = Array.from(panel.querySelectorAll('.class-checkbox:checked')).map(cb => cb.value);
            renderItems();
        }
        if (e2.target.id === 'relic-only-toggle') {
            filterRelicOnly = e2.target.checked;
            renderItems();
        }
    });

    const clearBtn = document.getElementById('clear-property-filters');
    clearBtn.addEventListener('click', () => {
        panel.querySelectorAll('.property-checkbox').forEach(cb => { cb.checked = false; });
        panel.querySelectorAll('.class-checkbox').forEach(cb => { cb.checked = false; });
        const relicToggle = document.getElementById('relic-only-toggle');
        if (relicToggle) relicToggle.checked = false;
        currentPropertyFilters = [];
        currentClassFilters = [];
        filterRelicOnly = false;
        propertyFilterMode = 'AND';
        updateModeUI();
        renderItems();
    });

    // AND / OR toggle
    const modeDesc = document.getElementById('prop-mode-desc');
    const updateModeUI = () => {
        panel.querySelectorAll('.prop-mode-btn').forEach(b => {
            const active = b.getAttribute('data-mode') === propertyFilterMode;
            b.className = 'px-2.5 py-1 text-xs rounded border font-semibold transition-colors prop-mode-btn '
                + (active ? 'bg-primary-600 border-primary-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400');
        });
        if (modeDesc) {
            if (propertyFilterMode === 'OR') {
                modeDesc.innerHTML = '— 勾選條件<strong class="text-yellow-400">任一符合</strong>即顯示';
            } else {
                modeDesc.innerHTML = '— 勾選條件<strong class="text-primary-400">全部符合</strong>才顯示';
            }
        }
    };
    panel.querySelectorAll('.prop-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            propertyFilterMode = btn.getAttribute('data-mode');
            updateModeUI();
            if (currentPropertyFilters.length > 0) renderItems();
        });
    });
}

// 初始化屬性過濾器
initPropertyFilters();
