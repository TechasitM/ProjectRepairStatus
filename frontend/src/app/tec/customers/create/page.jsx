"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  Mail,
  Save,
  UserPlus,
  Info,
} from "lucide-react";

export default function CreateCustomer() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
  });
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
    <div className="p-6 w-full min-h-screen font-sans">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <UserPlus size={24} />
              </div>
              เพิ่มลูกค้า
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            {/* Section: Basic Info */}
            <div className="grid grid-cols-1 gap-8">
              <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <Info className="text-blue-500 mt-1" size={20} />
                <div>
                  <p className="text-blue-900 font-bold text-sm">
                    ข้อมูลลูกค้าระบบ
                  </p>
                  <p className="text-blue-700/70 text-xs">
                    คุณสามารถสร้างโดยใส่ชื่อ เบอร์โทร และอีเมลของลูกค้าได้จากหน้านี้
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Input Name */}
                <div className="space-y-2">
                  <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2 ml-1">
                    ชื่อ-นามสกุล
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      disabled={loading}
                      value={formData.customer_name.customer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                      placeholder="ระบุชื่อลูกค้า"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input Phone */}
                  <div className="space-y-2">
                    <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2 ml-1">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Phone size={20} />
                      </div>
                      <input
                        type="text"
                        disabled={loading}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        placeholder="08X-XXX-XXXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Input Email */}
                  <div className="space-y-2">
                    <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2 ml-1">
                      อีเมล
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        disabled={loading}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        placeholder="example@mail.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-8 py-4 text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl transition-all font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading  ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    กำลังประมวลผล...
                  </div>
                ) : (
                  <>
                    <Save size={20} />
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
