/**
 * Wiki Classes & Quests Logic
 * 負責職業介紹與任務的渲染
 */

const classesData = [
    {
        id: 'royal',
        name: '王族 (Royal)',
        icon: 'fa-crown',
        color: 'text-yellow-400',
        bg: 'bg-yellow-900/20 border-yellow-700/50',
        desc: '擁有高貴血統的領導者，唯一能夠建立血盟、帶領夥伴攻城掠地的職業。',
        features: ['血盟創立', '攻城戰核心', '魅力影響大', '全能輔助'],
        quests: [
            { lv: 15, name: '王族的考驗', desc: '擊敗甘特洞穴的試煉怪物，獲得王族專屬魔法。' },
            { lv: 30, name: '君主的威儀', desc: '收集徽章，證明身為領導者的實力。' },
            { lv: 45, name: '王國的復甦', desc: '挑戰高級首領，獲取高階王族裝備。' }
        ]
    },
    {
        id: 'knight',
        name: '騎士 (Knight)',
        icon: 'fa-shield-halved',
        color: 'text-red-400',
        bg: 'bg-red-900/20 border-red-700/50',
        desc: '以強健體魄與強大近戰能力著稱的戰士，最可靠的前排與物理輸出。',
        features: ['高血量 (HP)', '近戰精通', '衝擊之暈', '防禦特化'],
        quests: [
            { lv: 15, name: '騎士的試煉', desc: '尋找瑞奇，獲得紅騎士之劍。' },
            { lv: 30, name: '勇氣的證明', desc: '前往古魯丁地監深處，帶回不死族的遺骸。' },
            { lv: 45, name: '誓約的守護', desc: '獲取勇氣皮帶，提升負重與作戰能力。' }
        ]
    },
    {
        id: 'elf',
        name: '妖精 (Elf)',
        icon: 'fa-leaf',
        color: 'text-green-400',
        bg: 'bg-green-900/20 border-green-700/50',
        desc: '與自然之靈共鳴的森林守護者，擅長遠距離射擊與四系精靈魔法。',
        features: ['弓箭精通', '精靈魔法', '靈活機動', '屬性相剋'],
        quests: [
            { lv: 15, name: '妖精的初試', desc: '於妖精森林收集材料，製作專屬防具。' },
            { lv: 30, name: '精靈的呼喚', desc: '解鎖精靈水晶，選擇專精的元素屬性。' },
            { lv: 45, name: '森林的守護者', desc: '擊退入侵者，獲得強大的精靈弓。' }
        ]
    },
    {
        id: 'mage',
        name: '法師 (Mage)',
        icon: 'fa-wand-magic-sparkles',
        color: 'text-blue-400',
        bg: 'bg-blue-900/20 border-blue-700/50',
        desc: '掌握元素與神聖魔法的智者，擁有最強大的爆發傷害與治癒能力。',
        features: ['魔法爆發', '全體治癒', '範圍清怪', '召喚術'],
        quests: [
            { lv: 15, name: '法師的基礎', desc: '學習初階魔法，獲得瑪那魔杖。' },
            { lv: 30, name: '魔力的覺醒', desc: '收集魔法寶石，解鎖高階法術。' },
            { lv: 45, name: '大魔導師之路', desc: '挑戰強大的惡魔，獲取瑪那斗篷。' }
        ]
    },
    {
        id: 'dark',
        name: '黑暗妖精 (Dark Elf)',
        icon: 'fa-user-ninja',
        color: 'text-purple-400',
        bg: 'bg-purple-900/20 border-purple-700/50',
        desc: '捨棄自然信仰、轉向黑暗的暗殺者，雙刀與鋼爪的連擊能瞬間撕裂敵人。',
        features: ['極致爆發', '雙擊/連擊', '迴避特化', '黑魔法'],
        quests: [
            { lv: 15, name: '沉默的暗殺', desc: '於沉默洞穴完成暗殺訓練。' },
            { lv: 30, name: '影子的試煉', desc: '獲得影子防具，提升隱蔽能力。' },
            { lv: 45, name: '復仇的刀刃', desc: '鑄造強大的幽暗雙刀。' }
        ]
    },
    {
        id: 'dragon',
        name: '龍騎士 (Dragon Knight)',
        icon: 'fa-dragon',
        color: 'text-orange-400',
        bg: 'bg-orange-900/20 border-orange-700/50',
        desc: '繼承龍之血脈的狂戰士，揮舞獨特的鎖鏈劍，透過弱點曝光擊潰對手。',
        features: ['鎖鏈劍', '弱點曝光', '屠宰者', '龍之覺醒'],
        quests: [
            { lv: 15, name: '龍血的覺醒', desc: '喚醒體內的龍之力量。' },
            { lv: 30, name: '鎖鏈的技藝', desc: '掌握鎖鏈劍的連擊技巧。' },
            { lv: 45, name: '龍之繼承者', desc: '獲取專屬龍鱗防具。' }
        ]
    },
    {
        id: 'illusion',
        name: '幻術士 (Illusionist)',
        icon: 'fa-eye',
        color: 'text-indigo-400',
        bg: 'bg-indigo-900/20 border-indigo-700/50',
        desc: '操縱心智與空間的神秘法師，使用奇古獸造成無視防禦的固定魔法傷害。',
        features: ['奇古獸', '心智魔法', '輔助增益', '幻影術'],
        quests: [
            { lv: 15, name: '時空的裂痕', desc: '修復時空裂痕，獲得幻術士基礎法書。' },
            { lv: 30, name: '心智的操控', desc: '學習強大的心智控制魔法。' },
            { lv: 45, name: '幻影的大師', desc: '獲得高階奇古獸。' }
        ]
    },
    {
        id: 'warrior',
        name: '戰士 (Warrior)',
        icon: 'fa-gavel',
        color: 'text-stone-400',
        bg: 'bg-stone-800/50 border-stone-600',
        desc: '擁有最強大肉體力量的雙持斧戰士，能在瀕死時爆發出驚人的反擊力。',
        features: ['雙斧流', '高血量', '泰坦系列', '反擊技'],
        quests: [
            { lv: 15, name: '戰士的咆哮', desc: '證明你的力量，獲得戰士基礎雙斧。' },
            { lv: 30, name: '狂暴的血液', desc: '解鎖戰士特有被動技能。' },
            { lv: 45, name: '泰坦的傳承', desc: '獲得戰士團高階防具。' }
        ]
    }
];

