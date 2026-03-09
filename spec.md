# Personal Finance Tracker - Technical Specification

## FR.IA.02 implementation-ready specification

---

## 1. Purpose

Build a full-stack Personal Finance Tracker that is small enough to finish cleanly, but structured strongly enough to demonstrate FR.IA.02 requirements without contrived code.

This revision replaces the earlier draft's weak points:

- OOP is moved from trivial sign-flipping classes to a real export/reporting hierarchy.
- authorization moves from repeated controller checks to Laravel policies.
- validation moves from inline controller arrays to Form Request classes.
- certification evidence is tied to concrete files, flows, and acceptance checks.
- the implementation plan is split into phased `plan.md` files.

---

## 2. Product Scope

### 2.1 In Scope

- user authentication via Laravel Breeze with React + Inertia
- dashboard with balance, income, expense, and category breakdown
- category CRUD
- transaction CRUD
- PDF export and CSV export
- automated tests for critical flows
- explicit FR.IA.02 requirement mapping

### 2.2 Out of Scope for v1

- budgets and savings goals
- recurring transactions
- multi-currency
- bank sync or third-party APIs
- mobile app
- admin back office
- Excel export unless required later

Keeping v1 narrow reduces delivery risk and makes the certification evidence clearer.

---

## 3. Verified Framework Decisions

This specification follows current framework guidance and avoids custom patterns where Laravel and Inertia already provide a clean solution.

- Laravel policies are the primary ownership-authorization mechanism for user-owned models.
- `routes/web.php` is used for the application UI, which includes CSRF protection through Laravel's web middleware.
- Form Request classes own validation rules instead of controllers.
- Eloquent relationships, scopes, eager loading, and aggregate helpers are preferred over manual SQL.
- React forms use Inertia `useForm` for controlled CRUD flows, server validation feedback, and submission state.

Reference URLs are listed in Section 16.

---

## 4. Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Backend | Laravel | 12.x |
| PHP | PHP | 8.2+ |
| Frontend | React | 18+ |
| Bridge | Inertia.js | current stable |
| Styling | Tailwind CSS | current stable |
| Database | PostgreSQL | 14+ |
| Charts | Recharts | current stable |
| Icons | Lucide React | current stable |
| Export | barryvdh/laravel-dompdf | current stable |
| Testing | PHPUnit or Pest | project choice |

Notes:

- PDF and CSV are required in v1.
- Excel export is intentionally deferred to avoid adding package weight unless the assessor or product owner requires it.

---

## 5. Core Domain Decisions

### 5.1 Entities

- `User`
- `Category`
- `Transaction`

### 5.2 Category Type Source of Truth

`type` lives on `categories`, not on `transactions`.

Rationale:

- avoids duplicated state
- keeps the schema normalized
- removes the risk of `transaction.type` conflicting with `category.type`
- is fully adequate for this app's scale

Guardrail:

- category `type` is immutable after creation in v1
- category rename is allowed
- category delete is blocked when transactions exist

This preserves historical correctness without denormalizing the schema.

### 5.3 Business Rules

- every category belongs to exactly one user
- every transaction belongs to exactly one user and one category
- a transaction may only reference a category owned by the same user
- transaction amount must be positive
- category names must be unique per user and type
- exports may only include the authenticated user's data

---

## 6. Database Design

### 6.1 Tables

#### `users`

Standard Laravel users table.

#### `categories`

| Column | Type | Constraints |
| --- | --- | --- |
| id | big integer | primary key |
| user_id | big integer | foreign key -> users.id, cascade delete |
| name | varchar(255) | required |
| type | varchar(20) or enum | required, `income` or `expense` |
| created_at | timestamp | standard |
| updated_at | timestamp | standard |

Indexes and constraints:

- index on `user_id`
- unique index on `(user_id, type, name)`

#### `transactions`

| Column | Type | Constraints |
| --- | --- | --- |
| id | big integer | primary key |
| user_id | big integer | foreign key -> users.id, cascade delete |
| category_id | big integer | foreign key -> categories.id, restrict delete |
| amount | decimal(12,2) | required, positive |
| description | text | nullable |
| transaction_date | date | required |
| created_at | timestamp | standard |
| updated_at | timestamp | standard |

Indexes and constraints:

- index on `user_id`
- index on `category_id`
- index on `transaction_date`
- composite index on `(user_id, transaction_date)`

### 6.2 Schema Notes

- `decimal(12,2)` is sufficient for personal finance and clearer than oversized numeric ranges.
- soft deletes are not part of v1 because they add recovery logic, policy rules, and test burden without being required for the core certification story.
- if PostgreSQL enum management becomes cumbersome, use a string column plus application-level enum casting.

---

## 7. Application Architecture

### 7.1 Preferred Laravel Structure

Use standard Laravel conventions first, then add application services only where they provide real value.

- Models for persistence and relationships
- Form Requests for validation
- Policies for authorization
- thin controllers for orchestration
- services for dashboard summaries and exports
- DTOs/value objects for stable frontend/export payloads

### 7.2 OOP Design for Requirement H

