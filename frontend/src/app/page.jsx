"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn,Microscope,Wrench,CheckCircle2,HelpCircle,Plus,Minus, } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/track/${keyword.trim()}`);
  };
  const faqs = [
    {
      q: "จะหารหัสงานซ่อมได้จากที่ไหน?",
      a: "คุณสามารถดูรหัสงานซ่อมได้จากใบรับเครื่องที่หน้าร้าน หรือจากอีเมลยืนยันที่เราได้ส่งให้หลังจากรับเครื่อง",
    },
    {
      q: "ใช้เวลาซ่อมนานแค่ไหน?",
      a: "ระยะเวลาซ่อมขึ้นอยู่กับอาการของอุปกรณ์ โดยทั่วไปใช้เวลา 1–3 วันทำการ หากต้องรออะไหล่อาจใช้เวลา 5–7 วัน",
    },
    {
      q: "มีการรับประกันหลังซ่อมหรือไม่?",
      a: "เรามีการรับประกันงานซ่อมและอะไหล่เป็นระยะเวลา 90 วัน เพื่อความมั่นใจของลูกค้า",
    },
  ];
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Hero Section */}
      {/* navbar */}
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
              <div
                className="flex min-h-[500px] flex-col gap-8 items-center justify-center p-8 md:p-16 text-center bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(16, 25, 34, 0.8), rgba(16, 25, 34, 0.95)), url('/image/hero.png')`,
                }}
              >
                <div className="max-w-3xl space-y-6">
                  <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    ติดตามงานซ่อม{" "}
                    <span className="text-blue-500">เรียลไทม์</span>
                  </h1>
                  <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl mx-auto">
                    เช็คสถานะอุปกรณ์ของคุณได้ทุกที่ ทุกเวลา
                    เพียงกรอกรหัสงานซ่อมหรือเบอร์โทรศัพท์
                    เพื่อดูความคืบหน้าล่าสุด
                  </p>
                </div>

                {/* Search Bar Logic*/}
                <div className="w-full max-w-2xl mt-4">
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row gap-3 p-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
                  >
                    <div className="flex flex-1 items-center bg-white dark:bg-[#192633] rounded-xl px-4 border border-transparent focus-within:ring-2 ring-blue-500 transition-all">
                      <svg
                        className="w-5 h-5 text-slate-400"
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
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="กรอกรหัสงานซ่อม หรือ เบอร์โทรศัพท์"
                        className="w-full border-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 py-4 px-3 text-base"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
                    >
                      ตรวจสอบสถานะ
                    </button>
                  </form>
                  <p className="text-xs text-slate-400 mt-5 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    ลืมรหัสงานซ่อม? ตรวจสอบได้ที่อีเมลหรือใบรับซ่อมของคุณ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 px-6 md:px-10 bg-slate-50 dark:bg-[#faf9f9]">
          <div className="max-w-[960px] mx-auto">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">ขั้นตอนการให้บริการ</h2>
              <p className="text-slate-500 dark:text-slate-400">
                ติดตามเส้นทางงานซ่อมของคุณ ตั้งแต่รับเครื่องจนถึงพร้อมส่งมอบ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[60px_1fr] gap-x-4">
              {/* Step 1 */}
              <div className="flex md:flex-col items-center gap-4 pt-3">
                <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <LogIn className="w-5 h-5" />
                </div>
                <div className="hidden md:block w-0.5 bg-slate-200 h-12 grow" />
              </div>
              <div className="py-4">
                <p className="text-lg font-bold">รับเครื่องเข้าระบบ</p>
                <p className="text-slate-600">
                  อุปกรณ์ของคุณจะถูกบันทึกเข้าสู่ระบบอย่างปลอดภัย
                  และมอบหมายให้ช่างผู้เชี่ยวชาญดูแลโดยเฉพาะ
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex md:flex-col items-center gap-4">
                <div className="hidden md:block w-0.5 bg-slate-200 h-6" />
                <div className="size-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Microscope className="w-5 h-5" />
                </div>
                <div className="hidden md:block w-0.5 bg-slate-200 h-12 grow" />
              </div>
              <div className="py-4">
                <p className="text-lg font-bold">ตรวจสอบและวิเคราะห์อาการ</p>
                <p className="text-slate-600">
                  ช่างทำการตรวจเช็กอาการเพื่อหาสาเหตุของปัญหา
                  หากจำเป็นต้องเปลี่ยนอะไหล่ เราจะแจ้งให้คุณทราบก่อนดำเนินการ
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex md:flex-col items-center gap-4">
                <div className="hidden md:block w-0.5 bg-slate-200 h-6" />
                <div className="size-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="hidden md:block w-0.5 bg-slate-200 h-12 grow" />
              </div>
              <div className="py-4">
                <p className="text-lg font-bold">ดำเนินการซ่อมแซม</p>
                <p className="text-slate-600">
                  ทีมช่างผู้เชี่ยวชาญทำการซ่อมแซมด้วยอะไหล่แท้
                  หรืออะไหล่คุณภาพสูง ตามมาตรฐานศูนย์บริการ
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex md:flex-col items-center gap-4 pb-3">
                <div className="hidden md:block w-0.5 bg-slate-200 h-6" />
                <div className="size-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="py-4">
                <p className="text-lg font-bold">พร้อมรับเครื่อง</p>
                <p className="text-slate-600">
                  ผ่านการตรวจสอบคุณภาพเรียบร้อย ทำความสะอาดอุปกรณ์
                  และพร้อมส่งมอบให้คุณรับกลับไปใช้งานอย่างมั่นใจ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left : Title */}
              <div className="lg:col-span-4">
                <div className="sticky top-28">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-3">
                    <HelpCircle className="w-5 h-5" />
                    คำถามที่พบบ่อย
                  </div>

                  <h2 className="text-3xl font-black mb-4 leading-tight">
                    FAQ – คำถามที่ลูกค้าสอบถามบ่อย
                  </h2>

                  <p className="text-slate-500 leading-relaxed">
                    รวมคำตอบสำหรับข้อสงสัยเกี่ยวกับงานซ่อม และการติดตามสถานะ
                    เพื่อช่วยให้คุณใช้งานระบบได้อย่างมั่นใจ
                  </p>
                </div>
              </div>

              {/* Right : FAQ List */}
              <div className="lg:col-span-8 space-y-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all ${
                        isOpen
                          ? "border-blue-500 bg-blue-50/40"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      {/* Question */}
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {faq.q}
                        </span>

                        <span
                          className="flex items-center justify-center w-9 h-9 rounded-full border bg-white transition-all
                  group-hover:border-blue-500 group-hover:text-blue-600"
                        >
                          {isOpen ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {/* Answer */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
