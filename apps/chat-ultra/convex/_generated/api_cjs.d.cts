/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as attachments from "../attachments.js";
import type * as memory from "../memory.js";
import type * as messages from "../messages.js";
import type * as presence from "../presence.js";
import type * as provider from "../provider.js";
import type * as rooms from "../rooms.js";
import type * as scheduler from "../scheduler.js";
import type * as settings from "../settings.js";
import type * as threads from "../threads.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  attachments: typeof attachments;
  memory: typeof memory;
  messages: typeof messages;
  presence: typeof presence;
  provider: typeof provider;
  rooms: typeof rooms;
  scheduler: typeof scheduler;
  settings: typeof settings;
  threads: typeof threads;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
