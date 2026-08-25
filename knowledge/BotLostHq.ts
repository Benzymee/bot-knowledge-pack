/**
 * BotLostHq.ts
 *
 * Play-relevant knowledge distilled from https://2004.losthq.rs/ (rev. 274 / 2004).
 * Companion: BotSalmoneus.ts (Sal's Realm 2000–2005 play advice).
 * This is the canonical unlock/guild reference for bot decision-making on this world.
 *
 * ── Site map (what bots care about) ──────────────────────────────────────────
 *   ?p=skillguides&skill=<name>   — per-skill level unlocks & methods (PRIMARY)
 *   ?p=questguides                — F2P unlocks bots should complete for real
 *   ?p=specialguides&guide=…      — transportation, random events, BIS, coal trucks
 *   ?p=specialguides&guilds=…     — guild entry requirements & contents
 *   ?p=npcdb / ?p=itemdb          — lookup (engine already has ObjType/NpcType)
 *   ?p=calculators                — XP math (engine has own XP tables)
 *
 * ── Ignored (not play decisions) ─────────────────────────────────────────────
 *   wallpapers, LostKit cosmetics, site options, clue trail fluff, chat colours,
 *   music unlocks, kitten care flavour, markets/hiscores UI, Discord links.
 */

/** LostHQ skill ids in skill-grid order. */
export const LOSTHQ_SKILLS = [
    'attack',
    'hitpoints',
    'mining',
    'strength',
    'agility',
    'smithing',
    'defence',
    'herblore',
    'fishing',
    'ranged',
    'thieving',
    'cooking',
    'prayer',
    'crafting',
    'firemaking',
    'magic',
    'fletching',
    'woodcutting',
    'runecraft',
] as const;

export type LostHqSkill = (typeof LOSTHQ_SKILLS)[number];

export function lostHqSkillUrl(skill: LostHqSkill | string): string {
    return `https://2004.losthq.rs/?p=skillguides&skill=${skill.toLowerCase()}`;
}

/** Combat skills — Fighter bots primary. */
export const LOSTHQ_COMBAT_SKILLS: LostHqSkill[] = [
    'attack',
    'strength',
    'defence',
    'hitpoints',
    'ranged',
    'prayer',
    'magic',
];

/** Gathering / artisan skills — Skiller bots primary. */
export const LOSTHQ_SKILLER_SKILLS: LostHqSkill[] = [
    'woodcutting',
    'fishing',
    'mining',
    'cooking',
    'firemaking',
    'smithing',
    'crafting',
    'fletching',
    'thieving',
    'agility',
    'herblore',
    'runecraft',
];

/**
 * Revision-accurate training ladders from LostHQ skill pages.
 * Levels are the unlock thresholds from the 2004 guides.
 */
export const LOSTHQ_TRAINING: Record<
    string,
    { level: number; method: string; notes?: string }[]
