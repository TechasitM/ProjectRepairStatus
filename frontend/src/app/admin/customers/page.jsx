"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import { Search, Phone, Mail, Trash, Eye, Edit, UserCircle } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCustomers(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อดึงข้อมูลลูกค้าได้",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบข้อมูล?",
      html: `คุณกำลังจะลบลูกค้า <b>"${name}"</b><br/><span style="color: #ef4444; font-size: 0.875rem;">ประวัติใบซ่อมและอุปกรณ์ทั้งหมดจะถูกลบถาวร</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "กำลังลบ...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await api.delete(`/customers/${id}`);
        Swal.close();
        Toast.fire({
          icon: "success",
          title: "ลบข้อมูลลูกค้าเรียบร้อยแล้ว",
        });
        fetchCustomers();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: err.response?.data?.message || "เซิร์ฟเวอร์ขัดข้อง โปรดลองอีกครั้ง",
          confirmButtonColor: "#3B82F6",
        });
      }
    }
  };

  // ใช้ useMemo เพื่อช่วยเรื่อง Performance เมื่อข้อมูลมีจำนวนมาก
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const name = c.customer_name?.toLowerCase() || "";
      const phone = c.phone || "";
      const search = searchTerm.toLowerCase();
      return name.includes(search) || phone.includes(search);
    });
  }, [customers, searchTerm]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCircle className="text-blue-600" /> จัดการข้อมูลลูกค้า
          </h1>
          <p className="text-sm text-gray-500">
            จัดการข้อมูลติดต่อและประวัติลูกค้าทั้งหมดในระบบ
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md group">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทรศัพท์..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-4 border-b">ชื่อลูกค้า</th>
                <th className="p-4 border-b">ข้อมูลติดต่อ</th>
                <th className="p-4 border-b text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {customer.customer_name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        ID: {customer.id}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
                        <Phone size={14} className="text-blue-500" />
                        {customer.phone || "-"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <ActionBtn
                          href={`/admin/customers/view/${customer.id}`}
                          icon={<Eye size={18} />}
                          color="hover:text-blue-600 hover:bg-blue-50"
                          title="ประวัติลูกค้า"
                        />
                        <ActionBtn
                          href={`/admin/customers/edit/${customer.id}`}
                          icon={<Edit size={18} />}
                          color="hover:text-orange-600 hover:bg-orange-50"
                          title="แก้ไข"
                        />
                        <button
                          onClick={() => handleDelete(customer.id, customer.customer_name)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                          title="ลบลูกค้า"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Search size={48} className="mb-2 opacity-20" />
                      <p className="italic">ไม่พบข้อมูลลูกค้าที่คุณกำลังค้นหา</p>
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

function ActionBtn({ href, icon, color, title }) {
  return (
    <Link
      href={href}
      className={`p-2 rounded-lg text-gray-400 border border-transparent transition-all shadow-sm ${color}`}
      title={title}
    >
      {icon}
    </Link>
  );
}