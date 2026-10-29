# CareConnect AI v1.0.0 - Production Release

Welcome to the initial official production release of **CareConnect AI** (`v1.0.0`), a modern conversational AI healthcare assistant and patient support portal.

## Highlights & Features

- **Dual-Engine Healthcare Assistant**:
  - **Demo Mode**: 100% offline deterministic clinical decision engine with symptom taxonomy matching and instant emergency red-flag triage. Zero API keys or backend setup required.
  - **Real AI Mode**: Direct integration with Google Gemini 1.5 Flash via REST API, utilizing clinical safety system instructions and graceful fallback.
  - **Engine Switcher**: One-click toggle between Demo Mode and Real AI Mode from the top bar or settings.
- **Emergency Triage & Safety**:
  - Automatic detection of severe medical emergencies with immediate 911 alert guidance.
  - Prominent non-diagnostic educational disclaimers across all health interactions.
- **Appointments Management**:
  - Comprehensive demo scheduling interface with filtering (`All`, `Upcoming`, `Completed`, `Cancelled`), cancellation, and appointment preparation checklists.
- **Health & Wellness Library**:
  - 12 curated educational articles across Preventative Care, Chronic Care, Mental Health, and Nutrition with instant search, category filters, and bookmarking.
- **Medication Information Directory**:
  - Medication cards detailing dosing, instructions, side effects, and "Ask AI about this medication" direct shortcuts.
- **Patient Support & Visit Prep**:
  - Interactive doctor-visit preparation checklist with task completion tracking, FAQ accordion, and crisis helpline contact cards.
- **Accessibility & Design**:
  - High-contrast clinical theme tokens: Clinical Sapphire (`#2563EB`) and Obsidian Slate (`#0B192C` / `#0F172A`).
  - Accessibility controls for Large Text (18px root scale) and Reduced Motion.
  - Fully responsive across desktop, tablet, and mobile viewports.

---

## Artifacts & Checksums

| File | Type | SHA-256 Checksum |
| :--- | :--- | :--- |
| `CareConnect-AI-v1.0.0-web.zip` | Production Web SPA Build (`dist/`) | `80cf66ad5e3eedc38c7ba342c5a42b26312f893a04057043f1b4ec5a6bc8af58` |
| `checksums.txt` | Cryptographic Checksums | - |

---

## Installation & Deployment

### Quick Web Deployment
Unzip `CareConnect-AI-v1.0.0-web.zip` and serve with any static web server:
```bash
npx serve dist -s -l 5180
# or using python
python -m http.server 5180 -d dist
```

### Run from Source
```bash
git clone https://github.com/premkumarsenthilkumar/Care-Connect-AI.git
cd Care-Connect-AI
npm install
npm run dev
```

---

## Known Limitations
- Fictional/demo appointment management and client-side browser `localStorage` persistence.
- Informational and educational use only; not a diagnostic medical device.
