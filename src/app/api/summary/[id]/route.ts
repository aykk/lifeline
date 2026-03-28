import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: log, error: logErr } = await supabase
    .from("call_logs")
    .select("*")
    .eq("id", id)
    .single();

  if (logErr || !log) {
    return Response.json({ error: "Log not found." }, { status: 404 });
  }

  // Return cached summary immediately
  if (log.summary) {
    return Response.json({ summary: log.summary });
  }

  const blandKey = process.env.BLAND_AI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return Response.json({ error: "Gemini API key not configured." }, { status: 500 });
  }

  // Fetch Bland AI call transcript if available
  let transcript = "";
  if (log.call_id && blandKey) {
    try {
      const blandRes = await fetch(`https://api.bland.ai/v1/calls/${log.call_id}`, {
        headers: { authorization: blandKey },
      });
      if (blandRes.ok) {
        const blandData = await blandRes.json();
        const turns: { user: string; text: string }[] = blandData.transcripts ?? [];
        transcript = turns.map((t) => `${t.user}: ${t.text}`).join("\n");
      }
    } catch {}
  }

  const contextBlock = [
    `Trigger phrase: "${log.trigger_phrase}"`,
    `Message delivered: "${log.message}"`,
    `Called: ${log.phone_number}`,
    `Time: ${new Date(log.created_at).toLocaleString()}`,
    `Call status: ${log.success ? "connected" : "failed"}`,
    transcript ? `\nCall transcript:\n${transcript}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `You are a safety incident documentation assistant. Based on the following incident data, write a concise post-incident summary (3–5 sentences) suitable for personal records or sharing with authorities. Be factual, clear, and compassionate. Do not speculate beyond the data provided.\n\n${contextBlock}\n\nWrite the summary now:`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
      }),
    }
  );

  if (!geminiRes.ok) {
    return Response.json({ error: "Failed to generate summary." }, { status: 502 });
  }

  const geminiData = await geminiRes.json();
  const summary: string =
    geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  if (summary) {
    await supabase.from("call_logs").update({ summary }).eq("id", id);
  }

  return Response.json({ summary });
}
