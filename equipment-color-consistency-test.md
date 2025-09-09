# Equipment Color Consistency Test

## Expected Color Scheme

Based on the `getEquipmentTypeColor()` function in `InventoryEquipment.vue`, equipment should use the following colors:

### Armor
- **Heavy Armor**: `red-darken-1`
- **Medium Armor**: `orange-darken-1`  
- **Light Armor**: `yellow-darken-1`
- **Shields**: `blue-darken-1`

### Weapons
- **All Weapons**: `purple-darken-1` (swords, axes, bows, daggers, etc.)
- **Ammunition**: `grey-darken-2` (arrows, bolts)

### Tools & Equipment
- **Artisan's Tools**: `green-darken-1` (smith's tools, carpenter's tools, etc.)
- **Musical Instruments**: `purple-lighten-1` (lute, flute, drums, etc.)
- **Gaming Sets**: `red-lighten-1` (cards, dice)

### Other Equipment
- **Equipment Packs**: `brown-darken-1` (adventurer's pack, etc.)
- **Adventuring Gear**: `cyan-darken-1`
- **Containers/Bags**: `deep-orange-darken-1` (pouches, bags)
- **Consumables**: `lime-darken-1` (rations, rope, candles)
- **Books/Writing**: `blue-grey-darken-1` (books, ink, parchment)
- **Jewelry**: `amber-darken-1` (rings, jewelry)
- **Clothing**: `pink-darken-1` (costumes, uniforms)

### Spellcasting Focuses
- **Divine Focus**: `amber-darken-1` (holy symbols)
- **Arcane Focus**: `indigo-darken-1` (crystal orbs, wands)
- **Druidcraft Focus**: `light-green-darken-1` (druidic focuses)
- **Spellcasting Focus**: `teal-darken-1` (component pouches)

## Dialog Proficiency Colors

- **Musical Instrument Proficiency**: `purple-lighten-1` (matches instrument chip color)
- **Artisan Tool Proficiency**: `green-darken-1` (matches tool chip color)

## Test Plan

### 1. Background Equipment Consistency
Test that equipment from different backgrounds uses consistent colors:
- **Acolyte**: Holy symbol should be `amber-darken-1`
- **Entertainer**: Musical instrument should be `purple-lighten-1`
- **Folk Hero**: Artisan's tools should be `green-darken-1`
- **Guild Artisan**: Artisan's tools should be `green-darken-1`

### 2. Class Equipment Consistency  
Test that starting equipment from different classes uses consistent colors:
- **Fighter**: Weapons should be `purple-darken-1`, armor should match armor type colors
- **Wizard**: Arcane focus should be `indigo-darken-1`
- **Cleric**: Holy symbol should be `amber-darken-1`
- **Ranger**: Weapons should be `purple-darken-1`

### 3. Dialog Color Consistency
Test that proficiency indicators in dialogs match chip colors:
- Musical instrument dialog: proficiency chips should be `purple-lighten-1`
- Artisan tools dialog: proficiency chips should be `green-darken-1`

### 4. Cross-Combination Testing
Test combinations of different classes and backgrounds to ensure colors remain consistent:
- Fighter + Entertainer
- Wizard + Folk Hero  
- Cleric + Guild Artisan
- Any class + any background should show consistent equipment colors

## Expected Results

All equipment chips should display with their appropriate colors regardless of:
- Character class choice
- Background choice
- Equipment source (background vs class vs purchased)
- Whether equipment requires user choice or not

The color should be determined solely by the equipment type, not by the source or character build choices.
