# Chat Ultra — Visual Design System

## Design Philosophy

### Overall Aesthetic

**Target Audience:**
- 20-35 years old, global tier-1/2 cities
- Mid-to-high income knowledge workers and creators
- Familiar with Apple / Tesla / Notion / Linear / "big AI" product aesthetics

**Style Keywords:**
- **Calm Tech** — Peaceful technology
- **Quiet Luxury** — Understated elegance
- **Futuristic Minimalism** — Clean, forward-looking
- **Liquid Glass** — Smooth, luminous surfaces

### Emotional Goals

When users open Chat Ultra, they should feel:

1. **Security/Calm:** Dark background, soft contrast, stable layout
2. **Control:** Clear information hierarchy, predictable feedback
3. **Premium:** Precise whitespace, high-resolution details, calculated contrast
4. **Undisturbed Focus:** Controlled animations, minimal distractions

## Color System

### Base Palette

#### Background Colors

- `bg-root`: `#050712` — Deep ink-blue-black (app background)
- `bg-surface`: `#0B0E1C` — Main card/panel background
- `bg-surface-soft`: `#101426` — Secondary areas, collapsed panels
- `bg-elevated`: `#151A2E` — Overlays, modals, dropdowns

#### Text Colors

- `text-primary`: `#F7FAFC` — Main content text
- `text-secondary`: `#A0AEC0` — Secondary text
- `text-muted`: `#718096` — Auxiliary text (single-line only)
- `text-invert`: `#050712` — Text on light buttons/labels

#### Accent Colors

- `accent-primary`: `#4FD1FF` — Primary buttons, selected states, Mazlo status ring
- `accent-secondary`: `#FFB347` — Status hints, accent highlights
- `accent-info`: `#63B3ED`
- `accent-success`: `#48BB78`
- `accent-warning`: `#ECC94B`
- `accent-danger`: `#F56565`

#### Neutral Grayscale (9 levels)

- `gray-50`: `#F7FAFC`
- `gray-100`: `#EDF2F7`
- `gray-200`: `#E2E8F0`
- `gray-300`: `#CBD5E0`
- `gray-400`: `#A0AEC0`
- `gray-500`: `#718096`
- `gray-600`: `#4A5568`
- `gray-700`: `#2D3748`
- `gray-800`: `#1A202C`

**Usage:** In dark backgrounds, use 300-500 for borders and secondary text; 50-100 only for small high-contrast text or highlights.

### Borders and Dividers

- **Default border:** `rgba(255,255,255,0.06)`, 1px width
- **Strong border:** `rgba(255,255,255,0.14)`, 1px width
- **Divider:** `gray-700` at ~40% opacity, 1px width

### Shadows and Glow

#### Card Shadows

- `shadow-1`: `0 14px 45px rgba(0, 0, 0, 0.45)` — Main cards, modals
- `shadow-2`: `0 22px 65px rgba(0, 0, 0, 0.65)` — Top-level overlays

#### Subtle Glow

- **Primary button hover:** `0 0 12px rgba(79,209,255,0.35)`
- **Status ring/Mazlo:** `0 0 6px rgba(79,209,255,0.45)`

**Weak Glow Principle:**
- Outer glow radius ≤ 12px
- Opacity ≤ 30%
- Only on key CTAs or hover states

### Color Usage Proportions

- Background areas: ~70-75%
- Neutral gray cards/lines: ~20-25%
- Accent colors combined: ≤5-8%
- Single high-saturation color per screen: ≤3%

## Typography

### Font Stacks

#### English/Latin Fonts

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
```

#### Chinese Fonts

```css
/* macOS/iOS */
font-family: "SF Pro Text", "PingFang SC", system-ui, -apple-system, sans-serif;

