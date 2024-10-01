import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

// Define input schemas for request and response
const requestSchema = z.object({
  headers: z.record(z.string()),
  body: z.record(z.any()),
  queryParams: z.record(z.string()),
});

const responseSchema = z.object({
  headers: z.record(z.string()),
  body: z.record(z.any()),
  status: z.number().int(),
});

// Define input schema for MockApi
const mockApiSchema = z.object({
  method: z.enum(["POST", "GET", "PATCH", "PUT"]),
  endpoint: z.string().min(1),
  request: requestSchema,
  response: responseSchema,
  userId: z.string().uuid(),
});

export const mockApiRouter = createTRPCRouter({
  // Create a new mock API entry
  create: publicProcedure
    .input(mockApiSchema)
    .mutation(async ({ ctx, input }) => {
      const { method, endpoint, request, response, userId } = input;
      return await ctx.db.mockApi.create({
        data: {
          method,
          endpoint,
          user: {
            connect: {
              id: userId,
            },
          },
          request: {
            create: request,
          },
          response: {
            create: response,
          },
        },
        include: {
          request: true,
          response: true,
        },
      });
    }),

  // Read (fetch) all mock APIs
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.mockApi.findMany({
      include: {
        request: true,
        response: true,
      },
    });
  }),

  // Get a single mock API by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.mockApi.findUnique({
        where: { id: input.id },
        include: {
          request: true,
          response: true,
        },
      });
    }),

  // Update an existing mock API
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        method: z.enum(["POST", "GET", "PATCH", "PUT"]).optional(),
        endpoint: z.string().min(1).optional(),
        request: requestSchema.optional(),
        response: responseSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, method, endpoint, request, response } = input;
      return await ctx.db.mockApi.update({
        where: { id },
        data: {
          method,
          endpoint,
          request: request
            ? {
                update: request,
              }
            : undefined,
          response: response
            ? {
                update: response,
              }
            : undefined,
        },
        include: {
          request: true,
          response: true,
        },
      });
    }),

  // Delete a mock API entry by ID
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.mockApi.delete({
        where: { id: input.id },
      });
    }),

  // New procedure to consume mock API
  consume: publicProcedure
    .input(
      z.object({
        method: z.enum(["POST", "GET", "PATCH", "PUT"]),
        endpoint: z.string().min(1),
        headers: z.record(z.string()).optional(),
        body: z.record(z.any()).optional(),
        queryParams: z.record(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { method, endpoint, headers, body, queryParams } = input;

      // Find matching mock API
      const mockApi = await ctx.db.mockApi.findFirst({
        where: {
          method,
          endpoint,
        },
        include: {
          request: true,
          response: true,
        },
      });

      if (!mockApi) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No mock API found for ${method} ${endpoint}`,
        });
      }

      // Check if request matches
      const requestMatches =
        (!mockApi.request?.headers ||
          Object.entries(
            mockApi.request.headers as Record<string, string>,
          ).every(([key, value]) => headers?.[key] === value)) &&
        (!mockApi.request?.body ||
          JSON.stringify(mockApi.request.body) === JSON.stringify(body)) &&
        (!mockApi.request?.queryParams ||
          Object.entries(
            mockApi.request.queryParams as Record<string, string>,
          ).every(([key, value]) => queryParams?.[key] === value));

      if (!requestMatches) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Request does not match mock API specification",
        });
      }

      // Return mock response
      return {
        headers: mockApi.response?.headers as Record<string, string>,
        body: mockApi.response?.body as Record<string, string | number>,
        status: mockApi.response?.status,
      };
    }),
});
