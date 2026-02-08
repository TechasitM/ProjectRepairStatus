"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function CreateTecPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Client-side Validation
    if (form.password !== form.password_confirmation) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง",
        confirmButtonColor: "#3B82F6",
      });
      setLoading(false);
      return;
    }

    // 2. Show Loading
    Swal.fire({
      title: "กำลังสร้างบัญชี...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await api.post("/tecmanagement", form);
      
      await Swal.fire({
        icon: "success",
        title: "เพิ่มช่างเทคนิคสำเร็จ!",
        text: `บัญชีของคุณ ${form.name} ถูกสร้างเรียบร้อยแล้ว`,
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/admin/tecmanagement");
      router.refresh();
    } catch (err) {
      const errors = err.response?.data?.errors;
      let errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก";

      if (errors) {
        errorMessage = Object.values(errors).flat().join("\n");
      }

      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: errorMessage,
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm">กลับไปหน้าจัดการ</span>
      </button>

      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-blue-900/5 overflow-hidden">
        
        {/* Header Decor */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <UserPlus size={28} /> เพิ่มช่างเทคนิคใหม่
            </h1>
            <p className="text-blue-100 text-sm mt-1 opacity-90">
              สร้างบัญชีเข้าใช้งานระบบสำหรับทีมงานช่างเทคนิค
            </p>
          </div>
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldCheck size={100} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">ข้อมูลส่วนตัว</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                placeholder="ระบุชื่อจริงและนามสกุล"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-blue-500" /> อีเมลใช้งาน (Login ID)
              </label>
              <input
                type="email"
                placeholder="tech-name@company.com"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Section: Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">ความปลอดภัย</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Lock size={16} className="text-blue-500" /> รหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-500" /> ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-50 mt-8">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition-all order-2 sm:order-1"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className={`bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : <><UserPlus size={18} /> สร้างบัญชีช่าง</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}