# Chat Ultra — API and Integration Guide

## API Routes Structure

All API routes are under `/app/api/` in Next.js App Router.

## Authentication

All API routes require authentication (except public landing page).

**Auth Header:**
```
Authorization: Bearer <session_token>
```

**Session Management:**
- Sessions managed via NextAuth or custom auth
- Session stored in HTTP-only cookie
- Middleware validates session on each request

## Rooms API

### List User's Rooms

```
GET /api/rooms
```

**Query Parameters:**
- `status`: Filter by status (`active`, `paused`, `archived`)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "rooms": [
    {
      "id": "uuid",
      "name": "Room Name",
      "status": "active",
      "summary": "Room summary...",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

### Create Room

```
POST /api/rooms
```

**Body:**
```json
{
  "name": "New Room",
  "primary_language": "en-US",
  "secondary_languages": ["zh-CN"],
  "world_theme": "glyphd-dark"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "New Room",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Room Details

```
GET /api/rooms/[id]
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Room Name",
  "status": "active",
  "summary": "Summary...",
  "threads": [...],
  "pins": [...],
  "tasks": [...]
}
```

### Update Room

```
PATCH /api/rooms/[id]
```

**Body:**
```json
{
  "name": "Updated Name",
  "status": "paused"
}
```

### Park Room

```
POST /api/rooms/[id]/park
```

**Body:**
```json
{
  "thaw_date": "2024-02-01" // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "paused",
  "summary": "Generated summary..."
}
```

### Export Room

```
POST /api/rooms/[id]/export
```

**Query Parameters:**
- `format`: `markdown` or `json`

**Response:**
- Markdown: Returns `.md` file download
- JSON: Returns JSON object

## Messages API

### Get Messages

```
GET /api/rooms/[id]/threads/[threadId]/messages
```

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `before`: Message ID to fetch messages before (pagination)

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Message content",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "role": "mazlo",
      "content": "Mazlo response",
      "provider": "openai:gpt-4",
      "trace_id": "uuid",
      "created_at": "2024-01-01T00:00:01Z"
    }
  ]
}
```

### Send Message (Streaming)

```
POST /api/rooms/[id]/threads/[threadId]/messages
```

**Body:**
```json
{
  "content": "User message",
  "mode": "chat", // chat | translate | code | critique
  "provider": "openai:gpt-4" // optional, uses Room default if not specified
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"type": "token", "content": "Hello"}
data: {"type": "token", "content": " there"}
data: {"type": "done", "message_id": "uuid", "trace_id": "uuid"}
```

### Get Message Trace

```
GET /api/messages/[id]/trace
```

**Response:**
```json
{
  "id": "uuid",
  "steps": [
    {
      "step_number": 1,
      "action_type": "Plan",
      "description": "Analyze request"
    }
  ],
  "token_usage": {
    "prompt_tokens": 1250,
    "completion_tokens": 850,
    "total_tokens": 2100
  }
}
```

## Threads API

### Create Thread

```
POST /api/rooms/[id]/threads
```

**Body:**
```json
{
  "title": "Thread Title"
}
```

### Update Thread

```
PATCH /api/threads/[id]
```

**Body:**
```json
{
  "title": "Updated Title"
}
```

## Tasks API

### Get Room Tasks

```
GET /api/rooms/[id]/tasks
```

**Query Parameters:**
- `status`: Filter by status (`todo`, `doing`, `done`)

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Task title",
      "status": "todo",
      "due_date": "2024-01-15",
      "message_id": "uuid"
    }
  ]
}
```

### Create Task

```
POST /api/tasks
```

**Body:**
```json
{
  "room_id": "uuid",
  "message_id": "uuid", // optional
  "title": "Task title",
  "description": "Task description",
  "due_date": "2024-01-15", // optional
  "priority": 0
}
```

### Update Task

```
PATCH /api/tasks/[id]
```

**Body:**
```json
{
  "status": "done",
  "title": "Updated title"
}
```

## Pins API

### Get Room Pins

```
GET /api/rooms/[id]/pins
```

**Response:**
```json
{
  "pins": [
    {
      "id": "uuid",
      "title": "Pin title",
      "tag": "decision",
      "message_id": "uuid"
    }
  ]
}
```

### Create Pin

```
POST /api/pins
```

**Body:**
```json
{
  "room_id": "uuid",
  "message_id": "uuid",
  "title": "Pin title",
  "tag": "decision" // decision | insight | spec | link
}
```

## Health API

### Get Usage Sessions

```
GET /api/health/sessions
```

**Query Parameters:**
- `start_date`: Start date (ISO format)
- `end_date`: End date (ISO format)

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "started_at": "2024-01-01T00:00:00Z",
      "ended_at": "2024-01-01T01:00:00Z",
      "total_seconds": 3600,
      "room_id": "uuid"
    }
  ]
}
```

### Get Health Stats

```
GET /api/health/stats
```

**Query Parameters:**
- `period`: `day` | `week` | `month`

