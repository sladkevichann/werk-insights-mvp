import json
import pandas as pd 

with open("events.json") as f:
    events = json.load(f)

df = pd.DataFrame(events) # turning a list of dictionaries into Pandas table

df["date"] = pd.to_datetime(df["date"]) # text date turns into Pandas date


df["month"] = df["date"].dt.to_period("M").astype(str) # taking month from date

counts = df.groupby(["month", "style"]).size().reset_index(name="count") # how many events of every style was in every month

totals = df.groupby("month").size().reset_index(name="total") # total number of events for every month

merged = counts.merge(totals, on="month") # merge 2 tables

merged["pct"] = (merged["count"] / merged["total"] * 100).round(1) # percentage of style in a month

result = merged[["month", "style", "pct"]] # leaving only necessary columns

result.to_json("style_trend.json", orient="records", indent=2) # saving to json, ready to load into data base

print(result)
print(f"\nRows saved: {len(result)}")

