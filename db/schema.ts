import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"


export const tasksTable = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type InsertTask = typeof tasksTable.$inferInsert
export type SelectTask = typeof tasksTable.$inferSelect