**Response:**
```json
{
  "total_minutes": 120,
  "daily_average": 17,
  "focus_streak_days": 5,
  "completed_tasks": 12,
  "chart_data": [
    {"date": "2024-01-01", "minutes": 30},
    {"date": "2024-01-02", "minutes": 45}
  ]
}
```

### Start Session

```
POST /api/health/sessions
```

**Body:**
```json
{
  "room_id": "uuid" // optional
}
```

### End Session

```
PATCH /api/health/sessions/[id]
```

## Files API

### Upload File

```
POST /api/files/upload
```

**Body:** `multipart/form-data`
- `file`: File to upload
- `roomId`: Room ID (optional)
- `messageId`: Message ID (optional)

**Response:**
```json
{
  "id": "uuid",
  "url": "https://...",
  "signedUrl": "https://...",
  "filename": "image.png",
  "size": 1024000,
  "mimeType": "image/png",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Get File

```
GET /api/files/[id]
```

**Response:** File metadata + signed URL

### Delete File

```
DELETE /api/files/[id]
```

## Search API

### Search

```
GET /api/search
```

**Query Parameters:**
- `q`: Search query
- `type`: Filter by type (`rooms`, `messages`, `pins`, `tasks`, `all`)
- `roomId`: Limit to specific Room (optional)
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset

**Response:**
```json
{
  "results": [
    {
      "type": "message",
      "id": "uuid",
      "roomId": "uuid",
      "roomName": "Room Name",
      "threadId": "uuid",
      "threadTitle": "Thread Title",
      "content": "Message content...",
      "highlight": "Message <mark>content</mark>...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 42,
  "query": "search term"
}
```

## Notifications API

### Get Notifications

```
GET /api/notifications
```

**Query Parameters:**
- `unreadOnly`: Filter unread only (default: false)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "message_reply",
      "title": "New reply in Room",
      "body": "Mazlo replied to your message",
      "read": false,
      "roomId": "uuid",
      "messageId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### Mark Notification as Read

```
PATCH /api/notifications/[id]/read
```

### Mark All as Read

```
POST /api/notifications/read-all
```

### Delete Notification

```
DELETE /api/notifications/[id]
```

## File Storage Integration

### Supabase Storage

**Setup:**
1. Create bucket: `chat-ultra-files`
2. Configure storage policies (see 10_DEPLOYMENT_AND_DEVOPS.md)
3. Use Supabase Storage client for uploads

**Upload Flow:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Upload file
const { data, error } = await supabase.storage
  .from('chat-ultra-files')
  .upload(`${userId}/${roomId}/${filename}`, file);

// Get signed URL (expires in 1 hour)
const { data: urlData } = await supabase.storage
  .from('chat-ultra-files')
  .createSignedUrl(`${userId}/${roomId}/${filename}`, 3600);
```

## Provider Integration

### Provider Interface

```typescript
interface Provider {
  name: string;
  streamChat(
    messages: Message[],
    config: ProviderConfig
  ): AsyncGenerator<string>;
  supportsMode(mode: string): boolean;
}
```

### OpenAI Integration

**Configuration:**
- API key from environment or user settings
- Model selection (gpt-4, gpt-3.5-turbo, etc.)
- Temperature, max tokens configurable

**Streaming:**
- Uses OpenAI streaming API
- Yields tokens as they arrive
- Captures token usage

### z.ai Integration (Future)

- Similar interface to OpenAI
- Model selection (GLM-4, etc.)
- Streaming support

### Local Model Integration (Future)

- Ollama or similar
- Local endpoint configuration
- Same streaming interface

## Mazlo Orchestrator

### Core Function

```typescript
async function handleUserMessage({
  roomId,
  threadId,
  userMessage,
  mode,
}: HandleUserMessageInput): Promise<StreamResponse>
```

### Context Building

1. Load Room and Thread
2. Get Room summary
3. Get recent Thread messages (last 10-20)
4. Get active Pins
5. Get relevant Tasks
6. Compress old context if needed

### System Prompt Construction

```
You are Mazlo, the AI operator of Chat Ultra.

Room Context: [Room summary]
Active Pins: [List of pins]
Mode: [chat | translate | code | critique]

[Mode-specific instructions]

[Provider-specific instructions]
```

### Provider Selection

- Based on Room preferences
- Based on mode (some modes prefer specific providers)
- Fallback to default provider

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // optional
  }
}
```

### Error Codes

- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Not authorized for resource
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `PROVIDER_ERROR`: LLM provider error
- `RATE_LIMIT`: Rate limit exceeded
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- Message endpoints: 60 requests/minute per user
- Other endpoints: 120 requests/minute per user
- Health endpoints: 30 requests/minute per user

## Webhooks (Future)

For external integrations:
- Room created/updated
- Message sent
- Task completed
- Health limit reached

---

*This API design supports all features in 01_PRODUCT_REQUIREMENTS.md. See 03_TECHNICAL_STACK.md for implementation details.*

