# Frontend Plan

## Objective

Build a clean responsive UI for dashboard, transactions, and categories.

## Tasks

- implement authenticated page shell
- build `Dashboard` page with stats and chart
- build `Transactions/Index` page with form and table
- build `Categories/Index` page with form and list/table
- build reusable components: `StatsCard`, `ExpenseChart`, `TransactionTable`, `TransactionForm`, `CategoryForm`
- use Inertia `useForm` consistently for CRUD forms
- add empty states, loading states, and validation messages

## Frontend Rules

- avoid unnecessary global state libraries
- keep chart payloads small
- make mobile layout usable, not just technically responsive
- prefer composable components over one huge page file

## Acceptance Criteria

- all pages render correctly on desktop and mobile widths
- validation and flash messages are visible
- chart and tables render correctly from seeded data
- no duplicate fetches or avoidable prop bloat
