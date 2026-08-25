/**
 * BotRuneHq.ts
 *
 * Play-relevant knowledge distilled from RuneHQ (2003–2005 era).
 * Primary snapshot: Wayback Dec 2004 / mid-2005 — matches this world's content.
 *
 * Live site: https://www.runehq.com/
 * Era snapshot: https://web.archive.org/web/20041215/http://www.runehq.com/
 *
 * RuneHQ was the big "unfair advantage" community guide site — denser skill
 * tables, guild guides, money-making & speed-training special reports.
 *
 * Role vs other sources:
 *   LostHQ     → unlock levels / guild gates (canonical for this rev)
 *   Salmoneus  → beginner playstyle & player tips
 *   RuneHQ     → money methods, combat ladder, speed-training habits, rock/spot tables
 *
 * Ignore modern RuneHQ (RS3 bosses, Treasure Trails 2025, etc.).
 */

export const RUNEHQ_REVISION_SNAPSHOT = '2004-12-15';
export const RUNEHQ_HOME = 'https://www.runehq.com/';
export const RUNEHQ_WAYBACK =
    'https://web.archive.org/web/20041215000000/http://www.runehq.com/';

/** Dec 2004 RHQSkillsView.php ids for main RS2 skill guides. */
export const RUNEHQ_SKILL_IDS: Record<string, string> = {
    mining: '00337',
    fishing: '00316',
    woodcutting: '00330',
    cooking: '00296',
    smithing: '00275',
    firemaking: '00368',
    crafting: '00386',
    fletching: '00372',
    ranged: '00401',
    magic: '00389',
    prayer: '00295',
    thieving: '00312',
    runecrafting: '00166',
    agility: '00448',
    herblore: '00309',
    combat: '00422',
};

export function runeHqSkillUrl(skill: string): string {
    const key = skill.toLowerCase().replace('runecraft', 'runecrafting');
    const id = RUNEHQ_SKILL_IDS[key] ?? RUNEHQ_SKILL_IDS[skill.toLowerCase()];
    if (!id) return `${RUNEHQ_WAYBACK}RHQSkills.php`;
    return `${RUNEHQ_WAYBACK}RHQSkillsView.php?id=${id}`;
}

export const RUNEHQ_SKILLER_GUIDES = [
    'mining',
    'fishing',
    'woodcutting',
    'cooking',
    'smithing',
    'firemaking',
    'crafting',
    'fletching',
    'thieving',
    'runecrafting',
    'herblore',
].map(runeHqSkillUrl);

export const RUNEHQ_COMBAT_GUIDES = ['combat', 'ranged', 'magic', 'prayer'].map(runeHqSkillUrl);

export const RUNEHQ_SPECIAL = {
    moneyMaking: `${RUNEHQ_WAYBACK}RHQSpecialReportsView.php?id=00460`,
    speedTraining: `${RUNEHQ_WAYBACK}RHQSpecialReportsView.php?id=00421`,
    fightingTips: `${RUNEHQ_WAYBACK}RHQSpecialReportsView.php?id=00394`,
    randomEvents: `${RUNEHQ_WAYBACK}RHQSpecialReportsView.php?id=00206`,
    essenceRunning: `${RUNEHQ_WAYBACK}RHQSpecialReportsView.php?id=00515`,
} as const;

/**
 * Distilled RuneHQ playbook (skill guides + money/speed/fighting specials).
 */
