"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Save, 
  UserCog,
  ShieldAlert,
  Cpu,
} from 'lucide-react';

export default function EditTecPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTecData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tecmanagement/${id}`);
        const data = res.data.data || res.data;
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "", // ปลอดภัยไว้ก่อน
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "ไม่พบข้อมูล",
          text: "อาจไม่มีข้อมูลช่างเทคนิครายนี้ในระบบ",
          confirmButtonColor: "#3B82F6",
        }).then(() => router.push("/admin/tecmanagement"));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTecData();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    Swal.fire({
      title: "กำลังบันทึก...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // ตรวจสอบ password: ถ้าว่างให้เอาออกจาก object ที่จะส่งไป API
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      await api.put(`/tecmanagement/${id}`, payload);

      await Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        text: "ข้อมูลช่างเทคนิคถูกแก้ไขเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/admin/tecmanagement");
      router.refresh();
    } catch (err) {
      const message = err.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้";
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: message,
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setSaving(false);
    }
  };

if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4 bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <Cpu
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"
            size={24}
          />
        </div>
        <p className="font-bold text-gray-500 animate-pulse tracking-wide uppercase text-xs">
          Loading...
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* Navigation & Header */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm">ย้อนกลับ</span>
      </button>

      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <UserCog className="text-blue-400" /> แก้ไขโปรไฟล์ช่างเทคนิค
            </h1>
            <p className="text-gray-400 text-sm mt-1">ID: #{id} • แก้ไขข้อมูลพื้นฐานหรือสิทธิ์การเข้าใช้งาน</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <UserCog size={80} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* ชื่อ-นามสกุล */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User size={14} className="text-blue-500" /> ชื่อ-นามสกุล
            </label>
            <input
              value={form.name}
              placeholder="ระบุชื่อจริง-นามสกุล"
              className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* อีเมล */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} className="text-blue-500" /> อีเมลสำหรับเข้าใช้งาน
            </label>
            <input
              type="email"
              value={form.email}
              placeholder="example@mail.com"
              className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* รหัสผ่านใหม่ */}
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 space-y-3">
            <label className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} /> ตั้งรหัสผ่านใหม่
            </label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านใหม่ที่ต้องการ (อย่างน้อย 6 ตัวอักษร)"
              className="w-full bg-white border border-blue-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <div className="flex items-center gap-2 text-[11px] text-blue-600 font-medium italic">
              <ShieldAlert size={12} />
              <span>เว้นว่างไว้หากไม่ต้องการเปลี่ยนแปลงรหัสผ่านเดิม</span>
            </div>
          </div>

          {/* ปุ่มกด */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 font-bold transition-all"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className={`bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={saving}
            >
              {saving ? "กำลังบันทึก..." : <><Save size={18} /> บันทึกการเปลี่ยนแปลง</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}