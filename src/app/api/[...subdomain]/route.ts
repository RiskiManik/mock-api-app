import { compareJsonKeys } from "@/lib/compare-json";
import { getValidSubdomain } from "@/lib/subdomain";
import { db } from "@/server/db";
import { type Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { subdomain: string[] } },
) => {
  const { subdomain } = params;
  const host = req.headers.get("host");
  try {
    const userBySubdomain = await db.user.findUnique({
      where: {
        subdomain: getValidSubdomain(host!)!,
      },

      select: {
        mockApis: {
          where: {
            method: {
              equals: req.method as "GET" | "POST" | "PATCH" | "PUT",
            },
            endpoint: {
              equals: `/api/${subdomain.join("/")}`,
            },
          },
          include: {
            response: true,
            request: true,
          },
        },
      },
    });
    if (!userBySubdomain) {
      return new Response("Not Found", { status: 404 });
    }

    return NextResponse.json({
      status: userBySubdomain.mockApis[0]!.response!.status,
      data: userBySubdomain.mockApis[0]!.response!.body,
    });
  } catch (error) {
    return new Response("Not Found", { status: 404 });
  }
};
export const POST = async (
  req: NextRequest,
  { params }: { params: { subdomain: string[] } },
) => {
  const { subdomain } = params;
  const host = req.headers.get("host");
  try {
    const userBySubdomain = await db.user.findUnique({
      where: {
        subdomain: getValidSubdomain(host!)!,
      },
      select: {
        mockApis: {
          where: {
            method: {
              equals: req.method as "GET" | "POST" | "PATCH" | "PUT",
            },
            endpoint: {
              equals: `/api/${subdomain.join("/")}`,
            },
          },
          include: {
            response: true,
            request: true,
          },
        },
      },
    });

    const requestBody = (await req.json()) as Prisma.JsonValue;

    if (
      !compareJsonKeys(
        requestBody,
        userBySubdomain!.mockApis[0]?.request?.body ?? {},
      )
    ) {
      return new Response("Bad Request", { status: 400 });
    }

    if (!userBySubdomain) {
      return new Response("Not Found ahahh", { status: 404 });
    }

    return NextResponse.json({
      status: userBySubdomain.mockApis[0]!.response!.status,
      data: userBySubdomain.mockApis[0]!.response!.body,
    });
  } catch (error) {
    return new Response("Not Found error", { status: 404 });
  }
};
