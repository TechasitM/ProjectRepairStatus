export function getStatusStyle(status) {
  const styles = {
    "รับเครื่อง": {
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-500 ring-4 ring-slate-100",
    },
    "กำลังซ่อม": {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-600 ring-4 ring-blue-100",
    },
    "รออะไหล่": {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500 ring-4 ring-amber-100",
    },
    "กำลังดำเนินการ": {
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dot: "bg-indigo-500 ring-4 ring-indigo-100",
    },
    "ซ่อมเสร็จแล้ว": {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500 ring-4 ring-emerald-100",
    },
    "ยกเลิก": {
      badge: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500 ring-4 ring-red-100",
    },
  };

  // ค่า Default หากไม่ตรงกับสถานะใดเลย
  return styles[status] || {
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400 ring-4 ring-gray-100",
  };
}