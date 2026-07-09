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
                <h4 class="text-lg ${titleClass} flex items-center gap-2">
                    ${isLegend ? '<i class="fa-solid fa-crown text-gold-500 text-sm"></i>' : ''}
                    ${item.n}
                </h4>
                ${item.p ? `<span class="text-xs text-yellow-500 font-mono"><i class="fa-solid fa-coins mr-1"></i>${item.p.toLocaleString()}</span>` : ''}
            </div>
            
            <div class="mb-3">
                ${generateItemBadges(item)}
                ${generateClassIcons(item.req)}
            </div>
            
            <div class="mt-auto pt-3 border-t border-gray-800">
                <p class="text-sm text-gray-400 leading-relaxed text-sm">
                    ${desc}
                </p>
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
                
                drops.push({
                    monster: monsterName,
                    itemId: itemId,
                    itemName: itemName,
                    chance: chance,
                    isLegend: itemData?.legend ? true : false
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
            return `
                <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-gray-200 whitespace-nowrap">${d.monster}</td>
                    <td class="px-6 py-4 ${itemClass}">
                        ${crown}${d.itemName}
                        <div class="text-[10px] text-gray-500 font-mono mt-0.5">${d.itemId}</div>
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
