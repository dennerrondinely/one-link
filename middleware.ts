import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDeviceInfo } from "@/lib/device";
import { links } from "@/lib/links";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.slice(1);

  // Skip non-link routes and nested paths.
  if (!id || id.includes("/") || !(id in links)) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const device = getDeviceInfo(userAgent);

  if (device.isDesktop) {
    const destination = links[id].webUrl;
    return NextResponse.redirect(destination, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
