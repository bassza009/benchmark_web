# Benchmark-web: แผนและการตัดสินใจ

เว็บแสดงผลทุก benchmark จาก repo [Programming-Benchmark](../../Programming-Benchmark) พร้อมหน้าเปรียบเทียบ
สรุปจากการ grill session วันที่ 2026-10-20

## การตัดสินใจ

| # | หัวข้อ | สิ่งที่ตกลง |
|---|---|---|
| 1 | Real time | หลัง sync เว็บแสดงข้อมูลล่าสุด (ISR `revalidate = 60`) + filter/compare ทำฝั่ง client ตอบสนองทันที ไม่มี live streaming ระหว่างรัน |
| 2 | Sync | เฟส A: รัน `Programming-Benchmark/scripts/sync_to_supabase.py` ด้วยมือหลัง `generate_summary.py` → เฟส B: GitHub Action ใน Programming-Benchmark เมื่อ push |
| 3 | Scope | เฟส 1: web `main_web_benchmark` (MySQL) เท่านั้น (`pos_web_benchmark` ยังไม่ครบ ปิดไว้ใน `WEB_SUITES` ก่อน) + algorithm ที่มี hyperfine JSON (factorial, fibonacci, matrix, door, prisoners) · เฟส 2: CSV ทำมือ (prime ฯลฯ) หรือรันใหม่ด้วย hyperfine · ลบ `results/web_benchmark/` (สำเนาเก่า) |
| 4 | Compare | (A) ติ๊กเลือกภาษาในหน้า benchmark · (B) `/compare` เลือก series 2–6 ชุด (lang · env · tier · endpoint · suite) state อยู่ใน URL · preset = ลิงก์ · ต้องเลือกประเภท web/algorithm ก่อน (หน่วยต่างกัน) |
| 5 | ข้อมูล | snapshot ต่อ `run_batches` (status pending→complete) · เว็บอ่าน view `latest_*` · เก็บ `raw_runs`/`times` เป็น jsonb · ยังไม่มี UI ดูประวัติ |
| 6 | Deploy | Vercel public, root directory = repo นี้ · RLS อ่านอย่างเดียว · เว็บใช้ publishable key · secret key อยู่แค่ `Programming-Benchmark/.env` (และ GitHub Secrets ในเฟส B) |
| 7 | ภาษา UI | EN/TH ผ่าน `/en/...`, `/th/...` · ข้อความอยู่ใน dictionary |
| 8 | หน้าเว็บ | ดูหัวข้อ "โครงหน้า" ด้านล่าง ปรับหลังเห็นหน้าจริง |
| 9 | ธีม | Light เป็นค่าเริ่มต้น + toggle dark (`#1C1917`) · accent ส้ม `#EA580C` · text `#1C1917`/`#57534E` · bg `#FAFAF9` · ฟอนต์ IBM Plex Sans Thai · tabular numbers · สีภาษา 5 สี colorblind-safe ใช้ได้ทั้ง 2 โหมด |
| 10 | ที่ตั้ง | เว็บ + migration: `Benchmark-web/` · สคริปต์ sync: `Programming-Benchmark/scripts/` |

**Stack:** Next.js (App Router, TypeScript แบบเรียบ: ใส่ type เฉพาะข้อมูลหลัก) · Tailwind CSS · Recharts · Supabase REST API ผ่าน `fetch` (ไม่ใช้ supabase-js เพราะเวอร์ชันล่าสุดต้องใช้ Node 22) · `lucide-react` (icons)

**กติกาการเขียน:**
- ใช้ icon จาก `lucide-react` ทุกที่ที่ใช้ได้ ห้ามใช้อิโมจิ
- โค้ดเขียนแบบเรียบง่าย อ่านแล้วแก้มือได้: ไฟล์สั้น ชื่อตรงไปตรงมา หลีกเลี่ยง abstraction ซ้อนหลายชั้นและ pattern ซับซ้อน

## Environment variables

| ไฟล์ | ตัวแปร |
|---|---|
| `Benchmark-web/.env` (และ Vercel) | `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` |
| `Programming-Benchmark/.env` | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` |

## Schema

ดู [`supabase/migrations/001_init.sql`](../supabase/migrations/001_init.sql)

- `run_batches`: การ sync แต่ละครั้ง (git commit, status)
- `benchmarks`: รายการ benchmark (slug, category web/algorithm, suite, ชื่อ EN/TH, unit)
- `web_results`: 1 แถว = benchmark × language × env × tier × endpoint (mean/SD/CI95 ของ throughput และ latency, p50–p99, max, errors, cpu temp, raw_runs)
- `algo_results`: 1 แถว = benchmark × language × env (hyperfine mean/SD/median/min/max, times)
- views: `latest_batch`, `latest_web_results`, `latest_algo_results`

กติกา sync: อัปโหลด **ทุก benchmark** ในแต่ละ batch (batch ใหม่ต้องครบในตัว เพราะเว็บอ่านแค่ batch ล่าสุด)

Normalization ที่สคริปต์ sync ต้องทำ:
- environment: `"BME"`/`"Bare Metal"` → `bme`, `"Docker"` → `docker`
- endpoint: `/raw/2join` → `2join`, `/raw/post/3table` → `post-3table`
- tier_order: poc=1, small=2, general=3, high=4, stress=5

## โครงหน้า

- `/[lang]`: หน้าแรก การ์ด benchmark แบ่ง Web / Algorithm + ลิงก์ preset compare
- `/[lang]/benchmark/[slug]` (web): filter (env, lang, endpoint) · KPI tiles · Throughput vs Tier (line + CI95) · Latency percentiles (grouped bar) · Endpoint 1table→4join (bar) · ตารางสถิติเต็ม (sort, export CSV)
- `/[lang]/benchmark/[slug]` (algorithm): filter (env, lang) · mean time bar + SD · dot plot ราย run · ตาราง (mean, SD, median, min, max, Docker overhead %)
- `/[lang]/compare?type=web&s=...`: series picker · bar chart · ตารางเทียบพร้อม % ต่างจาก series แรก

## ลำดับงาน

1. [x] `.gitignore`, แผนนี้, migration SQL
2. [x] ผู้ใช้รัน `001_init.sql` ใน Supabase SQL Editor
3. [x] `Programming-Benchmark`: [x] `scripts/sync_to_supabase.py` · [x] ลบ `results/web_benchmark/` · [x] AGENTS.md ข้อ 4 · [x] sync ครั้งแรก (batch #1)
4. [x] Next.js scaffold, ธีม, i18n, หน้าแรก, หน้า benchmark, หน้า compare
5. [ ] `npm run dev` ตรวจหน้าจริงและปรับแก้ → deploy Vercel
6. [ ] เฟส B: GitHub Action · เฟส 2: algorithm จาก CSV