export const RUNEHQ_PLAYBOOK = {
    mining: [
        'Mining is one of the easiest money skills — ore sells well',
        'Prospect rocks until you learn colours; grey rock = empty, wait for respawn',
        'Busier worlds = faster ore respawns',
        'Best early spots: SE/SW Varrock, Al Kharid, Dwarven Mines, Rimmington clay',
        'Iron @15 — Al Kharid / SE Varrock / Rimmington (many rocks)',
        'Coal @30 — Dwarven Mines / Al Kharid; Mining Guild @60 (or 59 + dwarven stout)',
        'Mining Guild: 37 coal + 5 mithril packed tight — watch Rock Golem / Swarm',
        'Nurmof (Dwarven Mines) sells better pickaxes',
    ],
    fishing: [
        'Small net: Draynor, Karamja dock, Catherby — shrimp/anchovies',
        'Rod+bait @5: Draynor, Al Kharid, Barb Village, Lumby river',
        'Fly rod @20 + feathers: Barb Village / Lumby / Ardougne river — trout/salmon',
        'Cage lobster / harpoon at Karamja; Fishing Guild @68 (bank + shops on site)',
        'Guild entry shortcuts: 65 + fishing potion/fish pie (members food)',
    ],
    woodcutting: [
        'F2P trees: regular → oak → willow → yew (maple/magic members)',
        'Recommended stays: oaks to 30, willows to 60, yews after',
        'Hatchet can stay in inventory if you lack Attack to wield it',
        'Tree Ent: STOP chopping immediately or hatchet breaks → Bob in Lumbridge repairs',
        'Tree Spirit: flee — level scales with yours',
        'WC can make millions long-term (RuneHQ author claim) via yews',
    ],
    cooking: [
        'Meat/fish cook on fire OR range; pies/pizza/bread need a range',
        'Burn less as level rises; lobster@40 heals 12, swordfish@45 heals 14',
        'Speed tip: use closest range to a bank; watch chat messages not animations',
        'Bank burnt food in notes and drop later — don\'t interrupt cook loops',
    ],
    money: [
        'Core money skills: Mining, Fishing, Woodcutting, Smithing, Crafting, Fletching, Runecraft',
        'Low combat money: Barb Village → Hill Giants (big bones) → Moss Giants → Lesser Demons',
        'Stock lobsters/swordfish before demon trips; cook on Karamja dock first',
        'Essence mining/running after Rune Mysteries is steady early cash',
        'Avoid arrow-stealing / kill-stealing culture — train your own spots',
    ],
    combat: [
        'Train on high-HP monsters that rarely hit you — max XP, less food',
        'Stockpile more food in bank than you think you need before a session',
        'Prefer aggressive monsters so you don\'t click every kill',
        'Target ≈ your combat level — higher drains food and XP/hr',
        'F2P food for hard fights: lobsters or swordfish',
        'Protect Item (Prayer 25) keeps an extra item on death; skull = only 1 kept',
        'Slash weapon needed for Varrock sewer webs to reach moss giants',
    ],
    speedTraining: [
        'Inventory: only what you need; put interact-pairs adjacent at bottom',
        'Fletching: don\'t string bows until maple+ — power-fletch unstrung first',
        'Thieving: trap NPCs in houses; steal cakes from stalls while pickpocketing',
        'Cooking: bank-near-range loops beat wilderness fires for mass cook',
    ],
    ranging: [
        'Safespot behind objects — classic RuneHQ ranging edge',
        'Lowe\'s Archery (Varrock) for starter kit',
        'Shortbows fire faster; longbows for distance',
    ],
    randomEvents: [
        'Talk to Genie / Mysterious Old Man / Drunken Dwarf immediately',
        'Ent on trees: stop chopping; spirit: run',
        'Swarm: run — cannot fight',
        'Rock Golem / River Troll: fight or flee while skilling',
    ],
} as const;

/**
 * RuneHQ F2P combat money ladder — fighters prefer these when level allows.
 * Used to bias combat step selection toward better XP/loot tiers.
 */
export const RUNEHQ_COMBAT_LADDER = [
    { minCombatApprox: 1, locKeyHint: 'CHICKENS' },
    { minCombatApprox: 10, locKeyHint: 'COWS' },
    { minCombatApprox: 15, locKeyHint: 'BARBARIANS' },
    { minCombatApprox: 25, locKeyHint: 'HILL_GIANTS' },
    { minCombatApprox: 40, locKeyHint: 'MOSS_GIANTS' },
] as const;
