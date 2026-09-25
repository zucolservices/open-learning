# Bias, privacy & responsible use: storyboard

1. **The new clerk** (step-through): a clerk who learned only from old files; four sources of harm light up in turn (training data, the question/proxy, personal data, how answers are used); real automated-benefit failures (Dutch childcare benefits, Robodebt).
2. **Design the eligibility assistant** ⭐ (branching scenario, `model.ts`): "Sahayak" for a Karnataka welfare scheme; six decisions (role, data, consent under the DPDP Act, bias checks, human review, transparency), each option showing its consequence (holds up / partly / causes harm) and the risks it leaves open. No score.
3. **Launch review**: the six choices, their verdicts and the open risks; EU AI Act high-risk note.
4. **Swap the name** ⭐ (real data, `data.json`): three open models (Qwen2.5-1.5B, Llama-3.2-3B, Phi-4-mini) given the scheme rule and the same application with eight names; P("Yes") per name for a clear, a borderline and an incomplete case. Shows models getting a clear case wrong, disagreeing, and name-driven gaps (Llama: 17 points on the clear case).
5. **Reusing the chats** (choice checkpoint): fine-tuning on citizens' chats is a new purpose, so it needs separate consent or anonymisation.
6. **Which safeguard?** (sort): bias / privacy / oversight & honesty.
7. **What to remember**: India AI Governance Guidelines' sutras.
