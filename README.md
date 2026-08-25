# SKYCOIN4444 Workload Router

A small TypeScript library for deterministic workload classification and route selection. Callers provide route identifiers through policy; the library returns a route decision and reason. It does **not** call AI providers, discover models, measure live capacity, execute prompts, or claim that any named model/provider is available.

## Implemented behavior

- validates non-empty bounded task types
- accepts explicit complexity/reasoning/speed/vision signals
- applies documented deterministic precedence: high reasoning → vision → security → code → low-latency → fallback
- validates every configured policy route is non-empty
- returns a route identifier plus human-readable decision reason
- preserves the historical `IntelligentRouter` API as a deprecated compatibility wrapper using generic route names
- rejects empty prompts in the compatibility wrapper

## Example

```ts
import { WorkloadRouter } from "@skycoin4444/workload-router";

const router = new WorkloadRouter({
  highReasoning: "reasoning-pool",
  lowLatency: "fast-pool",
  vision: "vision-pool",
  security: "security-review",
  code: "code-pool",
  fallback: "general-pool",
});

const decision = router.select({
  type: "code",
  complexity: "high",
  requiresReasoning: true,
  requiresSpeed: false,
  requiresVision: false,
});
```

## Verification

```bash
npm install
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

CI runs typecheck, deterministic routing tests, build, and dependency audit on main, product branches, and pull requests.

## Integration boundary

Provider/model adapters should live outside this library. A caller may map route IDs to an AI service, local worker pool, human review queue, batch processor, or other execution target. Authentication, provider SDKs, retries, budgets, live health/capacity, prompt safety, observability, and result validation are separate concerns.

The repository contains historical AI/security experiments that are intentionally excluded from this package artifact. They remain in Git history rather than being presented as implemented product capabilities.

## Status

**Classification:** ENGINEERING LAB / beta library.

A green build proves deterministic routing behavior only. It does not prove any external AI or worker service exists or is healthy.

## License

MIT; see `LICENSE`.
