"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Laptop,
  MonitorSmartphone,
  Trash2,
  Edit3,
  Eye,
  Hash,
  Cpu,
  RefreshCw,
} from "lucide-react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/devices");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setDevices(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อข้อมูลคลังอุปกรณ์ได้",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, modelName) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      html: `คุณกำลังจะลบอุปกรณ์ <b>${modelName}</b> <br/>ข้อมูลประวัติการซ่อมของเครื่องนี้จะหายไป`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/devices/${id}`);
        setDevices(devices.filter((d) => d.id !== id));
        Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ",
          text: "ข้อมูลอุปกรณ์ถูกลบออกจากระบบแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire(
          "ผิดพลาด",
          "ไม่สามารถลบข้อมูลได้เนื่องจากมีการใช้งานในระบบ",
          "error",
        );
      }
    }
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customer?.customer_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

    if (loading) {
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
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200 text-white">
              <Laptop size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              อุปกรณ์
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            ระบบคลังจัดการอุปกรณ์และประวัติทางเทคนิคทั้งหมด
          </p>
        </div>
        <Link
          href="/tec/devices/create"
          className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] shadow-xl hover:bg-blue-600 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={18} />
          เพิ่มงานอุปกรณ์
        </Link>
      </div>

      {/* Search & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        <div className="md:col-span-2 relative group h-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="ค้นหา รุ่นอุปกรณ์..."
            className="w-full h-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="h-full">
            
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-2 flex items-center justify-between shadow-sm min-h-[74px]">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Jobs</p>
            <p className="text-2xl font-black text-blue-600 leading-none">{filteredDevices.length}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <RefreshCw size={22} />
          </div>
        </div>
      </div>
      
      {/* Device Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em]">
                <th className="px-8 py-6 border-b border-gray-100">
                  Type & Brand
                </th>
                <th className="px-8 py-6 border-b border-gray-100">
                  Model Details
                </th>
                <th className="px-8 py-6 border-b border-gray-100">
                  Serial Identity
                </th>
                <th className="px-8 py-6 border-b border-gray-100">
                  Ownership
                </th>
                <th className="px-8 py-6 border-b border-gray-100 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <tr key={device.id} className="group hover:bg-gray-50/50">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 border border-gray-100">
                          {device.device_type === "laptop" ? (
                            <Laptop size={22} />
                          ) : (
                            <MonitorSmartphone size={22} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight uppercase tracking-tight">
                            {device.brand}
                          </p>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold uppercase">
                            {device.device_type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-700">
                        {device.model}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 italic">
                        Added:{" "}
                        {new Date(device.created_at).toLocaleDateString(
                          "th-TH",
                        )}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-gray-100 rounded-xl font-mono text-[11px] font-bold shadow-sm">
                        <Hash size={10} className="text-blue-400" />
                        {device.serial_number || "NO-SERIAL"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Link
                        href={`/admin/customers/${device.customer?.id}`}
                        className="flex items-center gap-3 group/owner"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px]">
                          {device.customer?.customer_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700 group-hover/owner:text-blue-600">
                            {device.customer?.customer_name || "Unregistered"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {device.customer?.phone || "N/A"}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/tec/devices/view/${device.id}`}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/tec/devices/edit/${device.id}`}
                          className="p-2.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(device.id, device.model)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                        <Search size={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-black uppercase text-sm tracking-widest">
                          No results found
                        </p>
                        <p className="text-gray-400 text-xs font-medium">
                          ไม่พบข้อมูลที่ตรงกับ "{searchTerm}"
                          กรุณาลองตรวจสอบคำค้นหาอีกครั้ง
                        </p>
                      </div>
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
