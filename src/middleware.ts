import { NextRequest, NextResponse } from "next/server";

import { runPocketbase } from "./lib/pbaseServer";

const adminPaths = ["/admin", "/testing"];
const publicPaths = ["/auth/unauthorized", "/auth/login", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();

  if (publicPaths.includes(nextUrl.pathname)) {
    return NextResponse.next();
  }

  const record = await runPocketbase((pb) => {
    return pb.authStore.record;
  });

  if (!record) {
    nextUrl.pathname = "/auth/login";

    return NextResponse.redirect(nextUrl);
  }

  const role = record?.role || "guest";

  if (role === "admin") {
    return NextResponse.next();
  }

  if (adminPaths.includes(nextUrl.pathname)) {
    nextUrl.searchParams.set("page", nextUrl.pathname);
    nextUrl.pathname = "/auth/unauthorized";

    return NextResponse.redirect(nextUrl);
  }

  return NextResponse.next();
}
