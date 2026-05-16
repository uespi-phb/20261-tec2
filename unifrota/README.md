# Unifrota

Backend TypeScript project using Node.js, Yarn, ESLint, Prettier and Vitest.

## Requirements

- Node.js `>=24.15 <25`
- Yarn `4.13.0`

## Scripts

```sh
yarn dev
yarn build
yarn type:check
yarn lint
yarn test
yarn check
```

## Architecture

The project should be organized by feature. Inside each feature, files should be grouped by Clean Architecture role:

| Clean Architecture layer | Project folder |
| ------------------------ | -------------- |
| Entities                 | `domain`       |
| Use cases                | `application`  |
| Interface adapters       | `infra`        |

Business and domain rules belong in `domain`. Use cases and orchestration belong in `application`. Frameworks, adapters, gateways, repositories, controllers and external integrations belong in `infra`.

## Suggested Source Structure

<pre style="
  margin: 0;
  padding: 24px;
  border-radius: 4px;
  background: #171c22;
  color: #f4f4f5;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
  font-size: 12px;
  line-height: 1.20;
  letter-spacing: 0.2px;
  overflow-x: auto;
">
src
├── main.ts
├── types
│   └── env.d.ts
├── shared
│   ├── errors
│   │   ├── system-error.ts
│   │   ├── domain-error.ts
│   │   ├── application-error.ts
│   │   └── infra-error.ts
│   └── application
│       └── usecase.ts
└── features
    └── auth
        ├── domain
        │   ├── value-objects
        │   │   ├── email.ts
        │   │   └── password.ts
        │   └── errors
        │       ├── invalid-email-error.ts
        │       └── invalid-password-error.ts
        ├── application
        │   ├── usecases
        │   │   └── signin-usecase.ts
        │   ├── contracts
        │   │   ├── load-user-by-email.ts
        │   │   ├── password-comparer.ts
        │   │   ├── access-token-generator.ts
        │   │   └── access-token-validator.ts
        │   ├── dtos
        │   │   └── access-token.ts
        │   └── errors
        │       └── invalid-credentials-error.ts
        └── infra
            └── cryptography
                └── jwt-adapter.ts
</pre>

## Suggested Test Structure

The `test` directory should mirror the source feature and layer organization:

<pre style="
  margin: 0;
  padding: 24px;
  border-radius: 4px;
  background: #171c22;
  color: #f4f4f5;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
  font-size: 12px;
  line-height: 1.20;
  letter-spacing: 0.2px;
  overflow-x: auto;
">
test
└── features
    └── auth
        ├── domain
        │   └── value-objects
        │       ├── email.spec.ts
        │       └── password.spec.ts
        ├── application
        │   └── usecases
        │       └── signin-usecase.spec.ts
        └── infra
            └── cryptography
                └── jwt-adapter.spec.ts
</pre>

## File Mapping

```txt
src/email.ts                      -> src/features/auth/domain/value-objects/email.ts
src/password.ts                   -> src/features/auth/domain/value-objects/password.ts
src/invalid-email-error.ts        -> src/features/auth/domain/errors/invalid-email-error.ts
src/invalid-password-error.ts     -> src/features/auth/domain/errors/invalid-password-error.ts

src/signin-usecase.ts             -> src/features/auth/application/usecases/signin-usecase.ts
src/load-user-by-email.ts         -> src/features/auth/application/contracts/load-user-by-email.ts
src/password-comparer.ts          -> src/features/auth/application/contracts/password-comparer.ts
src/access-token-generator.ts     -> src/features/auth/application/contracts/access-token-generator.ts
src/access-token-validator.ts     -> src/features/auth/application/contracts/access-token-validator.ts
src/access-token.ts               -> src/features/auth/application/dtos/access-token.ts
src/invalid-credentials-error.ts  -> src/features/auth/application/errors/invalid-credentials-error.ts

src/jwt-adapter.ts                -> src/features/auth/infra/cryptography/jwt-adapter.ts

src/usecase.ts                    -> src/shared/application/usecase.ts
src/system-error.ts               -> src/shared/errors/system-error.ts
src/domain-error.ts               -> src/shared/errors/domain-error.ts
src/application-error.ts          -> src/shared/errors/application-error.ts
src/infra-error.ts                -> src/shared/errors/infra-error.ts
```

## Test File Mapping

```txt
test/email.spec.ts                -> test/features/auth/domain/value-objects/email.spec.ts
test/password.spec.ts             -> test/features/auth/domain/value-objects/password.spec.ts
test/signin-usecase.spec.ts       -> test/features/auth/application/usecases/signin-usecase.spec.ts
test/jwt-adapter.spec.ts          -> test/features/auth/infra/cryptography/jwt-adapter.spec.ts
```

`src/main.ts` and `src/types/env.d.ts` remain outside `features` because they are application-level artifacts, not part of a single feature.
