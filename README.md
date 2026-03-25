# FOLOMS

FOLOMS is a fuel and fleet operations management system with a CodeIgniter 3 REST API backend and a React + CoreUI frontend. The application is used to manage trip tickets, deliveries, offices, drivers, equipment, reports, and related fuel consumption workflows.

## Overview

The repository is split into two main applications:

- `api/` - CodeIgniter 3 backend exposing REST endpoints
- `client/` - React frontend used by administrators and super administrators

The system tracks operational fuel usage through trip tickets and historical records, and includes reporting for consumption trends, monthly reports, and summary views.

## Core Modules

- Dashboard
- Trip Ticket
- Old Trip Ticket
- Vehicle Consumption
- Delivery
- Depo
- Supplier
- Driver
- Office
- Equipment
- Product
- Equipment Type
- Report Type
- Control Number
- User management
- Reporting

## Roles

The current frontend route and navigation setup supports at least these roles:

- `Super Admin`
- `Admin`

Access to screens is role-based in the React routing and sidebar configuration.

## Architecture

### Backend

- Framework: CodeIgniter 3
- REST library: `chriskacerguis/codeigniter-restserver`
- Database: MySQL / MariaDB-compatible schema
- Authentication:
  - Basic Auth for API access
  - JWT-based login flow for the application user session

### Frontend

- React 19
- CoreUI 5
- React Router
- Redux
- TanStack React Query
- Formik + Yup
- Material React Table
- Mantine components
- Sass styling

## Repository Structure

```text
foloms/
|-- api/
|   |-- application/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- helpers/
|   |   |-- libraries/
|   |   `-- models/
|   |-- system/
|   |-- composer.json
|   `-- index.php
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- layout/
|   |   |-- scss/
|   |   `-- views/
|   `-- package.json
|-- foloms.sql
`-- README.md
```

## Requirements

Recommended local environment:

- PHP 8.x
- Composer
- Node.js 18+ and npm
- MySQL 8.x or compatible
- Laragon, XAMPP, WAMP, or another Apache/PHP stack

Notes:

- The backend `composer.json` allows older PHP versions, but the project dump and current local environment indicate a more modern PHP/MySQL stack.
- The frontend uses React 19 and current package versions, so use a modern Node runtime.

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd foloms
```

### 2. Set up the backend

Install PHP dependencies:

```bash
cd api
composer install
```

Make sure your web server points to the repository in a way that serves the API from `api/`.

If you are using Laragon with the current folder layout, the API is typically reachable at something like:

```text
http://localhost/foloms/api/
```

### 3. Create the database

Create a database named `foloms`.

Import the base schema:

```text
foloms.sql
```

Then apply the additional Depo migration:

```text
api/database/20260324_add_depos_and_trip_ticket_depo_id.sql
```

This migration:

- creates the `depos` table
- adds `trip_ticket.depo_id`
- adds an index for `depo_id`
- adds a foreign key from `trip_ticket.depo_id` to `depos.id`

### 4. Configure backend database access

Update the database settings in:

```text
api/application/config/database.php
```

Important implementation detail:

- The file currently switches between development and production using a local `$isProduction` boolean.
- Set the correct database credentials for your environment.
- Do not commit real credentials to source control.

### 5. Configure backend REST authentication

The API is configured to use Basic Auth in:

```text
api/application/config/rest.php
```

Before using this in a shared or deployed environment:

- replace hardcoded API credentials
- rotate any existing credentials if this repository has ever contained real values
- treat the credentials as secrets

### 6. Configure frontend environment variables

Create a file named:

```text
client/.env
```

Suggested template:

```env
REACT_APP_PROJECT_TITLE=FOLOMS
REACT_APP_FULL_PROJECT_TITLE=Fleet and Operations Logistics Management System
REACT_APP_DATE_UPDATED=2026-03-25
REACT_APP_DEVELOPER=Your Name

REACT_APP_BASEURL_DEVELOPMENT=http://localhost/foloms/api/
REACT_APP_BASEURL_PRODUCTION=https://your-production-domain/api/

REACT_APP_API_USERNAME=your-api-username
REACT_APP_API_PASSWORD=your-api-password
REACT_APP_ENCRYPTION_KEY=change-this-to-a-secure-key
REACT_APP_STATUS_APPROVED_KEY=APPROVED
REACT_APP_MINUTES_NO_ACTIVITY=15
```

