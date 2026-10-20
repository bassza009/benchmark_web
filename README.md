# Benchmark-web

เว็บแสดงผล benchmark จาก [Programming-Benchmark](../Programming-Benchmark) (Next.js + Supabase)

## เริ่มใช้งาน

```bash
cp .env.example .env   # ใส่ SUPABASE_URL และ SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev            # http://localhost:3000
```

ข้อมูลมาจาก `python scripts/sync_to_supabase.py` ใน Programming-Benchmark หลัง sync แล้วเว็บจะแสดงข้อมูลใหม่ภายใน 60 วินาที

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
| `lib/db.ts` | ดึงข้อมูลจาก Supabase |
| `lib/presets.ts` | ปุ่มเปรียบเทียบด่วนในหน้าแรก |
| `app/globals.css` | สีธีม light/dark และสีของแต่ละภาษา |
| `supabase/migrations/` | SQL สร้างตาราง |
| `docs/PLAN.md` | การตัดสินใจและแผนงาน |
