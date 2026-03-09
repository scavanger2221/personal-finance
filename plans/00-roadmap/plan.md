# Roadmap Plan

## Objective

Sequence the project into low-risk phases with clear dependencies and exit criteria.

## Milestones

1. bootstrap Laravel + React + Inertia project
2. build schema, models, factories, and seeders
3. add policies, requests, controllers, and rate limits
4. build reporting/export OOP subsystem
5. build dashboard and CRUD UI
6. complete automated tests and certification evidence
7. run final verification and release prep

## Dependency Order

- frontend work depends on stable routes and response payloads
- export work depends on transactions, categories, and report data service
- tests run throughout, not only at the end

## Non-Negotiables

- use policies for ownership rules
- use Form Requests for validation
- keep `type` only on categories
- implement PDF and CSV export
- document FR.IA.02 evidence as code is added

## Exit Criteria

- every later plan has a stable predecessor
- `spec.md` stays current with implementation decisions
