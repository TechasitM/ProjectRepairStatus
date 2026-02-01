"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      // รองรับทั้ง res.data หรือ res.data.data ตามโครงสร้าง API
      setCustomers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลลูกค้าได้", "error");
    } finally {
      setLoading(false);
    }
  };

  // กรองข้อมูลลูกค้าจากชื่อหรือเบอร์โทร
  const filteredCustomers = customers.filter(c => 
    c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">กำลังโหลดข้อมูลลูกค้า...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการข้อมูลลูกค้า</h1>
          <p className="text-sm text-gray-500">จัดการข้อมูลติดต่อและประวัติลูกค้าทั้งหมด</p>
        </div>
        
        <Link href="/admin/customers/create" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-all active:scale-95 font-medium">
          + เพิ่มลูกค้าใหม่
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทรศัพท์..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b">ชื่อลูกค้า</th>
              <th className="p-4 border-b">ข้อมูลติดต่อ</th>
              <th className="p-4 border-b">จำนวนอุปกรณ์</th>
              <th className="p-4 border-b text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {customer.customer_name}
                  </div>
                  <div className="text-xs text-gray-400">ID: {customer.id}</div>
                </td>
                
                <td className="p-4">
                  <div className="text-sm text-gray-700 font-medium">📞 {customer.phone || '-'}</div>
                  <div className="text-sm text-gray-500">📧 {customer.email || '-'}</div>
                </td>

                <td className="p-4">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    📦 {customer.devices?.length || 0} เครื่อง
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link 
                      href={`/tec/customers/${customer.id}`} 
                      className="text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                      title="ดูรายละเอียด"
                    >
                      👁️ ดูประวัติ
                    </Link>
                    <Link 
                      href={`/tec/repairs/create?customer_id=${customer.id}`} 
                      className="text-gray-600 hover:text-green-600 p-2 hover:bg-green-50 rounded-lg transition-all"
                      title="เปิดงานซ่อมใหม่"
                    >
                      🛠️ เปิดงาน
                    </Link>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-400 italic font-light">
                  ไม่พบข้อมูลลูกค้าที่คุณค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}