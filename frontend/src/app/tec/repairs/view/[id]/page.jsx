"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, User, Monitor, Laptop, Clock, 
  Printer, History, CheckCircle2, ShieldCheck,
  Calendar, Hash, AlertCircle, MapPin
} from "lucide-react";

export default function RepairViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [repair, setRepair] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await api.get(`/repairs/${id}`);
        setRepair(res.data.data || res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchRepair();
  }, [id]);

  const handlePrint = () => {
    window.print(); // สั่งพิมพ์หน้าจอ (เบื้องต้น)
  };

  if (isLoading) return (
    <div className="flex flex-col h-screen items-center justify-center gap-3 text-gray-400">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="font-bold">กำลังดึงข้อมูลใบรับซ่อม...</p>
    </div>
  );

  if (!repair) return <div className="p-10 text-center text-red-500 font-bold">ไม่พบข้อมูลงานซ่อม</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 print:p-0">
      {/* Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white border border-gray-100 rounded-2xl hover:text-blue-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">{repair.repair_code}</h1>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                VIEW MODE
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium">ดูรายละเอียดและประวัติการดำเนินการทั้งหมด</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Printer size={18} /> พิมพ์ใบรับซ่อม
          </button>
          <button 
            onClick={() => router.push(`/tec/repairs/update/${id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            แก้ไข/อัปเดตสถานะ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
                <div className={`px-4 py-2 rounded-xl border-2 font-black text-sm uppercase ${
                   repair.status?.id === 4 ? "border-emerald-500 text-emerald-500" : "border-blue-500 text-blue-500"
                }`}>
                   {repair.status?.status_name}
                </div>
             </div>

             <div className="space-y-8">
                {/* Customer Section */}
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <User size={14} className="text-blue-500" /> ข้อมูลผู้ส่งซ่อม
                  </h3>
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl">
                        {repair.customer?.customer_name?.charAt(0)}
                     </div>
                     <div>
                        <p className="font-black text-2xl text-gray-900 leading-none mb-1">{repair.customer?.customer_name}</p>
                        <p className="text-sm font-bold text-gray-500">📞 {repair.customer?.phone} | 📧 {repair.customer?.email}</p>
                     </div>
                  </div>
                </div>

                {/* Device Section */}
                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Monitor size={14} className="text-blue-500" /> อุปกรณ์ที่รับซ่อม
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repair.devices?.map((device) => (
                       <div key={device.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                          <div className="flex items-center gap-3 mb-2">
                             {device.device_type === 'desktop' ? <Monitor size={18} className="text-blue-600" /> : <Laptop size={18} className="text-blue-600" />}
                             <span className="font-black text-gray-800">{device.brand} {device.model}</span>
                          </div>
                          <p className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-1 rounded inline-block">SN: {device.serial_number}</p>
                       </div>
                    ))}
                  </div>
                  <div className="mt-6 p-5 bg-rose-50 rounded-2xl border border-rose-100">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                       <AlertCircle size={12} /> อาการเสียที่แจ้งไว้
                    </p>
                    <p className="font-bold text-rose-700 leading-relaxed">{repair.problem_description}</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Timeline History */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
            <h2 className="font-black text-gray-800 mb-8 flex items-center gap-2">
              <History size={20} className="text-blue-600" /> บันทึกประวัติการซ่อม
            </h2>
            <div className="relative ml-4 space-y-8 before:absolute before:inset-0 before:ml-1.5 before:w-0.5 before:bg-gray-100 before:h-full">
              {repair.timelines?.slice().reverse().map((t, idx) => (
                <div key={t.id} className="relative pl-10 group">
                  <div className={`absolute left-0 top-1 w-4 h-4 rounded-full ring-4 ring-white transition-all ${idx === 0 ? "bg-blue-600 scale-125 shadow-lg shadow-blue-200" : "bg-gray-300"}`}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 gap-2">
                    <div className="text-sm font-black text-gray-800">{t.status?.status_name}</div>
                    <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {new Date(t.update_datetime).toLocaleString("th-TH")}
                    </div>
                  </div>
                  {t.note && (
                    <div className="text-xs text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 font-medium leading-relaxed italic">
                      "{t.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-8">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-300" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none">วันที่รับงาน</p>
                    <p className="text-xs font-bold text-gray-800">{new Date(repair.receive_date).toLocaleDateString('th-TH')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="text-gray-300" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none">รหัสงานซ่อม</p>
                    <p className="text-xs font-bold text-blue-600 font-mono">{repair.repair_code}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Responsibility</h3>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Created By</p>
                    <p className="text-sm font-black text-gray-800">{repair.user?.name}</p>
                  </div>
               </div>
            </div>

            <div className="p-5 bg-blue-900 rounded-3xl text-white">
               <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Customer Agreement</p>
               <p className="text-[10px] font-medium leading-relaxed opacity-80 italic">
                 "ลูกค้ายินยอมให้ทางร้านดำเนินการตรวจสอบและเสนอราคา โดยความเสี่ยงจากการเปิดเครื่องที่มีความเสียหายอยู่ก่อนหน้าถือเป็นความรับผิดชอบของลูกค้า..."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}