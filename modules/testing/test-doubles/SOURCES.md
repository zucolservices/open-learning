# Sources: Test doubles (fact-checked 2026-10-11)

- Gerard Meszaros, _xUnit Test Patterns_ (2007): test double (after "stunt double"), dummy, stub, spy, mock, fake.
- Martin Fowler, "Mocks Aren't Stubs" (2004, revised 2 Jan 2007): state vs behaviour verification; classical vs mockist ("London school" is a later community label).
- _Software Engineering at Google_ (2020) ch. 13 "Test Doubles": prefer real implementations, then fakes; use interaction testing sparingly. "Don't mock what you don't own": GOOS / London-school guideline (Freeman & Pryce, 2009).
- Libraries: Mockito 5.x, unittest.mock (stdlib since Python 3.3), Jest 30 / Vitest 4–5 `fn()`, Sinon, NSubstitute, Moq (SponsorLink episode Aug 2023, removed in 4.20.2), gomock now go.uber.org/mock.

Full notes: scratchpad `sd/testing/m06-facts.md`. The café, payment provider and API change are made up.
