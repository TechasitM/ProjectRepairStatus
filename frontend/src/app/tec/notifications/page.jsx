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
  Cpu,
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
  const getChannelIcon = (channel) => {
    switch (channel?.toLowerCase()) {
      case "email":
        return (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
            <Mail size={14} /> <span>Email</span>
          </div>
        );
      case "line":
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            <MessageSquare size={14} /> <span>Line</span>
          </div>
        );
      default:
        return <span className="text-gray-500">{channel}</span>;
    }
  };

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

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
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
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            รีเฟรชข้อมูล
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-6 py-5 border-b">
                    <div className="flex items-center gap-2">
                      <Hash size={12} /> รหัสงานซ่อม
                    </div>
                  </th>
                  <th className="px-6 py-5 border-b">ช่องทาง</th>
                  <th className="px-6 py-5 border-b">สถานะ</th>
                  <th className="px-6 py-5 border-b">
                    <div className="flex items-center gap-2">
                      <Clock size={12} /> วันที่ส่ง
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-blue-50/20 group">
                      {/* Repair Code */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-gray-800 tracking-tight">
                            {n.repairOrder?.repair_code
                              ? `#${n.repairOrder.repair_code}`
                              : `ID: ${n.repair_order_id}`}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                            REF-LOG: {n.id}
                          </span>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="px-6 py-5">
                        <div className="text-xs font-black uppercase tracking-wide text-gray-700">
                          {getChannelIcon(n.channel)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {n.notification_status === "sent" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">
                            <CheckCircle2 size={12} /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">
                            <XCircle size={12} /> Failed
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="text-gray-600 font-medium text-sm tracking-tight">
                          {n.sent_datetime
                            ? new Date(n.sent_datetime).toLocaleString(
                                "th-TH",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )
                            : "-"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-28">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div className="bg-gray-50 p-6 rounded-full border border-dashed border-gray-200">
                          <Inbox size={48} strokeWidth={1} />
                        </div>
                        <p className="font-black uppercase tracking-widest text-sm">
                          ไม่มีข้อมูลการแจ้งเตือน
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] text-right">
              แสดงข้อมูลล่าสุด {notifications.length} รายการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