/* Windows */
font-family: "Segoe UI", "Microsoft YaHei UI", "Microsoft YaHei", system-ui, sans-serif;
```

**CSS Variables:**
```css
:root {
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  --font-cjk: "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", system-ui, sans-serif;
}
```

### Font Size Scale

- **H0 (Display/Hero):** 40px — Landing page H1
- **H1 (Page Title):** 32px
- **H2 (Section Title):** 24px
- **H3 (Subsection):** 20px
- **H4 (Label/Form Title):** 16px (weight 600)
- **Body:** 16px (line-height 1.5-1.6)
- **Body Small:** 14px — Secondary text, meta info
- **Label:** 12px — Tags, badges

### Font Weight Rules

- H0-H2: `font-weight: 600` (semi-bold)
- H3-H4: `font-weight: 500-600`
- Body: `font-weight: 400`
- Emphasis: `font-weight: 500` or color/size change (avoid 700+ for visual fatigue)

### Text Color and Contrast

- **Primary text:** `text-primary` (#F7FAFC) — WCAG compliant on dark background
- **Secondary text:** `text-secondary` (#A0AEC0)
- **Auxiliary text:** `text-muted` (#718096) — Not for long text, single-line only

## Spacing System

### Spacing Scale (4px base)

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px

### Layout Rules

- **Content max width:** 1440px (desktop)
- **Main content area:** 1120-1200px
- **Side margins:** 24px (small screens), 40px (large screens)
- **Line height:** 1.5-1.6 for body text
- **Title spacing below:**
  - H1: 24px
  - H2: 20px
  - H3: 16px

**Principle:** "Breathing space between blocks > padding inside blocks"

## Border Radius

- `radius-xs`: 4px
- `radius-sm`: 8px
- `radius-md`: 12px
- `radius-lg`: 16px
- `radius-pill`: 999px (fully rounded)

## Grid System

### Desktop Grid

- **Container max width:** 1200px (content area, excluding side margins)
- **12-column grid** with 24px gutters
- **Column combinations:**
  - Left 3 cols (sidebar) + Center 6 cols (content) + Right 3 cols (panel)

### Breakpoints

- `sm`: ≤640px — Mobile
- `md`: 641-960px — Small tablet/small desktop
- `lg`: 961-1280px — Main desktop
- `xl`: 1281-1600px — Wide screen

**Responsive Behavior:**
- `sm`: Sidebar collapses to top menu, right panel becomes tabs
- `md`: Left sidebar becomes icon-only (64px), right panel collapsible
- `lg`/`xl`: Full three-column layout

## Elevation System

- `elevation-0`: No shadow
- `elevation-1`: `0 14px 45px rgba(0,0,0,0.45)`
- `elevation-2`: `0 22px 65px rgba(0,0,0,0.65)`

## Visual Hierarchy

From strongest to weakest:

1. Page main title / Primary CTA / Critical status (error alerts)
2. Section titles (e.g., "Continue Work", "Health Overview")
3. Main content text (conversations, summaries, task text)
4. Secondary info (timestamps, tags, auxiliary notes)
5. Decorative graphics and backgrounds

**Differentiation methods:**
- Font size
- Font weight
- Color (brightness and saturation)
- Opacity
- Shadow/glow level

## Consistency Rules

- All buttons follow unified size, radius, shadow rules
- All input fields have unified border and focus states
- All icons have consistent stroke width (1.5px or 2px recommended)
- All animations use unified easing functions and duration ranges

## "AI Feel" Expression

- Use "structured data + lines + grids + particle dots" rather than sci-fi HUD
- Mazlo trace panel: Clean step list + small color blocks, avoid mysterious glow animations
- Use minimal geometric lines connecting key info points, suggesting underlying logic

## Dark Mode Principles

- Background is "deep night studio," not "game nightclub"
- Use near-ink-blue/charcoal-black, not pure black
- Highlights come from **soft light**, not **fluorescent**
- High-saturation colors only as small accents (buttons, light points, focus edges)

---

*This design system is implemented via design tokens. See 05_COMPONENT_SPECIFICATIONS.md for component-level application of these tokens.*

