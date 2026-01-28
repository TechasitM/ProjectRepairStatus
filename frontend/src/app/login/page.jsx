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

      // 1. เก็บ Token (เพื่อใช้ใน Request ต่อๆ ไป)
      document.cookie = `token=${res.data.token}; path=/`;
      localStorage.setItem("token", res.data.token); // เก็บสำรองไว้สำหรับ axios interceptor

      // 2. ตรวจสอบ Role จากข้อมูลที่ Backend ส่งกลับมา (TinyInt: 1 คือ Admin)
      const user = res.data.user;

      if (user.role === 1) {
        // ถ้าเป็น Admin ให้ไปหน้า Dashboard
        Swal.fire({
          icon: 'success',
          title: 'ยินดีต้อนรับผู้ดูแลระบบ',
          timer: 1500,
          showConfirmButton: false
        });
        router.push("/admin/dashboard");
      } else {
        // ถ้าไม่ใช่ Admin (Role = 0)
        Swal.fire({
          icon: 'warning',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'คุณไม่มีสิทธิ์เข้าถึงส่วนงานหลังบ้าน',
        });
        router.push("/"); // ส่งไปหน้าแรกของผู้ใช้ทั่วไป
      }

    } catch (err) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      Swal.fire('ผิดพลาด', 'Login ไม่สำเร็จ กรุณาลองใหม่', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h1>เข้าสู่ระบบพนักงาน</h1>

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

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
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
