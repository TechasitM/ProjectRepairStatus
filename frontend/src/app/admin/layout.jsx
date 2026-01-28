"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const logout = async () => {
    await api.post("/logout");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#f3f4f6", padding: 15 }}>
        <h3>Admin</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link href="/admin/dashboard">Dashboard</Link></li>
          <li><Link href="/admin/repairs">งานซ่อม</Link></li>
          <li><Link href="/admin/customers">ลูกค้า</Link></li>
          <li><Link href="/admin/devices">อุปกรณ์</Link></li>
          <li><Link href="/admin/statuses">สถานะ</Link></li>
        </ul>
        <button onClick={logout} style={{ marginTop: 20 }}>Logout</button>
      </aside>

      <main style={{ flex: 1, padding: 0 }}>{children}</main>
    </div>
  );
}
