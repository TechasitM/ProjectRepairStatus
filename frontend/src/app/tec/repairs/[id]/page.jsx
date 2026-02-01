"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useParams } from "next/navigation";

export default function RepairDetailTecPage() {
  const { id } = useParams();
  const [repair, setRepair] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repairRes, statusRes] = await Promise.all([
          api.get(`/repairs/${id}`),
          api.get("/statuses"),
        ]);
        setRepair(repairRes.data);
        setStatuses(statusRes.data);
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถดึงข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const updateStatus = async () => {
    if (!newStatus || isUpdating) return;
    setIsUpdating(true);

    try {
      const response = await api.patch(`/repairs/${repair.id}/status`, {
        status_id: newStatus,
        note: note,
      });

      // รับข้อมูลที่อัปเดตแล้วจาก Backend มาโชว์ทันที
      setRepair(response.data.data);
      setNewStatus("");
      setNote("");
      alert("อัปเดตสถานะและส่งอีเมลแจ้งลูกค้าเรียบร้อยแล้ว");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <p className="p-6 text-center">กำลังโหลดข้อมูล...</p>;
  if (!repair)
    return <p className="p-6 text-center text-red-500">ไม่พบข้อมูล</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">งานซ่อม {repair.repair_code}</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
          {repair.status?.status_name}
        </span>
      </div>
      
      {/* ข้อมูลลูกค้าและอุปกรณ์ */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            ข้อมูลลูกค้า
          </h3>
          <p className="font-bold text-lg text-gray-800">
            {repair.customer?.customer_name}
          </p>
          <p className="text-gray-600 text-sm">📞 {repair.customer?.phone}</p>
          <p className="text-gray-600 text-sm">📧 {repair.customer?.email}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            อุปกรณ์ที่ซ่อม
          </h3>
          <p className="font-bold text-lg text-gray-800">
            {repair.device?.brand} {repair.device?.model}
          </p>
          <p className="text-sm text-blue-600 font-mono">
            S/N: {repair.device?.serial_number}
          </p>
          <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
            <strong>อาการ:</strong> {repair.problem_description}
          </p>
        </div>
      </div>

      {/* อัปเดตสถานะ */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="font-semibold text-gray-700">
          อัปเดตสถานะและแจ้งเตือนลูกค้า
        </h2>
        <div className="grid gap-4">
          <select
            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            disabled={isUpdating}
          >
            <option value="">-- เลือกสถานะใหม่ --</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.status_name}
              </option>
            ))}
          </select>

          <textarea
            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="เขียนโน้ตถึงลูกค้า (จะแนบไปในอีเมล)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="2"
          />

          <button
            onClick={updateStatus}
            disabled={isUpdating || !newStatus}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all
              ${isUpdating || !newStatus ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isUpdating ? "กำลังประมวลผล..." : "บันทึกและส่งแจ้งเตือน"}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-6">ประวัติการดำเนินการ (Timeline)</h2>
        <div className="border-l-2 border-gray-100 ml-4 space-y-8">
          {repair.timelines
            ?.slice()
            .reverse()
            .map((t) => (
              <div key={t.id} className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-white"></div>
                <div className="text-sm font-bold">{t.status?.status_name}</div>
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(t.update_datetime).toLocaleString("th-TH")}
                </div>
                {t.note && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {t.note}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
