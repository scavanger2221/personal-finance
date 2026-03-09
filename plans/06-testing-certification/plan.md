# Testing And Certification Plan

## Objective

Prove the implementation works and map evidence directly to FR.IA.02 requirements.

## Tasks

- add feature tests for auth-protected pages and CRUD flows
- add feature tests for policy enforcement
- add feature tests for PDF and CSV export
- add unit tests for summary and report services
- add unit tests for exporter classes
- document where each FR.IA.02 requirement is satisfied
- verify PHPDoc and JSDoc coverage on public code

## Evidence Map To Produce

- D: collection transformations and React list rendering
- F: policy logic, guarded controller paths, export branching
- G: file download responses
- H: interface, abstract class, concrete exporters
- J: Recharts, Inertia, DomPDF usage
- L: code and planning documentation

## Acceptance Criteria

- all automated tests pass
- requirement mapping can be shown file by file
- no certification claim depends on unused or dead code
