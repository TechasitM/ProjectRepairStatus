"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/track/${keyword.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 pt-12 pb-24">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-24 text-center border border-slate-200 shadow-xl shadow-slate-200/50">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900">
            ติดตามงานซ่อม <span className="text-blue-600">เรียลไทม์</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
            เช็คสถานะอุปกรณ์ของคุณได้ทุกที่ ทุกเวลา
            เพียงกรอกรหัสงานซ่อมหรือเบอร์โทรศัพท์
            เพื่อดูว่าเครื่องของคุณอยู่ที่ขั้นตอนไหนแล้ว
          </p>

          {/* Search Bar Logic */}
          <div className="max-w-xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all"
            >
              <div className="flex items-center flex-1 px-4">
                <svg
                  className="w-5 h-5 text-slate-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="กรอกรหัสงานซ่อม หรือ เบอร์โทรศัพท์"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-transparent w-full outline-none text-[15px] py-3 text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-[0.97] shadow-lg shadow-blue-200"
              >
                ตรวจสอบสถานะ
              </button>
            </form>
            <p className="mt-5 text-[12px] text-slate-400 font-medium">
              ลืมรหัสงานซ่อม? ตรวจสอบได้ที่อีเมล
            </p>
          </div>
        </div>

        {/* Process Section */}
        <section className="mt-24 px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                ขั้นตอนการบริการ
              </h2>
              <p className="text-slate-500 text-base">
                เราดูแลอุปกรณ์ของคุณด้วยมาตรฐานมืออาชีพ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                title: "แจ้งซ่อม",
                desc: "ลงทะเบียนงานซ่อมผ่านหน้าเว็บหรือหน้าร้าน",
                iconColor: "bg-blue-100 text-blue-600",
              },
              {
                id: 2,
                title: "ประเมินอาการ",
                desc: "ช่างตรวจสอบและแจ้งประเมินราคาทันที",
                iconColor: "bg-green-100 text-green-600",
              },
              {
                id: 3,
                title: "กำลังซ่อม",
                desc: "ดำเนินการซ่อมแซมโดยช่างผู้เชี่ยวชาญ",
                iconColor: "bg-orange-100 text-orange-600",
              },
              {
                id: 4,
                title: "รับเครื่องกลับ",
                desc: "ตรวจสอบความเรียบร้อยและรับประกันหลังซ่อม",
                iconColor: "bg-purple-100 text-purple-600",
              },
            ].map((step) => (
              <div
                key={step.id}
                className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${step.iconColor} rounded-2xl flex items-center justify-center mb-6 font-bold text-xl`}
                >
                  {step.id}
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-800">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
