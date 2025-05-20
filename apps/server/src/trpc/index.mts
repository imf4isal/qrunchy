import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

export type Context = {};

export const createContext = async (): Promise<Context> => {
  return {};
};

const t = initTRPC.context<Context>().meta().create({
  transformer: SuperJSON,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;
