# Design a news feed: storyboard

1. **Deliver or collect?** ⭐ Newspaper delivery vs newsstand. Push: "Asha posts" animates copies to six followers' feeds ("n new" badges). Pull: "Ravi opens his feed" animates fetches from six followees.
2. **The celebrity posts** ⭐ (simulation, `model.ts`). Fan-out on write / on read / hybrid with a celebrity threshold (10k, 100k, 1M followers). Bars for work at post time (timeline inserts/s) and read time (lookups/s); accounts fetched per feed, feed load time, time for a 10M-follower post to reach everyone. Illustrative numbers shaped like Twitter's 2012 figures.
3. **How long to reach everyone?** (predict): 10M ÷ 1M/s = 10 s.
4. **Scrolling while it changes** ⭐ (fix-the-problem): load page 1, two new posts arrive, load page 2 — offset repeats posts 17 and 16; the cursor ("older than post 16") doesn't.
5. **Push or pull?** (sort checkpoint) for different accounts.
6. **What to remember**.
