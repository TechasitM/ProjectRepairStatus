<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <title>อัปเดตสถานะงานซ่อม</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            background-color: #f6f8fa;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            background: #ffffff;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .header {
            background: #0d6efd;
            color: #fff;
            padding: 16px;
            text-align: center;
            font-size: 18px;
        }

        .content {
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }

        .btn {
            display: inline-block;
            background-color: #0d6efd;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 8px;
        }

        .status-box {
            background: #f1f5ff;
            border-left: 5px solid #0d6efd;
            padding: 12px;
            margin: 16px 0;
        }

        .footer {
            background: #f0f0f0;
            padding: 12px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="header">
            🔧 แจ้งอัปเดตสถานะงานซ่อม
        </div>

        <div class="content">
            <p>
                เรียนคุณ <strong>{{ $repairOrder->customer->name }}</strong>
            </p>

            <p>
                ทางร้านขอแจ้งความคืบหน้าของงานซ่อม
                <strong>รหัสงาน {{ $repairOrder->repair_code }}</strong>
            </p>

            <div class="status-box">
                <p><strong>สถานะปัจจุบัน:</strong> {{ $statusName }}</p>

                @if (!empty($note))
                    <p>
                        <strong>หมายเหตุจากช่าง:</strong><br>
                        {{ $note }}
                    </p>
                @endif
            </div>
            <p>
                🕒 เวลาอัปเดต:
                {{ \Carbon\Carbon::parse($sent_datetime)->locale('th')->translatedFormat('j F Y เวลา H:i') }}
            </p>
            
            <p><strong>เช็คข้อมูลได้ที่เว็บ:</strong></p>

            <a href="{{ url('http://localhost:3000/track/' . $repairOrder->repair_code) }}" class="btn">
                คลิกดูสถานะเพิ่มเติม
            </a>

            <p>
                หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อร้านได้ในเวลาทำการ
            </p>

            <p>ขอบคุณที่ใช้บริการครับ 🙏</p>
        </div>

        <div class="footer">
            {{ config('app.name') }}<br>
            อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
        </div>
    </div>

</body>

</html>
