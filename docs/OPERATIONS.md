# Attest operations

`GET /api/health` reports the application, PostgreSQL, Redis, identity, and AI readiness without exposing secret or evidence content. App Runner and App Service use it for health replacement.

## Managed-service model

Managed web compute, PostgreSQL, queues, Redis, and object storage reduce host, orchestrator, backup, patching, replacement, and scaling maintenance. Operators still own control interpretation, collector scopes, retention policy, encryption keys, restore drills, budgets, and dependency security.

## Release sequence

1. Pass `pnpm check`, IaC validation, and a signed/scanned image build.
2. Back up PostgreSQL and apply compatible migrations using a dedicated release identity.
3. Verify OIDC, least-privilege collector access, a successful and failed test, evidence SHA-256, RBAC denial, and cited copilot output.
4. Attempt an evidence update/delete in staging and confirm PostgreSQL rejects it; verify object-retention policy separately.
5. Shift traffic while monitoring collector age/errors, queue depth, failing controls, evidence freshness, database health, and IdP callbacks.

Test point-in-time database recovery and evidence-bundle verification quarterly. Retention-protected objects may outlive application records by design; document deletion/legal-hold procedures with the owning organization.
