import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
      }}
    >
      <Link href="/">
        <b>🔧 ร้านซ่อมคอมพิวเตอร์</b>
      </Link>
    </nav>
  );
}

