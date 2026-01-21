# Pricing Ledger

## Overview

This is the WebWaka Core Pricing Ledger module - a pure, deterministic pricing evaluation engine for the WebWaka ecosystem. It calculates pricing based on plan configurations and usage data, producing ledger-ready outputs that can be consumed by other core modules (Ledger, Entitlements, Incentives) and various Suites (POS, SVM, MVM).

**Key Principle**: This is NOT a payments, billing, subscriptions, or persistence module. It is a stateless pricing calculation engine with no side effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Design Principles
- **Deterministic**: Given the same inputs, always produces the same outputs
- **Pure Functions**: No side effects, no external state mutation
- **Immutable Data**: Plan versions are frozen objects that cannot be modified after creation
- **Tenant Isolation**: All operations are scoped to a specific tenant ID
- **Ledger-Ready**: Outputs include idempotency components for append-only economics

### Module Structure
```
src/
├── models/           # Zod schemas and TypeScript types
│   ├── pricing-components.ts   # Component types (flat_fee, usage, seat, tiered, time_bound)
│   ├── pricing-context.ts      # Evaluation context (tenant, timestamps, usage data)
│   ├── pricing-plan.ts         # Plan metadata
│   ├── pricing-plan-version.ts # Versioned plan with immutability enforcement
│   └── pricing-result.ts       # Calculation outputs with line items
├── engine/           # Pricing calculation logic
│   └── pricing-engine.ts       # Main evaluation functions per component type
└── index.ts          # Public exports
```

### Pricing Component Types
1. **Flat Fee**: Fixed amount charges
2. **Usage**: Pay-per-unit with optional included units
3. **Seat**: Per-seat pricing with min/max constraints
4. **Tiered**: Volume or graduated pricing tiers
5. **Time Bound**: Promotions/discounts valid within date ranges

### Immutability Pattern
Plan versions must be created using `createImmutablePlanVersion()` which:
- Validates input via Zod schema
- Deep freezes the entire object graph
- Returns a `Readonly<PricingPlanVersion>`

## External Dependencies

### Runtime Dependencies
- **Zod** (^3.22.0): Schema validation and type inference for all data models

### Development Dependencies
- **TypeScript** (^5.3.0): Static typing with strict mode enabled
- **Vitest** (^1.0.0): Test runner with 80% coverage thresholds
- **@vitest/coverage-v8**: Code coverage reporting

### Build Configuration
- Target: ES2022
- Module: ESNext with bundler resolution
- Output: `dist/` with declaration files
- Tests excluded from build

### No External Services
This module has no database, API, or external service dependencies. It is designed to be consumed by other modules that handle persistence and external integrations.

## Commands

- `npm run build` - Compile TypeScript to dist/
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run typecheck` - Type check without emitting
