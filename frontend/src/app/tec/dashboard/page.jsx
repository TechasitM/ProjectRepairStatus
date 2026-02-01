"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Pie, Line } from "react-chartjs-2";

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
  Filler
);

export default function DashboardPage() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/user-profile")
      .then((res) => {
        if (userRole(res.data.role)!== 1 && userRole !== 2) {
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">กำลังเตรียมข้อมูล...</p>
        </div>
      </div>
    );
  }

  // --- สรุปข้อมูลสำหรับ Card ---
  const totalRepairs = repairs.length;
  const pendingCount = repairs.filter(r => r.status?.status_name === "กำลังซ่อม").length;
  const completedCount = repairs.filter(r => r.status?.status_name === "ซ่อมเสร็จแล้ว").length;

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
          "#3B82F6", // blue
          "#F59E0B", // amber
          "#10B981", // emerald
          "#EF4444", // red
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
        data: sortedDates.map(d => dateCount[d]),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3B82F6",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">ระบบจัดการข้อมูลการแจ้งซ่อมอุปกรณ์</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="งานซ่อมทั้งหมด" 
            value={totalRepairs} 
            color="text-blue-600" 
            bg="bg-blue-50"
            svgPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
          <StatCard 
            label="รอดำเนินการ" 
            value={pendingCount} 
            color="text-orange-600" 
            bg="bg-orange-50"
            svgPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <StatCard 
            label="เสร็จสิ้นแล้ว" 
            value={completedCount} 
            color="text-green-600" 
            bg="bg-green-50"
            svgPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6">สถานะงานซ่อม</h3>
            <div className="h-64">
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6">แนวโน้มงานซ่อมรายวัน</h3>
            <div className="h-64">
              <Line 
                data={lineData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component สำหรับ Card (ใช้ SVG แทน Icon library)
function StatCard({ label, value, color, bg, svgPath }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md">
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mr-4`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}