# Chat Ultra — Component Specifications

## Component Library Structure

All components located in `components/ui/` and `components/room/`, `components/layout/`, `components/mazlo/`.

## Base UI Components

### Button

#### Primary Button

**Usage:** Submit messages, key actions (create Room, save settings)

**Specifications:**
- **Height:** 40px
- **Horizontal padding:** 16px left/right
- **Border radius:** `radius-pill` (999px)
- **Font:** 16px, weight 500

**States:**
- **Default:**
  - Background: `accent-primary` (#4FD1FF)
  - Text: `text-invert` (#050712)
  - Shadow: `shadow-1` (reduced: `0 10px 30px rgba(0,0,0,0.45)`)
- **Hover:**
  - Background: `#68D9FF` (slightly brighter)
  - Outer glow: `0 0 12px rgba(79,209,255,0.35)`
- **Active (pressed):**
  - Background: `#38BDF2` (slightly darker)
  - Inner shadow, Y offset reduced 2px
- **Disabled:**
  - Background: `gray-700`
  - Text: `gray-500`
  - No shadow, no glow
  - `pointer-events: none`

#### Secondary Button

**Usage:** Secondary actions (cancel, set later)

**Specifications:**
- Background: transparent
- Border: `rgba(255,255,255,0.12)`
- Text: `text-secondary`
- **Hover:** Background `rgba(255,255,255,0.04)`, border opacity increases

#### Text Button

**Usage:** Lightweight actions (show more, collapse)

**Specifications:**
- Text color: `accent-primary`
- **Hover:** Underline or slight color increase

### Input

#### Generic Input

**Specifications:**
- **Height:** 40px
- **Padding:** 12-16px left/right
- **Border:** `rgba(255,255,255,0.10)`
- **Background:** `bg-surface-soft`
- **Border radius:** `radius-sm` (8px)

**States:**
- **Focus:**
  - Border color: `accent-primary`
  - Shadow: `0 0 0 1px rgba(79,209,255,0.60)` (outer outline)
- **Error:**
  - Border: `accent-danger`
  - Error text below: 12px, `accent-danger`

#### Chat Input (Composer)

**Specifications:**
- **Min height:** 56px, grows to 120px max
- **Background:** `bg-surface-soft`
- **Internal layout:**
  - Left: Mode icons (40px)
  - Right: Send button + Mazlo status
- **Multi-line behavior:**
  - `Shift + Enter`: New line
  - `Enter`: Send

### Badge/Tag

#### Status Badge

**Specifications:**
- **Height:** 22px
- **Padding:** 8px left/right
- **Border radius:** `radius-pill`
- **Font:** 12px

**Variants:**
- **Active:**
  - Border: `accent-primary`
  - Text: `accent-primary`
  - Background: transparent
- **Paused:**
  - Border: `gray-500`
  - Text: `gray-300`
  - Background: transparent

#### Language Tag

**Format:** `ZH` / `EN` / `ES` (2-letter codes)
- Background: `rgba(255,255,255,0.08)`
- Text: `text-secondary`
- Border radius: 8px

### Card

#### Room Card (Home Page)

**Specifications:**
- **Width:** Fill column (320-360px)
- **Height:** Auto, typically 120-160px
- **Background:** `bg-surface`
- **Shadow:** `shadow-1`
- **Border radius:** `radius-lg` (16px)

**Content Hierarchy:**
- Top: Room name + status badge
- Middle: Latest Pin title
- Bottom: "Last activity" time + icon row (languages, providers)

**Hover State:**
- Slight upward shift: 2px
- Shadow opacity +10%
- Edge outline: `rgba(255,255,255,0.06)`

### Chat Bubbles

#### User Bubble

**Specifications:**
- **Alignment:** Left
- **Background:** `#151A2E`
- **Border radius:**
  - Top-left: 4px
  - Top-right: 12px
  - Bottom-left: 12px
  - Bottom-right: 12px
- **Padding:** 10px top/bottom, 12-16px left/right
- **Font:** 16px, `text-primary`

#### Mazlo Bubble

**Specifications:**
- **Alignment:** Right
- **Background:** `#101426`
- **Left border:** 2px `accent-primary` vertical bar
- **Border radius:**
  - Top-left: 12px
  - Top-right: 4px
  - Bottom-left: 12px
  - Bottom-right: 12px

**Top Row:**
- Mazlo avatar (32px)
- Name: "Mazlo"
- Provider tag (small rectangular badge)

**Bottom Row (Action Buttons):**
- "Why" (opens trace)
- "Try another path"
- "Pin"
- "Make a task"

### Navigation

#### Left Sidebar

**Specifications:**
- **Width:**
  - Expanded: 240px
  - Collapsed: 64px
- **Item height:** 40px
- **Icon size:** 20px
- **Hover:** Background `rgba(255,255,255,0.06)`
- **Active:**
  - Left 3px `accent-primary` bar
  - Text: `text-primary`
  - Icon brightness slightly increased

#### Top Bar

**Specifications:**
- **Height:** 56px
- **Background:** `bg-surface`
- **Bottom border:** 1px divider
- **User avatar:** 28px circle

**Content:**
- Left: Glyphd logo + "Chat Ultra"
- Center: Current view name
- Right: Provider icons, Mazlo status dot, user avatar

## Room-Specific Components

### RoomHeader

**Location:** Top of Room view (left column)

**Content:**
- Room name (editable inline)
- World theme badge
- Provider stack icons
- Status chip (Active/Paused/Archived)
- Buttons: "Park Room", "Export Room"

### ThreadList

**Location:** Left column, below RoomHeader

**Item Structure:**
- Title
- Last message snippet
- Unread badge (if new AI replies)
- Click switches center chat to that Thread

**Actions:**
- "New thread" button (creates fresh context, same Room memory)

### PinList

**Location:** Left column, below ThreadList

**Item Structure:**
- Title
- Tag icon (Decision/Insight/Spec/Link)
- Click jumps to referenced message in context

### ChatTimeline

**Location:** Center column

**Features:**
- Scrollable message list
- User messages (left-aligned bubbles)
- Mazlo messages (right-aligned bubbles with actions)
- Auto-scroll to bottom on new messages
- Virtual scrolling for long histories

### Composer

**Location:** Bottom center

**Structure:**
- Multi-line textarea (min 56px)
- Left: Mode selector (Chat/Translate/Code/Critique), file upload
- Right: Mazlo status ring, send button
- Below: Provider selector pill, system prompt preview link

### MazloPanel

**Location:** Right column

**Tabs:**
1. **Trace** — Reasoning steps for selected message
2. **Tools** — Available tools and status
3. **Context** — Room summary, Thread focus, active Pins, attached files

**States:**
- **Idle:** Calm, ready
- **Thinking:** Working on request
- **Explaining:** Pointing at trace card

### TasksPanel

**Location:** Right column, below MazloPanel or separate tab

**Item Structure:**
- Checkbox
- Title
- Optional due date
- Link icon to source message
- Status badge: Todo/In Progress/Done

**Actions:**
- Check to complete (fades but doesn't disappear)
- Click to edit
- Filter by status

## Bridge Mode Components

### BridgeView

**Layout:** Split main column (left = primary language, right = partner language)

**Message Display:**
- Top: Original text
- Below left: Translation
- Below right: Intent summary

**Controls:**
- Tone selector above composer: Neutral/Warm/Formal
- Mazlo hints above messages when meaning/tone ambiguous

## Layout Components

### AppShell

**Structure:**
- Top bar (fixed)
- Left sidebar (collapsible)
- Main content area (scrollable)
- Max width: 1440px, centered with 24px padding

### HomeLayout

**Structure:**
- Two columns:
  - Left (60%): Continue section, New Room button
  - Right (40%): Health panel, Health controls, Mazlo insight

### RoomLayout

**Structure:**
- Three columns (desktop):
  - Left (260px): Room meta (Threads, Pins)
  - Center (640-720px): Chat timeline + composer
  - Right (260-320px): Mazlo Panel + Tasks

**Responsive:**
- Tablet: Right panel becomes drawer
- Mobile: Panels become tabs above chat

## Mazlo-Specific Components

### MazloAvatar

**Specifications:**
- **Sizes:** 24px (lists), 32px (chat), 40px (panels), 128-256px (hero)
- **Shape:** Circular or slightly oval
- **Content:** Abstract "hierarchical steps" symbol inside
- **Colors:** `accent-primary` and `accent-secondary` gradient ring
- **States:** Subtle variations (ring color, small overlays), not facial expressions

### MazloStatusRing

**Specifications:**
- **Idle:** Soft blue ring
- **Thinking:** Animated pulsing ring (4 seconds per rotation)
- **Waiting for tools:** Dotted ring

## Modal and Overlay Components

### Modal

**Specifications:**
- Background overlay: `rgba(0,0,0,0.6)`
- Content: `bg-elevated`
- Border radius: `radius-lg`
- Shadow: `shadow-2`
- Animation: Scale 0.96 → 1.0 with fade (120ms)

### Drawer

**Usage:** Right panel on tablet/mobile

**Specifications:**
- Slides in from right
- Width: 320px (tablet), full width (mobile)
- Backdrop: `rgba(0,0,0,0.4)`

### Toast

**Usage:** Success/error notifications

**Specifications:**
- Position: Top-right
- Background: `bg-elevated`
- Border: 1px `accent-primary` (success) or `accent-danger` (error)
- Auto-dismiss: 3-5 seconds

## Skeleton/Loading Components

### RoomListSkeleton

**Specifications:**
- 3-4 gray placeholder cards
- Background: `#141827`
- Border radius: 12px
- Shimmer animation: 1.2s loop

### ChatBubbleSkeleton

**Specifications:**
- Light gray rounded bar
- Replaced by real bubble when first token arrives

## Interaction States

### Hover
- Background brightness +15% max
- Border opacity increase
- Shadow enhancement
- Cursor: pointer

### Focus
- Outer outline: `accent-primary` 1-2px
- No default browser blue outline

### Active/Pressed
- Scale: 97-98% (2-3% shrink)
- Duration: 120-160ms bounce back

### Disabled
- Opacity: 60%
- No pointer events
- Gray color scheme

---

*All components must use design tokens from 04_VISUAL_DESIGN_SYSTEM.md. See 06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md for implementation details.*

