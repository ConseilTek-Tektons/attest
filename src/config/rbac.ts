export const rbacConfig = {
  roles: {
    owner: { label: "Owner", description: "Full control, including security and workspace policy." },
    admin: { label: "Admin", description: "Manages compliance operations, integrations, and access." },
    compliance_manager: { label: "Compliance manager", description: "Operates frameworks, controls, reviews, and exceptions." },
    control_owner: { label: "Control owner", description: "Maintains assigned controls and remediation." },
    auditor: { label: "Auditor", description: "Reviews immutable evidence and exports." },
    evidence_operator: { label: "Evidence operator", description: "Runs collectors and submits evidence." },
    viewer: { label: "Viewer", description: "Read-only compliance posture access." },
  },
  permissions: {
    "dashboard.view": "View compliance posture", "controls.manage": "Manage controls and mappings",
    "evidence.collect": "Run collectors and submit evidence", "reviews.manage": "Perform access and control reviews",
    "policies.manage": "Manage policies and acknowledgements", "vendors.manage": "Manage vendor assessments",
    "exceptions.manage": "Approve and track exceptions", "exports.manage": "Generate audit exports",
    "assistant.ask": "Ask the compliance copilot", "access.manage": "Configure roles and identity mappings",
    "settings.manage": "Manage workspace integrations and settings",
  },
  rolePermissions: {
    owner: ["*"], admin: ["*"],
    compliance_manager: ["dashboard.view", "controls.manage", "evidence.collect", "reviews.manage", "policies.manage", "vendors.manage", "exceptions.manage", "exports.manage", "assistant.ask"],
    control_owner: ["dashboard.view", "controls.manage", "evidence.collect", "assistant.ask"], auditor: ["dashboard.view", "reviews.manage", "exports.manage", "assistant.ask"],
    evidence_operator: ["dashboard.view", "evidence.collect", "assistant.ask"], viewer: ["dashboard.view"],
  } as Record<string, readonly string[]>,
  identityGroupMappings: {
    "attest-owners": "owner", "attest-admins": "admin", "compliance-managers": "compliance_manager",
    "control-owners": "control_owner", "external-auditors": "auditor", "evidence-operators": "evidence_operator",
  } as Record<string, string>,
  defaultRole: "viewer",
};
