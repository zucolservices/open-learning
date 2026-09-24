# Storyboard: Object storage, the ground floor

Track: Modern Data Lakehouse · Chapter 1 · Module 2 · ~25 min

## 1. What must the learner truly understand?

1. **Object storage is a flat key → bytes store, not a file system.** "Folders" are key prefixes shown with `/`.
2. **There is no atomic rename.** "Renaming" a prefix copies and deletes every object, one by one, and can fail halfway. That is exactly why lakehouse table formats commit by writing one small new file (with put-if-absent) instead of renaming folders.
3. **Requests cost time and money.** LIST pages through keys, 1,000 at a time. Many small objects mean many requests. Storage classes and lifecycle rules trade price against access.

## 2. What makes it hard? (misconceptions)

| Misconception                                               | Tackled in                                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| "S3 has folders"                                            | Step 1: toggle between the console's folder view and what is actually stored |
| "Rename is instant"                                         | Step 3: the rename simulation, with a crash halfway through                  |
| "Renaming a big folder is cheap because it's just metadata" | Step 4 predict: rename copies 100% of the bytes                              |
| "Two writers creating the same file is harmless"            | Step 6: plain PUT (last writer wins) vs put-if-absent                        |
| "Lots of small files is fine in the cloud"                  | Step 8: request count and overhead as file size shrinks                      |
| "All object stores behave the same"                         | Step 10: S3 vs GCS vs ADLS Gen2 comparison                                   |

## 3. Representation

- Objects are tiles labelled by key. Prefixes are coloured bands, not folder icons (except in the "console view", which is deliberately fake).
- Request types have colours: LIST `viz-meta`, GET/PUT/COPY `viz-data`, DELETE `viz-remove`, conditional failures `bad`.

## 4. Steps

| #   | Step                        | Interaction                                                                                                                  | Gate    |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | The folders that aren't     | Toggle console view ↔ raw keys; "create folder" makes a zero-byte key                                                        |         |
| 2   | Listing by prefix           | Choose prefix + delimiter; see Contents vs CommonPrefixes; slide object count to see LIST pages                              |         |
| 3   | Rename a folder ⭐          | Rename a prefix: copy + delete per object; pull the plug halfway; compare with atomic rename (HDFS / hierarchical namespace) |         |
| 4   | Predict                     | What share of the bytes does a rename copy?                                                                                  | predict |
| 5   | Why tables care             | Step-through: "write to temp, then rename" on HDFS vs S3, with a reader probing midway                                       |         |
| 6   | Two writers, one key        | Plain PUT vs `If-None-Match: *`: lost commit vs 412                                                                          |         |
| 7   | Checkpoint                  | Why table formats commit with one small new file                                                                             | choice  |
| 8   | Many small objects          | File-size slider → objects, LIST and GET calls, request cost per full scan                                                   |         |
| 9   | Storage classes & lifecycle | Object-age slider through a lifecycle rule; price and retrieval trade-offs                                                   |         |
| 10  | S3 vs GCS vs ADLS           | Comparison of namespace, rename, conditional writes, consistency                                                             |         |
| 11  | Takeaways                   | Summary + link to the table formats chapter                                                                                  |         |
