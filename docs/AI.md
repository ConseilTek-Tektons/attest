# Compliance copilot and grounded retrieval

Attest explains controls, mappings, test failures, evidence freshness, and draft narratives from explicitly approved context. `POST /api/assistant` requires `assistant.ask`, validates input, applies a distributed rate limit, and exposes no approval or evidence-mutation tools.

## Runtime modes

1. **Local grounded mode** ranks bundled compliance guidance without sending data externally.
2. **OpenAI Responses mode** uses `OPENAI_API_KEY`, approved metadata, and `store: false`.
3. **Hosted RAG mode** adds `OPENAI_VECTOR_STORE_ID` for `file_search` over an explicitly approved corpus.

Run `OPENAI_API_KEY='<key>' pnpm knowledge:ingest` only after classifying the documents in `knowledge/`.

## Compliance safeguards

- Prefer control metadata, hashes, mappings, and status; raw evidence requires explicit source opt-in.
- Tenant scope, feature permission, and evidence authorization precede retrieval.
- Answers cite controls and evidence identifiers and never claim an audit opinion.
- The assistant cannot approve exceptions, complete reviews, alter evidence, or generate an export as a side effect.
- Credentials and secrets never enter prompts, logs, metadata, or the corpus.
