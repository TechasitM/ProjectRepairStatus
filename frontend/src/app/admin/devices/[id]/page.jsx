"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDeviceDetail();
  }, [id]);

  const fetchDeviceDetail = async () => {
    try {
      // API ควรส่งข้อมูล device พร้อม repairs history
      const res = await api.get(`/devices/${id}`);
      setDevice(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("ไม่พบข้อมูล", "ไม่สามารถโหลดข้อมูลอุปกรณ์ได้", "error");
      router.push("/admin/devices");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">กำลังโหลดประวัติอุปกรณ์...</div>;
  if (!device) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Navigation */}
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-2 transition-colors">
        ← ย้อนกลับไปหน้าคลังอุปกรณ์
      </button>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{device.brand} {device.model}</h1>
            <p className="text-emerald-100 font-mono text-sm">S/N: {device.serial_number}</p>
          </div>
          <div className="text-right">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider">
              {device.device_type}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 divide-x divide-gray-100">
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase">เจ้าของเครื่อง</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">👤</div>
              <div>
                <p className="font-bold text-gray-800">{device.customer?.customer_name}</p>
                <p className="text-sm text-gray-500">{device.customer?.phone}</p>
              </div>
            </div>
            <Link 
              href={`/admin/customers/${device.customer_id}`}
              className="inline-block text-xs text-emerald-600 font-bold hover:underline"
            >
              ดูโปรไฟล์ลูกค้า →
            </Link>
          </div>
          
          <div className="p-6 space-y-4 text-center md:text-left">
            <h3 className="text-xs font-bold text-gray-400 uppercase">สถิติการซ่อม</h3>
            <div className="flex gap-8 justify-center md:justify-start">
              <div>
                <p className="text-2xl font-bold text-gray-800">{device.repairs?.length || 0}</p>
                <p className="text-xs text-gray-400">จำนวนครั้งที่ซ่อม</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {device.repairs?.filter(r => r.status_id === 4).length || 0}
                </p>
                <p className="text-xs text-gray-400">ซ่อมสำเร็จ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repair History Timeline Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">ประวัติการซ่อมของเครื่องนี้</h3>
          <Link 
            href={`/admin/repairs/create?customer_id=${device.customer_id}&device_id=${device.id}`}
            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors"
          >
            + เปิดงานซ่อมใหม่สำหรับเครื่องนี้
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
              <tr>
                <th className="p-4">รหัสงาน</th>
                <th className="p-4">อาการเสียที่แจ้ง</th>
                <th className="p-4">วันที่</th>
                <th className="p-4">สถานะล่าสุด</th>
                <th className="p-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {device.repairs?.length > 0 ? device.repairs.map(repair => (
                <tr key={repair.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <span className="font-bold text-sm text-emerald-600">{repair.repair_code}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700 line-clamp-1">{repair.problem_description}</p>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(repair.receive_date).toLocaleDateString('th-TH')}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      repair.status_id === 4 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {repair.status?.status_name}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link href={`/admin/repairs/${repair.id}`} className="text-xs font-bold text-gray-400 hover:text-emerald-600 underline">
                      ดูงานซ่อม
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-gray-400 text-sm italic font-light">
                    เครื่องนี้ยังไม่มีประวัติการซ่อมในระบบ
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