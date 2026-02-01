"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";

export default function tecRepairsPage() {
  const [repairs, setRepairs] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = () => {
    setLoading(true);
    api.get("/repairs")
      .then(res => {
        setRepairs(res.data);
        setFilteredRepairs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลได้", "error");
        setLoading(false);
      });
  };

  // Logic การ Filter
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredRepairs(repairs);
    } else {
      const filtered = repairs.filter(r => r.status?.id.toString() === statusFilter);
      setFilteredRepairs(filtered);
    }
  }, [statusFilter, repairs]);

  if (loading) return <div className="p-10 text-center font-medium text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการรายการงานซ่อม</h1>
          <p className="text-sm text-gray-500">ทั้งหมด {filteredRepairs.length} รายการ</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Dropdown กรองสถานะ */}
          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="1">รอดำเนินการ</option>
            <option value="2">กำลังซ่อม</option>
            <option value="4">เสร็จสิ้น</option>
          </select>

          <Link href="/tec/repairs/create" className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-all active:scale-95 font-medium whitespace-nowrap">
            + เพิ่มงานซ่อมใหม่
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-xl bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b">วันที่รับ / รหัส</th>
              <th className="p-4 border-b">ลูกค้า</th>
              <th className="p-4 border-b">อุปกรณ์ / อาการ</th>
              <th className="p-4 border-b">สถานะ</th>
              <th className="p-4 border-b text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRepairs.length > 0 ? filteredRepairs.map(r => (
              <tr key={r.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="p-4">
                  <div className="text-xs text-gray-400 mb-1">{new Date(r.receive_date).toLocaleDateString('th-TH')}</div>
                  <div className="font-bold text-blue-600">{r.repair_code}</div>
                </td>
                
                <td className="p-4">
                  <div className="font-medium text-gray-800">{r.customer?.customer_name}</div>
                  <div className="text-xs text-gray-500">{r.customer?.phone}</div>
                </td>
                
                <td className="p-4">
                  <div className="font-semibold text-gray-800 flex item-center gap-2">
                    {r?.devices?.map((device)=>(
                      <span className="bg-amber-100 text-amber-700 border border-amber-200">{device.brand} {device.model}</span>
                    ))}
                  </div>
                  <div className="text-xs text-red-500 mt-1 truncate max-w-[200px]">
                    ⚠️ {r.problem_description}
                  </div>
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                    r.status?.id === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                    r.status?.id === 4 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    'bg-sky-100 text-sky-700 border border-sky-200'
                  }`}>
                    {r.status?.status_name || 'ไม่มีสถานะ'}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Link 
                    href={`/tec/repairs/${r.id}`} 
                    className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                  >
                    ดูรายละเอียด
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-400 italic font-light">
                  ไม่พบข้อมูลที่ตรงตามเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}