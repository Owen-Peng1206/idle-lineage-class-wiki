# 裝備與道具屬性 (Keys) 完整解析清單 (共 386 種)

在這款基於 Lineage (天堂) 機制的放置遊戲中，`00-data.js` 定義了龐大的屬性系統。這 386 個 Key 涵蓋了從基本數值、機率觸發、一直到寵物與系統標籤的方方面面。以下將這些屬性按功能分類並提供能力說明：

## 1. 核心基礎屬性 (Core Stats)
影響角色基本成長的六大能力與血魔上限。
* **`str`**: 力量加成 (影響近戰傷害、命中、負重)。
* **`dex`**: 敏捷加成 (影響遠程傷害、命中、防禦、迴避)。
* **`con`**: 體質加成 (影響最大 HP 與負重)。
* **`int`**: 智力加成 (影響魔法傷害、魔法命中、治癒量)。
* **`wis`**: 精神加成 (影響最大 MP、魔防、回魔)。
* **`cha`**: 魅力加成 (影響可召喚的寵物/召喚物數量與強度)。
* **`hp` / `mhp`**: HP 加成 / 最大 HP 上限。
* **`mp` / `mmp`**: MP 加成 / 最大 MP 上限。

## 2. 攻擊與戰鬥數值 (Offense)
負責計算物理與魔法攻擊的數值。
* **`dmgS`**: 對小型怪物基礎傷害 (如 10 代表 1d10)。
* **`dmgL`**: 對大型怪物基礎傷害。
* **`dmgBonus`**: 額外傷害 (固定數值加成)。
* **`hit`**: 命中率加成。
* **`meleeDmg` / `meleeHit`**: 近距離額外傷害 / 近距離命中。
* **`rangedDmg` / `rangedHit`**: 遠距離額外傷害 / 遠距離命中。
* **`magicDmg` / `mdmg`**: 魔法傷害加成。
* **`magicHit`**: 魔法命中加成。
* **`extraDmg` / `extraHit`**: 泛用額外傷害 / 泛用額外命中。
* **`mcrit` / `mcritDmg`**: 魔法爆擊率 / 魔法爆擊額外傷害。
* **`rcrit`**: 遠程爆擊率。
* **`atkSpd` / `atkSpdPct`**: 攻擊速度 / 攻擊速度百分比提升。
* **`meleeHaste`**: 近戰攻擊速度提升 (加速機制)。
* **`pierceChance`**: 攻擊穿透機率 (無視部分防禦)。
* **`comboRate` / `atkDoubleChance`**: 發動雙擊 / 雙重攻擊的機率。
* **`dragonStrike`**: 屠龍額外傷害 (如屠龍劍專屬)。
* **`skillAddDmg` / `skillDmgMult`**: 技能額外傷害 / 特定技能傷害倍率。
* **`dmgMult` / `multiDmg`**: 總傷害倍率 / 多段傷害次數。

## 3. 防禦與抗性數值 (Defense & Resistance)
負責減免敵人造成的傷害與閃避。
* **`ac`**: 物理防禦 (AC，通常數值越低越好，或內部計算為負值)。
* **`acBase` / `acDiv` / `acUp`**: 防禦基數 / 防禦隨等級除數 / 防禦成長。
* **`dr`**: 傷害減免 (Damage Reduction，固定扣除受到的傷害)。
* **`mr`**: 魔法防禦 (Magic Resistance，以百分比減少魔法傷害)。
* **`er`**: 迴避率 (Evasion Rate，閃避遠程或一般攻擊)。
* **`resFire` / `resWater` / `resEarth` / `resWind`**: 火 / 水 / 地 / 風 屬性抗性。
* **`magicDrNonEle`**: 無屬性魔法減免。
* **`dmgReflect` / `painReflect`**: 傷害反射 (機率或固定反彈)。
* **`crushDr`**: 重擊減免 (抵銷武器重擊特性)。
* **`physDrGated`**: 特定的物理減免閾值。

## 4. 生命與魔力恢復 (Regen & Sustain)
* **`hpR` / `regenHp`**: HP 自然恢復量。
* **`mpR`**: MP 自然恢復量。
* **`mpOnHit` / `mpOnHitAmt` / `mpOnHitBase`**: 命中時恢復 MP 的機制與基數 (如瑪那魔杖)。
* **`mpROverSafe` / `mpRPerEn` / `extraMpPerEn`**: 隨強化值(超過安定值)增加的 MP 恢復或上限。
* **`heal` / `healBase` / `healPct` / `healDice`**: 治癒量加成 / 百分比加成 / 治癒骰數。
* **`onDmgHeal`**: 受擊時機率恢復 HP。
* **`lifesteal` / `vamp` / `vampPct`**: 吸血機制 / 吸血量 / 吸血機率。
* **`drain`**: 泛用吸取 (HP或MP) 屬性。

