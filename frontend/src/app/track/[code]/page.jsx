"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Bell,
  ArrowLeft,
  ChevronRight,
  Package,
} from "lucide-react";

/* ===============================
    Status Color Helper (Updated for Theme)
================================ */
function getStatusStyle(status) {
  switch (status) {
    case "รอซ่อม":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-100",
        dot: "bg-amber-500 ring-amber-100",
      };
    case "กำลังซ่อม":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        dot: "bg-blue-600 ring-blue-100",
      };
    case "เสร็จแล้ว":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
        dot: "bg-emerald-500 ring-emerald-100",
      };
    default:
      return {
        badge: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400 ring-slate-100",
      };
  }
}

export default function TrackRepairPage() {
  const { code } = useParams();
  const router = useRouter();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRepairData = useCallback(async () => {
    try {
      setLoading(true);
      const isPhone = /^[0-9]{9,10}$/.test(code);
      const url = isPhone ? `/repairs/phone/${code}` : `/repairs/${code}`;
      const res = await api.get(url);
      setRepair(res.data);
    } catch {
      setError("ไม่พบข้อมูลงานซ่อมในระบบ กรุณาตรวจสอบรหัสอีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    if (code) fetchRepairData();
  }, [code, fetchRepairData]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="bg-red-50 p-6 rounded-2xl text-center max-w-sm border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl bg-black text-white hover:bg-slate-800 transition-all font-medium"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );

  const statusStyle = getStatusStyle(repair.status?.status_name);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        {/* Header Card (Black & Blue Theme) */}
        <div className="bg-black rounded-3xl p-8 shadow-2xl shadow-blue-900/10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 blur-[80px] opacity-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                คุณ {repair.customer?.customer_name}
              </h1>
              <div className="flex items-center gap-3 mt-2 opacity-80">
                <span className="text-blue-400 font-mono text-lg font-semibold tracking-wider">
                  #{repair.repair_code}
                </span>
                <span className="h-4 w-px bg-slate-700" />
                <span className="text-sm flex items-center gap-1">
                  <Package className="w-4 h-4" /> ตรวจสอบสถานะการซ่อม
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold shadow-sm ${statusStyle.badge}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${statusStyle.dot}`} />
              {repair.status?.status_name}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Details & Notifications */}
          <div className="lg:col-span-2 space-y-6">
            
            <Card title="ข้อมูลงานซ่อม" icon={<Package className="w-4 h-4" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem label="อาการเสีย" value={repair.problem_description} />
                <InfoItem 
                  label="วันที่รับเครื่อง" 
                  value={repair.receive_date ? new Date(repair.receive_date).toLocaleDateString("th-TH", {
                    day: 'numeric', month: 'long', year: 'numeric'
                  }) : "-"} 
                />
                <InfoItem 
                   label="ราคาประเมิน" 
                   value={repair.estimate_price ? Number(repair.estimate_price).toLocaleString() + " บาท" : "-"}
                   isHighlight
                />
                <InfoItem 
                   label="ราคาจริง" 
                   value={repair.final_price ? Number(repair.final_price).toLocaleString() + " บาท" : "รอสรุปราคา"}
                   isHighlight
                   color="text-blue-600"
                />
              </div>
            </Card>

            <Card title="การแจ้งเตือน" icon={<Mail className="w-4 h-4" />}>
              {repair.notifications?.length ? (
                <div className="space-y-3">
                  {repair.notifications.map((n) => (
                    <div key={n.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 text-sm">แจ้งเตือนผ่าน{n.channel === "email" ? "อีเมล" : n.channel}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {n.sent_datetime ? new Date(n.sent_datetime).toLocaleString("th-TH") : "-"}
                          </p>
                        </div>
                      </div>
                      <StatusTag isSent={n.notification_status === "sent"} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="ยังไม่มีการแจ้งเตือนในขณะนี้" />
              )}
            </Card>
          </div>

          {/* Right Column: Timeline */}
          <div className="lg:col-span-1">
            <Card title="ประวัติการดำเนินการ" icon={<Clock className="w-4 h-4" />}>
              {repair.timelines?.length ? (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:bg-slate-100">
                  {repair.timelines.map((t, index) => {
                    const tStyle = getStatusStyle(t.status?.status_name);
                    return (
                      <div key={t.id} className="relative pl-8 group">
                        <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${tStyle.dot}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{t.status?.status_name}</p>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">
                            {new Date(t.update_datetime).toLocaleString("th-TH")}
                          </p>
                          {t.note && (
                            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                              {t.note}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState message="ยังไม่มีข้อมูลประวัติ" />
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Card({ title, icon, children }) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoItem({ label, value, isHighlight, color = "text-slate-800" }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-sm ${isHighlight ? 'font-bold' : 'font-medium'} ${color}`}>
        {value || "-"}
      </p>
    </div>
  );
}

function StatusTag({ isSent }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
      isSent ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
    }`}>
      {isSent ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {isSent ? "สำเร็จ" : "ล้มเหลว"}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}