// middleware.ts
import { getValidSubdomain } from "@/lib/subdomain";
import { type NextRequest, NextResponse } from "next/server";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();

  // Skip public files
  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.includes("_next") ||
    url.pathname.includes("/api/")
  ) {
    return NextResponse.next();
  }

  const host = req.headers.get("host");
  const subdomain = getValidSubdomain(host!);

  if (subdomain === host?.split(".")[0]) return NextResponse.next();

  if (subdomain) {
    // Rewrite ke /app/[subdomain] sesuai dengan subdomain yang valid
    console.log(
      `>>> Rewriting: ${url.pathname} to /app/${subdomain}${url.pathname === "/" ? "" : url.pathname}`,
    );
    url.pathname = `/app/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
