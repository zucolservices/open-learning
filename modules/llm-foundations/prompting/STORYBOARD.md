# Prompting fundamentals: storyboard

1. **Brief a new colleague** (step-through analogy): a sticky note "Summarise this email…" handed to a new temp; their questions appear one by one: who's it for (role and audience), how long and what counts as urgent (rules), can I see one (examples), where does it go (output format).
2. **Fix the prompt** ⭐ (fix-the-problem): six invented customer emails, a real small model (Qwen2.5-1.5B-Instruct), 16 real prompt variants from four toggles. The exact prompt is viewable; four automatic checks per output (right order number, right urgency, under 20 words, machine-readable JSON) and a 6×4 results grid.
3. **Where each part goes** (step-through): system, user and assistant messages; fencing data off with delimiters; the flattened chat template the model actually reads.
4. **Which ingredient fixes it?** (sort checkpoint): five failure descriptions → role, rules, examples or format.
5. **Test, don't guess** (chart + choice checkpoint): checks passed for all 16 prompts grouped by number of ingredients; adding ingredients mostly helps, not always. What to do after one email is fixed: re-run the whole test set.
6. **What the guides agree on** (reference): common advice from OpenAI, Anthropic and Google, and why shouting doesn't help.
7. **What to remember**.
