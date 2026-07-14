---
name: wiki_drop_tables
description: Guidelines for iterating and displaying monster drop sources
---

# Wiki Drop Tables Iteration
When implementing features that look up item drop sources or display monster drops in the Wiki (such as tooltips, maps, or collection pages):
1. **Iterate All Tables**: Do NOT only iterate over `MOB_DROPS`. You must also include other supplementary drop tables defined in `01-drops-config.js` to ensure complete data.
2. **Required Tables**: Collect drops from at least `MOB_DROPS`, `DARK_WEAPON_DROPS`, `DRAGON_DROPS`, `WARRIOR_DROPS`, `MEM_DROPS`, and `DARK_CRYSTAL_DROPS`.
3. **Handling Duplicates**: Because the same item might drop from the same monster across different tables, be sure to deduplicate them (usually by taking the maximum drop chance `Math.max(existing.chance, chance)`).
