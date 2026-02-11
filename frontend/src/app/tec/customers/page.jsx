"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import { Search, Phone, Mail, Eye, Plus, UserCircle } from "lucide-react";

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
          text:
            err.response?.data?.message || "เซิร์ฟเวอร์ขัดข้อง โปรดลองอีกครั้ง",
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
    <div className="p-6 mx-auto min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 border border-gray-100">
            <UserCircle size={28} />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              จัดการข้อมูลลูกค้า
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              จัดการข้อมูลติดต่อและประวัติลูกค้าทั้งหมดในระบบ
            </p>
          </div>
        </div>

        <Link
          href="/tec/customers/create"
          className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-[1rem] shadow-xl hover:bg-blue-600 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={18} />
          เพิ่มงานลูกค้า
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทรศัพท์..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm font-medium text-gray-700 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="p-6 border-b">ชื่อลูกค้า</th>
                <th className="p-6 border-b">ข้อมูลติดต่อ</th>
                <th className="p-6 border-b text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-blue-50/20 group">
                    {/* Name */}
                    <td className="p-6">
                      <div className="font-black text-sm text-gray-800 tracking-tight">
                        {customer.customer_name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono tracking-wide">
                        CUSTOMER-ID: {customer.id}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-6">
                      <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
                        <Phone size={14} className="text-blue-500" />
                        {customer.phone || "-"}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium flex items-center gap-2 mt-1">
                        <Mail size={14} />
                        {customer.email || "-"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <ActionBtn
                          href={`/tec/customers/view/${customer.id}`}
                          icon={<Eye size={18} />}
                          color="hover:text-blue-600 hover:bg-blue-50"
                          title="ประวัติลูกค้า"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-28 text-center">
                    <div className="flex flex-col items-center text-gray-400 gap-3">
                      <Search size={48} className="opacity-20" />
                      <p className="font-black uppercase tracking-widest text-sm">
                        ไม่พบข้อมูลลูกค้า
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

function ActionBtn({ href, icon, color, title }) {
  return (
    <Link
      href={href}
      className={`p-2 rounded-lg text-gray-400 border border-transparent shadow-sm ${color}`}
      title={title}
    >
      {icon}
    </Link>
  );
}
