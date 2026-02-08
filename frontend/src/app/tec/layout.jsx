"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import api from "@/services/api";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // สำหรับเปิด-ปิดเมนูบนมือถือ

  const logout = async () => {
    await api.post("/logout");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/");
  };

  const menuItems = [
    { name: "แดชบอร์ด", href: "/tec/dashboard" },
    { name: "รายการงานซ่อม", href: "/tec/repairs" },
    { name: "อุปกรณ์", href: "/tec/devices" },
    { name: "ลูกค้า", href: "/tec/customers" },
    { name: "แจ้งเตือน", href: "/tec/notifications" },
    { name: "สถานะ", href: "/tec/statuses" },
  ];

  const activeClass = "bg-blue-500 text-white";
  const inactiveClass = "text-slate-600 hover:bg-blue-50 hover:text-blue-500";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* --- Mobile Navbar --- */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-blue-500 text-xl">TEC</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 focus:outline-none"
        >
          {/* Icon Hamburger */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* --- Sidebar (Hidden on mobile unless toggled) --- */}
      <aside
        className={`
        ${isOpen ? "block" : "hidden"} 
        md:block w-full md:w-64 bg-white border-r border-slate-200 shadow-sm
      `}
      >
        <div className="flex flex-col h-full">
          <div className="hidden md:block p-6">
            <h3 className="text-2xl font-bold text-blue-500">TEC Panel</h3>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  pathname === item.href ? activeClass : inactiveClass
                }`}
                onClick={() => setIsOpen(false)} // ปิดเมนูเมื่อคลิก (บนมือถือ)
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1">
        {/* Header ส่วนบน (Optional) */}
        <header className="hidden md:flex bg-white h-16 border-b border-slate-200 items-center px-8">
          <h2 className="text-slate-700 font-semibold uppercase tracking-wider text-sm">
            {menuItems.find((item) => item.href === pathname)?.name || "System"}
          </h2>
        </header>
        <div className="p-2 md:p-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[80vh]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
