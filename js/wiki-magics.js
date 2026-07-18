/**
 * Wiki Magics Logic
 * 負責魔法圖鑑的解析與渲染
 */

// 將 DB.skills 轉換為陣列
function buildMagicData() {
    if (typeof DB === 'undefined' || !DB.skills) return [];
    
    return Object.entries(DB.skills).map(([key, value]) => {
        // 針對一般魔法（具備法師學習條件）自動補足王族的學習等級需求
        let reqRoy = value.reqRoy;
        if (reqRoy === undefined && value.reqM !== undefined) {
            if (value.tier === 1) reqRoy = 10;
            else if (value.tier === 2) reqRoy = 20;
        }

        return {
            id: key,
            name: value.n || key,
            type: value.type || 'unknown',
            tier: value.tier || 1,
            mp: value.mp || 0,
            hp: value.hp || 0,
            req: {
                mage: value.reqM,
                elf: value.reqE,
                knight: value.reqK,
                royal: reqRoy,
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

// =========================================
// 從遊戲主程式中提取的技能提示生成邏輯
// =========================================
const SK_TYPE = { atk:'攻擊', heal:'治癒', buff:'增益', manual:'手動', convert:'轉換', summon:'召喚' };
const SK_ELE = { fire:'火', water:'水', earth:'地', wind:'風', none:'無' };
const SK_STAT2 = { ac:'AC', mr:'魔防', dr:'傷害減免', er:'迴避', str:'力量', dex:'敏捷', con:'體質', int:'智力', wis:'精神', cha:'魅力', extraDmg:'額外傷害', extraHit:'額外命中', magicDmg:'魔法傷害', extraMp:'額外MP', mpR:'MP恢復', hpR:'HP恢復', meleeHit:'近距命中', rangedHit:'遠距命中', meleeDmg:'近距傷害', rangedDmg:'遠距傷害', resFire:'火屬性抗性', resWater:'水屬性抗性', resEarth:'地屬性抗性', resWind:'風屬性抗性' };
const SK_MEFF = { teleport:'瞬間移動', sense:'能量感測', recall:'回村', charm:'迷魅', barrier:'隔絕無敵（無法攻擊/施法/用道具・不受任何傷害・不自然恢復）' };
const STATUS_NAME = { freeze:'冰凍', stun:'暈眩', stone:'石化', sleep:'沉睡', poison:'中毒', blind:'目盲', weaken:'弱化', disease:'疾病', vacuum:'真空', broken:'損壞', slow:'緩速', mrhalf:'魔抗減半', magicseal:'魔法封印', armorbreak:'破甲', fragile:'脆弱', confuse:'混亂', panic:'恐慌', guardbreak:'護衛毀滅', terror:'恐懼', doom:'死神', muddywater:'污濁' };

function sgn(val){ return val>=0 ? '+'+val : val; }

function buildSkillTipHTML(sid){
    if(typeof DB === 'undefined' || !DB.skills) return '';
    let sk = DB.skills[sid]; if(!sk) return '';
    let tc = sk.type==='atk'?'text-cyan-300':(sk.type==='heal'?'text-green-300':(sk.type==='manual'?'text-amber-300':'text-purple-300'));
    let parts = [];
    // parts.push(`<div class="font-bold text-base ${tc}" style="margin-bottom:2px;">${sk.n}</div>`);
    // parts.push(`<div class="text-slate-400" style="font-size:11px;margin-bottom:4px;">${SK_TYPE[sk.type]||'技能'}${sk.tier?(' ・ 第'+sk.tier+'階'):''}</div>`);
    let meta = [];
    // let needLv = (typeof skillReqLv==='function') ? skillReqLv(sk, sid) : undefined;
    // if(needLv !== undefined) meta.push('需求 Lv.'+needLv);
    { let _costs = []; if(sk.hpCost) _costs.push('HP '+sk.hpCost); if(sk.mp) _costs.push('MP '+sk.mp); if(sk.costItem){ let _ci = DB.items[sk.costItem.id]; _costs.push((_ci ? _ci.n : '材料')+'×'+(sk.costItem.qty||1)); }  }
    if(sk.dur) meta.push('持續 '+sk.dur+' 秒');
    if(sk.cd) meta.push('冷卻 '+(sk.cd/10)+' 秒');
    if(meta.length) parts.push(`<div class="text-slate-300">${meta.join(' ・ ')}</div>`);
    let eff = [];
    if(sk.dmgDice) eff.push((sk.target==='all'?'範圍':'')+'傷害 '+sk.dmgDice[0]+'d'+sk.dmgDice[1]+(sk.ele&&sk.ele!=='none'?'（'+SK_ELE[sk.ele]+'屬）':''));
    if(sk.multiDmg) eff.push('多段傷害 '+sk.multiDmg.map(function(x){return x[0]+'d'+x[1];}).join('＋')+(sk.ele&&sk.ele!=='none'?'（'+SK_ELE[sk.ele]+'屬）':''));
    if(sk.fullRestore) eff.push('單體治療：立即恢復全部已損失HP');
    else if(sk.classicHeal) { let ch=sk.classicHeal; eff.push((sk.groupHeal?'全隊':'單體')+'治療 ('+ch.baseDice+'＋INT治癒加成)d'+ch.sides+' ×2'+(ch.mult&&ch.mult!==1?(' ×'+ch.mult):'')); }
    else if(sk.healBase || sk.healDice) eff.push('治療 '+(sk.healBase||0)+(sk.healDice?('＋'+sk.healDice[0]+'d'+sk.healDice[1]):''));
    if(sk.healCooldownTicks) eff.push('冷卻 '+(sk.healCooldownTicks/10)+' 秒');
    if(sk.justiceHeal) eff.push('受施法者性向影響：正義值越高恢復量越高（滿正義 +20%・中立/邪惡無提升）');
    if(sk.reqJustice) eff.push('限正義性向施放（性向值 ≥ 1000）');
    if(sk.lifesteal) eff.push('吸取生命');
    if(sk.instakill) eff.push('即死（不死系）');
    if(sk.reqWpn==='w2h') eff.push('限雙手武器（非弓）');
    else if(sk.reqWpn==='bow') eff.push('限弓');
    if(sk.skillAddDmg) eff.push('一般攻擊傷害＋'+sk.skillAddDmg);
    if(sk.stun) eff.push('命中時'+(sk.stunChance!=null?(Math.round(sk.stunChance*100)+'% 機率'):'')+'暈眩');
    if(sk.status) eff.push('附加：'+(typeof STATUS_NAME !== 'undefined' ? (STATUS_NAME[sk.status.kind]||sk.status.kind) : sk.status.kind));
    if(sk.summon) eff.push('召喚協力單位');
    if(sk.mEff) eff.push(SK_MEFF[sk.mEff]||'特殊效果');
    if(sk.darkPoison) eff.push('一般攻擊命中 50% 機率使目標中毒：每秒該次攻擊 60% 傷害、持續 5 秒、最多 1 層（取較高傷害並刷新；劇毒精通→100%、每秒 200%）');
    if(sk.moveSpeedMult){
        let moveSpeedText = '移動速度+'+Math.round((sk.moveSpeedMult - 1) * 100)+'%（速度×'+sk.moveSpeedMult;
        if(sid === 'sk_holy_dash') moveSpeedText += '，與風之疾走互斥';
        else if(sid === 'sk_elf_winddash') moveSpeedText += '，與神聖疾走互斥，取代精靈餅乾移速';
        else if(sid === 'sk_blood_lust') moveSpeedText += '，與神聖疾走/風之疾走互斥';
        moveSpeedText += '）';
        eff.push(moveSpeedText);
    } else if(sk.moveSpeedReplacesCookie) eff.push('取代精靈餅乾的移動速度提升');
    
    if(sk.atkSpeedMult) eff.push('攻擊速度+'+Math.round((sk.atkSpeedMult - 1) * 100)+'%（速度×'+sk.atkSpeedMult+'）');
    if(sk.castSpeedMult) eff.push('施法速度+'+Math.round((sk.castSpeedMult - 1) * 100)+'%（速度×'+sk.castSpeedMult+'）');
    if(sk.bonus){
        for(let k in sk.bonus){
            if(k==='reg' && sk.bonus.reg) { eff.push('體力恢復量+'+sk.bonus.reg[0]+' / 魔力恢復量+'+sk.bonus.reg[1]); continue; }
            eff.push((SK_STAT2[k]||k)+' +'+sk.bonus[k]);
        }
    }
    if(sk.d && typeof sk.d==='object'){
        let dd = sk.d, s = [], _resK = ['resFire','resWater','resEarth','resWind'];
        if(dd.resFire && dd.resFire===dd.resWater && dd.resFire===dd.resEarth && dd.resFire===dd.resWind){
            s.push('全屬性抗性'+sgn(dd.resFire));
            for(let k in dd){ if(_resK.indexOf(k)===-1) s.push((SK_STAT2[k]||k)+sgn(dd[k])); }
        } else {
            for(let k in dd){ s.push((SK_STAT2[k]||k)+sgn(dd[k])); }
        }
        if(s.length) eff.push(s.join('、'));
    }
    if(sk.desc) eff.push(sk.desc);
    if(sk.d && typeof sk.d === 'string') eff.push(sk.d);
    
    if(eff.length) {
        let ehtml = eff.map(function(e){ return '<div style="padding-left:10px;position:relative;"><span style="position:absolute;left:0;top:0;">・</span>'+e+'</div>'; }).join('');
        parts.push(`<div class="text-rose-300" style="font-size:12px;margin-top:4px;">${ehtml}</div>`);
    }
    if(sk.msg) parts.push(`<div class="text-slate-400" style="font-size:11px;margin-top:4px;">${sk.msg}</div>`);
    return parts.join('');
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
                    <div class="skill-tip-container bg-slate-900/80 p-3 rounded-lg border border-gray-700/50 mb-3 shadow-inner">
                        ${buildSkillTipHTML(m.id)}
                    </div>
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
