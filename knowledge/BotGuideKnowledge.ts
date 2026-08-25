/**
 * BotGuideKnowledge.ts
 *
 * Maps each bot personality to the right 2004 skill guides and play advice.
 *
 * Primary sources (revision-accurate):
 *   https://2004.losthq.rs/          — unlock tables, guilds, transport (BotLostHq.ts)
 *   https://runescape.salmoneus.net/ — 2000–2005 play style / player tips (BotSalmoneus.ts)
 *   https://www.runehq.com/          — 2003–2005 money, combat ladder, speed tips (BotRuneHq.ts)
 *   https://www.zybez.net/           — marketplace / street trading (BotZybez.ts)
 *   https://www.osrsguide.com/       — modern guides filtered to 2004-safe tips (BotOsrsGuide.ts)
 *     Wayback Dec 2004–2005 snapshots used for era content
 *
 *   Skillers  → gathering/artisan + Sal/RuneHQ money loops (iron, fish, logs, essence)
 *   Fighters  → combat ladder + food pipeline (Barb→Giants, fish→cook→fight)
 *   Balanced  → both + early Lumbridge loop
 *
 * Modern OSRS/RS3 methods in UNAVAILABLE_ON_REVISION are ignored.
 */

import Player from '#/engine/entity/Player.js';
import { PlayerStat, getBaseLevel } from '#/engine/bot/BotAction.js';
import { Items, Locations, SkillProgression, type SkillStep } from '#/engine/bot/BotKnowledge.js';
import {
    LOSTHQ_COMBAT_SKILLS,
    LOSTHQ_SKILLER_SKILLS,
    LOSTHQ_TO_PLANNER,
    lostHqSkillUrl,
} from '#/engine/bot/BotLostHq.js';
import {
    SALMONEUS_COMBAT_GUIDES,
    SALMONEUS_HOME,
    SALMONEUS_PLAYBOOK,
    SALMONEUS_SKILLER_GUIDES,
    SALMONEUS_WAYBACK,
    salmoneusSkillUrl,
} from '#/engine/bot/BotSalmoneus.js';
import {
    RUNEHQ_COMBAT_GUIDES,
    RUNEHQ_HOME,
    RUNEHQ_PLAYBOOK,
    RUNEHQ_SKILLER_GUIDES,
    RUNEHQ_SPECIAL,
    RUNEHQ_WAYBACK,
    runeHqSkillUrl,
} from '#/engine/bot/BotRuneHq.js';
import {
    ZYBEZ_TRADE_PLAYBOOK,
} from '#/engine/bot/BotZybez.js';
import {
    OSRSGUIDE_BEGINNER_TARGETS,
    OSRSGUIDE_IGNORE,
    OSRSGUIDE_PAGES,
    OSRSGUIDE_PLAYBOOK,
    OSRSGUIDE_SKILLER_WEIGHTS,
} from '#/engine/bot/BotOsrsGuide.js';
import {
    PKING_ARCHIVE_GUIDES,
    PKING_PLAYBOOK,
    SAL_WILD_SURVIVAL,
    TIPIT_BEGINNERS,
} from '#/engine/bot/BotPking.js';

