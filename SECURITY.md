# Security Policy

This package performs deterministic route selection only. It does not authenticate callers, invoke AI providers, or validate downstream execution results.

Report suspected vulnerabilities privately through GitHub security reporting where available.

Treat task metadata and prompts as untrusted input at system boundaries. Callers are responsible for authorization, prompt/data handling, provider credentials, rate limits, budget controls, logging redaction, output validation, and any safety policy required by downstream execution targets.

Do not store API keys, provider secrets, customer content, or other sensitive data in repository fixtures or routing policies.
