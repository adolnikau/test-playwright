# Setup

To run tests, rename `config.env.example` to `config.env` and put creds as enviromental variables.

Tests can be run with
```bash
npx playwright test --project=api       # api tests
npx playwright test --project=firefox   # E2E tests
npx playwright test                     # All tests
```