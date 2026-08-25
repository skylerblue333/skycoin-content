import { describe, expect, it } from 'vitest';
import { IntelligentRouter, WorkloadRouter, type RoutePolicy } from '../src/ai-brain/intelligent-router';

const policy: RoutePolicy = {
  highReasoning: 'route-reasoning',
  lowLatency: 'route-fast',
  vision: 'route-vision',
  security: 'route-security',
  code: 'route-code',
  fallback: 'route-general',
};

describe('WorkloadRouter', () => {
  it('uses high reasoning before other route preferences', () => {
    const router = new WorkloadRouter(policy);
    expect(router.select({ type: 'code', complexity: 'high', requiresReasoning: true, requiresSpeed: true, requiresVision: true })).toEqual({
      route: 'route-reasoning',
      reason: 'high-complexity reasoning required',
      taskType: 'code',
    });
  });

  it('routes vision, security, code, latency, then fallback deterministically', () => {
    const router = new WorkloadRouter(policy);
    expect(router.select({ type: 'general', complexity: 'medium', requiresReasoning: false, requiresSpeed: false, requiresVision: true }).route).toBe('route-vision');
    expect(router.select({ type: 'SECURITY', complexity: 'medium', requiresReasoning: false, requiresSpeed: false, requiresVision: false }).route).toBe('route-security');
    expect(router.select({ type: 'code', complexity: 'medium', requiresReasoning: false, requiresSpeed: false, requiresVision: false }).route).toBe('route-code');
    expect(router.select({ type: 'summary', complexity: 'low', requiresReasoning: false, requiresSpeed: true, requiresVision: false }).route).toBe('route-fast');
    expect(router.select({ type: 'summary', complexity: 'medium', requiresReasoning: false, requiresSpeed: false, requiresVision: false }).route).toBe('route-general');
  });

  it('fails closed on empty policies and malformed task types', () => {
    expect(() => new WorkloadRouter({ ...policy, fallback: ' ' })).toThrow(/fallback/);
    const router = new WorkloadRouter(policy);
    expect(() => router.select({ type: ' ', complexity: 'low', requiresReasoning: false, requiresSpeed: false, requiresVision: false })).toThrow(/task type/);
  });
});

describe('IntelligentRouter compatibility wrapper', () => {
  it('returns generic route identifiers and never claims provider execution', async () => {
    const router = new IntelligentRouter();
    const result = await router.routeTask({ type: 'code', complexity: 'medium', requiresReasoning: false, requiresSpeed: false, requiresVision: false }, 'review this');
    expect(result.model).toBe('code');
    expect(result.prompt).toBe('review this');
    expect(result.timestamp).toEqual(expect.any(Number));
    await expect(router.routeTask({ type: 'general', complexity: 'low', requiresReasoning: false, requiresSpeed: false, requiresVision: false }, ' ')).rejects.toThrow(/prompt/);
  });
});
