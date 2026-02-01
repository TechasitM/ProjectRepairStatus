"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import { 
  UsersRound, 
  CirclePlus, 
  SearchX, 
  Mail, 
  UserPen, 
  Trash2, 
  ShieldCheck,
  MoreVertical 
} from 'lucide-react';

export default function TecManagementPage() {
  const [tecs, setTecs] = useState([]);
  const [loading, setLoading] = useState(true);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tecmanagement");
      // ตรวจสอบโครงสร้างข้อมูลที่ส่งกลับมา
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setTecs(data);
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: "error", title: "โหลดข้อมูลทีมช่างไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบช่างเทคนิค?",
      html: `คุณกำลังจะลบคุณ <b>"${name}"</b> <br/> สิทธิ์การเข้าถึงระบบของช่างรายนี้จะถูกยกเลิกทันที`,
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
        await api.delete(`/tecmanagement/${id}`);
        Toast.fire({ icon: "success", title: "ลบข้อมูลสำเร็จ" });
        loadData();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: err.response?.data?.message || "ช่างรายนี้อาจมีงานค้างอยู่ในระบบ ไม่สามารถลบได้",
        });
      }
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 font-medium animate-pulse">กำลังโหลดข้อมูลทีมช่าง...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-3.5 rounded-2xl text-white shadow-lg shadow-blue-200">
            <UsersRound size={28} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">การจัดการทีมช่าง</h1>
            <p className="text-sm text-gray-500 mt-0.5">บริหารจัดการรายชื่อทีมงานและสิทธิ์การเข้าใช้งานระบบซ่อม</p>
          </div>
        </div>
        
        <Link
          href="/admin/tecmanagement/create"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <CirclePlus size={20} />
          <span>เพิ่มช่างเทคนิคใหม่</span>
        </Link>
      </div>

      {/* Main Table Content */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.1em]">
                <th className="p-6 border-b">ข้อมูลช่าง</th>
                <th className="p-6 border-b">การติดต่อและสิทธิ์</th>
                <th className="p-6 border-b text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm italic-none">
              {tecs.length > 0 ? (
                tecs.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Initial Avatar */}
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {t.name?.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-base">{t.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono tracking-tighter">TEC-ID: #{t.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <Mail size={14} className="text-gray-400" />
                          <span>{t.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[10px] font-bold border border-green-100 uppercase">
                            <ShieldCheck size={10} /> Active
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex justify-center items-center gap-3">
                        <Link
                          href={`/admin/tecmanagement/edit/${t.id}`}
                          className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                          title="แก้ไขข้อมูล"
                        >
                          <UserPen size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="ลบช่างออกจากระบบ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-dashed border-gray-200">
                        <SearchX size={64} className="text-gray-200" strokeWidth={1.5} />
                      </div>
                      <div className="max-w-xs mx-auto">
                        <h3 className="text-gray-900 font-bold text-lg">ยังไม่มีข้อมูลช่างเทคนิค</h3>
                        <p className="text-gray-400 text-sm mt-1 mb-6">เริ่มสร้างบัญชีผู้ใช้สำหรับทีมช่างของคุณเพื่อเริ่มต้นจัดการงานซ่อม</p>
                        <Link
                          href="/admin/tecmanagement/create"
                          className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-2"
                        >
                          <CirclePlus size={16} /> เพิ่มช่างคนแรกเลย
                        </Link>
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