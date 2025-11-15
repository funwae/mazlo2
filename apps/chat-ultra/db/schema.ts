import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, check } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  settingsJson: jsonb('settings_json').default({}).$type<{
    daily_limit_minutes?: number;
    weekly_limit_minutes?: number;
    reminder_interval_minutes?: number;
    hard_stop_after_limit?: boolean;
    theme?: string;
    keyboard_shortcuts?: Record<string, string>;
  }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 })
    .notNull()
    .default('active')
    .$type<'active' | 'paused' | 'archived'>(),
  worldTheme: varchar('world_theme', { length: 50 }).default('glyphd-dark'),
  summary: text('summary'),
  primaryLanguage: varchar('primary_language', { length: 10 }).default('en-US'),
  secondaryLanguages: jsonb('secondary_languages').default([]).$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: sql`idx_rooms_user_id`.on(table.userId),
  statusIdx: sql`idx_rooms_status`.on(table.status),
  updatedAtIdx: sql`idx_rooms_updated_at`.on(table.updatedAt),
  statusCheck: check('status_check', sql`${table.status} IN ('active', 'paused', 'archived')`),
}));

export const threads = pgTable('threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roomIdIdx: sql`idx_threads_room_id`.on(table.roomId),
  updatedAtIdx: sql`idx_threads_updated_at`.on(table.updatedAt),
}));

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  threadId: uuid('thread_id').notNull().references(() => threads.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 })
    .notNull()
    .$type<'user' | 'mazlo' | 'system'>(),
  content: text('content').notNull(),
  provider: varchar('provider', { length: 100 }),
  traceId: uuid('trace_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roomIdIdx: sql`idx_messages_room_id`.on(table.roomId),
  threadIdIdx: sql`idx_messages_thread_id`.on(table.threadId),
  createdAtIdx: sql`idx_messages_created_at`.on(table.createdAt),
  traceIdIdx: sql`idx_messages_trace_id`.on(table.traceId),
  roleCheck: check('role_check', sql`${table.role} IN ('user', 'mazlo', 'system')`),
}));

export const traces = pgTable('traces', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 100 }).notNull(),
  stepsJson: jsonb('steps_json').notNull().$type<Array<{
    step_number: number;
    action_type: string;
    description: string;
  }>>(),
  tokenUsageJson: jsonb('token_usage_json').$type<{
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  messageId: uuid('message_id').references(() => messages.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 })
    .notNull()
    .default('todo')
    .$type<'todo' | 'doing' | 'done'>(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  priority: integer('priority').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roomIdIdx: sql`idx_tasks_room_id`.on(table.roomId),
  statusIdx: sql`idx_tasks_status`.on(table.status),
  dueDateIdx: sql`idx_tasks_due_date`.on(table.dueDate),
  statusCheck: check('status_check', sql`${table.status} IN ('todo', 'doing', 'done')`),
}));

export const pins = pgTable('pins', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  messageId: uuid('message_id').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  tag: varchar('tag', { length: 20 })
    .notNull()
    .$type<'decision' | 'insight' | 'spec' | 'link'>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roomIdIdx: sql`idx_pins_room_id`.on(table.roomId),
  messageIdIdx: sql`idx_pins_message_id`.on(table.messageId),
  tagCheck: check('tag_check', sql`${table.tag} IN ('decision', 'insight', 'spec', 'link')`),
}));

export const usageSessions = pgTable('usage_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  totalSeconds: integer('total_seconds'),
  roomId: uuid('room_id').references(() => rooms.id, { onDelete: 'set null' }),
}, (table) => ({
  userIdIdx: sql`idx_usage_sessions_user_id`.on(table.userId),
  startedAtIdx: sql`idx_usage_sessions_started_at`.on(table.startedAt),
  roomIdIdx: sql`idx_usage_sessions_room_id`.on(table.roomId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
  usageSessions: many(usageSessions),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  user: one(users, {
    fields: [rooms.userId],
    references: [users.id],
  }),
  threads: many(threads),
  messages: many(messages),
  tasks: many(tasks),
  pins: many(pins),
  usageSessions: many(usageSessions),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  room: one(rooms, {
    fields: [threads.roomId],
    references: [rooms.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  room: one(rooms, {
    fields: [messages.roomId],
    references: [rooms.id],
  }),
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.id],
  }),
  trace: one(traces, {
    fields: [messages.traceId],
    references: [traces.id],
  }),
}));

export const tracesRelations = relations(traces, ({ one }) => ({
  message: one(messages, {
    fields: [traces.messageId],
    references: [messages.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  room: one(rooms, {
    fields: [tasks.roomId],
    references: [rooms.id],
  }),
  message: one(messages, {
    fields: [tasks.messageId],
    references: [messages.id],
  }),
}));

export const pinsRelations = relations(pins, ({ one }) => ({
  room: one(rooms, {
    fields: [pins.roomId],
    references: [rooms.id],
  }),
  message: one(messages, {
    fields: [pins.messageId],
    references: [messages.id],
  }),
}));

export const usageSessionsRelations = relations(usageSessions, ({ one }) => ({
  user: one(users, {
    fields: [usageSessions.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [usageSessions.roomId],
    references: [rooms.id],
  }),
}));

