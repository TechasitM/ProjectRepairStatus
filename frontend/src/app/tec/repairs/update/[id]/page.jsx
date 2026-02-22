"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { getStatusStyle } from "@/services/status";
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
  const [device, setDevice] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setIsLoading] = useState(true);

  //หาสถานะ "เสร็จแล้ว" แบบ dynamic ไม่ hardcode id
  const closeStatus = useMemo(() => {
    return statuses.find((s) => s.status_name === "ซ่อมเสร็จแล้ว");
  }, [statuses]);

  const isCloseStatus = useMemo(() => {
    return closeStatus && Number(newStatus) === closeStatus.id;
  }, [newStatus, closeStatus]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [repairRes, statusRes] = await Promise.all([
          api.get(`/repairs/${id}`),
          api.get("/statuses"),
        ]);

        if (!isMounted) return;

        const repairData = repairRes.data.data || repairRes.data;
        setRepair(repairData);
        setStatuses(statusRes.data.data || statusRes.data);

        if (repairData?.device_id) {
          try {
            const deviceRes = await api.get(`/devices/${repairData.device_id}`);

            if (isMounted) {
              setDevice(deviceRes.data.data || deviceRes.data);
            }
          } catch (deviceError) {
            console.error("โหลด device ไม่สำเร็จ", deviceError);
          }
        }
      } catch (error) {
        Swal.fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลได้", "error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (id) fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const updateStatus = async () => {
    if (!newStatus || isUpdating) return;

    // Validate ราคาแบบปลอดภัย
    if (isCloseStatus) {
      const priceNumber = Number(finalPrice);
      if (!priceNumber || priceNumber <= 0 || isNaN(priceNumber)) {
        return Swal.fire(
          "กรุณาใส่ราคาปิดงาน",
          "ต้องระบุราคาที่ถูกต้องก่อนปิดงานซ่อม",
          "warning",
        );
      }
    }

    const confirm = await Swal.fire({
      title: "ยืนยันการอัปเดต?",
      text: "ระบบจะทำการแจ้งเตือนไปยังลูกค้าผ่านอีเมล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "อัปเดตและแจ้งเตือน",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    setIsUpdating(true);

    try {
      const payload = {
        status_id: Number(newStatus),
        note: note?.trim() || null,
      };

      if (isCloseStatus) {
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
      const message =
        error?.response?.data?.message ||
        "ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่";

      Swal.fire("เกิดข้อผิดพลาด", message, "error");
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

  const statusStyle = getStatusStyle(repair.status?.status_name);

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
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${statusStyle.badge}`}
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
                {device?.brand} {device?.model}
              </p>

              <p className="text-[10px] font-mono font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded w-fit">
                SN: {device?.serial_number || "NO-SERIAL"}
              </p>
              <p className="font-bold text-slate-800 text-lg mb-1 leading-tight">
                {device?.spec_detail}
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
                .map((t) => {
                  // ดึงสีตามสถานะจากฟังก์ชัน
                  const style = getStatusStyle(t.status?.status_name);

                  return (
                    <div key={t.id} className="relative pl-12 group">
                      {/* Timeline Dot: ใช้สีจาก style.dot */}
                      <div
                        className={`absolute left-0 top-1 w-9 h-9 -translate-x-0.5 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-all ${style.dot.split(" ")[0]} text-white`}
                      >
                        <CheckCircle2 size={14} />
                      </div>

                      {/* กล่องข้อมูล: ใช้สี badge จาก style.badge */}
                      <div
                        className={`flex flex-col gap-1.5 p-4 rounded-2xl border ${style.badge} bg-opacity-10 border-transparent group-hover:bg-opacity-20 transition-all`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[11px] font-black uppercase tracking-tight`}
                          >
                            {t.status?.status_name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(t.update_datetime).toLocaleString(
                              "th-TH",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              },
                            )}
                          </span>
                        </div>
                        {t.note && (
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {t.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
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
              {id && isCloseStatus && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <CircleDollarSign size={14} />
                    Final Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={finalPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0) setFinalPrice(value);
                      }}
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
