import { z } from "zod";
import { publicProcedure, router } from "../index.mjs";

export const helloRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}!`,
        time: new Date().toISOString(),
      };
    }),

  ping: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
});
