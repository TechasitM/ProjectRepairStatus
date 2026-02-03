"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Bell,
  ArrowLeft,
} from "lucide-react";

/* ===============================
   Status Color Helper
================================ */
function getStatusStyle(status) {
  switch (status) {
    case "รอซ่อม":
      return {
        badge: "bg-yellow-50 text-yellow-700",
        dot: "bg-yellow-500 ring-yellow-100",
      };

    case "กำลังซ่อม":
      return {
        badge: "bg-blue-50 text-blue-700",
        dot: "bg-blue-500 ring-blue-100",
      };

    case "เสร็จแล้ว":
      return {
        badge: "bg-green-50 text-green-700",
        dot: "bg-green-500 ring-green-100",
      };

    default:
      return {
        badge: "bg-gray-100 text-gray-600",
        dot: "bg-gray-400 ring-gray-100",
      };
  }
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

  /* ---------- Loading ---------- */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  /* ---------- Error ---------- */
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );

  const statusStyle = getStatusStyle(repair.status?.status_name);

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          ค้นหารหัสอื่น
        </button>

        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                ติดตามสถานะงานซ่อม
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                รหัสงาน:{" "}
                <span className="text-gray-600">
                  {repair.repair_code}
                </span>
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${statusStyle.badge}`}
            >
              <Clock className="w-4 h-4" />
              {repair.status?.status_name}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info */}
            <Card title="ข้อมูลงานซ่อม">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">อาการเสีย</p>
                  <p className="text-gray-700">
                    {repair.problem_description || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">วันที่รับเครื่อง</p>
                  <p className="text-gray-700">
                    {repair.receive_date
                      ? new Date(repair.receive_date).toLocaleDateString("th-TH")
                      : "-"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card title="การแจ้งเตือน">
              {repair.notifications?.length ? (
                <ul className="space-y-3">
                  {repair.notifications.map((n) => {
                    const isSent = n.notification_status === "sent";
                    return (
                      <li
                        key={n.id}
                        className="flex justify-between items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50"
                      >
                        <div>
                          <p className="flex items-center gap-2 text-gray-700 text-sm">
                            <Mail className="w-4 h-4" />
                            {n.channel === "email" ? "อีเมล" : n.channel}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {n.sent_datetime
                              ? new Date(n.sent_datetime).toLocaleString("th-TH")
                              : "-"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                            isSent
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isSent ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {isSent ? "ส่งแล้ว" : "ล้มเหลว"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">ยังไม่มีการแจ้งเตือน</p>
              )}
            </Card>
          </div>

          {/* Right */}
          <Card title="ประวัติการดำเนินการ">
            {repair.timelines?.length ? (
              <div className="space-y-6">
                {repair.timelines.map((t, index) => {
                  const timelineStyle = getStatusStyle(
                    t.status?.status_name
                  );

                  return (
                    <div key={t.id} className="relative pl-6">
                      {index !== repair.timelines.length - 1 && (
                        <div className="absolute left-[7px] top-6 h-full w-px bg-gray-200" />
                      )}

                      <div
                        className={`absolute left-0 top-1 w-4 h-4 rounded-full ring-4 ${timelineStyle.dot}`}
                      />

                      <p className="text-sm font-medium text-gray-800">
                        {t.status?.status_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.update_datetime).toLocaleString("th-TH")}
                      </p>

                      {t.note && (
                        <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border">
                          <strong>หมายเหตุ:</strong> {t.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                ยังไม่มีประวัติการดำเนินการ
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Card ---------- */
function Card({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Bell className="w-4 h-4 text-blue-500" />
        {title}
      </h3>
      {children}
    </div>
  );
}
