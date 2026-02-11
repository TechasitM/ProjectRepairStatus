"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Hash,
} from "lucide-react";

export default function CreateDevicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    device_type: "", 
    brand: "",
    model: "",
    serial_number: "",
    spec_detail: "",
  });

  // โหลดรายชื่อลูกค้า
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch customers");
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id) {
      return Swal.fire("แจ้งเตือน", "กรุณาเลือกเจ้าของอุปกรณ์", "warning");
    }

    try {
      setLoading(true);
      await api.post("/devices", formData);
      await Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: "เพิ่มอุปกรณ์คอมพิวเตอร์เข้าระบบแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/tec/devices");
    } catch (err) {
      Swal.fire(
        "ผิดพลาด",
        err.response?.data?.message || "ไม่สามารถบันทึกได้",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers
    .filter(
      (c) =>
        c.customer_name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        c.phone.includes(searchCustomer),
    )
    .slice(0, 5);

  return (
    <div className="p-6 mx-auto min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            เพิ่มอุปกรณ์
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            เพิ่มอุปกรณ์คอมพิวเตอร์เข้าคลังประวัติ
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-8">
            {/* Section Title */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                ข้อมูลอุปกรณ์
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                กรอกข้อมูลพื้นฐานของอุปกรณ์คอมพิวเตอร์
              </p>
            </div>

            {/* Device Type */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ประเภทอุปกรณ์
              </label>
              <input
              required
              placeholder="ระบุประเภทอุปกรณ์"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              value={formData.device_type}
              onChange={(e) =>
                setFormData({ ...formData, device_type: e.target.value })
              }
            />
            </div>

            {/* Brand / Model */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ยี่ห้อ
                </label>
                <input
                  required
                  placeholder="ระบุชื่อยี่ห้อ"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  รุ่น
                </label>
                <input
                  required
                  placeholder="ระบุชื่อรุ่น"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Serial */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Hash size={14} /> Serial Number
              </label>
              <input
                placeholder="ระบุตัวเลข Serial Number"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
              />
            </div>

            {/* Spec */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Specification
              </label>
              <textarea
                rows="3"
                placeholder="ระบุตัวเลข Serial Number"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                value={formData.spec_detail}
                onChange={(e) =>
                  setFormData({ ...formData, spec_detail: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                เจ้าของอุปกรณ์
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                เลือกเจ้าของจากรายชื่อในระบบ
              </p>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="ค้นหาชื่อลูกค้า..."
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />

            {/* List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, customer_id: customer.id })
                  }
                  className={`w-full px-4 py-3 rounded-xl border text-left transition-all text-sm ${
                    formData.customer_id === customer.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{customer.customer_name}</p>
                  <p className="text-xs text-gray-400">{customer.phone}</p>
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:bg-gray-200"
            >
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
