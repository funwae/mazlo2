import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByRoomAndThread = query({
  args: {
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    let query = ctx.db
      .query("messages")
      .withIndex("by_room_time", (q) => q.eq("roomId", args.roomId));

    if (args.threadId) {
      query = ctx.db
        .query("messages")
        .withIndex("by_thread_time", (q) => q.eq("threadId", args.threadId));
    }

    const messages = await query.order("desc").take(limit);
    return messages.reverse(); // Return in chronological order
  },
});

export const listRecentForRoom = query({
  args: {
    roomId: v.id("rooms"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room_time", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(limit);
    return messages.reverse();
  },
});

export const send = mutation({
  args: {
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    senderType: v.string(),
    senderUserId: v.optional(v.id("users")),
    role: v.string(),
    content: v.string(),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      roomId: args.roomId,
      threadId: args.threadId,
      senderType: args.senderType,
      senderUserId: args.senderUserId,
      role: args.role,
      content: args.content,
      meta: args.meta,
      createdAt: Date.now(),
    });
    return messageId;
  },
});

