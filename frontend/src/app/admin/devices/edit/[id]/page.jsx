"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import { ArrowLeft, Save, Monitor, Laptop, Cpu } from "lucide-react";

export default function DeviceEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    device_type: "laptop",
    brand: "",
    model: "",
    serial_number: "",
    details: "",
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
          details: data.details,
        });
      } catch (err) {
        Swal.fire("ผิดพลาด", "ไม่พบข้อมูลอุปกรณ์นี้", "error");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/devices/${id}`, formData);
      await Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/tec/devices");
    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกการแก้ไขได้", "error");
    } finally {
      setLoading(false);
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
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            Edit Device Info
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Configuration Panel
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-50 shadow-xl shadow-gray-200/50 space-y-10"
      >
        {/* Device Type Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
            Device Category
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "laptop", label: "Notebook", icon: <Laptop size={24} /> },
              {
                id: "desktop",
                label: "PC Desktop",
                icon: <Monitor size={24} />,
              },
              { id: "component", label: "Hardware", icon: <Cpu size={24} /> },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, device_type: type.id })
                }
                className={`py-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all duration-300 ${
                  formData.device_type === type.id
                    ? "border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100 scale-105"
                    : "border-gray-50 bg-gray-50/50 text-gray-300 hover:border-gray-200 hover:bg-white"
                }`}
              >
                <div
                  className={`transition-transform duration-500 ${formData.device_type === type.id ? "scale-110" : ""}`}
                >
                  {type.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 transition-colors">
              Brand Identity
            </label>
            <input
              required
              placeholder="e.g., Apple, Dell, Asus"
              className="w-full p-5 bg-gray-50/80 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-700"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
          </div>

          <div className="space-y-3 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 transition-colors">
              Model Name
            </label>
            <input
              required
              placeholder="e.g., MacBook Pro M3"
              className="w-full p-5 bg-gray-50/80 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-700"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2 space-y-3 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 transition-colors">
              Serial Identity
            </label>
            <div className="relative">
              <input
                placeholder="Unique Serial Number"
                className="w-full p-5 bg-gray-50/80 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-mono font-bold text-gray-600"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                <Cpu
                  size={20}
                  className="group-focus-within:text-blue-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 transition-colors">
              Technical Details
            </label>
            <textarea
              rows="4"
              placeholder="Specify RAM, CPU, Storage or other issues..."
              className="w-full p-6 bg-gray-50/80 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium leading-relaxed"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 hover:bg-blue-600 hover:-translate-y-1.5 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
          >
            <Save
              size={20}
              className={loading ? "animate-spin" : "animate-pulse"}
            />
            {loading ? "SAVING CHANGES..." : "CONFIRM UPDATE"}
          </button>
        </div>
      </form>
    </div>
  );
}
