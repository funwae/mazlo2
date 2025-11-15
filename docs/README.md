# Chat Ultra Documentation Index

This directory contains complete documentation for building Chat Ultra with Mazlo on Linux Cursor.

## Documentation Files

### Core Documentation

1. **[00_PROJECT_OVERVIEW.md](00_PROJECT_OVERVIEW.md)**
   - Project identity and structure
   - Mazlo character definition
   - Success criteria
   - Documentation index

2. **[01_PRODUCT_REQUIREMENTS.md](01_PRODUCT_REQUIREMENTS.md)**
   - Product definition
   - User personas (Heavy Creator, Cross-Language Collaborator, Self-Aware User)
   - Core features (Rooms, Threads, Messages, Pins, Tasks, Bridge, Health)
   - Information architecture
   - Success criteria

3. **[02_DATA_ARCHITECTURE.md](02_DATA_ARCHITECTURE.md)**
   - Complete database schema
   - Table definitions (users, rooms, threads, messages, traces, tasks, pins, usage_sessions)
   - Relationships and indexes
   - Common queries
   - Migration strategy

4. **[03_TECHNICAL_STACK.md](03_TECHNICAL_STACK.md)**
   - Technology choices (Next.js, React, TypeScript, PostgreSQL, Drizzle)
   - Project structure
   - Mazlo orchestrator architecture
   - API routes structure
   - Security and performance considerations

### Design Documentation

5. **[04_VISUAL_DESIGN_SYSTEM.md](04_VISUAL_DESIGN_SYSTEM.md)**
   - Design philosophy (Calm Tech, Quiet Luxury, Futuristic Minimalism)
   - Complete color system (backgrounds, text, accents, grayscale)
   - Typography (fonts, sizes, weights)
   - Spacing system (4px base)
   - Border radius, shadows, glow
   - Grid system and breakpoints
   - Visual hierarchy

6. **[05_COMPONENT_SPECIFICATIONS.md](05_COMPONENT_SPECIFICATIONS.md)**
   - Base UI components (Button, Input, Badge, Card, Chat Bubbles)
   - Navigation components (Sidebar, Top Bar)
   - Room-specific components (RoomHeader, ThreadList, ChatTimeline, Composer, MazloPanel)
   - Bridge mode components
   - Mazlo-specific components (Avatar, StatusRing)
   - Modal, Drawer, Toast, Skeleton components
   - Interaction states (hover, focus, active, disabled)

### Implementation Documentation

7. **[06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md](06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md)**
   - Prerequisites and system requirements
   - Step-by-step Linux setup
   - Cursor IDE configuration
   - Database setup (local and cloud)
   - Environment variables
   - Development workflow
   - Troubleshooting guide

8. **[07_IMPLEMENTATION_PHASES.md](07_IMPLEMENTATION_PHASES.md)**
   - Phase 1: Core Shell (Weeks 1-2)
   - Phase 2: Chat and Mazlo Integration (Weeks 3-4)
   - Phase 3: Pins, Tasks, and Trace (Weeks 5-6)
   - Phase 4: Bridge Mode and Multi-Language (Weeks 7-8)
   - Phase 5: Health and Usage Tracking (Weeks 9-10)
   - Phase 6: Polish and Export (Weeks 11-12)
   - Development principles

9. **[08_API_AND_INTEGRATION.md](08_API_AND_INTEGRATION.md)**
   - Complete API routes documentation
   - Authentication
   - Rooms, Messages, Threads, Tasks, Pins APIs
   - Health API
   - Provider integration (OpenAI, z.ai, local models)
   - Mazlo orchestrator details
   - Error handling
   - Rate limiting

10. **[09_TESTING_AND_QA.md](09_TESTING_AND_QA.md)**
    - Testing strategy (unit, integration, E2E, visual regression)
    - Complete QA checklist
    - Design system compliance
    - Functionality testing
    - Responsive design testing
    - Performance benchmarks
    - Accessibility checklist
    - Security checklist
    - Testing workflow

11. **[10_DEPLOYMENT_AND_DEVOPS.md](10_DEPLOYMENT_AND_DEVOPS.md)**
    - Vercel deployment (primary)
    - Supabase setup and configuration
    - Docker deployment (self-hosted)
    - CI/CD pipeline (GitHub Actions)
    - Environment management
    - Database migrations in production
    - Backup strategy
    - Troubleshooting

