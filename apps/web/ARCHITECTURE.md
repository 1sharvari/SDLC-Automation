# Angular application structure

```text
src/app/
  core/       # application-wide providers, API clients, auth and interceptors
  features/   # lazy-loaded, route-level business capabilities
  shared/     # reusable presentational components, directives and pipes
```

The application is standalone and strict TypeScript is enabled. Each feature consumes business data through `core/services/api-client.service.ts`; the API base URL is configured in `core/config/api.config.ts`.

## Commands

```powershell
npm start       # UI at http://localhost:4200
npm run build   # production build
npm test        # unit tests
```
