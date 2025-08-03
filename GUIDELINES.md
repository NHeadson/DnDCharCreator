Character Creation Tool Context: D&D Player's Handbook (2024 Version)
This character creation tool is designed to strictly adhere to the rules and content presented in the Dungeons & Dragons Player's Handbook (2024 Version), as provided in the D&DPlayerGuide.pdf. While some foundational rules remain consistent with previous editions (like the 2014 Player's Handbook), this 2024 version introduces many new or redesigned elements that must take precedence.
The goal is for the tool to accurately guide a user through character creation, reflecting the specific steps, options, and mechanics detailed in this particular Player's Handbook.

--------------------------------------------------------------------------------
I. Core Principles and Prioritization
• Primary Source: The D&DPlayerGuide.pdf is the definitive and sole source for all character creation data and rules. Any discrepancies between this PDF and other D&D 5th Edition APIs or older materials should always resolve in favor of the PDF's content.
• Version: This tool is specifically for the 2024 version of the fifth edition Player's Handbook. Key changes from the 2014 version are highlighted below and must be incorporated.
• User Experience: The character creation process should be as "easier than ever before" as described in the source.

--------------------------------------------------------------------------------
II. Character Creation Steps (as per D&DPlayerGuide.pdf)
The character creation process follows these sequential steps:
Step 1: Choose a Class
• A class defines a character's vocation, special talents, and favored tactics.
• The Player's Handbook (2024) offers twelve classes to choose from: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, and Wizard.
• Each class has a Primary Ability and a Complexity level (Low, Average, High).
• Subclasses are generally chosen at level 3 or higher. The tool should present subclass options relevant to the chosen class (e.g., College of Glamour, Circle of the Moon, Battle Master).
Step 2: Determine Origin
• A character's origin is defined by Background and Species.
• Background:
    ◦ The tool should offer the sixteen specific backgrounds detailed in Chapter 4 of the PDF: Acolyte, Artisan, Charlatan, Criminal, Entertainer, Farmer, Guard, Guide, Hermit, Merchant, Noble, Sailor, Sage, Scribe, Soldier, and Wayfarer.
    ◦ Each background provides:
        ▪ Ability Score Increases: Increases one score by 2 and a different one by 1, OR increases all three by 1. None can raise a score above 20. The tool must ensure this adjustment is applied after the initial ability score assignment (Step 3).
        ▪ Feat: A specific Origin feat. The tool should automatically assign this feat.
        ▪ Skill Proficiencies: Proficiency in two specified skills.
        ▪ Tool Proficiency: Proficiency with one specific tool or a choice from Artisan's Tools.
        ▪ Equipment: A choice between a package of equipment OR 50 GP.
• Species:
    ◦ The tool should offer the ten specific species detailed in Chapter 4: Aasimar, Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, and Tiefling.
    ◦ Each species determines the character's Creature Type (all Humanoid for playable species in this book), Size, Speed, and Special Traits.
    ◦ Crucial Update: The 2024 version handles ability score increases from species differently. Species in this handbook do NOT provide ability score increases; they are solely provided by the background. If the tool has logic from older 5e versions where species grant ability score increases, this must be ignored.
    ◦ For Aasimar, Human, and Tiefling, the user chooses their size (Medium or Small) when selecting the species.
    ◦ For Dragonborn, the user chooses their Draconic Ancestry (e.g., Black for Acid damage resistance/breath weapon).
    ◦ For Elf and Gnome, the user chooses a lineage.
    ◦ For Goliath, the user chooses their giant ancestry.
    ◦ For Tiefling, the user chooses a Fiendish Legacy.
• Languages:
    ◦ Every character knows Common plus two additional languages. The user can roll on or choose from the Standard Languages table (e.g., Draconic, Dwarvish, Elvish, Giant, Gnomish, Goblin, Halfling, Orc).
    ◦ Rare Languages (e.g., Abyssal, Celestial, Infernal) are also available if granted by features.
Step 3: Determine Ability Scores
• The tool must provide three methods for generating scores, allowing the DM to specify which one to use:
    ◦ Standard Array: Fixed scores of 15, 14, 13, 12, 10, 8.
    ◦ Random Generation: Roll four d6s and record the total of the highest three dice. Repeat five more times for six numbers total.
    ◦ Point Cost: User has 27 points to spend, with costs increasing for higher scores (e.g., 8 cost 0, 15 cost 9).