The earlier `IncomeService` and `ExpenseService` design is not strong enough. Returning `+$amount` and `-$amount` is too trivial and does not justify the hierarchy.

Use the export/reporting subsystem as the primary OOP demonstration.

#### Contracts

- `App\Services\Reports\Contracts\ReportExporterInterface`

Core methods:

- `export(TransactionReportData $reportData): mixed`
- `fileName(Carbon $date): string`
- `contentType(): string`

#### Abstract Base Class

- `App\Services\Reports\Abstracts\AbstractReportExporter`

Responsibilities:

- shared file naming logic
- shared currency/date formatting helpers
- shared row normalization

#### Concrete Classes

- `PdfReportExporter`
- `CsvReportExporter`
- optional later: `ExcelReportExporter`

#### Supporting Classes

- `TransactionReportService`
- `DashboardSummaryService`
- `TransactionReportData` value object
- `DashboardSummaryData` value object

Why this is better:

- interface, abstraction, inheritance, and polymorphism are all real
- the classes differ in behavior in a meaningful way
- the design solves an actual product need instead of a synthetic one

### 7.3 Enums and Strong Typing

Add a PHP enum for category type.

Suggested enum:

- `App\Enums\CategoryType`
- values: `income`, `expense`

Use enum casting in the `Category` model if supported cleanly by the final implementation.

---

## 8. Target Backend Design

### 8.1 Models

#### `Category`

Relationships:

- `belongsTo(User::class)`
- `hasMany(Transaction::class)`

Scopes:

- `scopeForUser($query, int $userId)`
- `scopeIncome($query)`
- `scopeExpense($query)`

#### `Transaction`

Relationships:

- `belongsTo(User::class)`
- `belongsTo(Category::class)`

Scopes:

- `scopeForUser($query, int $userId)`
- `scopeInDateRange($query, ?string $from, ?string $to)`
- `scopeLatestFirst($query)`

### 8.2 Form Requests

Required classes:

- `StoreCategoryRequest`
- `UpdateCategoryRequest`
- `StoreTransactionRequest`
- `UpdateTransactionRequest`
- optional: `ExportTransactionsRequest`

Validation rules belong here, not in controllers.

### 8.3 Policies

Required classes:

- `CategoryPolicy`
- `TransactionPolicy`

Required policy abilities:

- `viewAny`
- `view`
- `create`
- `update`
- `delete`

Ownership rule:

- a user may only act on records where `user_id === auth()->id()`

### 8.4 Controllers

Required controllers:

- `DashboardController`
- `TransactionController`
- `CategoryController`
- `ExportController`

Controller responsibilities:

- authorize action
- delegate validation to Form Requests
- delegate aggregation/export work to services
- return Inertia responses or file downloads

Controllers should not contain repeated ownership `if/else` blocks when policies can express the rule once.

### 8.5 Services

#### `DashboardSummaryService`

Responsibilities:

- compute total income
- compute total expense
- compute net balance
- prepare chart series
- prepare recent transaction rows

Requirement D evidence:

- collection mapping
- grouping
- filtering
- reducing
- transforming domain data into array props

#### `TransactionReportService`

Responsibilities:

- load the authenticated user's transaction report dataset
- apply optional date filters
- build report rows and summary totals
- produce a `TransactionReportData` object for exporters

### 8.6 Query Strategy

Use Eloquent with eager loading and aggregate helpers.

Preferred patterns:

- `with('category')`
- `withSum()` for category totals
- collection transformation for frontend props

Avoid:

- manual N+1 access patterns
- raw SQL unless profiling proves it is needed
- repository classes for simple CRUD

---

## 9. Export Design

### 9.1 Required Formats

- PDF
- CSV

### 9.2 Export Flow

1. validate optional filters
2. authorize export request
3. build `TransactionReportData`
4. resolve exporter by format
5. return download response

### 9.3 Exporter Resolution

Prefer a small resolver or factory:

- `ReportExporterFactory`
- or a simple `match` expression inside `ExportController`

Do not overcomplicate this with unnecessary container bindings.

### 9.4 File I/O Requirement

Requirement G is demonstrated by generating and returning real files:

- PDF file download
- CSV file stream/download

This is stronger than a single export path because it shows multiple file output behaviors.

---

## 10. Frontend Design

### 10.1 Pages

- `Dashboard`
- `Transactions/Index`
- `Categories/Index`

### 10.2 Components

- `StatsCard`
- `ExpenseChart`
- `TransactionTable`
- `TransactionForm`
- `CategoryForm`
- optional: `EmptyState`, `PageHeader`, `ConfirmDialog`

### 10.3 Form Strategy

Use Inertia `useForm` for transaction and category forms because it gives:

- controlled values
- server validation errors
- processing state
- easy resets on success

### 10.4 UI Requirements

- desktop and mobile responsive layout
- clear empty states for first-use experience
- visible validation errors
- accessible labels and buttons
- avoid introducing global client state libraries for this scope

### 10.5 Charting

Use Recharts for:

- expense breakdown by category
- optional later: monthly trend chart

