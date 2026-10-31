"""One-time, lossless scale conversion of a pinned MN225 dataset to base 100.

Writes a separate dataset; never edits the source or creates observations.
This is an authorized unit conversion, not a price correction or backfill.
"""
from __future__ import annotations

import argparse
import copy
import json
import math
from pathlib import Path


def convert(latest, state, archives, source_sha):
    if len(source_sha) != 40 or any(c not in "0123456789abcdef" for c in source_sha):
        raise ValueError("Need the pinned source commit SHA")
    if latest["baseDate"] != "2026-10-22" or latest["baseValue"] != 62907.84:
        raise ValueError("Unexpected original baseline")
    if any(state[k] != latest[k] for k in ("date", "baseDate", "baseValue", "level", "inputSHA256")):
        raise ValueError("State does not match latest")
    history = latest["history"]
    if history[0]["ew"] != 100 or history[0]["date"] != latest["baseDate"] or history[-1]["date"] != latest["date"]:
        raise ValueError("Invalid original history")
    if set(archives) != {row["date"] for row in history[1:]}:
        raise ValueError("Need every original dated archive")
    for previous, row in zip(history, history[1:]):
        archive = archives[row["date"]]
        if row["date"] <= previous["date"] or not math.isclose(row["ew"], previous["ew"] * (1 + row["return"]), rel_tol=0, abs_tol=1e-10):
            raise ValueError("Broken original chain")
        if archive["date"] != row["date"] or archive["breadth"] != row or not math.isclose(archive["level"], row["ew"] * latest["baseValue"] / 100, rel_tol=0, abs_tol=1e-7):
            raise ValueError("Archive does not match original history")
    if not math.isclose(latest["level"], history[-1]["ew"] * latest["baseValue"] / 100, rel_tol=0, abs_tol=1e-7):
        raise ValueError("Original level does not match history")
    manifest = {
        "kind": "unit-conversion", "sourceCommit": source_sha,
        "sourceBaseDate": latest["baseDate"], "sourceBaseValue": latest["baseValue"],
        "targetBaseValue": 100, "factor": 100 / latest["baseValue"],
        "lastObservationDate": latest["date"], "observationCount": len(history),
        "note": "Only level and pointChange units changed. Dates, returns, input hashes, official closes and normalized company histories are unchanged. Original root files remain immutable."
    }
    new_latest, new_state = copy.deepcopy(latest), copy.deepcopy(state)
    for value in (new_latest, new_state):
        value["baseValue"] = 100
        value["level"] = history[-1]["ew"]
        value["scaleConversion"] = manifest
    new_latest["pointChange"] = history[-1]["ew"] - history[-2]["ew"]
    files = {"latest.json": new_latest, "state.json": new_state, "scale-conversion.json": manifest}
    for previous, row in zip(history, history[1:]):
        archive = copy.deepcopy(archives[row["date"]])
        archive.update(baseDate=latest["baseDate"], baseValue=100, level=row["ew"], pointChange=row["ew"] - previous["ew"], scaleConversion=manifest)
        files[f'history/{row["date"]}.json'] = archive
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--source-sha", required=True)
    args = parser.parse_args()
    if args.output.exists() and any(args.output.iterdir()):
        raise ValueError("Output must be empty; never overwrite a published dataset")
    read = lambda path: json.loads(path.read_text())
    files = convert(read(args.data / "latest.json"), read(args.data / "state.json"), {p.stem: read(p) for p in (args.data / "history").glob("*.json")}, args.source_sha)
    for name, value in files.items():
        path = args.output / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
    print(json.dumps({"date": files["latest.json"]["date"], "baseValue": 100, "level": files["latest.json"]["level"], "paths": list(files)}))


if __name__ == "__main__":
    main()
