/**
 * BotPking.ts
 *
 * Wilderness PKing knowledge for bots — distilled from 2000–2005 era fansites
 * (Wayback / surviving copies). Prefer these over modern OSRS PK meta.
 *
 * Primary archive sources:
 *   Tip.it Beginners Guide — Wilderness section (ditch, skull, Protect Item, CB bracket)
 *     https://web.archive.org/web/20050515000000/http://www.tip.it/runescape/index.php?page=beginners_guide.htm
 *   Tip.it Prayer Guide — Protect Item (25) keeps +1 on death
 *     https://web.archive.org/web/20050515000000/http://www.tip.it/runescape/index.php?page=prayer_guide.htm
 *   RuneHQ Fighting Tips (entered Jul 2004) — food (lobbies/swordies), strength pots, skull note
 *     https://web.archive.org/web/20050501000000/http://www.runehq.com/RHQSpecialReportsView.php?id=00394
 *   Sal's Realm — Wilderness Survival + PKing Spots (F2P Edgeville/Varrock/Hill/Moss/Rune Rocks)
 *     https://runescape.salmoneus.net/tips/wilderness-survival-guide.html
 *     https://runescape.salmoneus.net/tips/wilderness-pking-spots.html
 *   Tripod F2P PKing Guide — pure styles (mith/addy/rune), food #1, partners, Bandit Camp
 *     http://dragon-masters1.tripod.com/id10.html
 *   RSBaDB PKing thread — combat triangle, wild brackets, teams
 *     https://www.rsbandb.com/forums/viewtopic.php?f=1&t=7481
 *
 * Pre-GE / Sept 2004 progressive: skull + Protect Item rules; F2P wild ~1–50;
 * no TeleBlock meta for F2P (Sal: F2P has stronger pure skill, no TB/freeze spam).
 */

export const PKING_REVISION_SNAPSHOT = '2004-09';

export const TIPIT_WAYBACK =
    'https://web.archive.org/web/20050515000000/http://www.tip.it/runescape/';
export const TIPIT_BEGINNERS = `${TIPIT_WAYBACK}index.php?page=beginners_guide.htm`;
export const TIPIT_PRAYER = `${TIPIT_WAYBACK}index.php?page=prayer_guide.htm`;

export const RUNEHQ_FIGHTING_TIPS =
    'https://web.archive.org/web/20050501000000/http://www.runehq.com/RHQSpecialReportsView.php?id=00394';

export const SAL_WILD_SURVIVAL =
    'https://runescape.salmoneus.net/tips/wilderness-survival-guide.html';
export const SAL_WILD_PK_SPOTS =
    'https://runescape.salmoneus.net/tips/wilderness-pking-spots.html';

export const TRIPOD_PKING_GUIDE = 'http://dragon-masters1.tripod.com/id10.html';
export const RSBADB_PKING_GUIDE =
    'https://www.rsbandb.com/forums/viewtopic.php?f=1&t=7481';

/** Curated URLs for fighter / PK guide packs. */
export const PKING_ARCHIVE_GUIDES = [
    TIPIT_BEGINNERS,
    TIPIT_PRAYER,
    RUNEHQ_FIGHTING_TIPS,
    SAL_WILD_SURVIVAL,
    SAL_WILD_PK_SPOTS,
    TRIPOD_PKING_GUIDE,
    RSBADB_PKING_GUIDE,
] as const;

export type PkCombatStyle = 'melee' | 'range' | 'mage' | 'unknown';