> = {
    WOODCUTTING: [
        { level: 1, method: 'Normal trees', notes: 'Lumbridge / Draynor bank area' },
        { level: 15, method: 'Oak trees', notes: 'East of Draynor bank' },
        { level: 30, method: 'Willow trees', notes: 'SW of Draynor bank — best F2P XP' },
        { level: 45, method: 'Maple trees', notes: 'Seers (members logs; burnable F2P)' },
        { level: 60, method: 'Yew trees', notes: 'Edgeville / Seers cemetery' },
        { level: 75, method: 'Magic trees', notes: 'Sorcerer Tower / Gnome Stronghold' },
    ],
    FISHING: [
        { level: 1, method: 'Small net shrimp/anchovies', notes: 'Sea net spots' },
        { level: 5, method: 'Bait sardine/herring', notes: 'Rod + bait' },
        { level: 20, method: 'Fly fish trout', notes: 'River lure spots — Barbarian Village' },
        { level: 30, method: 'Fly fish salmon', notes: 'Same rivers' },
        { level: 40, method: 'Lobster pot', notes: 'Karamja / members seas' },
        { level: 50, method: 'Harpoon tuna/swordfish', notes: 'Karamja' },
        { level: 68, method: 'Fishing Guild', notes: 'North of Ardougne — bank on site' },
        { level: 76, method: 'Harpoon shark', notes: 'Catherby / Fishing Guild' },
    ],
    MINING: [
        { level: 1, method: 'Copper/tin/clay/essence', notes: 'Varrock SW/SE, Rimmington, essence mines' },
        { level: 15, method: 'Iron ore', notes: 'SE Varrock, Al Kharid — best XP' },
        { level: 20, method: 'Silver ore', notes: 'Crafting Guild / Al Kharid' },
        { level: 30, method: 'Coal', notes: 'Dwarven Mine, Barb Village, Coal Trucks' },
        { level: 40, method: 'Gold ore', notes: 'Brimhaven / Crafting Guild' },
        { level: 55, method: 'Mithril ore', notes: 'Al Kharid / Mining Guild' },
        { level: 60, method: 'Mining Guild', notes: 'Falador — 37 coal + 5 mithril' },
        { level: 70, method: 'Adamantite ore', notes: 'Al Kharid / Lumbridge swamp west' },
        { level: 85, method: 'Runite ore', notes: 'Wilderness / members sites' },
    ],
    COOKING: [
        { level: 1, method: 'Meat / shrimp / bread / sardine', notes: 'Fire or range' },
        { level: 15, method: 'Trout / anchovies', notes: 'Pair with fly fishing' },
        { level: 25, method: 'Salmon / stew', notes: '' },
        { level: 30, method: 'Tuna', notes: '' },
        { level: 32, method: "Cook's Guild", notes: 'Chef hat required — NW Varrock' },
        { level: 40, method: 'Lobster / cake', notes: '' },
        { level: 45, method: 'Swordfish', notes: '' },
        { level: 80, method: 'Shark', notes: '' },
    ],
    FIREMAKING: [
        { level: 1, method: 'Burn normal logs', notes: '40 XP' },
        { level: 15, method: 'Burn oak logs', notes: '60 XP' },
        { level: 30, method: 'Burn willow logs', notes: '90 XP' },
        { level: 45, method: 'Burn maple logs', notes: '135 XP' },
        { level: 60, method: 'Burn yew logs', notes: '202.5 XP' },
        { level: 75, method: 'Burn magic logs', notes: '303.8 XP — members' },
    ],
    SMITHING: [
        { level: 1, method: 'Bronze bars (1 copper + 1 tin)', notes: 'Then forge basic gear' },
        { level: 15, method: 'Iron bars (50% success)', notes: '' },
        { level: 30, method: 'Steel bars (1 iron + 2 coal)', notes: '' },
        { level: 40, method: 'Gold bars', notes: 'Crafting jewellery' },
        { level: 50, method: 'Mithril bars (1 mith + 4 coal)', notes: '' },
        { level: 70, method: 'Adamant bars (1 addy + 6 coal)', notes: '' },
        { level: 85, method: 'Runite bars (1 rune + 8 coal)', notes: '' },
    ],
    ATTACK: [
        { level: 1, method: 'Accurate combat style', notes: '4 XP per damage; unlocks bronze/iron weapons' },
        { level: 5, method: 'Steel weapons', notes: '' },
        { level: 10, method: 'Black weapons', notes: '' },
        { level: 20, method: 'Mithril weapons', notes: '' },
        { level: 30, method: 'Adamant weapons', notes: '' },
        { level: 40, method: 'Rune weapons', notes: '' },
        { level: 60, method: 'Dragon weapons', notes: 'Members / quest gated' },
    ],
    DEFENCE: [
        { level: 1, method: 'Bronze/iron armour', notes: 'Defensive combat style' },
        { level: 5, method: 'Steel armour', notes: '' },
        { level: 10, method: 'Black armour', notes: '' },
        { level: 20, method: 'Mithril / studded', notes: '' },
        { level: 30, method: 'Adamant armour', notes: '' },
        { level: 40, method: 'Rune armour', notes: 'Rune platebody needs Dragon Slayer' },
    ],
    RANGED: [
        { level: 1, method: 'Regular bows + bronze/iron arrows', notes: 'Leather armour' },
        { level: 5, method: 'Oak bows', notes: 'Steel arrows' },
        { level: 20, method: 'Willow bows', notes: 'Mithril arrows; studded/hide pieces' },
        { level: 30, method: 'Maple bows', notes: 'Adamant arrows' },
        { level: 40, method: 'Yew bows / Ranging Guild', notes: 'Rune arrows; Seers Village' },
        { level: 50, method: 'Magic bows', notes: '' },
    ],
    MAGIC: [
        { level: 1, method: 'Strike spells / teleports as unlocked', notes: 'Runes from shops or runecraft' },
        { level: 66, method: 'Magic Guild', notes: 'Yanille — or 63 + Wizard Mind Bomb' },
    ],
    PRAYER: [
        { level: 1, method: 'Bury bones', notes: 'Chickens/cows/goblins early' },
        { level: 31, method: 'Prayer Guild / Monastery', notes: 'Abbot Langley — Edgeville monastery' },
    ],
    AGILITY: [
        { level: 1, method: 'Gnome Stronghold course', notes: 'LostHQ agility guide' },
        { level: 35, method: 'Barbarian Outpost course', notes: 'Requires Barcrawl' },
    ],
    THIEVING: [
        { level: 1, method: 'Pickpocket men/women', notes: 'Lumbridge / Varrock' },
    ],
    CRAFTING: [
        { level: 1, method: 'Pottery / spinning / leather', notes: 'Soft clay → Barb Village wheel' },
        { level: 18, method: 'Leather chaps+', notes: 'Al Kharid tanner + needle/thread' },
        { level: 40, method: 'Crafting Guild', notes: 'Brown apron — gold/silver/clay + tanner upstairs' },
    ],
    FLETCHING: [
        { level: 1, method: 'Arrow shafts from logs', notes: 'Knife + feathers + heads' },
        { level: 5, method: 'Shortbows / longbows', notes: 'Progress oak→willow→maple→yew→magic' },
    ],
    HERBLORE: [
        { level: 3, method: 'Identify guam → attack potion', notes: 'Members — vial of water + secondary' },
    ],
    RUNECRAFT: [
        { level: 1, method: 'Air runes', notes: 'Requires Rune Mysteries; air altar S of Falador' },
        { level: 2, method: 'Mind runes', notes: 'Ice Mountain / Goblin Village' },
        { level: 5, method: 'Water runes', notes: 'Lumbridge Swamp' },
        { level: 9, method: 'Earth runes', notes: 'NE Varrock' },
        { level: 14, method: 'Fire runes', notes: 'NE Al Kharid' },
        { level: 20, method: 'Body runes', notes: 'Between Ice Mountain and Barb Village' },
    ],
};

