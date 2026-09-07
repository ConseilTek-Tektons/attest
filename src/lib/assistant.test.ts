import { describe, expect, it } from "vitest";

import { knowledgeArticles } from "../data/knowledge";
import { buildLocalAnswer, retrieveLocalKnowledge } from "./assistant";

describe("local knowledge retrieval", () => {
  it("prioritizes integrity guidance for evidence hashes", () => {
    const [match] = retrieveLocalKnowledge("How are evidence hashes kept immutable?", knowledgeArticles);
    expect(match?.id).toBe("evidence-integrity");
  });

  it("does not invent an answer when there is no supported match", () => {
    const result = buildLocalAnswer("How do I configure payroll?", knowledgeArticles);
    expect(result.citations).toHaveLength(0);
    expect(result.answer).toContain("could not find");
  });
});