export { LOSTHQ_TRAINING, lostHqSkillUrl, LOSTHQ_GUILDS, LOSTHQ_SPECIAL, LOSTHQ_EARLY_QUESTS } from '#/engine/bot/BotLostHq.js';
export {
    SALMONEUS_PLAYBOOK,
    SALMONEUS_HOME,
    SALMONEUS_WAYBACK,
    salmoneusSkillUrl,
    SALMONEUS_SELL_PRIORITY,
} from '#/engine/bot/BotSalmoneus.js';
export {
    RUNEHQ_PLAYBOOK,
    RUNEHQ_HOME,
    RUNEHQ_WAYBACK,
    runeHqSkillUrl,
    RUNEHQ_SPECIAL,
} from '#/engine/bot/BotRuneHq.js';
export {
    ZYBEZ_TRADE_PLAYBOOK,
    ZYBEZ_GUIDES,
    ZYBEZ_HOME,
    ZYBEZ_WAYBACK,
    merchMidPrice,
    merchBuyPrice,
    merchSellPrice,
    merchBotToBotPrice,
    isHighVolumeMerch,
} from '#/engine/bot/BotZybez.js';
export {
    OSRSGUIDE_PLAYBOOK,
    OSRSGUIDE_PAGES,
    OSRSGUIDE_HOME,
    OSRSGUIDE_IGNORE,
} from '#/engine/bot/BotOsrsGuide.js';
export {
    PKING_PLAYBOOK,
    PKING_ARCHIVE_GUIDES,
    PK_HOTSPOTS,
    RSBADB_PKING_GUIDE,
    TIPIT_BEGINNERS,
    SAL_WILD_SURVIVAL,
    SAL_WILD_PK_SPOTS,
} from '#/engine/bot/BotPking.js';
export const REVISION_DATE = '2004-09-07';

/** Modern methods bots must never chase even if a wiki/OSRSGuide page recommends them. */
export const UNAVAILABLE_ON_REVISION = [
    'grand_exchange',
    'forestry',
    'foresters_campfire',
    'ferox_enclave',
    'canoe_to_ferox',
    'stronghold_of_security',
    'ruins_of_camdozaal',
    'barronite',
    'below_ice_mountain',
    'chronicle',
    'adventure_paths_rewards',
    'tick_manipulation',
    'ogresses',
    'brutus',
    'corsair_cove',
    'guardians_of_the_rift',
    'wintertodt',
    'blast_furnace',
    'motherlode_mine',
    'volcanic_mine',
    'tempoross',
    'aerial_fishing',
    ...OSRSGUIDE_IGNORE,
] as const;

export type GuideStyle = 'skiller' | 'fighter' | 'balanced';

export interface StyleGuidePack {
    style: GuideStyle;
    /** Wiki pages this style follows (human-readable). */
    guides: string[];
    /** Primary skills this style trains from those guides. */
    primarySkills: string[];
    /** Absolute skill weights while following the pack (after beginner phase). */
    weights: Partial<Record<string, number>>;
    /** Preferred location keys (x,z,level) for step selection. */
    preferredLocKeys: Set<string>;
}

function locKey(loc: [number, number, number] | readonly number[]): string {
    return `${loc[0]},${loc[1]},${loc[2] ?? 0}`;
}

function keysOf(...locs: [number, number, number][]): Set<string> {
    return new Set(locs.map(locKey));
}

/** New Player / OSRSGuide chapter-1 milestones (minus Adventure Path / SoS). */
export const BEGINNER_MILESTONES: Partial<Record<string, number>> = {
    ...OSRSGUIDE_BEGINNER_TARGETS,
    ATTACK: 10,
    STRENGTH: 10,
    DEFENCE: 10,
};

const LUMBRIDGE_LOOP = keysOf(
    Locations.TREES_LUMBRIDGE,
    Locations.FIRE_LUMBRIDGE_ROAD,
    Locations.CHICKENS_LUMBRIDGE,
    Locations.CHICKENS_LUMBRIDGE2,
    Locations.GOBLINS_LUMBRIDGE,
    Locations.COWS_LUMBRIDGE,
    Locations.COWS_LUMBRIDGE2,
    Locations.MINE_LUMBRIDGE_SWAMP,
    Locations.FISH_ALKHARID,
    Locations.FISH_DRAYNOR,
    Locations.LUMBRIDGE_SHEEP,
    Locations.LUMBRIDGE_GENERAL,
    Locations.AL_KHARID_FURNACE,
    Locations.AL_KHARID_RANGE,
    Locations.ALKHRAID_RANGE,
    Locations.MINE_VARROCK_WEST,
    Locations.OAKS_VARROCK
);

