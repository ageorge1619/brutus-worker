# Brutus AI- Cloudflare Worker Backend

Brutus is an AI-powered chat widget embedded in [adamgeorgedesign.com](https://www.adamgeorgedesign.com). Visitors use it to ask questions about Adam's work, case studies, and background. It's powered by Claude via the Anthropic API, with this Cloudflare Worker handling all backend logic.

Live at: [adamgeorgedesign.com](https://www.adamgeorgedesign.com)

---

## What It Does

- Receives messages from the frontend chat widget
- Prepends a system prompt that gives Claude context about Adam's portfolio
- Sends the request to the Anthropic API
- Returns the response to the widget

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers (serverless, edge-deployed) |
| Language | JavaScript (vanilla, no framework) |
| AI Model | Anthropic Claude (claude-sonnet) via REST API |
| Deployment | Wrangler CLI |
| Secret Management | Cloudflare Workers Secrets |
| Frontend | HTML/CSS/JS widget, injected via Squarespace Header code injection |

---

## Architecture

The frontend widget lives in Squarespace's Header code injection — a self-contained block of vanilla HTML, CSS, and JavaScript. When a visitor sends a message, the widget POSTs to this Worker. The Worker attaches the system prompt, calls the Anthropic API, and returns the response. The API key is stored as a Cloudflare secret and never appears in source code.

```
Visitor message
      ↓
Squarespace frontend widget (HTML/CSS/JS)
      ↓
Cloudflare Worker (this repo)
      ↓
Anthropic Claude API
      ↓
Response back to widget
```

---

## Project Structure

```
src/
  index.js        # Worker logic — handles requests, calls Claude API
test/
  index.test.js   # Unit tests (Vitest)
wrangler.jsonc    # Cloudflare Worker config
```

---

## Deployment

Deployed via Wrangler CLI:

```bash
wrangler deploy
```

The Anthropic API key is stored as a Cloudflare secret, not in source:

```bash
wrangler secret put ANTHROPIC_API_KEY
```

---

## Version

Current: **v1.2 Beta**

---

## Author

Adam George — Senior Product Designer, Atlanta, GA
[adamgeorgedesign.com](https://www.adamgeorgedesign.com)
