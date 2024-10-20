import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware to protect /booking routes
export function middleware(req: NextRequest) {
  const token1 = req.cookies.get("token1");

  console.log("Middleware running");
  console.log("Request path:", req.nextUrl.pathname);

  // If no token is found, redirect to the login page
  if (!token1) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Allow the request to continue if the token1 exists
  return NextResponse.next();
}

// Specify which routes to protect
export const config = {
  matcher: ["/booking/addon", "/booking/bus", "/booking/receipt"], // Protects all routes under /booking
};
