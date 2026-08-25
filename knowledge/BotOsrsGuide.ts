/**
 * BotOsrsGuide.ts
 *
 * Knowledge distilled from https://www.osrsguide.com/ for AI bots,
 * FILTERED to what exists on this Sept 2004 progressive revision.
 *
 * Dean's OSRSGuide is modern-OSRS-first (GE, Gem Crab, NMZ, Scurrius, Brutus,
 * Stronghold of Security, Adventure Paths, herb/birdhouse runs, etc.).
 * Those are listed in UNAVAILABLE_ON_REVISION / OSRSGUIDE_IGNORE — bots must
 * never chase them.
 *
 * Keep only era-valid patterns that overlap LostHQ/Sal/RuneHQ play:
 * early Lumbridge loop, chickens→goblins→cows, shrimp→fly fish, copper/tin→iron,
 * oaks→willows, cook food for combat, Strength-first melee priority, early quests.
 */

export const OSRSGUIDE_HOME = 'https://www.osrsguide.com/';
export const OSRSGUIDE_PAGES = {
    home: OSRSGUIDE_HOME,
    beginners: `${OSRSGUIDE_HOME}osrs-beginners-guide/`,
    combat: `${OSRSGUIDE_HOME}osrs-combat-training-guide/`,
    moneyMaking: `${OSRSGUIDE_HOME}osrs-money-making-guide-complete/`,
    moneyHub: `${OSRSGUIDE_HOME}moneymaking/`,
    skillingMoney: `${OSRSGUIDE_HOME}top-10-skilling-money-makers-in-osrs/`,
} as const;

/** Modern OSRSGuide recommendations bots must ignore on this revision. */
export const OSRSGUIDE_IGNORE = [
    'grand_exchange',
    'adventure_paths',
    'adventurer_jon',
    'stronghold_of_security',
    'gemstone_crab',
    'brutus_cow_boss',
    'scurrius',
    'nightmare_zone',
    'naguas',
    'varlamore',
    'blast_furnace',
    'motherlode_mine',
    'herb_runs',
    'birdhouse_runs',
    'wintertodt',
    'tempoross',
    'guardians_of_the_rift',
    'hallowed_sepulchre',
    'slayer_bosses',
    'raids',
    'dragon_defender',
    'blood_moon',
    'obsidian_armour_meta',
    'runelite_plugins',
    'sailing',
    'leagues',
] as const;

/**
 * Playbook: OSRSGuide beginner/combat tips that still apply in 2004 RS2.
 * (Street-sell instead of GE; no SoS / Gem Crab / Brutus.)
 */
export const OSRSGUIDE_PLAYBOOK = {
    beginner: [
        'After tutorial: Lumbridge hub — skill a bit, fight a bit, start easy quests',
        'Gather loop: shrimp (net) → trees/logs → copper+tin → bronze at furnace',
        'Woodcutting 15 unlocks oaks (sell street / bank — no GE on this world)',
        'Fishing 20 + feathers → fly fishing trout/salmon (Barb Village fire is ideal)',
        'Cook what you catch — food pipeline funds combat training',
        'Combat ladder: Chickens (feathers!) → Goblins → Cows → leave Lumbridge',
        'Early quests: Cook’s Assistant, Restless Ghost, Rune Mysteries; Varrock: Romeo & Juliet, Demon Slayer',
        'Buy runes from Aubury when magic training — shop prices beat hunting for starters',
    ],
    combat: [
        'Melee priority: Strength first (max hit → XP/hr), then Attack, then Defence',
        'Chickens: lowest defence / feathers for fly fishing — best absolute start',
        'Goblins / cows once Attack+Strength ~10 — bones + hides + food practice',
        'Barbarians / guards / monks as mid F2P ladder before giants',
        'Hill / moss giants for mid combat money (era RuneHQ overlap)',
        'Ignore Gem Crab / NMZ / Scurrius / Brutus — not on this revision',
    ],
    money: [
        'Oaks / willows / iron ore / cooked fish / cowhides are evergreen early cash',
        'Tan hides at Al Kharid (Ellis) when doing cows — small fee, better street price',
        'No GE: sell to bots/players at Falador Park (primary street market)',
        'Skip blast furnace, motherlode, herb/birdhouse runs, chinning, etc.',
    ],
} as const;

/** Beginner targets aligned with OSRSGuide chapter 1 (minus Adventure Path rewards). */
export const OSRSGUIDE_BEGINNER_TARGETS: Partial<Record<string, number>> = {
    WOODCUTTING: 15, // oaks
    FISHING: 20, // fly fishing
    MINING: 15, // iron unlock
    COOKING: 15,
    FIREMAKING: 20,
    SMITHING: 10,
    ATTACK: 10,
    STRENGTH: 10,
    DEFENCE: 10,
};

/**
 * Fighter skill weights — OSRSGuide combat: Str > Atk > Def for XP efficiency.
 * Absolute weights for STYLE_GUIDE_PACKS.fighter merge.
 */
export const OSRSGUIDE_FIGHTER_WEIGHTS: Partial<Record<string, number>> = {
    STRENGTH: 34,
    ATTACK: 28,
    DEFENCE: 18,
    RANGED: 10,
    MAGIC: 6,
    HITPOINTS: 8,
    PRAYER: 8,
    FISHING: 10,
    COOKING: 12,
};

/** Skiller money weights — oaks/willows/iron/fish from beginner + money pages. */
export const OSRSGUIDE_SKILLER_WEIGHTS: Partial<Record<string, number>> = {
    WOODCUTTING: 20,
    FISHING: 18,
    MINING: 18,
    COOKING: 14,
    SMITHING: 12,
    FIREMAKING: 8,
    CRAFTING: 10,
};
