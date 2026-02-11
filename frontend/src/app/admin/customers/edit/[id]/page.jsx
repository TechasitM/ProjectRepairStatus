"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  Mail,
  Save,
  X,
  ArrowLeft,
  Edit,
  Trash2,
  Info,
} from "lucide-react";

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: "",
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
      confirmButtonText: "ใช่, ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/customers/${id}`);
        Swal.fire({
          icon: "success",
          title: "ลบเรียบร้อย!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin/customers");
      } catch (err) {
        Swal.fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
        </div>
        <p className="text-gray-500 mt-4 font-medium animate-pulse">
          กำลังโหลดข้อมูลลูกค้า...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-screen font-sans">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Edit size={24} />
              </div>
              แก้ไขข้อมูลลูกค้า
            </h1>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-xl transition-all font-semibold text-sm"
          >
            <Trash2 size={18} />
            ลบลูกค้าคนนี้
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            {/* Section: Basic Info */}
            <div className="grid grid-cols-1 gap-8">
              <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <Info className="text-blue-500 mt-1" size={20} />
                <div>
                  <p className="text-blue-900 font-bold text-sm">
                    ข้อมูลลูกค้าระบบ
                  </p>
                  <p className="text-blue-700/70 text-xs">
                    คุณสามารถแก้ไขชื่อ เบอร์โทร และอีเมลของลูกค้าได้จากหน้านี้
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Input Name */}
                <div className="space-y-2">
                  <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2 ml-1">
                    ชื่อ-นามสกุล
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(e) =>
                        setForm({ ...form, customer_name: e.target.value })
                      }
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                      placeholder="ระบุชื่อลูกค้า"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input Phone */}
                  <div className="space-y-2">
                    <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2 ml-1">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Phone size={20} />
                      </div>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        placeholder="08X-XXX-XXXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Input Email */}
                  <div className="space-y-2">
                    <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2 ml-1">
                      อีเมล
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        placeholder="example@mail.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-8 py-4 text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl transition-all font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </div>
                ) : (
                  <>
                    <Save size={20} />
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-400 text-sm mt-8">
          ID อ้างอิงระบบ: <span className="font-mono text-gray-500">{id}</span>
        </p>
      </div>
    </div>
  );
}