## 5. 寵物與召喚物加成 (Pets & Summons)
強化跟隨者的專屬詞綴 (如喚獸師裝備)。
* **`petDmg` / `petHit`**: 單一裝備寵物的傷害 / 命中加成。
* **`petAc` / `petMr`**: 單一裝備寵物的防禦 / 魔防加成。
* **`petInt` / `petWis`**: 單一裝備寵物的智力 / 精神加成。
* **`petDmgAll` / `petHitAll`**: 所有攜帶寵物的傷害 / 命中加成。
* **`petSkillDmgMult`**: 寵物技能傷害倍率。
* **`summonDmg` / `summonHit`**: 召喚物的額外傷害 / 命中加成。

## 6. 特殊攻擊特效與機率觸發 (Procs & Effects)
裝備內建的被動技能或攻擊附帶效果。
* **`eff`**: 武器特殊效果 (如 `pierce` 穿透, `crush` 重擊, `combo` 雙擊, `moonburst` 月光爆裂等)。
* **`procSkill` / `procStatusSkill`**: 攻擊命中時機率觸發特定技能或異常狀態。
* **`spellProc` / `meleeHitSpell`**: 攻擊命中時觸發的魔法 (如隱藏的魔族武器)。
* **`procPoison` / `procPoisonRate`**: 攻擊附加中毒狀態機率。
* **`procBonusDmg` / `procDmgReduce`**: 機率性發動額外傷害 / 減傷。
* **`procBurn`**: 攻擊附加灼燒狀態。
* **`procInstakill` / `instakill`**: 攻擊機率即死。
* **`onHitEleDmg`**: 命中附加特定屬性傷害。
* **`hasteStrike`**: 加速突擊 (如殺人蜂的尾刺，在加速狀態下獲得極大增傷，命中後解除加速)。
* **`counterBarrierX2`**: 反擊屏障發動率或傷害倍增。
* **`weakExpose` / `weakHitBonus`**: 弱點曝光 (鎖鏈劍特性)。
* **`redSpecter` / `blueSpecter`**: 紅惡靈逆襲 / 藍惡靈奪魔 (特殊吸血回魔特效)。
* **`shatter`**: 粉碎特效 (如破壞雙刀)。
* **`stormInterval`**: 雷霆風暴等環境技能觸發間隔縮短。

## 7. 異常狀態抵抗與免疫 (Status & Immunity)
* **`abnormalResist`**: 全面異常狀態抵抗。
* **`stunResist` / `freezeResist` / `sleepResist`**: 暈眩 / 冰凍 / 睡眠 抵抗率。
* **`immBurn` / `immFreeze` / `immParalyze` / `immPoison` / `immSlow` / `immStone` / `immStun` / `immSleep`**: 完全免疫灼燒 / 冰凍 / 麻痺 / 中毒 / 緩速 / 石化 / 暈眩 / 睡眠。

## 8. 裝備限制與職業判斷 (Requirements & Flags)
* **`req`**: 職業限制 (如 `knight,elf`, `all`)。
* **`type`**: 裝備類型 (`wpn` 武器, `arm` 防具, `acc` 飾品, `mat` 材料等)。
* **`slot`**: 裝備欄位 (如 `helm`, `armor`, `ring`, `amulet`)。
* **`oneHand` / `w2h`**: 單手武器 / 雙手武器標籤。
* **`isArrow` / `isBow` / `isWand`**: 判定是否為箭矢 / 弓 / 魔杖。
* **`ranged`**: 標記為遠程武器。
* **`reqWpn` / `reqWpnMelee` / `reqWpnBlunt` / `reqShield`**: 需要特定武器類型或盾牌才能發動的屬性(常見於技能)。

## 9. 道具 Meta 資訊與系統設定 (Meta & System)
* **`n` / `d` / `desc`**: 道具名稱 / 描述文字。
* **`id`**: 道具內部 ID。
* **`p`**: 價格 (商店賣出或買入)。
* **`safe`**: 強化安定值 (如 6 代表 +6 內 100% 成功)。
* **`noEnhance`**: 不可強化。
* **`noConsume`**: 不會消耗 (如永續箭筒)。
* **`relic`**: 遺物標籤 (通常搭配不可強化)。
* **`legend`**: 傳說級裝備標籤。
* **`unique`**: 唯一道具 (身上或裝備只能存在一個)。
* **`weightCap`**: 增加角色的負重上限。
* **`potionBonus`**: 藥水恢復量加成。
* **`expBonus` / `goldBonus`**: 經驗值 / 金幣 獲取量加成。
* **`gachaWeight`**: 抽獎/轉蛋出現的權重(機率)。
* **`noSell` / `noJunk` / `noUse`**: 不可販售 / 不可當垃圾處理 / 不可主動使用。

---
*註：上述清單囊括了 `00-data.js` 中所有曾被定義過的屬性鍵值。部分屬性可能是系統計算用的過渡參數（例如 `valBase`、`lvDmgDiv` 等），或者專屬於敵方怪物 / NPC 技能的判定。*
