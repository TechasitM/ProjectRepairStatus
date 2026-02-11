"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { DollarSign, Clock, AlertCircle, TrendingUp } from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/admin/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Data for Pie Chart
  const pieData = {
    labels: stats.jobStatus?.map((s) => s.status_name) || [],
    datasets: [
      {
        data: stats.jobStatus?.map((s) => s.repair_orders_count) || [],
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#8b5cf6",
          "#10b981",
          "#ef4444",
        ],
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: stats.commonIssues?.map((i) => i.problem_description) || [],
    datasets: [
      {
        label: "จำนวนครั้ง",
        data: stats.commonIssues?.map((i) => i.total) || [],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
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

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Business Insight & Overview</p>
      </header>

      {/* --- Top Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="รายได้วันนี้"
          value={`฿${(stats?.revenue?.daily ?? 0).toLocaleString()}`}
          icon={<TrendingUp size={20} />}
          color="text-green-600"
        />
        <StatCard
          title="รายได้เดือนนี้"
          value={`฿${(stats?.revenue?.monthly ?? 0).toLocaleString()}`}
          icon={<DollarSign size={20} />}
          color="text-blue-600"
        />
        <StatCard
          title="เวลาซ่อมเฉลี่ย"
          value={`${stats?.avgDays ?? 0} วัน`}
          icon={<Clock size={20} />}
          color="text-orange-600"
        />
        <StatCard
          title="รายได้รวมทั้งหมด"
          value={`฿${(stats?.revenue?.total ?? 0).toLocaleString()}`}
          icon={<AlertCircle size={20} />}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Status Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
            สรุปสถานะงาน (Job Status)
          </h2>
          <div className="h-[300px] flex justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>5
            อันดับอาการเสียยอดฮิต
          </h2>
          <div className="h-[300px]">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                indexAxis: "y",
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          {title}
        </p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