export const PKING_PLAYBOOK = {
    mechanics: [
        'Tip.it: ditch marks wild entry — skull icon shows wild level / CB attack range',
        'Wild level = ±combat you can attack; deeper north = wider bracket, more risk',
        'Unskulled death: keep 3 most expensive; skulled: keep 1 (Protect Item @25 → +1 keep)',
        'Tip.it: explore with junk gear first until skull / keep rules feel natural',
        'Teleports fail past ~level 20 wilderness (era Tip.it) — plan run-outs',
    ],
    pure: [
        'Tripod: all pures push Strength — max hit wins F2P PK more than tank Def',
        'Classic low-Def pure: keep combat low, stack Atk/Str (and Range for HP)',
        'Tripod styles: Mithril / Addy / Rune “pures” — heavier armour as CB rises',
        'Rune Scimitar = era staple (speed); optional Rune 2h for big hits',
        'Sal F2P: no DDS 1-hit / TeleBlock / freeze spam — tactics matter more',
    ],
    supplies: [
        'RuneHQ Fighting Tips: always bring lots of food — lobbies or swordfish best',
        'RuneHQ: Strength potion before / as you engage',
        'Sal rune-rock miners: 4–6 swordies/lobbies if CB 100+; up to ~10 if CB <70',
        'Protect Item (Prayer 25) — Tip.it / every PK guide; skulled risk is real',
        'Members sharks when deep multi; F2P stick to lobster/swordfish',
    ],
    spots: [
        'Sal F2P: Edgeville / Varrock ditch wild (~1–5) — pure teams, multi patches',
        'Sal: Hill Giants wild (~16–19) — multi, high CB PK traffic',
        'Sal: Moss Giants — trainers + PKers; watch for piles',
        'Sal / Tip.it classic: Rune Rocks (~42–46) — miner PK + scout worlds',
        'Sal: Dark Warriors’ Fortress / Bandit Camp — multi, cook/loot loops',
        'Sal high: Demonic Ruins / Greater Demons — multi, hard escape',
        'Edgeville 1–10: run / trees / prayer often beat teleport once past ~10',
    ],
    triangle: [
        'RSBaDB: Mage beats Warrior (light, kites, shreds plate)',
        'Ranger beats Mage (dhide + distance)',
        'Warrior beats Ranger (plate tanks arrows)',
        'Tripod: partners help — two melee + a ranger/mage beats solos in multi',
    ],
    tactics: [
        'Sal: Death Dot / Box Formation for clans — compact pile looks like one target',
        'Sal: do not run into multi when escaping rune-rock packs — peel east / NPCs',
        'Tripod: food first; adapt to opponent style; don’t trust strangers in wild',
        'RuneHQ: if skulled + Protect Item you still only keep 1 when prayer drops — watch points',
    ],
} as const;

/** Approx wilderness level from absolute Z (Lost City / RS2 layout). */
export const WILD_Z_START = 3520;

export function wildernessLevelFromZ(z: number): number {
    if (z < WILD_Z_START) return 0;
    return Math.max(1, Math.floor((z - WILD_Z_START) / 8) + 1);
}

export function inWildCombatRange(wildLevel: number, aCb: number, bCb: number): boolean {
    if (wildLevel <= 0) return false;
    return Math.abs(aCb - bCb) <= wildLevel;
}

/**
 * Hotspots from Sal Tip.it-era wild guides (absolute coords, approximate).
 */
export const PK_HOTSPOTS = {
    edgevilleDitch: { x: 3088, z: 3526, wildApprox: 1, note: 'Edgeville ditch — Sal low-level / pure teams' },
    edgevilleWild10: { x: 3085, z: 3600, wildApprox: 10, note: 'Edgeville wild ~10 — trees / run escapes' },
    varrockDitch: { x: 3240, z: 3526, wildApprox: 1, note: 'Varrock wilderness ditch' },
    hillGiantsWild: { x: 3110, z: 3650, wildApprox: 17, note: 'Sal Hill Giants multi ~16–19' },
    graveyard: { x: 3164, z: 3671, wildApprox: 19, note: 'Graveyard of Shadows' },
    banditCamp: { x: 3038, z: 3700, wildApprox: 23, note: 'Bandit Camp multi — Tripod / Sal' },
    darkWarriors: { x: 3030, z: 3630, wildApprox: 14, note: 'Dark Warriors Fortress' },
    mossGiantsWild: { x: 3150, z: 3750, wildApprox: 29, note: 'Moss giants / mid wild trainers' },
    runeRocksApproach: { x: 3050, z: 3848, wildApprox: 42, note: 'Approach to rune rocks (~wild 42)' },
    runeRocks: { x: 3061, z: 3884, wildApprox: 46, note: 'Rune rocks / Lava Maze — Sal miner PK' },
    demonicRuins: { x: 3288, z: 3886, wildApprox: 46, note: 'Demonic Ruins / Greater Demons multi' },
    mageBankExit: { x: 3089, z: 3960, wildApprox: 54, note: 'Mage Arena wilderness exit' },
} as const;

