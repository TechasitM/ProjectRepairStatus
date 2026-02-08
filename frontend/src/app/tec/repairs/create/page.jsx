"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import api from "@/services/api";
import {
  User,
  Search,
  FileText,
  CheckCircle,
  ChevronDown,
  ArrowLeft,
  Cpu,
  Link,
  Plus,
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
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4 bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <Cpu
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"
            size={24}
          />
        </div>
        <p className="font-bold text-gray-500 animate-pulse tracking-wide uppercase text-xs">
          Initializing...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ... ส่วนหัว (Header) ... */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white border rounded-2xl hover:text-blue-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            สร้างใบรับซ่อมใหม่
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            ระบุชื่อลูกค้าและอาการเสียเพื่อเปิดงานซ่อม
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* คอลัมน์ซ้าย: ลูกค้าและอุปกรณ์ */}

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-6">
            {/* Search Input */}

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> ข้อมูลลูกค้าและอุปกรณ์
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all font-bold"
                  placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทรศัพท์..."
                  value={customerQuery}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setIsCustomerOpen(true);
                  }}
                  onFocus={() => setIsCustomerOpen(true)}
                />
                {/* Dropdown List */}
                {isCustomerOpen && customerQuery && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-auto">
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
                          className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 flex justify-between items-center"
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
                          <div>
                            <p className="font-black text-gray-800">
                              {c.customer_name}
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                              {c.phone}
                            </p>
                          </div>
                          <ChevronDown size={14} className="text-gray-300" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Device Selection Grid */}
            <div
              className={`p-6 rounded-[2rem] transition-all ${formData.customer_id ? "bg-blue-50 border border-blue-100" : "bg-gray-50 opacity-50"}`}
            >
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-blue-800">
                เลือกอุปกรณ์ที่ส่งซ่อม ({formData.device_id.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {loadingDevices ? (
                  <div className="col-span-2 py-6 text-center text-xs text-blue-400 font-bold">
                    กำลังโหลดอุปกรณ์...
                  </div>
                ) : (
                  filteredDevices.map((device) => (
                    <label
                      key={device.id}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer bg-white ${formData.device_id.includes(device.id) ? "border-blue-500 shadow-md ring-2 ring-blue-100" : "border-transparent hover:border-blue-200"}`}
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
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
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                          {device.device_type}
                        </p>
                        <p className="text-sm font-black text-gray-800 truncate">
                          {device.brand} {device.model}
                        </p>
                        <p className="text-[10px] font-mono font-bold text-blue-500">
                          S/N: {device.serial_number}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* คอลัมน์ขวา: รายละเอียดใบสั่งซ่อม (Dark Theme) */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Repair Order Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Repair Code
                  </label>
                  <div className="w-full p-3 bg-gray-800 rounded-xl font-mono text-xs text-blue-400 font-black">
                    {formData.repair_code}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
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
                    className="w-full p-3 bg-gray-800 border-none text-white rounded-xl text-xs font-bold outline-none ring-1 ring-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Estimate Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimate_price}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      estimate_price: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-gray-800 text-white rounded-2xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Initial Status
                </label>
                <select
                  value={formData.status_id}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, status_id: e.target.value }))
                  }
                  className="w-full p-4 bg-gray-800 border-none text-white rounded-2xl text-sm font-bold outline-none ring-1 ring-gray-700"
                >
                  <option value="">เลือกสถานะเริ่มต้น...</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.status_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="แจ้งอาการเสียโดยละเอียด..."
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      problem_description: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-gray-800 border-none text-white rounded-2xl text-sm font-medium outline-none ring-1 ring-gray-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl text-white font-black text-sm transition-all flex items-center justify-center gap-2 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-50 active:scale-95 shadow-2xl shadow-blue-900/40"}`}
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle size={18} /> บันทึกใบรับซ่อม
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-600/30">
                <User size={14} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1">
                  Created By
                </p>
                <p className="text-xs font-bold text-blue-400">
                  {currentUser?.name || "System User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
