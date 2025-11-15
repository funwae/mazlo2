# Chat Ultra — Implementation Phases

## Development Roadmap

This document outlines a phased approach to building Chat Ultra with Mazlo. Each phase builds on the previous, delivering working functionality incrementally.

## Phase 1: Core Shell (Weeks 1-2)

### Goal
Establish basic app structure, authentication, and Room creation.

### Deliverables

1. **Landing Page**
   - Hero section with Mazlo introduction
   - Feature cards (3 main features)
   - Health banner
   - Footer

2. **Authentication**
   - Supabase Auth integration
   - Email magic link authentication (via Resend/SendGrid/Postmark)
   - User account creation
   - Session management
   - Email templates (HTML + plain text)

3. **App Shell**
   - Top bar with logo, navigation, user avatar
   - Left sidebar (Home, Rooms, Settings)
   - Main content area
   - Responsive layout (mobile sidebar collapse)

4. **Home View**
   - "Continue" section (placeholder, no data yet)
   - "New Room" button
   - Health panel (placeholder)
   - Mazlo insight card (placeholder)

5. **Rooms List**
   - Empty state
   - Create Room button
   - Room creation modal/form

6. **Room Detail (Basic)**
   - Room header with name (editable)
   - Empty chat area
   - Simple composer (no AI yet)
   - Left panel: Thread list (empty)
   - Right panel: Mazlo Panel (placeholder)

7. **Database Setup**
   - Supabase project created
   - All tables created (users, rooms, threads, messages, etc.)
   - Basic CRUD operations
   - Demo data seeding
   - Storage bucket created (`chat-ultra-files`)

8. **User Onboarding**
   - Welcome tour (first-time user)
   - Interactive tutorial (key features)
   - Empty state guidance (helpful copy)
   - Tooltips for feature discovery

### Acceptance Criteria
- User can sign up and log in
- User can create a Room
- User can navigate between Home and Room views
- All UI follows design system (colors, typography, spacing)
- Database stores all data correctly

### Technical Notes
- Use Next.js App Router for routing
- Implement Supabase Auth for authentication
- Set up Resend/SendGrid/Postmark for email
- Set up Drizzle ORM with Supabase PostgreSQL
- Create design token system (colors, spacing, typography)
- Build base UI components (Button, Input, Card, etc.)
- Set up React Error Boundaries

---

## Phase 2: Chat and Mazlo Integration (Weeks 3-4)

### Goal
Enable actual AI chat with Mazlo, basic message display, and Room persistence.

### Deliverables

1. **Message System**
   - Save user messages to database
   - Display messages in chat timeline
   - User and Mazlo message bubbles (styled correctly)
   - Timestamps and metadata

2. **Mazlo Orchestrator**
   - Basic orchestrator function (`handleUserMessage`)
   - OpenAI integration (GPT-4 or GPT-3.5)
   - System prompt construction
   - Context building (Room summary, recent messages)
   - Streaming responses (SSE)

3. **Composer**
   - Multi-line text input
   - Send button
   - Mazlo status ring (idle/thinking states)
   - Provider selector (OpenAI only for now)
   - Mode selector (Chat mode only for now)

4. **Mazlo Panel (Basic)**
   - Trace tab (placeholder structure)
   - Tools tab (list OpenAI as available)
   - Context tab (Room summary, active Pins placeholder)

5. **Thread System**
   - Create new Thread in Room
   - Switch between Threads
   - Messages belong to Threads
   - Thread list in left panel

### Acceptance Criteria
- User can send message and receive Mazlo response
- Messages stream in real-time
- Messages persist in database
- User can create and switch Threads
- Mazlo responses show provider tag
- Basic Mazlo Panel displays (even if placeholder data)

### Technical Notes
- Implement SSE streaming for responses
- Set up OpenAI SDK
- Create context builder that uses Room summaries
- Implement basic trace structure (can be simplified initially)
- Add loading states and error handling
- Implement retry logic for failed API calls
- Add React Error Boundaries for UI resilience

---

## Phase 3: Pins, Tasks, Trace, and File Uploads (Weeks 5-6)

### Goal
Add key features: pinning messages, creating tasks, and viewing reasoning traces.

### Deliverables

1. **Pins System**
   - Pin a message (button under Mazlo messages)
   - Pin creation dialog (title, tag selection)
   - Pin list in left panel
   - Click Pin to jump to message
   - Pin tags: Decision, Insight, Spec, Link

