import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getForUser = query({
  args: {
    ownerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .first();

    if (!settings) {
      // Return default settings
      return {
        defaultModel: "gpt-4",
        defaultProvider: "openai",
        uiLanguage: "zh-CN",
        memoryEnabled: true,
        showSuggestedMemories: true,
      };
    }

    return settings;
  },
});

export const update = mutation({
  args: {
    ownerUserId: v.id("users"),
    defaultModel: v.optional(v.string()),
    defaultProvider: v.optional(v.string()),
    uiLanguage: v.optional(v.string()),
    memoryEnabled: v.optional(v.boolean()),
    showSuggestedMemories: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", args.ownerUserId))
      .first();

    const updates: any = {
      updatedAt: Date.now(),
    };
    if (args.defaultModel !== undefined) updates.defaultModel = args.defaultModel;
    if (args.defaultProvider !== undefined) updates.defaultProvider = args.defaultProvider;
    if (args.uiLanguage !== undefined) updates.uiLanguage = args.uiLanguage;
    if (args.memoryEnabled !== undefined) updates.memoryEnabled = args.memoryEnabled;
    if (args.showSuggestedMemories !== undefined)
      updates.showSuggestedMemories = args.showSuggestedMemories;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("settings", {
        ownerUserId: args.ownerUserId,
        defaultModel: args.defaultModel || "gpt-4",
        defaultProvider: args.defaultProvider || "openai",
        uiLanguage: args.uiLanguage || "zh-CN",
        memoryEnabled: args.memoryEnabled !== undefined ? args.memoryEnabled : true,
        showSuggestedMemories:
          args.showSuggestedMemories !== undefined ? args.showSuggestedMemories : true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

