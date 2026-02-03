"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import { 
  Settings2, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Loader2, 
  Tag, 
  AlertCircle 
} from 'lucide-react';

export default function StatusManagementPage() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [statusName, setStatusName] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await api.get("/statuses");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setStatuses(data);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลสถานะได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusName.trim()) return;

    setIsSaving(true);
    try {
      if (editId) {
        await api.put(`/statuses/${editId}`, { status_name: statusName });
      } else {
        await api.post("/statuses", { status_name: statusName });
      }
      
      setShowModal(false);
      setStatusName("");
      setEditId(null);
      fetchStatuses();
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({ icon: 'success', title: 'บันทึกข้อมูลเรียบร้อย' });

    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      html: `คุณกำลังจะลบสถานะ <b>"${name}"</b> <br/><small className="text-gray-500">หากสถานะนี้ถูกใช้อยู่ในงานซ่อม จะไม่สามารถลบได้</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/statuses/${id}`);
        Swal.fire("ลบแล้ว", "ข้อมูลถูกลบเรียบร้อย", "success");
        fetchStatuses();
      } catch (err) {
        Swal.fire("ลบไม่สำเร็จ", "สถานะนี้อาจมีการใช้งานอยู่ในระบบงานซ่อม", "error");
      }
    }
  };

  // UX: กำหนดสี Badge ตามชื่อสถานะ
  const getStatusStyle = (name) => {
    if (name.includes("เสร็จ") || name.includes("รับคืน")) 
      return "bg-green-100 text-green-700 border-green-200";
    if (name.includes("ซ่อม") || name.includes("ดำเนิน") || name.includes("รอ")) 
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (name.includes("ยกเลิก") || name.includes("ปัญหา") || name.includes("คืนเงิน")) 
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลสถานะ...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 shadow-sm">
            <Settings2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">จัดการสถานะงานซ่อม</h1>
            <p className="text-sm text-gray-500 font-medium">ตั้งค่าขั้นตอนมาตรฐานสำหรับ Workshop ของคุณ</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditId(null); setStatusName(""); setShowModal(true); }}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 font-bold"
        >
          <Plus size={20} /> เพิ่มสถานะใหม่
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-gray-400 uppercase text-[10px] font-black tracking-widest">
              <th className="p-6 border-b w-24 text-center">ลำดับ ID</th>
              <th className="p-6 border-b">ชื่อสถานะที่แสดงในระบบ</th>
              <th className="p-6 border-b text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {statuses.length > 0 ? (
              statuses.map((s) => (
                <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="p-6 text-center">
                    <span className="font-mono text-gray-400 text-sm font-medium">#{s.id}</span>
                  </td>
                  <td className="p-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold shadow-sm ${getStatusStyle(s.status_name)}`}>
                      <Tag size={14} />
                      {s.status_name}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditId(s.id); setStatusName(s.status_name); setShowModal(true); }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="แก้ไขชื่อสถานะ"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id, s.status_name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="ลบสถานะ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-20 text-center text-gray-400 italic">
                  ยังไม่มีการกำหนดสถานะในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Add/Edit Status */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Tag size={20} /> {editId ? 'แก้ไขสถานะงาน' : 'สร้างสถานะใหม่'}
              </h2>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">ชื่อสถานะ</label>
                <input 
                  autoFocus
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-gray-800"
                  placeholder="เช่น กำลังดำเนินการ, รออะไหล่..."
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  required
                />
                <p className="text-[10px] text-gray-400 flex items-center gap-1 px-1">
                  <AlertCircle size={10} /> ชื่อนี้จะไปปรากฏในใบรับซ่อมและหน้ารายการงาน
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  {isSaving ? 'กำลังบันทึก' : 'ยืนยันบันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}