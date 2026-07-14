---
name: wiki_crafting_menu
description: Guidelines for modifying the Wiki Crafting Menu (製作菜單)
---

# Wiki Crafting Menu Modifications
When the user asks to add or update items in the "製作菜單" (Crafting Menu) page or Wiki, follow these steps:
1. **Target the Wiki, not the Game Core**: Do not modify the game core scripts (e.g., `idle-lineage-class/js/14-craft-pandora.js`) unless explicitly asked to create a new recipe for the game.
2. **Update `wiki-craft.js`**: To make an NPC's recipes appear in the Wiki's Crafting Menu, modify `idle-lineage-class-wiki/js/wiki-craft.js`.
3. **Register the NPC**: Add the NPC to the `CRAFT_NPC_INFO` object with its `name`, `location`, `title`, `icon`, and `color`.
4. **Update Town Order**: Ensure the NPC's `location` is included in the `TOWN_ORDER` array so it renders in the correct section.
