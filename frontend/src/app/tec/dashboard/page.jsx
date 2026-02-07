"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Cpu,
} from "lucide-react";

export default function DashboardPage() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/user-profile")
      .then((res) => {
        const userRole = Number(res.data.role);
        // ตรวจสอบว่าถ้าไม่ใช่ Role 1 และไม่ใช่ Role 2 ให้ดีดออก
        if (userRole !== 1 && userRole !== 2) {
          Swal.fire("สิทธิ์ไม่ถูกต้อง", "คุณไม่ใช่ผู้ดูแลระบบ", "error");
          router.push("/");
          return;
        }
        return api.get("/repairs");
      })
      .then((res) => {
        if (res) {
          setRepairs(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [router]);

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


  // --- 1. คำนวณจำนวนงานรอดำเนินการ ---
  const pendingRepairs = repairs.filter(
    (r) =>
      r.status?.status_name === "รอดำเนินการ" ||
      r.status?.status_name === "กำลังซ่อม",
  );

  // --- 2. วิเคราะห์อาการเสียยอดฮิต ---
  const symptomCount = {};
  repairs.forEach((r) => {
    const symptom = r.symptom || r.description || "ไม่ระบุอาการ";
    symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
  });
  const topSymptoms = Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            สรุปภาพรวมงานซ่อม
          </h1>
        </header>

        {/* 1. จำนวนงานทั้งหมด & รอดำเนินการ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            label="งานซ่อมทั้งหมดในระบบ"
            value={repairs.length}
            color="text-blue-600"
            bg="bg-blue-50"
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
          <StatCard
            label="จำนวนงานที่รอดำเนินการ"
            value={pendingRepairs.length}
            color="text-orange-600"
            bg="bg-orange-50"
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. อาการเสียยอดฮิต */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              🔥 อาการเสียยอดฮิต (Top 5)
            </h3>
            <div className="space-y-4">
              {topSymptoms.map(([name, count], index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate">{name}</span>
                    <span className="font-bold text-gray-900">{count} งาน</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / (repairs.length || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. รายการงานที่รอดำเนินการล่าสุด */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              ⏳ งานรอดำเนินการ (5 รายการล่าสุด)
            </h3>
            <div className="overflow-hidden">
              <table className="w-full text-left">
                <thead className="text-[11px] uppercase text-gray-400 border-b">
                  <tr>
                    <th className="pb-2">รหัสงาน</th>
                    <th className="pb-2">อาการ</th>
                    <th className="pb-2 text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {pendingRepairs.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 font-semibold text-blue-600">
                        {r.repair_code}
                      </td>
                      <td className="py-3 text-gray-500 truncate max-w-[150px]">
                        {r.symptom || r.description}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status?.status_name === "กำลังซ่อม"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {r.status?.status_name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingRepairs.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-4">
                  ไม่มีงานค้างในขณะนี้
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component สำหรับ Card สถิติ
function StatCard({ label, value, color, bg, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
      <div
        className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mr-4`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
