import { describe, expect, it } from "vitest";
import { evidenceDigest, verifyEvidence } from "./evidence-integrity";

describe("evidence integrity", () => {
  it("verifies unchanged evidence", () => { const digest = evidenceDigest("control result"); expect(verifyEvidence("control result", digest)).toBe(true); });
  it("rejects modified evidence", () => expect(verifyEvidence("modified", evidenceDigest("original"))).toBe(false));
});