const SKILLER_LOCS = keysOf(
    Locations.TREES_LUMBRIDGE,
    Locations.OAKS_VARROCK,
    Locations.WILLOWS_DRAYNOR,
    Locations.WILLOWS_BARBARIAN,
    Locations.MAPLES_SEERS,
    Locations.YEWS_VARROCK,
    Locations.YEWS_FALADOR,
    Locations.MAGICS_SEERS,
    Locations.FISH_ALKHARID,
    Locations.FISH_DRAYNOR,
    Locations.FISH_BARBARIAN,
    Locations.FISH_KARAMJA,
    Locations.FISH_CATHERBY,
    Locations.FISH_SHARK,
    Locations.MINE_LUMBRIDGE_SWAMP,
    Locations.MINE_VARROCK_WEST,
    Locations.MINE_VARROCK_EAST,
    Locations.MINE_DWARVEN,
    Locations.MINE_AL_KHARID,
    Locations.MINE_RIMMINGTON,
    Locations.AL_KHARID_FURNACE,
    Locations.FALADOR_FURNACE,
    Locations.VARROCK_ANVIL,
    Locations.AL_KHARID_RANGE,
    Locations.ALKHRAID_RANGE,
    Locations.VARROCK_RANGE,
    Locations.FALADOR_RANGE,
    Locations.FIRE_LUMBRIDGE_ROAD,
    Locations.DRAYNOR_BANK,
    Locations.SEERS_BANK,
    Locations.GNOME_AGILITY,
    Locations.BARBARIAN_AGILITY
);

const FIGHTER_LOCS = keysOf(
    Locations.CHICKENS_LUMBRIDGE,
    Locations.CHICKENS_LUMBRIDGE2,
    Locations.GOBLINS_LUMBRIDGE,
    Locations.COWS_LUMBRIDGE,
    Locations.COWS_LUMBRIDGE2,
    Locations.BARBARIANS_VILLAGE,
    Locations.AL_KHARID_WARRIORS,
    Locations.GUARDS_FALADOR,
    Locations.GUARDS_VARROCK_SOUTH,
    Locations.MEN_EDGEVILLE,
    Locations.MONKS_MONASTERY,
    Locations.DARK_WIZARDS_DRAYNOR,
    Locations.HILL_GIANTS_EDGEVILLE, // RuneHQ money ladder
    Locations.MOSS_GIANTS_WEST, // RuneHQ money ladder
    Locations.VARROCK_ARCHERY,
    Locations.VARROCK_RUNES,
    Locations.VARROCK_STAFFS,
    Locations.AL_KHARID_SCIMITARS
);

/**
 * Right guide pack for each bot style.
 * Skillers follow gathering/artisan F2P training guides.
 * Fighters follow melee / combat training guides.
 * Balanced follows the New Player Guide mix of both.
 */
