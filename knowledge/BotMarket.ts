/**
 * BotMarket.ts — shared street-trade hub for bot↔bot and bot↔player commerce.
 *
 * Design choice: Falador Park is the primary marketplace so buyers and sellers
 * cluster in one open area (easier matching than scattered banks).
 * Pre-GE era: face-to-face trades only (Zybez street habits).
 */

import { Locations } from '#/engine/bot/BotKnowledge.js';

/** Central Falador Park meeting point (duck pond / open lawn). */
export const MARKET_HUB: [number, number, number] = [2991, 3382, 0];

/**
 * Alias on Locations for callers that already import from BotKnowledge.
 * Prefer MARKET_HUB / BotMarket helpers for new trade code.
 */
export const FALADOR_PARK_MARKET = MARKET_HUB;

/** Closest bank for restocking before / after park trading. */
export const MARKET_BANK: [number, number, number] = Locations.FALADOR_WEST_BANK;

/**
 * Fixed stall tiles around Falador Park — walkable grass / paths.
 * Assigned deterministically from username so vendors don't stack.
 */
export const MARKET_STALL_SPOTS: Array<[number, number]> = [
    // ── Around the duck pond / park centre ───────────────────
    [2991, 3382],
    [2993, 3380],
    [2989, 3380],
    [2991, 3385],
    [2994, 3384],
    [2988, 3384],
    // ── North lawn (toward castle) ───────────────────────────
    [2990, 3388],
    [2993, 3389],
    [2987, 3387],
    // ── South / west fringe (toward west bank) ───────────────
    [2985, 3378],
    [2988, 3376],
    [2992, 3376],
    [2995, 3378],
    [2984, 3382],
    // ── East fringe (toward east bank / fountain) ────────────
    [2997, 3381],
    [2998, 3384],
    [2996, 3375],
];

/** Teleport / gather radius before walking the last stretch. */
export const MARKET_ARRIVE_DIST = 50;

/** Idle wander radius while bankstanding / vending. */
export const MARKET_IDLE_RADIUS = 4;

export function marketStallForUsername(username: string): [number, number] {
    let h = 0;
    for (let i = 0; i < username.length; i++) {
        h = (h * 31 + username.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(h) % MARKET_STALL_SPOTS.length;
    return MARKET_STALL_SPOTS[idx];
}

export function isNearMarket(x: number, z: number, dist = 24): boolean {
    const [mx, mz] = MARKET_HUB;
    return Math.abs(x - mx) <= dist && Math.abs(z - mz) <= dist;
}
