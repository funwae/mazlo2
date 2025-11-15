import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listForUser = query({
  args: {
    ownerUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("providerConfigs")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId || null))
      .filter((q) => q.eq(q.field("enabled"), true))
      .collect();
  },
});

export const setDefault = mutation({
  args: {
    ownerUserId: v.id("users"),
    provider: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    // Update user's settings with default provider/model
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        defaultProvider: args.provider,
        defaultModel: args.model,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        ownerUserId: args.ownerUserId,
        defaultProvider: args.provider,
        defaultModel: args.model,
        uiLanguage: "zh-CN",
        memoryEnabled: true,
        showSuggestedMemories: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const createConfig = mutation({
  args: {
    ownerUserId: v.id("users"),
    provider: v.string(),
    apiKeyRef: v.string(),
    defaultModel: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if config exists
    const existing = await ctx.db
      .query("providerConfigs")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .filter((q) => q.eq(q.field("provider"), args.provider))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        apiKeyRef: args.apiKeyRef,
        defaultModel: args.defaultModel,
        enabled: args.enabled,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("providerConfigs", {
        ownerUserId: args.ownerUserId,
        provider: args.provider,
        apiKeyRef: args.apiKeyRef,
        defaultModel: args.defaultModel,
        enabled: args.enabled,
        createdAt: Date.now(),
      });
    }
  },
});

