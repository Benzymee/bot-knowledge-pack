/**
 * BotZybez.ts
 *
 * Trading / marketplace knowledge from Zybez RuneScape Help (2001–2006 era).
 * Snapshot focus: late 2005 misc guides + Market Price Guide (pre-GE street trading).
 *
 * Live archive entry: http://web.archive.org/web/20100227174124/http://www.zybez.net/
 * Era guides:
 *   Market Price Guide — buy/sell RANGES (guide, not bible)
 *   Anti Scamming Guide — verify trades before accept
 *   Bank Organisation — keep trade stock tidy
 *   Text Guide — how players advertised buys/sells
 *
 * Pre-GE world (this server): trades happen at Falador Park (primary hub), not Grand Exchange.
 * Apply Zybez marketplace habits to bot↔player and bot↔bot trading.
 */

export const ZYBEZ_REVISION_SNAPSHOT = '2005-12-15';
export const ZYBEZ_HOME = 'https://www.zybez.net/';
export const ZYBEZ_WAYBACK =
    'https://web.archive.org/web/20051215000000/http://www.zybez.net/';

export const ZYBEZ_GUIDES = {
    marketPrice: `${ZYBEZ_WAYBACK}priceguide.php`,
    antiScam: `${ZYBEZ_WAYBACK}misc.php?id=29`,
    bankOrg: `${ZYBEZ_WAYBACK}misc.php?id=35`,
    textAds: `${ZYBEZ_WAYBACK}misc.php?id=5`,
    whatTrain: `${ZYBEZ_WAYBACK}misc.php?id=4`,
    gettingStarted: `${ZYBEZ_WAYBACK}gettingstarted.php`,
} as const;

/**
 * Street-trade playbook distilled from Zybez misc + marketplace guides.
 * (GE did not exist yet on this revision — all trading is face-to-face.)
 */
export const ZYBEZ_TRADE_PLAYBOOK = {
    marketplace: [
        'Prices are ranges (low–high), not a single number — Zybez Market Price Guide',
        'Guide is not a bible — use judgment; prices vary player to player',
        'High-volume resources (ores, logs, fish, runes) flip faster than rares',
        'New / hyped items are overpriced — wait before buying big',
        'Popular trade hubs: Falador Park (primary street market), then banks if needed',
        'Meet buyers/sellers in Falador Park — easier than hunting across every bank',
        'Advertise clearly: item + price each + “trade me”',
    ],
    antiScam: [
        'Always re-check the trade window before Accept — scammers swap amounts',
        'Nobody can trim / upgrade / enchant your armour for free',
        '“Free gem cutting / smithing” — verify their stats first',
        'Never drop items for Alt+F4 / “multiply” tricks',
        'Reject “trust tests” that require giving valuables first',
        'Decline weird trades; re-open if anything looks off',
    ],
    bankOrg: [
        'Cut gems rather than storing both cut + uncut',
        'Combine potion doses; drop junk food / empty glasses',
        'Quest junk can usually go — Wise Old Man checks F2P quest items',
        'Keep trade stock noted and grouped for fast bankstands',
    ],
    advertising: [
        'Players used colour/wave chat to shout offers (green:/cyan: etc.)',
        'Keep ads short: “Selling iron ore 350ea — trade me”',
    ],
} as const;

/**
 * Mid-market street prices for common F2P/members trade goods.
 * Shape mirrors Zybez ranges: bots BUY near `buy`, SELL near `sell`.
 * Tuned for Sept 2004 progressive / pre-GE street markets (not modern GE).
 */
export interface MerchQuote {
    /** Patient buy / instant-sell floor (what a buyer offers). */
    buy: number;
    /** Guide / fair mid. */
    mid: number;
    /** Patient sell / instant-buy ceiling (what a seller asks). */
    sell: number;
    /** Prefer for bot↔bot flips (high volume). */
    highVolume?: boolean;
}

