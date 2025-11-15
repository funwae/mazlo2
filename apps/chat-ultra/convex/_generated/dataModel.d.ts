/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `_dataModel` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { DataModelFromSchemaDefinition } from "convex/server";
import type { DocumentByName, TableNamesInDataModel } from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModelFromSchemaDefinition<typeof schema>>;

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModelFromSchemaDefinition<typeof schema>,
  TableName
>;

/**
 * The type of a document ID stored in Convex.
 */
export type Id<TableName extends TableNames> = GenericId<TableName>;

/**
 * A type describing your Convex data model.
 *
 * This type enables type autocompletion when querying your database by
 * table name. Pass this type in as a type parameter to the query builder
 * functions (like `.query()`, `.get()`, etc.) to enable type inference.
 *
 * @example
 * ```ts
 * export const myQuery = query({
 *   handler: async (ctx) => {
 *     const doc = await ctx.db.get<DataModel>("myTable", id);
 *     //    ^? doc: Doc<"myTable"> | null
 *   },
 * });
 * ```
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

/* prettier-ignore-end */

