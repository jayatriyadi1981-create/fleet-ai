# Development Guidelines

## Coding Conventions

1. **Strict Type Safety**: Avoid `any` types. All domain models must be declared in `src/types/index.ts`.
2. **Modular Components**: Avoid monolithic files. Split complex components into logical sub-views inside `src/components/views/`.
3. **No Direct Secret Exposure**: Keep all secret keys inside `process.env` on the Express backend server.
4. **Mock Services**: When offline or in development mode, use `MockGpsService` and `MockAiService` implementing the common service interfaces.

## Verification Workflow

Before committing changes, execute:
```bash
npm run lint
npm run build
```
