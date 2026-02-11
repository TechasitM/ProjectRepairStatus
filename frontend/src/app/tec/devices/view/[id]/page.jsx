"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import {
  ArrowLeft,
  Laptop,
  Monitor,
  User,
  Hash,
  HardDrive,
  Edit3,
  ChevronRight,
} from "lucide-react";

export default function DeviceViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await api.get(`/devices/${id}`);
        setDevice(res.data.data || res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

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

  if (!device) {
    return (
      <div className="p-10 text-center text-rose-500 font-bold italic">
        ไม่พบข้อมูลอุปกรณ์
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              รายละเอียดอุปกรณ์
            </h1>
          </div>
        </div>

        <button
          onClick={() => router.push(`/tec/devices/edit/${id}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 border border-yellow-600 text-slate-700 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-all shadow-sm active:scale-95"
        >
          <Edit3 size={16} />
          แก้ไขข้อมูลเครื่อง
        </button>
      </div>

      {/* Main Content */}
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT : Device Information */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-8 relative overflow-hidden">
          {/* Background Icon */}
          <div className="absolute -right-8 -top-8 text-gray-100 pointer-events-none">
            {device.device_type === "desktop" ? (
              <Monitor size={140} />
            ) : (
              <Laptop size={140} />
            )}
          </div>

          {/* Header */}
          <div className="relative space-y-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                device.device_type === "desktop"
                  ? "bg-slate-800 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {device.device_type === "desktop" ? (
                <Monitor size={22} />
              ) : (
                <Laptop size={22} />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {device.brand}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{device.model}</p>
            </div>
          </div>

          {/* Serial */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Hash size={14} className="text-gray-400" />
              <span className="font-mono text-gray-600">
                {device.serial_number || "NO-SERIAL-TAG"}
              </span>
            </div>
          </div>

          {/* Specification */}
          <div className="pt-6 border-t border-gray-100 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Specification
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {device.spec_detail || "No technical specification provided."}
            </p>
          </div>
        </div>

        {/* RIGHT : Customer Information */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              ข้อมูลเจ้าของอุปกรณ์
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              รายละเอียดลูกค้าที่เป็นเจ้าของเครื่อง
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {device.customer?.customer_name || "-"}
                </p>
                <p className="text-xs text-gray-400">
                  {device.customer?.phone || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
