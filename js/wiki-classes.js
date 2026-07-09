/**
 * Wiki Classes & Quests Logic
 * 負責職業介紹與任務的渲染
 */

const classesData = [
    {
        "id": "royal",
        "name": "王族 (Royal)",
        "icon": "fa-crown",
        "color": "text-yellow-400",
        "bg": "bg-yellow-900/20 border-yellow-700/50",
        "desc": "擁有高貴血統的領導者，唯一能夠建立血盟、帶領夥伴攻城掠地的職業。",
        "features": [
            "血盟創立",
            "攻城戰核心",
            "魅力影響大",
            "全能輔助"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "紅色斗篷 / 魔法書(精準目標)",
                "desc": "找 甘特 ＠說話之島。<br><span class=\"text-xs text-gray-500\">材料:</span> 王族搜索狀 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 王族搜索狀：黑騎士搜索隊 1%（古魯丁），或擊敗任何血盟敵人 100% 必掉（王族限定）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 紅色斗篷（防禦(AC) -2、魅力 +1）或 魔法書(精準目標)，二選一、可重複"
            },
            {
                "lv": 30,
                "name": "君主的威嚴 / 魔法書(呼喚盟友)",
                "desc": "找 甘特 ＠說話之島。<br><span class=\"text-xs text-gray-500\">材料:</span> 村民的遺物 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 村民的遺物：巨大兵蟻 100%（風木領域：沙漠、螞蟻洞窟 1~2 樓；王族限定）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 君主的威嚴（防禦(AC) -2、全六屬性 +1）或 魔法書(呼喚盟友)，二選一、可重複"
            },
            {
                "lv": 45,
                "name": "守護者的戒指",
                "desc": "找 馬沙 ＠威頓村。<br><span class=\"text-xs text-gray-500\">材料:</span> 失去光明的靈魂 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 失去光明的靈魂：鬼魂／紅鬼魂 100%（歐瑞領域·象牙塔 6~8 樓；王族限定）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 守護者的戒指（HP上限 +30、MP上限 +20），可重複"
            },
            {
                "lv": 45,
                "name": "四本特殊王族魔法書（灼熱武器／勇猛意志／閃亮之盾／王者加護）",
                "desc": "找 拉比安尼 ＠說話之島。<br><span class=\"text-xs text-gray-500\">材料:</span> 飛龍之心、高崙之心、冰之女王之心、不死鳥之心 各 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 四顆心臟分別打對應 BOSS 取得（龍／高崙／冰之女王／不死鳥）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 四選一，製作一本特殊王族魔法書"
            },
            {
                "lv": 50,
                "name": "王族 50 級試煉",
                "desc": "找 迪嘉勒廷 ＠象牙塔（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 第一階段：交付 調職命令書 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 調職命令書：小惡魔 1%（傲慢之塔 21~30 樓；王族限定、不受經典掉率影響）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。在魔族神殿打「炎魔的惡魔」（Lv61）取得「炎魔之心」（3% 掉），每 1 個回來找迪嘉勒廷換傳說「黃金權杖」（王族單手劍、反擊／居合；可重複換）"
            }
        ]
    },
    {
        "id": "knight",
        "name": "騎士 (Knight)",
        "icon": "fa-shield-halved",
        "color": "text-red-400",
        "bg": "bg-red-900/20 border-red-700/50",
        "desc": "以強健體魄與強大近戰能力著稱的戰士，最可靠的前排與物理輸出。",
        "features": [
            "高血量 (HP)",
            "近戰精通",
            "衝擊之暈",
            "防禦特化"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "紅騎士頭巾",
                "desc": "找 瑞奇 ＠銀騎士村。<br><span class=\"text-xs text-gray-500\">材料:</span> 黑騎士的誓約 ×1、古老的交易文件 ×1、龍龜甲 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 交易文件：黑騎士／黑騎士搜索隊 1%（銀騎士地區、說話之島港口、古魯丁）；龍龜甲：龍龜 1%（銀騎士地區、海音·鏡子森林）；黑騎士的誓約來源未明（待確認）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 紅騎士頭巾"
            },
            {
                "lv": 30,
                "name": "紅騎士之劍 / 盾牌",
                "desc": "找 甘特 ＠說話之島。<br><span class=\"text-xs text-gray-500\">材料:</span> 夏洛伯之爪 ×1（換劍）；蛇女之鱗 ×1（換盾），各自分開兌換<br><span class=\"text-xs text-gray-500\">來源:</span> 夏洛伯之爪：夏洛伯（蜘蛛）1%；蛇女之鱗：蛇女 1%（海音領域：海音周邊、鏡子森林、地下通道）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 紅騎士之劍 或 紅騎士盾牌"
            },
            {
                "lv": 45,
                "name": "勇敢皮帶",
                "desc": "找 馬沙 ＠威頓村。<br><span class=\"text-xs text-gray-500\">材料:</span> 夜之視野 ×1、古代鑰匙 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 夜之視野：強盜頭目 10%（奇岩）；古代鑰匙：鋼鐵高崙 1%（皆歐瑞領域：歐瑞雪原、水晶洞穴、國境要塞、象牙塔4/5樓）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 勇敢皮帶"
            },
            {
                "lv": 50,
                "name": "騎士 50 級試煉",
                "desc": "找 迪嘉勒廷 ＠象牙塔（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 兩階段依序交付：①丹特斯的召書 ×1 → ②精靈的私語 ×10<br><span class=\"text-xs text-gray-500\">來源:</span> 丹特斯的召書：黑暗妖精將軍 1%（燃柳村·大洞穴隱遁者村莊／拉斯塔巴德正門／拉斯塔巴德·魔獸訓練場）；精靈的私語：在「燃柳村·精靈墓穴」打任何怪 1% 掉<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。在魔族神殿打「炎魔的惡魔」（Lv61，每次掉 3 個）取得「炎魔之劍」，每 1 個回來找迪嘉勒廷換 1 把傳說武器「黑焰之劍」（可重複換）"
            },
            {
                "lv": "★",
                "name": "屠龍劍（卡瑞）",
                "desc": "找 無 NPC，隱藏 BOSS。<br><span class=\"text-xs text-gray-500\">材料:</span> 同時帶齊四樣任務道具：飛龍的爪子、蜥蜴的角、水晶球、妖魔戰士護身符<br><span class=\"text-xs text-gray-500\">來源:</span> 飛龍的爪子：飛龍 1%（龍之谷）；蜥蜴的角：邪惡蜥蜴 0.01%（風木·沙漠）；水晶球：巫師 0.01%（古魯丁地監6樓）；妖魔戰士護身符：五種妖魔 各 0.01%。集齊四樣後，在「龍之谷地監6樓」有 1% 機率出現卡瑞<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 擊殺卡瑞 100% 掉屠龍劍（並消耗四道具各一）"
            }
        ]
    },
    {
        "id": "elf",
        "name": "妖精 (Elf)",
        "icon": "fa-leaf",
        "color": "text-green-400",
        "bg": "bg-green-900/20 border-green-700/50",
        "desc": "與自然之靈共鳴的森林守護者，擅長遠距離射擊與四系精靈魔法。",
        "features": [
            "弓箭精通",
            "精靈魔法",
            "靈活機動",
            "屬性相剋"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "精靈頭盔",
                "desc": "找 歐斯 ＠燃柳村。<br><span class=\"text-xs text-gray-500\">材料:</span> 四大妖魔魔法書（都達瑪拉／那魯加／甘地／阿吐巴）各 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 對應四種妖魔 各 1%（燃柳村·妖魔森林、妖精森林周邊、妖精森林·眠龍洞穴）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 精靈敏捷頭盔 或 精靈體質頭盔"
            },
            {
                "lv": 30,
                "name": "精靈水晶 / 精靈T恤",
                "desc": "找 迷幻森林之母 ＠妖精森林。<br><span class=\"text-xs text-gray-500\">材料:</span> 受詛咒的精靈書 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 希爾黛斯 1%（海音·伊娃王國）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 精靈水晶(召喚屬性精靈) 或 精靈T恤"
            },
            {
                "lv": 45,
                "name": "保護者手套 / 精靈水晶",
                "desc": "找 馬沙 ＠威頓村。<br><span class=\"text-xs text-gray-500\">材料:</span> 藍色長笛 ×1、古代鑰匙 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 藍色長笛：黑暗精靈 1%（燃柳村·妖魔森林、龍之谷、奇岩、奇岩地監4樓）；古代鑰匙：鋼鐵高崙 1%<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 保護者手套 或 精靈水晶(召喚強力屬性精靈)"
            },
            {
                "lv": 50,
                "name": "妖精 50 級試煉",
                "desc": "找 迪嘉勒廷 ＠象牙塔（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 兩階段依序交付：①古代黑妖之秘笈 ×1 → ②密封的情報書 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 古代黑妖之秘笈：巨大兵蟻 1%（風木領域：沙漠／螞蟻洞窟 1~2 樓）；密封的情報書：在「燃柳村·大洞穴隱遁者村莊地區」打「魔族暗殺團」必掉。魔族暗殺團是特殊怪、不常駐，只有你正卡在這一步（缺密封的情報書）時，在這張圖每打一隻怪才有 1% 機率讓牠出現（一次只會有一隻）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。在魔族神殿打「炎魔的惡魔」（Lv61，每次掉 3 個）取得「炎魔之爪」，每 1 個回來找迪嘉勒廷換 1 把傳說「赤焰之弓」或「赤焰之劍」（可重複換）"
            },
            {
                "lv": "30",
                "name": "選定屬性魔法",
                "desc": "找 艾利溫 ＠妖精森林。<br><span class=\"text-xs text-gray-500\">材料:</span> 四種屬性（火／水／風／地）四選一<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 開啟所選屬性的魔法路線。注意：只能選一種、選了就固定"
            }
        ]
    },
    {
        "id": "mage",
        "name": "法師 (Mage)",
        "icon": "fa-wand-magic-sparkles",
        "color": "text-blue-400",
        "bg": "bg-blue-900/20 border-blue-700/50",
        "desc": "掌握元素與神聖魔法的智者，擁有最強大的爆發傷害與治癒能力。",
        "features": [
            "魔法爆發",
            "全體治癒",
            "範圍清怪",
            "召喚術"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "魔法能量之書",
                "desc": "找 詹姆 ＠說話之島。<br><span class=\"text-xs text-gray-500\">材料:</span> 食屍鬼的指甲 ×1、食屍鬼的牙齒 ×1、骷髏頭 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 指甲／牙齒：食屍鬼 各 1%；骷髏頭：骷髏 1%（皆廣布野外/地監）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 魔法能量之書"
            },
            {
                "lv": 30,
                "name": "水晶魔杖（水晶試煉）",
                "desc": "找 塔拉斯 ＠象牙塔。<br><span class=\"text-xs text-gray-500\">材料:</span> 不死族的鑰匙 ×1、不死族的骨頭 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 鑰匙：骷髏 1%；骨頭：骷髏神射手 1%／骷髏警衛 0.1%（龍之谷地監1-5樓、龍之谷）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 水晶魔杖"
            },
            {
                "lv": 45,
                "name": "瑪那魔杖 / 斗篷（瑪那試煉）",
                "desc": "找 塔拉斯 ＠象牙塔。<br><span class=\"text-xs text-gray-500\">材料:</span> 變形怪的血 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 變形怪 1%／變形怪首領 10%（海音·鏡子森林）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 瑪那魔杖 或 瑪那斗篷"
            },
            {
                "lv": 50,
                "name": "法師 50 級試煉",
                "desc": "找 迪嘉勒廷 ＠象牙塔（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 一階段：交付 間諜報告書 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 間諜報告書：在「燃柳村·大洞穴隱遁者村莊地區」打「魔族暗殺團」必掉。魔族暗殺團是特殊怪、不常駐，只有你正卡在這一步（缺間諜報告書）時，在這張圖每打一隻怪才有 1% 機率讓牠出現（一次只會有一隻）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。在魔族神殿打「炎魔的惡魔」（Lv61）取得「炎魔之眼」（3% 掉），每 1 個回來找迪嘉勒廷換傳說盾「瑪那水晶球」（可重複換）"
            },
            {
                "lv": "★",
                "name": "巴列斯魔杖",
                "desc": "找 無 NPC，道具喚醒。<br><span class=\"text-xs text-gray-500\">材料:</span> 失去魔力的巴列斯魔杖 ×1、靈魂之球 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 失去魔力的魔杖：BOSS 巴列斯 100%（風木城地監）；靈魂之球：鬼魂／紅鬼魂 0.01%（歐瑞領域·象牙塔6/7/8樓）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 帶著失魔魔杖使用靈魂之球 → 喚回成「巴列斯魔杖」"
            }
        ]
    },
    {
        "id": "dark",
        "name": "黑暗妖精 (Dark Elf)",
        "icon": "fa-user-ninja",
        "color": "text-purple-400",
        "bg": "bg-purple-900/20 border-purple-700/50",
        "desc": "捨棄自然信仰、轉向黑暗的暗殺者，雙刀與鋼爪的連擊能瞬間撕裂敵人。",
        "features": [
            "極致爆發",
            "雙擊/連擊",
            "迴避特化",
            "黑魔法"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "影子手套",
                "desc": "找 倫得 ＠沉默洞穴。<br><span class=\"text-xs text-gray-500\">材料:</span> 死亡誓約 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 強盜 1%（奇岩）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 影子手套"
            },
            {
                "lv": 30,
                "name": "影子面具",
                "desc": "找 康 ＠沉默洞穴。<br><span class=\"text-xs text-gray-500\">材料:</span> 妖魔長老首級 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 妖魔法師 1%（低階區廣布）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 影子面具"
            },
            {
                "lv": 45,
                "name": "影子長靴",
                "desc": "找 布魯迪卡 ＠沉默洞穴。<br><span class=\"text-xs text-gray-500\">材料:</span> 雪怪首級 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 雪怪 1%（歐瑞、歐瑞雪原、水晶洞穴、國境要塞）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 影子長靴"
            },
            {
                "lv": 50,
                "name": "黑暗妖精 50 級試煉",
                "desc": "找 布魯迪卡 ＠沉默洞穴（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 一階段：交付 混沌鑰匙 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 混沌鑰匙：黑暗棲林者 1%（燃柳村·大洞穴隱遁者村莊／拉斯塔巴德·魔族神殿）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。在魔族神殿打「墮落的司祭」（50% 掉「墮落鑰匙」），每 1 個墮落鑰匙回來找布魯迪卡換 1 把傳說「死亡之指」（可重複換）"
            }
        ]
    },
    {
        "id": "dragon",
        "name": "龍騎士 (Dragon Knight)",
        "icon": "fa-dragon",
        "color": "text-orange-400",
        "bg": "bg-orange-900/20 border-orange-700/50",
        "desc": "繼承龍之血脈的狂戰士，揮舞獨特的鎖鏈劍，透過弱點曝光擊潰對手。",
        "features": [
            "鎖鏈劍",
            "弱點曝光",
            "屠宰者",
            "龍之覺醒"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "龍騎士雙手劍 / 龍之護鎧書板",
                "desc": "找 普洛凱爾 ＠貝希摩斯。<br><span class=\"text-xs text-gray-500\">材料:</span> 妖魔搜索文件 ×3<br><span class=\"text-xs text-gray-500\">來源:</span> 甘地／羅孚／阿吐巴／都達瑪拉妖魔 各 1%（妖精森林周邊、燃柳村·妖魔森林一帶）；龍騎士任務道具只有龍騎士本人擊殺才會掉<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 龍騎士雙手劍 或 龍之護鎧書板"
            },
            {
                "lv": 30,
                "name": "龍鱗臂甲 / 血之渴望書板",
                "desc": "找 普洛凱爾 ＠貝希摩斯。<br><span class=\"text-xs text-gray-500\">材料:</span> 妖魔密使首領間諜書 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 蛇女 1%（海音領域：海音周邊、鏡子森林、地下通道）；只有龍騎士本人擊殺才會掉<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 龍鱗臂甲 或 血之渴望書板"
            },
            {
                "lv": 45,
                "name": "龍騎士斗篷",
                "desc": "找 普洛凱爾 ＠貝希摩斯。<br><span class=\"text-xs text-gray-500\">材料:</span> 雪怪之心 ×10<br><span class=\"text-xs text-gray-500\">來源:</span> 雪怪 10%（歐瑞、歐瑞雪原、水晶洞穴）；只有龍騎士本人擊殺才會掉<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 龍騎士斗篷"
            },
            {
                "lv": 50,
                "name": "龍騎士 50 級試煉",
                "desc": "找 普洛凱爾 ＠貝希摩斯（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 第一階段：交付 時空裂痕碎片 ×100<br><span class=\"text-xs text-gray-500\">來源:</span> 時空裂痕碎片：底比斯系列怪掉落（時空裂痕領域；多為 10%，固定數量）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。之後可重複：每交付 靈魂之火灰燼 ×1（火焰之靈魂 1%，傲慢之塔 41~50 樓）換 1 把傳說「消滅者鎖鏈劍」（可重複換）"
            }
        ]
    },
    {
        "id": "illusion",
        "name": "幻術士 (Illusionist)",
        "icon": "fa-eye",
        "color": "text-indigo-400",
        "bg": "bg-indigo-900/20 border-indigo-700/50",
        "desc": "操縱心智與空間的神秘法師，使用奇古獸造成無視防禦的固定魔法傷害。",
        "features": [
            "奇古獸",
            "心智魔法",
            "輔助增益",
            "幻影術"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "幻術士魔杖 / 記憶水晶(立方：燃燒)",
                "desc": "找 希蓮恩 ＠希培利亞村莊。<br><span class=\"text-xs text-gray-500\">材料:</span> 污濁安特的水果 ×1、污濁安特的樹枝 ×1、污濁安特的樹皮 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 污染的安特 100%（妖精森林·眠龍洞穴 1~3 樓、妖精森林周邊）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 幻術士魔杖 或 記憶水晶(立方：燃燒)"
            },
            {
                "lv": 30,
                "name": "幻術士法書 / 記憶水晶(立方：衝擊)",
                "desc": "找 希蓮恩 ＠希培利亞村莊。<br><span class=\"text-xs text-gray-500\">材料:</span> 艾爾摩將軍之心 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 艾爾摩將軍 100%（歐瑞、歐瑞雪原、艾爾摩激戰地）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 幻術士法書 或 記憶水晶(立方：衝擊)"
            },
            {
                "lv": 45,
                "name": "幻術士斗篷",
                "desc": "找 希蓮恩 ＠希培利亞村莊。<br><span class=\"text-xs text-gray-500\">材料:</span> 完成的時間水晶球 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 熔岩高崙 100%（威頓·火龍窟）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 幻術士斗篷"
            },
            {
                "lv": 50,
                "name": "幻術士 50 級試煉",
                "desc": "找 希蓮恩 ＠希培利亞村莊（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 第一階段：交付 時空裂痕碎片 ×100<br><span class=\"text-xs text-gray-500\">來源:</span> 時空裂痕碎片：底比斯系列怪掉落（時空裂痕領域；多為 10%，固定數量）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。之後可重複：每交付 翼龍之血 ×5（遺忘之島飛龍 5%，在遺忘之島本島）換 1 把傳說武器「藍寶石奇古獸」（可重複換）"
            }
        ]
    },
    {
        "id": "warrior",
        "name": "戰士 (Warrior)",
        "icon": "fa-gavel",
        "color": "text-stone-400",
        "bg": "bg-stone-800/50 border-stone-600",
        "desc": "擁有最強大肉體力量的雙持斧戰士，能在瀕死時爆發出驚人的反擊力。",
        "features": [
            "雙斧流",
            "高血量",
            "泰坦系列",
            "反擊技"
        ],
        "quests": [
            {
                "lv": 15,
                "name": "試煉斧頭 / 戰士的印記(迅猛雙斧)",
                "desc": "找 多文 ＠海音。<br><span class=\"text-xs text-gray-500\">材料:</span> 生命的卷軸 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 生命的卷軸：石頭高崙 1%（戰士限定，非戰士擊殺不掉；石頭高崙廣布奇岩等地）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 試煉斧頭（單手鈍器）或 戰士的印記(迅猛雙斧)，二選一"
            },
            {
                "lv": 30,
                "name": "戰士團的斗篷 / 戰士的印記(咆哮)",
                "desc": "找 多文 ＠海音。<br><span class=\"text-xs text-gray-500\">材料:</span> 被偷的戒指 ×1、被偷的項鍊 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 被偷的戒指：強盜 1%（奇岩）；被偷的項鍊：強盜頭目 10%（奇岩）；皆戰士限定<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 戰士團的斗篷 或 戰士的印記(咆哮)，二選一"
            },
            {
                "lv": 45,
                "name": "戰士團頭盔",
                "desc": "找 多文 ＠海音。<br><span class=\"text-xs text-gray-500\">材料:</span> 獨眼巨人之血 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 獨眼巨人之血：獨眼巨人 1%（奇岩；戰士限定）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 戰士團頭盔（防禦(AC) -2、HP上限 +20、每強化 +1 魔防 +1）"
            },
            {
                "lv": 50,
                "name": "戰士 50 級試煉",
                "desc": "找 多文 ＠海音（需等級 50）。<br><span class=\"text-xs text-gray-500\">材料:</span> 第一階段：交付 神秘魔杖 ×5<br><span class=\"text-xs text-gray-500\">來源:</span> 神秘魔杖：思克巴／思克巴女皇 1%（龍之谷地監 4~6 樓、傲慢之塔 11~20 樓；戰士限定）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵/後續:</span> 完成後開放「魔族神殿」。之後可重複：每交付 神秘慎重藥水 ×1（墮落的司祭 1%，魔族神殿）換 1 把「大匠的斧頭」（單手鈍器，對不死／狼人加成、近距離傷害 +1；可重複換）。戰士不走炎魔交付物"
            }
        ]
    },
    {
        "id": "common",
        "name": "全職業共通與後期任務",
        "icon": "fa-globe",
        "color": "text-cyan-400",
        "bg": "bg-cyan-900/20 border-cyan-700/50",
        "desc": "不分職業皆可進行的特殊與後期任務，包含魔族神殿與暗影神殿等進階內容。",
        "features": [
            "後期內容",
            "魔族神殿",
            "傳說裝備"
        ],
        "quests": [
            {
                "lv": "All",
                "name": "雷德的復仇",
                "desc": "找 雷德 ＠銀騎士村。<br><span class=\"text-xs text-gray-500\">材料:</span> 魔法寶石 ×100，以及五枚部下證明戒指各 ×1（黑暗棲林者／馴獸師／精靈使／喚獸師／黑暗法師戒指）<br><span class=\"text-xs text-gray-500\">來源:</span> 五戒指皆出自拉斯塔巴德區（黑暗棲林者 0.1%、馴獸師 0.05%、精靈使 0.001%、喚獸師 0.01%、黑暗法師 0.01%；機率極低、相當硬核）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 召喚控制戒指"
            },
            {
                "lv": "All",
                "name": "藍海賊裝備（五件擇一）",
                "desc": "找 希米哲 ＠海賊島村莊。<br><span class=\"text-xs text-gray-500\">材料:</span> 兒子的信 ×1、兒子的遺骸 ×1、兒子的肖像畫 ×1<br><span class=\"text-xs text-gray-500\">來源:</span> 信：藍尾蜥蜴 3%；遺骸：高等蜥蜴人 3%；肖像畫：海賊骷髏首領 2%（皆海賊島一帶）<br><span class=\"text-xs text-primary-400 font-semibold\">獎勵:</span> 藍海賊頭巾／皮盔甲／手套／長靴／斗篷，五選一・無兌換次數限制（其中藍海賊斗篷也可直接打高等蜥蜴人 0.8% 掉）"
            },
            {
                "lv": "50+",
                "name": "🗺️ 炎魔謁見所怎麼進（完整流程）",
                "desc": "① 等級 50：找你職業的試煉 NPC 接「50 級試煉」（各職業的 NPC／交付材料見上方 50 級試煉卡）。<br>② 完成試煉 → 開放「魔族神殿」（地圖選單的「拉斯塔巴德」分類）。<br>③ 在魔族神殿掛機：<b>每殺 1 隻怪，炎魔友好度 +1</b>（隱藏數值，介面看不到）。<br>④ 友好度累積到 <b>1000</b>（＝在魔族神殿殺滿 1000 隻）→ 開放城鎮「炎魔謁見所」（同在「拉斯塔巴德」分類）。<br>⑤ 謁見所內 4 個 NPC：炎魔之影（墮落鐮刀＋墮落首級 → 炎魔的血光斗篷）／小惡魔（惡魔腳鐐＋墮落素材 → 惡魔系列武器）／炎魔鐵匠（金屬板鍛造、暗影神殿鑰匙）／炎魔的輔佐官（靈魂石碎片 → 耳環逐階精煉）。<br>⑥ 延伸：向炎魔鐵匠做「暗影神殿鑰匙」（靈魂石碎片 ×10＋100 萬金幣；碎片就在魔族神殿打墮落的司祭 1%／頭目墮落 5%），<b>持鑰匙（不消耗）＋友好度 ≥1000</b> 即可進「暗影神殿」。"
            },
            {
                "lv": "60+",
                "name": "魔族神殿（要完成試煉才能進）",
                "desc": "進入條件：<b>完成你職業的 50 級試煉</b>。怪物有炎魔系列、墮落的司祭，頭目「墮落」（Lv68，不死）；掉墮落系列裝備（斗篷／盔甲／手套／靴）。<b>在這裡每打一隻怪，「炎魔友好度」+1</b>。"
            },
            {
                "lv": "60+",
                "name": "炎魔交付物（騎士／妖精／法師／王族的兌換材料）",
                "desc": "炎魔之劍（騎士）／炎魔之爪（妖精）／炎魔之眼（法師）／炎魔之心（王族）：在魔族神殿打「炎魔的惡魔」（Lv61）取得，<b>你的職業對應的那一種各 3% 機率掉落</b>（別職業的炎魔材料你打不到）。拿回去找迪嘉勒廷，每 1 個換 1 把對應的傳說武器（可重複換）。"
            },
            {
                "lv": "60+",
                "name": "炎魔謁見所與暗影神殿",
                "desc": "炎魔友好度<b>累積到 1000</b>，開放城鎮「炎魔謁見所」，裡面有製作 NPC（炎魔之影／小惡魔／炎魔鐵匠），能做惡魔系列武器、炎魔的血光斗篷與「暗影神殿鑰匙」。<br>暗影神殿鑰匙：在炎魔鐵匠用「靈魂石碎片 ×10 ＋ 100 萬金幣」製作。<br>進「暗影神殿」要兩個條件：<b>持有暗影神殿鑰匙</b>（不會被消耗）＋<b>炎魔友好度 ≥ 1000</b>。裡面頭目「死亡」（Lv70）、「混沌」（Lv70），掉死亡／混沌系列裝備。"
            }
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
