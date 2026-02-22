"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "@/services/api";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function TecDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  const { summary, chart } = data;

  const chartData = {
    labels: chart.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: chart.map((item) => item.total),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const percentColor =
    summary.percent >= 100
      ? "bg-green-500"
      : summary.percent >= 70
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="p-6 space-y-6">

      {/* 🔵 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white shadow rounded-2xl p-5">
          <p className="text-sm text-gray-500">Revenue This Month</p>
          <h2 className="text-2xl font-bold">
            ฿{summary.monthly_revenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white shadow rounded-2xl p-5">
          <p className="text-sm text-gray-500">Target</p>
          <h2 className="text-2xl font-bold">
            ฿{summary.target.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white shadow rounded-2xl p-5">
          <p className="text-sm text-gray-500">Jobs This Month</p>
          <h2 className="text-2xl font-bold">
            {summary.monthly_jobs}
          </h2>
        </div>

        <div className="bg-white shadow rounded-2xl p-5">
          <p className="text-sm text-gray-500">Pending Jobs</p>
          <h2 className="text-2xl font-bold">
            {summary.pending_jobs}
          </h2>
        </div>

      </div>

      {/* 🟢 Progress Bar */}
      <div className="bg-white shadow rounded-2xl p-5">
        <p className="text-sm text-gray-500 mb-2">
          Target Achievement ({summary.percent}%)
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`${percentColor} h-4 rounded-full transition-all`}
            style={{ width: `${Math.min(summary.percent, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 📊 Chart */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4">
          Revenue Last 6 Months
        </h3>
        <Bar data={chartData} />
      </div>

    </div>
  );
}