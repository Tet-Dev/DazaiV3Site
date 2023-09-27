import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    if (request.cookies.has('authy_cookie') && new URL(request.url).pathname === "/") {
    console.log('authy_cookie found',new URL(request.url).pathname);
  return NextResponse.redirect(new URL("/app", request.url));
    }
}
