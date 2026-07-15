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

    const WEAPON_TAGS = {
        wpn_katana: ['單手劍','武士刀'], wpn_siruge: ['單手劍','武士刀'], wpn_golden_scepter: ['單手劍','武士刀'],
        wpn_dagger2: ['匕首'], wpn_dagger1: ['匕首'], wpn_11: ['匕首'], wpn_33: ['匕首'],
        wpn_longsword: ['單手劍'], wpn_9: ['單手劍'], wpn_scimitar: ['單手劍'], wpn_26: ['單手劍'],
        wpn_elfsword: ['單手劍'], wpn_27: ['單手劍'], wpn_shortsword: ['單手劍'], wpn_redknight: ['單手劍'],
        wpn_invader: ['單手劍'], wpn_34: ['單手劍'], wpn_35: ['單手劍'],
        wpn_36: ['單手劍'], wpn_rapier: ['單手劍'], wpn_mailbreaker: ['單手劍'], wpn_silversword: ['單手劍'], wpn_37: ['單手劍'],
        wpn_21: ['矛'], wpn_24: ['矛'], wpn_25: ['矛'], wpn_28: ['矛'], wpn_39: ['矛'], wpn_40: ['矛'], wpn_41: ['矛'], wpn_17: ['矛'], wpn_4: ['矛'], wpn_halberd: ['矛'],
        wpn_20: ['單手鈍器'], wpn_10: ['單手鈍器'], wpn_13: ['單手鈍器'], wpn_alien: ['單手鈍器'], wpn_1: ['單手鈍器'], wpn_2: ['單手鈍器'], wpn_ancient_axe: ['單手鈍器'], wpn_warrior_trial_axe: ['單手鈍器'], wpn_master_axe: ['單手鈍器'], wpn_demon_axehead: ['單手鈍器'], wpn_iron_axehead: ['單手鈍器'], wpn_giant_axehead: ['單手鈍器'],
        wpn_2hsword: ['雙手劍'], wpn_dragonslayer: ['雙手劍'], wpn_official_2h: ['雙手劍'],
        wpn_battleaxe: ['雙手鈍器'], wpn_19: ['雙手鈍器'], wpn_23: ['雙手鈍器'], wpn_giantaxe: ['雙手鈍器'], wpn_berserker: ['雙手鈍器'], wpn_silveraxe: ['雙手鈍器'], wpn_taurus_axe: ['雙手鈍器'],
        wpn_claw_bronze:['鋼爪'], wpn_claw_steel:['鋼爪'], wpn_claw_shadow:['鋼爪'], wpn_claw_silver:['鋼爪'], wpn_claw_dark:['鋼爪'], wpn_claw_gloom:['鋼爪'], wpn_claw_damascus:['鋼爪'], wpn_claw_abyss:['鋼爪'],
        wpn_baranka_claw:['鋼爪'], wpn_baranka_steelclaw:['鋼爪'],
        wpn_blood_2hsword:['雙手劍'], wpn_dark_sword:['單手劍'],
        wpn_dk_flameblade:['單手劍'], wpn_kurt_sword:['單手劍'],
        wpn_assassin_mark:['雙刀'],
        wpn_dual_bronze:['雙刀'], wpn_dual_steel:['雙刀'], wpn_dual_silver:['雙刀'], wpn_dual_gloom:['雙刀'], wpn_dual_dark:['雙刀'], wpn_dual_shadow:['雙刀'], wpn_dual_damascus:['雙刀'], wpn_dual_abyss:['雙刀'], wpn_thebes_dual:['雙刀'],
        wpn_manadagger:['匕首'], wpn_crystal_dagger:['匕首'],
        wpn_chaos_thorn:['匕首'], wpn_demonking_dual:['雙刀'], wpn_demonking_2hsword:['雙手劍'],
        wpn_small_katana:['匕首'], wpn_dagger_rasta:['匕首'], wpn_sword_rasta:['單手劍'], wpn_dual_rasta:['雙刀'], wpn_spear_rasta:['矛'],
        wpn_dual_spike:['雙刀'], wpn_official_blade:['單手劍'],
        wpn_emperor_blade:['雙手劍'], wpn_windblade_dagger:['匕首'], wpn_redshadow_dual:['雙刀'], wpn_beastking_claw:['鋼爪'],
        wpn_mithril_dagger:['匕首'], wpn_ori_dagger:['匕首'], wpn_crimson_spear:['矛'], wpn_demon_axe:['雙手鈍器'],
        wpn_frost_spear:['矛'], wpn_thunder_sword:['單手劍'],
        wpn_vengeance:['雙手劍'], wpn_blackflame_sword:['單手劍','武士刀'], wpn_hate_claw:['鋼爪'], wpn_demon_claw:['鋼爪'], wpn_death_finger:['鋼爪'],
        wpn_demon_sword:['單手劍'], wpn_redflame_sword:['單手劍','武士刀'], wpn_demon_dual:['雙刀'],
        wpn_dual_destroy:['雙刀'], wpn_claw_destroy:['鋼爪'],
        wpn_old_sword:['單手劍','武士刀'],
        wpn_ancient_darkelf_sword:['單手劍'],
        wpn_demon_sword_hidden:['單手劍'],
        wpn_demon_claw_hidden:['鋼爪'],
        wpn_pirate_dagger:['匕首'], wpn_glory_sword:['單手劍'], wpn_pirate_shortblade:['單手劍'], wpn_pirate_cutlass:['單手劍'], wpn_abyss_dualblade:['雙刀'],
        wpn_thor_hammer:['單手鈍器'], wpn_osis_hammer:['單手鈍器'], wpn_mapler_punish:['雙手鈍器'], wpn_pagrio_wrath:['單手劍'], wpn_eva_scold:['單手劍'],
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
        wpn_kukulkan_spear:['矛'], relic_eto_whip:['矛'], relic_serpent_fang:['矛'], relic_kaira_fang:['匕首'], relic_mud_idol:['雙手鈍器'], relic_teo_hammer:['單手鈍器'],
        relic_executor_axe:['單手鈍器'], relic_healer_wand:['單手鈍器'], relic_minotaur_flail:['單手鈍器'],
        relic_executor_skewer:['矛'], relic_weathered_obelisk:['雙手鈍器'], relic_shadow_stinger:['匕首'], relic_soulreaper_dual:['雙刀'],
        relic_ghoul_fang:['單手劍'], relic_sparto_shard:['單手劍'], relic_pirate_dual:['雙刀'], relic_lava_fists:['單手鈍器']
    };

    // 分類判定邏輯
    function equipCatKey(id, d) {
        if (!d) return null;
        if (d.type === 'wpn') {
            if (d.isArrow) return null; // wiki 版無 quiver
            if (d.isBow) return /十字弓|弩/.test(d.n || '') ? 'xbow' : 'bow';
            if (d.qigu) return 'qigu';
            if (d.chainsword) return 'chainsword';
            
            const isWandWeapon = !!(d && d.type === 'wpn' && (d.isWand || /魔杖|法杖/.test(d.n || '') || (/杖/.test(d.n || '') && !/權杖/.test(d.n || ''))));
            const WAND_LIGHTARROW_IDS = ['wpn_oakwand', 'wpn_38', 'wpn_witchwand', 'wpn_manawand', 'wpn_crystalwand', 'wpn_baless', 'wpn_wand_rasta', 'wpn_red_crystalwand', 'wpn_laia_wand', 'wpn_icequeen_wand', 'wpn_demon_scythe', 'wpn_darkmage_wand', 'wpn_baphomet_wand', 'wpn_illu_wand', 'wpn_demon_wand_hidden', 'wpn_dark_crystalball', 'wpn_steel_manawand_blue', 'relic_amp_staff', 'relic_elder_thunder', 'relic_cerberus_wand', 'relic_evillizard_eye', 'relic_lightbeam_wand', 'relic_warlock_grimoire'];
            
            if (isWandWeapon) return 'wand';
            if (WAND_LIGHTARROW_IDS.includes(id)) return 'wand';
            
            let tags = WEAPON_TAGS[id] || [];
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
            
            return null;
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

    const MISC_BOOK_EXCLUDED = {
        new_item_bless_wpn: true,
        new_item_bless_arm: true,
        new_item_bless_acc: true
    };

    function miscCatKey(id, d) {
        if (!d) return null;
        if (MISC_BOOK_EXCLUDED[id]) return null;
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

    let OBTAINABLE_MISC = null;
    function buildObtainableMisc() {
        if (OBTAINABLE_MISC) return;
        var S = {};
        function add(id) { if (id && id !== 'gold' && DB.items[id]) S[id] = true; }
        for (var id in DB.items) { var d = DB.items[id]; if (d && (d.gachaWeight || 0) > 0) S[id] = true; }
        function addTable(tbl) {
            if (!tbl || typeof tbl !== 'object') return;
            for (var mob in tbl) { var arr = tbl[mob]; if (!Array.isArray(arr)) continue; arr.forEach(function (e) { add(Array.isArray(e) ? e[0] : e); }); }
        }
        if (typeof MOB_DROPS !== 'undefined') addTable(MOB_DROPS);
        if (typeof DARK_WEAPON_DROPS !== 'undefined') addTable(DARK_WEAPON_DROPS);
        if (typeof DARK_CRYSTAL_DROPS !== 'undefined') addTable(DARK_CRYSTAL_DROPS);
        if (typeof DRAGON_DROPS !== 'undefined') addTable(DRAGON_DROPS);
        if (typeof WARRIOR_DROPS !== 'undefined') addTable(WARRIOR_DROPS);
        if (typeof MEM_DROPS !== 'undefined') addTable(MEM_DROPS);
        try { if (typeof SHOP_LISTS === 'object' && SHOP_LISTS) for (var npc in SHOP_LISTS) { var lst = SHOP_LISTS[npc]; if (Array.isArray(lst)) lst.forEach(add); } } catch (e) {}
        try {
            if (typeof CRAFT_RECIPES === 'object' && CRAFT_RECIPES) for (var cn in CRAFT_RECIPES) {
                var recs = CRAFT_RECIPES[cn]; if (!Array.isArray(recs)) continue;
                recs.forEach(function (r) { if (!r) return; add(r.result); if (Array.isArray(r.req)) r.req.forEach(function (m) { if (m) add(m.id); }); });
            }
        } catch (e) {}
        ['new_item_164', 'new_item_195', 'new_item_165'].forEach(add);
        ['scroll_weapon_b', 'scroll_armor_b', 'new_item_uncurse'].forEach(add);
        OBTAINABLE_MISC = S;
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

        buildObtainableMisc();

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
            } else if (!['wpn', 'arm', 'acc'].includes(d.type)) {
                if (OBTAINABLE_MISC[id]) {
                    let ck = miscCatKey(id, d);
                    if (ck && INDEX.item[ck]) INDEX.item[ck].push({ id, ...d });
                }
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

        html += `<div class="mb-4 p-3 bg-slate-800/80 border border-slate-600 rounded text-sm text-slate-300">
            <span class="text-amber-400 font-bold">💡 說明：</span>
            Wiki 看到的總數不一定和玩家遊戲中的數量完全一致。
            因為遊戲主程式設有「動態補登」機制，只要玩家的存檔 (Save Data) 裡擁有某個道具，就算這個道具目前已經絕版、或沒有任何常規獲得管道（例如舊活動道具、被移除的舊材料），遊戲就會把它「動態加入」到你的收藏圖鑑中，讓總數 +1。
        </div>`;
        
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
                ${c.name} <span class="ml-1 text-[10px] text-slate-400 font-normal opacity-80">(${count})</span>
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

                    let regionName = '未知地區';
                    let rDef = CARD_REGIONS.find(r => r.key === state.currentSubCat);
                    if (rDef) regionName = rDef.name;

                    let sourceHtml = `
                    <div class="text-left">
                        <div class="text-sm font-bold text-white mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                            <img src="${imgUrl}" class="w-6 h-6 object-contain bg-gray-800 rounded border border-gray-600" onerror="${fallbackChain}">
                            ${item.name} <span class="text-xs font-normal text-gray-400">的卡片</span>
                        </div>
                        <div class="mb-2"><div class="text-xs font-semibold text-primary-400 mb-1">🗺️ 出沒地區</div>
                            <span class="px-2 py-0.5 bg-gray-800 rounded text-xs border border-gray-700">${regionName}</span>
                        </div>
                        <div class="text-[11px] text-gray-400 leading-tight">討伐 <span class="text-red-400 font-semibold">${item.name}</span> 有機率掉落其專屬卡片 (普/銀/金卡)。也可至威頓村魔法娃娃商人進行合成。</div>
                    </div>`;

                    html += `<div class="relative bg-slate-800/70 border border-slate-600 rounded-lg p-2 flex flex-col items-center gap-1 w-[136px] group/card hover:bg-slate-700 transition-colors">
                        <img src="${imgUrl}" alt="${item.name}" class="w-16 h-16 object-contain" onerror="${fallbackChain}">
                        <div class="text-center w-full mt-1">
                            <div class="text-sm font-bold text-white truncate" title="${item.name}">${item.name}</div>
                            <div class="text-[11px] text-slate-500">Lv ${item.lv || '?'}</div>
                        </div>
                        <!-- 懸浮視窗 -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/card:block w-[260px] p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-50 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                            ${sourceHtml}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-600"></div>
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

                    let sourceHtml = `
                    <div class="text-left">
                        <div class="text-sm font-bold ${color} mb-2 border-b border-gray-700 pb-1 flex items-center gap-2">
                            <img src="${imgUrl}" class="w-6 h-6 object-contain bg-gray-800 rounded border border-gray-600" onerror="this.onerror=null;this.src='https://placehold.co/64x64/1e293b/334155?text=%3F';">
                            ${item.n}
                        </div>
                        ${item.relicRole ? `<div class="text-[11px] text-sky-300 font-bold mb-1.5 leading-tight bg-sky-900/20 border-l-2 border-sky-700 pl-1.5 py-0.5"><i class="fa-solid fa-crosshairs mr-1"></i>${item.relicRole}</div>` : ''}
                        ${item.d ? `<div class="text-[11px] text-gray-400 mb-2 leading-tight">${item.d}</div>` : ''}
                        ${getItemSourceHtml(item.id)}
                    </div>`;

                    html += `<div class="relative bg-slate-800/70 border ${state.currentType === 'relic' ? 'border-sky-700/70' : 'border-slate-600'} rounded-lg p-2 flex flex-col items-center gap-1 w-[112px] group/card hover:bg-slate-700 transition-colors">
                        ${badge}
                        <img src="${imgUrl}" alt="${item.n}" class="w-14 h-14 object-contain" onerror="this.onerror=null;this.src='https://placehold.co/56x56/1e293b/334155?text=%3F';">
                        <div class="text-center w-full">
                            <div class="text-xs font-bold ${color} truncate" title="${item.n}">${item.n}</div>
                        </div>
                        <!-- 懸浮視窗 -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/card:block w-[280px] p-3 bg-gray-900/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-2xl z-[100] pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                            ${sourceHtml}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-600"></div>
                        </div>
                    </div>`;
                }
            });
        }
        
        html += `</div>`;
        grid.innerHTML = html;
        document.getElementById('collections-empty-state').classList.add('hidden');
    }

    const NPC_MAP = {
        'npc_boni': '波尼 (雜貨)', 'npc_linda': '琳達 (魔法)', 'npc_bayes': '巴耶斯 (魔法)',
        'npc_gilen': '吉倫 (魔法)', 'npc_vangil': '凡吉爾 (防具)', 'npc_evert': '愛沃特 (武器)',
        'npc_wino': '威諾 (武器)', 'npc_skvati': '絲克巴蒂 (裝備)', 'npc_saedia': '賽迪亞 (水晶)',
        'npc_sphere': '史菲爾 (水晶)', 'npc_sempal': '森帕爾 (書板)', 'default': '一般村莊商店',
        'pandora': '潘朵拉', 'silver_knight': '鐵匠 (銀騎士村)', 'gludin': '鐵匠 (古魯丁)', 
        'giran': '迪歐 (奇岩)', 'oren': '鐵匠 (歐瑞)', 'heine': '鐵匠 (海音)',
        'werner': '威爾納 (威頓)', 'aden': '鐵匠 (亞丁)', 'witon': '魔法娃娃商人 (威頓)',
        'npc_sebas': '賽巴斯 (奇岩)', 'npc_kororanz': '可羅蘭斯 (沉默洞穴)', 'npc_moli': '莫麗雅 (象牙塔)',
        'npc_brabo': '布拉伯 (燃柳)'
    };

    function getTranslateName(key) {
        if (NPC_MAP[key]) return NPC_MAP[key];
        
        // 嘗試從遊戲資料庫中的城鎮 NPC 清單尋找
        if (typeof DB !== 'undefined' && DB.towns) {
            for (let t in DB.towns) {
                let town = DB.towns[t];
                if (town.npcs) {
                    let npc = town.npcs.find(x => x.id === key);
                    if (npc) return `${npc.n} (${town.n})`;
                }
            }
        }
        
        return key.replace('npc_', '');
    }

    function getItemSourceHtml(itemId) {
        let sources = [];
        // Drops
        if (wikiData && wikiData.drops) {
            const drops = wikiData.drops.filter(d => d.itemId === itemId);
            if (drops.length > 0) {
                sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-primary-400 mb-1">⚔️ 怪物掉落</div><div class="flex flex-wrap gap-1">` + 
                    drops.slice(0, 10).map(d => {
                        let chanceText = d.isSpecial ? `<span class="text-amber-400 font-bold">${d.isSpecial}</span> (${d.chance}%)` : `${d.chance}%`;
                        return `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${d.monster} <span class="text-gray-500">(${chanceText})</span></span>`;
                    }).join('') +
                    (drops.length > 10 ? `<span class="px-1.5 py-0.5 text-[10px] text-gray-500">...等 ${drops.length} 隻</span>` : '') +
                    `</div></div>`);
            }
        }
        
        // Craft
        if (typeof CRAFT_RECIPES !== 'undefined') {
            const crafts = [];
            for (let cn in CRAFT_RECIPES) {
                let recs = CRAFT_RECIPES[cn];
                if (!Array.isArray(recs)) continue;
                recs.forEach(r => { if (r && r.result === itemId) crafts.push(getTranslateName(cn)); });
            }
            if (crafts.length > 0) {
                const uniqueCrafts = [...new Set(crafts)];
                sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-amber-400 mb-1">🔨 製作來源</div><div class="flex flex-wrap gap-1">` +
                    uniqueCrafts.map(c => `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${c}</span>`).join('') +
                    `</div></div>`);
            }
        }

        // Shop
        if (typeof SHOP_LISTS !== 'undefined') {
            const shops = [];
            for (let npc in SHOP_LISTS) {
                if (SHOP_LISTS[npc].includes(itemId)) shops.push(getTranslateName(npc));
            }
            if (shops.length > 0) {
                const uniqueShops = [...new Set(shops)];
                sources.push(`<div class="mb-2"><div class="text-xs font-semibold text-emerald-400 mb-1">💰 商店購買</div><div class="flex flex-wrap gap-1">` +
                    uniqueShops.map(s => `<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] border border-gray-700">${s}</span>`).join('') +
                    `</div></div>`);
            }
        }

        if (sources.length === 0) {
            sources.push(`<div class="text-[11px] text-gray-500 italic mt-1">目前無已知的常規掉落或製作來源。</div>`);
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
        }
    };
})();

document.addEventListener('tabChanged', (e) => {
    if (e.detail === 'tab-collections') {
        WikiCollections.init();
    }
});
