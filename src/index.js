export default {
  async fetch(request, env) {
    // Handle CORS preflight FIRST — browsers send this before any POST
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Anything that's not a POST gets a friendly status message
    if (request.method !== "POST") {
      return new Response("Brutus is online. Send a POST request to chat.", {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      const body = await request.json();
      const userMessage = body.message;

      if (!userMessage) {
        return new Response(JSON.stringify({ error: "No message provided" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      // Call the Anthropic API
      const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          system: "You are Brutus, an AI assistant on Adam George's portfolio site at adamgeorgedesign.com. Adam is a senior product designer in Atlanta, GA with six years of experience. Past clients include The Home Depot. You help visitors learn about Adam's work. Keep responses to 2-4 sentences. Be warm but direct. Don't pretend to be Adam himself — you're his assistant. For hiring inquiries or anything that needs Adam directly, point people to ageorge1619@gmail.com. If you don't know something, say so plainly.",
          messages: [
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await anthropicResponse.json();

      if (!anthropicResponse.ok) {
        return new Response(JSON.stringify({ error: "Anthropic API error", details: data }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      const reply = data.content[0].text;

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};