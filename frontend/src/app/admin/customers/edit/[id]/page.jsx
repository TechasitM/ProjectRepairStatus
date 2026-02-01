"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import { User, Phone, Mail, Save, X, ArrowLeft,Edit} from 'lucide-react';

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: "", // ปรับให้ตรงกับ Database
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- load customer ---------------- */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/customers/${id}`);
        const data = res.data.data || res.data;
        setForm({
          customer_name: data.customer_name || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "ไม่พบข้อมูล",
          text: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า",
          confirmButtonColor: "#3B82F6",
        });
        router.push("/admin/customers");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomer();
  }, [id, router]);

  /* ---------------- update ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/customers/${id}`, form);
      await Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "แก้ไขข้อมูลลูกค้าเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/admin/customers");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: err.response?.data?.message || "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- delete ---------------- */
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "การลบข้อมูลนี้จะไม่สามารถเรียกคืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/customers/${id}`);
        router.push("/admin/customers");
        Swal.fire("ลบเรียบร้อย!", "ข้อมูลลูกค้าถูกลบออกจากระบบแล้ว", "success");
      } catch (err) {
        Swal.fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">กำลังโหลดข้อมูลลูกค้า...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">กลับไปหน้าก่อนหน้า</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Edit size={24} /> แก้ไขข้อมูลลูกค้า
            </h1>
            <p className="text-blue-100 text-sm mt-1 opacity-80">ID: #{id}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Input Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                placeholder="ระบุชื่อลูกค้า"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" /> เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="08X-XXX-XXXX"
                  required
                />
              </div>

              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" /> อีเมล (ถ้ามี)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-bold"
                >
                  <X size={18} /> ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold disabled:opacity-50"
                >
                  {submitting ? "กำลังบันทึก..." : <><Save size={18} /> บันทึกข้อมูล</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}