2. **Tasks System**
   - "Make a task" button under messages
   - Task creation dialog (pre-filled from message)
   - Task list in right panel (below Mazlo Panel)
   - Task status: Todo, In Progress, Done
   - Checkbox to complete tasks
   - Task filtering by status

3. **Trace System**
   - Capture trace data from Mazlo responses
   - Store trace steps in database
   - "Why" button opens trace panel
   - Trace view shows steps (Plan, Search, Code, etc.)
   - Token usage display
   - "Open full trace" modal (detailed view)

4. **Room Summary**
   - Auto-generate Room summary (simplified initially)
   - Display in Context tab
   - Update summary periodically

5. **File Uploads**
   - File upload component in composer
   - Supabase Storage integration
   - File type validation (images, PDFs, etc.)
   - File size limits (10MB default)
   - Image optimization (resize, compress)
   - File preview in messages
   - Signed URLs for file access

### Acceptance Criteria
- User can pin any Mazlo message
- User can create tasks from messages
- Tasks appear in Tasks panel
- "Why" button shows trace (even if simplified)
- Trace displays steps and token usage
- Pins appear in left panel and are clickable

### Technical Notes
- Implement trace capture in orchestrator
- Create Pin/Task CRUD APIs
- Add trace viewer component
- Implement Room summary generation (can use simple LLM call initially)
- Set up Supabase Storage client
- Implement file upload with progress indicator
- Add file validation and error handling

---

## Phase 4: Bridge Mode and Multi-Language (Weeks 7-8)

### Goal
Enable bilingual collaboration with Bridge mode and language profiles.

### Deliverables

1. **Language Profiles**
   - Room-level language settings
   - Primary language selection
   - Secondary languages array
   - UI language switching (future)

2. **Bridge Mode**
   - "Open Bridge" toggle in Room header
   - Split view layout (left = primary, right = partner language)
   - Message display with translations
   - Intent summary below translations
   - Tone selector (Neutral/Warm/Formal)
   - Mazlo hints for ambiguous meaning/tone

3. **Translation Integration**
   - Translation mode in composer
   - Bridge mode uses translation provider
   - Maintain conversation context across languages
   - Auto-detect language in messages

4. **Enhanced Composer Modes**
   - Translate mode (translate input)
   - Code mode (code-focused system prompt)
   - Critique mode (critical analysis prompt)

### Acceptance Criteria
- User can set Room language profile
- Bridge mode toggles split view
- Messages translate correctly
- Tone selector affects translation style
- Intent summaries appear below translations
- All composer modes work

### Technical Notes
- Integrate translation API (OpenAI or dedicated service)
- Implement Bridge view component
- Add language detection
- Create tone-aware translation prompts

---

## Phase 5: Health, Usage Tracking, and Notifications (Weeks 9-10)

### Goal
Implement health guardrails: time tracking, caps, reminders, and Room parking.

### Deliverables

1. **Usage Session Tracking**
   - Start session when Home/Room opens
   - End session after 10 minutes inactivity
   - End session on tab close/logout
   - Store sessions in database
   - Aggregate per day/week

2. **Health Dashboard**
   - Weekly time chart (bar chart)
   - Daily time display
   - Focus streak days
   - Completed tasks count
   - Health signal indicators (green/yellow/red)

3. **Caps and Reminders**
   - Daily limit setting
   - Weekly limit setting
   - Reminder interval setting
   - Reminder overlay (after X minutes)
   - Limit reached modal with options:
     - Continue X minutes
     - Summarize and wrap up
     - Park some Rooms

4. **Park Room Feature**
   - "Park Room" button in Room header
   - Generate Room summary
   - Set Room status to `paused`
   - Show as "frozen card" on Home
   - Optional "thaw date" reminder

5. **Health Settings**
   - Settings → Health tab
   - All health controls in one place
   - Export usage logs button

6. **Notifications System**
   - Real-time notifications (WebSocket/SSE)
   - Browser notifications (Push API, optional)
   - In-app notification center
   - Notification preferences in Settings
   - Email notifications (optional, user preference)

### Acceptance Criteria
- Sessions track correctly
- Health dashboard shows accurate stats
- Reminders appear at set intervals
- Limit modals appear when caps reached
- Park Room generates summary and pauses Room
- Health settings save and apply

### Technical Notes
- Implement session tracking with browser events
- Create health aggregation queries
- Build chart component (use library like recharts)
- Implement reminder system (setInterval or similar)
- Add Room summary generation for parking
- Set up notification system (Supabase Realtime or custom)
- Implement browser Push API (if enabled)
- Add notification preferences storage

---

