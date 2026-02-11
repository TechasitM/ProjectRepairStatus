"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  Users,
  Wrench,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // เพิ่ม State สำหรับเก็บข้อมูล User

  // ดึงข้อมูลโปรไฟล์จาก API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user-profile");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // หากดึงข้อมูลไม่ได้ (เช่น Token หมดอายุ) อาจจะส่งกลับหน้า Login
        // router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  const logout = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.post("/logout");

        // ลบ token cookie
        document.cookie = "token=; Max-Age=0; path=/";

        await Swal.fire({
          title: "ออกจากระบบสำเร็จ",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });

        router.push("/");
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถออกจากระบบได้",
          icon: "error",
        });
      }
    }
  };

  const menuItems = [
    { name: "แดชบอร์ด", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "จัดการทีมช่าง", href: "/admin/tecmanagement", icon: Wrench },
    { name: "ลูกค้า", href: "/admin/customers", icon: Users },
  ];

  const activeClass = "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
  const inactiveClass = "text-slate-500 hover:bg-slate-50 hover:text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* --- Mobile Navbar --- */}
      <div className="md:hidden bg-white border-b px-5 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-slate-800 tracking-tight">
          ADMIN PANEL
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-slate-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Sidebar --- */}
      <aside
        className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        flex flex-col
      `}
      >
        {/* Logo Section */}
        <div className="p-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Service Pro
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  pathname === item.href ? activeClass : inactiveClass
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout Section */}
        {/* --- ส่วน User Profile ที่ดึงข้อมูลจาก API มาแสดง --- */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
              {/* แสดงตัวอักษรแรกของชื่อ */}
              {user?.name?.charAt(0) || <UserCircle size={20} />}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs text-slate-400">เข้าใช้งานโดย</span>
              <span className="text-sm font-semibold text-slate-700 truncate w-32">
                {user ? user.name : "กำลังโหลด..."}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors font-medium"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 items-center px-8 justify-between">
          <h2 className="text-slate-500 font-medium text-sm">
            {menuItems.find((item) => item.href === pathname)?.name ||
              "ยินดีต้อนรับ"}
          </h2>
        </header>

        <div className="p-2 overflow-y-auto">
          <div className="mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[calc(100vh-160px)]">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Overlay สำหรับมือถือ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
