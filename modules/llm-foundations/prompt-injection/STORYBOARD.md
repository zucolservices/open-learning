# Prompt injection & data leakage: storyboard

1. **Why it happens** (step-through): an inbox assistant with a send tool; instructions and emails are one token stream; an email can pose as a command; the confused-deputy framing.
2. **Attack the assistant, then defend it** ⭐ (sandbox): five defanged attacks (blunt, fake authority, hidden, urgent, direct system-prompt leak) × four defences tagged filter vs capability; compliance chance and whether real harm occurs.
3. **The lethal trifecta** (explore): private data + untrusted content + a way out; toggle each leg to clear the danger.
4. **Which fix removes the risk?** (choice checkpoint): constrain the tool + human approval beats prompt rules and detectors.
5. **What could go wrong?** (sort checkpoint): injection vs other LLM risks (hallucination, PII leakage).
6. **What to remember**.
