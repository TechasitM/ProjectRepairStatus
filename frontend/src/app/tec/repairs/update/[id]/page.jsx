"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  User,
  Monitor,
  Clock,
  Send,
  History,
  CheckCircle2,
} from "lucide-react";

export default function RepairUpdatePage() {
  const { id } = useParams();
  const router = useRouter();

  const [repair, setRepair] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repairRes, statusRes] = await Promise.all([
          api.get(`/repairs/${id}`),
          api.get("/statuses"),
        ]);

        setRepair(repairRes.data.data || repairRes.data);
        setStatuses(statusRes.data.data || statusRes.data);
      } catch (error) {
        console.error(error);
        Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลได้", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  /* -------------------- UPDATE STATUS -------------------- */
  const updateStatus = async () => {
    if (!newStatus || isUpdating) return;

    const confirm = await Swal.fire({
      title: "ยืนยันการอัปเดต?",
      text: "ระบบจะทำการอัปเดตสถานะและส่งอีเมลแจ้งลูกค้า",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "ยืนยันและส่ง",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    setIsUpdating(true);

    try {
      const response = await api.patch(
        `/repairs/${repair.id}/status`,
        {
          status_id: newStatus,
          note: note,
        }
      );

      // ✅ ใช้ข้อมูลจาก backend (มีเวลา + timeline ถูกต้อง)
      setRepair(response.data.data);
      setNewStatus("");
      setNote("");

      Swal.fire({
        icon: "success",
        title: "อัปเดตเรียบร้อย",
        text: "สถานะถูกเปลี่ยนและส่งอีเมลแจ้งเตือนแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  /* -------------------- LOADING -------------------- */
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-3 text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="font-bold">กำลังเปิดข้อมูลใบรับซ่อม...</p>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        ไม่พบข้อมูลงานซ่อม
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white border border-gray-100 rounded-2xl hover:text-blue-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">{repair.repair_code}</h1>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                repair.status?.id === 4 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
              }`}>
                {repair.status?.status_name}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium">จัดการสถานะการซ่อมและแจ้งเตือนลูกค้า</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <User size={14} className="text-blue-500" /> Customer Information
              </h3>
              <p className="font-black text-xl text-gray-800 mb-1">{repair.customer?.customer_name}</p>
              <div className="space-y-1 text-sm text-gray-500 font-medium">
                <p>📞 {repair.customer?.phone}</p>
                <p className="truncate">📧 {repair.customer?.email}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Monitor size={14} className="text-blue-500" /> Device Information
              </h3>
              <p className="font-black text-xl text-gray-800 mb-1">
                {repair.device?.brand} {repair.device?.model}
              </p>
              <p className="text-xs font-mono font-bold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                S/N: {repair.device?.serial_number || 'N/A'}
              </p>
              <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-400 uppercase mb-1">ปัญหาที่พบ (Problem)</p>
                <p className="text-sm font-bold text-rose-600 leading-relaxed">{repair.problem_description}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <h2 className="font-black text-gray-800 mb-8 flex items-center gap-2">
              <History size={20} className="text-blue-600" /> ประวัติการดำเนินการ (Timeline)
            </h2>
            <div className="relative ml-4 space-y-8 before:absolute before:inset-0 before:ml-1.5 before:w-0.5 before:bg-gray-100 before:h-full">
              {repair.timelines?.slice().reverse().map((t, idx) => (
                <div key={t.id} className="relative pl-10 group">
                  <div className={`absolute left-0 top-1 w-4 h-4 rounded-full ring-4 ring-white transition-all ${idx === 0 ? "bg-blue-600 scale-125" : "bg-gray-300 group-hover:bg-blue-400"}`}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 gap-2">
                    <div className="text-sm font-black text-gray-800">{t.status?.status_name}</div>
                    <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {new Date(t.update_datetime).toLocaleString("th-TH")}
                    </div>
                  </div>
                  {t.note && (
                    <div className="text-xs text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100 font-medium">
                      {t.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Update Form (Sidebar style) */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 space-y-6 sticky top-6">
            <h2 className="text-white font-black text-lg flex items-center gap-2">
              <Send size={20} className="text-blue-400" /> Update Status
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-1">สถานะใหม่</label>
                <select
                  className="w-full bg-gray-800 border-none text-white p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-bold appearance-none cursor-pointer"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="" className="text-gray-400">-- เลือกสถานะ --</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id} className="text-white">
                      {s.status_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-1">โน้ตแจ้งลูกค้า (Technician Note)</label>
                <textarea
                  className="w-full bg-gray-800 border-none text-white p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all text-sm min-h-[120px]"
                  placeholder="เขียนรายละเอียดความคืบหน้า..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isUpdating}
                />
              </div>

              <button
                onClick={updateStatus}
                disabled={isUpdating || !newStatus}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
                  ${isUpdating || !newStatus 
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20"}`}
              >
                {isUpdating ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>บันทึกสถานะใหม่ <CheckCircle2 size={18} /></>
                )}
              </button>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-800 text-[10px] text-gray-400 leading-relaxed italic">
              * เมื่อบันทึกสำเร็จ ระบบจะส่ง Email สรุปสถานะพร้อมโน้ตไปยังลูกค้าโดยอัตโนมัติ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}