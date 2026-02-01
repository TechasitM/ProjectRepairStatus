<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
    
    <div style="background-color: #0056b3; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">แจ้งอัปเดตสถานะการซ่อม</h2>
    </div>

    <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 18px; margin-top: 0;">สวัสดีคุณ <strong>{{ $repairOrder->customer->customer_name }}</strong>,</p>
        
        <p style="color: #555;">เราขอแจ้งให้ทราบว่าอุปกรณ์ของคุณมีการเปลี่ยนแปลงสถานะ ดังนี้:</p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>อุปกรณ์:</strong> {{ $repairOrder->device->brand }} {{ $repairOrder->device->model }}</p>
            <p style="margin: 5px 0;"><strong>เลขที่ใบซ่อม:</strong> #{{ $repairOrder->repair_code }}</p>
            <p style="margin: 5px 0;"><strong>สถานะปัจจุบัน:</strong> <span style="color: #0056b3; font-weight: bold; font-size: 1.1em;">{{ $statusName }}</span></p>
        </div>

        <p style="text-align: center; margin-top: 30px;">
            <a href="{{ url('http://localhost:3000/track/' . $repairOrder->repair_code) }}" 
               style="display: inline-block; padding: 12px 25px; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
               คลิกเพื่อตรวจสอบรายละเอียด
            </a>
        </p>
    </div>

    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">ข้อความนี้เป็นการแจ้งเตือนอัตโนมัติ กรุณาอย่าตอบกลับอีเมลฉบับนี้</p>
        <p style="margin: 5px 0 0 0;">© {{ date('Y') }} ชื่อร้านของคุณ. All rights reserved.</p>
    </div>
</div>