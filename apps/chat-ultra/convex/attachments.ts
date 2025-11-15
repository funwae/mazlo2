import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const listByRoomAndThread = query({
  args: {
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attachments")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) =>
        args.threadId
          ? q.eq(q.field("threadId"), args.threadId)
          : q.eq(q.field("threadId"), undefined)
      )
      .collect();
  },
});

export const upload = action({
  args: {
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    messageId: v.optional(v.id("messages")),
    ownerUserId: v.id("users"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const attachmentId = await ctx.runMutation(internal.attachments.createAttachment, {
      roomId: args.roomId,
      threadId: args.threadId,
      messageId: args.messageId,
      ownerUserId: args.ownerUserId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      storageId: args.storageId,
    });
    return attachmentId;
  },
});

export const deleteAttachment = mutation({
  args: {
    attachmentId: v.id("attachments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.attachmentId);
  },
});

// Internal mutation for upload action
export const createAttachment = internalMutation({
  args: {
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    messageId: v.optional(v.id("messages")),
    ownerUserId: v.id("users"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const attachmentId = await ctx.db.insert("attachments", {
      roomId: args.roomId,
      threadId: args.threadId,
      messageId: args.messageId,
      ownerUserId: args.ownerUserId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      storageId: args.storageId,
      createdAt: Date.now(),
    });
    return attachmentId;
  },
});

