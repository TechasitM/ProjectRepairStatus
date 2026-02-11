"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Wrench,
  Clock,
  Edit3,
  Monitor,
  Laptop,
  AlertCircle,
  Eye,
  Cpu,
} from "lucide-react";

export default function TecRepairsPage() {
  const [repairs, setRepairs] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/repairs");
      // ตรวจสอบโครงสร้างข้อมูลที่ส่งมาจาก Laravel
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setRepairs(data);
      setFilteredRepairs(data);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลงานซ่อมได้", "error");
    } finally {
      setLoading(false);
    }
  };

  // Logic การ Filter และ Search
  useEffect(() => {
    let result = repairs;

    // กรองตามสถานะ
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status?.id.toString() === statusFilter);
    }

    // กรองตามคำค้นหา (รหัสซ่อม, ชื่อลูกค้า, รุ่นอุปกรณ์)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.repair_code?.toLowerCase().includes(term) ||
          r.customer?.customer_name?.toLowerCase().includes(term) ||
          r.devices?.some((d) => d.model?.toLowerCase().includes(term)),
      );
    }

    setFilteredRepairs(result);
  }, [statusFilter, searchTerm, repairs]);

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
    <div className="p-6 mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 border border-gray-100">
              <Wrench size={28} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                จัดการรายการงานซ่อม
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                ติดตามสถานะและประวัติการซ่อมคอมพิวเตอร์
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/tec/repairs/create"
          className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] shadow-xl hover:bg-blue-600 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={18} />
          เพิ่มงานซ่อมใหม่
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        <div className="md:col-span-2 relative group h-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="ค้นหา รหัสซ่อม, ชื่อลูกค้า หรือรุ่นอุปกรณ์..."
            className="w-full h-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="h-full">
          <select
            className="w-full h-full px-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold text-gray-600 appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ทุกสถานะ (All Status)</option>
            <option value="1">⏳ รอดำเนินการ</option>
            <option value="2">🛠️ กำลังซ่อม</option>
            <option value="4">✅ เสร็จสิ้น</option>
          </select>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-2 flex items-center justify-between shadow-sm min-h-[74px]">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Total Jobs
            </p>
            <p className="text-2xl font-black text-blue-600 leading-none">
              {filteredRepairs.length}
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="px-6 py-5 border-b border-gray-50">
                  วันที่ / รหัส
                </th>
                <th className="px-6 py-5 border-b border-gray-50">ลูกค้า</th>
                <th className="px-6 py-5 border-b border-gray-50">
                  อุปกรณ์และอาการ
                </th>
                <th className="px-6 py-5 border-b border-gray-50">สถานะ</th>
                <th className="px-6 py-5 border-b border-gray-50 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRepairs.length > 0 ? (
                filteredRepairs.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-blue-50/20 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">
                        {new Date(r.receive_date).toLocaleDateString("th-TH")}
                      </p>
                      <p className="font-black text-blue-600 font-mono tracking-tighter">
                        {r.repair_code}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-800 leading-tight">
                        {r.customer?.customer_name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                        📞 {r.customer?.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {r?.devices?.map((device) => (
                          <span
                            key={device.id}
                            className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-100 font-bold flex items-center gap-1"
                          >
                            {device.device_type === "desktop" ? (
                              <Monitor size={10} />
                            ) : (
                              <Laptop size={10} />
                            )}
                            {device.brand} {device.model}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 leading-relaxed">
                        <AlertCircle size={12} /> {r.problem_description}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-center md:text-left">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                          r.status?.id === 1
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : r.status?.id === 4
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {r.status?.status_name || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center items-center gap-1">
                        <Link
                          href={`/tec/repairs/update/${r.id}`}
                          title="อัปเดตงานซ่อม"
                          className="p-2.5 text-yellow-600 hover:bg-blue-50 rounded-xl transition-all font-bold text-xs flex items-center gap-1"
                        >
                          <Edit3 size={16} /> อัปเดต
                        </Link>
                        <Link
                          href={`/tec/repairs/view/${r.id}`}
                          title="ดูรายละเอียด"
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold text-xs flex items-center gap-1"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Search size={40} />
                      <p className="font-bold">ไม่พบข้อมูลงานซ่อมในระบบ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
