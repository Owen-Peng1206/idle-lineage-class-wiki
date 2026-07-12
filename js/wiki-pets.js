// js/wiki-pets.js

(function() {
    let currentTierFilter = 'all';

    function initPetsTab() {
        if (typeof PET_BOOK === 'undefined') {
            console.error('PET_BOOK is not loaded. Ensure 22-pets.js is loaded first.');
            return;
        }

        bindSubTabs();
        bindTierFilters();

        renderPetBook();
        renderCaptureAndRaising();
        renderSynergy();

        document.getElementById('pets-grid').classList.remove('hidden');
    }

    function bindSubTabs() {
        const subTabs = document.querySelectorAll('.pet-subtab-btn');
        const views = document.querySelectorAll('.pet-view');

        subTabs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-subtab');
                
                // Update buttons
                subTabs.forEach(b => {
                    b.classList.remove('active', 'bg-gray-800', 'text-emerald-400', 'border-t', 'border-l', 'border-r', 'border-gray-700');
                    b.classList.add('text-gray-400', 'hover:text-gray-200');
                });
                e.currentTarget.classList.remove('text-gray-400', 'hover:text-gray-200');
                e.currentTarget.classList.add('active', 'bg-gray-800', 'text-emerald-400', 'border-t', 'border-l', 'border-r', 'border-gray-700');

                // Update views
                views.forEach(v => {
                    if (v.id === `${target}-view`) {
                        v.classList.remove('hidden');
                    } else {
                        v.classList.add('hidden');
                    }
                });
            });
        });
    }

    function bindTierFilters() {
        const filterBtns = document.querySelectorAll('.pet-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentTierFilter = e.currentTarget.getAttribute('data-tier');
                
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-gray-700', 'text-white');
                    b.classList.add('bg-gray-900', 'text-gray-400', 'border', 'border-gray-700');
                });
                e.currentTarget.classList.remove('bg-gray-900', 'text-gray-400', 'border', 'border-gray-700');
                e.currentTarget.classList.add('active', 'bg-gray-700', 'text-white');

                renderPetBook();
            });
        });
    }

    function getKindLabel(kind) {
        if (kind === 'phys') return '<span class="text-red-400"><i class="fa-solid fa-khanda mr-1"></i>物理型</span>';
        if (kind === 'mag') return '<span class="text-blue-400"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>魔法型</span>';
        if (kind === 'spec') return '<span class="text-purple-400"><i class="fa-solid fa-meteor mr-1"></i>特殊型</span>';
        return '未知';
    }

    function renderPetBook() {
        const grid = document.getElementById('pets-grid');
        let htmlContent = '';

        Object.entries(PET_BOOK).forEach(([name, def]) => {
            if (currentTierFilter !== 'all' && def.tier.toString() !== currentTierFilter) return;

            const isGold = def.tier === 2;
            const borderClass = isGold ? 'border-gold-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : (def.tier === 1 ? 'border-emerald-600/50' : 'border-gray-700');
            const bgClass = isGold ? 'bg-gradient-to-br from-gray-900 to-yellow-900/20' : 'bg-gray-800/80';
            const nameColor = isGold ? 'text-gold-400' : (def.tier === 1 ? 'text-emerald-300' : 'text-gray-200');
            const tierLabel = def.tier === 0 ? '一般型態' : (def.tier === 1 ? '高等型態' : '黃金龍');

            let hpGrowth = def.hpUp ? `${def.hpUp[0]}~${def.hpUp[1]}` : '0';
            let mpGrowth = def.mpUp ? `${def.mpUp[0]}~${def.mpUp[1]}` : '0';
            
            let skillsHtml = '';
            if (def.sk && def.sk.length > 0) {
                let sTags = def.sk.map(s => {
                    let d = s.d ? `(傷害 ${s.d[0]}~${s.d[1]})` : '';
                    let e = s.ele && s.ele !== 'none' ? ` [${s.ele}]` : '';
                    return `<span class="bg-gray-900 text-gray-300 text-[11px] px-2 py-1 rounded border border-gray-700 inline-block mr-1 mb-1">${s.n} ${d}${e}</span>`;
                }).join('');
                skillsHtml = `<div class="mt-2"><div class="text-[11px] text-gray-500 mb-1">自帶技能:</div>${sTags}</div>`;
            }

            let evoHtml = '';
            if (def.evo) {
                evoHtml = `<div class="text-[11px] text-emerald-400/80 mt-2"><i class="fa-solid fa-arrow-turn-up mr-1 transform rotate-90"></i>可進化為 ${def.evo}</div>`;
            }

            htmlContent += `
                <div class="${bgClass} border ${borderClass} rounded-xl p-4 flex flex-col hover:border-emerald-500 transition-colors relative overflow-hidden">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-lg bg-gray-950/80 border border-gray-700/80 flex items-center justify-center overflow-hidden shrink-0">
                                <img src="idle-lineage-class/assets/anim/${encodeURIComponent(name)}/d4/idle_0.png" alt="${name}" loading="lazy" class="w-full h-full object-contain scale-[1.2] cursor-pointer" data-hover-image onerror="this.style.display='none'">
                            </div>
                            <div class="font-bold text-base ${nameColor}">${name}</div>
                        </div>
                        <div class="text-xs px-2 py-1 bg-gray-900/60 rounded text-gray-400 border border-gray-700">魅力 ${def.cha || 6}</div>
                    </div>
                    <div class="text-xs text-gray-400 mb-3 flex gap-2">
                        <span class="bg-gray-900 px-2 py-0.5 rounded">${getKindLabel(def.kind)}</span>
                        <span class="bg-gray-900 px-2 py-0.5 rounded">${tierLabel}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs text-gray-300 bg-gray-900/50 p-2 rounded border border-gray-700/50 mb-2">
                        <div class="flex justify-between"><span class="text-gray-500">起始Lv:</span> <span>${def.lv0 || 1}</span></div>
                        <div class="flex justify-between"><span class="text-red-400/80">基礎HP:</span> <span>${def.hp0 || '-'}</span></div>
                        <div class="flex justify-between"><span class="text-blue-400/80">基礎MP:</span> <span>${def.mp0 || '-'}</span></div>
                        <div class="flex justify-between"><span class="text-red-400/80">HP成長/級:</span> <span>${hpGrowth}</span></div>
                        <div class="flex justify-between"><span class="text-blue-400/80">MP成長/級:</span> <span>${mpGrowth}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">HP自然恢復:</span> <span>${def.hpReg || 0}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">MP自然恢復:</span> <span>${def.mpReg || 0}</span></div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs text-gray-300 bg-gray-900/50 p-2 rounded border border-gray-700/50">
                        <div class="flex justify-between"><span class="text-gray-500">攻擊頻率:</span> <span>${def.apm} 次/分</span></div>
                        ${def.capm > 0 ? `<div class="flex justify-between"><span class="text-purple-400/80">施法頻率:</span> <span>${def.capm} 次/分</span></div>` : '<div></div>'}
                        <div class="flex justify-between"><span class="text-gray-500">硬直時間:</span> <span>${def.stun}秒</span></div>
                    </div>

                    ${skillsHtml}
                    ${evoHtml}
                </div>
            `;
        });
        
        grid.innerHTML = htmlContent;
    }

    function renderCaptureAndRaising() {
        const view = document.getElementById('pet-capture-view').querySelector('.glass-panel');
        view.innerHTML = `
            <div class="mb-6 flex flex-wrap gap-2 text-xs">
                <a href="#section-capture" onclick="event.preventDefault(); document.getElementById('section-capture').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-net-blind mr-1 text-emerald-400"></i>如何捕捉寵物？</a>
                <a href="#section-leveling" onclick="event.preventDefault(); document.getElementById('section-leveling').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-arrow-trend-up mr-1 text-blue-400"></i>寵物育成：經驗與升級</a>
                <a href="#section-evolution" onclick="event.preventDefault(); document.getElementById('section-evolution').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-dna mr-1 text-purple-400"></i>進化系統</a>
                <a href="#section-advanced" onclick="event.preventDefault(); document.getElementById('section-advanced').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-star mr-1 text-orange-400"></i>進階育成心得</a>
            </div>

            <div id="section-capture" class="mb-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-emerald-400 mb-4 flex items-center"><i class="fa-solid fa-net-blind mr-2"></i>如何捕捉寵物？</h3>
                <p class="mb-3">要獲得寵物，需要使用特定的「誘捕」道具。使用道具後，角色會獲得對應的誘捕增益（持續600秒）。在狀態期間擊殺對應的野生動物，即可百分之百將其捕獲，並自動送入「寵物保管處」。</p>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse mt-4 text-xs md:text-sm">
                        <thead>
                            <tr class="bg-gray-800 text-gray-300 border-b border-gray-700">
                                <th class="p-2">誘捕道具</th>
                                <th class="p-2">誘餌掉落來源 (地圖)</th>
                                <th class="p-2">可捕捉對象</th>
                                <th class="p-2">捕捉地點</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800">
                            <tr>
                                <td class="p-2 font-semibold text-pink-300">漂浮之眼肉<br><span class="text-xs text-gray-500 font-normal">(一般誘捕)</span></td>
                                <td class="p-2 text-gray-400">漂浮之眼<br><span class="text-xs text-gray-500">(說話之島、風木、地監)</span></td>
                                <td class="p-2">狼, 牧羊犬, 杜賓狗, 哈士奇, 熊, 貓, 浣熊, 聖伯納犬, 狐狸, 小獵犬, 柯利</td>
                                <td class="p-2 text-gray-400 text-xs">
                                    <b class="text-gray-300">狼/牧羊犬/杜賓狗:</b> 各大村莊周邊、海賊島<br>
                                    <b class="text-gray-300">哈士奇/熊/狐狸:</b> 歐瑞周邊<br>
                                    <b class="text-gray-300">貓:</b> 海音周邊<br>
                                    <b class="text-gray-300">浣熊:</b> 海賊島周邊<br>
                                    <b class="text-gray-300">聖伯納犬:</b> 歐瑞雪原<br>
                                    <b class="text-gray-300">小獵犬/柯利:</b> 古魯丁周邊
                                </td>
                            </tr>
                            <tr>
                                <td class="p-2 font-semibold text-orange-300">胡蘿蔔<br><span class="text-xs text-gray-500 font-normal">(暴走兔誘捕)</span></td>
                                <td class="p-2 text-gray-400">暴走兔 <span class="text-xs text-gray-500">(歐瑞雪原)</span><br>夢幻之島暴走兔</td>
                                <td class="p-2">暴走兔</td>
                                <td class="p-2 text-gray-400 text-xs">歐瑞雪原</td>
                            </tr>
                            <tr>
                                <td class="p-2 font-semibold text-amber-300">虎男誘食<br><span class="text-xs text-gray-500 font-normal">(虎男誘捕)</span></td>
                                <td class="p-2 text-gray-400">馴獸師, 喚獸師<br><span class="text-xs text-gray-500">(隱遁者村莊、魔獸訓練場)</span></td>
                                <td class="p-2">老虎</td>
                                <td class="p-2 text-gray-400 text-xs">海賊島周邊</td>
                            </tr>
                            <tr>
                                <td class="p-2 font-semibold text-lime-300">袋鼠的飼料<br><span class="text-xs text-gray-500 font-normal">(袋鼠誘捕)</span></td>
                                <td class="p-2 text-gray-400">袋鼠 <span class="text-xs text-gray-500">(妖精森林周邊)</span></td>
                                <td class="p-2">袋鼠</td>
                                <td class="p-2 text-gray-400 text-xs">妖精森林周邊</td>
                            </tr>
                            <tr>
                                <td class="p-2 font-semibold text-slate-100">熊貓的飼料<br><span class="text-xs text-gray-500 font-normal">(熊貓誘捕)</span></td>
                                <td class="p-2 text-gray-400">熊貓 <span class="text-xs text-gray-500">(奇岩周邊)</span></td>
                                <td class="p-2">熊貓</td>
                                <td class="p-2 text-gray-400 text-xs">奇岩周邊</td>
                            </tr>
                            <tr>
                                <td class="p-2 font-semibold text-yellow-200">猴子的飼料<br><span class="text-xs text-gray-500 font-normal">(猴子誘捕)</span></td>
                                <td class="p-2 text-gray-400">猴子 <span class="text-xs text-gray-500">(妖魔森林)</span></td>
                                <td class="p-2">猴子</td>
                                <td class="p-2 text-gray-400 text-xs">妖魔森林</td>
                            </tr>
                            <tr>
                                <td class="p-2 font-semibold text-cyan-200">高麗犬誘食<br><span class="text-xs text-gray-500 font-normal">(高麗犬誘捕)</span></td>
                                <td class="p-2 text-gray-400">高麗幼犬 <span class="text-xs text-gray-500">(海賊島周邊)</span></td>
                                <td class="p-2">高麗幼犬</td>
                                <td class="p-2 text-gray-400 text-xs">海賊島周邊</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 p-3 bg-gray-900/50 border border-amber-900/50 rounded-lg text-amber-200 text-xs">
                    <i class="fa-solid fa-egg mr-1"></i> <b>頑皮幼龍蛋：</b> 擊敗地龍/水龍/火龍（<b class="text-white">安塔瑞斯、法利昂、巴拉卡斯</b>）必得。若使用「頑皮幼龍蛋」，將消耗蛋並隨機直接孵化出「淘氣龍」或「頑皮龍」。
                </div>
            </div>

            <div id="section-leveling" class="mb-8 border-t border-gray-800 pt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-blue-400 mb-4 flex items-center"><i class="fa-solid fa-arrow-trend-up mr-2"></i>寵物育成：經驗與升級</h3>
                <ul class="list-disc list-inside space-y-2 ml-2">
                    <li>出戰數量：同時最多可攜帶 <b class="text-white">4隻</b> 寵物出戰，但會受到角色總「魅力 (CHA)」的限制。</li>
                    <li>經驗值：玩家在戰鬥中獲得經驗時，會 <b class="text-white">複製一份同等數量的經驗值</b>，由所有正在出戰且未滿等的寵物均分。</li>
                    <li>升級需求：寵物升級所需的經驗值只有玩家角色的 <b class="text-white">1/10</b>。</li>
                    <li>滿等限制：寵物的等級上限受到玩家當前等級的限制（不得超過玩家等級）。達到上限後，牠們不再吸收經驗，會將經驗讓給其他出戰寵物。</li>
                    <li>復活機制：死亡 5 秒後可使用復活卷軸自動復活；返生術可立即復活；在城鎮安全區會自動免費復活。</li>
                </ul>
            </div>

            <div id="section-evolution" class="border-t border-gray-800 pt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-purple-400 mb-4 flex items-center"><i class="fa-solid fa-dna mr-2"></i>進化系統</h3>
                <p class="mb-3">當「一般型態」的寵物達到 <b class="text-white">Level 30</b> 或以上時，玩家可以向寵物管理員（如 包武）申請進化。進化為兩條路線：</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div class="p-4 bg-gray-900 border border-emerald-700/50 rounded-lg">
                        <div class="font-bold text-emerald-400 mb-2"><i class="fa-solid fa-leaf mr-1"></i>進化果實 -> 高等型態</div>
                        <p class="text-xs text-gray-400 mb-2">保留原本寵物的特色並大幅強化能力、增加技能。進化後等級重置為 1，HP與MP 會減半。高等型態為最終型態。</p>
                        <div class="text-[11px] text-emerald-200/80 bg-gray-950 p-2 rounded border border-emerald-900/50">
                            <b>取得方式：</b>前往「亞丁城鎮」尋找 NPC <b>諾斯</b> 製作。<br>
                            <b>需要材料：</b>光明的鱗片 x100 + 綠寶石 x20 + 金幣 20,000<br>
                            <div class="mt-1 pt-1 border-t border-emerald-900/50 text-gray-400">
                                <b class="text-emerald-400/80">🗡️ 光明的鱗片 掉落來源：</b><br>
                                ‧ <b class="text-gray-300">蛇女</b> <span class="text-emerald-300/70">(約 1%)</span> - 海音周邊 / 鏡子森林 / 伊娃王國地監<br>
                                ‧ <b class="text-gray-300">象牙塔蛇女</b> <span class="text-emerald-300/70">(約 3%)</span> - 象牙塔<br>
                                ‧ <b class="text-gray-300">遺忘之島蛇女</b> <span class="text-emerald-300/70">(約 3%)</span> - 遺忘之島
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-gray-900 border border-gold-600/50 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        <div class="font-bold text-gold-400 mb-2"><i class="fa-solid fa-crown mr-1"></i>勝利果實 -> 黃金龍</div>
                        <p class="text-xs text-gray-400 mb-2">任何一般寵物皆可使用「勝利果實」進化為黃金龍，具有極高的基礎素質與範圍火焰魔法。進化後等級重置為 1，HP/MP減半。同樣為最終型態。</p>
                        <div class="text-[11px] text-yellow-200/80 bg-gray-950 p-2 rounded border border-yellow-900/50">
                            <b>取得方式：</b>前往「亞丁城鎮」尋找 NPC <b>諾斯</b> 製作。<br>
                            <b>需要材料：</b>龍之心 x1 + 高品質紅寶石 x5<br>
                            <div class="mt-1 pt-1 border-t border-yellow-900/50 text-gray-400">
                                <b class="text-yellow-400/80">🗡️ 龍之心 掉落來源：</b><br>
                                ‧ <b class="text-gray-300">幼龍</b> <span class="text-yellow-300/70">(極稀有 0.01%)</span> - 傲慢之塔 41F ~ 50F
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 bg-gray-950 p-4 rounded-lg border border-gray-700/50 text-sm shadow-lg">
                    <h4 class="text-blue-300 font-bold mb-3 border-b border-gray-800 pb-2"><i class="fa-solid fa-code-compare mr-2"></i>【進化抉擇】高等型態 vs 黃金龍</h4>
                    <p class="text-gray-300 mb-4 text-xs leading-relaxed">
                        遊戲設計這兩條並行的進化路線，是為了讓玩家在<b class="text-white">「單體專精極致」</b>與<b class="text-white">「全能群體清圖」</b>之間做出戰略選擇：
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div class="bg-gray-900/40 p-3 rounded border border-emerald-900/30">
                            <div class="font-bold text-emerald-400 mb-2 border-b border-gray-800 pb-1">🌲 高等型態 (專精極致)</div>
                            <ul class="list-disc ml-4 space-y-1 text-gray-400">
                                <li><b class="text-gray-300">保留原本特色：</b> 進化後完全繼承原寵物的戰鬥類型 (近戰/魔法/特殊) 與攻速特性。</li>
                                <li><b class="text-gray-300">單體傷害王者：</b> 因為保留了極端屬性 (例如：高等熊的超高物理倍率與破表命中，或高等頑皮龍的單體魔法連發)，在<b class="text-emerald-300">「單挑 Boss 首領」</b>時，專精的高等寵物輸出絕對碾壓黃金龍。</li>
                                <li><b class="text-white">適合場景：</b> 攻略強大 Boss、針對特定屬性弱點打擊、需要極端肉盾扛線的場合。</li>
                            </ul>
                        </div>
                        <div class="bg-gray-900/40 p-3 rounded border border-yellow-900/30">
                            <div class="font-bold text-yellow-400 mb-2 border-b border-gray-800 pb-1">👑 黃金龍 (全能清怪)</div>
                            <ul class="list-disc ml-4 space-y-1 text-gray-400">
                                <li><b class="text-gray-300">轉換全能模板：</b> 無論原本是什麼寵物，進化後都會強制轉為「特殊型 (Spec)」，擁有高魔抗、極快攻速以及優秀的物理/魔法雙修倍率。</li>
                                <li><b class="text-gray-300">群攻降維打擊：</b> 全遊戲<b class="text-yellow-300">唯一擁有 AoE 範圍魔法</b>的寵物。在<b class="text-yellow-300">「怪物密集的掛機點」</b>，黃金龍一發火焰噴射能抵過高等寵物咬十幾下。</li>
                                <li><b class="text-white">適合場景：</b> 萬金油配置、日常掛機農材料、需要快速清理暴走怪群。</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="section-advanced" class="border-t border-gray-800 pt-8 mt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-orange-400 mb-4 flex items-center"><i class="fa-solid fa-star mr-2"></i>進階育成心得：血量繼承與極品寵物</h3>
                <div class="bg-gray-900/60 p-4 rounded-lg border border-orange-900/50">
                    <p class="text-sm text-gray-300 mb-3">
                        根據寵物的進化演算法，進化後的 <b>最大 HP 會變成進化前的一半</b>。這意味著：<br>
                        <span class="text-white font-bold mt-1 inline-block">1. 晚點進化血更多：</span> 雖然寵物達到 30 級即可進化，但若將第一階段忍耐練到 50 級再進化，因為基底血量高，進化後繼承的血量優勢會非常明顯，能讓你獲得一隻遠比 30 級進化還要耐打的極品寵物。
                    </p>
                    <p class="text-sm text-gray-300 mb-3">
                        <span class="text-white font-bold">2. 天生體質決定未來：</span> 因為後天進化無法改變寵物升級時的「HP成長區間」，即使將「玻璃」屬性的寵物練到 50 級再進化，也只是稍微不容易死，未來升級依然加極少血量。想養出能坦住後期首領的黃金龍或高等寵物，<b>一開始就必須挑選天生高血量成長的品種</b>。
                    </p>
                    
                    <!-- 數據佐證區塊 -->
                    <div class="bg-gray-950/80 p-4 rounded border border-orange-900/40 font-mono text-[11px] md:text-xs text-gray-400 mb-4 shadow-inner">
                        <div class="text-orange-300 font-bold mb-2 border-b border-gray-800 pb-1"><i class="fa-solid fa-calculator mr-1"></i>實際數據推演佐證 (平均值計算)</div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div class="text-white mb-1">【佐證一：進化時機差異】</div>
                                <div>對象：<span class="text-emerald-300">虎男 (起始血40，升級HP+11)</span> 進化 黃金龍</div>
                                <ul class="list-disc ml-4 mt-1 space-y-1">
                                    <li><b>30等進化：</b><br>進化前 HP = 40 + (29*11) = 359<br><span class="text-amber-300">➡ 黃金龍 1等 HP = 359 / 2 = 179</span></li>
                                    <li><b>50等進化：</b><br>進化前 HP = 40 + (49*11) = 579<br><span class="text-amber-300">➡ 黃金龍 1等 HP = 579 / 2 = 289</span></li>
                                </ul>
                                <div class="mt-1 text-gray-300 bg-gray-900 px-2 py-1 rounded">結論：50級才進化的黃金龍，起步血量就硬生生多了 110 點！</div>
                            </div>
                            <div>
                                <div class="text-white mb-1">【佐證二：天生體質差異】</div>
                                <div>條件：雙方皆忍耐至 <b>50級才進化</b>，最終皆練至 <b>黃金龍 50級</b><br>黃金龍升級HP約+10。</div>
                                <ul class="list-disc ml-4 mt-1 space-y-1">
                                    <li><b><span class="text-red-400">由「貓」進化的</span> 黃金龍：</b><br>貓(起始血20，升級+4.5) 50級HP = 240<br>進化1等HP = 120<br><span class="text-amber-300">➡ 最終 50級 HP = 120 + (49*10) = 610</span></li>
                                    <li><b><span class="text-emerald-300">由「虎男」進化的</span> 黃金龍：</b><br>從佐證一已知進化1等HP = 289<br><span class="text-amber-300">➡ 最終 50級 HP = 289 + (49*10) = 779</span></li>
                                </ul>
                                <div class="mt-1 text-gray-300 bg-gray-900 px-2 py-1 rounded">結論：花費同樣心血，虎男基底的黃金龍血量狂勝近 170 點，能有效扛住後期王(如冰魔)的範圍魔法，貓基底則極易被秒殺。</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                        <div class="bg-gray-950 p-3 rounded border border-red-900/50">
                            <div class="text-red-400 font-bold mb-2 border-b border-gray-800 pb-1"><i class="fa-solid fa-heart mr-1"></i>血多俱樂部 (強烈推薦)</div>
                            <p class="text-gray-400 mb-2">每次升級 HP 成長極高 (約 10~15)，後期能成為堅實的肉盾：</p>
                            <div class="text-white flex flex-wrap gap-1">
                                <span class="bg-gray-800 px-2 py-1 rounded">虎男</span>
                                <span class="bg-gray-800 px-2 py-1 rounded border border-amber-700/50 text-amber-300">淘氣龍</span>
                                <span class="bg-gray-800 px-2 py-1 rounded border border-amber-700/50 text-amber-300">頑皮龍</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">熊貓</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">哈士奇</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">熊</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">柯利</span>
                            </div>
                        </div>
                        <div class="bg-gray-950 p-3 rounded border border-blue-900/50">
                            <div class="text-blue-400 font-bold mb-2 border-b border-gray-800 pb-1"><i class="fa-solid fa-heart-crack mr-1"></i>玻璃俱樂部 (需靠裝備與走位)</div>
                            <p class="text-gray-400 mb-2">每次升級 HP 成長偏低 (約 3~8)，即使高達 50 級進化依然偏軟：</p>
                            <div class="text-gray-400 flex flex-wrap gap-1">
                                <span class="bg-gray-800 px-2 py-1 rounded">貓</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">杜賓狗</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">狼</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">狐狸</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">暴走兔</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">浣熊</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">猴子</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">袋鼠</span>
                                <span class="bg-gray-800 px-2 py-1 rounded">牧羊犬...等</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-gradient-to-r from-yellow-900/40 to-yellow-600/20 rounded-lg border border-yellow-600/50 relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 opacity-10 text-6xl"><i class="fa-solid fa-trophy"></i></div>
                        <h4 class="text-yellow-400 font-bold text-base mb-2 flex items-center"><i class="fa-solid fa-crown mr-2 text-yellow-300"></i>版本唯一真神推薦：50 級進化黃金龍 (虎男基底)</h4>
                        <p class="text-sm text-gray-200 mb-3 relative z-10">
                            綜合所有底層機制與數據，遊戲中最強的寵物組合毫無爭議是：<b class="text-white bg-black/50 px-1 rounded">「將『虎男』練到 50 級再餵食勝利果實，進化而成的黃金龍」</b>。
                        </p>
                        <ul class="text-xs text-gray-300 list-disc list-inside space-y-1 relative z-10 ml-1">
                            <li><b class="text-emerald-400">極致坦度：</b> 虎男擁有全遊戲頂尖的 HP 成長，50 級進化能替黃金龍提供極度龐大的基底血庫。</li>
                            <li><b class="text-red-400">唯一群攻：</b> 黃金龍是全遊戲<b class="text-white">唯一擁有「範圍魔法 (AoE) - 火焰噴射」的寵物</b>，中後期面對暴走怪群的清怪效率無可取代。</li>
                            <li><b class="text-blue-400">無弱點屬性：</b> 黃金龍與虎男皆為「特殊型 (Spec)」，擁有極高的魔法抗性 (MR) 與不俗的魔法倍率 (0.65)，能扛也能丟痛火球。</li>
                        </ul>
                        <div class="mt-3 pt-3 border-t border-yellow-700/50 text-xs text-gray-400 relative z-10 flex items-center">
                            <i class="fa-solid fa-medal text-gray-400 mr-2 text-lg"></i>
                            <span><b>備選極致單體推薦：</b> 若不需要範圍清怪，可選擇 <b class="text-gray-200">高等熊</b> (極致物理單體爆發、血厚高命中) 或 <b class="text-gray-200">高等頑皮龍</b> (極致魔法單體爆發、血厚高防禦)。</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSynergy() {
        const view = document.getElementById('pet-synergy-view').querySelector('.glass-panel');
        view.innerHTML = `
            <div class="mb-6 flex flex-wrap gap-2 text-xs">
                <a href="#section-physmag" onclick="event.preventDefault(); document.getElementById('section-physmag').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-scale-balanced mr-1 text-cyan-400"></i>近戰 vs 魔法差異</a>
                <a href="#section-apmhit" onclick="event.preventDefault(); document.getElementById('section-apmhit').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-stopwatch mr-1 text-yellow-400"></i>攻速與命中機制</a>
                <a href="#section-royal" onclick="event.preventDefault(); document.getElementById('section-royal').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-crown mr-1 text-primary-400"></i>王族專精</a>
                <a href="#section-relic" onclick="event.preventDefault(); document.getElementById('section-relic').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-khanda mr-1 text-red-400"></i>專屬遺物裝備</a>
                <a href="#section-class" onclick="event.preventDefault(); document.getElementById('section-class').scrollIntoView({behavior: 'smooth'})" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full border border-gray-700 transition-colors cursor-pointer"><i class="fa-solid fa-people-arrows mr-1 text-emerald-400"></i>職業搭配建議</a>
            </div>

            <div id="section-physmag" class="mb-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-cyan-400 mb-4 flex items-center"><i class="fa-solid fa-scale-balanced mr-2"></i>近戰物理型 (Phys) vs 遠程魔法型 (Mag) 的攻擊力差異</h3>
                <p class="mb-3 text-sm text-gray-300">寵物的「戰鬥類型」直接決定了牠們升級時的數值成長係數。我們可以從遊戲底層引擎的 <code>_PET_G</code> (成長係數表) 中得到確切的倍率差異：</p>
                <div class="bg-gray-950/80 p-4 rounded border border-cyan-900/40 font-mono text-[11px] md:text-xs text-gray-400 mb-4 shadow-inner overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-gray-800 text-gray-300">
                                <th class="pb-2">成長係數 (每升1級)</th>
                                <th class="pb-2 text-red-400">近戰物理型 (Phys)</th>
                                <th class="pb-2 text-blue-400">遠程魔法型 (Mag)</th>
                            </tr>
                        </thead>
                        <tbody class="space-y-1">
                            <tr class="border-b border-gray-900/50">
                                <td class="py-2">基礎物理普攻 (atk0)</td>
                                <td class="py-2 text-red-300 font-bold">3</td>
                                <td class="py-2 text-gray-500">1</td>
                            </tr>
                            <tr class="border-b border-gray-900/50">
                                <td class="py-2">普攻成長倍率 (atkG)</td>
                                <td class="py-2 text-red-300 font-bold">+ 0.52 / 級</td>
                                <td class="py-2 text-gray-500">+ 0.27 / 級</td>
                            </tr>
                            <tr class="border-b border-gray-900/50">
                                <td class="py-2">技能/魔法成長倍率 (skillG)</td>
                                <td class="py-2 text-gray-500">+ 0.55 / 級</td>
                                <td class="py-2 text-blue-300 font-bold">+ 0.85 / 級</td>
                            </tr>
                            <tr class="border-b border-gray-900/50">
                                <td class="py-2">普攻命中率倍率 (hitG)</td>
                                <td class="py-2 text-red-300">+ 0.55 / 級</td>
                                <td class="py-2 text-gray-500">+ 0.42 / 級</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="mt-4 pt-3 border-t border-gray-800 text-gray-300">
                        <div class="text-white mb-1">【50 級數據推演 (未計入階級與攻速乘數)】</div>
                        <ul class="list-disc ml-4 space-y-2">
                            <li><span class="text-red-400">近戰型 50級：</span>普攻基底高達 <b>29</b> (3+50*0.52)，技能基底僅 <b>27.5</b>。<br>➡ <span class="text-gray-400">優勢在於刀刀見骨的物理普攻，咬怪非常痛，且防禦(AC)與減傷(DR)成長極高。</span></li>
                            <li><span class="text-blue-400">魔法型 50級：</span>普攻基底僅 <b>14.5</b> (1+50*0.27)，但魔法技能基底高達 <b>42.5</b> (50*0.85)！<br>➡ <span class="text-gray-400">優勢在於魔法爆發，普攻形同抓癢。魔法防禦(MR)極高，但物理防禦(AC/DR)極其脆弱。</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div id="section-apmhit" class="mb-8 border-t border-gray-800 pt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-yellow-400 mb-4 flex items-center"><i class="fa-solid fa-stopwatch mr-2"></i>攻速 (APM) 與 命中率 (Hit) 的動態平衡機制</h3>
                <p class="mb-3 text-sm text-gray-300">
                    除了物理與魔法的基底差異外，遊戲引擎還透過<b class="text-white">「攻擊速度 (APM)」</b>實作了一套動態平衡機制，確保不同外型的寵物在總輸出上保持公平，卻又各具特色：
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div class="bg-gray-900 p-4 rounded border border-gray-700">
                        <div class="font-bold text-amber-400 mb-2 border-b border-gray-800 pb-1"><i class="fa-solid fa-bolt mr-1"></i>高攻速寵物 (如：虎男、狼)</div>
                        <ul class="list-disc ml-4 space-y-1 text-gray-400">
                            <li><b class="text-gray-300">單下傷害降低：</b> 因為攻擊頻率高，系統會自動給予傷害減損（例如虎男單下傷害僅剩基底的 91%）。</li>
                            <li><b class="text-gray-300">命中率懲罰：</b> 攻速越快，動作越不精準，會受到命中率扣減（Hit -1 ~ -3）。</li>
                            <li><b class="text-white">實戰定位：</b> 適合打防禦低的怪，因為攻擊次數多，可以快速削血；但打高閃避王時容易出現瘋狂 Miss。</li>
                        </ul>
                    </div>
                    <div class="bg-gray-900 p-4 rounded border border-gray-700">
                        <div class="font-bold text-amber-400 mb-2 border-b border-gray-800 pb-1"><i class="fa-solid fa-weight-hanging mr-1"></i>低攻速寵物 (如：熊)</div>
                        <ul class="list-disc ml-4 space-y-1 text-gray-400">
                            <li><b class="text-gray-300">單下傷害爆發：</b> 因為攻擊頻率低，系統會給予傷害增幅（例如熊單下傷害高達基底的 115%）。</li>
                            <li><b class="text-gray-300">命中率獎勵：</b> 攻速慢代表每次攻擊都經過瞄準，會獲得額外命中加成（Hit +1 ~ +3）。</li>
                            <li><b class="text-white">實戰定位：</b> 重砲手。面對高閃避、高防禦的後期怪物，這種「刀刀必中、一擊入魂」的寵物反而能打出穩定的真實傷害。</li>
                        </ul>
                    </div>
                </div>
                <div class="mt-3 bg-gray-950 p-3 border border-blue-900/40 rounded text-xs text-gray-400">
                    <b class="text-blue-400">📝 關於魔法命中：</b> 魔法型寵物（如貓）天生「物理命中」極低（滿等僅約 24，而物理寵高達 33+），因此魔法寵物去「咬」後期怪基本上是 100% Miss 的，牠們完全依賴魔法技能（施法速度 CAPM 同樣有上述的傷害平衡機制）。
                </div>
            </div>

            <div id="section-royal" class="mb-8 border-t border-gray-800 pt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-primary-400 mb-4 flex items-center"><i class="fa-solid fa-crown mr-2"></i>王族的統御力 (皇家寵物專精)</h3>
                <p class="mb-3">王族職業具備特殊的專精天賦，在帶領寵物時具有絕對的優勢：</p>
                <div class="bg-gray-900/60 border border-gray-700 p-4 rounded-lg ml-2 border-l-4 border-l-yellow-500">
                    <div class="font-bold text-yellow-400 mb-1">天賦：皇家統御</div>
                    <ul class="list-disc list-inside text-xs space-y-1">
                        <li>一般職業寵物吃魅力加成係數為 10%，而 <b class="text-white">王族係數為 12%</b>。</li>
                        <li>王族可以為寵物額外提供「魔法傷害加成」，數值等於王族的魅力值。對於<span class="text-blue-400">魔法型</span>寵物效益極大。</li>
                    </ul>
                </div>
            </div>

            <div id="section-relic" class="mb-8 border-t border-gray-800 pt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-red-400 mb-4 flex items-center"><i class="fa-solid fa-khanda mr-2"></i>專屬遺物裝備支援</h3>
                <p class="mb-3">遊戲中有數件遺物級別的裝備，特別針對「喚獸師」與「寵物愛好者」設計，能極大幅度提升寵物的戰鬥力：</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                    <div class="bg-gray-900 p-3 rounded border border-gray-700">
                        <div class="text-yellow-400 font-bold mb-1">喚獸師的訓練鞭 (武器)</div>
                        <div class="text-gray-400">提供召喚物傷害+3、命中+6，且 <b class="text-white">寵物傷害+6、寵物命中+3</b>。</div>
                    </div>
                    <div class="bg-gray-900 p-3 rounded border border-gray-700">
                        <div class="text-yellow-400 font-bold mb-1">食人妖精王的尖刺項圈 (腰帶)</div>
                        <div class="text-gray-400"><b class="text-white">寵物傷害+3、寵物命中+3</b>。</div>
                    </div>
                    <div class="bg-gray-900 p-3 rounded border border-gray-700">
                        <div class="text-yellow-400 font-bold mb-1">海賊的統御之戒 (戒指)</div>
                        <div class="text-gray-400">提供 <b class="text-white">寵物傷害+10</b>、召喚物傷害+10，極端暴力。</div>
                    </div>
                    <div class="bg-gray-900 p-3 rounded border border-gray-700">
                        <div class="text-yellow-400 font-bold mb-1">馴獸師的訓狗棒 (盾牌)</div>
                        <div class="text-gray-400">防禦+5，提供 <b class="text-white">寵物技能傷害 x 1.5倍</b>！對魔法型、特殊型寵物如虎男、浣熊等是核心神裝。</div>
                    </div>
                </div>
            </div>

            <div id="section-class" class="border-t border-gray-800 pt-8 scroll-mt-20">
                <h3 class="text-lg font-bold text-emerald-400 mb-4 flex items-center"><i class="fa-solid fa-people-arrows mr-2"></i>各職業搭配建議</h3>
                <div class="space-y-4">
                    <div class="p-3 bg-gray-900/50 rounded border-l-2 border-yellow-500">
                        <span class="font-bold text-yellow-400">王族 / 法師 (高魅力配置)</span>
                        <p class="text-xs text-gray-400 mt-1">這兩個職業較容易將魅力點高，可攜帶多隻寵物。推薦帶<b class="text-white">「魔法型」</b>寵物（如 高等貓、高等暴走兔）或是<b class="text-white">「黃金龍」</b>，配合「馴獸師的訓狗棒」與高魅力的魔法加成，讓寵物成為主要火力輸出。</p>
                    </div>
                    <div class="p-3 bg-gray-900/50 rounded border-l-2 border-blue-500">
                        <span class="font-bold text-blue-400">騎士 / 戰士 (前排坦克)</span>
                        <p class="text-xs text-gray-400 mt-1">因自身較為耐打但缺乏範圍傷害與控場，建議搭配<b class="text-white">「特殊型 / 魔法型」</b>帶有控場與魔法傷害的寵物（如 高等浣熊 帶緩速/弱化、高等頑皮龍 補火球傷害）。或者帶高攻速的<b class="text-white">「物理型」</b>（如 高等哈士奇、高等狼）補充單體普攻輸出。</p>
                    </div>
                    <div class="p-3 bg-gray-900/50 rounded border-l-2 border-green-500">
                        <span class="font-bold text-green-400">妖精 (遠程輸出)</span>
                        <p class="text-xs text-gray-400 mt-1">妖精通常本身站樁輸出，推薦帶<b class="text-white">「物理型 / 坦型」</b>寵物（如 高等熊、高等哈士奇），讓他們上前擋怪。或者若走純召喚流，直接搭配「黃金龍」群體清怪。</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 當 Core 資料載入完成或切換 Tab 時初始化
    document.addEventListener('tabChanged', (e) => {
        if (e.detail === 'tab-pets') {
            initPetsTab();
        }
    });

})();
