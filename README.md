# Bot Knowledge Pack (benzyme / 2004sp-progressive)

Private share of the AI bot **knowledge** layer from Lost City 254 progressive.

## Contents

### `knowledge/`
| File | What it is |
|------|------------|
| `BotKnowledge.ts` | Locations, shops, items, skill step tables, starter kits |
| `BotGuideKnowledge.ts` | Merges era guide packs into planner bias |
| `BotZybez.ts` | Pre-GE street prices + marketplace playbook (Zybez) |
| `BotSalmoneus.ts` | Sal's Realm training / money tips (~Dec 2004) |
| `BotLostHq.ts` | LostHQ unlock tables / method notes |
| `BotOsrsGuide.ts` | OSRSGuide-style beginner / fighter weights |
| `BotRuneHq.ts` | RuneHQ-flavoured tips |
| `BotPking.ts` | PKing guide pack |
| `BotMarket.ts` | Falador Park street-market hub + stall spots |
| `BotNeeds.ts` | Tool / purchase need helpers |
| `BotQuests.ts` | Quest-related bot knowledge |
| `BotWorld.ts` | World helpers bots use |
| `bots.config.json` | Bot roster + planner types |

### `data/`
Bot phrase / chat response JSON used alongside knowledge.

## Notes
- These are TypeScript sources from the live engine; not a runnable bot stack by themselves.
- Falador Park is the intended buy/sell hub (see `BotMarket.ts`).
- Shared privately for review — do not redistribute.

## Access
Private repo. Collaborator: [@lulwut](https://github.com/lulwut)
