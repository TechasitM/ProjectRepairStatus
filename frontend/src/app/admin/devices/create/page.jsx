"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function CreateDevicePage() {
  const router = useRouter();

  /* ---------------- state ---------------- */
  const [customers, setCustomers] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    device_type: "",
    brand: "",
    model: "",
    serial_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const customerRef = useRef(null);

  /* ---------------- load customers ---------------- */
  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(() => setError("ไม่สามารถโหลดข้อมูลลูกค้าได้"));
  }, []);

  /* ---------------- filter customers ---------------- */
  const filteredCustomerList = useMemo(() => {
    const q = (customerQuery || "").trim().toLowerCase();
    if (!q) return customers.slice(0, 8);

    return customers
      .filter((c) => {
        const text = `${c.customer_name || ""} ${c.phone || ""}`.toLowerCase();
        return text.includes(q);
      })
      .slice(0, 12);
  }, [customerQuery, customers]);

  /* ---------------- click outside ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerRef.current && !customerRef.current.contains(e.target)) {
        setIsCustomerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.customer_id) {
      setError("กรุณาเลือกลูกค้า");
      return;
    }

    try {
      setLoading(true);
      await api.post("/devices", formData);
      router.push("/device");
    } catch {
      setError("ไม่สามารถบันทึกข้อมูลอุปกรณ์ได้");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ➕ เพิ่มอุปกรณ์ลูกค้า
        </h1>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ---------------- Customer Search ---------------- */}
          <div ref={customerRef} className="relative">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              ลูกค้า (ค้นหาได้)
            </label>

            <input
              value={customerQuery}
              onChange={(e) => {
                setCustomerQuery(e.target.value);
                setIsCustomerOpen(true);
                setFormData(prev => ({ ...prev, customer_id: "" }));
              }}
              onFocus={() => setIsCustomerOpen(true)}
              placeholder="พิมพ์ชื่อหรือเบอร์ เช่น นิด / 089..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            />

            {isCustomerOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredCustomerList.length > 0 ? (
                  filteredCustomerList.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          customer_id: c.id,
                        }));
                        setCustomerQuery(
                          `${c.customer_name} (${c.phone})`
                        );
                        setIsCustomerOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {c.customer_name}
                      </p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-400">
                    ไม่พบลูกค้า
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------- Device info ---------------- */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              ประเภทอุปกรณ์
            </label>
            <input
              name="device_type"
              value={formData.device_type}
              onChange={(e) =>
                setFormData({ ...formData, device_type: e.target.value })
              }
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              placeholder="เช่น Notebook, PC"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                ยี่ห้อ
              </label>
              <input
                name="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                รุ่น
              </label>
              <input
                name="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Serial Number
            </label>
            <input
              name="serial_number"
              value={formData.serial_number}
              onChange={(e) =>
                setFormData({ ...formData, serial_number: e.target.value })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          {/* ---------------- buttons ---------------- */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border text-gray-600"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
