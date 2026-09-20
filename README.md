# Badge CV Builder 🛡️📄

A privacy-focused, zero-backend resume builder that converts verified Credly digital credentials and career history into a clean, print-ready single-page A4 CV.

Built entirely with vanilla web technologies and an edge proxy worker to guarantee client-side privacy.

---

## 🌟 Key Features

* **100% Client-Side Execution:** Your data stays strictly in your browser. No external databases, no telemetry, no tracking.
* **Credly Integration:** Fetches verified certifications and skill badges directly via public profile identifiers.
* **Cloudflare Edge Proxy:** Safely handles upstream bot-protection and CORS via a lightweight serverless worker without storing user data.
* **JSON Import & Export:** Full state persistence (`appState`) compliant with easy backup and editing workflows.
* **Print & PDF Optimization:** Pixel-perfect A4 styling using CSS print rules (`@page`, `@media print`), eliminating browser artifacts (URL, timestamps, margins).
* **Live Interactive Preview:** Two-way reactive DOM binding updating personal info, experience, education, badges, and skills in real time.

---

## 🏗️ Architecture

```text
[ Browser (Client-Side) ]
 ├── [ UI Form Inputs ] ─────────► [ appState (Single Source) ]
 ├── [ Live A4 Preview ] ◄──────── [ Reactive DOM Renderers ]
 └── [ Clean PDF Export ] ◄─────── window.print() (@media print)
            │
            ▼ (GET ?username={id})
[ Cloudflare Worker (Edge Proxy) ]
 ├── Injects browser headers (User-Agent, Accept)
 ├── Sets Access-Control-Allow-Origin: *
 └── Stateless (Zero data storage)
            │
            ▼
[ Credly Public API ]
```

---

## 🚀 Getting Started

### Prerequisites

* Modern web browser (Chrome, Firefox, Safari, Edge)
* Local static file server (VS Code Live Server, Python `http.server`, etc.)

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jterejlis/badge-cv-builder.git
   cd badge-cv-builder
   ```

2. **Serve locally:**
   ```bash
   # Using Python 3
   python3 -m http.server 5500
   ```

3. Open `http://localhost:5500` in your browser.

---

## ☁️ Cloudflare Worker Deployment

To run your own Credly CORS proxy worker:

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Deploy the Worker:**
   ```bash
   wrangler deploy worker.js --name cv-builder
   ```

---

## 🧪 Mock Profile (James Bond)

The repository includes a ready-to-test sample (`sample-resume.json`) populated with a pop-culture mock profile (James Bond / MI6). It allows immediate testing of layout constraints, multi-entry experience blocks, and badge rendering without inputting private records.

---

## 🤖 AI Ethics & Transparency

This project was developed with the assistance of LLM tooling (Gemini) adhering to principles of technical transparency:

* **Human Agency:** The architecture, core logic, debugging flow (Cloudflare Wrangler deployment, CSS print margin isolation, reactive DOM handling), and design choices were directed and vetted by the engineer.
* **Role of AI:** Used as an interactive pair-programmer for rapid prototyping, syntax validation, and layout troubleshooting.
* **Data Sovereignty:** No private credentials, proprietary secrets, or personal identifiable information (PII) were processed by non-local third-party APIs during development.

---

## 📄 License

MIT License. Free to use, modify, and distribute.
