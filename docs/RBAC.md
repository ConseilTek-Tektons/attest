# Attest role-based access control

Attest grants collection, review, policy, vendor, exception, export, and administration separately. Bootstrap policy lives in `src/config/rbac.ts`; approved per-tenant overrides live in PostgreSQL. Every server route checks effective permission and evidence scope.

| Role | Intended access |
|---|---|
| `owner` | Immutable full access and security ownership |
| `admin` | Full compliance, integration, and access administration |
| `compliance_manager` | Controls, evidence, reviews, policies, vendors, exceptions, exports |
| `control_owner` | Assigned controls, evidence collection, assistant |
| `auditor` | Scoped reviews, exports, cited assistant access |
| `evidence_operator` | Run collectors and submit evidence |
| `viewer` | Read-only posture dashboard |

Default groups are `attest-owners`, `attest-admins`, `compliance-managers`, `control-owners`, `external-auditors`, and `evidence-operators`. Unknown groups receive `viewer`.

Adding a capability requires a named permission, minimal grants, server checks, scoped UI, and allow/deny tests. Owner grants remain immutable. Tenant policy updates are audited; evidence immutability is independent of role and cannot be overridden by an administrator.