export const STYLE_GUIDE_PACKS: Record<GuideStyle, StyleGuidePack> = {
    skiller: {
        style: 'skiller',
        guides: [
            ...LOSTHQ_SKILLER_SKILLS.map(lostHqSkillUrl),
            ...SALMONEUS_SKILLER_GUIDES,
            ...RUNEHQ_SKILLER_GUIDES,
            `${SALMONEUS_WAYBACK}tips.html`,
            RUNEHQ_SPECIAL.moneyMaking,
            RUNEHQ_SPECIAL.essenceRunning,
            OSRSGUIDE_PAGES.beginners,
            OSRSGUIDE_PAGES.skillingMoney,
        ],
        primarySkills: LOSTHQ_SKILLER_SKILLS.map(s => LOSTHQ_TO_PLANNER[s]).filter(Boolean),
        weights: {
            WOODCUTTING: 18,
            FISHING: 20,
            // Sal player tip: iron ore money loop is strong mid-game
            MINING: 18,
            COOKING: 16,
            SMITHING: 14,
            FIREMAKING: 10,
            CRAFTING: 12,
            FLETCHING: 14,
            THIEVING: 12,
            AGILITY: 10,
            RUNECRAFT: 8, // Sal: Rune Mysteries → essence sells
            HERBLORE: 8,
            PRAYER: 6,
            ATTACK: 2,
            STRENGTH: 2,
            DEFENCE: 2,
            ...OSRSGUIDE_SKILLER_WEIGHTS,
        },
        preferredLocKeys: SKILLER_LOCS,
    },
    fighter: {
        style: 'fighter',
        // Era combat + wild: LostHQ unlocks, Sal/RuneHQ ladders, Tip.it / Sal PK archives.
        // Modern OSRSGuide combat pages are filtered out (Gem Crab / NMZ / Scurrius).
        guides: [
            ...LOSTHQ_COMBAT_SKILLS.map(lostHqSkillUrl),
            ...SALMONEUS_COMBAT_GUIDES,
            ...RUNEHQ_COMBAT_GUIDES,
            salmoneusSkillUrl('fishing'),
            salmoneusSkillUrl('cooking'),
            runeHqSkillUrl('fishing'),
            runeHqSkillUrl('cooking'),
            runeHqSkillUrl('prayer'),
            RUNEHQ_SPECIAL.fightingTips,
            RUNEHQ_SPECIAL.speedTraining,
            RUNEHQ_SPECIAL.moneyMaking,
            ...PKING_ARCHIVE_GUIDES,
        ],
        primarySkills: LOSTHQ_COMBAT_SKILLS.map(s => LOSTHQ_TO_PLANNER[s]).filter(Boolean),
        // Tripod / RuneHQ: Strength (max hit) first, then Attack, then Defence.
        // Food pipeline + Protect Item prayer stay elevated.
        weights: {
            STRENGTH: 34,
            ATTACK: 28,
            DEFENCE: 18,
            HITPOINTS: 10,
            RANGED: 10,
            MAGIC: 6,
            PRAYER: 12,
            FISHING: 12,
            COOKING: 14,
            WOODCUTTING: 2,
            FIREMAKING: 2,
        },
        preferredLocKeys: FIGHTER_LOCS,
    },
    balanced: {
        style: 'balanced',
        // Mix early Lumbridge (Tip.it / LostHQ / Sal) + light combat + skilling money.
        guides: [
            'https://2004.losthq.rs/?p=skillguides',
            'https://2004.losthq.rs/?p=specialguides&guide=transportation',
            TIPIT_BEGINNERS,
            SALMONEUS_HOME,
            RUNEHQ_HOME,
            `${SALMONEUS_WAYBACK}tips.html`,
            RUNEHQ_SPECIAL.moneyMaking,
            RUNEHQ_SPECIAL.fightingTips,
            ...LOSTHQ_SKILLER_SKILLS.slice(0, 6).map(lostHqSkillUrl),
            ...LOSTHQ_COMBAT_SKILLS.slice(0, 4).map(lostHqSkillUrl),
            ...SALMONEUS_SKILLER_GUIDES.slice(0, 4),
            ...RUNEHQ_SKILLER_GUIDES.slice(0, 4),
            ...SALMONEUS_COMBAT_GUIDES.slice(0, 3),
            OSRSGUIDE_PAGES.beginners, // filtered — ignore GE / SoS / Adventure Paths
            SAL_WILD_SURVIVAL,
        ],
        primarySkills: [
            'ATTACK',
            'STRENGTH',
            'DEFENCE',
            'WOODCUTTING',
            'FISHING',
            'MINING',
            'COOKING',
            'FIREMAKING',
            'CRAFTING',
            'FLETCHING',
            'SMITHING',
            'AGILITY',
            'PRAYER',
        ],
        weights: {
            ATTACK: 14,
            STRENGTH: 14,
            DEFENCE: 10,
            WOODCUTTING: 12,
            FISHING: 12,
            MINING: 12,
            COOKING: 12,
            SMITHING: 8,
            FIREMAKING: 8,
            CRAFTING: 8,
            FLETCHING: 10,
            RANGED: 6,
            MAGIC: 5,
            PRAYER: 8,
            RUNECRAFT: 6,
            HERBLORE: 4,
            AGILITY: 8,
            THIEVING: 6,
            HITPOINTS: 6,
        },
        preferredLocKeys: new Set([...LUMBRIDGE_LOOP, ...SKILLER_LOCS, ...FIGHTER_LOCS]),
    },
};

