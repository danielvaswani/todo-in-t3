import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const todoRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await prisma.todo.findMany();
    },
  })
  .mutation("setIsComplete", {
    // validate input with Zod
    input: z.object({ id: z.number(), isComplete: z.boolean() }),
    async resolve({ input }) {
      // use your ORM of choice
      return await prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          isComplete: input.isComplete,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      return await prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
