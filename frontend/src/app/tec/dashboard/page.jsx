"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Cpu,
  Clock,
  Wrench,
  PackageSearch,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function TechDashboardPage() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/user-profile")
      .then((res) => {
        const userRole = Number(res.data.role);
        // อนุญาตทั้ง Admin (1) และ Tech (2) แต่หน้าตาจะเน้นการทำงานของ Tech
        if (userRole !== 1 && userRole !== 2) {
          Swal.fire(
            "สิทธิ์ไม่ถูกต้อง",
            "คุณไม่มีสิทธิ์เข้าถึงหน้าช่างเทคนิค",
            "error",
          );
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
      <div className="flex flex-col h-[70vh] items-center justify-center gap-3 bg-gray-50/30">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Loading
        </p>
      </div>
    );
  }

  // --- กรองข้อมูลสำหรับช่าง ---
  const inProgress = repairs.filter(
    (r) => r.status?.status_name === "กำลังซ่อม",
  );
  const waitingParts = repairs.filter(
    (r) => r.status?.status_name === "รออะไหล่",
  );
  const pendingQueue = repairs.filter(
    (r) => r.status?.status_name === "รอดำเนินการ",
  );

  // งานที่ต้องโฟกัส (กำลังซ่อม + รอดำเนินการ) เรียงตามวันที่เก่าสุดไปใหม่สุด
  const focusTasks = [...inProgress, ...pendingQueue].sort(
    (a, b) => new Date(a.receive_date) - new Date(b.receive_date),
  );

  return (
    <div className="w-full min-h-screen p-6 font-sans">
      <div className="mx-auto space-y-6">
        {/* Header สำหรับ Tech */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Technician Workspace
            </h1>
            <p className="text-sm text-gray-500">
              จัดการงานซ่อมและติดตามสถานะอะไหล่
            </p>
          </div>
          <div className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            ช่างเทคนิคพร้อมปฏิบัติงาน
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TechStatCard
            label="กำลังดำเนินการ"
            value={inProgress.length}
            icon={<Wrench size={20} />}
            color="bg-blue-600"
          />
          <TechStatCard
            label="รออะไหล่"
            value={waitingParts.length}
            icon={<PackageSearch size={20} />}
            color="bg-orange-500"
          />
          <TechStatCard
            label="คิวงานรอดำเนินการ"
            value={pendingQueue.length}
            icon={<Clock size={20} />}
            color="bg-purple-500"
          />
          <TechStatCard
            label="ซ่อมเสร็จวันนี้"
            value={
              repairs.filter(
                (r) =>
                  r.status?.status_name === "ซ่อมเสร็จแล้ว" &&
                  new Date(r.updated_at).toDateString() ===
                    new Date().toDateString(),
              ).length
            }
            icon={<CheckCircle2 size={20} />}
            color="bg-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ตารางงานหลักที่ต้องทำ (FIFO) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                ลำดับงานที่ต้องจัดการ (เรียงตามวันรับเครื่อง)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-[11px] uppercase text-gray-400 font-bold">
                  <tr>
                    <th className="px-6 py-3 text-left">Code</th>
                    <th className="px-6 py-3 text-left">อาการเสีย</th>
                    <th className="px-6 py-3 text-left">วันที่รับ</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {focusTasks.slice(0, 8).map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-blue-600">
                          {r.repair_code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                          {r.symptom || r.description}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            r.status?.status_name === "กำลังซ่อม"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {r.status?.status_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(r.receive_date).toLocaleDateString("th-TH")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            router.push(`/tec/repairs/update/${r.id}`)
                          }
                          className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          อัปเดตงาน
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {focusTasks.length === 0 && (
                <div className="p-10 text-center text-gray-400 italic text-sm">
                  ยินดีด้วย! ไม่มีงานค้างในคิว
                </div>
              )}
            </div>
          </div>

          {/* รายการรออะไหล่ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PackageSearch size={18} className="text-orange-500" />
              รายการรออะไหล่
            </h3>
            <div className="space-y-3">
              {waitingParts.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-orange-50 rounded-xl border border-orange-100"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-orange-700">
                      {r.repair_code}
                    </span>
                    <span className="text-[10px] text-orange-500">
                      {new Date(r.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium truncate">
                    {r.symptom}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 italic">
                    * {r.internal_notes || "กำลังตรวจสอบรุ่นอะไหล่..."}
                  </p>
                </div>
              ))}
              {waitingParts.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-10">
                  ไม่มีรายการรออะไหล่
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component เฉพาะสำหรับหน้า Tech
function TechStatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div
        className={`${color} p-3 rounded-xl text-white shadow-lg shadow-gray-200`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 leading-none">
          {value}
        </p>
        <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}
