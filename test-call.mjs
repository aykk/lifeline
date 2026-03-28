// Standalone test script for Bland AI — run with: node test-call.mjs
// Requires Node v18+

const apiKey = process.env.BLAND_AI_API_KEY ?? "";
const targetPhoneNumber = "";

const url = "https://api.bland.ai/v1/calls";

const payload = {
  phone_number: targetPhoneNumber,
  task: "You are a friendly AI assistant testing a hackathon project. When the user answers, introduce yourself, ask them how their coding is going, and tell a short programming joke. Keep it brief.",
  voice: "nat",
  first_sentence: "Hey there! I'm the AI agent from your hackathon project. Can you hear me okay?",
  wait_for_greeting: false,
};

try {
  console.log(`Dialing ${targetPhoneNumber}...`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.ok) {
    console.log("✅ Call successfully initiated!");
    console.log("Call ID:", data.call_id);
    console.log("Get ready to pick up your phone...");
  } else {
    console.error("❌ Failed to initiate call:", data);
  }
} catch (error) {
  console.error("Network Error:", error);
}
