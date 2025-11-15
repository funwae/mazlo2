/* prettier-ignore-start */

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
import type * as attachments from "../attachments";
import type * as memory from "../memory";
import type * as messages from "../messages";
import type * as presence from "../presence";
import type * as provider from "../provider";
import type * as rooms from "../rooms";
import type * as schema from "../schema";
import type * as settings from "../settings";
import type * as threads from "../threads";

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
  schema: typeof schema;
  settings: typeof settings;
  threads: typeof threads;
}>;

export type Api = FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

export type InternalApi = FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */

