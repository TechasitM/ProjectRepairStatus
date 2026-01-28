import Link from "next/link";

export default function Footer() {
  return (
   <footer
          style={{
            textAlign: "center",
            padding: 10,
            fontSize: 14,
            color: "#6b7280",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          © 2026 ระบบติดตามสถานะการซ่อมคอมพิวเตอร์ออนไลน์
        <div className="container mx-auto c">
          <Link href="/">
        <b>🔧 ร้านซ่อมคอมพิวเตอร์</b>
        </Link>
        </div>      
    </footer>
  );
}
   
   