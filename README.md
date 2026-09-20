Badge CV Builder 🛡️📄

A privacy-focused, zero-backend resume builder that converts verified Credly digital credentials and user career history into a clean, print-ready single-page A4 CV.

Built with vanilla web technologies and an edge proxy worker to guarantee full client-side privacy.

🌟 Key Features

100% Client-Side Execution: Your data stays strictly in your browser. No external databases, no telemetry, no persistent user tracking.

Credly Integration: Fetches verified certifications and skill badges via public profile identifiers.

Cloudflare Edge Proxy: Bypasses CORS and upstream bot-protection layers safely via a lightweight serverless worker without logging personal data.

JSON Import / Export: Portable document state (appState) compliant with custom schemas and easily convertible to formats like JSON Resume.

Print & PDF Optimization: Pixel-perfect A4 styling using CSS print media rules (@page, @media print), eliminating browser artifacts (URL, timestamps, page counts).

Interactive Live Preview: Two-way reactive DOM binding updating personal info, experience, education, badges, and skills in real time.

🧱 Architecture

┌─────────────────────────────────────────────────────────┐
│ Browser (Client-Side)                                   │
│                                                         │
│  [ UI Form Inputs ] ───► [ appState (Single Source) ]   │
│           │                           │                 │
│           ▼                           ▼                 │
│  [ Live A4 Preview ] ◄─── [ Reactive DOM Renderers ]   │
│           │                                             │
│    window.print() ──► Clean PDF (A4 Sheet Layout)       │
└───────────┬─────────────────────────────────────────────┘
            │
            │ GET ?username={id}
            ▼
┌──────────────────────────────────────┐
│ Cloudflare Worker (Edge Proxy)       │
│ - Injects browser headers            │
│ - Handles CORS (Allow-Origin: *)     │
│ - Stateless (Zero data storage)      │
└───────────┬──────────────────────────┘
            │
            │ Fetch public badge JSON
            ▼
┌──────────────────────────────────────┐
│ Credly Public API                    │
└──────────────────────────────────────┘


🚀 Getting Started

Prerequisites

A modern web browser (Chrome, Firefox, Safari, Edge).

A static file server (e.g. VS Code Live Server, Python's http.server, or Node's serve).

Quick Setup

Clone the repository:

git clone https://github.com/your-username/badge-cv-builder.git
cd badge-cv-builder


Serve locally:

# Using Python 3
python3 -m http.server 5500

# Or using npx
npx serve .


Open your browser at http://127.0.0.1:5500.

☁️ Cloudflare Worker Deployment (Edge Proxy)

Credly's upstream API enforces strict CORS and bot-protection challenges against raw client-side fetches. The project routes requests through an ultra-lightweight Cloudflare Worker proxy.

Ensure Node.js (v22+) is installed.

Configure credentials and deploy:

export CLOUDFLARE_API_TOKEN="your-api-token"
npx wrangler deploy


Update workerUrl in js/credly.js with your deployed worker subdomain:

const workerUrl = `https://cv-builder.<your-subdomain>.workers.dev/?username=${encodeURIComponent(username)}`;


🧪 Sample Resume (James Bond 007)

The project includes an embedded mock template (sample-resume.json) featuring James Bond (MI6). It serves as a visual showcase demonstrating:

Multiple role descriptions and organizational formatting.

Credly certification badge layouts with fallback rendering.

Tagged skills clustering.

Real-time import testing without entering personal data upfront.

🤖 AI Ethics & Transparency Statement

In alignment with modern software transparency and responsible AI development principles:

Human-Driven Architecture & Core Engineering: The core design patterns, functional state architecture (appState), data-binding flow, DOM manipulation, and Cloudflare Worker routing were architected, guided, and validated by the human engineer.

AI Collaboration: Generative AI tools (LLMs) served as collaborative co-pilots during development, assisting with:

Rapid CSS media print layout troubleshooting and edge-margin normalization.

Generating sample test data fixtures (the MI6 James Bond dataset).

Draft scaffolding for boilerplate utility functions.

Data Privacy Assurance: No proprietary user data, private credentials, or API secret tokens were exposed to AI training loops during the creation of this application.