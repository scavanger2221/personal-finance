# Release Plan

## Objective

Run final verification and leave the project in a shippable, review-ready state.

## Tasks

- run formatter/linter if configured
- run full automated test suite
- run production build
- review route list and middleware attachments
- review database migration order from a clean database
- verify export downloads manually
- verify seeded demo data supports screenshots or certification walkthrough
- update documentation if implementation diverged from `spec.md`

## Final Checks

- no broken imports
- no dead routes
- no authorization gaps
- no placeholder UI text
- no mismatch between spec and implementation

## Acceptance Criteria

- app installs from scratch using documented steps
- tests and build pass
- certification walkthrough can be demonstrated cleanly
