# Data And Domain Plan

## Objective

Implement the schema, models, enums, relationships, scopes, factories, and seed data.

## Tasks

- create `CategoryType` enum
- add categories migration with unique `(user_id, type, name)`
- add transactions migration with positive amount constraint and date index
- implement `Category` and `Transaction` models
- add relationships and scopes
- add factories for categories and transactions
- add seeders for demo data
- confirm model casts and relationships behave correctly

## Important Decisions

- category type is immutable in v1
- transactions store `category_id`, not duplicated `type`
- keep schema minimal and normalized

## Acceptance Criteria

- migrations run cleanly from zero
- factories generate valid related data
- seeded data supports dashboard and export flows
- no model relies on lazy loading in core queries