const classesGrid = document.getElementById('classes-grid');
const classDetailPanel = document.getElementById('class-detail-panel');
const classDetailContent = document.getElementById('class-detail-content');

function renderClasses() {
    if (!classesGrid) return;
    
    classesGrid.innerHTML = classesData.map(c => `
        <div onclick="openClassDetail('${c.id}')" class="glass-panel p-6 rounded-xl border ${c.bg} hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer group">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-900 border border-gray-700 group-hover:scale-110 transition-transform">
                    <i class="fa-solid ${c.icon} text-2xl ${c.color}"></i>
                </div>
                <h3 class="text-xl font-bold text-white tracking-wide">${c.name}</h3>
            </div>
            <p class="text-sm text-gray-400 mb-4 h-16 overflow-hidden">${c.desc}</p>
            <div class="flex flex-wrap gap-2">
                ${c.features.map(f => `<span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">${f}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

window.openClassDetail = function(classId) {
    const cls = classesData.find(c => c.id === classId);
    if (!cls) return;

    classDetailContent.innerHTML = `
        <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
            <div class="w-16 h-16 rounded-full flex items-center justify-center bg-gray-900 border border-gray-700">
                <i class="fa-solid ${cls.icon} text-3xl ${cls.color}"></i>
            </div>
            <div>
                <h2 class="text-3xl font-bold text-white mb-1">${cls.name}</h2>
                <p class="text-sm text-gray-400">職業詳情與試煉任務</p>
            </div>
        </div>
        
        <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-200 mb-3 border-l-4 border-primary-500 pl-3">職業特色</h3>
            <p class="text-gray-400 leading-relaxed mb-4">${cls.desc}</p>
            <div class="flex flex-wrap gap-2">
                ${cls.features.map(f => `<span class="text-sm ${cls.bg} ${cls.color} px-3 py-1.5 rounded-full border">${f}</span>`).join('')}
            </div>
        </div>
        
        <div>
            <h3 class="text-lg font-semibold text-gray-200 mb-4 border-l-4 border-gold-500 pl-3">專屬試煉任務</h3>
            <div class="space-y-4">
                ${cls.quests.map(q => `
                    <div class="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex flex-col items-center justify-center border border-gray-700">
                            <span class="text-[10px] text-gray-500 uppercase">Level</span>
                            <span class="text-lg font-bold text-white leading-none">${q.lv}</span>
                        </div>
                        <div>
                            <h4 class="text-md font-bold text-gray-200 mb-1">${q.name}</h4>
                            <p class="text-sm text-gray-400">${q.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 平滑滾動到面板
    classDetailPanel.classList.remove('hidden');
    setTimeout(() => {
        classDetailPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
}

window.closeClassDetail = function() {
    classDetailPanel.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    renderClasses();
});
