"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Lock, Mail, ShieldCheck, Cpu, X } from "lucide-react";

export default function LoginModal({ open, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      const { token, user } = res.data;

      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem("token", token);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });

      onClose();

      if (user.role === 1) {
        await Toast.fire({
          icon: "success",
          title: `Admin: ยินดีต้อนรับคุณ ${user.name}`,
        });
        router.push("/admin/dashboard");
      } else if (user.role === 2) {
        await Toast.fire({
          icon: "success",
          title: `Technician: สวัสดีคุณ ${user.name}`,
        });
        router.push("/tec/dashboard");
      } else {
        Swal.fire({
          icon: "info",
          title: "เข้าสู่ระบบสำเร็จ",
          text: "คุณไม่มีสิทธิ์เข้าถึงส่วนงานพนักงาน",
        });
        router.push("/");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl z-10">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-[2.5rem] shadow-xl shadow-blue-200 mb-6">
            <Cpu size={40} />
          </div>
          <h1 className="text-3xl">Staff Portal</h1>
          <p className="text-gray-500  mt-2">
            ระบบจัดการหลังบ้าน
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[13px] font-black text-gray-400 uppercase">
              Email
            </label>
            <div className="relative group mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl focus:ring-2 ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-black text-gray-400 uppercase">
              Password
            </label>
            <div className="relative group mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl focus:ring-2 ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 rounded-2xl text-white  flex justify-center items-center gap-2 transition
              ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-xl"
              }`}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ShieldCheck size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
