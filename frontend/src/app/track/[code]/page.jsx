"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowLeft,
  Package,
  History,
  Info,
} from "lucide-react";

/* ===============================
    Status Color Helper
================================ */
function getStatusStyle(status) {
  const styles = {
    "รออะไหล่": {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500 ring-4 ring-amber-100",
    },
    "กำลังซ่อม": {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-600 ring-4 ring-blue-100",
    },
    "ซ่อมเสร็จแล้ว": {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500 ring-4 ring-emerald-100",
    },
  };
  return styles[status] || {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400 ring-4 ring-slate-100",
  };
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
  if (error) return <ErrorState error={error} onBack={() => router.push("/")} />;

  const statusStyle = getStatusStyle(repair.status?.status_name);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all"
        >
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          กลับหน้าหลัก
        </button>

        {/* Hero Header Card */}
        <div className="relative rounded-[2rem] p-8 md:p-12 bg-slate-900 shadow-2xl shadow-blue-900/20 overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase">Repair Tracking</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                คุณ {repair.customer?.customer_name}
              </h1>
              <div className="flex items-center gap-4 text-slate-300">
                <p className="text-lg font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                  #{repair.repair_code}
                </p>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <p className="text-sm font-medium">อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 shadow-xl backdrop-blur-xl transition-transform hover:scale-105 ${statusStyle.badge}`}>
              <div className={`w-3 h-3 rounded-full animate-pulse ${statusStyle.dot}`} />
              <span className="text-xl font-black tracking-tight">{repair.status?.status_name}</span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Core Info */}
          <div className="lg:col-span-8 space-y-8">
            
            <SectionCard title="รายละเอียดงานซ่อม" icon={<Package className="w-5 h-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6">
                <InfoBox label="อาการเสียที่แจ้ง" value={repair.problem_description} icon={<Info className="w-4 h-4" />} />
                <InfoBox label="วันที่รับเครื่อง" value={formatDate(repair.receive_date)} icon={<Clock className="w-4 h-4" />} />
                
                {/* Price Section with better visual */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <PriceCard label="ราคาประเมินเบื้องต้น" amount={repair.estimate_price} color="text-slate-600" />
                  <PriceCard label="ยอดชำระสุทธิ" amount={repair.final_price} highlight color="text-blue-600" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="การแจ้งเตือนระบบ" icon={<Mail className="w-5 h-5" />}>
              {repair.notifications?.length ? (
                <div className="grid gap-3">
                  {repair.notifications.map((n) => (
                    <NotificationItem key={n.id} n={n} />
                  ))}
                </div>
              ) : (
                <EmptyState message="ไม่มีประวัติการส่งข้อความ" />
              )}
            </SectionCard>
          </div>

          {/* Right Side: Timeline */}
          <div className="lg:col-span-4">
            <SectionCard title="Timeline" icon={<History className="w-5 h-5" />}>
              {repair.timelines?.length ? (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-slate-100">
                  {repair.timelines.map((t) => (
                    <TimelineItem key={t.id} t={t} />
                  ))}
                </div>
              ) : (
                <EmptyState message="รอดำเนินการขั้นตอนแรก" />
              )}
            </SectionCard>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-shadow duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm leading-none">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoBox({ label, value, icon }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-base font-semibold text-slate-700 ml-6">
        {value || "-"}
      </p>
    </div>
  );
}

function PriceCard({ label, amount, highlight, color }) {
  return (
    <div className={`p-5 rounded-2xl border-2 ${highlight ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>
        {amount ? Number(amount).toLocaleString() : "---"} 
        <span className="text-sm ml-1.5 font-bold">THB</span>
      </p>
    </div>
  );
}

function TimelineItem({ t }) {
  const style = getStatusStyle(t.status?.status_name);
  return (
    <div className="relative pl-10 group">
      <div className={`absolute left-0 top-1.5 z-10 w-[24px] h-[24px] rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-110 ${style.dot}`} />
      <div className="space-y-1.5">
        <p className="text-sm font-bold text-slate-800 leading-none">{t.status?.status_name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(t.update_datetime).toLocaleString('th-TH')}</p>
        {t.note && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
            {t.note}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ n }) {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-blue-600 transition-colors">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-slate-700 text-sm">แจ้งผ่าน{n.channel === "email" ? "อีเมล" : n.channel}</p>
          <p className="text-[10px] text-slate-400 font-medium">{new Date(n.sent_datetime).toLocaleString('th-TH')}</p>
        </div>
      </div>
      <StatusTag isSent={n.notification_status === "sent"} />
    </div>
  );
}

function StatusTag({ isSent }) {
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
      isSent ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
    }`}>
      {isSent ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {isSent ? "Sent" : "Failed"}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center bg-slate-50/50 rounded-[1.5rem] border-2 border-dashed border-slate-100">
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

function ErrorState({ error, onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4">
      <div className="bg-white p-10 rounded-[2.5rem] text-center max-w-sm shadow-xl shadow-red-900/5 border border-red-50">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">เกิดข้อผิดพลาด</h3>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all font-bold shadow-lg shadow-slate-200"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}