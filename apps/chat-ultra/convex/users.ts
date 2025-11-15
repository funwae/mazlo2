import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get or create user from Supabase external ID
 */
export const getOrCreateFromSupabase = mutation({
  args: {
    externalId: v.string(),
    email: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      externalId: args.externalId,
      displayName: args.displayName,
      locale: "zh-CN",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Get user by external ID (Supabase ID)
 */
export const getByExternalId = query({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();
  },
});

/**
 * Get user by Convex ID
 */
export const get = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

