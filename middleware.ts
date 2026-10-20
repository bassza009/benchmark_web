// Every page lives under /en or /th. A URL without a language gets redirected:
// Thai browsers go to /th, everyone else to /en.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (first === "en" || first === "th") return;

  const prefersThai = (request.headers.get("accept-language") ?? "").toLowerCase().startsWith("th");
  const lang = prefersThai ? "th" : "en";
  const url = new URL(`/${lang}${pathname === "/" ? "" : pathname}${search}`, request.url);
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals and files with an extension (favicon.ico, images...)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
