# Changelog

## 1.1.0 - Engineering beta

- Reframed the product from hard-coded AI-provider/model selection to caller-configured workload routing.
- Added task-type and route-policy validation.
- Defined deterministic routing precedence and decision reasons.
- Preserved the historical `IntelligentRouter` surface as a deprecated generic compatibility wrapper.
- Added real TypeScript typecheck, routing tests, build, and dependency-audit gates.
- Scoped the package artifact away from unrelated AI/security placeholder source.
- Removed misleading server-container packaging.
- Added external-provider and security boundaries.
