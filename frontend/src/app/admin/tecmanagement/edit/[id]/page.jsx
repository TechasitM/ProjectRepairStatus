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
  CircleUserRound,
  Cpu,
  KeyRound,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

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
          password: "",
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
      <div className="flex flex-col h-[70vh] items-center justify-center gap-3 bg-gray-50/30">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Loading
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-screen font-sans">
      <div className="mx-auto">
        {/* Navigation & Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูล</h1>
            <p className="text-sm text-gray-500 font-medium">
              แก้ไขบัญชีผู้ใช้งานใหม่สำหรับเจ้าหน้าที่เทคนิค
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Content Area */}
            <div className="p-6 md:p-10 space-y-10">
              {/* Section 1: Basic Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <CircleUserRound size={20} />
                  </div>
                  <h2 className="font-bold text-gray-800">ข้อมูลพื้นฐาน</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                      ชื่อ-นามสกุล
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        value={form.name}
                        required
                        placeholder="ระบุชื่อจริงและนามสกุล"
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                      อีเมล (สำหรับเข้าใช้งาน)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={form.email}
                        required
                        placeholder="example@company.com"
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Security */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <KeyRound size={20} />
                  </div>
                  <h2 className="font-bold text-gray-800">
                    รหัสผ่านและความปลอดภัย
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                      รหัสผ่าน
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">
                      ยืนยันรหัสผ่าน
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <ShieldCheck size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password_confirmation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Form Footer Action */}
            <div className="p-6 md:px-10 md:py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3.5 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </div>
                ) : (
                  <>
                    <UserPlus size={18} />
                    บันทึกข้อมูลช่าง
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