12. **[11_PRODUCTION_CHECKLIST.md](11_PRODUCTION_CHECKLIST.md)**
    - Pre-launch checklist
    - Infrastructure & deployment verification
    - Security checklist
    - Functionality verification
    - Performance checks
    - Legal & compliance
    - Launch day checklist
    - Post-launch monitoring

13. **[12_MONITORING_AND_OBSERVABILITY.md](12_MONITORING_AND_OBSERVABILITY.md)**
    - Error tracking (Sentry)
    - Performance monitoring (Vercel Analytics)
    - Uptime monitoring
    - Logging strategy
    - Analytics (user metrics)
    - Alerting configuration
    - Dashboards

14. **[13_SECURITY_AND_COMPLIANCE.md](13_SECURITY_AND_COMPLIANCE.md)**
    - Authentication security
    - API security (rate limiting, validation)
    - Data security (encryption, access control)
    - Security headers (CSP, HSTS, etc.)
    - GDPR compliance
    - Data retention policies
    - Security audits
    - Incident response

## How to Use This Documentation

### For First-Time Builders

1. Start with **00_PROJECT_OVERVIEW.md** to understand the project
2. Read **01_PRODUCT_REQUIREMENTS.md** to understand features
3. Follow **06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md** to set up your environment
4. Use **07_IMPLEMENTATION_PHASES.md** as your development roadmap
5. Reference **04_VISUAL_DESIGN_SYSTEM.md** and **05_COMPONENT_SPECIFICATIONS.md** while building UI
6. Use **02_DATA_ARCHITECTURE.md** and **03_TECHNICAL_STACK.md** for backend work
7. Reference **08_API_AND_INTEGRATION.md** when building APIs
8. Use **09_TESTING_AND_QA.md** before considering features complete

### For Designers

- **04_VISUAL_DESIGN_SYSTEM.md** — Complete design tokens and visual rules
- **05_COMPONENT_SPECIFICATIONS.md** — Component-level specifications
- **01_PRODUCT_REQUIREMENTS.md** — User personas and use cases

### For Developers

- **03_TECHNICAL_STACK.md** — Technology choices and architecture
- **02_DATA_ARCHITECTURE.md** — Database schema
- **08_API_AND_INTEGRATION.md** — API design
- **06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md** — Setup guide
- **07_IMPLEMENTATION_PHASES.md** — Development roadmap
- **10_DEPLOYMENT_AND_DEVOPS.md** — Deployment guide (Vercel + Supabase)
- **12_MONITORING_AND_OBSERVABILITY.md** — Monitoring setup
- **13_SECURITY_AND_COMPLIANCE.md** — Security practices

### For QA/Testing

- **09_TESTING_AND_QA.md** — Complete testing strategy and checklists
- **11_PRODUCTION_CHECKLIST.md** — Pre-launch verification checklist
- **05_COMPONENT_SPECIFICATIONS.md** — Component states to test
- **01_PRODUCT_REQUIREMENTS.md** — Features to verify

### For DevOps/Deployment

- **10_DEPLOYMENT_AND_DEVOPS.md** — Complete deployment guide
- **11_PRODUCTION_CHECKLIST.md** — Pre-launch checklist
- **12_MONITORING_AND_OBSERVABILITY.md** — Monitoring setup
- **13_SECURITY_AND_COMPLIANCE.md** — Security and compliance

## Key Concepts

### Mazlo

Mazlo (马兹罗) is Chat Ultra's AI operator/steward, inspired by Maslow's hierarchy of needs. Not a cute mascot, but a transparent system that shows what models/tools are being used and provides optional reasoning traces.

### Rooms

Persistent project containers that combine chat history, tasks, documents, and context. Every serious project becomes a Room, not a one-off chat.

### Bridge Mode

Native bilingual collaboration mode built into Rooms. Enables translation with tone control and intent summaries for cross-language work.

### Health Guardrails

Built-in features to prevent overuse: time tracking, daily/weekly caps, reminders, and "Park Room" functionality.

## Source Material

This documentation was compiled and organized from:
- Original English spec (document1.md) — Product definition with Otter mascot
- Chinese spec (document2.md) — Comprehensive product spec with Mazlo mascot
- Visual design spec (document3.md) — Complete design system documentation

**Note:** This documentation uses **Mazlo** (not Otter) as the mascot, based on the latest iteration.

---

*This documentation is the source of truth for building Chat Ultra with Mazlo on Linux Cursor. Follow it precisely for best results.*

