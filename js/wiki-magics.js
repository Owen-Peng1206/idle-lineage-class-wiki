/**
 * Wiki Magics Logic
 * 負責魔法圖鑑的解析與渲染
 */

// 將 DB.skills 轉換為陣列
function buildMagicData() {
    if (typeof DB === 'undefined' || !DB.skills) return [];
    
    return Object.entries(DB.skills).map(([key, value]) => {
        return {
            id: key,
            name: value.n || key,
            type: value.type || 'unknown',
            tier: value.tier || 1,
            mp: value.mp || 0,
            hp: value.hp || 0,
            // 提取各職業需求
            req: {
                mage: value.reqM,
                elf: value.reqE,
                knight: value.reqK,
                royal: value.reqR,
                dark: value.reqD,
                dragon: value.reqDk,
                illusion: value.reqI,
                warrior: value.reqW
            },
            desc: value.msg || value.desc || '無詳細說明',
            raw: value
        };
    });
}

const magicData = buildMagicData();
const magicsGrid = document.getElementById('magics-grid');
const magicsEmptyState = document.getElementById('magics-empty-state');
const magicSearchInput = document.getElementById('magic-search');
let currentMagicSearchQuery = '';
let currentMagicFilterClass = 'all';

// 解析需求等級並產生 HTML
function generateReqBadges(reqObj) {
    let html = '';
    const classMap = {
        mage: { label: '法師', color: 'bg-blue-900/50 text-blue-300 border-blue-700/50' },
        elf: { label: '妖精', color: 'bg-green-900/50 text-green-300 border-green-700/50' },
        knight: { label: '騎士', color: 'bg-red-900/50 text-red-300 border-red-700/50' },
        royal: { label: '王族', color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50' },
        dark: { label: '黑妖', color: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
        dragon: { label: '龍騎士', color: 'bg-orange-900/50 text-orange-300 border-orange-700/50' },
        illusion: { label: '幻術士', color: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50' },
        warrior: { label: '戰士', color: 'bg-stone-800 text-stone-300 border-stone-600' }
    };

    let count = 0;
    for (const [key, lv] of Object.entries(reqObj)) {
        if (lv) {
            const style = classMap[key];
            html += `<span class="text-xs px-2 py-1 rounded border mr-2 mb-2 inline-block ${style.color}">${style.label} Lv.${lv}</span>`;
            count++;
        }
    }
    
    if (count === 0) return '<span class="text-xs text-gray-600 italic">無特定職業限制</span>';
    return html;
}

// 產生類型標籤
function generateTypeBadge(type) {
    let icon = 'fa-wand-magic-sparkles';
    let label = '魔法';
    let color = 'text-purple-400';
    
    switch(type) {
        case 'atk': icon = 'fa-bolt'; label = '攻擊魔法'; color = 'text-red-400'; break;
        case 'heal': icon = 'fa-heart'; label = '治癒魔法'; color = 'text-green-400'; break;
        case 'buff': icon = 'fa-shield-halved'; label = '增益魔法'; color = 'text-blue-400'; break;
        case 'debuff': icon = 'fa-skull'; label = '減益魔法'; color = 'text-purple-400'; break;
    }
    
    return `<span class="${color} text-xs font-semibold"><i class="fa-solid ${icon} mr-1"></i>${label}</span>`;
}

function getMagicSourcesHtml(skillId) {
    if (typeof wikiData === 'undefined' || !wikiData.items) return '';
    
    // 找出教導這個技能的道具 (通常是魔法書、技術書等)
    const bookItems = wikiData.items.filter(item => item.sk === skillId);
    if (bookItems.length === 0) return '';
    
    let html = '';
    
    bookItems.forEach(book => {
        // 1. 尋找商店販售資訊
        const shops = [];
        if (typeof DB !== 'undefined' && DB.towns) {
            for (const [townId, townInfo] of Object.entries(DB.towns)) {
                if (townInfo.shop && townInfo.shop.includes(book.id)) {
                    shops.push(townInfo.n);
                }
            }
        }
        
        let shopHtml = '';
        if (shops.length > 0) {
            shopHtml = `<div class="mb-2 text-xs text-gray-300 flex items-center flex-wrap">
                <i class="fa-solid fa-shop text-blue-400 mr-1.5"></i>商販: ${shops.join('、')} 
                <span class="text-yellow-500 ml-2 bg-yellow-900/30 px-1.5 py-0.5 rounded border border-yellow-700/50"><i class="fa-solid fa-coins mr-1"></i>${book.p ? book.p.toLocaleString() : '未知'}</span>
            </div>`;
        }
        
        // 2. 尋找掉落資訊
        let dropHtml = '';
        if (typeof getItemDropsHtml === 'function') {
            const dropsResult = getItemDropsHtml(book.id);
            if (dropsResult && !dropsResult.includes('無怪物掉落')) {
                // 修改 class 以符合版面，且不破壞原本的 DOM 結構
                dropHtml = dropsResult.replace('掉落怪物:', `掉落: ${book.n}`)
                                      .replace('mt-3 border-t border-gray-800/50 pt-2', 'mt-2 pt-2 border-t border-gray-800/40');
            } else if (dropsResult && dropsResult.includes('無怪物掉落')) {
                 dropHtml = `<div class="text-[11px] text-gray-600 mt-2 pt-2 border-t border-gray-800/40"><i class="fa-solid fa-ghost mr-1"></i>${book.n} 無怪物掉落</div>`;
            }
        }

        if (shopHtml || dropHtml) {
            html += `<div class="mt-3 pt-3 border-t border-gray-800/60">
                ${shopHtml}
                ${dropHtml}
            </div>`;
        }
    });
    
    return html;
}

function renderMagics() {
    if (!magicsGrid) return;
    
    const keyword = currentMagicSearchQuery.toLowerCase();
    const filtered = magicData.filter(m => {
        // 職業過濾 (如果是 'all' 則全顯示，否則檢查該職業是否有等級需求)
        const matchClass = currentMagicFilterClass === 'all' || 
                           (m.req && m.req[currentMagicFilterClass] !== undefined && m.req[currentMagicFilterClass] !== null);
        
        // 關鍵字過濾
        const matchKeyword = keyword === '' || 
                             m.name.toLowerCase().includes(keyword) || 
                             m.desc.toLowerCase().includes(keyword);
                             
        return matchClass && matchKeyword;
    });

    if (filtered.length === 0) {
        magicsGrid.innerHTML = '';
        magicsEmptyState.classList.remove('hidden');
    } else {
        magicsEmptyState.classList.add('hidden');
        magicsGrid.innerHTML = filtered.map(m => `
            <div class="glass-panel p-5 rounded-xl border border-gray-800 hover:border-primary-500/50 transition-colors flex flex-col h-full relative overflow-hidden group">
                <!-- 裝飾性階級數字 -->
                <div class="absolute -right-4 -top-6 text-9xl font-black text-gray-800/20 group-hover:text-primary-900/20 transition-colors z-0 pointer-events-none">
                    ${m.tier}
                </div>
                
                <div class="relative z-10 flex justify-between items-start mb-4">
                    <div>
                    <div class="flex items-center gap-2.5 mb-1">
                        <img src="idle-lineage-class/assets/icons/skills/${encodeURIComponent(m.name)}.png"
                            alt="${m.name}" class="w-8 h-8 object-contain flex-shrink-0"
                            onerror="this.style.display='none'">
                        <h4 class="text-lg text-white font-bold">${m.name}</h4>
                    </div>
                    ${generateTypeBadge(m.type)}
                    </div>
                    <div class="flex flex-col items-end gap-1">
                        ${m.mp > 0 ? `<span class="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800"><i class="fa-solid fa-droplet mr-1"></i>MP ${m.mp}</span>` : ''}
                        ${m.hp > 0 ? `<span class="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full border border-red-800"><i class="fa-solid fa-heart mr-1"></i>HP ${m.hp}</span>` : ''}
                    </div>
                </div>
                
                <div class="relative z-10 mb-4">
                    <div class="text-xs text-gray-500 mb-1">學習需求：</div>
                    <div class="flex flex-wrap">
                        ${generateReqBadges(m.req)}
                    </div>
                </div>
                
                <div class="relative z-10 mt-auto pt-4 border-t border-gray-800/60">
                    <p class="text-sm text-gray-400">
                        ${m.desc}
                    </p>
                    ${getMagicSourcesHtml(m.id)}
                </div>
            </div>
        `).join('');
    }
}

if (magicSearchInput) {
    magicSearchInput.addEventListener('input', (e) => {
        currentMagicSearchQuery = e.target.value.trim();
        renderMagics();
    });
}

// 魔法職業過濾按鈕事件
const magicFilterBtns = document.querySelectorAll('.magic-filter-btn');
magicFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 更新按鈕樣式
        magicFilterBtns.forEach(b => {
            b.classList.remove('bg-primary-600', 'text-white');
            b.classList.add('bg-gray-800', 'text-gray-300');
        });
        e.target.classList.remove('bg-gray-800', 'text-gray-300');
        e.target.classList.add('bg-primary-600', 'text-white');
        
        // 更新過濾狀態並重新渲染
        currentMagicFilterClass = e.target.getAttribute('data-class');
        renderMagics();
    });
});

document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-magics') {
        if(magicSearchInput) currentMagicSearchQuery = magicSearchInput.value.trim();
        renderMagics();
    }
});
