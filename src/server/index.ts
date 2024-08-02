import { drizzle } from "drizzle-orm/better-sqlite3";
import { publicProcedure, router } from "./trpc";
import Database from "better-sqlite3";
import { todos } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { initTRPC } from "@trpc/server";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

const t = initTRPC.create();

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return await db.select().from(todos).all();
  }),

  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    await db.insert(todos).values({ content: opts.input, done: 0 }).run();
    return true;
  }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.number(),
      })
    )
    .mutation(async (opts) => {
      await db.update(todos).set({ done: opts.input.done }).where(eq(todos.id, opts.input.id)).run();
      return true;
    }),
});

export const createCaller = t.createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
