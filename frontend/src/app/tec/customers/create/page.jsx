"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import { ArrowLeft, UserPlus, Phone, Save , Mail } from "lucide-react";

export default function CreateCustomer() {
  const router = useRouter();
  const [formData, setFormData] = useState({ customer_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // แสดง Loading Overlay ด้วย SweetAlert2
    Swal.fire({
      title: "กำลังบันทึกข้อมูล...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.post("/customers", formData);

      // ปิด Loading และแสดง Success
      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/tec/customers");
      router.refresh();
    } catch (err) {
      console.error(err);

      // แสดง Error Alert
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex justify-center">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={18}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          ย้อนกลับ
        </button>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 p-8 text-white text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold">ลงทะเบียนลูกค้าใหม่</h2>
            <p className="text-blue-100 text-sm mt-1">
              กรอกข้อมูลเบื้องต้นเพื่อเริ่มต้นการทำรายการ
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              {/* Input ชื่อ */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  ชื่อ-นามสกุล
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={loading}
                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                    placeholder="ระบุชื่อผู้ติดต่อ"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Input เบอร์โทร */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  เบอร์โทรศัพท์
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                    placeholder="08X-XXX-XXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Input อีเมล */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  อีเมล
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                    placeholder="xxx@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Button Group */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex justify-center items-center disabled:bg-blue-400 disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    กำลังประมวลผล...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save size={18} className="mr-2" />
                    ยืนยันการเพิ่มลูกค้า
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3.5 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                ยกเลิกและย้อนกลับ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