/** Guild gates from LostHQ special guides — bots should respect these levels. */
export const LOSTHQ_GUILDS = {
    COOKS: {
        skill: 'COOKING',
        level: 32,
        extra: 'chefs_hat',
        where: 'NW of Varrock (near Juliet / Edgeville dungeon)',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=cooksguild',
    },
    CRAFTING: {
        skill: 'CRAFTING',
        level: 40,
        extra: 'brown_apron',
        where: 'South of Falador, above Melzar maze',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=craftingguild',
    },
    MINING: {
        skill: 'MINING',
        level: 60,
        extra: null,
        where: 'South of Falador east bank / Dwarven Mine entrance',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=miningguild',
    },
    FISHING: {
        skill: 'FISHING',
        level: 68,
        extra: null,
        where: 'North of East Ardougne — bank + docks inside',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=fishingguild',
    },
    RANGING: {
        skill: 'RANGED',
        level: 40,
        extra: null,
        where: 'North of Ardougne near Hemenster',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=rangingguild',
    },
    CHAMPIONS: {
        skill: 'QUEST_POINTS',
        level: 32,
        extra: null,
        where: 'SW of Varrock',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=championsguild',
    },
    PRAYER: {
        skill: 'PRAYER',
        level: 31,
        extra: null,
        where: 'Monastery west of Edgeville',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=prayerguild',
    },
    MAGIC: {
        skill: 'MAGIC',
        level: 66,
        extra: 'wizards_mind_bomb_at_63',
        where: 'Yanille',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=magicguild',
    },
    HEROS: {
        skill: 'QUEST',
        level: 0,
        extra: 'heros_quest',
        where: 'North of Taverley — Fountain of Heroes (glory recharge)',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=herosguild',
    },
    LEGENDS: {
        skill: 'QUEST_POINTS',
        level: 107,
        extra: 'legends_quest',
        where: 'NE of Ardougne',
        url: 'https://2004.losthq.rs/?p=specialguides&guilds=legendsguild',
    },
} as const;

