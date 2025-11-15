# Chat Ultra with Mazlo — Project Overview

## Project Identity

- **Product Name:** Chat Ultra
- **Brand Host:** Glyphd (glyphd.com/chatultra)
- **Core Character:** **Mazlo (马兹罗)** — Chat Ultra's AI Operator/Steward
- **Target Platform:** Linux (Cursor IDE)
- **Build Environment:** Linux development environment

## Core Value Proposition

Chat Ultra is a **project-centric AI workspace** designed for heavy users who spend significant time working with AI tools. It transforms the "blank chat box" experience into persistent **Rooms** that combine:

- Chat history with context preservation
- Tasks and documents
- Tools and automations
- Visible, inspectable reasoning layer (Trace)
- Multi-language support (especially EN/中文)
- Built-in health guardrails to prevent overuse

## Key Differentiators

1. **Rooms, not one-off chats** — Every serious project becomes a Room with persistent context
2. **Mazlo as transparent operator** — Shows what models/tools are being used, not a black box
3. **Native multilingual support** — Bridge mode for cross-language collaboration
4. **Health-first design** — Time tracking, caps, and "park Room" features for self-care

## Project Structure

```
mazlo-chat-ultra/
├── docs/                          # All documentation
│   ├── 00_PROJECT_OVERVIEW.md    # This file
│   ├── 01_PRODUCT_REQUIREMENTS.md
│   ├── 02_DATA_ARCHITECTURE.md
│   ├── 03_TECHNICAL_STACK.md
│   ├── 04_VISUAL_DESIGN_SYSTEM.md
│   ├── 05_COMPONENT_SPECIFICATIONS.md
│   ├── 06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md
│   ├── 07_IMPLEMENTATION_PHASES.md
│   ├── 08_API_AND_INTEGRATION.md
│   └── 09_TESTING_AND_QA.md
├── apps/
│   └── chat-ultra/               # Main Next.js application
│       ├── app/                  # Next.js App Router
│       ├── components/           # React components
│       ├── lib/                  # Utilities and orchestrator
│       ├── db/                   # Database schema and migrations
│       └── public/               # Static assets
└── README.md                     # Quick start guide
```

## Documentation Index

1. **00_PROJECT_OVERVIEW.md** — This file: project identity and structure
2. **01_PRODUCT_REQUIREMENTS.md** — User personas, core features, use cases
3. **02_DATA_ARCHITECTURE.md** — Database schema, data models, relationships
4. **03_TECHNICAL_STACK.md** — Technology choices, dependencies, environment setup
5. **04_VISUAL_DESIGN_SYSTEM.md** — Colors, typography, spacing, design tokens
6. **05_COMPONENT_SPECIFICATIONS.md** — UI components, states, interactions
7. **06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md** — Step-by-step Linux Cursor build guide
8. **07_IMPLEMENTATION_PHASES.md** — Phased development roadmap
9. **08_API_AND_INTEGRATION.md** — API design, provider integration patterns
10. **09_TESTING_AND_QA.md** — Testing strategy and quality assurance

## Mazlo Character Notes

**Mazlo** (inspired by Maslow's hierarchy of needs) is:
- **Not** a cute mascot or friend simulation
- **Is** the visible AI operator/steward of Chat Ultra
- Responsible for:
  - Context management
  - Model/tool selection
  - Providing optional reasoning traces
  - Health reminders and boundaries

**Visual Identity:**
- Abstract, geometric avatar (not anthropomorphic)
- Circular outline with "hierarchical steps" symbol inside
- Color scheme aligned with Chat Ultra's dark theme
- Sizes: 24px (lists), 32px (chat), 40px (panels), 128-256px (hero)

**Tone & Voice:**
- Calm, clear, patient, respectful
- No excessive emojis or "buddy" language
- Structured sentences with clear options
- Occasional gentle suggestions for health boundaries

## Success Criteria

When complete, Chat Ultra should feel:
- **Not** like a blank chat box, but like "I left off here yesterday, let's continue"
- **Not** like an infinite void, but like "a bounded workspace with clear exits"
- **Visually:** Minimal, clean, negative space, "big-AI chic"
- **Functionally:** Rooms persist, context is preserved, health is visible

## Next Steps

1. Review **01_PRODUCT_REQUIREMENTS.md** for detailed feature specifications
2. Review **02_DATA_ARCHITECTURE.md** for database design
3. Follow **06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md** to set up development environment
4. Use **07_IMPLEMENTATION_PHASES.md** as development roadmap

---

*This documentation is the source of truth for building Chat Ultra with Mazlo on Linux Cursor.*

