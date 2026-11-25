# English Speaking Master 🇬🇧
اپلیکیشن فارسی و راست‌چین آموزش مکالمه انگلیسی از سطح صفر تا پیشرفته؛ قابل اجرا به‌صورت PWA و قابل بسته‌بندی برای Android با Capacitor.

## امکانات فعلی
- داشبورد، نقشه راه ۱۰ درس نمونه از A0 تا B2، واژگان و آزمون
- توضیح فارسی، تلفظ نوشتاری، نمونه مکالمه و پخش گفتار با Speech Synthesis مرورگر
- تمرین گفتار با Web Speech Recognition در مرورگرهای پشتیبان (معمولاً Chrome)
- معلم هوشمند با بک‌اند امن مبتنی بر OpenAI Responses API
- ذخیره پیشرفت، واژه‌های منتخب و تاریخچه مکالمه در localStorage
- طراحی واکنش‌گرا، PWA و سرویس‌ورکر برای کش اولیه

> این پروژه یک نسخه اولیه قابل توسعه (MVP) است. محتوای آموزشی فعلی ۱۰ درس نمونه دارد؛ ادعای پوشش کامل C1/C2 یا دوره صدهاساعته ندارد. برای دوره کامل باید محتوای آموزشی به‌صورت مرحله‌ای توسعه داده شود.

## پیش‌نیازها
- Node.js نسخه 20 یا جدیدتر
- npm
- برای ساخت APK: Android Studio و Android SDK
- برای معلم هوشمند: کلید API و دسترسی شبکه از سرور به OpenAI

## اجرای وب در سیستم خودت
```bash
npm install
npm run dev
```
آدرس محلی Vite در ترمینال نمایش داده می‌شود.

## فعال‌سازی معلم هوشمند
کلید API را در فایل `.env` ریشه پروژه یا متغیرهای محیطی سرور قرار بده. فایل `.env` را هرگز commit نکن.
```bash
cp .env.example .env
# سپس OPENAI_API_KEY را در .env تنظیم کن
npm run server
```
فرانت‌اند را باز کن، وارد «تنظیمات» شو و آدرس سرور را ثبت کن:
- توسعه روی همان کامپیوتر: `http://localhost:8787`
- روی گوشی: به جای localhost، IP شبکه کامپیوتر یا دامنه سرور را وارد کن؛ هر دو دستگاه باید به سرور دسترسی داشته باشند.
- محیط واقعی: بک‌اند را روی یک میزبان HTTPS مستقر کن و URL آن را در تنظیمات اپ وارد کن.

سرور نمونه از `POST /v1/responses` استفاده می‌کند. کلید API فقط در متغیر محیطی سرور خوانده می‌شود و در اپلیکیشن/مرورگر قرار نمی‌گیرد. راهنمای رسمی: https://developers.openai.com/api/reference/resources/responses/methods/create

## انتشار PWA روی GitHub Pages
1. پروژه را در یک مخزن GitHub آپلود کن.
2. در Settings → Pages، منبع را روی GitHub Actions قرار بده.
3. فایل workflow زیر را ایجاد کن یا از فایل موجود استفاده کن.
4. پس از پایان workflow، سایت در آدرس GitHub Pages منتشر می‌شود.
5. در Android Chrome آدرس سایت را باز کن و از منوی مرورگر Install app / Add to Home screen را بزن.

### نکته مسیر مخزن
Vite با `base: './'` تنظیم شده تا assetها با مسیر نسبی کار کنند. اگر در Pages مسیر asset مشکل داشت، تنظیم `base` را متناسب با نام repository تغییر بده.

## ساخت APK اندروید
در محیطی که Android Studio و SDK نصب است:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
در Android Studio از منوی Build → Build Bundle(s) / APK(s) → Build APK(s) استفاده کن.
پس از تغییر کد وب:
```bash
npm run android:sync
```
و دوباره APK را از Android Studio بساز.
برای انتشار در Play Store از Build → Generate Signed Bundle / APK استفاده و کلید امضای خودت را امن نگهداری کن.

## GitHub Actions برای انتشار خودکار PWA
فایل `.github/workflows/deploy.yml` با هر push به شاخه `main` پروژه را build و در GitHub Pages منتشر می‌کند. در تنظیمات مخزن، Pages source را روی GitHub Actions قرار بده.

## محدودیت‌ها و امنیت
- مکالمه هوشمند بدون بک‌اند و کلید معتبر API کار نمی‌کند. GitHub Pages فقط فایل‌های ایستا میزبانی می‌کند؛ سرور AI باید جداگانه deploy شود.
- کلید API را هرگز در فایل‌های `src/`، `public/`، `VITE_*`، تنظیمات اپ اندروید یا GitHub قرار نده.
- برای محیط واقعی، `ALLOWED_ORIGIN` را به دامنه فرانت‌اند محدود کن، HTTPS فعال کن، محدودیت نرخ درخواست و احراز هویت اضافه کن و هزینه API را پایش کن.
- Speech Recognition در همه مرورگرها/دستگاه‌ها یکسان نیست و ممکن است برای پردازش گفتار به سرویس آنلاین مرورگر متکی باشد.
- تلفظ فارسیِ نوشته‌شده تقریبی است؛ برای یادگیری دقیق‌تر، به صدای انگلیسی گوش بده.
- اطلاعات کاربر در این نسخه روی همان دستگاه ذخیره می‌شود؛ همگام‌سازی ابری و حساب کاربری پیاده‌سازی نشده است.

## ساختار
```text
.
├── index.html
├── src/
│   ├── main.js
│   └── style.css
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icon.svg
├── server/
│   └── index.mjs
├── .github/workflows/deploy.yml
├── capacitor.config.json
└── README.md
```

## مجوز
MIT — فایل LICENSE را ببین.
