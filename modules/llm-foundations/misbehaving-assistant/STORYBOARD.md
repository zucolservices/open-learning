# Capstone: the assistant that misbehaves: storyboard

1. **The complaints queue**: analogy (a mechanic reads fault codes, not noises); Krishi Sahayak, a farmers' helpline assistant, has four open complaints; what a trace records (input, settings, output, timing).
   2–5. **Four case files** ⭐ (fix the problem; shared `CaseFile`): complaint, transcript and trace; choose the cause (wrong picks explain why, clue rows light up once found), choose a fix (good / partial / bad with feedback), then re-test.
   - **Case 1, cut off in Kannada** (real tokenizer): max_tokens 120 sized on English; finish_reason "length"; English 61 / Hindi 264 / Kannada 417 tokens on Qwen2.5; real cut-offs, Hindi ending on a split character.
   - **Case 2, a different answer every time** (real samples): temperature 1.2, top_p 1.0 after a "sound more natural" change; re-test switches between 8 real Qwen2.5-1.5B answers at T 0.2 / 1.0 / 1.2 / 1.5 with problems flagged.
   - **Case 3, it promised approval** (real outputs): rule 4 "never promise approval" contradicted by rule 15 "always give a confident yes or no"; real Qwen2.5-1.5B "Yes…" before, correct after the rule is moved first and the contradiction deleted; Phi-4-mini note.
   - **Case 4, the ₹500 fee** (simulated, defanged): a forum page in the retrieval index carries hidden instructions; fix: official sources only, untrusted-data marking, an output check for payment requests/UPI IDs, warn users, incident follow-up.
2. **Name the cause** (sort): tokens / sampling / prompt / injection.
3. **The debugging loop** (order): reproduce → read trace → one hypothesis → change one thing → re-run evals → add a regression test.
4. **What to remember** (track finale).
