import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { database } from "@/lib/db";
import { hasEffectivePermission } from "@/lib/rbac-server";

export const runtime = "nodejs";
const workspaceId = process.env.WORKSPACE_ID ?? "00000000-0000-4000-8000-000000000001";
const evidenceSchema = z.object({ controlId: z.string().uuid(), testRunId: z.string().uuid().nullable().default(null), source: z.string().trim().min(2).max(120), objectKey: z.string().trim().min(3).max(500), contentHash: z.string().regex(/^[a-f0-9]{64}$/), observedAt: z.string().datetime(), retentionUntil: z.string().date(), metadata: z.record(z.string(), z.unknown()).default({}) });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "dashboard.view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ data: [], mode: "demo-ui" });
  const rows = await database()`select e.id,e.source,e.object_key,e.content_hash,e.observed_at,e.collected_at,e.retention_until,c.code as control_code,c.title as control from evidence e join control c on c.id=e.control_id where e.organisation_id=${workspaceId} order by e.observed_at desc limit 100`;
  return NextResponse.json({ data: rows, mode: "postgres" });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "evidence.collect")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ error: "PostgreSQL is required for persistent evidence." }, { status: 503 });
  const parsed = evidenceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid evidence.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const created = await database().begin(async (tx) => {
      const [control] = await tx`select id from control where id=${parsed.data.controlId} and organisation_id=${workspaceId}`;
      if (!control) throw new Error("control_not_found");
      const [evidence] = await tx`insert into evidence (organisation_id,control_id,test_run_id,collected_by,source,object_key,content_hash,metadata,observed_at,retention_until) values (${workspaceId},${parsed.data.controlId},${parsed.data.testRunId},${session.user.id},${parsed.data.source},${parsed.data.objectKey},${parsed.data.contentHash},${tx.json(JSON.parse(JSON.stringify(parsed.data.metadata)))},${parsed.data.observedAt},${parsed.data.retentionUntil}) returning *`;
      await tx`insert into audit_event (organisation_id,actor_id,action,entity_type,entity_id,payload) values (${workspaceId},${session.user.id},'evidence.collected','evidence',${evidence.id},${tx.json({ contentHash: parsed.data.contentHash, controlId: parsed.data.controlId })})`;
      return evidence;
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (String(error).includes("control_not_found")) return NextResponse.json({ error: "Control not found." }, { status: 404 });
    if (String(error).includes("unique")) return NextResponse.json({ error: "This evidence was already collected." }, { status: 409 });
    console.error("evidence.create_failed", { message: String(error) }); return NextResponse.json({ error: "Evidence could not be recorded." }, { status: 500 });
  }
}
