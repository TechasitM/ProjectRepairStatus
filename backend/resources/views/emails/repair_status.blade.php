<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <title>อัปเดตสถานะงานซ่อม</title>
    <style>
        /* CSS Reset สำหรับอีเมล */
        body {
            margin: 0;
            padding: 0;
            font-family: Tahoma, Arial, sans-serif;
            background-color: #f6f8fa;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }

        .content {
            padding: 30px;
            color: #374151;
            line-height: 1.6;
        }

        .status-box {
            background: #eff6ff;
            border-left: 5px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin-top: 10px;
        }

        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 40px; margin-bottom: 10px;">🔧</div>
            <div style="font-size: 20px; font-weight: bold;">แจ้งอัปเดตสถานะงานซ่อม</div>
        </div>

        <div class="content">
            <p>เรียนคุณ <strong>{{ $repairOrder->customer->customer_name ?? 'ลูกค้าผู้มีอุปการคุณ' }}</strong></p>

            <p>ทางร้านขอแจ้งความคืบหน้าของงานซ่อม <br>
                รหัสงาน: <strong style="color: #2563eb;">{{ $repairOrder->repair_code }}</strong>
            </p>

            <div class="status-box">
                <div style="font-size: 12px; color: #4b5563; text-transform: uppercase;">สถานะปัจจุบัน</div>
                <div style="font-size: 18px; font-weight: bold; color: #1e3a8a;">{{ $statusName }}</div>

                @if (!empty($note))
                    <div style="margin-top: 10px; border-top: 1px solid #bfdbfe; padding-top: 10px;">
                        <div style="font-size: 12px; color: #6b7280;">หมายเหตุจากช่าง:</div>
                        <div style="font-style: italic;">"{{ $note }}"</div>
                    </div>
                @endif
            </div>

            <div style="margin-bottom: 20px;">
                <p>ราคาประเมิน: <strong>{{ number_format($estimate_price, 2) }} บาท</strong></p>
                @if ($final_price)
                    <p style="color: #059669; font-weight: bold;">ราคาสุดท้าย: {{ number_format($final_price, 2) }} บาท
                    </p>
                @endif
                @if ($repairOrder->closed_at)
                    <p>
                        วันที่ปิดงาน:
                        {{ \Carbon\Carbon::parse($repairOrder->closed_at)->format('d/m/Y H:i') }}
                    </p>
                @endif
            </div>

            <p style="font-size: 13px; color: #9ca3af;">
                อัปเดตเมื่อ:
                {{ \Carbon\Carbon::parse($sent_datetime)->locale('th')->translatedFormat('j F Y เวลา H:i') }}
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('http://localhost:3000/track/' . $repairOrder->repair_code) }}"
                    class="btn">คลิกดูสถานะเพิ่มเติม →</a>
            </div>

            <p>ผู้ดำเนินการอัปเดต: <strong>{{ $updatedBy?->name ?? 'เจ้าหน้าที่ระบบ' }}</strong></p>

            <p style="margin-top: 20px;">หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อร้านได้ในเวลาทำการ</p>
            <p><strong>ขอบคุณที่ใช้บริการครับ 🙏</strong></p>
        </div>

        <div class="footer">
            {{ config('app.name') }}<br>
            อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
        </div>
    </div>
</body>

</html>
