"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";

export default function StatusManagementPage() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State สำหรับ Form (กรณีเพิ่มหรือแก้ไข)
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [statusName, setStatusName] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await api.get("/statuses");
      setStatuses(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลสถานะได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusName) return;

    setIsSaving(true);
    try {
      if (editId) {
        await api.put(`/statuses/${editId}`, { status_name: statusName });
        Swal.fire("สำเร็จ", "แก้ไขสถานะเรียบร้อยแล้ว", "success");
      } else {
        await api.post("/statuses", { status_name: statusName });
        Swal.fire("สำเร็จ", "เพิ่มสถานะใหม่เรียบร้อยแล้ว", "success");
      }
      setStatusName("");
      setEditId(null);
      setShowModal(false);
      fetchStatuses();
    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "หากสถานะนี้ถูกใช้อยู่ในงานซ่อม จะไม่สามารถลบได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/statuses/${id}`);
        Swal.fire("ลบแล้ว", "ข้อมูลถูกลบเรียบร้อย", "success");
        fetchStatuses();
      } catch (err) {
        Swal.fire("ลบไม่สำเร็จ", "สถานะนี้อาจมีการใช้งานอยู่ในระบบ", "error");
      }
    }
  };

  // Helper สำหรับเลือกสี Icon ตามชื่อสถานะ (UX)
  const getStatusIcon = (name) => {
    if (name.includes("เสร็จ") || name.includes("รับคืน")) return "🟢";
    if (name.includes("ซ่อม") || name.includes("ดำเนิน")) return "🟡";
    if (name.includes("ยกเลิก") || name.includes("ปัญหา")) return "🔴";
    return "⚪";
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">กำลังโหลดรายการสถานะ...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการสถานะงานซ่อม</h1>
          <p className="text-sm text-gray-500">กำหนดขั้นตอนมาตรฐานสำหรับงานซ่อมภายในร้าน</p>
        </div>
        <button 
          onClick={() => { setEditId(null); setStatusName(""); setShowModal(true); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95 font-medium"
        >
          + เพิ่มสถานะใหม่
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b w-20">ID</th>
              <th className="p-4 border-b">ชื่อสถานะ</th>
              <th className="p-4 border-b text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {statuses.map((s) => (
              <tr key={s.id} className="hover:bg-indigo-50/10 transition-colors group">
                <td className="p-4 font-mono text-gray-400 text-sm">{s.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getStatusIcon(s.status_name)}</span>
                    <span className="font-semibold text-gray-700">{s.status_name}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => { setEditId(s.id); setStatusName(s.status_name); setShowModal(true); }}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
                    >
                      แก้ไข
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:text-red-600 font-bold text-xs"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal สำหรับ เพิ่ม/แก้ไข */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4">{editId ? 'แก้ไขสถานะ' : 'เพิ่มสถานะใหม่'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อสถานะ</label>
                <input 
                  autoFocus
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="เช่น กำลังตรวจสอบ, ซ่อมเสร็จแล้ว..."
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-gray-400"
                >
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}