export const getValidSubdomain = (host: string) => {
  let subdomain = null;
  if (!host && typeof window !== "undefined") {
    host = window.location.host;
  }
  if (host?.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("localhost")) {
      subdomain = candidate;
    }
  }
  return subdomain;
};
