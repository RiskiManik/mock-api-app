import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecretkey";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

// Auth middleware
// Auth middleware
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.headers.get("authorization")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing authorization header",
    });
  }

  const token = ctx.headers.get("authorization")!.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, JWT_SECRET) as unknown as {
      userId: string;
      email: string;
      role: string;
    };

    // Add user to context directly from the decoded token
    return next({
      ctx: {
        ...ctx,
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});
export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = publicProcedure.use(authMiddleware);
