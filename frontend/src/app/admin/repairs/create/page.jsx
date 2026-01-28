"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* helper รองรับ JSON หลายแบบ */
const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.customers)) return res.customers;
  if (Array.isArray(res?.statuses)) return res.statuses;
  if (Array.isArray(res?.devices)) return res.devices;
  return [];
};

const API_BASE = "http://localhost:8000/api";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  let json = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    json = await res.json();
  } else {
    const text = await res.text();
    try {
      json = JSON.parse(text);
    } catch {
      json = { message: text };
    }
  }

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.error ||
      `Request failed (${res.status} ${res.statusText})`;
    throw new Error(msg);
  }

  return json;
}

const customerLabel = (c) =>
  `${c?.customer_name ?? ""} (${c?.phone ?? "-"})`;

export default function CreateRepairPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ ค้นหาลูกค้า (custom dropdown)
  const [customerQuery, setCustomerQuery] = useState("");
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  const [formData, setFormData] = useState(() => ({
    repair_code: `RP-${Date.now()}`,
    customer_id: "",
    device_id: "",
    user_id: "",
    status_id: "",
    problem_description: "",
    receive_date: new Date().toISOString().split("T")[0],
  }));

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  }, []);

  const authHeaders = useMemo(() => {
    const h = { Accept: "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  // ===== init โหลด master data =====
  useEffect(() => {
    let ignore = false;

    const initData = async () => {
      try {
        setLoadingInit(true);

        if (!token) {
          router.push("/login");
          return;
        }

        const [custJson, statJson, userJson] = await Promise.all([
          fetchJson(`${API_BASE}/customers`, { headers: authHeaders }),
          fetchJson(`${API_BASE}/statuses`, { headers: authHeaders }),
          fetchJson(`${API_BASE}/user-profile`, { headers: authHeaders }),
        ]);

        if (ignore) return;

        const custArr = extractArray(custJson);
        const statArr = extractArray(statJson);

        setCustomers(
          [...custArr].sort((a, b) =>
            String(a.customer_name || "").localeCompare(String(b.customer_name || ""))
          )
        );

        setStatuses(
          [...statArr].sort((a, b) =>
            String(a.status_name || "").localeCompare(String(b.status_name || ""))
          )
        );

        const user = userJson?.data || userJson;
        setCurrentUser(user);
        setFormData((prev) => ({ ...prev, user_id: user?.id || "" }));
      } catch (err) {
        console.error("Load initial data failed:", err);
        alert(err?.message || "โหลดข้อมูลเริ่มต้นไม่สำเร็จ");
      } finally {
        if (!ignore) setLoadingInit(false);
      }
    };

    initData();
    return () => {
      ignore = true;
    };
  }, [authHeaders, router, token]);

  // ===== โหลดอุปกรณ์ตาม customer_id (นี่คือหัวใจ) =====
  const loadDevicesByCustomer = useCallback(
    async (customerId) => {
      setFilteredDevices([]);
      if (!customerId) return;

      try {
        setLoadingDevices(true);

        const json = await fetchJson(
          `${API_BASE}/devices?customer_id=${encodeURIComponent(customerId)}`,
          { headers: authHeaders }
        );

        const devicesArr = extractArray(json);
        const sorted = [...devicesArr].sort((a, b) => {
          const aa = `${a.brand || ""} ${a.model || ""} ${a.serial_number || ""}`;
          const bb = `${b.brand || ""} ${b.model || ""} ${b.serial_number || ""}`;
          return aa.localeCompare(bb);
        });

        setFilteredDevices(sorted);

        // ถ้ามีอุปกรณ์เดียว เลือกให้อัตโนมัติ
        if (sorted.length === 1) {
          setFormData((prev) => ({ ...prev, device_id: String(sorted[0].id) }));
        }
      } catch (err) {
        console.error("Load devices failed:", err);
        alert(err?.message || "โหลดรายการอุปกรณ์ไม่สำเร็จ");
      } finally {
        setLoadingDevices(false);
      }
    },
    [authHeaders]
  );

  // ✅ เลือกลูกค้าจริง ๆ จากรายการ (กดคลิก/เลือก)
  const selectCustomer = useCallback(
    async (customer) => {
      const customerId = String(customer.id);

      // set customer_id แน่นอน และ reset device ก่อน
      setFormData((prev) => ({
        ...prev,
        customer_id: customerId,
        device_id: "",
      }));

      // เติมชื่อในช่องค้นหาให้เป็นชื่อจริง
      setCustomerQuery(customerLabel(customer));
      setIsCustomerOpen(false);

      // โหลดอุปกรณ์ของลูกค้านี้เท่านั้น
      await loadDevicesByCustomer(customerId);
    },
    [loadDevicesByCustomer]
  );

  // ✅ ฟิลเตอร์ลูกค้าตามคำค้น
  const filteredCustomerList = useMemo(() => {
    const q = (customerQuery || "").trim().toLowerCase();
    if (!q) return customers.slice(0, 8); // โชว์ 8 คนแรก
    return customers
      .filter((c) => {
        const text = `${c.customer_name || ""} ${c.phone || ""}`.toLowerCase();
        return text.includes(q);
      })
      .slice(0, 12);
  }, [customerQuery, customers]);

  // ===== submit =====
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.customer_id || !formData.device_id || !formData.status_id) {
        alert("กรุณากรอกข้อมูล ลูกค้า, อุปกรณ์ และสถานะ ให้ครบถ้วน");
        return;
      }

      try {
        setLoading(true);

        if (!token) {
          alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
          router.push("/login");
          return;
        }

        await fetchJson(`${API_BASE}/repairs`, {
          method: "POST",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        router.push("/admin/repairs");
      } catch (err) {
        console.error("Create repair failed:", err);
        alert(err?.message || "บันทึกข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    },
    [authHeaders, formData, router, token]
  );

  // ===== UI =====
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">ออกใบสั่งซ่อมใหม่</h1>
          <p className="text-blue-100 text-sm">สร้างรายการบันทึกงานซ่อมเข้าระบบ</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {loadingInit && (
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
              กำลังโหลดข้อมูลเริ่มต้น...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ข้อมูลงานซ่อม */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">
                ข้อมูลงานซ่อม
              </h2>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Repair Code
                </label>
                <input
                  value={formData.repair_code}
                  readOnly
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  วันที่รับเครื่อง
                </label>
                <input
                  type="date"
                  value={formData.receive_date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, receive_date: e.target.value }))
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* ลูกค้าและอุปกรณ์ */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">
                ลูกค้าและอุปกรณ์
              </h2>

              {/* ✅ ลูกค้า: searchable dropdown (custom) */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  ลูกค้า (ค้นหาได้)
                </label>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      value={customerQuery}
                      onChange={(e) => {
                        setCustomerQuery(e.target.value);
                        setIsCustomerOpen(true);

                        // ถ้ากำลังพิมพ์ค้นหา ให้ reset customer/device ก่อน
                        setFormData((prev) => ({
                          ...prev,
                          customer_id: "",
                          device_id: "",
                        }));
                        setFilteredDevices([]);
                      }}
                      onFocus={() => setIsCustomerOpen(true)}
                      placeholder="พิมพ์ชื่อหรือเบอร์ เช่น นิด / 089..."
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      required
                    />

                    {isCustomerOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                        {filteredCustomerList.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            ไม่พบลูกค้า
                          </div>
                        ) : (
                          filteredCustomerList.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()} // กัน blur ก่อนคลิก
                              onClick={() => selectCustomer(c)}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                            >
                              <div className="font-medium text-gray-800">
                                {c.customer_name}
                              </div>
                              <div className="text-xs text-gray-500">{c.phone}</div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/admin/customers/create")}
                    className="bg-gray-100 p-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                    title="เพิ่มลูกค้า"
                  >
                    ➕
                  </button>
                </div>
              </div>

              {/* ✅ อุปกรณ์: แสดงเฉพาะของลูกค้าที่เลือกเท่านั้น */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  อุปกรณ์ (ของลูกค้าที่เลือกเท่านั้น)
                </label>

                <select
                  value={formData.device_id}
                  className={`w-full p-2.5 border rounded-lg outline-none transition-all ${
                    !formData.customer_id
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                  disabled={!formData.customer_id || loadingDevices}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, device_id: e.target.value }))
                  }
                  required
                >
                  <option value="">
                    {!formData.customer_id
                      ? "กรุณาเลือกลูกค้าก่อน"
                      : loadingDevices
                      ? "กำลังโหลดอุปกรณ์..."
                      : "-- เลือกอุปกรณ์ --"}
                  </option>

                  {filteredDevices.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.brand} {d.model} [SN: {d.serial_number}]
                    </option>
                  ))}
                </select>

                {formData.customer_id && !loadingDevices && filteredDevices.length === 0 && (
                  <p className="text-xs text-orange-500 mt-1">
                    * ลูกค้ารายนี้ยังไม่มีข้อมูลอุปกรณ์ในระบบ
                  </p>
                )}
              </div>
            </div>

            {/* รายละเอียดอาการเสีย */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-blue-500 pl-3">
                รายละเอียดอาการเสีย
              </h2>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  สถานะเริ่มต้น
                </label>
                <select
                  value={formData.status_id}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status_id: e.target.value }))
                  }
                  required
                >
                  <option value="">-- เลือกสถานะ --</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.status_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  ปัญหาที่แจ้ง/อาการเสีย
                </label>
                <textarea
                  rows={4}
                  value={formData.problem_description}
                  placeholder="ระบุอาการเสียโดยละเอียด เช่น เปิดไม่ติด, จอแตก, ลืมรหัสผ่าน..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      problem_description: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              ช่างผู้รับงาน:{" "}
              <span className="font-bold text-gray-700">
                {currentUser?.name || "กำลังโหลด..."}
              </span>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={loading || loadingInit || loadingDevices}
                className={`flex-1 md:flex-none px-10 py-2.5 rounded-lg text-white font-bold transition-all shadow-lg ${
                  loading || loadingInit || loadingDevices
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }`}
              >
                {loading ? "กำลังบันทึก..." : "ยืนยันการเพิ่มรายการ"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ปิด dropdown เมื่ิอคลิกนอก */}
      {isCustomerOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsCustomerOpen(false)}
        />
      )}
    </div>
  );
}
