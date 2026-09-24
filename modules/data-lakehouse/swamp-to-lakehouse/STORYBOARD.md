# Storyboard: From swamp to lakehouse

Track: Modern Data Lakehouse · Chapter 1 · Module 1 · ~20 min

## 1. What must the learner truly understand?

1. **Two different workloads.** Apps do many tiny reads and writes (OLTP). Analytics scans huge amounts of data (OLAP). Putting both on one system hurts both, so analytics moved to its own system.
2. **Each architecture fixed the last one's problem and created a new one:** warehouse → data lake → swamp → two-tier (lake + warehouse) → lakehouse.
3. **The lakehouse is a stack of open layers:** object storage → open file format → open table format → catalog → any engine. It gives warehouse guarantees on one copy of open data.

## 2. What makes it hard? (misconceptions)

| Misconception                                        | Tackled in                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| "Analytics can just run on the app's database"       | Hook simulation: the month-end report slows checkout                               |
| "A lakehouse is a product you buy"                   | Story and wrap-up: it's an architecture of open layers; many products implement it |
| "Data lakes failed because storage was bad"          | Swamp era: they failed because nothing added transactions, schema or governance    |
| "Separating storage and compute is only about cost"  | Checkpoint: it also lets many engines share one copy and scale independently       |
| "The lakehouse makes warehouses obsolete everywhere" | Comparator: it's a set of trade-offs, and warehouses still win on some axes        |

## 3. Representation

- A fictional tea-shop chain, **Brewline**, whose data platform grows across 30 years. Every diagram uses the same visual vocabulary: sources on the left, storage in the centre, consumers on the right.
- Colours: data/files `viz-data`, metadata/tables `viz-meta`, compute/engines `viz-compute`, the lakehouse layer `accent`.

## 4. What does the learner do?

| #   | Step                      | Interaction                                                                                                       | Gate   |
| --- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | One database, two jobs    | Run the month-end report on the app database and watch checkout latency climb; then give analytics its own system |        |
| 2   | Sort the questions        | Classify 6 questions as app (OLTP) or analytics (OLAP)                                                            | sort   |
| 3   | 30 years in one scroll ⭐ | Scroll story, 8 eras, with a sticky diagram that changes per era                                                  |        |
| 4   | Compare the architectures | Switch between warehouse, lake, two-tier and lakehouse; see a 7-axis scorecard                                    |        |
| 5   | Build the stack           | Order the five lakehouse layers from bottom to top                                                                | order  |
| 6   | Storage ≠ compute         | What does separating storage and compute let you do?                                                              | choice |
| 7   | Takeaways                 | The stack, mapped to the chapters where each layer is taught                                                      |        |

## 5. How will we know it landed?

- Step 2: correctly separates transactional from analytical questions.
- Step 5: knows the layer order, and that engines sit on top of shared open data.
- Step 6: understands independent scaling and multiple engines over one copy.
