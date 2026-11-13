# Benchmark-web

เว็บแสดงผล benchmark จาก [Programming-Benchmark](../Programming-Benchmark) (Next.js + PostgreSQL บนเครื่องนี้)

## เริ่มใช้งาน

```bash
cp .env.example .env   # ใส่ DATABASE_URL (role อ่านอย่างเดียว benchmark_web_reader)
npm install
npm run dev            # http://localhost:9999
```

ข้อมูลมาจาก `python scripts/sync_to_db.py` ใน Programming-Benchmark (ใช้ `WEB_DATABASE_URL` ใน `.env` ของ repo นั้น) หลัง sync แล้วเว็บจะแสดงข้อมูลใหม่ภายใน 60 วินาที

### ตั้งค่าฐานข้อมูลครั้งแรก

ใช้ PostgreSQL ที่รันอยู่บนเครื่อง (port 5432) แยก database ชื่อ `benchmark_web` ไม่ปนกับ `benchmark_db` ที่ใช้ทดสอบ

```sql
-- รันด้วย superuser
create role benchmark_web login password '...';         -- เขียน (สคริปต์ sync)
create role benchmark_web_reader login password '...';  -- อ่านอย่างเดียว (เว็บ)
create database benchmark_web owner benchmark_web;
```

```bash
psql postgres://benchmark_web:...@localhost:5432/benchmark_web -f db/schema.sql
```

## โครงสร้าง

| ที่อยู่ | ใช้ทำอะไร |
|---|---|
| `app/[lang]/page.tsx` | หน้าแรก |
| `app/[lang]/benchmark/[slug]/page.tsx` | หน้า benchmark แต่ละตัว |
| `app/[lang]/compare/page.tsx` | หน้าเปรียบเทียบ |
| `components/WebBenchmarkView.tsx` | กราฟ + ตารางของ web benchmark |
| `components/AlgoBenchmarkView.tsx` | กราฟ + ตารางของ algorithm benchmark |
| `components/CompareView.tsx` | ตัวเลือกชุดข้อมูล + กราฟเทียบ |
| `components/ui.tsx` | ชิ้นส่วนเล็กๆ ที่ใช้ร่วมกัน (card, chip, select, legend) |
| `lib/i18n.ts` | ข้อความทั้งหมด EN/TH (แก้คำที่นี่) |
| `lib/db.ts` | ดึงข้อมูลจาก PostgreSQL |
| `lib/presets.ts` | ปุ่มเปรียบเทียบด่วนในหน้าแรก |
| `app/globals.css` | สีธีม light/dark และสีของแต่ละภาษา |
| `db/schema.sql` | SQL สร้างตาราง + view |
| `docs/PLAN.md` | การตัดสินใจและแผนงาน |
