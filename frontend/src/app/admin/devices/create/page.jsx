"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import { 
  ArrowLeft, Laptop, Monitor, Cpu, Save, 
  UserPlus, Search, Check, Hash, HardDrive 
} from "lucide-react";

export default function CreateDevicePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: "",
    device_type: "laptop", // ค่าเริ่มต้นเป็น Notebook
    brand: "",
    model: "",
    serial_number: "",
    details: "" // สำหรับระบุสเปคคร่าวๆ เช่น RAM, CPU
  });

  // โหลดรายชื่อลูกค้า
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch customers");
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id) {
      return Swal.fire("แจ้งเตือน", "กรุณาเลือกเจ้าของอุปกรณ์", "warning");
    }

    try {
      setLoading(true);
      await api.post("/devices", formData);
      await Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
        text: "เพิ่มอุปกรณ์คอมพิวเตอร์เข้าระบบแล้ว",
        timer: 1500,
        showConfirmButton: false
      });
      router.push("/tec/devices");
    } catch (err) {
      Swal.fire("ผิดพลาด", err.response?.data?.message || "ไม่สามารถบันทึกได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.customer_name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.phone.includes(searchCustomer)
  ).slice(0, 5);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Register New Computer</h1>
          <p className="text-sm text-gray-500 font-medium">เพิ่มอุปกรณ์คอมพิวเตอร์เข้าคลังประวัติ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Device Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-8">
            
            {/* Type Selection */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ประเภทอุปกรณ์คอมพิวเตอร์</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'laptop', label: 'Notebook', icon: <Laptop size={26} /> },
                  { id: 'desktop', label: 'PC Desktop', icon: <Monitor size={26} /> },
                  { id: 'component', label: 'Hardware', icon: <Cpu size={26} /> }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({...formData, device_type: type.id})}
                    className={`py-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                      formData.device_type === type.id 
                      ? "border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-50" 
                      : "border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    {type.icon}
                    <span className="text-xs font-black uppercase tracking-tight">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand & Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ยี่ห้อ (Brand)</label>
                <input 
                  required
                  placeholder="ASUS, Acer, Dell, Apple..."
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all font-bold"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">รุ่น (Model)</label>
                <input 
                  required
                  placeholder="เช่น ROG Strix, Pavilion..."
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all font-bold"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Hash size={14} /> Serial Number (S/N)
                </label>
                <input 
                  placeholder="ตรวจสอบได้ที่ใต้เครื่อง หรือข้างเคส..."
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all font-mono"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <HardDrive size={14} /> สเปคเครื่องเบื้องต้น (Specification)
                </label>
                <textarea 
                  rows="3"
                  placeholder="เช่น CPU i7-12700H, RAM 16GB, SSD 512GB..."
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all text-sm"
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Owner Selection */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">เลือกเจ้าของเครื่อง</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="ค้นชื่อหรือเบอร์โทร..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-500"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredCustomers.map(customer => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => setFormData({...formData, customer_id: customer.id})}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${
                    formData.customer_id === customer.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${formData.customer_id === customer.id ? "bg-blue-500" : "bg-blue-100 text-blue-600"}`}>
                      {customer.customer_name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate">{customer.customer_name}</p>
                      <p className={`text-[10px] ${formData.customer_id === customer.id ? "text-blue-100" : "text-gray-400"}`}>
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                  {formData.customer_id === customer.id && <Check size={18} />}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? "SAVING..." : <><Save size={18} /> บันทึกข้อมูลคอมพิวเตอร์</>}
            </button>
          </div>

          {/* New Customer Prompt */}
          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
            <h4 className="text-blue-800 font-bold text-sm flex items-center gap-2 mb-2">
              <UserPlus size={16} /> ลูกค้าใหม่?
            </h4>
            <p className="text-xs text-blue-600/80 leading-relaxed mb-4">
              หากไม่พบรายชื่อลูกค้าในระบบ กรุณาเพิ่มข้อมูลลูกค้าใหม่ก่อนลงทะเบียนอุปกรณ์
            </p>
            <Link 
              href="/admin/customers/create" 
              className="block w-full text-center py-2.5 bg-white text-blue-600 rounded-xl text-xs font-black shadow-sm hover:shadow-md transition-all"
            >
              + เพิ่มลูกค้าใหม่
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}