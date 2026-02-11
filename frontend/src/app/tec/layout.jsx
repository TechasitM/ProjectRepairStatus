"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  ClipboardList,
  Monitor,
  Users,
  Bell,
  Settings2,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ดึงข้อมูล User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user-profile");
        setUser(response.data);
      } catch (error) {
        console.error("Fetch profile failed", error);
      }
    };
    fetchProfile();
  }, []);

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
    { name: "แดชบอร์ด", href: "/tec/dashboard", icon: LayoutDashboard },
    { name: "รายการงานซ่อม", href: "/tec/repairs", icon: ClipboardList },
    { name: "อุปกรณ์", href: "/tec/devices", icon: Monitor },
    { name: "ลูกค้า", href: "/tec/customers", icon: Users },
    { name: "แจ้งเตือน", href: "/tec/notifications", icon: Bell },
    { name: "สถานะ", href: "/tec/statuses", icon: Settings2 },
  ];

  const activeClass = "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
  const inactiveClass = "text-slate-500 hover:bg-slate-50 hover:text-blue-500";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* --- Mobile Navbar --- */}
      <div className="md:hidden bg-white border-b px-5 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-blue-600 tracking-tight text-xl">
          TEC
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
        flex flex-col shadow-sm
      `}
      >
        {/* Logo Section */}
        <div className="hidden md:block p-8">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter">
            TEC PANEL
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

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {user?.name || "Loading..."}
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Technician
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-all font-medium"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 items-center px-8 justify-between">
          <h2 className="text-slate-600 font-medium text-sm">
            {menuItems.find((item) => item.href === pathname)?.name ||
              "ยินดีต้อนรับ"}
          </h2>
        </header>

        <div className="p-2 overflow-y-auto">
          <div className="max-w-10xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[80vh]">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
