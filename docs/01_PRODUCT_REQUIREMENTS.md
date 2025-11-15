# Chat Ultra — Product Requirements

## 1. Product Definition

### 1.1 What Chat Ultra Is

Chat Ultra is a **project-centric AI workspace** for heavy users who live in chat all day.

**Core Concept:**
- Replaces "blank chat box" with **persistent Rooms** that combine:
  - Chat history with context preservation
  - Tasks and documents
  - Tools and automations
  - Visible, inspectable reasoning layer (Trace)
- Runs on **multiple LLM providers** (pluggable, not the product)
- Opinionated about **health** and **overuse** — reflects time spent and nudges users to pause

### 1.2 Primary User Personas

#### Persona A: Heavy Creator/Architect
- **Age:** 30-60
- **Status:** Long-term independent worker or small team
- **Behavior:** Spends 4+ hours daily in AI tools for design, architecture, content
- **Pain Points:**
  - Projects scattered across different chats, hard to review
  - Self-aware of "overuse" risk but lacks tool support for boundaries

**Use Case:** Writing a book / large product concept
- Create Room: "Book · Chat Ultra Design Notes"
- Split chapters into Threads
- Pin key paragraphs/concepts
- Daily summary + next steps from Mazlo

#### Persona B: Cross-Language Collaborator
- **Languages:** Chinese + English
- **Work Context:** Overseas developers, designers, local teams
- **Pain Points:**
  - Manual tool switching for translation
  - Multi-language communication can't bind to project context

**Use Case:** US-China team collaboration on new feature
- Create Room: "Feature X – Cross-border Version"
- Enable Bridge mode in Room
- Write requirements in Chinese, Mazlo generates English version with intent notes
- Receive English feedback, translate back to Chinese with intent summary

#### Persona C: Self-Aware Heavy User
- **Background:** Loneliness/pressure, sensitive to tech addiction risk
- **Concern:** Clear worry about AI's impact on life

**Use Case:** Daily learning + health boundaries
- Create Rooms for learning topics
- Set daily limit: 2 hours, reminder every 45 minutes
- When approaching limit, Mazlo prompts:
  - "You can continue 30 minutes, or wrap up today's content"
- User chooses "wrap up", Mazlo generates daily summary + tomorrow's plan

### 1.3 Core Jobs To Be Done

1. **"Pick up my project where I left off yesterday without hunting through old chats."**
   - Rooms persist with context
   - Pins mark key decisions
   - Threads organize sub-topics

2. **"See what the AI was thinking and which tools it used, when I care."**
   - Mazlo shows provider/model used
   - Trace panel shows reasoning steps (optional)
   - Tools panel shows what's available/used

3. **"Translate and coordinate across languages while preserving tone."**
   - Bridge mode built into Rooms
   - Tone selector (Neutral/Warm/Formal)
   - Intent summaries for translations

4. **"Keep my AI use in check rather than spiraling into another all-night redesign."**
   - Time tracking per session/day/week
   - Daily/weekly caps with warnings
   - "Park Room" feature to pause projects

## 2. Information Architecture

### 2.1 Top-Level Entities

1. **User** — Account, preferences, health settings
2. **Workspace** — Single-user initially (multi-user later)
3. **Room** — Container for medium-to-long-term tasks
4. **Thread** — Sub-topic within a Room
5. **Message** — User/Mazlo/System messages
6. **Trace** — Reasoning steps for Mazlo messages
7. **Task** — Actionable items extracted from messages
8. **Pin** — Fixed key messages/summaries/links
9. **Language Profile** — Room-level language configuration
10. **Usage Session** — Continuous usage time for health stats

### 2.2 Navigation Hierarchy

**Landing Page:** `glyphd.com/chatultra`

**App Shell (authenticated):**
- Home
- Rooms
- Activity (future)
- Settings

**Inside App:**

**Home View:**
- "Continue" section (recent Rooms)
- Today panel
- Time-use summary
- Health controls
- Mazlo insight card

**Rooms View:**
- Room list with filters
- Room detail view

**Room Detail:**
- Left: Room meta (Threads, Pins)
- Center: Chat timeline + composer
- Right: Mazlo Panel (Trace/Tools/Context) + Tasks