Only pass the minimal chart data needed to the page.

---

## 11. Security and Reliability

### 11.1 Authentication and Authorization

- all app routes behind `auth` middleware
- use `verified` middleware if email verification remains enabled by the starter kit
- all model ownership rules enforced through policies

### 11.2 CSRF

- application uses `routes/web.php`
- Laravel web middleware provides CSRF protection
- Inertia form submissions operate within that protection model

### 11.3 Rate Limiting

Add named rate limiters for:

- transaction creation/update
- export routes

Suggested examples:

- `transactions`: 30 requests per minute per user or IP fallback
- `exports`: 10 requests per minute per user or IP fallback

### 11.4 Output Safety

- Blade escaped output for PDF view content
- no raw HTML from user descriptions
- no raw SQL in v1

### 11.5 Local Development Guardrails

Enable these in `AppServiceProvider` outside production:

- `Model::preventLazyLoading(...)`
- `Model::preventSilentlyDiscardingAttributes(...)`

These reduce hidden bugs while the app is being built.

---

## 12. FR.IA.02 Requirement Mapping

| Requirement | Implementation | Evidence |
| --- | --- | --- |
| D - Data Structures | Eloquent collections transformed into frontend/report DTOs and arrays | `DashboardSummaryService`, `TransactionReportService`, React `.map()` rendering |
| F - Control Structures | explicit branching in policies, export format selection, guarded delete/update flows | policies, controller/export flow, service conditionals |
| G - File I/O | PDF download and CSV download | `ExportController`, exporter classes |
| H - OOP | interface + abstract class + concrete exporters + DTOs | `ReportExporterInterface`, `AbstractReportExporter`, `PdfReportExporter`, `CsvReportExporter` |
| J - External Libraries | Inertia, Recharts, DomPDF | frontend pages, chart component, exporter implementation |
| L - Documentation | PHPDoc/JSDoc on public classes and methods, plus implementation plans | app code and `plans/*/plan.md` |

Important note:

- requirement H is met with domain-appropriate OOP, not artificial examples.
- requirement D is met with collection operations and frontend transformations, not inefficient hand-written sorting algorithms.

---

## 13. Testing Strategy

### 13.1 Feature Tests

- authenticated user can view dashboard
- user cannot access another user's categories or transactions
- category creation validates unique name within user/type
- transaction creation rejects foreign category ownership
- category delete fails when transactions exist
- PDF export returns a download response for the authenticated user
- CSV export returns a download response for the authenticated user

### 13.2 Unit Tests

- `DashboardSummaryService`
- `TransactionReportService`
- `PdfReportExporter`
- `CsvReportExporter`
- enum casting or value object behavior if added

### 13.3 Manual QA Checks

- mobile layout remains usable on transaction and category pages
- empty database state looks intentional
- chart renders only when data exists
- validation errors surface correctly after failed submit
- export files contain only the signed-in user's records

---

## 14. Target File Structure

```text
app/
  Enums/
    CategoryType.php
  Http/
    Controllers/
      DashboardController.php
      TransactionController.php
      CategoryController.php
      ExportController.php
    Requests/
      StoreCategoryRequest.php
      UpdateCategoryRequest.php
      StoreTransactionRequest.php
      UpdateTransactionRequest.php
      ExportTransactionsRequest.php
  Models/
    Category.php
    Transaction.php
  Policies/
    CategoryPolicy.php
    TransactionPolicy.php
  Services/
    Dashboard/
      DashboardSummaryService.php
      DashboardSummaryData.php
    Reports/
      Abstracts/
        AbstractReportExporter.php
      Contracts/
        ReportExporterInterface.php
      CsvReportExporter.php
      PdfReportExporter.php
      ReportExporterFactory.php
      TransactionReportData.php
      TransactionReportService.php
database/
  factories/
  migrations/
resources/
  js/
    Components/
    Pages/
  views/
    exports/
      transactions.blade.php
routes/
  web.php
tests/
  Feature/
  Unit/
plans/
  00-roadmap/plan.md
  01-setup/plan.md
  02-data-domain/plan.md
  03-application-security/plan.md
  04-exports-oop/plan.md
  05-frontend/plan.md
  06-testing-certification/plan.md
  07-release/plan.md
```

---

## 15. Implementation Principles

- prefer standard Laravel conventions before inventing layers
- keep controllers thin and readable
- centralize validation and authorization
- avoid duplicated domain state
- do not add complexity only to impress the certification review
- keep OOP examples real, testable, and useful

---

## 16. Verified References

- Laravel authorization: `https://laravel.com/docs/12.x/authorization`
- Laravel routing and route model binding: `https://laravel.com/docs/12.x/routing`
- Laravel rate limiting: `https://laravel.com/docs/12.x/rate-limiting`
- Laravel Eloquent basics and strictness: `https://laravel.com/docs/12.x/eloquent`
- Laravel Eloquent relationships and aggregates: `https://laravel.com/docs/12.x/eloquent-relationships`
- Inertia forms: `https://inertiajs.com/forms`

This specification is the source of truth for implementation planning.
