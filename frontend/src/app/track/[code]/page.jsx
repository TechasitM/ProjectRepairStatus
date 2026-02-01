"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";

export default function TrackRepairPage() {
  const params = useParams();
  const router = useRouter();
  const keyword = params.code;

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRepairData = useCallback(async () => {
    try {
      setLoading(true);
      const isPhone = /^[0-9]{9,10}$/.test(keyword);
      const url = isPhone ? `/repairs/phone/${keyword}` : `/repairs/${keyword}`;
      const response = await api.get(url);
      setRepair(response.data);
    } catch (err) {
      setError("ไม่พบข้อมูลงานซ่อมในระบบ กรุณาตรวจสอบรหัสอีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    if (keyword) fetchRepairData();
  }, [keyword, fetchRepairData]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-red-600 text-xl font-bold mb-4">{error}</h2>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-t-xl shadow-sm p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">สถานะงานซ่อม</h1>
              <p className="text-gray-500 text-sm">
                รหัสงาน: {repair?.repair_code}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {repair?.status?.status_name}
            </span>
          </div>
        </div>
        {/* Notification Section */}
        <div className="bg-white mt-4 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            🔔 การแจ้งเตือน
          </h2>

          {repair?.notifications?.length > 0 ? (
            <ul className="space-y-3">
              {repair.notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex justify-between items-start p-4 rounded-lg border
            ${
              n.notification_status === "sent"
                ? "bg-green-50 border-green-100"
                : "bg-red-50 border-red-100"
            }`}
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {n.channel === "email" ? "📧 Email" : n.channel}
                    </p>
                    <p className="text-xs text-gray-500">
                      {n.sent_datetime
                        ? new Date(n.sent_datetime).toLocaleString("th-TH")
                        : "-"}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full
              ${
                n.notification_status === "sent"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
                  >
                    {n.notification_status === "sent" ? "ส่งแล้ว" : "ล้มเหลว"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">
              🔕 ยังไม่มีการแจ้งเตือน
            </p>
          )}

          {/* Info Detail */}
          <div className="bg-white p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  อาการเสีย
                </label>
                <p className="text-gray-700">{repair?.problem_description}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  วันที่รับเครื่อง
                </label>
                <p className="text-gray-700">
                  {repair?.receive_date
                    ? new Date(repair.receive_date).toLocaleDateString("th-TH")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Timeline Section */}
        <div className="bg-white mt-4 rounded-b-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            ประวัติการดำเนินการ
          </h2>
          <div className="relative">
            {repair?.timelines?.length > 0 ? (
              repair.timelines.map((item, index) => (
                <div key={item.id} className="relative pl-8 pb-8 last:pb-0">
                  {/* Line */}
                  {index !== repair.timelines.length - 1 && (
                    <div className="absolute left-[11px] top-7 w-[2px] h-full bg-blue-100"></div>
                  )}
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      {item.status?.status_name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(item.update_datetime).toLocaleString("th-TH")}
                    </p>
                    {item.note && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong>หมายเหตุ:</strong> {item.note}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">
                ยังไม่มีประวัติสถานะ
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full text-center text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          ← ค้นหารหัสอื่น
        </button>
      </div>
    </div>
  );
}
