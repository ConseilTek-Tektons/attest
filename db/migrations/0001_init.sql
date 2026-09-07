create extension if not exists pgcrypto;

create table organisation (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, created_at timestamptz not null default now());
create table app_user (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  identity_subject text not null, email text not null, display_name text not null, active boolean not null default true,
  created_at timestamptz not null default now(), unique (organisation_id, identity_subject), unique (organisation_id, email)
);
create table framework (id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade, name text not null, version text not null, active boolean not null default true, unique (organisation_id, name, version));
create table control (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  code text not null, title text not null, description text not null, owner_id uuid references app_user(id),
  frequency text not null check (frequency in ('continuous','daily','weekly','monthly','quarterly','annual')),
  status text not null default 'not_tested' check (status in ('not_tested','passing','failing','exception')), unique (organisation_id, code)
);
create table control_mapping (control_id uuid not null references control(id) on delete cascade, framework_id uuid not null references framework(id) on delete cascade, requirement_code text not null, requirement_text text not null, primary key (control_id, framework_id, requirement_code));
create table compliance_test (
  id uuid primary key default gen_random_uuid(), control_id uuid not null references control(id) on delete cascade,
  name text not null, collector_type text not null check (collector_type in ('aws','azure','github','identity','manual','api')),
  configuration jsonb not null default '{}'::jsonb, enabled boolean not null default true, unique (control_id, name)
);
create table test_run (
  id uuid primary key default gen_random_uuid(), test_id uuid not null references compliance_test(id) on delete cascade,
  status text not null check (status in ('queued','running','passed','failed','error')), started_at timestamptz not null default now(),
  completed_at timestamptz, summary text not null default '', details jsonb not null default '{}'::jsonb
);
create table evidence (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  control_id uuid not null references control(id), test_run_id uuid references test_run(id), collected_by text not null,
  source text not null, object_key text not null, content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'),
  metadata jsonb not null default '{}'::jsonb, observed_at timestamptz not null, collected_at timestamptz not null default now(),
  retention_until date not null, unique (organisation_id, object_key), unique (organisation_id, content_hash, observed_at)
);
create index evidence_control_time_idx on evidence (control_id, observed_at desc);
create function prevent_evidence_mutation() returns trigger language plpgsql as $$ begin raise exception 'Evidence is append-only'; end; $$;
create trigger evidence_immutable before update or delete on evidence for each row execute function prevent_evidence_mutation();
create table access_grant (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  subject text not null, resource text not null, entitlement text not null, granted_at timestamptz not null, revoked_at timestamptz
);
create table access_review (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  name text not null, reviewer_id uuid references app_user(id), status text not null default 'open' check (status in ('draft','open','completed')),
  due_at timestamptz not null, completed_at timestamptz
);
create table access_review_item (
  review_id uuid not null references access_review(id) on delete cascade, access_grant_id uuid not null references access_grant(id) on delete cascade,
  decision text check (decision in ('approve','revoke')), rationale text not null default '', decided_at timestamptz, primary key (review_id, access_grant_id)
);
create table policy (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  title text not null, version integer not null, body text not null, status text not null check (status in ('draft','active','retired')),
  owner_id uuid references app_user(id), published_at timestamptz, unique (organisation_id, title, version)
);
create table policy_acknowledgement (policy_id uuid not null references policy(id) on delete cascade, user_id uuid not null references app_user(id) on delete cascade, acknowledged_at timestamptz not null default now(), primary key (policy_id, user_id));
create table vendor (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  name text not null, risk_tier text not null check (risk_tier in ('low','medium','high','critical')),
  assessment_status text not null default 'not_started' check (assessment_status in ('not_started','in_review','approved','rejected')),
  renewal_date date, owner_id uuid references app_user(id), unique (organisation_id, name)
);
create table control_exception (
  id uuid primary key default gen_random_uuid(), control_id uuid not null references control(id) on delete cascade,
  reason text not null, compensating_control text not null, requested_by uuid references app_user(id), approved_by uuid references app_user(id),
  status text not null default 'requested' check (status in ('requested','approved','rejected','expired')), expires_at timestamptz not null, created_at timestamptz not null default now()
);
create table audit_event (id bigint generated always as identity primary key, organisation_id uuid not null references organisation(id) on delete cascade, actor_id text not null, action text not null, entity_type text not null, entity_id text not null, payload jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now());
create index audit_event_org_time_idx on audit_event (organisation_id, occurred_at desc);
create table role_policy (organisation_id uuid not null references organisation(id) on delete cascade, role_key text not null, permissions text[] not null default '{}', updated_by text not null, updated_at timestamptz not null default now(), primary key (organisation_id, role_key));