**Settings:**
- Providers (API keys, model selection)
- Themes (visual presets)
- Health (time limits, reminders)
- Shortcuts (keyboard shortcuts)

## 3. Core Features

### 3.1 Rooms

**Purpose:** Persistent project containers

**Features:**
- Name (editable)
- Status: Active / Paused / Archived
- World theme (visual preset)
- Language profile (primary + secondary languages)
- Summary (auto-generated or manual)
- Created/updated timestamps

**Actions:**
- Create new Room
- Park Room (pause with summary)
- Export Room (Markdown + JSON)
- Archive Room

### 3.2 Threads

**Purpose:** Sub-topics within a Room

**Features:**
- Title
- Last message timestamp
- Unread indicator
- Clicking switches chat view to that Thread

**Actions:**
- Create new Thread (fresh context, same Room memory)
- Switch between Threads
- View Thread history

### 3.3 Messages

**Types:**
- **User message:** Left-aligned bubble
- **Mazlo message:** Right-aligned bubble with:
  - Mazlo avatar
  - Provider tag (e.g., "gpt-5.1", "glm-4.6")
  - Content (markdown rendered)
  - Action buttons: "Why", "Try another path", "Pin", "Make a task"

**Composer:**
- Multi-line text area (min 56px height)
- Mode selector: Chat / Translate / Code / Critique
- File upload
- Provider selector pill
- Mazlo status ring (idle/thinking/waiting)
- Send button

### 3.4 Mazlo Panel (Right Column)

**Tabs:**
1. **Trace** — Reasoning steps for selected message
2. **Tools** — Available tools and status
3. **Context** — Room summary, Thread focus, active Pins, attached files

**States:**
- **Idle:** Calm, ready
- **Thinking:** Working on request
- **Explaining:** Pointing at trace card

### 3.5 Tasks

**Features:**
- Checkbox
- Title
- Description
- Due date (optional)
- Status: Todo / In Progress / Done
- Link to source message

**Creation:**
- Click "Make a task" under message
- Pre-filled dialog with message content
- Edit title, description, due date, priority

### 3.6 Pins

**Purpose:** Key decisions, insights, specs, links

**Features:**
- Title
- Tag: Decision / Insight / Spec / Link
- Link to source message
- Click jumps to message in context

### 3.7 Bridge Mode (Translation)

**Purpose:** Bilingual coordination within a Room

**Activation:**
- Toggle in Room header: "Open Bridge"
- Replaces normal view until toggled off

**Layout:**
- Left column: Primary language view
- Right column: Partner language view

**Message Display:**
- Top: Original text
- Below left: Translation
- Below right: Intent summary

**Tone Selector:**
- Neutral / Warm / Formal

**Mazlo Role:**
- Maintains conversation rhythm
- Preserves tone and relationship
- Records key cross-language decisions as Pins

### 3.8 Health & Usage Guardrails

**Time Tracking:**
- Start session when Home or Room opens
- End after 10 minutes inactivity
- End on tab close/logout
- Aggregate per day/week

**Caps & Reminders:**
- Daily limit (minutes)
- Weekly limit (minutes)
- Reminder interval (e.g., every 45 minutes)

**Behavior:**
- Reminder interval: Small overlay "Session has lasted 45 minutes, want a break?"
- Approaching daily/weekly limit: Modal with options:
  1. Continue X minutes
  2. Summarize and wrap up
  3. Park some Rooms

**Park Room:**
- Generates current Room summary
- Sets status to `paused`
- Shows as "frozen card" on Home
- Optional "thaw date" reminder

## 4. Success Criteria

**User Experience:**
- Opening Chat Ultra feels like "I left off here yesterday, let's continue"
- Not an infinite void, but "a bounded workspace with clear exits"
- Default view is minimal and clean
- Powerful features hide until summoned

**Visual Feel:**
- Minimal, clean, negative space
- "Big-AI chic" aesthetic
- Mazlo presence is calming, not stimulating
- No dashboard clutter on day one

**Functional:**
- Rooms persist and maintain context
- Mazlo shows transparency when asked
- Bridge mode feels native, not bolted on
- Health features help users maintain boundaries

---

*This document defines what Chat Ultra should do. See 02_DATA_ARCHITECTURE.md for how data is structured, and 06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md for how to build it.*

