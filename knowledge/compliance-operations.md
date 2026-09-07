# Attest compliance operations

## Evidence integrity

Hash every object with SHA-256, write it once, and apply object-store retention. Corrections append a new record; they never rewrite earlier evidence.

## Framework mapping

Map a control to the exact requirement and framework version. Reuse the same approved evidence when it genuinely supports multiple requirements.

## Collector security

Give each automated collector a dedicated read-only identity and the narrowest resource scope. Keep credentials outside PostgreSQL, logs, AI prompts, and evidence metadata.

## AI boundary

The compliance copilot can explain failures and draft narratives from opted-in metadata. It cannot issue an audit opinion, approve an exception, or expose raw evidence without explicit authorization.