/** Early F2P quests from LostHQ that unlock useful content. */
export const LOSTHQ_EARLY_QUESTS = [
    { id: 'cooksassistant', name: "Cook's Assistant", why: 'Cooking XP + story' },
    { id: 'sheepshearer', name: 'Sheep Shearer', why: 'Crafting/wool loop' },
    { id: 'dorics', name: "Doric's Quest", why: 'Mining XP + anvil access' },
    { id: 'runemysteries', name: 'Rune Mysteries', why: 'Unlocks Runecraft' },
    { id: 'restlessghost', name: 'The Restless Ghost', why: 'Prayer XP' },
    { id: 'impcatcher', name: 'Imp Catcher', why: 'Magic XP / amulet' },
    { id: 'romeojuliet', name: 'Romeo & Juliet', why: 'Easy QP' },
    { id: 'piratestreasure', name: "Pirate's Treasure", why: 'Easy QP / coins' },
    { id: 'ernestchicken', name: 'Ernest the Chicken', why: 'Easy QP' },
    { id: 'goblindiplomacy', name: 'Goblin Diplomacy', why: 'Easy QP' },
    { id: 'witchpotion', name: "Witch's Potion", why: 'Easy Magic XP' },
    { id: 'princeali', name: 'Prince Ali Rescue', why: 'Easy QP' },
    { id: 'vampireslayer', name: 'Vampire Slayer', why: 'Attack XP' },
    { id: 'demonslayer', name: 'Demon Slayer', why: 'Silverlight / story' },
    { id: 'knightssword', name: "The Knight's Sword", why: 'Smithing XP' },
    { id: 'blackknights', name: "Black Knights' Fortress", why: 'QP gate for Dragon Slayer' },
    { id: 'dragonslayer', name: 'Dragon Slayer', why: 'Rune platebody + Champions gear path' },
] as const;

export const LOSTHQ_SPECIAL = {
    transportation: 'https://2004.losthq.rs/?p=specialguides&guide=transportation',
    randomEvents: 'https://2004.losthq.rs/?p=specialguides&guide=randomevents',
    bis: 'https://2004.losthq.rs/?p=specialguides&guide=bis',
    statBoosting: 'https://2004.losthq.rs/?p=specialguides&guide=statboosting',
    specialAttacks: 'https://2004.losthq.rs/?p=specialguides&guide=specialattacks',
    coalTrucks: 'https://2004.losthq.rs/?p=specialguides&guide=coaltrucks',
    keys: 'https://2004.losthq.rs/?p=specialguides&guide=keys',
} as const;

