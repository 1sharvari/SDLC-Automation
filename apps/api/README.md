# Node.js API

Place the Node TypeScript service here. Use module-first structure:

```text
src/
  modules/<feature>/  # routes/controllers/services/dtos
  shared/             # config, middleware, errors, utilities
```

For the POC, API endpoints own the hardcoded demo data. The Angular UI must access it through the API; do not hardcode feature data in browser components.
