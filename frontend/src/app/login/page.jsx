"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // 1. เก็บ Token และ Role ลงใน Cookie (เพื่อให้ Middleware อ่านได้)
      // ตั้งค่า max-age ไว้ที่ 1 วัน (86400 วินาที)
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
      
      // เก็บลง localStorage สำหรับหัวข้อ Authorization ใน Axios Interceptor
      localStorage.setItem("token", token);

      // 2. จัดการเส้นทางตามสิทธิ์ (Role)
      if (user.role === 1) {
        // กรณีเป็น Admin
        Swal.fire({
          icon: 'success',
          title: 'ยินดีต้อนรับผู้ดูแลระบบ',
          timer: 1500,
          showConfirmButton: false
        });
        router.push("/admin/dashboard");
      } else if (user.role === 2) {
        // กรณีเป็น Technician (ช่าง)
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ (ฝ่ายช่าง)',
          timer: 1500,
          showConfirmButton: false
        });
        router.push("/tec/dashboard"); // หรือ path ที่คุณตั้งไว้สำหรับช่าง
      } else {
        // กรณี User ทั่วไป (Role 0 หรืออื่นๆ)
        Swal.fire({
          icon: 'info',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'คุณไม่มีสิทธิ์เข้าถึงระบบจัดการหลังบ้าน',
        });
        router.push("/");
      }

    } catch (err) {
      console.error(err);
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      Swal.fire('ผิดพลาด', 'Login ไม่สำเร็จ กรุณาลองใหม่', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>เข้าสู่ระบบพนักงาน</h1>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 10 }}>{error}</p>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}