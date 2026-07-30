# Diary for Im

## ใส่รูปตรงไหน

หน้า login ตอนนี้ดึงรูปจากอัลบั้มจริงใน `images/trips/` แล้ว ถ้าอยากเปลี่ยนรูปหน้า login ให้แก้ `src` ของรูปใน `index.html`

หน้าแกลเลอรี่จัดเป็นอัลบั้ม/ทริปในโฟลเดอร์ `images/trips/`

- `images/trips/sea-and-walk/` สำหรับรูปทะเล ริมน้ำ และเดินเล่น
- `images/trips/aquarium-and-animals/` สำหรับรูปพิพิธภัณฑ์สัตว์น้ำและสัตว์
- `images/trips/flowers-and-garden/` สำหรับรูปดอกไม้ สวน และของขวัญ
- `images/trips/school-and-special-days/` สำหรับรูปวิลัย วันพิเศษ และชุดทางการ
- `images/trips/little-moments/` สำหรับรูปคู่ คิตแคท และวิดีโอคอล

ถ้าจะเพิ่มทริปใหม่ ให้สร้างโฟลเดอร์ใหม่ เช่น `images/trips/birthday-trip/` แล้วเปิด `gallery-data.js` เพิ่มอัลบั้มแบบนี้

```js
{
  id: "birthday-trip",
  title: "วันเกิด",
  note: "ทริปวันเกิดที่อยากจำ",
  photos: [
    { title: "รูปที่ 1", src: "images/trips/birthday-trip/01.jpg" },
    { title: "รูปที่ 2", src: "images/trips/birthday-trip/02.jpg" }
  ]
}
```

การเรียงรูปในอัลบั้มให้เรียงจากบนลงล่างตามลำดับใน `photos`

บน GitHub Pages เว็บจะอ่านรายชื่อไฟล์ในโฟลเดอร์เองไม่ได้ ต้องเพิ่มชื่อรูปใน `gallery-data.js` ทุกครั้งที่เพิ่มรูปใหม่

ถ้ายังไม่ได้ใส่รูป เว็บจะใช้ภาพ `assets/diary-hero.png` เป็นภาพสำรองก่อน

## ใส่เพลงตรงไหน

ใส่ไฟล์เพลง `.mp3` ในโฟลเดอร์ `audio/` ตามชื่อนี้

เพลงหน้าไดอารี่:

- `audio/diary-01-those-eyes.mp3`
- `audio/diary-02-about-you.mp3`
- `audio/diary-03-overrated-mr-min.mp3`
- `audio/diary-04-style.mp3`
- `audio/diary-05-thammada-tee-saen-piset.mp3`

เพลงหน้าเรื่องพิเศษ:

- `audio/special-01.mp3`
- `audio/special-02.mp3`
- `audio/special-03.mp3`

เพลงหน้าแกลเลอรี่:

- `audio/gallery-01-full-moon-dance.mp3`
- `audio/gallery-02-birds-of-a-feather.mp3`
- `audio/gallery-03-ta-ter-rak-krai-kon-nueng.mp3`

หมายเหตุ: เบราว์เซอร์บางตัวจะไม่ยอมเล่นเพลงอัตโนมัติจนกว่าจะมีการกดหน้าเว็บก่อน ซึ่งปุ่ม login ถือเป็นการกดแล้ว ส่วนไฟล์เพลงต้องเป็นไฟล์ที่คุณมีสิทธิ์ใช้เองก่อนอัปขึ้น GitHub

ถ้าอยากใช้ URL แทนไฟล์ในเครื่อง ให้เปิด `script.js` แล้วเปลี่ยนค่า `src` ของเพลงเป็นลิงก์ไฟล์เสียงตรง ๆ ได้ เช่น

```js
{ title: "Those Eyes", src: "https://example.com/those-eyes.mp3" }
```

ลิงก์ที่ใช้ได้ควรเป็นลิงก์ `.mp3` หรือไฟล์เสียงที่เปิดตรงในเบราว์เซอร์ได้ และ server ปลายทางต้องอนุญาตให้เว็บอื่นเล่นไฟล์นั้นได้

## แก้ไดอารี่

แก้ข้อความใน `diary.txt` ได้เลย เว็บจะแยกหัวข้อจากบรรทัดที่ขึ้นต้นด้วยวันที่ให้อัตโนมัติ

บันทึกวันที่ `26 ก.ค. 69` และ `27 ก.ค. 69` จะถูกล็อกด้วยรหัสพิเศษ `byteza007x`