/** Beginner Lumbridge weights — shared first chapter of the New Player Guide. */
const BEGINNER_WEIGHTS_BY_STYLE: Record<GuideStyle, Partial<Record<string, number>>> = {
    skiller: {
        WOODCUTTING: 24,
        FISHING: 24,
        MINING: 20,
        COOKING: 18,
        FIREMAKING: 14,
        SMITHING: 12,
        CRAFTING: 6,
        // Tiny combat so they can grab feathers for fly fishing
        ATTACK: 6,
        STRENGTH: 4,
        DEFENCE: 4,
        PRAYER: 8,
    },
    fighter: {
        ATTACK: 26,
        STRENGTH: 26,
        DEFENCE: 20,
        PRAYER: 10,
        // Sal beginner: cook chicken/shrimp so you can keep fighting
        COOKING: 14,
        FISHING: 12,
        WOODCUTTING: 6,
        FIREMAKING: 6,
        MINING: 2,
    },
    balanced: {
        WOODCUTTING: 18,
        FISHING: 18,
        MINING: 14,
        COOKING: 14,
        FIREMAKING: 12,
        SMITHING: 8,
        ATTACK: 16,
        STRENGTH: 16,
        DEFENCE: 12,
        PRAYER: 8,
        CRAFTING: 4,
    },
};

export function styleFromPersonalityName(name: string): GuideStyle {
    const n = name.toLowerCase();
    if (n.includes('skiller')) return 'skiller';
    if (n.includes('fighter')) return 'fighter';
    return 'balanced';
}

export function getStylePack(style: GuideStyle): StyleGuidePack {
    return STYLE_GUIDE_PACKS[style];
}

export function isBeginnerPhase(player: Player, style: GuideStyle): boolean {
    const milestones =
        style === 'fighter'
            ? { ATTACK: 10, STRENGTH: 10, DEFENCE: 10 }
            : style === 'skiller'
              ? { WOODCUTTING: 10, FISHING: 10, MINING: 10, COOKING: 10 }
              : BEGINNER_MILESTONES;

    const skillStat: Record<string, PlayerStat> = {
        ATTACK: PlayerStat.ATTACK,
        STRENGTH: PlayerStat.STRENGTH,
        DEFENCE: PlayerStat.DEFENCE,
        WOODCUTTING: PlayerStat.WOODCUTTING,
        FISHING: PlayerStat.FISHING,
        MINING: PlayerStat.MINING,
        COOKING: PlayerStat.COOKING,
        FIREMAKING: PlayerStat.FIREMAKING,
    };

    for (const [skill, goal] of Object.entries(milestones)) {
        const stat = skillStat[skill];
        if (stat === undefined || goal === undefined) continue;
        if (getBaseLevel(player, stat) < goal) return true;
    }
    return false;
}

/**
 * Resolve the weight table for this bot:
 * personality base → style guide pack → beginner New Player overlay.
 */
export function resolveGuideWeights(
    personalityName: string,
    personalityWeights: Partial<Record<string, number>>,
    player: Player
): Partial<Record<string, number>> {
    const style = styleFromPersonalityName(personalityName);
    const pack = getStylePack(style);
    const beginner = isBeginnerPhase(player, style);

    if (beginner) {
        return { ...BEGINNER_WEIGHTS_BY_STYLE[style] };
    }

    // After beginner chapter: style pack dominates, personality fills gaps
    const out: Record<string, number> = {};
    for (const [skill, w] of Object.entries(pack.weights)) {
        if (typeof w === 'number' && w > 0) out[skill] = w;
    }
    for (const [skill, w] of Object.entries(personalityWeights)) {
        if (!w || w <= 0) continue;
        if (out[skill] === undefined) {
            out[skill] = Math.floor(w * 0.5);
        } else {
            out[skill] = Math.max(out[skill], Math.floor((out[skill] + w) / 2));
        }
    }
    return out;
}

