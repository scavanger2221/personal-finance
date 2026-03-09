# Setup Plan

## Objective

Create the project skeleton and baseline tooling.

## Tasks

- create Laravel 12 project
- install Breeze with React + Inertia
- configure PostgreSQL connection
- install frontend packages: `recharts`, `lucide-react`
- install backend export package: `barryvdh/laravel-dompdf`
- decide PHPUnit or Pest and keep one test style consistent
- configure `.env.example`
- confirm `npm run build` and test command work on a clean project

## Suggested Commands

```bash
composer create-project laravel/laravel .
composer require laravel/breeze --dev
php artisan breeze:install react
npm install
npm install recharts lucide-react
composer require barryvdh/laravel-dompdf
```

## Acceptance Criteria

- app boots locally
- login/register flow works
- database connection succeeds
- frontend assets build successfully
- initial test suite runs successfully
