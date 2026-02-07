"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Pie, Line } from "react-chartjs-2";
import { Cpu,} from 'lucide-react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
);

export default function DashboardPage() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/user-profile")
      .then((res) => {
        if (Number(res.data.role) !== 1) {
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
        console.error("ตรวจสอบพบข้อผิดพลาด:", err.response);
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
  // --- สรุปข้อมูลสำหรับ Card ---
  const totalRepairs = repairs.length;
  const pendingCount = repairs.filter(
    (r) =>
      r.status?.status_name === "กำลังซ่อม" ||
      r.status?.status_name === "รอดำเนินการ",
  ).length;
  const completedCount = repairs.filter(
    (r) => r.status?.status_name === "ซ่อมเสร็จแล้ว",
  ).length;

  // --- เตรียมข้อมูลกราฟ ---
  const statusCount = {};
  repairs.forEach((r) => {
    const status = r.status?.status_name || "ไม่ระบุ";
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: [
          "#3B82F6",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#8B5CF6",
        ],
        hoverOffset: 10,
      },
    ],
  };

  const dateCount = {};
  repairs.forEach((r) => {
    const date = r.receive_date?.substring(0, 10);
    if (date) dateCount[date] = (dateCount[date] || 0) + 1;
  });
  const sortedDates = Object.keys(dateCount).sort();
  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: "จำนวนงานซ่อม",
        data: sortedDates.map((d) => dateCount[d]),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3B82F6",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  // --- วิเคราะห์อาการเสียยอดฮิต ---
  const symptomCount = {};
  repairs.forEach((r) => {
    const symptom = r.symptom || r.description || "ไม่ระบุอาการ";
    symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
  });
  const topSymptoms = Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // --- ข้อมูลงานรอดำเนินการ (5 รายการล่าสุด) ---
  const pendingRepairs = repairs
    .filter(
      (r) =>
        r.status?.status_name === "รอดำเนินการ" ||
        r.status?.status_name === "กำลังซ่อม",
    )
    .reverse()
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            ภาพรวมสถิติและสถานะการดำเนินงาน
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            label="งานซ่อมทั้งหมด"
            value={totalRepairs}
            color="text-blue-600"
            bg="bg-blue-50"
            svgPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
          <StatCard
            label="งานค้าง/กำลังซ่อม"
            value={pendingCount}
            color="text-orange-600"
            bg="bg-orange-50"
            svgPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <StatCard
            label="ซ่อมเสร็จสิ้น"
            value={completedCount}
            color="text-green-600"
            bg="bg-green-50"
            svgPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
              📊 สัดส่วนสถานะ
            </h3>
            <div className="h-64">
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
              📈 แนวโน้มการรับงาน
            </h3>
            <div className="h-64">
              <Line
                data={lineData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Reports & Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Symptoms */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
              🔥 อาการเสียยอดฮิต (Top 5)
            </h3>
            <div className="space-y-5">
              {topSymptoms.map(([name, count], index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{name}</span>
                    <span className="text-blue-600 font-bold">{count} งาน</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / totalRepairs) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks Table */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                ⏳ งานรอดำเนินการล่าสุด
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-gray-400 font-bold border-b">
                  <tr>
                    <th className="pb-3">รหัสงาน</th>
                    <th className="pb-3">อาการ</th>
                    <th className="pb-3 text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {pendingRepairs.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 font-bold text-blue-600">
                        {r.repair_code}
                      </td>
                      <td className="py-3 text-gray-500 truncate max-w-[120px]">
                        {r.symptom || r.description}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold ${r.status?.status_name === "กำลังซ่อม" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                        >
                          {r.status?.status_name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg, svgPath }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md">
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
          <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
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
