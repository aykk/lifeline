import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { phone_number, message, trigger_phrase, user_id } = await req.json();

  if (!phone_number) {
    return Response.json({ error: "Phone number is required." }, { status: 400 });
  }

  const apiKey = process.env.BLAND_AI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured." }, { status: 500 });
  }

  const task = message
    ? `You are an urgent AI assistant. Deliver this message clearly and immediately: "${message}". Do not add anything else.`
    : "You are a friendly AI assistant. Introduce yourself and say hello.";

  const first_sentence = message ?? "Hello, I have an important message for you.";

  const res = await fetch("https://api.bland.ai/v1/calls", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number,
      task,
      voice: "nat",
      first_sentence,
      wait_for_greeting: false,
    }),
  });

  const data = await res.json();
  const success = res.ok;

  // Write log if user is authenticated
  if (user_id && trigger_phrase) {
    try {
      const supabase = await createClient();
      await supabase.from("call_logs").insert({
        user_id,
        trigger_phrase: trigger_phrase ?? "",
        phone_number,
        message: message ?? "",
        success,
      });
    } catch {}
  }

  if (!success) {
    return Response.json({ error: data.message ?? "Failed to initiate call." }, { status: res.status });
  }

  return Response.json({ call_id: data.call_id });
}
