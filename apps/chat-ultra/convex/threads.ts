import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByRoom = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.threadId);
  },
});

export const create = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const threadId = await ctx.db.insert("threads", {
      roomId: args.roomId,
      title: args.title,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    return threadId;
  },
});

export const updateStatus = mutation({
  args: {
    threadId: v.id("threads"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

