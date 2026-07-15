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
                "desc": "未來的王者啊，第一步請先前往說話之島拜訪甘特導師。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 帶著王族搜索狀 1 份過去找他。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去古魯丁討伐黑騎士搜索隊有機會(1%)獲得，當然，最快的方式是展現實力擊退血盟敵人，這是王族限定的必掉戰利品。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 他會賜予你紅色斗篷或魔法書(精準目標)二選一，這項修練隨時歡迎你再來挑戰。"
            },
            {
                "lv": 30,
                "name": "君主的威嚴 / 魔法書(呼喚盟友)",
                "desc": "是時候展現君主的威嚴了，再次前往說話之島找甘特導師吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 這次我們需要村民的遺物 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 帶領你的勇氣前往風木沙漠或螞蟻洞窟 1~2 樓，只有王族親自擊敗巨大兵蟻才能確實(100%)找回遺物。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 完成任務可選擇君主的威嚴或魔法書(呼喚盟友)，有需要的話多磨練幾次吧！"
            },
            {
                "lv": 45,
                "name": "守護者的戒指",
                "desc": "想要獲得更強大的守護力量嗎？去威頓村向馬沙請益吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 他需要失去光明的靈魂 1 份來考驗你。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 鼓起勇氣踏入象牙塔 6~8 樓，王族的血統能讓你擊敗鬼魂或紅鬼魂時必定(100%)獲得。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 這枚守護者的戒指將賜予你強韌的生命，這門課也能反覆進修喔。"
            },
            {
                "lv": 45,
                "name": "四本特殊王族魔法書（灼熱武器／勇猛意志／閃亮之盾／王者加護）",
                "desc": "王者必須掌握特殊的力量，去說話之島找拉比安尼導師學習吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 這是一項艱鉅的挑戰，你需要飛龍、高崙、冰之女王、不死鳥的心臟各 1 顆。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 組織你的盟友，去討伐這四個強大的首領吧，這是證明你領導力的絕佳時刻。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 將心臟交給她，你就能選擇並製作一本強大的王族專屬魔法書。"
            },
            {
                "lv": 50,
                "name": "王族 50 級試煉",
                "desc": "終於邁入 50 級的門檻了，快前往象牙塔找迪嘉勒廷進行晉升試煉吧！<br><span class=\"text-xs text-gray-500\">材料準備:</span> 首先，交給他 1 份調職命令書來證明你的決心。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 闖入傲慢之塔 21~30 樓，從那些狡猾的小惡魔手中奪取(1%，王族限定)。別灰心，這考驗著你的毅力。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 通過後你將獲准進入「魔族神殿」。去那裡挑戰炎魔的惡魔，若能帶回炎魔之心，導師會用傳說級的黃金權杖來獎勵你！"
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
                "desc": "新兵注意！第一項任務是去銀騎士村找瑞奇報到。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 帶上黑騎士的誓約、古老的交易文件，還有堅固的龍龜甲，各 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去古魯丁等地找黑騎士要交易文件(1%)，然後去鏡子森林找龍龜拿龜甲(1%)。至於誓約...自己去前線好好摸索吧！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 瑞奇會配發紅騎士頭巾給你，這是你身為騎士的榮耀象徵。"
            },
            {
                "lv": 30,
                "name": "紅騎士之劍 / 盾牌",
                "desc": "想要精良的武器防具？去說話之島請甘特大師幫你打造吧！<br><span class=\"text-xs text-gray-500\">材料準備:</span> 想換劍就帶 1 根夏洛伯之爪，想換盾就準備 1 片蛇女之鱗。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 夏洛伯會掉落爪子(1%)，而去海音一帶對付蛇女就能取得鱗片(1%)。拿出你的鬥志來！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 甘特會根據你帶來的材料，親手為你鑄造紅騎士之劍或盾牌。"
            },
            {
                "lv": 45,
                "name": "勇敢皮帶",
                "desc": "戰士的腰桿要挺直！去威頓村找馬沙領取你的裝備吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 這次的考驗需要夜之視野和古代鑰匙各 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 到奇岩討伐強盜頭目拿夜之視野(10%)，再去歐瑞雪原對付鋼鐵高崙敲出古代鑰匙(1%)。不要畏懼寒冷與強敵！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 馬沙會為你繫上象徵勇氣的勇敢皮帶，好好珍惜它。"
            },
            {
                "lv": 50,
                "name": "騎士 50 級試煉",
                "desc": "恭喜你達到 50 級，去象牙塔找迪嘉勒廷接受真正的試煉吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 試煉分兩階段：先找回丹特斯的召書，接著收集 10 份精靈的私語。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 召書在拉斯塔巴德附近的黑暗妖精將軍身上(1%)；私語則要在精靈墓穴中耐心收集(1%)。這是對你武藝與耐心的雙重考驗。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 試煉完成後你將能踏入「魔族神殿」。若能擊敗炎魔的惡魔奪得炎魔之劍，導師會幫你重鑄為傳說級的黑焰之劍！"
            },
            {
                "lv": "★",
                "name": "屠龍劍（卡瑞）",
                "desc": "聽說過屠龍劍的傳說嗎？這是一場沒有導師指引的終極試煉。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 你必須憑一己之力，同時帶著飛龍的爪子、蜥蜴的角、水晶球與妖魔戰士護身符。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 這四樣物品掉落率極低，分散在世界各地。集齊它們並帶著赴死的覺悟前往龍之谷地監6樓，傳說中的卡瑞才有可能現身考驗你(1%)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 擊敗卡瑞，這把絕世神兵「屠龍劍」就是你實力最好的證明！"
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
                "desc": "森林的孩子啊，前往燃柳村找歐斯接受你的初階試煉吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 收集都達瑪拉、那魯加、甘地、阿吐巴這四本妖魔魔法書交給他。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 在森林周邊懲戒那些妖魔，它們身上有機會(1%)會掉落這些書籍。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 歐斯會用精靈的工藝，為你製作敏捷或體質屬性的精靈頭盔，讓你更適應森林的生活。"
            },
            {
                "lv": 30,
                "name": "精靈水晶 / 精靈T恤",
                "desc": "想要與大自然更親近，就回到妖精森林向迷幻森林之母請示吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 母親需要你找回 1 本受詛咒的精靈書。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 潛入海音的伊娃王國，從希爾黛斯手中淨化並奪回它(1%)，注意水下的安全。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 母親會賜予你召喚屬性精靈的水晶，或是輕盈的精靈T恤作為祝福。"
            },
            {
                "lv": 45,
                "name": "保護者手套 / 精靈水晶",
                "desc": "孩子，去威頓村找馬沙，他那裡有更進階的裝備等著你。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 請為他尋來藍色長笛與古代鑰匙各 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 從墮落的黑暗精靈身上找回長笛(1%)，並從鋼鐵高崙那取得鑰匙(1%)。這是一場考驗你準度的狩獵。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你將獲得保護者手套，或是能召喚更強大屬性精靈的珍貴水晶。"
            },
            {
                "lv": 50,
                "name": "妖精 50 級試煉",
                "desc": "當你足夠強大(50級)，就去象牙塔接受迪嘉勒廷的終極試煉吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 試煉分兩階段：先找出古代黑妖之秘笈，再奪取密封的情報書。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去沙漠從巨大兵蟻那找回秘笈。至於情報書，你得在隱遁者村莊一帶耐心引出隱藏的魔族暗殺團，這需要一點運氣與敏銳的直覺。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 通過後，魔族神殿的大門將為你敞開。若能從炎魔的惡魔手中奪得炎魔之爪，就能向導師換取強大的赤焰武器！"
            },
            {
                "lv": "30",
                "name": "選定屬性魔法",
                "desc": "要與哪種自然元素結下契約呢？去妖精森林找艾利溫導師談談吧。<br><span class=\"text-xs text-gray-500\">修練抉擇:</span> 在火、水、風、地四種屬性中，慎重地選擇你的道路。<br><span class=\"text-xs text-gray-500\">導師叮嚀:</span> 這決定了你未來的戰鬥風格，選定後就無法輕易更改，請務必深思熟慮。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你將正式開啟該專屬屬性的魔法天賦路線。"
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
                "desc": "魔法學徒，你的第一堂實作課在說話之島的詹姆那裡。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 去收集不死生物的素材：食屍鬼的指甲、牙齒，還有一顆骷髏頭。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 用你所學的法術去淨化那些食屍鬼跟骷髏吧，素材取得機率(1%)雖然不高，但正好能鍛鍊你的施法熟練度。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 詹姆會將這些素材轉化為魔法能量之書，幫助你更深入理解魔力。"
            },
            {
                "lv": 30,
                "name": "水晶魔杖（水晶試煉）",
                "desc": "想要擁有一把好魔杖？去象牙塔向塔拉斯導師請教水晶試煉吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 導師需要不死族的鑰匙與骨頭各 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 這次要面對更難纏的龍之谷骷髏大軍。保持距離，善用你的法術優勢！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 塔拉斯會親手為你製作一把水晶魔杖，這將大幅提升你的魔力恢復速度。"
            },
            {
                "lv": 45,
                "name": "瑪那魔杖 / 斗篷（瑪那試煉）",
                "desc": "渴望探究瑪那的奧秘嗎？再次前往象牙塔找塔拉斯導師。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 這次的課題是取得變形怪的血 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去鏡子森林尋找那些善於偽裝的變形怪吧。如果遇到首領(10%)，機率會高很多，但千萬小心！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你可以選擇吸取魔力的瑪那魔杖，或是充滿法力波動的瑪那斗篷。"
            },
            {
                "lv": 50,
                "name": "法師 50 級試煉",
                "desc": "魔法造詣達到 50 級的你，是時候去見見迪嘉勒廷導師了。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 他會指派你一項機密任務：帶回 1 份間諜報告書。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 你得去隱遁者村莊附近，用你的魔力感知並逼出潛藏的魔族暗殺團。這考驗著你對周遭環境的敏銳度。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 完成後你便獲得進入「魔族神殿」的資格。若能帶回炎魔之眼，導師會用它為你打造傳說級的瑪那水晶球！"
            },
            {
                "lv": "★",
                "name": "巴列斯魔杖",
                "desc": "法師們夢寐以求的神器！這是一場追尋遠古魔力的自我試煉。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 你需要親自準備失去魔力的巴列斯魔杖與極其罕見的靈魂之球。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去風木地監挑戰大魔法師的殘影取得魔杖；並在象牙塔高層苦修，直到從鬼魂身上奇蹟般地獲得靈魂之球(0.01%)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 將兩者結合，你就能親手喚醒傳說中的「巴列斯魔杖」，感受那澎湃的魔力吧！"
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
                "desc": "潛伏在暗處的刺客啊，去沉默洞穴找倫得接取你的第一個刺殺任務吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 帶回 1 份死亡誓約來證明你的身手。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 前往奇岩周邊，從那些作惡多端的強盜身上奪取(1%)。動靜要小，下手要快！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 倫得會交給你影子手套，這會讓你的雙手更靈活，更適合暗殺。"
            },
            {
                "lv": 30,
                "name": "影子面具",
                "desc": "想在暗影中更好地隱藏自己？去沉默洞穴找康導師。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 他指定的目標是妖魔長老首級 1 顆。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 那些會施法的妖魔法師就是你的目標(1%)。用你引以為傲的爆發力，在他們詠唱完畢前解決他們！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 康會為你戴上影子面具，讓你在黑暗中更加難以捉摸。"
            },
            {
                "lv": 45,
                "name": "影子長靴",
                "desc": "步伐的輕盈是刺客的生命，去見見沉默洞穴的布魯迪卡吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 這次的狩獵目標是雪怪首級 1 顆。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 踏入冰冷的歐瑞雪原，尋找並擊殺那些皮糙肉厚的雪怪(1%)。這是對你體力與耐力的考驗。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 換取影子長靴後，你的腳步將如同鬼魅般無聲無息。"
            },
            {
                "lv": 50,
                "name": "黑暗妖精 50 級試煉",
                "desc": "晉升 50 級的暗殺者，布魯迪卡有更危險的任務要交給你。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 你必須奪得 1 把混沌鑰匙。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 潛入拉斯塔巴德周邊，從黑暗棲林者手中搶下它(1%)。這是一條充滿危機的道路，小心行事。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 成功後你將解鎖「魔族神殿」。若能從墮落的司祭身上搜刮到墮落鑰匙，就能換取恐怖的傳說武器「死亡之指」！"
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
                "desc": "龍的傳人啊，回到貝希摩斯找普洛凱爾導師，開始你的覺醒之路。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 收集 3 份妖魔搜索文件。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去妖魔森林一帶掃蕩妖魔。記住，只有你親自揮舞武器擊殺，這些文件才會顯現(1%)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 導師會賜予你龍騎士雙手劍，或是記載古老防禦術的龍之護鎧書板。"
            },
            {
                "lv": 30,
                "name": "龍鱗臂甲 / 血之渴望書板",
                "desc": "力量正在湧動！去找普洛凱爾導師接取進階任務吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 這次要攔截 1 份妖魔密使首領間諜書。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 追蹤海音地區的蛇女，用你的鎖鏈劍狠狠地教訓她們(1%)。同樣地，這必須由你親手完成。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你可以選擇堅固的龍鱗臂甲，或是激發戰鬥本能的血之渴望書板。"
            },
            {
                "lv": 45,
                "name": "龍騎士斗篷",
                "desc": "龍的血脈需要嚴寒的淬鍊，再次拜訪普洛凱爾導師。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 帶來 10 顆雪怪之心來證明你的勇悍。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 挺進歐瑞的冰天雪地，大開殺戒吧！你的專屬獵物(10%)正等著你。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 披上這件龍騎士斗篷，讓敵人在你威壓的背影下顫抖。"
            },
            {
                "lv": 50,
                "name": "龍騎士 50 級試煉",
                "desc": "突破 50 級的界限！普洛凱爾導師有項時空任務要交給你。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 收集 100 個時空裂痕碎片來修補裂縫。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 踏入神秘的底比斯領域，清理那裡的魔物就能大量獲得碎片。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 完成後你便解鎖了「魔族神殿」。但你的終極兵器在另一處：去傲慢之塔尋找靈魂之火灰燼，導師會為你鑄造傳說中的「消滅者鎖鏈劍」！"
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
                "desc": "掌握心智的學徒，去希培利亞村莊尋求希蓮恩導師的指引吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 收集污濁安特的水果、樹枝、樹皮各 1 份來研究污染的根源。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 前往眠龍洞穴，用你的幻術幫助那些被污染的安特解脫(100%掉落)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你將獲得施法用的幻術士魔杖，或是能召喚火焰立方的記憶水晶。"
            },
            {
                "lv": 30,
                "name": "幻術士法書 / 記憶水晶(立方：衝擊)",
                "desc": "為了洞察更深層的幻境，再次去拜訪希蓮恩導師。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 導師需要 1 顆艾爾摩將軍之心來做研究。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 前往艾爾摩激戰地，粉碎那些不死將軍的執念吧(必掉)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 帶著戰利品回去，你可以換取幻術士法書，或是掌握衝擊立方的記憶水晶。"
            },
            {
                "lv": 45,
                "name": "幻術士斗篷",
                "desc": "時間與空間的奧秘即將為你揭曉，去見希蓮恩導師吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 請為她帶回 1 顆完成的時間水晶球。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 踏上火龍窟的焦土，在熔岩高崙熾熱的身軀中尋找這顆神奇的水晶(必掉)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 披上導師贈予的幻術士斗篷，你的心智將更加無懈可擊。"
            },
            {
                "lv": 50,
                "name": "幻術士 50 級試煉",
                "desc": "當幻術達到化境(50級)，希蓮恩導師會賦予你穿越時空的任務。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 收集 100 個時空裂痕碎片交給導師。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 進入底比斯的異空間，用你的奇古獸將那裡的魔物一一粉碎來收集碎片。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 任務完成即解鎖「魔族神殿」。但最棒的獎勵在遺忘之島：收集翼龍之血，導師就能為你打造傳說級的「藍寶石奇古獸」！"
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
                "desc": "熱血的戰士啊，去海音找多文導師，開始你的肌肉鍛鍊之旅！<br><span class=\"text-xs text-gray-500\">材料準備:</span> 揮舞你的斧頭，拿回 1 份生命的卷軸。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 找石頭高崙練練拳頭吧！只有真正的戰士能從它們堅硬的身軀中打出這份卷軸(1%)。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你將獲得實用的試煉斧頭，或者學習迅猛雙斧的印記，開啟雙持之路！"
            },
            {
                "lv": 30,
                "name": "戰士團的斗篷 / 戰士的印記(咆哮)",
                "desc": "戰士不僅要有力氣，還要行俠仗義。去找多文導師接任務吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 幫忙找回被偷的戒指與項鍊各 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 去奇岩討伐強盜集團！小囉嘍會掉戒指(1%)，頭目則藏著項鍊(10%)，用你的力量制裁他們！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 導師會頒發戰士團的斗篷給你，或是傳授你震懾敵人的咆哮印記。"
            },
            {
                "lv": 45,
                "name": "戰士團頭盔",
                "desc": "想要更堅固的防具？多文導師那裡有圖紙等著你。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 挑戰巨獸，帶回 1 份獨眼巨人之血。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 奇岩的獨眼巨人是最好的沙包，用你的雙斧讓它見血吧(1%)！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 你將獲得戰士團頭盔，這可是能隨強化提升魔防的極品防具喔！"
            },
            {
                "lv": 50,
                "name": "戰士 50 級試煉",
                "desc": "恭喜成為獨當一面的戰士(50級)，多文導師有最終試煉要給你。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 去收集 5 把神秘魔杖來證明你不畏懼魔法。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 深入龍之谷地監或傲慢之塔，那些思克巴就是你的目標(1%)，用暴力粉碎她們的魔法！<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵與延伸:</span> 通過後即開放「魔族神殿」。戰士不屑炎魔的施捨，只要從墮落司祭那弄到神秘慎重藥水，導師就能為你打造專武「大匠的斧頭」！"
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
                "desc": "想挑戰極限嗎？前往銀騎士村找雷德了解他的復仇計畫吧。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 準備魔法寶石 100 顆，以及黑暗棲林者、馴獸師、精靈使、喚獸師、黑暗法師這五種部下的證明戒指各 1 枚。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 這些戒指全藏在拉斯塔巴德區的敵人身上，掉落率極低(0.1% ~ 0.001%)，這是一場極其漫長且硬核的長期抗戰。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 雷德會為你的毅力折服，並將稀有的召喚控制戒指託付給你。"
            },
            {
                "lv": "All",
                "name": "藍海賊裝備（五件擇一）",
                "desc": "在海賊島村莊，有位名叫希米哲的母親正等著消息。<br><span class=\"text-xs text-gray-500\">材料準備:</span> 幫她找回兒子的信、遺骸，以及肖像畫各 1 份。<br><span class=\"text-xs text-gray-500\">獲取訣竅:</span> 這些遺物散落在海賊島一帶，分別在藍尾蜥蜴(3%)、高等蜥蜴人(3%)以及海賊骷髏首領(2%)的手上，替她討回來吧。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 為了感謝你，她會讓你從藍海賊五件套(頭巾、皮盔甲、手套、長靴、斗篷)中任選一件，只要你願意幫忙，隨時可以再來。"
            },
            {
                "lv": "50+",
                "name": "🗺️ 炎魔謁見所怎麼進（完整流程）",
                "desc": "同學們，想進入炎魔謁見所？跟著老師的筆記一步步來：<br>① 首先，請確保你已完成 50 級職業專屬試煉。<br>② 通過試煉後，你便獲得進入「魔族神殿」的資格。<br>③ 接下來是漫長的修行：在神殿中戰鬥，<b>每擊倒 1 隻魔物，炎魔友好度 +1</b> (這是隱藏的，請自己心裡有個底)。<br>④ 堅持殺滿 <b>1000</b> 隻，你就能解鎖「炎魔謁見所」。<br>⑤ 謁見所裡有 4 位重要人物，提供從血光斗篷到惡魔武器等傳說級裝備的製作，記得帶上對應的戰利品去見他們。<br>⑥ 進階挑戰：向炎魔鐵匠打造「暗影神殿鑰匙」(需 10 個靈魂石碎片與一百萬金幣)。帶著鑰匙且<b>友好度維持在 1000 以上</b>，就能探索更深層的「暗影神殿」！"
            },
            {
                "lv": "60+",
                "name": "魔族神殿（要完成試煉才能進）",
                "desc": "想前往這處險惡之地，<b>必須先向各職業導師證明實力(完成 50 級試煉)</b>。<br><span class=\"text-xs text-gray-500\">狩獵重點:</span> 這裡盤踞著炎魔手下與墮落的司祭，還有頭目「墮落」(Lv68)。打敗他們就有機會獲得強大的墮落套裝。<br><span class=\"text-xs text-primary-400 font-semibold\">導師提示:</span> 記住，<b>你在這裡每斬殺一隻魔物，就能累積 1 點炎魔友好度</b>，這是解鎖更進階區域的關鍵。"
            },
            {
                "lv": "60+",
                "name": "炎魔交付物（騎士／妖精／法師／王族的兌換材料）",
                "desc": "還記得迪嘉勒廷導師的承諾嗎？去魔族神殿找「炎魔的惡魔」(Lv61)較量吧！<br><span class=\"text-xs text-gray-500\">材料獲取:</span> 打敗牠有 3% 的機率掉落<b>專屬於你職業</b>的證明物 (劍、爪、眼、心)。別擔心，你只會打到自己能用的。<br><span class=\"text-xs text-primary-400 font-semibold\">過關獎勵:</span> 只要帶回 1 個證明物，就能向導師兌換一把對應的傳說武器，這項交易永遠有效！"
            },
            {
                "lv": "60+",
                "name": "炎魔謁見所與暗影神殿",
                "desc": "當你的炎魔友好度<b>達到 1000 點</b>，便能獲得覲見炎魔的資格，進入「炎魔謁見所」。<br><span class=\"text-xs text-gray-500\">神殿鐵匠:</span> 備妥 10 個靈魂石碎片與一百萬金幣，請炎魔鐵匠為你打造一把「暗影神殿鑰匙」。<br><span class=\"text-xs text-primary-400 font-semibold\">暗影挑戰:</span> 只要你<b>握有鑰匙(不會損耗)且友好度維持在 1000 以上</b>，就能踏入暗影神殿，挑戰令人畏懼的頭目「死亡」(Lv70)與「混沌」(Lv70)，贏取傳奇裝備！"
            },
            {
                "lv": "All",
                "name": "提卡爾 庫庫爾坎祭壇",
                "desc": "各位同學注意了，想挑戰強大的提卡爾祭壇，必須先做好功課喔！<br><span class=\"text-xs text-gray-500\">事前準備:</span> 想要進去，你得先拿到「提卡爾庫庫爾坎祭壇鑰匙」。<br><span class=\"text-xs text-gray-500\">挑戰步驟:</span> 1. 勇敢地踏入時空裂痕，前往「提卡爾神廟地區深處」。<br>2. 擊敗那裡的泥偶和怪物們，它們身上有機會(2%)掉落鑰匙。<br>3. 拿到鑰匙後，就能從選單正式進入祭壇挑戰頭目了。<br><span class=\"text-xs text-primary-400 font-semibold\">導師的嚴重警告:</span> ⚠️ 這把鑰匙是一次性的！只要你進去過，不論是戰死還是回城，鑰匙都會消耗掉。進去前請務必做好萬全準備！"
            },
            {
                "lv": "50+",
                "name": "職業精通任務",
                "desc": "完成任務後便會開啟「職業精通」之路，讓你能從專屬的四個精通分支中選擇一種「道」。<br><span class=\"text-xs text-gray-500\">接取條件:</span> 角色必須達到 50 級（含）以上。前往「威頓村」，尋找傳奇人物 NPC「漢」來對話並接取任務。<br><span class=\"text-xs text-gray-500\">任務目標:</span> 擊敗首領「飛龍」（所有職業共通目標）。擊敗後將從其殘骸中自動拾取「精通之證」（此道具為唯一性，無法存入倉庫或販售）。<br><span class=\"text-xs text-primary-400 font-semibold\">完成任務:</span> 帶著「精通之證」回到威頓村與「漢」對話繳交道具。<br><span class=\"text-xs text-gray-500\">精通更換機制:</span> 首次選擇免費。後續如果想要更換不同的精通分支，每次需支付固定費用：300 萬金幣 + 10 張王族搜索狀（不會隨次數遞增）。<br><span class=\"text-xs text-red-400 font-semibold\">⚠️ 切換副作用:</span> 切換時可能導致原有精通特權失效，例如：妖精若失去「劍術精通」，會自動卸下手中裝備的騎士專用武器；妖精若失去「精靈精通」，在場的屬性精靈將會自動消散收回；龍騎士若離開「覺醒精通」，系統會自動清除多餘的覺醒增益，只保留一種。"
            },
            {
                "lv": "80+",
                "name": "👑 吉爾塔斯/真‧死亡騎士 冥皇丹特斯",
                "desc": "各位同學，準備好挑戰傳說中的魔神了嗎？跟著導師的筆記一步步來：<br>① <span class=\"text-xs text-primary-400 font-semibold\">準備門票：</span>先去「拉斯塔巴德-格蘭肯神殿.長老室」打 1 本「死亡騎士之書」（1%機率）。<br>② <span class=\"text-xs text-primary-400 font-semibold\">挑戰吉爾塔斯：</span>帶著書去「拉斯塔巴德-長老會議廳」找真.冥皇丹特斯，進入「受詛咒的黑暗妖精聖殿」（每次扣1本「死亡騎士之書」）。<br>③ <span class=\"text-xs text-gray-500 font-semibold\">保留進度訣竅：</span>如果打不贏需要撤退(快速鍵Ctrl+C)，務必帶上「完整的召喚球」！這樣離開時只會扣1顆球，並將吉爾塔斯剩餘血量封印。沒球的話吉爾塔斯會滿血重置。<br>④ <span class=\"text-xs text-gray-500 font-semibold\">「完整的召喚球」製作：</span>去「拉斯塔巴德-長老會議廳」找亞提利歐製作。材料為「召喚球之核」×1與「召喚球碎片」×4。材料可在「受詛咒的黑暗妖精聖殿」的小怪身上打到。<br>⑤ <span class=\"text-xs text-red-400 font-semibold\">隱藏挑戰：</span>成功擊殺吉爾塔斯後必掉「吉爾塔斯的封印」。將它交給長老會議廳的真.冥皇丹特斯，就能進入隱藏BOSS房挑戰「真‧死亡騎士 冥皇丹特斯」！在廳中擊敗冥皇丹特斯後，牠每次復活會再消耗 1 個「吉爾塔斯的封印」；身上沒有時將被逐出，<br>⚠️ <span class=\"text-xs text-red-400 font-semibold\">導師組隊叮嚀：</span>吉爾塔斯是一場極高難度的戰鬥，極度考驗團隊抗性與應變能力，請務必與最可靠的盟友同行！"
            }
        ]
    }
];

