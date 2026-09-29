# Evaluating answers: storyboard

1. **Marking an essay** (analogy): faithful to the sources? relevant to the question? correct?
2. **Judge them yourself** ⭐ (fix the problem, real output): nine real answers from modules 12, 13, 14, 16 and 17 with the passages each model saw. The learner marks faithful/relevant; then our labels, correctness and a note. Includes grounded-but-wrong (5: ward 11 from five rows), an invented detail (6: "apply for a new trade licence on the portal"), an unsupported guess (9: "W4"), padding (2), an off-topic "consequence" (4) and correct abstention (3).
3. **Let a model judge** ⭐ (comparison, real output): Phi-4-mini one-shot faithfulness PASS/FAIL passed all nine (agrees 7/9, caught 0 of 2 failures); claim-by-claim (split into claims, check each; pass only if all supported) caught both but raised three false alarms and couldn't score answer 1; the splitter invented claims (credit scores) and looped ("I don't know" ×32, "Ward 11 has two pending applications" ×15), shown de-duplicated with counts.
4. **The judge's habits** (real output + research): pairwise short vs long answer, both orders: picked the long one both times; MT-Bench findings.
5. **Making a judge trustworthy** (cards).
6. **A judge that always passes** (choice).
7. **What to remember**.

Data: `scratchpad/rag/r19cases.json` (assembled from earlier modules' data), `embed/r19.mjs` (one-shot judge, relevance, pairwise), `embed/r19b.mjs` (claim splitting and checking). Phi-4-mini q4f16, greedy. Our labels are our own judgement.
