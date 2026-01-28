"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";

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
      const res = await api.get(`/customers/${id}`);
      // สมมติว่า Backend ส่ง data ที่ include devices และ repairs มาให้แล้ว
      setCustomer(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่พบข้อมูลลูกค้า", "error");
      router.push("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">กำลังโหลดโปรไฟล์ลูกค้า...</div>;
  if (!customer) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          ⬅️
        </button>
        <h1 className="text-2xl font-bold text-gray-800">รายละเอียดลูกค้า</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Customer Card (ข้อมูลส่วนตัว) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
              {customer.customer_name?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800">{customer.customer_name}</h2>
            <p className="text-center text-gray-500 text-sm mb-6">ID: #{customer.id}</p>
            
            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">เบอร์โทรศัพท์</label>
                <p className="text-gray-700 font-medium">📞 {customer.phone || 'ไม่มีข้อมูล'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">อีเมล</label>
                <p className="text-gray-700 font-medium">📧 {customer.email || 'ไม่มีข้อมูล'}</p>
              </div>
              <button className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                แก้ไขข้อมูลติดต่อ
              </button>
            </div>
          </div>

          {/* ปุ่ม Action เร็วๆ */}
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold mb-2">เปิดงานซ่อมใหม่</h3>
            <p className="text-blue-100 text-xs mb-4">ลูกค้าต้องการส่งซ่อมอุปกรณ์ชิ้นใหม่หรือไม่?</p>
            <Link 
              href={`/admin/repairs/create?customer_id=${customer.id}`}
              className="block text-center bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-50 transition-transform active:scale-95"
            >
              + สร้างใบรับซ่อม
            </Link>
          </div>
        </div>

        {/* 2 & 3. Devices and History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ส่วนของ อุปกรณ์ (Devices) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">อุปกรณ์ที่ครอบครอง</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {customer.devices?.length || 0} รายการ
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {customer.devices?.length > 0 ? customer.devices.map(device => (
                <div key={device.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800">{device.brand} {device.model}</p>
                    <p className="text-xs text-blue-600 font-mono">SN: {device.serial_number}</p>
                  </div>
                  <Link href={`/admin/devices/${device.id}`} className="text-sm text-gray-400 hover:text-blue-600">
                    ดูรายละเอียด →
                  </Link>
                </div>
              )) : (
                <div className="p-10 text-center text-gray-400 text-sm">ยังไม่มีข้อมูลอุปกรณ์</div>
              )}
            </div>
          </div>

          {/* ส่วนของ ประวัติการซ่อม (Repair History) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50">
              <h3 className="font-bold text-gray-700">ประวัติการซ่อมย้อนหลัง</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                  <tr>
                    <th className="p-4">รหัสงาน</th>
                    <th className="p-4">วันที่รับ</th>
                    <th className="p-4">สถานะ</th>
                    <th className="p-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customer.repairs?.length > 0 ? customer.repairs.map(repair => (
                    <tr key={repair.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-sm text-blue-600">{repair.repair_code}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(repair.receive_date).toLocaleDateString('th-TH')}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {repair.status?.status_name || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/repairs/${repair.id}`} className="text-xs font-bold text-gray-500 hover:text-blue-600 underline">
                          ดูรายละเอียด
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 text-sm">ยังไม่เคยมีประวัติการซ่อม</td>
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