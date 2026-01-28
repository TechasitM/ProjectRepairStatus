import { NextResponse } from "next/server";

/**
 * Middleware สำหรับป้องกัน route ฝั่ง Admin
 * ใช้ cookie ชื่อ "token" (ได้จาก Laravel Sanctum)
 */
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // ป้องกันเฉพาะ path /admin
  if (pathname.startsWith("/admin")) {
    // ถ้าไม่มี token → เด้งไปหน้า login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // อนุญาตให้ไปต่อ
  return NextResponse.next();
}

/**
 * กำหนด path ที่ middleware จะทำงาน
 */
export const config = {
  matcher: ["/admin/:path*"],
};