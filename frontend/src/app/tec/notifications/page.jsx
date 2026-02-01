"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications")
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🔔 ประวัติการแจ้งเตือน
        </h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Repair</th>
                <th className="text-left px-4 py-3">Channel</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <tr key={n.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      #{n.repair?.repair_code ?? n.repair_id}
                    </td>
                    <td className="px-4 py-3">
                      {n.channel === "email" ? "📧 Email" : n.channel}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold
                          ${n.notification_status === "sent"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                      >
                        {n.notification_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {n.sent_datetime
                        ? new Date(n.sent_datetime).toLocaleString("th-TH")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    ไม่มีข้อมูลการแจ้งเตือน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
