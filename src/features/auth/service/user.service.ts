"use server";
import { getBaseUrl } from "@/trpc/react";
import { type UsersRes } from "../types";

export const getUsers = async () => {
  try {
    const users = await fetch(getBaseUrl() + "/api/auth");
    const data = (await users.json()) as UsersRes;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