/** Keyed by unnoted item id (noted = id+1 still resolves via normalize). */
export const ZYBEZ_MERCH_QUOTES: Record<number, MerchQuote> = {
    // Logs
    1511: { buy: 20, mid: 40, sell: 55, highVolume: true }, // logs
    1521: { buy: 35, mid: 50, sell: 70, highVolume: true }, // oak
    1519: { buy: 40, mid: 55, sell: 80, highVolume: true }, // willow
    1517: { buy: 140, mid: 175, sell: 220, highVolume: true }, // maple
    1515: { buy: 320, mid: 400, sell: 480, highVolume: true }, // yew
    1513: { buy: 900, mid: 1100, sell: 1300 }, // magic
    // Ores
    436: { buy: 35, mid: 50, sell: 65, highVolume: true }, // copper
    438: { buy: 35, mid: 50, sell: 65, highVolume: true }, // tin
    440: { buy: 280, mid: 350, sell: 420, highVolume: true }, // iron — Zybez/Sal high volume
    453: { buy: 520, mid: 650, sell: 780, highVolume: true }, // coal
    447: { buy: 400, mid: 500, sell: 600, highVolume: true }, // mithril
    449: { buy: 650, mid: 800, sell: 950 }, // addy
    451: { buy: 6500, mid: 8000, sell: 9500 }, // rune ore
    // Bars
    2349: { buy: 180, mid: 250, sell: 300 },
    2351: { buy: 300, mid: 400, sell: 480, highVolume: true },
    2353: { buy: 1100, mid: 1500, sell: 1800, highVolume: true },
    2359: { buy: 900, mid: 1200, sell: 1450 },
    2361: { buy: 2200, mid: 2800, sell: 3400 },
    // Fish (cooked / raw — high volume food market)
    377: { buy: 150, mid: 200, sell: 260, highVolume: true }, // raw lobster
    379: { buy: 180, mid: 250, sell: 320, highVolume: true }, // lobster
    371: { buy: 280, mid: 350, sell: 420, highVolume: true }, // raw sword
    373: { buy: 320, mid: 400, sell: 480, highVolume: true }, // swordfish
    383: { buy: 700, mid: 900, sell: 1100 }, // raw shark
    385: { buy: 800, mid: 1000, sell: 1200 },
    // Runes / ess
    1436: { buy: 35, mid: 50, sell: 65, highVolume: true }, // essence
    561: { buy: 200, mid: 250, sell: 300, highVolume: true }, // nature
    563: { buy: 240, mid: 300, sell: 360, highVolume: true }, // law
    560: { buy: 90, mid: 120, sell: 150, highVolume: true }, // death
    565: { buy: 380, mid: 500, sell: 600 }, // blood
    // Bones
    526: { buy: 40, mid: 60, sell: 80, highVolume: true },
    532: { buy: 280, mid: 400, sell: 500, highVolume: true }, // big bones
};

/** Default spread when no quote: ±15% around a mid price. */
export const DEFAULT_MERCH_SPREAD = 0.15;

/** Bot buyback ≈ Zybez low end (~85% of mid) when flipping from players/bots. */
export const MERCH_BUYBACK_OF_MID = 0.85;

/** Prefer these for bot↔bot inventory recirculation. */
export function isHighVolumeMerch(itemId: number): boolean {
    const q = quoteFor(itemId);
    return !!q?.highVolume;
}

export function quoteFor(itemId: number): MerchQuote | null {
    if (ZYBEZ_MERCH_QUOTES[itemId]) return ZYBEZ_MERCH_QUOTES[itemId];
    // noted forms are often id+1
    if (itemId > 0 && ZYBEZ_MERCH_QUOTES[itemId - 1]) return ZYBEZ_MERCH_QUOTES[itemId - 1];
    return null;
}

/** Mid / guide price (bankstand sell to players). */
export function merchMidPrice(itemId: number, fallback = 0): number {
    return quoteFor(itemId)?.mid ?? fallback;
}

/** Price a bot pays when buying (low end of Zybez-style range). */
export function merchBuyPrice(itemId: number, fallbackMid = 0): number {
    const q = quoteFor(itemId);
    if (q) return q.buy;
    if (fallbackMid > 0) return Math.max(1, Math.floor(fallbackMid * MERCH_BUYBACK_OF_MID));
    return 0;
}

/** Price a bot asks when selling (high end). */
export function merchSellPrice(itemId: number, fallbackMid = 0): number {
    const q = quoteFor(itemId);
    if (q) return q.sell;
    if (fallbackMid > 0) return Math.floor(fallbackMid * (1 + DEFAULT_MERCH_SPREAD));
    return 0;
}

/**
 * Bot↔bot fair flip: seller gets mid, buyer pays mid.
 * Still refuse if the other side's offer is outside [buy, sell] band (anti-scam).
 */
export function merchBotToBotPrice(itemId: number, fallbackMid = 0): number {
    return merchMidPrice(itemId, fallbackMid);
}

/** True if offered unit price is inside the Zybez-style acceptable band. */
export function merchPriceAcceptable(itemId: number, unitPrice: number, fallbackMid = 0): boolean {
    const q = quoteFor(itemId);
    if (q) return unitPrice >= q.buy && unitPrice <= q.sell;
    if (fallbackMid <= 0) return unitPrice > 0;
    const lo = Math.floor(fallbackMid * (1 - DEFAULT_MERCH_SPREAD));
    const hi = Math.ceil(fallbackMid * (1 + DEFAULT_MERCH_SPREAD));
    return unitPrice >= lo && unitPrice <= hi;
}