const classesGrid = document.getElementById('classes-grid');
const classDetailPanel = document.getElementById('class-detail-panel');
const classDetailContent = document.getElementById('class-detail-content');

// 職業 id → logo 檔名（中文前綴）對應表
const classLogoMap = {
    'royal':    '王族',
    'knight':   '騎士',
    'elf':      '妖精',
    'mage':     '法師',
    'dark':     '黑暗妖精',
    'dragon':   '龍騎士',
    'illusion': '幻術士',
    'warrior':  '戰士'
};

function getClassLogoImg(classId, classIcon, classColor, sizeClass) {
    const prefix = classLogoMap[classId];
    if (!prefix) return `<i class="fa-solid ${classIcon} ${sizeClass} ${classColor}"></i>`;
    const path = `idle-lineage-class/assets/logo/${encodeURIComponent(prefix)}logo.png`;
    return `<img src="${path}" alt="${prefix}" class="w-full h-full object-contain"
        onerror="this.outerHTML='<i class=\\'fa-solid ${classIcon} ${sizeClass} ${classColor}\\'></i>'">`;
}

function renderClasses() {
    if (!classesGrid) return;
    
    classesGrid.innerHTML = classesData.map(c => `
        <div onclick="openClassDetail('${c.id}')" class="glass-panel p-6 rounded-xl border ${c.bg} hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer group">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-900 border border-gray-700 group-hover:scale-110 transition-transform overflow-hidden p-1">
                    ${getClassLogoImg(c.id, c.icon, c.color, 'text-2xl')}
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
            <div class="w-16 h-16 rounded-full flex items-center justify-center bg-gray-900 border border-gray-700 overflow-hidden p-1">
                ${getClassLogoImg(cls.id, cls.icon, cls.color, 'text-3xl')}
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

// 當腳本載入完成時，直接嘗試渲染一次
renderClasses();

// 監聽後續的資料更新事件或切換事件，確保內容始終存在
document.addEventListener('wikiDataLoaded', renderClasses);
document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-classes') {
        const grid = document.getElementById('classes-grid');
        if (grid && grid.innerHTML.trim() === '') {
            renderClasses();
        }
    }
});
