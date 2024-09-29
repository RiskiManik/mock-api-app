import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
        subdomain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, name, subdomain } = input;

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new Error("User with this email does not exist.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          subdomain,
        },
      });

      return { message: "User registered successfully!" };
    }),

  // Login a user
  login: publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;

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

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, userId: user.id, role: user.role };
  }),
});
