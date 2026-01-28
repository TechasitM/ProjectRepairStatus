"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await api.get("/devices");
      // ดึงข้อมูล devices พร้อมดึงข้อมูล customer มาแสดงชื่อเจ้าของ
      setDevices(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลอุปกรณ์ได้", "error");
    } finally {
      setLoading(false);
    }
  };

  // กรองข้อมูล: ค้นหาจาก Serial Number, รุ่น หรือชื่อเจ้าของ
  const filteredDevices = devices.filter(d => 
    d.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customer?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500 font-medium">กำลังค้นหาอุปกรณ์...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">คลังอุปกรณ์ (Devices)</h1>
          <p className="text-sm text-gray-500">จัดการข้อมูลอุปกรณ์และตรวจสอบประวัติรายเครื่อง</p>
        </div>
        
        <Link href="/admin/devices/create" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-emerald-700 transition-all active:scale-95 font-medium">
          + ลงทะเบียนอุปกรณ์ใหม่
        </Link>
      </div>

      {/* Search Bar & Filter Info */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="ค้นหา Serial Number, รุ่น หรือชื่อเจ้าของ..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-400 font-medium">
          แสดงทั้งหมด {filteredDevices.length} รายการ
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-4 border-b">ประเภท/แบรนด์</th>
                <th className="p-4 border-b">รุ่น (Model)</th>
                <th className="p-4 border-b">Serial Number</th>
                <th className="p-4 border-b">เจ้าของเครื่อง</th>
                <th className="p-4 border-b text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDevices.length > 0 ? filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-emerald-50/10 transition-colors group">
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 mr-2 uppercase">
                      {device.device_type}
                    </span>
                    <span className="font-semibold text-gray-700">{device.brand}</span>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-800">{device.model}</div>
                  </td>

                  <td className="p-4 font-mono text-sm text-emerald-600 font-bold">
                    {device.serial_number || 'N/A'}
                  </td>

                  <td className="p-4">
                    <div className="text-sm text-gray-700 font-medium">{device.customer?.customer_name}</div>
                    <div className="text-[10px] text-gray-400">{device.customer?.phone}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <Link 
                        href={`/admin/devices/${device.id}`} 
                        className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all"
                      >
                        ประวัติซ่อม
                      </Link>
                      <button 
                        onClick={() => {/* Logic แก้ไข */}}
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400 italic font-light">
                    ไม่พบข้อมูลอุปกรณ์ในระบบ
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