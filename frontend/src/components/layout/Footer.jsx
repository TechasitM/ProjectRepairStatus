import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center space-y-4">
        {/* Brand */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
        >
          <Wrench className="w-4 h-4" />
          ร้านซ่อมคอมพิวเตอร์
        </Link>

        {/* Copyright */}
        <p className="text-sm text-slate-400 leading-relaxed">
          © 2026 ระบบติดตามสถานะการซ่อมคอมพิวเตอร์ออนไลน์  
          <br />
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
