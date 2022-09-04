import { createRouter } from "./context";
import { z, ZodString } from "zod";
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
  })
  .mutation("add", {
    input: z.string(),
    async resolve({ input }) {
      return await prisma.todo.create({
        data: { description: input, isComplete: false },
      });
    },
  })
  // .mutation("moveUpOnce", {
  //   input: z.object({
  //     id: z.number(),
  //     pos: z.number(),
  //     isComplete: z.boolean(),
  //   }),
  //   async resolve({ input }) {
  //     return await prisma.$transaction([
  //       prisma.todo.updateMany({
  //         where: {
  //           pos: input.pos - 1,
  //         },
  //         data: {
  //           pos: {
  //             increment: 1,
  //           },
  //         },
  //       }),
  //       prisma.todo.update({
  //         where: {
  //           id: input.id,
  //         },
  //         data: {
  //           pos: {
  //             decrement: 1,
  //           },
  //         },
  //       }),
  //     ]);
  //   },
  // })
  // .mutation("moveDownOnce", {
  //   input: z.object({
  //     id: z.number(),
  //     pos: z.number(),
  //     isComplete: z.boolean(),
  //   }),
  //   async resolve({ input }) {
  //     return await prisma.$transaction([
  //       prisma.todo.updateMany({
  //         where: {
  //           pos: input.pos + 1,
  //         },
  //         data: {
  //           pos: {
  //             increment: -1,
  //           },
  //         },
  //       }),
  //       prisma.todo.update({
  //         where: {
  //           id: input.id,
  //         },
  //         data: {
  //           pos: {
  //             increment: 1,
  //           },
  //         },
  //       }),
  //     ]);
  //   },
  // })
  .mutation("moveDown", {
    input: z.object({ id: z.number(), pos: z.number(), newPos: z.number() }),
    async resolve({ input }) {
      await prisma.$transaction([
        prisma.todo.updateMany({
          where: {
            pos: {
              gt: input.pos,
              lte: input.newPos,
            },
          },
          data: {
            pos: {
              decrement: 1,
            },
          },
        }),
        prisma.todo.update({
          where: {
            id: input.id,
          },
          data: {
            pos: input.newPos,
          },
        }),
      ]);
    },
  })
  .mutation("moveUp", {
    input: z.object({ id: z.number(), pos: z.number(), newPos: z.number() }),
    async resolve({ input }) {
      await prisma.$transaction([
        prisma.todo.updateMany({
          where: {
            pos: {
              gte: input.newPos,
              lt: input.pos,
            },
          },
          data: {
            pos: {
              increment: 1,
            },
          },
        }),
        prisma.todo.update({
          where: {
            id: input.id,
          },
          data: {
            pos: input.newPos,
          },
        }),
      ]);
    },
  });
