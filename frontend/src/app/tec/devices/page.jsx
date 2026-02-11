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
} from "lucide-react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ===============================
      Fetch Devices
  ================================ */
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

  /* ===============================
      Delete Device
  ================================ */
  const handleDelete = async (id, modelName) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      html: `คุณกำลังจะลบอุปกรณ์ <b>${modelName}</b><br/>ข้อมูลประวัติการซ่อมจะหายไป`,
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

  /* ===============================
      Filter Devices
  ================================ */
  const filteredDevices = devices.filter((d) => {
    const term = searchTerm.toLowerCase();

    const matchSearch =
      d.serial_number?.toLowerCase().includes(term) ||
      d.model?.toLowerCase().includes(term) ||
      d.brand?.toLowerCase().includes(term) ||
      d.customer?.customer_name?.toLowerCase().includes(term);

    const matchType =
      deviceTypeFilter === "all" ||
      d.device_type?.toLowerCase() === deviceTypeFilter;

    return matchSearch && matchType;
  });

  /* ===============================
      Loading
  ================================ */
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 border border-gray-100">
              <Laptop size={28} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                อุปกรณ์
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                ระบบคลังจัดการอุปกรณ์และประวัติทางเทคนิคทั้งหมด
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/tec/devices/create"
          className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] shadow-xl hover:bg-blue-600 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={18} />
            เพิ่มงานอุปกรณ์
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        <div className="md:col-span-2 relative group h-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="ค้นหา Serial, รุ่น, แบรนด์, ลูกค้า"
            className="w-full h-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-full">
          <select
            className="w-full h-full px-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold text-gray-600 appearance-none cursor-pointer"
            value={deviceTypeFilter}
            onChange={(e) => setDeviceTypeFilter(e.target.value)}
          >
            <option value="all">ทุกประเภท</option>
            <option value="notebook">Notebook</option>
            <option value="laptop">Laptop</option>
            <option value="pc">PC</option>
          </select>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-2 flex items-center justify-between shadow-sm min-h-[74px]">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Total Jobs
            </p>
            <p className="text-2xl font-black text-blue-600 leading-none">
              {filteredDevices.length}
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Hash size={22} />
          </div>
        </div>
      </div>

      {/* Device Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="px-6 py-4 border-b">ข้อมูลพื้นฐาน</th>
                <th className="px-6 py-4 border-b">รายละเอียดรุ่น</th>
                <th className="px-6 py-4 border-b">หมายเลขซีเรียล</th>
                <th className="px-6 py-4 border-b">เจ้าของอุปกรณ์</th>
                <th className="px-6 py-4 border-b text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Type & Brand */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                          {device.device_type === "laptop" ? (
                            <Laptop size={18} />
                          ) : (
                            <MonitorSmartphone size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight uppercase">
                            {device.brand}
                          </p>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            {device.device_type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Model Details */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {device.model}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        เพิ่มเมื่อ{" "}
                        {new Date(device.created_at).toLocaleDateString(
                          "th-TH",
                        )}
                      </p>
                    </td>

                    {/* Serial Number */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg font-mono text-[11px] font-bold">
                        <Hash size={10} className="text-gray-400" />
                        {device.serial_number || "N/A"}
                      </div>
                    </td>

                    {/* Ownership */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${device.customer?.id}`}
                        className="inline-flex items-center gap-2 group/owner"
                      >
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-[10px]">
                          {device.customer?.customer_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700 group-hover/owner:text-blue-600 transition-colors leading-tight">
                            {device.customer?.customer_name || "Unregistered"}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {device.customer?.phone || "ไม่มีข้อมูลติดต่อ"}
                          </span>
                        </div>
                      </Link>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Link
                          href={`/tec/devices/view/${device.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/tec/devices/edit/${device.id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(device.id, device.model)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search
                        size={40}
                        strokeWidth={1.5}
                        className="opacity-20"
                      />
                      <p className="text-sm font-medium italic">
                        ไม่พบข้อมูลอุปกรณ์ที่คุณกำลังค้นหา
                      </p>
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
