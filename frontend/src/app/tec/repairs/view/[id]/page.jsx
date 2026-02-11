"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Cpu } from "lucide-react";

export default function RepairViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [repair, setRepair] = useState(null);
  const [loading, setIsLoading] = useState(true);

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
    window.print();
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
      <div className="p-10 text-center text-red-500 font-bold">
        ไม่พบข้อมูลงานซ่อม
      </div>
    );

  return (
    <div className="p-6 mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {repair.repair_code}
            </h1>
            <p className="text-xs text-gray-400">รายละเอียดงานซ่อม</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            พิมพ์ใบรับซ่อม
          </button>

          <button
            onClick={() => router.push(`/tec/repairs/update/${id}`)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            อัปเดตสถานะ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-8">
            {/* Status Badge */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                สถานะปัจจุบัน
              </span>
              <span className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                {repair.status?.status_name}
              </span>
            </div>

            {/* Customer */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                ผู้ส่งซ่อม
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-slate-800">
                  {repair.customer?.customer_name}
                </p>
                <p>{repair.customer?.phone}</p>
                <p>{repair.customer?.email}</p>
              </div>
            </div>

            {/* Device */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                อุปกรณ์ที่รับซ่อม
              </h3>

              <div className="space-y-3">
                {repair.devices?.map((device) => (
                  <div
                    key={device.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm"
                  >
                    <div className="font-medium text-slate-800">
                      {device.brand} {device.model}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-1">
                      SN: {device.serial_number}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-xs text-rose-500 uppercase mb-1">
                  อาการเสียที่แจ้งไว้
                </p>
                <p className="text-sm text-rose-700">
                  {repair.problem_description}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-6">
              ประวัติการอัปเดตสถานะ
            </h2>

            <div className="space-y-6 border-l border-gray-200 pl-6">
              {repair.timelines
                ?.slice()
                .reverse()
                .map((t) => (
                  <div key={t.id} className="space-y-1">
                    <div className="text-sm font-medium text-slate-800">
                      {t.status?.status_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(t.update_datetime).toLocaleString("th-TH")}
                    </div>
                    {t.note && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                        {t.note}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                ข้อมูลสรุป
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    วันที่รับงาน
                  </p>
                  <p className="text-slate-800 font-medium">
                    {new Date(repair.receive_date).toLocaleDateString("th-TH")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">รหัสงานซ่อม</p>
                  <p className="font-mono text-blue-600">
                    {repair.repair_code}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    ผู้รับผิดชอบ
                  </p>
                  <p className="text-slate-800 font-medium">
                    {repair.user?.user_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed">
                ลูกค้ายินยอมให้ทางร้านดำเนินการตรวจสอบและเสนอราคา
                โดยความเสี่ยงจากการเปิดเครื่องที่มีความเสียหายอยู่ก่อนหน้าถือเป็นความรับผิดชอบของลูกค้า
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