/** Deep-wild patrol tiles for PKerTask (Sal / Tip.it hotspots). */
export const PK_DEEP_GUIDE_ZONES: readonly [number, number][] = [
    [PK_HOTSPOTS.edgevilleWild10.x, PK_HOTSPOTS.edgevilleWild10.z],
    [PK_HOTSPOTS.hillGiantsWild.x, PK_HOTSPOTS.hillGiantsWild.z],
    [PK_HOTSPOTS.graveyard.x, PK_HOTSPOTS.graveyard.z],
    [PK_HOTSPOTS.banditCamp.x, PK_HOTSPOTS.banditCamp.z],
    [PK_HOTSPOTS.darkWarriors.x, PK_HOTSPOTS.darkWarriors.z],
    [PK_HOTSPOTS.mossGiantsWild.x, PK_HOTSPOTS.mossGiantsWild.z],
    [PK_HOTSPOTS.runeRocksApproach.x, PK_HOTSPOTS.runeRocksApproach.z],
    [PK_HOTSPOTS.runeRocks.x, PK_HOTSPOTS.runeRocks.z],
    [PK_HOTSPOTS.runeRocks.x + 12, PK_HOTSPOTS.runeRocks.z - 8],
    [PK_HOTSPOTS.demonicRuins.x, PK_HOTSPOTS.demonicRuins.z],
];

const RANGE_WEAPONS = new Set([841, 843, 845, 847, 849, 851, 853, 855, 857, 859, 861]);
const MAGE_WEAPONS = new Set([1381, 1383, 1385, 1387, 1389, 1391, 1393, 1395, 1397, 1399, 1401, 1403, 1405, 1407, 3053, 3054, 4675, 4710]);
const MAGE_TOPS = new Set([577, 579, 6107, 1035, 2415, 2416, 2417]);
const DHIDE_TOPS = new Set([1135, 2499, 2501, 2503]);
const PLATE_TOPS = new Set([1115, 1117, 1119, 1121, 1123, 1125, 1127]);

export function classifyCombatStyle(opts: {
    weaponId?: number;
    bodyId?: number;
    mageLevel?: number;
    rangeLevel?: number;
    atkLevel?: number;
}): PkCombatStyle {
    const w = opts.weaponId ?? -1;
    const body = opts.bodyId ?? -1;
    if (RANGE_WEAPONS.has(w) || DHIDE_TOPS.has(body)) return 'range';
    if (MAGE_WEAPONS.has(w) || MAGE_TOPS.has(body)) return 'mage';
    if (PLATE_TOPS.has(body) || (opts.atkLevel ?? 0) >= 40) return 'melee';
    const mage = opts.mageLevel ?? 1;
    const range = opts.rangeLevel ?? 1;
    const atk = opts.atkLevel ?? 1;
    if (mage >= range && mage >= atk && mage >= 50) return 'mage';
    if (range >= atk && range >= 50) return 'range';
    if (atk >= 40) return 'melee';
    return 'unknown';
}

/** RSBaDB combat triangle: +1 advantage, -1 disadvantage. */
export function triangleAdvantage(attacker: PkCombatStyle, defender: PkCombatStyle): number {
    if (attacker === 'unknown' || defender === 'unknown' || attacker === defender) return 0;
    if (attacker === 'melee' && defender === 'range') return 1;
    if (attacker === 'range' && defender === 'mage') return 1;
    if (attacker === 'mage' && defender === 'melee') return 1;
    if (attacker === 'melee' && defender === 'mage') return -1;
    if (attacker === 'range' && defender === 'melee') return -1;
    if (attacker === 'mage' && defender === 'range') return -1;
    return 0;
}

export function pkTargetScore(opts: {
    distance: number;
    myCb: number;
    theirCb: number;
    wildLevel: number;
    myStyle: PkCombatStyle;
    theirStyle: PkCombatStyle;
    extra?: number;
}): number {
    const { distance, myCb, theirCb, wildLevel, myStyle, theirStyle, extra = 0 } = opts;
    if (!inWildCombatRange(wildLevel, myCb, theirCb)) return -1e9;

    let score = 100 - distance;
    const cbGap = Math.abs(myCb - theirCb);
    score += Math.max(0, 12 - cbGap);
    if (theirCb <= myCb) score += 4;
    score += triangleAdvantage(myStyle, theirStyle) * 18;
    if (wildLevel >= 20 && cbGap <= Math.floor(wildLevel * 0.5)) score += 3;
    return score + extra;
}

export const PROTECT_ITEM_PRAYER = 25;

export const PK_FOOD = {
    f2p: 379, // lobster — RuneHQ / Tip.it era F2P staple
    mid: 373, // swordfish
    p2p: 385, // shark
} as const;

/** Sal / RuneHQ: shallow → lobster; deep → swordfish/shark. */
export function preferredPkFood(deepWild: boolean): number {
    return deepWild ? PK_FOOD.p2p : PK_FOOD.f2p;
}