Important implementation detail:

- The frontend currently selects the API base URL using a hardcoded `isProduction` flag inside `client/src/components/SystemConfiguration.js`.
- For local development, ensure that file points to the development base URL.
- For deployment, update the flag or refactor the selection logic if you want environment-based switching.

### 7. Set up the frontend

Install dependencies:

```bash
cd client
npm install
```

Start the development server:

```bash
npm start
```

The React application will usually run at:

```text
http://localhost:3000
```

## Available Frontend Scripts

From `client/`:

```bash
npm start
npm run build
npm run lint
npm test
npm run test:cov
npm run test:debug
npm run cypress:open
```

## Authentication Flow

The current application uses two distinct authentication layers:

### API layer

- Requests are sent with Basic Auth credentials from the frontend Axios client.
- The shared Axios instance is defined in `client/src/components/SystemConfiguration.js`.

### Application layer

- The login flow returns or uses a JWT token.
- The frontend stores the token in local storage under `folomsToken`.
- Sidebar, user context, and other UI areas decode that token client-side.

## Routing Notes

- The frontend uses `HashRouter`, so client-side routes are hash-based.
- This avoids server rewrite requirements for frontend navigation.
- The backend uses CodeIgniter route mappings defined in `api/application/config/routes.php`.
- API rewrite behavior is handled by `api/.htaccess`.

## Depo Feature

The repository now includes a dedicated Depo module.

### Backend

- `api/application/controllers/Depo.php`
- `api/application/models/DepoModel.php`
- routes added in `api/application/config/routes.php`

### Frontend

- `client/src/views/depo/Depo.js`
- route added in `client/src/routes.js`
- navigation entry added in `client/src/_nav.js`
- trip ticket integration added in `client/src/views/trip_ticket/TripTicket.js`

### Current behavior

- Depo can be managed from its own CRUD page.
- Trip Ticket includes a Depo selector.
- Depo is currently treated as an optional indicator for external fuel sourcing rather than being strictly derived from the `Add Purchase` field alone.

## Reporting Features

The codebase includes report-oriented screens and endpoints for:

- Monthly report
- Summary consumption
- Product consumption trends
- Work trend reporting
- Historical trip ticket reporting

## Deployment Notes

- Review all hardcoded environment toggles before deployment.
- Replace any hardcoded credentials in backend and frontend configuration.
- Confirm file upload and asset URLs resolve correctly against your deployed API base URL.
- Validate CORS, HTTPS, and reverse proxy behavior if frontend and backend are served from different origins.

## Troubleshooting

### Frontend cannot reach the API

Check these items:

- `REACT_APP_BASEURL_DEVELOPMENT` or `REACT_APP_BASEURL_PRODUCTION`
- the `isProduction` toggle in `client/src/components/SystemConfiguration.js`
- Apache or Laragon virtual host/path configuration
- API Basic Auth credentials in both frontend and backend config

### Login works but screens behave incorrectly

Check these items:

- JWT token exists in local storage as `folomsToken`
- decoded token contains the expected `role_type`
- route permissions in `client/src/routes.js`
- sidebar entries in `client/src/_nav.js`

### Database errors on new Depo functionality

Check these items:

- `foloms.sql` was imported
- `api/database/20260324_add_depos_and_trip_ticket_depo_id.sql` was executed
- `depos` table exists
- `trip_ticket.depo_id` exists and has the foreign key/index applied

## Recommended Improvements

These are not required to run the project, but they would reduce operational risk:

- move credentials out of committed PHP config files
- replace boolean environment toggles with proper environment-based configuration
- add backend and frontend automated tests for key modules
- add seed data and a documented sample `.env.example`
- document release and migration procedures

## License

The backend framework dependency is CodeIgniter, which is MIT licensed. Verify your project-level licensing requirements before redistributing this repository.