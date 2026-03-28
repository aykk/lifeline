import type { NextRequest } from "next/server";
import { runPipeline } from "@/backend/pipeline";
import type { WakeWordEvent } from "@/backend/actions";

export async function POST(request: NextRequest) {
  let body: WakeWordEvent;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body?.phrase) {
    return Response.json({ error: "Missing required field: phrase" }, { status: 422 });
  }

  const result = runPipeline(body);
  return Response.json(result);
}
