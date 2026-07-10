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
    const EQUIP_CATEGORIES = [
        { key: 'dagger',     name: '匕首',     group: '武器', bonus: 'MP +5' }, { key: 'sword1',     name: '單手劍',   group: '武器', bonus: '傷害減免 +1' },
        { key: 'sword2',     name: '雙手劍',   group: '武器', bonus: 'HP +10' }, { key: 'katana',     name: '武士刀',   group: '武器', bonus: 'HP +5' },
        { key: 'blunt1',     name: '單手鈍器', group: '武器', bonus: '負重 +10' }, { key: 'blunt2',     name: '雙手鈍器', group: '武器', bonus: '負重 +10' },
        { key: 'spear',      name: '矛',       group: '武器', bonus: 'MR +1' }, { key: 'claw',       name: '鋼爪',     group: '武器', bonus: 'HP自動恢復 +1' },
        { key: 'dual',       name: '雙刀',     group: '武器', bonus: '傷害減免 +1' }, { key: 'chainsword', name: '鎖鏈劍',   group: '武器', bonus: 'HP +5' },
        { key: 'bow',        name: '弓',       group: '武器', bonus: 'ER +1' }, { key: 'xbow',       name: '十字弓',   group: '武器', bonus: 'MR +1' },
        { key: 'wand',       name: '魔杖',     group: '武器', bonus: 'MP自動恢復量 +1' }, { key: 'qigu',       name: '奇古獸',   group: '武器', bonus: 'MP +5' },
        { key: 'wpn_other',  name: '其他武器', group: '武器', bonus: '' },
        { key: 'helm',     name: '頭盔',   group: '防具', bonus: '傷害減免 +1' }, { key: 'armor',    name: '盔甲',   group: '防具', bonus: 'AC -1' },
        { key: 'shin',     name: '脛甲',   group: '防具', bonus: '傷害減免 +1' }, { key: 'tshirt',   name: '內衣',   group: '防具', bonus: '' },
        { key: 'cloak',    name: '斗篷',   group: '防具', bonus: 'MR +1' }, { key: 'boots',    name: '長靴',   group: '防具', bonus: 'ER +1' },
        { key: 'gloves',   name: '手套',   group: '防具', bonus: '傷害減免 +1' }, { key: 'shield',   name: '盾牌',   group: '防具', bonus: 'HP +10' },
        { key: 'armguard', name: '臂甲',   group: '防具', bonus: '負重 +10' },
        { key: 'amulet', name: '項鍊',     group: '飾品', bonus: 'HP自然恢復量 +1' }, { key: 'ring',   name: '戒指',     group: '飾品', bonus: 'MP自然恢復量 +1' },
        { key: 'belt',   name: '腰帶',     group: '飾品', bonus: '負重 +20' }, { key: 'ear',    name: '耳環',     group: '飾品', bonus: 'MP自然恢復量 +1' },
        { key: 'pet',    name: '寵物裝備', group: '飾品', bonus: '項圈夥伴命中率 +1' }, { key: 'doll',   name: '魔法娃娃', group: '飾品', bonus: '全屬性 +1' }
    ];

    const MISC_CATEGORIES = [
        { key: 'pot',     name: '藥水', bonus: '負重 +10' }, { key: 'scroll',  name: '卷軸', bonus: '負重 +10' },
        { key: 'skillbk', name: '技能書', bonus: 'MP自然恢復量 +3' }, { key: 'mat',     name: '材料', bonus: '藥水恢復量 +3%' },
        { key: 'special', name: '其他', bonus: '藥水恢復量 +2%' }
    ];

    const CARD_STAT_LABEL = { mhp: 'HP', mmp: 'MP', mpR: 'MP自動恢復量', hpR: 'HP自動恢復量', dr: '傷害減免', weight: '負重上限', extraMp: '額外魔法點數', extraDmg: '額外傷害', extraHit: '額外命中', mr: 'MR', resFire: '火屬性抗性', resWater: '水屬性抗性', resWind: '風屬性抗性', resEarth: '地屬性抗性' };
    const CARD_TIERS = [{ sfx: '普', col: 'text-slate-300' }, { sfx: '銀', col: 'text-slate-100' }, { sfx: '金', col: 'text-yellow-400' }];

    const CARD_REGIONS = [
        { key: 'silverknight', name: '銀騎士村',   stat: 'mhp',      vals: [3, 5, 10],  maps: ['silver_knight', 'training'] },
        { key: 'fairyforest',  name: '妖精森林',   stat: 'mmp',      vals: [3, 5, 10],  maps: ['zone_01', 'zone_15', 'zone_16', 'zone_17'] },
        { key: 'talkingisland',name: '說話之島',   stat: 'mpR',      vals: [1, 2, 3],   maps: ['talking_island_port', 'talking_island', 'zone_13', 'zone_14'] },
        { key: 'burningwillow',name: '燃柳',       stat: 'hpR',      vals: [1, 2, 3],   maps: ['elf_forest', 'pirate_wild', 'pirate_dungeon', 'elf_grave', 'hidden_cave'] },
        { key: 'gludin',       name: '古魯丁',     stat: 'dr',       vals: [1, 2, 3],   maps: ['gludio', 'zone_06', 'zone_07', 'zone_08', 'zone_09', 'zone_10', 'zone_11', 'zone_12'] },
        { key: 'kent',         name: '肯特',       stat: 'mhp',      vals: [3, 5, 10],  maps: ['kent'] },
        { key: 'windwood',     name: '風木',       stat: 'weight',   vals: [10, 30, 50],maps: ['windwood_dungeon', 'windwood', 'desert', 'zone_22', 'zone_23', 'zone_24', 'zone_25', 'zone_32', 'zone_33', 'hidden_antqueen'] },
        { key: 'heine',        name: '海音',       stat: 'extraMp',  vals: [1, 2, 3],   maps: ['heine', 'mirror_forest', 'zone_34', 'zone_35', 'zone_36', 'eva_kingdom', 'fafurion_lair'] },
        { key: 'giran',        name: '奇岩',       stat: 'weight',   vals: [10, 20, 30],maps: ['giran', 'zone_18', 'zone_19', 'zone_20', 'zone_21'] },
        { key: 'dragonvalley', name: '龍之谷',     stat: 'extraDmg', vals: [1, 2, 3],   maps: ['dragon_valley', 'zone_26', 'zone_27', 'zone_28', 'zone_29', 'zone_30', 'zone_31', 'antaras_lair', 'silent_outer'] },
        { key: 'witon',        name: '威頓',       stat: 'resFire',  vals: [1, 2, 3],   maps: ['fire_dragon', 'valakas_lair'] },
        { key: 'oren',         name: '歐瑞',       stat: 'resWater', vals: [1, 2, 3],   maps: ['zone_02', 'zone_03', 'zone_04', 'zone_05', 'zone_37', 'zone_38', 'zone_39', 'zone_40', 'zone_41', 'hidden_lab_nolife', 'hidden_lab_darkmagic', 'hidden_seal_spirit', 'hidden_seal_monster', 'hidden_seal_demon', 'crystal_cave1', 'crystal_cave2', 'crystal_cave3', 'shadow_temple'] },
        { key: 'aden',         name: '亞丁',       stat: 'resWind',  vals: [1, 2, 3],   maps: ['twilight_mt', 'dream_island'] },
        { key: 'tower',        name: '傲慢之塔',   stat: 'extraHit', vals: [1, 2, 3],   maps: '__pride__' },
        { key: 'rastabad',     name: '拉斯塔巴德', stat: 'mr',       vals: [1, 3, 5],   maps: ['rastabad_cave1', 'rastabad_cave2', 'rastabad_cave3', 'rastabad_gate', 'giant_tomb', 'demon_temple', 'rastabad_beast', 'dark_magic_lab', 'necro_training', 'elder_room', 'king_baranka_room', 'law_king_room', 'necro_king_room', 'assassin_king_room'] },
        { key: 'rift',         name: '時空裂痕',   stat: 'resEarth', vals: [1, 2, 3],   maps: ['thebes_desert', 'thebes_pyramid', 'thebes_temple', 'tikal_area', 'tikal_deep', 'tikal_altar'] }
    ];

    // 分類判定邏輯
    function equipCatKey(id, d) {
        if (!d) return null;
        if (d.type === 'wpn') {
            if (d.isArrow) return null;
            if (d.isBow) return /十字弓|弩/.test(d.n || '') ? 'xbow' : 'bow';
            if (d.qigu) return 'qigu';
            if (d.chainsword) return 'chainsword';
            if (/水晶球/.test(d.n || '')) return 'wand';
            if (d.eff === 'pierce') return 'spear';
            if (d.eff === 'cleave') return 'sword2';
            if (d.eff === 'crush') return d.w2h ? 'blunt2' : 'blunt1';
            return 'wpn_other';
        }
        if (d.type === 'arm') {
            if (d.armguard) return 'armguard';
            if (d.slot) return d.slot;
        }
        if (d.type === 'acc') {
            if (d.slot === 'ear1' || d.slot === 'ear2') return 'ear';
            if (d.slot) return d.slot;
        }
        return null;
    }

    function miscCatKey(id, d) {
        if (!d) return null;
        var t = d.type;
        if (t === 'wpn' || t === 'arm' || t === 'acc') return null;
        if (id === 'item_card_book' || id === 'item_equip_book') return null;
        if (d.eff === 'card' || id.startsWith('card_')) return null;
        if (t === 'pot' || id.startsWith('potion_')) return 'pot';
        if (t === 'scroll' || id.startsWith('scroll_') || (d.n && d.n.includes('卷軸'))) return 'scroll';
        if (t === 'skillbk' || id.startsWith('bk_') || id.startsWith('mem_')) return 'skillbk';
        if (t === 'etc' || id.startsWith('mat_') || id.startsWith('new_item_')) return 'mat';
        return 'special';
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
            } else if (['pot', 'scroll', 'skillbk', 'etc'].includes(d.type)) {
                let ck = miscCatKey(id, d);
                if (ck && INDEX.item[ck]) INDEX.item[ck].push({ id, ...d });
            }
        }

        // 整理怪物
        const prideMaps = Object.keys(DB.maps || {}).filter(k => /^pride_/.test(k));
        CARD_REGIONS.forEach(reg => {
            let maps = (reg.maps === '__pride__') ? prideMaps : reg.maps;
            let added = new Set();
            maps.forEach(mk => {
                let pool = DB.maps[mk]; 
                if (!pool) return;
                pool.forEach(mid => {
                    let mob = DB.mobs[mid]; 
                    if (!mob || !mob.n || mob.race === '血盟' || mob.race === '建築') return;
                    if (added.has(mob.n)) return;
                    added.add(mob.n);
                    INDEX.monster[reg.key].push({ id: mid, name: mob.n, ...mob, maps: maps });
                });
            });
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
                ${c.name} <span class="ml-1 text-[10px] text-slate-400">全部</span>
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
            if (state.currentType === 'equip' && curCatDef.bonus) {
                bonusStr = `<div class="text-sm font-bold text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-700/50">全收集完成加成：${curCatDef.bonus}</div>`;
            }
        } else if (state.currentType === 'item') {
            titleStr = `<div class="text-xl font-bold text-amber-200">${curCatDef.name}</div>`;
            if (curCatDef.bonus) {
                bonusStr = `<div class="text-sm font-bold text-amber-300 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-700/50">全收集完成加成：${curCatDef.bonus}</div>`;
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
            <div class="text-sm text-slate-400">點擊卡片查看獲得來源</div>
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
                    let imgUrl = `idle-lineage-class/assets/anim/${item.name}/idle_0.png`;
                    let fallbackSrc = `idle-lineage-class/assets/icons/monsters/${item.name}.png`;
                    let placeholderSrc = `https://placehold.co/64x64/1e293b/334155?text=%3F`;
                    let fallbackChain = `this.onerror=function(){this.onerror=null;this.src='${placeholderSrc}';};this.src='${fallbackSrc}';`;

                    html += `<div class="relative bg-slate-800/70 border border-slate-600 rounded-lg p-2 flex flex-col items-center gap-1 w-[136px] cursor-pointer hover:bg-slate-700 transition-colors" onclick="WikiCollections.showMonsterDetail('${item.name}')">
                        <img src="${imgUrl}" alt="${item.name}" class="w-16 h-16 object-contain" onerror="${fallbackChain}">
                        <div class="text-center w-full mt-1">
                            <div class="text-sm font-bold text-white truncate" title="${item.name}">${item.name}</div>
                            <div class="text-[11px] text-slate-500">Lv ${item.lv || '?'}</div>
                            <div class="text-[11px] text-slate-400 leading-tight mt-0.5">點擊查看來源</div>
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

                    html += `<div class="relative bg-slate-800/70 border ${state.currentType === 'relic' ? 'border-sky-700/70' : 'border-slate-600'} rounded-lg p-2 flex flex-col items-center gap-1 w-[112px] cursor-pointer hover:bg-slate-700 transition-colors" onclick="WikiCollections.showItemDetail('${item.id}')">
                        ${badge}
                        <img src="${imgUrl}" alt="${item.n}" class="w-14 h-14 object-contain" onerror="this.onerror=null;this.src='https://placehold.co/56x56/1e293b/334155?text=%3F';">
                        <div class="text-center w-full">
                            <div class="text-xs font-bold ${color} truncate" title="${item.n}">${item.n}</div>
                        </div>
                    </div>`;
                }
            });
        }
        
        html += `</div>`;
        grid.innerHTML = html;
        document.getElementById('collections-empty-state').classList.add('hidden');
    }

    // --- 獲取來源模態框 ---
    function showSourceModal(title, iconHtml, titleClass, desc, sourceHtml) {
        const modalHtml = `
            <div id="collection-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-300">
                <div class="glass-panel p-6 rounded-2xl border border-gray-700 max-w-lg w-full shadow-2xl relative transform scale-95 transition-transform duration-300">
                    <button onclick="document.getElementById('collection-detail-modal').remove()" class="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors">
                        <i class="fa-solid fa-xmark text-2xl"></i>
                    </button>
                    
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-16 h-16 bg-gray-900 border border-gray-700 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                            ${iconHtml}
                        </div>
                        <div>
                            <h3 class="text-xl font-bold ${titleClass}">${title}</h3>
                        </div>
                    </div>
                    
                    ${desc ? `<div class="text-sm text-gray-400 mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-800 leading-relaxed">${desc}</div>` : ''}
                    
                    <div class="border-t border-gray-800 pt-4 max-h-[300px] overflow-y-auto pr-2">
                        <h4 class="text-md font-bold text-white mb-3">📍 獲取來源</h4>
                        ${sourceHtml}
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('collection-detail-modal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        requestAnimationFrame(() => {
            const modal = document.getElementById('collection-detail-modal');
            if (modal) {
                modal.classList.remove('opacity-0');
                modal.firstElementChild.classList.remove('scale-95');
                modal.firstElementChild.classList.add('scale-100');
            }
        });

        document.getElementById('collection-detail-modal').addEventListener('click', (e) => {
            if (e.target.id === 'collection-detail-modal') e.target.remove();
        });
    }

    function getItemSourceHtml(itemId) {
        let sources = [];
        // Drops
        if (wikiData && wikiData.drops) {
            const drops = wikiData.drops.filter(d => d.itemId === itemId);
            if (drops.length > 0) {
                sources.push(`<div class="mb-4"><div class="text-sm font-semibold text-primary-400 mb-2">⚔️ 怪物掉落</div><div class="flex flex-wrap gap-2">` + 
                    drops.slice(0, 15).map(d => `<span class="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">${d.mobName} <span class="text-gray-500">(${d.chanceStr})</span></span>`).join('') +
                    (drops.length > 15 ? `<span class="px-2 py-1 text-xs text-gray-500">...等 ${drops.length} 隻</span>` : '') +
                    `</div></div>`);
            }
        }
        
        // Craft
        if (typeof CRAFT_RECIPES !== 'undefined') {
            const crafts = [];
            for (let cn in CRAFT_RECIPES) {
                let recs = CRAFT_RECIPES[cn];
                if (!Array.isArray(recs)) continue;
                recs.forEach(r => { if (r && r.result === itemId) crafts.push(cn); });
            }
            if (crafts.length > 0) {
                const uniqueCrafts = [...new Set(crafts)];
                sources.push(`<div class="mb-4"><div class="text-sm font-semibold text-amber-400 mb-2">🔨 製作來源</div><div class="flex flex-wrap gap-2">` +
                    uniqueCrafts.map(c => `<span class="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">NPC/城鎮: ${c}</span>`).join('') +
                    `</div></div>`);
            }
        }

        // Shop
        if (typeof SHOP_LISTS !== 'undefined') {
            const shops = [];
            for (let npc in SHOP_LISTS) {
                if (SHOP_LISTS[npc].includes(itemId)) shops.push(npc);
            }
            if (shops.length > 0) {
                sources.push(`<div class="mb-4"><div class="text-sm font-semibold text-emerald-400 mb-2">💰 商店購買</div><div class="flex flex-wrap gap-2">` +
                    shops.map(s => `<span class="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">${s}</span>`).join('') +
                    `</div></div>`);
            }
        }

        if (sources.length === 0) {
            sources.push(`<div class="text-sm text-gray-500 italic">目前無已知的常規掉落或製作來源。</div>`);
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
        },
        showItemDetail: (id) => {
            const d = DB.items[id];
            if (!d) return;
            let imgUrl = typeof getItemIconPath === 'function' ? getItemIconPath(d) : (d.img || '');
            if (imgUrl && imgUrl.startsWith('assets/')) imgUrl = 'idle-lineage-class/' + imgUrl;
            const iconHtml = `<img src="${imgUrl}" class="max-w-full max-h-full object-contain" onerror="this.onerror=null;this.src='https://placehold.co/64x64/1e293b/334155?text=%3F';">`;
            const titleClass = d.legend ? 'text-amber-300' : (d.c || 'text-white');
            showSourceModal(d.n, iconHtml, titleClass, d.d, getItemSourceHtml(id));
        },
        showMonsterDetail: (name) => {
            // 找出該怪物資料
            let mobObj = null;
            let regionName = '未知地區';
            for (let reg in INDEX.monster) {
                let m = INDEX.monster[reg].find(x => x.name === name);
                if (m) { mobObj = m; regionName = CARD_REGIONS.find(r=>r.key===reg).name; break; }
            }
            if (!mobObj) return;

            let imgUrl = `idle-lineage-class/assets/anim/${mobObj.name}/idle_0.png`;
            let fallbackSrc = `idle-lineage-class/assets/icons/monsters/${mobObj.name}.png`;
            let placeholderSrc = `https://placehold.co/64x64/1e293b/334155?text=%3F`;
            let fallbackChain = `this.onerror=function(){this.onerror=null;this.src='${placeholderSrc}';};this.src='${fallbackSrc}';`;

            const iconHtml = `<img src="${imgUrl}" class="max-w-full max-h-full object-contain" onerror="${fallbackChain}">`;
            
            let sourceHtml = `
            <div class="mb-4"><div class="text-sm font-semibold text-primary-400 mb-2">🗺️ 出沒地區</div>
                <span class="px-2 py-1 bg-gray-800 rounded text-xs border border-gray-700">${regionName}</span>
            </div>
            <div class="text-sm text-gray-400">討伐 <span class="text-red-400 font-semibold">${name}</span> 有機率掉落其專屬卡片 (普卡、銀卡、金卡)。也可至威頓村魔法娃娃商人進行低階卡片合成。</div>
            `;
            
            showSourceModal(name + ' 的卡片', iconHtml, 'text-white', '怪物卡片。', sourceHtml);
        }
    };
})();

document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-collections') {
        WikiCollections.init();
    }
});
