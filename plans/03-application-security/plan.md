# Application And Security Plan

## Objective

Build the application layer with validation, authorization, routes, and safe CRUD behavior.

## Tasks

- create Form Requests for category, transaction, and export flows
- create `CategoryPolicy` and `TransactionPolicy`
- implement `DashboardController`, `CategoryController`, and `TransactionController`
- add named routes in `routes/web.php`
- apply `auth` and optional `verified` middleware
- add rate limiters for transactions and exports
- enable local Eloquent strictness in `AppServiceProvider`

## Key Checks

- users cannot touch other users' records
- categories with transactions cannot be deleted
- transactions cannot be created against foreign categories
- controllers stay thin

## Acceptance Criteria

- CRUD works end to end for the signed-in user
- unauthorized access returns correct denial behavior
- validation errors are returned through Inertia correctly
- rate limiting is attached and tested at route level
