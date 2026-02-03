"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit,
  PlusCircle,
  Laptop,
  Smartphone,
  ChevronRight,
  Info,
  History,
} from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCustomerDetail();
  }, [id]);

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: "ไม่พบข้อมูลลูกค้าในระบบ",
        confirmButtonColor: "#3B82F6",
      });
      router.push("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            กำลังโหลดโปรไฟล์ลูกค้า...
          </p>
        </div>
      </div>
    );

  if (!customer) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายละเอียดลูกค้า</h1>
          <p className="text-sm text-gray-500">
            จัดการข้อมูลและประวัติการรับบริการ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Customer Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-50 rounded-full opacity-50" />

            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-3xl flex items-center justify-center text-3xl font-bold mb-4 mx-auto shadow-blue-200 shadow-lg uppercase transform rotate-3">
                {customer.customer_name?.charAt(0)}
              </div>

              <h2 className="text-xl font-bold text-center text-gray-800 mt-6">
                {customer.customer_name}
              </h2>
              <p className="text-center text-gray-400 text-xs font-mono mb-8">
                CUSTOMER ID: #{customer.id}
              </p>

              <div className="space-y-5 border-t border-gray-50 pt-6">
                <div className="group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <div className="flex items-center gap-3 text-gray-700 font-semibold">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Phone size={16} />
                    </div>
                    {customer.phone || "??"}
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    อีเมล
                  </label>
                  <div className="flex items-center gap-3 text-gray-700 font-medium overflow-hidden">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail size={16} />
                    </div>
                    <span className="truncate text-sm">
                      {customer.email || "ไม่มีข้อมูล"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 opacity-10 group-hover:scale-110 transition-transform">
              <PlusCircle size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold mb-2 text-lg">เปิดงานซ่อมใหม่</h3>
              <p className="text-blue-100/60 text-xs mb-6 leading-relaxed">
                สร้างใบรับซ่อมสำหรับอุปกรณ์ใหม่ <br />
                หรืออุปกรณ์เดิมของลูกค้ารายนี้
              </p>
              <Link
                href={`/tec/repairs/create?customer_id=${customer.id}`}
                className="inline-flex items-center justify-center gap-2 w-full bg-white text-blue-900 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-black/20"
              >
                <PlusCircle size={18} /> สร้างใบรับซ่อม
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Devices Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Smartphone size={20} />
                </div>
                <h3 className="font-bold text-gray-800">อุปกรณ์ในครอบครอง</h3>
              </div>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full">
                {customer.devices?.length || 0} เครื่อง
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {customer.devices && customer.devices.length > 0 ? (
                customer.devices.map((device) => (
                  <div
                    key={device.id}
                    className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-blue-50/20 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Laptop size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {device.brand} {device.model}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                            S/N
                          </span>
                          <span className="text-xs font-mono text-gray-500">
                            {device.serial_number || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Link
                        href={`/tec/devices/view/${device.id}`}
                        className="flex-1 sm:flex-none text-center px-4 py-2 text-sm text-gray-500 hover:text-blue-600 font-bold border border-gray-100 hover:border-blue-100 rounded-lg transition-all"
                      >
                        รายละเอียด
                      </Link>
                      <Link
                        href={`/tec/repairs/create?device_id=${device.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="ซ่อมเครื่องนี้"
                      >
                        <History size={18} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={32} />
                  </div>
                  <p className="text-gray-500 font-medium">
                    ยังไม่มีข้อมูลอุปกรณ์
                  </p>
                  <p className="text-xs text-gray-400 mt-1 mb-6">
                    เริ่มบันทึกข้อมูลอุปกรณ์เพื่อใช้ในงานซ่อม
                  </p>
                  <Link
                    href={`/admin/devices/create?customer_id=${customer.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                  >
                    <PlusCircle size={16} /> เพิ่มอุปกรณ์ใหม่ตอนนี้
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* 3. Repair History Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <History size={20} />
                </div>
                <h3 className="font-bold text-gray-800">
                  ประวัติการซ่อมทั้งหมด
                </h3>
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full">
                {customer.repair_orders?.length || 0} รายการ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-[11px] uppercase text-gray-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">วันที่รับงาน</th>
                    <th className="px-6 py-4">รหัสงานซ่อม</th>
                    <th className="px-6 py-4">อุปกรณ์ / อาการเสีย</th>
                    <th className="px-6 py-4">สถานะ</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customer.repair_orders &&
                  customer.repair_orders.length > 0 ? (
                    customer.repair_orders.map((repair) => (
                      <tr
                        key={repair.id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {repair.receive_date
                            ? new Date(repair.receive_date).toLocaleDateString(
                                "th-TH",
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-blue-600 font-mono">
                            {repair.repair_code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {/* แสดงชื่อเครื่องแรก และจำนวนเครื่องที่เหลือถ้ามีมากกว่า 1 */}
                            {repair.devices && repair.devices.length > 0
                              ? `${repair.devices[0].brand} ${repair.devices[0].model} ${repair.devices.length > 1 ? `(+${repair.devices.length - 1} เครื่อง)` : ""}`
                              : "ไม่ระบุอุปกรณ์"}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 italic">
                            “
                            {repair.problem_description ||
                              "ไม่มีรายละเอียดอาการเสีย"}
                            ”
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                              repair.status?.status_name === "ซ่อมเสร็จแล้ว" ||
                              repair.status?.status_name === "ส่งมอบแล้ว"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {repair.status?.status_name || "ไม่ระบุ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/tec/repairs/view/${repair.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full inline-block transition-all"
                          >
                            <ChevronRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-gray-50 rounded-full">
                            <Info size={24} className="text-gray-300" />
                          </div>
                          <p className="text-sm">
                            ไม่พบประวัติการซ่อมของลูกค้ารายนี้
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
      </div>
    </div>
  );
}
