"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, LogOut, Wrench, LayoutDashboard } from "lucide-react";
import LoginModal from "@/components/ui/LoginModal";

export default function Navbar() {
  // mock สถานะ login (ภายหลังค่อยต่อ auth จริง)
  const isLoggedIn = false;

  // state สำหรับ modal
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-lg text-blue-600"
          >
            <Wrench className="w-5 h-5" />
            ร้านซ่อมคอมพิวเตอร์
          </Link>

          {/* Right Menu */}
          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              // ✅ ปุ่มเปิด modal
              <button
                onClick={() => setOpenLogin(true)}
                className="flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                เข้าสู่ระบบ
              </button>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  แจ้งซ่อม
                </Link>

                <button
                  onClick={() => alert("Logout logic here")}
                  className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ เรียกใช้ Login Modal */}
      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
      />
    </>
  );
}
