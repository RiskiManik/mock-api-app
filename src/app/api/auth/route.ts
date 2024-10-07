import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const users = await db.user.findMany();
    if (!users) {
      return NextResponse.json({ error: "No users found" });
    }
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error });
  }
};
