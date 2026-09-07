import { createHash } from "node:crypto";

export function evidenceDigest(content: string | Buffer) {
  return createHash("sha256").update(content).digest("hex");
}

export function verifyEvidence(content: string | Buffer, expectedDigest: string) {
  return evidenceDigest(content) === expectedDigest.toLowerCase();
}
