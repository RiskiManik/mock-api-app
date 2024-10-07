import { type NextRequest, NextResponse } from "next/server";
import { getUsers } from "./features/auth/service/user.service";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const users = await getUsers();

  // Define allowed Domains (localhost and production domain)
  const allowedDomains: string[] = ["localhost:3000", "tudominio.com"];

  // Verify if hostname exist in allowed domains
  const isAllowedDomain = allowedDomains.some((domain) =>
    hostname?.includes(domain),
  );

  // Extract the possible subdomain in the URL
  const subdomain = hostname?.split(".")[0];

  // If we stay in a allowed domain and its not a subdomain, allow the request.
  if (
    isAllowedDomain &&
    hostname &&
    !users?.some((d) => d.subdomain === subdomain)
  ) {
    return NextResponse.next();
  }

  const subdomainData = users?.find((d) => d.subdomain === subdomain);

  if (subdomainData) {
    // Rewrite the URL in the dynamic route based on the subdomain
    return NextResponse.rewrite(
      new URL(`/${subdomain}${url.pathname}`, req.url),
    );
  }

  return new Response(null, { status: 404 });
}