/**
 * Transportation rules bots actually use (LostHQ transportation guide).
 * Boat hops are implemented as GATEWAY_REGIONS in BotAction — keep costs/notes here.
 */
export const LOSTHQ_TRANSPORT = {
    portSarimToKaramja: { gp: 30, note: 'Seaman Lorris/Thresnor/Tobias → Musa Point' },
    karamjaToPortSarim: { gp: 30, note: 'Customs Agent — allow search; no Karamja rum' },
    portSarimToEntrana: { gp: 0, note: 'Monks of Entrana — no weapons/armour equipped' },
    ardougneToBrimhaven: { gp: 30, note: 'Captain Barnaby / Customs' },
    shantayJailTrick: { note: 'Refuse Shantay fine → Port Sarim jail (glory/duel → Port Sarim)' },
    glory: { note: 'Rub charged glory — Edgeville / Karamja / Draynor / Al Kharid' },
    duelRing: { note: 'Rub — Duel Arena / Castle Wars; 8 charges then destroyed' },
} as const;

/**
 * Random-event responses from LostHQ — bots should talk/pick/run, never ignore.
 * Engine random-event scripts usually handle this; this encodes expected behaviour.
 */
export const LOSTHQ_RANDOM_EVENTS = [
    { name: 'Drunken Dwarf', do: 'Talk immediately — beer + kebab; ignore = rock spam' },
    { name: 'Genie', do: 'Talk for lamp; ignore = teleport away' },
    { name: 'Mysterious Old Man', do: 'Talk back — box / maze / reward' },
    { name: 'Strange Plant', do: 'Wait until grown, then pick — strange fruit (energy)' },
    { name: 'Swarm', do: 'Run away — cannot be fought' },
    { name: 'Rock Golem', do: 'Combat while mining — fight or flee' },
    { name: 'River Troll', do: 'Combat while fishing — fight or flee' },
    { name: 'Tree Spirit', do: 'Combat while woodcutting — fight or flee' },
    { name: 'Shade', do: 'Combat while burying — fight or flee' },
] as const;

/** Map LostHQ skill name → planner skill key. */
export const LOSTHQ_TO_PLANNER: Record<string, string> = {
    attack: 'ATTACK',
    strength: 'STRENGTH',
    defence: 'DEFENCE',
    hitpoints: 'HITPOINTS',
    ranged: 'RANGED',
    prayer: 'PRAYER',
    magic: 'MAGIC',
    cooking: 'COOKING',
    woodcutting: 'WOODCUTTING',
    fletching: 'FLETCHING',
    fishing: 'FISHING',
    firemaking: 'FIREMAKING',
    crafting: 'CRAFTING',
    smithing: 'SMITHING',
    mining: 'MINING',
    herblore: 'HERBLORE',
    agility: 'AGILITY',
    thieving: 'THIEVING',
    runecraft: 'RUNECRAFT',
};

/** Current LostHQ training rung for a skill at a given level. */
export function lostHqMethodAtLevel(
    skill: string,
    level: number
): { level: number; method: string; notes?: string } | null {
    const ladder = LOSTHQ_TRAINING[skill.toUpperCase()];
    if (!ladder?.length) return null;
    let best = ladder[0];
    for (const step of ladder) {
        if (level >= step.level) best = step;
    }
    return best;
}

/** Whether the bot meets a LostHQ guild gate (skill level only; extras like hats are separate). */
export function meetsLostHqGuildLevel(
    guild: keyof typeof LOSTHQ_GUILDS,
    getLevel: (skill: string) => number
): boolean {
    const g = LOSTHQ_GUILDS[guild];
    if (g.skill === 'QUEST' || g.skill === 'QUEST_POINTS') {
        // Bots earn quests for real — only unlock when QP / quest gate is met
        return getLevel(g.skill === 'QUEST' ? 'QUEST_POINTS' : g.skill) >= g.level;
    }
    return getLevel(g.skill) >= g.level;
}
