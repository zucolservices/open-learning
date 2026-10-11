# Sources: UI and component tests (fact-checked 2026-10-11)

- Testing Library (Kent C. Dodds, 2018), "Which query should I use?": getByRole, getByLabelText, getByPlaceholderText, getByText, getByDisplayValue; then getByAltText, getByTitle; getByTestId last.
- Enzyme: last release Dec 2019; official adapters stop at React 16. React 19 deprecated react-test-renderer (react.dev).
- Vitest 4 (Oct 2025) stable browser mode with screenshot comparison; Vitest 5 (Sep 2026). Storybook 9+ Storybook Test via addon-vitest. Playwright `toHaveScreenshot`; Percy (BrowserStack, 2020), Chromatic, Applitools, BackstopJS.

Full notes: scratchpad `sd/testing/m11-facts.md`. The sign-up form is made up; its tests query the rendered page with small re-implementations of role and label queries.
