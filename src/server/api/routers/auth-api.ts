import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { generateRandomString } from "@/lib/randomChar";
import { createApiResponse } from "@/lib/api-response";

// JWT Secret key (pastikan ini disimpan dengan aman di env)
const JWT_SECRET = process.env.JWT_SECRET ?? "supersecretkey";

// Schema untuk registrasi dan login
const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = createTRPCRouter({
  // Register a new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;

      if (!email || !password || !name) {
        throw new Error("Email, password, name, and subdomain are required.");
      }
      try {
        // Check if user already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error("User with this email already exist.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await ctx.db.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            subdomain: generateRandomString(10),
          },
        });

        return createApiResponse(true, "Registration successful");
      } catch (error) {
        return createApiResponse(false, (error as Error).message);
      }
    }),

  // Login a user
  login: publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;

    try {
      // Find the user by email
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid email or password.");
      }

      // Compare the password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
      }

      // Generate a JWT token with additional user information
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          subdomain: user.subdomain,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      return createApiResponse(true, "Login successful", {
        token,
        userId: user.id,
        role: user.role,
        subdomain: user.subdomain,
      });
    } catch (error) {
      return createApiResponse(false, (error as Error).message);
    }
  }),

  // Get current user
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    // The user information is now available directly from the context
    const { id, email, role, subdomain } = ctx.user;

    return createApiResponse(true, "User retrieved successfully", {
      id,
      email,
      role,
      subdomain,
    });
  }),
});
