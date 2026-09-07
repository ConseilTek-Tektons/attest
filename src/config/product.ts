import type { ProductConfig } from "./types";

export const product: ProductConfig = {
  id: "attest",
  name: "Attest",
  category: "Platform & Ops",
  tagline: "Continuous compliance evidence, collected in your account.",
  description: "A self-hosted evidence pipeline for controls, automated tests, access reviews, policies, vendors, and audit exports.",
  repositoryUrl: "https://github.com/ConseilTek-Tektons/attest",
  nav: [{ label: "Controls" }, { label: "Evidence" }, { label: "Reviews", badge: "9" }, { label: "Vendors" }],
  demoUsers: [
    { id: "demo-admin", name: "Maya Chen", email: "maya@northstar.example", role: "admin", label: "Compliance admin" },
    { id: "demo-manager", name: "Jon Bell", email: "jon@northstar.example", role: "control_owner", label: "Control owner" },
    { id: "demo-host", name: "Priya Rao", email: "priya@northstar.example", role: "auditor", label: "Scoped auditor" },
  ],
  ai: {
    name: "Compliance copilot",
    description: "Ask about control mappings, test failures, evidence freshness, exceptions, or draft narratives.",
    systemPrompt: "You are Attest's compliance copilot. Use only opted-in control metadata and approved knowledge. Cite controls and evidence hashes, never claim to issue an audit opinion, and never send raw evidence to a model without explicit source opt-in.",
    suggestedQuestions: ["Which failure affects both frameworks?", "Explain evidence immutability.", "Draft a control narrative from approved metadata."],
  },
};
