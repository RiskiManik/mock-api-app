import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";

// Define input schemas for request and response
const requestSchema = z.object({
  headers: z.record(z.string()),
  body: z.any().nullish(),
  queryParams: z.record(z.string()),
});

const responseSchema = z.object({
  headers: z.record(z.string()), // Headers in JSON
  body: z.any().nullish(), // Body in JSON
  status: z.number().int(), // HTTP status code
});

// Define input schema for MockApi
const mockApiSchema = z.object({
  method: z.enum(["POST", "GET", "PATCH", "PUT"]), // Enum for methods
  endpoint: z.string().min(1), // Endpoint URL
  request: requestSchema, // Request schema
  response: responseSchema, // Response schema
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
            create: request as Prisma.RequestCreateWithoutMockApiInput,
          },
          response: {
            create: response as Prisma.ResponseCreateWithoutMockApiInput,
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
});
