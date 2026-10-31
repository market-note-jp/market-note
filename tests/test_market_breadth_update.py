import copy
import importlib.util
import json
import unittest
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("breadth_update", ROOT / "scripts/update_market_breadth.py")
u = importlib.util.module_from_spec(spec)
spec.loader.exec_module(u)
rebase_spec = importlib.util.spec_from_file_location("breadth_rebase", ROOT / "scripts/rebase_market_breadth.py")
rebase = importlib.util.module_from_spec(rebase_spec)
rebase_spec.loader.exec_module(rebase)


class AccumulatorTests(unittest.TestCase):
    def setUp(self):
        self.latest = json.loads((ROOT / "app/market-breadth/snapshot.json").read_text())
        self.calendar = self.latest["calendar"]
        self.codes = [f"A{i:03d}" for i in range(225)]
        self.state = {"schemaVersion": 1, "date": self.latest["date"], "baseDate": self.latest["baseDate"], "baseValue": self.latest["baseValue"], "level": self.latest["level"], "inputSHA256": self.latest["inputSHA256"], "normalizedLevels": {code: [100, 100] for code in self.codes}}
        self.quotes = {"date": "2026-10-29", "observedAt": "2026-10-29T15:45:00+09:00", "rows": [{"code": code, "close": 101, "change": 1, "displayedChangePct": 1} for code in self.codes]}
        self.official = {"date": "2026-10-29", "componentsAsOf": "2026-10-29", "summaryURL": "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261029&idx=nk225", "codes": self.codes[:], "close": self.latest["metrics"]["nikkeiClose"] + 20, "change": 20, "up": 225, "down": 0, "flat": 0}
        self.now = datetime.fromisoformat("2026-10-29T17:30:00+09:00")

    def run_update(self):
        return u.accumulate(self.latest, self.state, self.quotes, self.official, self.calendar, self.now)

    def test_independent_chain_and_append_without_mutating_history(self):
        before = copy.deepcopy(self.latest)
        result = self.run_update()
        latest = result["files"]["latest.json"]
        self.assertEqual(result["status"], "updated")
        self.assertAlmostEqual(latest["level"], before["level"] * 1.01)
        self.assertNotAlmostEqual(latest["level"], self.official["close"])
        self.assertEqual(latest["baseValue"], 100)
        self.assertEqual(latest["history"][:-1], before["history"])
        self.assertEqual(self.latest, before)
        self.assertEqual(set(result["files"]), {"latest.json", "state.json", "history/2026-10-29.json"})
        self.assertEqual(latest["history"][-1]["aboveMA25"], None)

    def test_old_scale_cannot_silently_return(self):
        self.latest["baseValue"] = self.state["baseValue"] = 62907.84
        with self.assertRaisesRegex(ValueError, "baseline must remain"):
            self.run_update()

    def test_scale_conversion_preserves_every_observation_and_original_input(self):
        original = copy.deepcopy(self.latest)
        original["baseValue"] = 62907.84
        original["level"] = original["history"][-1]["ew"] * 62907.84 / 100
        original["pointChange"] *= 62907.84 / 100
        state = copy.deepcopy(self.state)
        state.update(baseValue=original["baseValue"], level=original["level"])
        archives = {row["date"]: {"date": row["date"], "level": row["ew"] * 62907.84 / 100, "breadth": copy.deepcopy(row), "inputSHA256": str(i) * 64, "metrics": {"nikkeiClose": 60000 + i}} for i, row in enumerate(original["history"][1:])}
        before = copy.deepcopy((original, state, archives))
        converted = rebase.convert(original, state, archives, "a" * 40)
        self.assertEqual((original, state, archives), before)
        latest = converted["latest.json"]
        self.assertEqual(latest["baseValue"], 100)
        self.assertEqual(latest["level"], self.latest["level"])
        self.assertEqual(latest["history"], original["history"])
        self.assertEqual(latest["official"], original["official"])
        self.assertEqual(latest["inputSHA256"], original["inputSHA256"])
        self.assertEqual(converted["state.json"]["normalizedLevels"], state["normalizedLevels"])
        self.assertEqual(set(converted), {"latest.json", "state.json", "scale-conversion.json"} | {f"history/{day}.json" for day in archives})
        for day, archive in archives.items():
            changed = converted[f"history/{day}.json"]
            for key in ("date", "breadth", "inputSHA256", "metrics"):
                self.assertEqual(changed[key], archive[key])
            self.assertAlmostEqual(changed["level"], archive["level"] * 100 / 62907.84)
        with self.assertRaisesRegex(ValueError, "every original"):
            rebase.convert(original, state, {}, "a" * 40)
        archives[original["history"][-1]["date"]]["level"] += 1
        with self.assertRaisesRegex(ValueError, "Archive does not match"):
            rebase.convert(original, state, archives, "a" * 40)

    def test_same_session_is_idempotent_and_correction_is_held(self):
        first = self.run_update()["files"]
        self.latest, self.state = first["latest.json"], first["state.json"]
        self.assertEqual(self.run_update()["status"], "unchanged")
        self.quotes["rows"][0].update(close=102, change=2, displayedChangePct=2)
        with self.assertRaisesRegex(ValueError, "Past input changed"):
            self.run_update()

    def test_no_skipping_missing_session(self):
        self.quotes["date"] = self.official["date"] = self.official["componentsAsOf"] = "2026-10-30"
        self.official["summaryURL"] = self.official["summaryURL"].replace("20261029", "20261030")
        self.quotes["observedAt"] = "2026-10-30T15:45:00+09:00"
        self.now = datetime.fromisoformat("2026-10-30T17:30:00+09:00")
        with self.assertRaisesRegex(ValueError, "Missing trading session"):
            self.run_update()

    def test_missing_quote_or_duplicate_code_is_rejected(self):
        self.quotes["rows"].pop()
        with self.assertRaisesRegex(ValueError, "225 unique"):
            self.run_update()
        self.quotes["rows"].append(copy.deepcopy(self.quotes["rows"][0]))
        with self.assertRaisesRegex(ValueError, "225 unique"):
            self.run_update()

    def test_membership_and_official_counts_must_match(self):
        self.official["codes"][0] = "B000"
        with self.assertRaisesRegex(ValueError, "constituent set"):
            self.run_update()
        self.official["codes"] = self.codes[:]
        self.official.update(up=224, down=1)
        with self.assertRaisesRegex(ValueError, "counts"):
            self.run_update()

    def test_stale_intraday_wrong_return_and_previous_close_fail(self):
        self.quotes["observedAt"] = "2026-10-29T15:00:00+09:00"
        with self.assertRaisesRegex(ValueError, "intraday"):
            self.run_update()
        self.quotes["observedAt"] = "2026-10-29T15:45:00+09:00"
        self.quotes["rows"][0]["displayedChangePct"] = 2
        with self.assertRaisesRegex(ValueError, "return mismatch"):
            self.run_update()
        self.quotes["rows"][0]["displayedChangePct"] = 1
        self.official["close"] += 1
        with self.assertRaisesRegex(ValueError, "previous close"):
            self.run_update()

    def test_ma25_matures_only_with_25_observations_and_new_members_restart(self):
        self.state["normalizedLevels"] = {code: [100] * 24 for code in self.codes}
        row = self.run_update()["files"]["latest.json"]["history"][-1]
        self.assertEqual((row["aboveMA25"], row["maEligible"]), (100, 225))
        self.quotes["rows"][0]["code"] = self.official["codes"][0] = "B000"
        row = self.run_update()["files"]["latest.json"]["history"][-1]
        self.assertEqual((row["aboveMA25"], row["maEligible"]), (100, 224))

    def test_weekends_holidays_year_end_and_unknown_year(self):
        for now, expected in [("2026-10-24T18:00:00+09:00", "2026-10-23"), ("2026-11-03T18:00:00+09:00", "2026-11-02"), ("2027-01-04T15:29:00+09:00", "2026-12-30"), ("2027-01-04T15:30:00+09:00", "2027-01-04")]:
            self.assertEqual(u.latest_closed_session(datetime.fromisoformat(now), self.calendar).isoformat(), expected)
        with self.assertRaisesRegex(ValueError, "Calendar does not cover"):
            u.latest_closed_session(datetime.fromisoformat("2028-01-04T18:00:00+09:00"), self.calendar)

    def test_provider_html_implicit_cells_and_alpha_security_codes(self):
        html = '<h1>日経225銘柄</h1><div class="data_table_timestamp">2026/10/29 15:45</div><table><tr><td>架空<br>(285A/東P)</td><td>業種</td><td>1,010.5</td><td><span>+10.5</span><br>+1.05%<td>説明</td></tr></table>'
        parsed = u.parse_quotes(html)
        self.assertEqual(parsed["rows"], [{"code": "285A", "close": 1010.5, "change": 10.5, "displayedChangePct": 1.05}])
        self.assertEqual(parsed["observedAt"], "2026-10-29T15:45:00+09:00")


if __name__ == "__main__":
    unittest.main()
