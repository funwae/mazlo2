import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listForUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.userId))
      .filter((q) => q.eq(q.field("archived"), false))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getGlobalForUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.userId))
      .filter((q) => q.eq(q.field("type"), "global"))
      .collect();
    return rooms[0] || null;
  },
});

export const create = mutation({
  args: {
    ownerUserId: v.id("users"),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    worldTag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert("rooms", {
      ownerUserId: args.ownerUserId,
      type: args.type,
      title: args.title,
      description: args.description,
      worldTag: args.worldTag,
      archived: false,
      createdAt: Date.now(),
    });
    return roomId;
  },
});

export const archive = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      archived: true,
    });
  },
});

export const rename = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      title: args.title,
      description: args.description,
    });
  },
});

