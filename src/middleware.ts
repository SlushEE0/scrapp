import { NextRequest, NextResponse } from "next/server";

import { execPocketbase } from "./lib/pbaseServer";

const adminOnlyRoutes = ["/admin", "/testing", "/outreach/manage-events"];
const authedOnlyRoutes = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  // const nextUrl = request.nextUrl.clone();

  // if (![...authedOnlyRoutes, ...adminOnlyRoutes].includes(nextUrl.pathname))
  //   return NextResponse.next();

  // const record = await execPocketbase((pb) => {
  //   return pb.authStore.record;
  // });

  // if (!record) {
  //   nextUrl.pathname = "/auth/login";
  //   return NextResponse.redirect(nextUrl);
  // }

  // const role = record?.role || "guest";

  // if (role === "admin") {
  //   return NextResponse.next();
  // }

  // if (adminOnlyRoutes.includes(nextUrl.pathname)) {
  //   nextUrl.searchParams.set("page", nextUrl.pathname);
  //   nextUrl.pathname = "/auth/unauthorized";

  //   return NextResponse.redirect(nextUrl);
  // }

  return NextResponse.next();
}
