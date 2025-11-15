# Chat Ultra — Data Architecture

## Database Schema

### Technology Stack
- **Database:** PostgreSQL (Neon or Supabase recommended)
- **ORM:** Drizzle ORM
- **Migrations:** Drizzle migrations

## Core Tables

### users

Stores user account information and preferences.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  settings_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `email`: User email (unique, for auth)
- `display_name`: User's display name
- `settings_json`: User preferences (health limits, theme, shortcuts, etc.)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

**settings_json structure:**
```json
{
  "daily_limit_minutes": 120,
  "weekly_limit_minutes": 840,
  "reminder_interval_minutes": 45,
  "hard_stop_after_limit": false,
  "theme": "glyphd-dark",
  "keyboard_shortcuts": {...}
}
```

### rooms

Stores project containers (Rooms).

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  world_theme VARCHAR(50) DEFAULT 'glyphd-dark',
  summary TEXT,
  primary_language VARCHAR(10) DEFAULT 'en-US',
  secondary_languages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `user_id`: Owner (foreign key to users)
- `name`: Room name (editable)
- `status`: active / paused / archived
- `world_theme`: Visual preset (e.g., "glyphd-dark", "earthcloud-light")
- `summary`: Auto-generated or manual summary
- `primary_language`: UI and default output language (e.g., "en-US", "zh-CN")
- `secondary_languages`: Array of secondary languages (e.g., `["zh-CN", "en-US"]`)
- `created_at`: Creation timestamp
- `updated_at`: Last activity timestamp

**Indexes:**
- `idx_rooms_user_id` on `user_id`
- `idx_rooms_status` on `status`
- `idx_rooms_updated_at` on `updated_at DESC`

### threads

Stores sub-topics within Rooms.

```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `room_id`: Parent Room (foreign key)
- `title`: Thread title
- `created_at`: Creation timestamp
- `updated_at`: Last message timestamp (updated when new message added)

**Indexes:**
- `idx_threads_room_id` on `room_id`
- `idx_threads_updated_at` on `updated_at DESC`

### messages

Stores all chat messages (user, Mazlo, system).

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'mazlo', 'system')),
  content TEXT NOT NULL,
  provider VARCHAR(100),
  trace_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `room_id`: Parent Room
- `thread_id`: Parent Thread
- `role`: user / mazlo / system
- `content`: Message text (markdown supported)
- `provider`: Provider and model used (e.g., "openai:gpt-4", "zai:glm-4")
- `trace_id`: Link to trace record (nullable, only for Mazlo messages)
- `created_at`: Message timestamp

**Indexes:**
- `idx_messages_room_id` on `room_id`
- `idx_messages_thread_id` on `thread_id`
- `idx_messages_created_at` on `created_at DESC`
- `idx_messages_trace_id` on `trace_id` (for trace lookups)

### traces

Stores reasoning traces for Mazlo messages.

```sql
CREATE TABLE traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  steps_json JSONB NOT NULL,
  token_usage_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `message_id`: Associated Mazlo message
- `provider`: Provider used
- `steps_json`: Array of reasoning steps
- `token_usage_json`: Token usage statistics
- `created_at`: Trace creation timestamp

**steps_json structure:**
```json
[
  {
    "step_number": 1,
    "action_type": "Plan",
    "description": "Analyze user request and determine approach"
  },
  {
    "step_number": 2,
    "action_type": "Search",
    "description": "Query web search for relevant information"
  },
  {
    "step_number": 3,
    "action_type": "Code",
    "description": "Generate code solution"
  }
]
```

**token_usage_json structure:**
```json
{
  "prompt_tokens": 1250,
  "completion_tokens": 850,
  "total_tokens": 2100
}
```

### tasks

Stores actionable tasks extracted from messages.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  due_date TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `room_id`: Parent Room
- `message_id`: Source message (nullable, tasks can be created independently)
- `title`: Task title
- `description`: Task description
- `status`: todo / doing / done
- `due_date`: Optional due date
- `priority`: Priority level (0 = normal, higher = more important)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Indexes:**
- `idx_tasks_room_id` on `room_id`
- `idx_tasks_status` on `status`
- `idx_tasks_due_date` on `due_date` (for sorting)

### pins

Stores pinned key messages/summaries.

```sql
CREATE TABLE pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  tag VARCHAR(20) NOT NULL CHECK (tag IN ('decision', 'insight', 'spec', 'link')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `room_id`: Parent Room
- `message_id`: Pinned message
- `title`: Pin title
- `tag`: decision / insight / spec / link
- `created_at`: Pin creation timestamp

**Indexes:**
- `idx_pins_room_id` on `room_id`
- `idx_pins_message_id` on `message_id`

### usage_sessions

Stores usage time tracking for health statistics.

```sql
CREATE TABLE usage_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  total_seconds INTEGER,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Unique identifier
- `user_id`: User who had the session
- `started_at`: Session start timestamp
- `ended_at`: Session end timestamp (nullable if still active)
- `total_seconds`: Calculated duration (nullable if still active)
- `room_id`: Room where session occurred (nullable for Home sessions)

**Indexes:**
- `idx_usage_sessions_user_id` on `user_id`
- `idx_usage_sessions_started_at` on `started_at DESC`
- `idx_usage_sessions_room_id` on `room_id`

## Relationships

```
users
  └── rooms (1:N)
      ├── threads (1:N)
      │   └── messages (1:N)
      │       └── traces (1:1, for Mazlo messages)
      ├── tasks (1:N)
      ├── pins (1:N)
      └── usage_sessions (1:N)
```

## Data Access Patterns

### Common Queries

**Get user's active Rooms:**
```sql
SELECT * FROM rooms 
WHERE user_id = $1 AND status = 'active' 
ORDER BY updated_at DESC;
```

**Get Room with latest Thread:**
```sql
SELECT r.*, t.id as thread_id, t.title as thread_title
FROM rooms r
LEFT JOIN threads t ON t.room_id = r.id
WHERE r.id = $1
ORDER BY t.updated_at DESC
LIMIT 1;
```

**Get Thread messages:**
```sql
SELECT * FROM messages 
WHERE thread_id = $1 
ORDER BY created_at ASC;
```

**Get Room tasks:**
```sql
SELECT * FROM tasks 
WHERE room_id = $1 
ORDER BY 
  CASE status WHEN 'done' THEN 3 WHEN 'doing' THEN 2 ELSE 1 END,
  due_date ASC NULLS LAST,
  priority DESC;
```

**Get daily usage time:**
```sql
SELECT SUM(total_seconds) / 60 as minutes
FROM usage_sessions
WHERE user_id = $1 
  AND started_at >= CURRENT_DATE
  AND ended_at IS NOT NULL;
```

## Migration Strategy

1. Create initial schema with all tables
2. Add indexes after table creation
3. Seed with demo data:
   - One demo user
   - Two demo Rooms
   - Sample Threads, Messages, Pins, Tasks
   - Sample Usage Sessions

## Future Considerations

- **Multi-workspace support:** Add `workspace_id` to rooms, tasks, etc.
- **Sharing:** Add `shared_with` JSONB array to rooms
- **File attachments:** Add `attachments` table with file metadata
- **Provider credentials:** Add `provider_credentials` table for per-user API keys (encrypted)

---

*This schema supports all features described in 01_PRODUCT_REQUIREMENTS.md. See 03_TECHNICAL_STACK.md for implementation details.*

