import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByRoom = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        lastSeenAt: Date.now(),
      });
    } else {
      await ctx.db.insert("presence", {
        roomId: args.roomId,
        userId: args.userId,
        status: args.status,
        typing: false,
        lastSeenAt: Date.now(),
      });
    }
  },
});

export const setTyping = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    typing: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        typing: args.typing,
        lastSeenAt: Date.now(),
      });
    } else {
      await ctx.db.insert("presence", {
        roomId: args.roomId,
        userId: args.userId,
        status: "online",
        typing: args.typing,
        lastSeenAt: Date.now(),
      });
    }
  },
});

