"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import { ArrowLeft, Save, ChevronRight, Hash } from "lucide-react";

export default function DeviceEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    device_type: "laptop",
    brand: "",
    model: "",
    serial_number: "",
    spec_detail: "",
  });

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await api.get(`/devices/${id}`);
        const data = res.data.data || res.data;
        setFormData({
          device_type: data.device_type,
          brand: data.brand,
          model: data.model,
          serial_number: data.serial_number,
          spec_detail: data.spec_detail || "",
        });
      } catch (err) {
        Swal.fire("ผิดพลาด", "ไม่พบข้อมูลอุปกรณ์นี้", "error");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.put(`/devices/${id}`, formData);
      await Swal.fire({
        icon: "success",
        title: "บันทึกการแก้ไขเรียบร้อย",
        timer: 1500,
        showConfirmButton: false,
        background: "#fff",
        customClass: { title: "text-lg font-bold text-slate-800" },
      });
      router.push(`/tec/devices/view/${id}`);
    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกการแก้ไขได้", "error");
    } finally {
      setIsSaving(false);
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
    <div className="p-4 mx-auto min-h-screen font-sans">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            แก้ไขข้อมูลอุปกรณ์
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          {/* Section 1: Category */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                ประเภทอุปกรณ์ (Device Type)
              </label>
            </div>

            <input
              required
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xlfocus:bg-white focus:border-blue-500 focus:ring-4focus:ring-blue-500/5 outline-none transition-all font-semibold text-slate-700"
              value={formData.device_type}
              onChange={(e) =>
                setFormData({ ...formData, device_type: e.target.value })
              }
            />
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                ยี่ห้อ (Brand)
              </label>
              <input
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                รุ่นอุปกรณ์ (Model)
              </label>
              <input
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                หมายเลขซีเรียล (Serial Number)
              </label>
              <div className="relative">
                <input
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-mono font-bold text-blue-600"
                  value={formData.serial_number}
                  onChange={(e) =>
                    setFormData({ ...formData, serial_number: e.target.value })
                  }
                />
                <Hash
                  size={16}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                รายละเอียดทางเทคนิค
              </label>
              <textarea
                rows="4"
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium leading-relaxed text-slate-600"
                value={formData.spec_detail}
                onChange={(e) =>
                  setFormData({ ...formData, spec_detail: e.target.value })
                }
              />
            </div>
          </div>

          {/* Action Buttons*/}
          <div className="pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
