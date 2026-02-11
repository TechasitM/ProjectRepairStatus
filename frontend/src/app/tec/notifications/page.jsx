"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  Inbox,
  RefreshCcw,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api
      .get("/notifications")
      .then((res) =>
        setNotifications(
          Array.isArray(res.data) ? res.data : res.data.data || [],
        ),
      )
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Helper สำหรับเลือก Icon ตาม Channel
  const getChannelBadge = (channel) => {
    const isEmail = channel?.toLowerCase() === "email";
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
        isEmail ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-gray-50 text-gray-700 border-gray-200"
      } text-[11px] font-bold uppercase tracking-wide`}>
        {isEmail ? <Mail size={12} /> : <MessageSquare size={12} />}
        <span>{channel}</span>
      </div>
    );
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
    <div className="min-h-screen p-6 font-sans">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600 border border-gray-100">
              <Bell size={28} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                ประวัติการแจ้งเตือน
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">
                บันทึกการส่งข้อมูลสถานะงานซ่อมไปยังลูกค้า
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            รีเฟรชข้อมูล
          </button>
        </div>

        {/* Table Content */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2 italic">
                      <Hash size={13} /> รหัสงานซ่อม
                    </div>
                  </th>
                  <th className="px-6 py-4 border-b">ช่องทาง</th>
                  <th className="px-6 py-4 border-b text-center">สถานะการส่ง</th>
                  <th className="px-6 py-4 border-b text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Clock size={13} /> วันที่-เวลา
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Repair Order Code */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-900">
                            {n.repairOrder?.repair_code
                              ? `#${n.repairOrder.repair_code}`
                              : `ID: ${n.repair_order_id}`}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            Log ID: {n.id}
                          </span>
                        </div>
                      </td>

                      {/* Channel Badge */}
                      <td className="px-6 py-4">
                        {getChannelBadge(n.channel)}
                      </td>

                      {/* Status with Subtle Colors */}
                      <td className="px-6 py-4 text-center">
                        {n.notification_status === "sent" ? (
                          <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-bold px-2 py-0.5 rounded-md bg-green-50 border border-green-100">
                            <CheckCircle2 size={12} /> สำเร็จ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-500 text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 border border-red-100">
                            <XCircle size={12} /> ล้มเหลว
                          </span>
                        )}
                      </td>

                      {/* Datetime */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-gray-600 text-sm font-medium">
                          {n.sent_datetime
                            ? new Date(n.sent_datetime).toLocaleString("th-TH", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Inbox size={40} strokeWidth={1.5} className="opacity-20" />
                        <p className="text-sm font-medium italic">ไม่พบประวัติการแจ้งเตือน</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Total: {notifications.length} Records
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
