<h1>สวัสดีคุณ {{ $repairOrder->customer->customer_name }}</h1>
<p>ขณะนี้อุปกรณ์ของคุณ ({{ $repairOrder->device->brand }} {{ $repairOrder->device->model }})</p>
<p>มีสถานะใหม่คือ: <strong>{{ $statusName }}</strong></p>

<a href="{{ env('FRONTEND_URL') }}/track/{{ $repairOrder->repair_code }}" 
   style="padding: 10px; background: blue; color: white; text-decoration: none;">
   คลิกที่นี่เพื่อดูรายละเอียดบนหน้าเว็บ
</a>