## Phase 6: Polish, Export, Search, and PWA (Weeks 11-12)

### Goal
Add final features: Room export, provider management, themes, and polish.

### Deliverables

1. **Room Export**
   - Export Room as Markdown
   - Export Room as JSON
   - Include all messages, Pins, Tasks, Traces
   - Download button in Room header

2. **Provider Management**
   - Settings → Providers tab
   - Add OpenAI API key (per-user, encrypted)
   - Add z.ai API key (if available)
   - Model selection dropdowns
   - Test connection button
   - Provider status indicators

3. **Themes**
   - Settings → Themes tab
   - Theme selector (Glyphd Liquid Glass, EarthCloud Japandi Light)
   - Theme applies to entire app
   - Persist theme preference

4. **Keyboard Shortcuts**
   - Settings → Shortcuts tab
   - List all shortcuts
   - Implement shortcuts:
     - `Cmd+K`: Command palette
     - `Cmd+Shift+N`: New Room
     - `Cmd+Shift+T`: New Thread
     - `Cmd+Shift+P`: Pin message
     - `Cmd+Shift+O`: Toggle Mazlo panel
     - `Cmd+Shift+B`: Open Bridge

5. **Command Palette**
   - Global command palette (`Cmd+K`)
   - Search Rooms, Threads, Pins
   - Quick actions (create Room, etc.)

6. **Search Functionality**
   - Full-text search (PostgreSQL full-text or Algolia/Meilisearch)
   - Search across Rooms, messages, Pins, Tasks
   - Search UI (command palette integration)
   - Search indexing (background jobs)
   - Search results highlighting

7. **PWA Setup**
   - Service worker (offline support)
   - Manifest.json (installable)
   - Offline fallback (cached pages)
   - Push notifications (future)

8. **Help & Documentation**
   - Help center (FAQ, guides)
   - In-app help (contextual help)
   - Keyboard shortcuts help modal
   - Video tutorials (optional)

9. **Admin Panel** (Optional)
   - User management (view users, stats)
   - System health (database, API status)
   - Usage analytics (aggregate stats)
   - Error logs (recent errors)
   - Feature flags (gradual rollouts)

10. **Polish**
    - Loading states (skeletons)
    - Error handling (user-friendly messages)
    - Empty states (helpful copy)
    - Animations (smooth transitions)
    - Accessibility (keyboard navigation, focus states)
    - Responsive design (mobile/tablet polish)
    - SEO meta tags (landing page)
    - Sitemap.xml and robots.txt

### Acceptance Criteria
- Room export works (Markdown and JSON)
- Users can manage providers in Settings
- Themes apply correctly
- All keyboard shortcuts work
- Command palette is functional
- App feels polished and production-ready

### Technical Notes
- Implement export functions (markdown/json generation)
- Add encryption for API keys (Supabase Vault or environment variables)
- Create theme system (CSS variables)
- Implement command palette (use library like cmdk)
- Add comprehensive error boundaries
- Set up search indexing (PostgreSQL full-text or external service)
- Implement service worker for PWA
- Create help documentation structure
- Test on mobile/tablet devices
- Add SEO meta tags and structured data

---

## Post-Launch Considerations

### Future Phases (Not in Initial Build)

1. **Multi-Workspace Support**
   - Workspace switching
   - Team collaboration
   - Sharing Rooms

2. **Advanced Trace**
   - Full call tree visualization
   - Tool invocation details
   - Performance metrics

3. **File Attachments**
   - Upload files to Rooms
   - File browser tool
   - Image generation integration

4. **Activity Feed**
   - Activity view showing all updates
   - Notifications
   - Recent changes across Rooms

5. **Advanced Health**
   - Usage analytics
   - Productivity insights
   - Custom health goals

---

## Development Principles

### During All Phases

1. **Follow Design System**
   - Use design tokens (colors, spacing, typography)
   - Maintain consistency across components
   - No shortcuts on visual quality

2. **Type Safety**
   - Strong TypeScript types
   - Validate API inputs/outputs
   - Type-safe database queries

3. **Error Handling**
   - User-friendly error messages
   - Graceful degradation
   - Logging for debugging

4. **Performance**
   - Optimize database queries
   - Use virtual scrolling for long lists
   - Lazy load heavy components
   - Cache where appropriate

5. **Testing**
   - Unit tests for utilities
   - Integration tests for APIs
   - E2E tests for critical flows (when possible)

---

*This phased approach ensures working functionality at each stage. Adjust timelines based on team size and complexity. See other docs for detailed specifications.*

