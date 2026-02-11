"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import api from "@/services/api";
import {
  ArrowLeft,
} from "lucide-react";

export default function CreateRepairPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [customerQuery, setCustomerQuery] = useState("");
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  const [formData, setFormData] = useState({
    repair_code: `RP-${Date.now()}`,
    customer_id: "",
    device_id: [],
    user_id: "",
    status_id: "",
    problem_description: "",
    estimate_price: "",
    receive_date: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16),
  });

  // 1. ดึงข้อมูลเริ่มต้น (ใช้ api.get แทน fetch)
  useEffect(() => {
    const initData = async () => {
      try {
        const [custRes, statRes, userRes] = await Promise.all([
          api.get("/customers"),
          api.get("/statuses"),
          api.get("/user-profile"),
        ]);

        setCustomers(custRes.data.data || custRes.data);
        setStatuses(statRes.data.data || statRes.data);
        const user = userRes.data.data || userRes.data;
        setCurrentUser(user);
        setFormData((prev) => ({ ...prev, user_id: user?.id || "" }));
      } catch (err) {
        console.error("Initial load failed", err);
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลพื้นฐานได้", "error");
      } finally {
        setLoadingInit(false);
      }
    };
    initData();
  }, []);

  // 2. โหลดอุปกรณ์ตาม ID ลูกค้า
  const loadDevices = async (cid) => {
    setLoadingDevices(true);
    try {
      const res = await api.get(`/dropdown-customer-device/${cid}`);
      setFilteredDevices(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load devices", err);
    } finally {
      setLoadingDevices(false);
    }
  };

  // 3. บันทึกข้อมูลใบสั่งซ่อม
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id)
      return Swal.fire("ข้อมูลไม่ครบ", "กรุณาเลือกชื่อลูกค้า", "warning");
    if (formData.device_id.length === 0)
      return Swal.fire(
        "ลืมเลือกอุปกรณ์",
        "กรุณาเลือกอุปกรณ์อย่างน้อย 1 ชิ้น",
        "warning",
      );
    if (!formData.status_id)
      return Swal.fire(
        "ระบุสถานะ",
        "กรุณาเลือกสถานะเริ่มต้นงานซ่อม",
        "warning",
      );

    setLoading(true);
    try {
      const res = await api.post("/repairs", formData);
      if (res.status === 200 || res.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สร้างใบสั่งซ่อมเรียบร้อย",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/tec/repairs");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้";
      Swal.fire("ผิดพลาด", errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Logic (Spinner & Full Layout) ---

  if (loadingInit) {
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
    <div className="max-w-10xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            สร้างใบรับซ่อมใหม่
          </h1>
          <p className="text-xs text-gray-400">
            ระบุข้อมูลลูกค้าและอาการเสียเพื่อเปิดงานซ่อม
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
            {/* Customer Search */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ลูกค้า
              </label>

              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทรศัพท์..."
                value={customerQuery}
                onChange={(e) => {
                  setCustomerQuery(e.target.value);
                  setIsCustomerOpen(true);
                }}
                onFocus={() => setIsCustomerOpen(true)}
              />

              {isCustomerOpen && customerQuery && (
                <div className="border border-gray-100 rounded-xl bg-white max-h-56 overflow-auto">
                  {customers
                    .filter(
                      (c) =>
                        c.customer_name
                          .toLowerCase()
                          .includes(customerQuery.toLowerCase()) ||
                        c.phone.includes(customerQuery),
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setFormData((p) => ({
                            ...p,
                            customer_id: c.id,
                            device_id: [],
                          }));
                          setCustomerQuery(c.customer_name);
                          setIsCustomerOpen(false);
                          loadDevices(c.id);
                        }}
                      >
                        <div className="font-medium text-slate-800">
                          {c.customer_name}
                        </div>
                        <div className="text-xs text-gray-400">{c.phone}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Device Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                อุปกรณ์ที่ส่งซ่อม ({formData.device_id.length})
              </label>

              <div className="grid md:grid-cols-2 gap-3">
                {loadingDevices ? (
                  <div className="text-xs text-gray-400 py-4">
                    กำลังโหลดอุปกรณ์...
                  </div>
                ) : (
                  filteredDevices.map((device) => (
                    <label
                      key={device.id}
                      className={`p-4 rounded-xl border text-sm cursor-pointer transition ${
                        formData.device_id.includes(device.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.device_id.includes(device.id)}
                        onChange={(e) => {
                          const ids = e.target.checked
                            ? [...formData.device_id, device.id]
                            : formData.device_id.filter(
                                (id) => id !== device.id,
                              );
                          setFormData((p) => ({ ...p, device_id: ids }));
                        }}
                      />
                      <div className="font-medium text-slate-800">
                        {device.brand} {device.model}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        SN: {device.serial_number}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Minimal */}
        <div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
            <h3 className="text-sm font-semibold text-slate-900">
              รายละเอียดงานซ่อม
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Repair Code
                </label>
                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-blue-600">
                  {formData.repair_code}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Receive Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.receive_date}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      receive_date: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Estimate Price
                </label>
                <input
                  type="number"
                  value={formData.estimate_price}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      estimate_price: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Initial Status
                </label>
                <select
                  value={formData.status_id}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      status_id: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">เลือกสถานะ...</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.status_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Description
                </label>
                <textarea
                  rows={4}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      problem_description: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
                  loading
                    ? "bg-gray-200 text-gray-400"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "กำลังบันทึก..." : "บันทึกใบรับซ่อม"}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
              Created by: {currentUser?.name || "System User"}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
