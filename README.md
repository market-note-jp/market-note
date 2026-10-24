# Market Note 225 data

Append-only end-of-day observations for the public [MN225 page](https://market-note-jp.github.io/market-note/market-breadth/).

Operation and source checks: [MARKET_BREADTH_UPDATE.md](https://github.com/market-note-jp/market-note/blob/main/MARKET_BREADTH_UPDATE.md). The cloud Automation is the only writer; no scheduled Actions workflow writes this branch.

`latest.json`: aggregate history and current metrics. `state.json`: bounded normalized levels for MA25. `history/YYYY-MM-DD.json`: immutable dated aggregate observations. No source quote table is redistributed. Base: 2026-10-22 = 62,907.84 points.