export function shouldBankstand(player: Player, style: GuideStyle): boolean {
    // Fighters bankstand less often; skillers sell resources after beginner chapter
    if (isBeginnerPhase(player, style)) return false;
    if (style === 'fighter') return Math.random() < 0.15;
    return true;
}

function isPreferredStep(step: SkillStep, preferred: Set<string>): boolean {
    return preferred.has(locKey(step.location));
}

/**
 * Guide-aware progression pick: prefers locations from this style's training guides.
 * Salmoneus bias: skillers favour iron ore mid-levels (player-tip money loop).
 */
export function getGuideProgressionStep(
    skill: string,
    level: number,
    style: GuideStyle,
    player: Player,
    hasItems?: (toolItemIds: number[]) => boolean
): SkillStep | null {
    const steps = SkillProgression[skill];
    if (!steps || steps.length === 0) return null;

    let matching = steps.filter(s => level >= s.minLevel && level <= s.maxLevel);
    if (hasItems) matching = matching.filter(s => hasItems(s.toolItemIds));
    if (matching.length === 0) return null;

    const beginner = isBeginnerPhase(player, style);
    const preferred = beginner ? LUMBRIDGE_LOOP : getStylePack(style).preferredLocKeys;
    let ranked = matching.filter(s => isPreferredStep(s, preferred));
    let pool = ranked.length > 0 ? ranked : matching;

    // Salmoneus player tip: iron often beats coal for coins/hour at mid levels
    if (skill === 'MINING' && style !== 'fighter' && level >= 15 && level < 60) {
        const iron = pool.filter(s => s.itemGained === Items.IRON_ORE);
        if (iron.length > 0) pool = iron;
    }

    // RuneHQ woodcutting table: willows recommended through ~60 before yews
    if (skill === 'WOODCUTTING' && style !== 'fighter' && level >= 30 && level < 60) {
        const willows = pool.filter(s => s.itemGained === Items.WILLOW_LOGS);
        if (willows.length > 0) pool = willows;
    }

    // RuneHQ combat money ladder: prefer giants over chickens once unlocked
    if (
        (skill === 'ATTACK' || skill === 'STRENGTH' || skill === 'DEFENCE') &&
        style !== 'skiller' &&
        level >= 25
    ) {
        const giants = pool.filter(s => {
            const key = locKey(s.location);
            return key.includes('3114,9840') || key.includes('2576,3401') || key.includes('3082,3434');
        });
        if (giants.length > 0 && Math.random() < 0.7) pool = giants;
    }

    // OSRSGuide beginner combat: chickens → goblins → cows before leaving Lumbridge
    if (
        (skill === 'ATTACK' || skill === 'STRENGTH' || skill === 'DEFENCE') &&
        style !== 'skiller' &&
        level < 15
    ) {
        const chickens = pool.filter(s => {
            const key = locKey(s.location);
            return key.includes('3237,3295') || key.includes('3188,3278');
        });
        if (chickens.length > 0 && level < 8) pool = chickens;
        else {
            const goblins = pool.filter(s => locKey(s.location).includes('3258,3236'));
            if (goblins.length > 0 && level < 12) pool = goblins;
        }
    }

    // OSRSGuide: fly fishing at Barb after 20 (permanent fire nearby)
    if (skill === 'FISHING' && level >= 20 && level < 40 && style !== 'fighter') {
        const fly = pool.filter(s => locKey(s.location).includes('3105,3432'));
        if (fly.length > 0 && Math.random() < 0.65) pool = fly;
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

/** Expose playbooks for planners / debug. */
export function getSalmoneusPlaybook() {
    return SALMONEUS_PLAYBOOK;
}

export function getRuneHqPlaybook() {
    return RUNEHQ_PLAYBOOK;
}

export function getZybezTradePlaybook() {
    return ZYBEZ_TRADE_PLAYBOOK;
}

export function getOsrsGuidePlaybook() {
    return OSRSGUIDE_PLAYBOOK;
}

export function getPkingPlaybook() {
    return PKING_PLAYBOOK;
}
