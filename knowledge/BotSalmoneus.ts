/**
 * BotSalmoneus.ts
 *
 * Play-relevant knowledge distilled from Sal's Realm of RuneScape (2000–2005 era).
 * Primary snapshot used: Wayback Dec 2004 — matches this world's ~Sept 2004 content.
 *
 * Live site: https://runescape.salmoneus.net/
 * Era snapshot: https://web.archive.org/web/20041214/http://runescape.salmoneus.net/
 *
 * Used alongside BotLostHq.ts. Prefer LostHQ for level unlock tables;
 * Salmoneus for how real 2004 players trained, made money, and stayed alive.
 *
 * Ignore from modern Salmoneus pages: Living Rock Caverns, Inferno Adze, GE prices,
 * Farming/Slayer (post-revision), Castle Wars-as-meta, etc.
 */

export const SALMONEUS_REVISION_SNAPSHOT = '2004-12-14';
export const SALMONEUS_HOME = 'https://runescape.salmoneus.net/';
export const SALMONEUS_WAYBACK =
    'https://web.archive.org/web/20041214000525/http://runescape.salmoneus.net/';

export function salmoneusSkillUrl(skill: string): string {
    const s = skill.toLowerCase();
    // Dec 2004 filenames (crafting/magic were split pages)
    const file =
        s === 'crafting'
            ? 'crafting_p1.html'
            : s === 'magic'
              ? 'magic_p1.html'
              : s === 'ranged' || s === 'ranging'
                ? 'ranging.html'
                : s === 'runecraft' || s === 'runecrafting'
                  ? 'runecrafting.html'
                  : `${s}.html`;
    return `${SALMONEUS_WAYBACK}${file}`;
}

/** Sal's Dec 2004 skill guide URLs — skiller / fighter packs. */
export const SALMONEUS_SKILLER_GUIDES = [
    'mining',
    'fishing',
    'woodcutting',
    'cooking',
    'smithing',
    'firemaking',
    'crafting',
    'fletching',
    'thieving',
    'herblore',
    'runecrafting',
].map(salmoneusSkillUrl);

export const SALMONEUS_COMBAT_GUIDES = [
    'ranging',
    'magic',
    'prayer',
    // Attack guide existed by late 2005; Dec 2004 used combat tips + ranging/magic
].map(salmoneusSkillUrl);

/**
 * How 2004 players actually trained — Sal's guides + player tips.
 * These bias location / product choice beyond raw level unlocks.
 */
export const SALMONEUS_PLAYBOOK = {
    beginner: [
        'Bob\'s Axes (Lumbridge) — buy a steel hatchet ASAP; bronze is slow',
        'Mine tin + copper in equal amounts → bank → bronze bars at a furnace',
        'Small net shrimp at sea spots; cook on fire or range for food',
        'Chop Lumbridge trees; burn with tinderbox or fletch with knife (behind Bob\'s)',
        'Do early F2P quests for free XP (Cook\'s Assistant, Sheep Shearer, Doric\'s, Rune Mysteries)',
    ],
    mining: [
        'Start: Varrock mines or Al Kharid / Scorpion Pit',
        'Pickaxe upgrade shop: Nurmof in Dwarven Mines (north of Falador)',
        'Dwarven Stout (Rising Sun, Falador, 3gp) = +1 Mining & Smithing briefly',
        'Iron often beats coal for coins/hour at mid levels (faster ores, steady buyers)',
        'Mining Guild at 60 — dense coal + mithril',
        'Charged Glory raises gem find chance while mining',
    ],
    fishing: [
        'Gear + sell fish: Gerrant\'s in Port Sarim',
        'Members gear (big net): Catherby fishing shop',
        'Net shrimp/anchovies → fly rod trout/salmon (feathers) → cage lobster → harpoon',
        'Cooked fish is the fighter food pipeline — Sal: warriors buy from fishermen',
    ],
    woodcutting: [
        'Better axe = faster chops; Bob\'s sells steel+',
        'Willows near water (Draynor); yews off roads (Edgeville / south Falador)',
        'Maples & magic are members trees; maple logs can still burn/trade on F2P',
        'Tree spirit / broken axe: flee spirits; repair/replace at Bob\'s — don\'t beg',
    ],
    cooking: [
        'Fish cook on fire OR range; pies/pizzas/bread need a range',
        'Burn rate drops as Cooking rises — keep cooking what you fish',
        'Cook\'s Guild (32 + chef hat) near NW Varrock — best F2P cook hub',
    ],
    firemaking: [
        'Needs: hatchet + tinderbox + logs — pair with woodcutting',
        'XP ladder matches log tiers: normal→oak→willow→maple→yew→magic',
    ],
    fletching: [
        'Knife behind Bob\'s Axes or Seers house south of pub',
        'Arrow loop: shafts (normal logs) → feathers → heads',
        'Bows: fletch short/long → flax (Seers / Gnome) → spin bowstring → string',
        'F2P can use arrows up to steel; mithril+ arrow trade gated to members',
    ],
    ranging: [
        'Buy starter kit at Lowe\'s Archery (NE Varrock)',
        'Safespot behind gates/tables — classic Sal ranging advice',
        'Rapid for speed XP; Accurate for Ranged XP focus',
        'Ranging Guild at 40 Ranged (Hemenster)',
    ],
    thieving: [
        'Start pickpocketing men/women in Varrock & Falador',
        'Progress: Farmer → Warrior (Al Kharid) → Guard → Knight (Ardougne)',
        'Getting caught stuns — expect to take hits',
    ],
    money: [
        'Buy/sell flips beat low-level monster grinding for cash',
        'Bank iron ore for trade (mid-level money tip from Sal\'s player tips)',
        'Rune Mysteries → essence mining can fund early accounts',
        'Never trust "I\'ll guard you" in the wilderness',
        'General stores crash prices when overstocked — bank for player trades / bankstand',
    ],
    combatFood: [
        'Fighters should keep a fishing→cooking loop so they never train dry',
        'Cow hides → craft leather for early crafting + combat XP together',
    ],
} as const;

/**
 * Money-making priority for bankstand / resource sells (Sal player tips era).
 * Higher = prefer stocking / selling this when banking.
 */
export const SALMONEUS_SELL_PRIORITY: Record<string, number> = {
    IRON_ORE: 90,
    COAL: 70,
    RAW_LOBSTER: 85,
    LOBSTER: 80,
    RAW_SWORDFISH: 88,
    SWORDFISH: 82,
    YEW_LOGS: 75,
    WILLOW_LOGS: 40,
    MITHRIL_ORE: 78,
    GOLD_ORE: 65,
    RAW_SHARK: 92,
    SHARK: 90,
};

/** Early F2P quests Sal listed in Dec 2004 (Everyone). */
export const SALMONEUS_F2P_QUESTS = [
    "Cook's Assistant",
    "Black Knight's Fortress",
    'Demon Slayer',
    "Doric's Quest",
    'Dragon Slayer',
    'Ernest the Chicken',
    'Goblin Diplomacy',
    'Imp Catcher',
    "Knight's Sword",
    "Pirate's Treasure",
    'Prince Ali Rescue',
    'Restless Ghost',
    'Romeo & Juliet',
    'Rune Mysteries',
    'Sheep Shearer',
    'Shield of Arrav',
    'Vampire Slayer',
    "Witch's Potion",
] as const;
