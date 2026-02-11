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
  CircleDollarSign,
  MessageSquare,
} from "lucide-react";

export default function RepairUpdatePage() {
  const { id } = useParams();
  const router = useRouter();

  const [repair, setRepair] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setIsLoading] = useState(true);

  const CLOSE_STATUS_ID = 5;

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
        Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลได้", "error");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const updateStatus = async () => {
    if (!newStatus || isUpdating) return;

    if (
      Number(newStatus) === CLOSE_STATUS_ID &&
      (!finalPrice || finalPrice <= 0)
    ) {
      return Swal.fire(
        "กรุณาใส่ราคาปิดงาน",
        "ต้องระบุราคาที่ถูกต้องก่อนปิดงานซ่อม",
        "warning",
      );
    }

    const confirm = await Swal.fire({
      title: "ยืนยันการอัปเดต?",
      text: "ระบบจะทำการแจ้งเตือนไปยังลูกค้าผ่านอีเมล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "อัปเดตและแจ้งเตือน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        container: "font-sans",
      },
    });

    if (!confirm.isConfirmed) return;
    setIsUpdating(true);

    try {
      const payload = {
        status_id: newStatus,
        note: note,
      };
      if (Number(newStatus) === CLOSE_STATUS_ID) {
        payload.final_price = Number(finalPrice);
      }

      const response = await api.patch(`/repairs/${repair.id}/status`, payload);
      setRepair(response.data.data);
      setNewStatus("");
      setNote("");
      setFinalPrice("");

      Swal.fire({
        icon: "success",
        title: "อัปเดตสถานะสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้", "error");
    } finally {
      setIsUpdating(false);
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

  if (!repair)
    return (
      <div className="p-10 text-center text-rose-500 font-bold italic">
        ไม่พบข้อมูลงานซ่อม
      </div>
    );

  return (
    <div className="p-6 mx-auto space-y-8 font-sans">
      {/* --- Header Area --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {repair.repair_code}
              </h1>
              <div
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                  repair.status?.id === 4
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {repair.status?.status_name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- Left Column (8/12) --- */}
        <div className="lg:col-span-7 space-y-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <User size={12} className="text-blue-500" /> Customer
              </p>
              <p className="font-bold text-slate-800 text-lg mb-1">
                {repair.customer?.customer_name}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {repair.customer?.phone}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Monitor size={12} className="text-blue-500" /> Device Info
              </p>
              <p className="font-bold text-slate-800 text-lg mb-1 leading-tight">
                {repair.device?.brand} {repair.device?.model}
              </p>
              <p className="text-[10px] font-mono font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded w-fit">
                SN: {repair.device?.serial_number || "NO-SERIAL"}
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2">
              <History size={18} className="text-blue-600" />
              SERVICE HISTORY
            </h2>
            <div className="relative ml-2 space-y-8 before:absolute before:inset-0 before:ml-[1.125rem] before:w-0.5 before:bg-slate-50 before:h-full">
              {repair.timelines
                ?.slice()
                .reverse()
                .map((t, idx) => (
                  <div key={t.id} className="relative pl-12 group">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-1 w-9 h-9 -translate-x-0.5 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-all ${
                        idx === 0
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {idx === 0 ? (
                        <Clock size={14} />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 bg-slate-50/50 p-4 rounded-2xl border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-black uppercase tracking-tight ${idx === 0 ? "text-blue-600" : "text-slate-600"}`}
                        >
                          {t.status?.status_name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          {new Date(t.update_datetime).toLocaleString("th-TH", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      {t.note && (
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {t.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- Right Column (4/12) --- */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 sticky top-8">
            <h2 className="text-slate-900 font-bold text-lg flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send size={18} className="text-blue-600" />
              </div>
              Update Status
            </h2>

            <div className="space-y-6">
              {/* Status Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  New Status
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="">เลือกสถานะการซ่อม...</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.status_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={14} className="text-gray-400" />
                  Internal Note / Notification
                </label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm min-h-[110px] placeholder:text-gray-400"
                  placeholder="ระบุความคืบหน้าเพื่อให้ลูกค้าทราบผ่านอีเมล..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isUpdating}
                />
              </div>

              {/* Final Price */}
              {Number(newStatus) === CLOSE_STATUS_ID && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <CircleDollarSign size={14} />
                    Final Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-emerald-200 text-emerald-600 px-4 py-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-lg font-semibold transition"
                      disabled={isUpdating}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-sm font-medium">
                      THB
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={updateStatus}
                disabled={isUpdating || !newStatus}
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition
          ${
            isUpdating || !newStatus
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
              >
                {isUpdating ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    บันทึกและส่งข้อมูล <CheckCircle2 size={16} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                * ข้อมูลที่บันทึกจะถูกส่งเป็นสรุปงานไปยังอีเมลของลูกค้าทันที
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
