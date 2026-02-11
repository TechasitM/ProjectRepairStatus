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
  AlertCircle,
  Cpu,
} from "lucide-react";

export default function StatusManagementPage() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      Toast.fire({ icon: "success", title: "บันทึกข้อมูลเรียบร้อย" });
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
      confirmButtonColor: "#374151", // Gray-700
      confirmButtonText: "ยืนยันการลบ",
      cancelButtonText: "ยกเลิก",
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
    <div className="p-4 w-full min-h-screen font-sans">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 border border-gray-100">
                <Settings2 size={28} />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                  จัดการสถานะงานซ่อม
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-wide">
                  ตั้งค่าขั้นตอนและสถานะมาตรฐานสำหรับระบบงานซ่อม
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditId(null);
              setStatusName("");
              setShowModal(true);
            }}
            className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 flex items-center justify-center gap-2 font-bold text-sm transition-all"
          >
            <Plus size={18} /> เพิ่มสถานะใหม่
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="px-6 py-4 border-b w-24 text-center">ID</th>
                <th className="px-6 py-4 border-b">ชื่อสถานะ</th>
                <th className="px-6 py-4 border-b text-right">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {statuses.length > 0 ? (
                statuses.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-gray-400 text-sm">
                        #{s.id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wide">
                        {s.status_name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditId(s.id);
                            setStatusName(s.status_name);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-900 hover:text-yellow-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.status_name)}
                          className="p-2 text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  <td
                    colSpan="3"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    <AlertCircle
                      className="mx-auto mb-2 opacity-20"
                      size={40}
                    />
                    <p className="text-sm font-medium">
                      ยังไม่มีข้อมูลสถานะในระบบ
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Status */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                {editId ? "แก้ไขสถานะ" : "เพิ่มสถานะใหม่"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  ชื่อสถานะ
                </label>
                <input
                  autoFocus
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-semibold text-gray-800 transition-all"
                  placeholder="เช่น กำลังดำเนินการ, รออะไหล่..."
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                  {isSaving ? "กำลังบันทึก" : "ตกลง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative">
        <div className="h-20 w-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-blue-600/5 border-b-blue-600 rounded-full animate-spin-reverse" />
        </div>
      </div>
    </div>
  );
}
}
