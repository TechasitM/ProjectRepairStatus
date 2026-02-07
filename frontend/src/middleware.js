import { NextResponse } from 'next/server';

// middleware.js
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // โซน Technician: ให้ทั้ง Admin(1) และ Tec(2) เข้าได้ 
  // (เพราะ Admin ควรดูงานของช่างได้ด้วย)
  if (pathname.startsWith("/tec")) {
    if (!token || (role !== "1" && role !== "2")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // โซน Admin: ให้ Admin(1) เข้าได้คนเดียวเท่านั้น
  if (pathname.startsWith("/admin")) {
    if (!token || role !== "1") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}