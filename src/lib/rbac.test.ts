import { describe, expect, it } from "vitest";
import { hasPermission, resolveRolesFromClaims } from "./rbac";

describe("Attest RBAC", () => {
  it("grants wildcard permissions to administrators", () => expect(hasPermission(["admin"], "exceptions.manage")).toBe(true));
  it("keeps policy changes away from auditors", () => expect(hasPermission(["auditor"], "policies.manage")).toBe(false));
  it("maps compliance groups", () => expect(resolveRolesFromClaims({ groups: ["control-owners"] })).toEqual(["control_owner"]));
});
