# Exports And OOP Plan

## Objective

Implement the real OOP subsystem used to satisfy Requirement H and power file exports.

## Tasks

- create `ReportExporterInterface`
- create `AbstractReportExporter`
- implement `PdfReportExporter`
- implement `CsvReportExporter`
- create `TransactionReportData` value object
- create `TransactionReportService`
- implement `ExportController`
- create Blade PDF template

## Design Rules

- shared formatting belongs in the abstract base class
- format-specific behavior belongs in concrete exporters
- do not add fake domain math just to justify inheritance
- use PDF and CSV as the v1 export targets

## Acceptance Criteria

- PDF export downloads a valid file
- CSV export downloads a valid file
- export output only includes the authenticated user's data
- OOP hierarchy is testable and actually used in the app