• After generating scores, the user assigns them to Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. The tool can provide suggestions based on the chosen class's primary ability.
• Ability Modifiers are derived from the scores (e.g., 10-11 is +0, 14-15 is +2).
Step 4: Choose an Alignment
• The tool should present the nine alignments: Lawful Good, Neutral Good, Chaotic Good, Lawful Neutral, True Neutral, Chaotic Neutral, Lawful Evil, Neutral Evil, Chaotic Evil.
• It should note the game's assumption that player characters aren't of an evil alignment.
Step 5: Fill in Details
• Proficiency Bonus (PB): For a level 1 character, this is +2. This bonus increases at certain levels as the character advances.
• Saving Throws: For proficiencies, add PB to the relevant ability modifier.
• Skills: For proficiencies, add PB to the relevant ability modifier. The tool should support applying skill proficiency to different ability checks if the DM allows (e.g., Strength (Intimidation) check).
• Passive Perception: Calculate as 10 + Wisdom (Perception) check modifier. Adjust by +5 for Advantage or -5 for Disadvantage on Wisdom (Perception) checks.
• Hit Points (HP): At level 1, determined by class and Constitution modifier. For example, Barbarian: 12 + Con. modifier; Fighter/Paladin/Ranger: 10 + Con. modifier; Bard/Cleric/Druid/Monk/Rogue/Warlock: 8 + Con. modifier; Sorcerer/Wizard: 6 + Con. modifier.
• Hit Dice: At level 1, a character has 1 Hit Die (type determined by class, e.g., d12 for Barbarian, d8 for Rogue).
• Initiative: Equals the Dexterity modifier.
• Armor Class (AC): Base AC is 10 + Dexterity modifier, then modified by worn armor and shields. Only one base AC calculation can be in effect. Armor training (from class) is crucial for AC benefits.
• Attacks:
    ◦ Weapon Attacks: Attack roll bonus is Proficiency Bonus + Strength modifier (for melee/unarmed) or Dexterity modifier (for ranged).
    ◦ Spell Attacks: Attack roll bonus is Proficiency Bonus + Spellcasting Ability modifier.
    ◦ Weapon Mastery: The tool should note that weapons have a specific "Mastery Property" (e.g., Vex, Cleave) that is unlocked by class features.
• Equipment: Record starting equipment from background and class. The character also gets one free trinket.
• Spells (if applicable):
    ◦ Spellcasting classes determine cantrips known, spell slots available, and prepared spells.
    ◦ Spellcasting Ability (e.g., Charisma for Bard/Sorcerer/Warlock, Wisdom for Cleric/Druid/Ranger, Intelligence for Wizard).
    ◦ Spell Save DC and Spell Attack Bonus are calculated based on the spellcasting ability and proficiency bonus.

--------------------------------------------------------------------------------
III. Important 2024 Version Highlights (Superseding Older Data)
The following points explicitly differentiate the 2024 Player's Handbook from previous versions and are crucial for the tool's accuracy:
• Reimagined Origins: Character origin is now defined by background and species, with both being redesigned. This is a significant shift, especially regarding ability score increases. Backgrounds now provide the primary ability score increases and a feat, while species provide other traits (size, speed, etc.) but no inherent ability score increases..
• Expanded Feats: Feats have been redesigned and many new ones added. Backgrounds now grant a feat, which is a core part of character creation.
• Enhanced Classes: "Every class and subclass has been enhanced with new options". The tool must reflect the latest class features, hit dice, proficiencies, and subclass abilities as detailed in the provided PDF.
• Upgraded Weapons and Tools: The concept of Weapon Mastery properties is new and must be reflected in weapon descriptions and character capabilities. New tool and crafting rules are also in place.
• Streamlined Rules and Glossary: The rules have been streamlined and are now supported by a Rules Glossary (Appendix C). The tool should adhere to these streamlined rules, such as specific action definitions and D20 Test mechanics.
• Trinkets: Characters start with one free trinket
