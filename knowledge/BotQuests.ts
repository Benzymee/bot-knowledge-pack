import VarPlayerType from '#/cache/config/VarPlayerType.js';
import Player from '#/engine/entity/Player.js';
import ScriptProvider from '#/engine/script/ScriptProvider.js';
import ScriptRunner from '#/engine/script/ScriptRunner.js';

const RESET_QUESTS_SCRIPT = '[queue,bot_reset_all_quests]';

/** Matches ^tutorial_complete in quest.constant — bots stay off Tutorial Island. */
const TUTORIAL_COMPLETE = 1000;

/**
 * Quest progress varps cleared to 0 so bots start incomplete and can do quests for real.
 * Keep in sync with content/scripts/general/scripts/bot_quests.rs2
 */
const QUEST_PROGRESS_VARPS = [
    'spy',
    'cookquest',
    'demonstart',
    'doricquest',
    'dragon_goblin',
    'dragon_ned_hired',
    'dragon_oracle',
    'dragon_shield',
    'dragon_wall',
    'dragonquest',
    'dragonquestvar',
    'ernestlever',
    'haunted_manor_fountain_poisoned',
    'haunted',
    'goblinquest',
    'squire',
    'imp',
    'hunt',
    'hunt_store_employed',
    'prince_keystatus',
    'princequest',
    'prieststart',
    'rjquest',
    'runemysteries',
    'sheep',
    'blackarmgang',
    'phoenixgang',
    'vampire',
    'hetty',
    'chompybird_kills',
    'chompybird',
    'biohazard',
    'cogquest',
    'cog_bits',
    'itexamlevel',
    'druidquest',
    'mcannonmulti',
    'mcannon',
    'crestquest',
    'crest_spells_levers_gauntlets',
    'arenaquest',
    'fishingcompo',
    'fluffs',
    'cat_growth',
    'grandtree',
    'hazeelcult_side',
    'hazeelcultquest',
    'heroquest',
    'grail',
    'junglepotion',
    'legendsquest',
    'zanaris',
    'arthur',
    'drunkmonkquest',
    'murdersus',
    'murder_poisonproof_progress',
    'murderquest',
    'murder_evidence',
    'itgronigen',
    'itkeepgatelock',
    'elenaquest',
    'scorpcatcher',
    'scorpius_given_symbol',
    'seaslugquest',
    'sheepherdervar',
    'sheepherderquest',
    'zombiequeen',
    'ikov_dungeon',
    'ikov',
    'desertrescue_map_mechanisms',
    'desertrescue',
    'treequest',
    'totemquest',
    'upass',
    'ibanmulti',
    'itwatchtower',
    'itwatchtower_bits',
    'waterfall_golrie_and_puzzle',
    'waterfall_quest',
    'ballquest',
    'elemental_workshop_bits',
    'priestperil',
    'druidspirit',
    'death_equiproom',
    'troll_quest',
    'barcrawl',
] as const;

function zeroQuestVarps(player: Player): void {
    for (const name of QUEST_PROGRESS_VARPS) {
        const varp = VarPlayerType.getByName(name);
        if (varp) player.setVar(varp.id, 0);
    }

    const tutorial = VarPlayerType.getByName('tutorial');
    if (tutorial) player.setVar(tutorial.id, TUTORIAL_COMPLETE);

    const qp = VarPlayerType.getByName('qp');
    if (qp) player.setVar(qp.id, 0);
}

/**
 * Clear all quest progress on this bot so they can complete quests for real.
 * Tutorial Island stays marked complete so bots never get stuck there.
 *
 * Prefer the packed RS2 reset script (also refreshes quest list colours).
 * Falls back to zeroing varps in TS if the script is not packed yet.
 *
 * Once bots earn quests legitimately and you want saves to persist across
 * restarts, stop calling this on every load.
 */
export function resetBotQuests(player: Player): void {
    const script = ScriptProvider.getByName(RESET_QUESTS_SCRIPT);
    if (script) {
        player.executeScript(ScriptRunner.init(script, player), true);
        return;
    }

    // Not packed yet — wipe in TS. Do NOT run legacy bot_complete_all_quests.
    zeroQuestVarps(player);
    console.warn(
        `[BotManager] ${RESET_QUESTS_SCRIPT} not packed — zeroed quest varps in TS. Rebuild content to refresh quest list UI.`
    );
}

/** @deprecated Use resetBotQuests — bots no longer auto-complete quests. */
export function completeBotQuests(player: Player): void {
    resetBotQuests(player);
}
