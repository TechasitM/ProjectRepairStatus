"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { 
  ArrowLeft, Laptop, Monitor, Cpu, Calendar, 
  User, Hash, HardDrive, Wrench, Clock, CheckCircle2 
} from "lucide-react";

export default function DeviceViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceDetail = async () => {
      try {
        const res = await api.get(`/devices/${id}`);
        setDevice(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeviceDetail();
  }, [id]);

if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4 bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <Cpu
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"
            size={24}
          />
        </div>
        <p className="font-bold text-gray-500 animate-pulse tracking-wide uppercase text-xs">
          Loading...
        </p>
      </div>
    );
  }

  if (!device) return <div className="p-10 text-center text-rose-500 font-bold">ไม่พบข้อมูลอุปกรณ์</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">Device Details</h1>
            <p className="text-sm text-gray-500 font-medium">รายละเอียดและประวัติการซ่อมของเครื่องนี้</p>
          </div>
        </div>
        <button 
          onClick={() => router.push(`/tec/devices/edit/${id}`)}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-gray-200"
        >
          แก้ไขข้อมูลเครื่อง
        </button>
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Device Info Card */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
            {/* Background Icon Animation */}
            <div className="absolute -right-4 -top-4 text-gray-50/50 group-hover:text-blue-50 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
              {device.device_type === 'desktop' ? <Monitor size={150} /> : <Laptop size={150} />}
            </div>
            
            <div className="relative space-y-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 ${device.device_type === 'desktop' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'}`}>
                {device.device_type === 'desktop' ? <Monitor size={28} /> : <Laptop size={28} />}
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand / Model</p>
                <h2 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{device.brand}</h2>
                <p className="text-lg font-bold text-blue-600 opacity-80">{device.model}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm group/item">
                  <Hash size={16} className="text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                  <span className="font-mono font-bold text-gray-600">{device.serial_number || 'No Serial'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <User size={16} className="text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                  <span className="font-bold text-gray-700">{device.customer?.customer_name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 group hover:-translate-y-1 transition-all duration-500">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-300 mb-4 flex items-center gap-2">
              <HardDrive size={16} className="group-hover:animate-bounce" /> Specifications
            </h3>
            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap italic opacity-90">
              {device.details || "ไม่ได้ระบุสเปคเครื่อง"}
            </p>
          </div>
        </div>

        {/* Right: Repair History Timeline */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
            <Wrench size={22} className="text-blue-600" /> ประวัติการซ่อม (Repair History)
          </h3>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-gray-100 before:to-transparent">
            {device.repair_orders?.length > 0 ? (
              device.repair_orders.map((repair, index) => (
                <div 
                  key={repair.id} 
                  className="relative flex items-start gap-8 group transition-all duration-300"
                >
                  <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all duration-500 z-10 ${index === 0 ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                    {index === 0 ? <Clock size={16} className="animate-pulse" /> : <CheckCircle2 size={16} />}
                  </div>
                  
                  <div className="flex-1 bg-gray-50/50 p-5 rounded-2xl group-hover:bg-white group-hover:shadow-lg group-hover:shadow-gray-100 transition-all duration-300 border border-transparent group-hover:border-blue-100 mb-2">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-2">
                      <span className="text-xs font-black text-blue-600 font-mono tracking-tighter uppercase">{repair.repair_code}</span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                        <Calendar size={12} /> {new Date(repair.receive_date).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">{repair.problem_description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-500 uppercase group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                        {repair.status?.status_name || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium italic">ยังไม่เคยมีประวัติการซ่อม</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}