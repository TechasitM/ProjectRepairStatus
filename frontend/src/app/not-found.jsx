import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1 style={{ fontSize: 48 }}>404</h1>
      <h2>ไม่พบข้อมูลที่คุณค้นหา</h2>

      <p style={{ color: "#6b7280" }}>
        กรุณาตรวจสอบหมายเลขงานซ่อมหรือเบอร์โทรอีกครั้ง
      </p>

      <Link href="/">
        <button
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          กลับหน้าแรก
        </button>
      </Link>
    </div>
  );
}
