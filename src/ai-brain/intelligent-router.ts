export type Complexity = 'low' | 'medium' | 'high';

export interface Task {
  type: string;
  complexity: Complexity;
  requiresReasoning: boolean;
  requiresSpeed: boolean;
  requiresVision: boolean;
}

export interface RoutePolicy {
  highReasoning: string;
  lowLatency: string;
  vision: string;
  security: string;
  code: string;
  fallback: string;
}

export interface RouteDecision {
  route: string;
  reason: string;
  taskType: string;
}

const MAX_TASK_TYPE_LENGTH = 64;

function normalizeTask(task: Task): Task {
  const type = task.type.trim().toLowerCase();
  if (!type || type.length > MAX_TASK_TYPE_LENGTH) throw new Error('task type must be 1-64 characters');
  return { ...task, type };
}

function assertPolicy(policy: RoutePolicy): void {
  for (const [key, value] of Object.entries(policy)) {
    if (!value.trim()) throw new Error(`route policy ${key} must not be empty`);
  }
}

export class WorkloadRouter {
  constructor(private readonly policy: RoutePolicy) {
    assertPolicy(policy);
  }

  select(taskInput: Task): RouteDecision {
    const task = normalizeTask(taskInput);
    if (task.requiresReasoning && task.complexity === 'high') {
      return { route: this.policy.highReasoning, reason: 'high-complexity reasoning required', taskType: task.type };
    }
    if (task.requiresVision) {
      return { route: this.policy.vision, reason: 'vision capability required', taskType: task.type };
    }
    if (task.type === 'security') {
      return { route: this.policy.security, reason: 'security workload policy', taskType: task.type };
    }
    if (task.type === 'code') {
      return { route: this.policy.code, reason: 'code workload policy', taskType: task.type };
    }
    if (task.requiresSpeed && task.complexity === 'low') {
      return { route: this.policy.lowLatency, reason: 'low-latency path preferred', taskType: task.type };
    }
    return { route: this.policy.fallback, reason: 'fallback workload policy', taskType: task.type };
  }
}

/**
 * @deprecated Historical compatibility wrapper. It performs deterministic policy
 * selection only and does not invoke any AI provider or model.
 */
export class IntelligentRouter {
  private readonly router = new WorkloadRouter({
    highReasoning: 'reasoning',
    lowLatency: 'low-latency',
    vision: 'vision',
    security: 'security',
    code: 'code',
    fallback: 'general',
  });

  selectModel(task: Task): string {
    return this.router.select(task).route;
  }

  async routeTask(task: Task, prompt: string): Promise<{ model: string; prompt: string; timestamp: number }> {
    if (!prompt.trim()) throw new Error('prompt must not be empty');
    return { model: this.selectModel(task), prompt, timestamp: Date.now() };
  }
}
