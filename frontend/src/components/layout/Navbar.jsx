import Link from 'next/link';

export default function Navbar() {
  // สมมติค่าตัวแปร (ในงานจริงค่านี้จะมาจาก useContext, Redux หรือ Auth Library)
  const isLoggedIn = false; 

  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
        display: "flex",
        justifyContent: "space-between", // จัดให้โลโก้อยู่ซ้าย เมนูอยู่ขวา
        alignItems: "center"
      }}
    >
      <Link href="/">
        <b>🔧 ร้านซ่อมคอมพิวเตอร์</b>
      </Link>

      <div style={{ display: "flex", gap: "15px" }}>
        {/* เมนูที่ทุกคนเห็น */}
        <Link href="/services">บริการของเรา</Link>

        {/* ตรวจสอบสถานะการ Login */}
        {!isLoggedIn ? (
          // ถ้ายังไม่ Login ให้แสดงปุ่มนี้
          <Link href="/login" style={{ color: "blue" }}>เข้าสู่ระบบ</Link>
        ) : (
          // ถ้า Login แล้ว ให้แสดงเมนูสำหรับสมาชิก
          <>
            <Link href="/dashboard">แจ้งซ่อม</Link>
            <button 
              onClick={() => alert('Logout logic here')}
              style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
            >
              ออกจากระบบ
            </button>
          </>
        )}
      </div>
    </nav>
  );
}