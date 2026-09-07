insert into organisation (id, name, slug) values ('00000000-0000-4000-8000-000000000001', 'ConseilTek Trust', 'conseiltek-trust');
insert into app_user (id, organisation_id, identity_subject, email, display_name) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'demo-owner', 'control.owner@example.test', 'Demo Control Owner'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'demo-manager', 'compliance@example.test', 'Demo Compliance Manager');
insert into framework (id, organisation_id, name, version) values
  ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'SOC 2', '2017 TSC'),
  ('20000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'ISO 27001', '2022');
insert into control (id, organisation_id, code, title, description, owner_id, frequency, status) values
  ('30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'AC-01', 'Privileged access review', 'Review privileged access and remove unnecessary grants.', '10000000-0000-4000-8000-000000000001', 'quarterly', 'passing'),
  ('30000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'CC-07', 'Cloud configuration monitoring', 'Continuously evaluate approved cloud configuration baselines.', '10000000-0000-4000-8000-000000000001', 'continuous', 'failing');
insert into control_mapping (control_id, framework_id, requirement_code, requirement_text) values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'CC6.2', 'Authorize and review access'),
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'A.5.18', 'Access rights');
insert into compliance_test (id, control_id, name, collector_type, configuration) values ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 'Public storage detection', 'aws', '{"rule":"no-public-object-storage"}');
insert into test_run (id, test_id, status, completed_at, summary, details) values ('50000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'failed', now() - interval '18 minutes', 'One resource requires review.', '{"resourceCount":42,"failureCount":1}');
insert into evidence (organisation_id, control_id, test_run_id, collected_by, source, object_key, content_hash, metadata, observed_at, retention_until) values ('00000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000001', 'collector:aws', 'aws-config', 'evidence/cc-07/demo.json', repeat('a',64), '{"format":"application/json"}', now() - interval '18 minutes', current_date + 2555);
insert into policy (organisation_id, title, version, body, status, owner_id, published_at) values ('00000000-0000-4000-8000-000000000001', 'Access Control Policy', 3, 'Access is granted by least privilege and reviewed quarterly.', 'active', '10000000-0000-4000-8000-000000000002', now() - interval '30 days');
insert into vendor (organisation_id, name, risk_tier, assessment_status, renewal_date, owner_id) values ('00000000-0000-4000-8000-000000000001', 'Example Cloud Provider', 'critical', 'approved', current_date + 180, '10000000-0000-4000-8000-000000000002');
