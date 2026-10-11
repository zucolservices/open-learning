# Sources: Readable tests (fact-checked 2026-10-11)

- Roy Osherove, "Naming standards for unit tests" (2005: MethodName_StateUnderTest_ExpectedBehavior) and "Test naming conventions with unit of work" (2012: UnitOfWork_Scenario_ExpectedResult).
- _Software Engineering at Google_ (2020) ch. 12 "Unit Testing" (Erik Kuefler): name tests after behaviours; DAMP ("Descriptive And Meaningful Phrases"): "A little bit of duplication is OK in tests so long as that duplication makes the test simpler and clearer"; don't put logic in tests. Google Testing Blog, "Tests Too DRY? Make Them DAMP!" (Dec 2019).
- Assertion libraries with good failure messages: AssertJ, Hamcrest, Truth, pytest assertion rewriting, Jest/Vitest expect.

Full notes: scratchpad `sd/testing/m07-facts.md`. The discount test and its bug are made up.
