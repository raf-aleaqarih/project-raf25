# إعداد سريع للبريد الإلكتروني

## الخطوات المطلوبة

### 1. إنشاء ملف .env.local
```bash
# انسخ محتوى env.example إلى .env.local
cp env.example .env.local
```

### 2. تحديث متغيرات البيئة في .env.local
```env
SMTP_HOST=mail.raf-advanced.sa
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=25_project@raf-advanced.sa
SMTP_PASS=25Project@raf
SMTP_FROM_NAME=نظام إدارة مشروع الزهراء السكني
RECIPIENT_EMAIL=25_project@raf-advanced.sa
```

### 3. اختبار النظام
```bash
# اختبار البريد الإلكتروني
npm run test-email

# تشغيل الخادم
npm run dev
```

## التحقق من العمل

### 1. اختبار إرسال OTP
- انتقل إلى `/auth/forgot-password`
- أدخل بريد إلكتروني صحيح
- تحقق من وصول الرسالة

### 2. اختبار إرسال الاستفسارات
- انتقل إلى صفحة الاتصال
- املأ النموذج وأرسله
- تحقق من وصول الرسالة إلى `25_project@raf-advanced.sa`

## استكشاف الأخطاء

### إذا لم تصل الرسائل:
1. تحقق من مجلد Spam
2. تأكد من صحة كلمة مرور البريد الإلكتروني
3. راجع سجلات النظام في وحدة التحكم

### إذا ظهر خطأ في الاتصال:
1. تأكد من إعدادات SMTP_HOST
2. تحقق من المنفذ (587 أو 465)
3. تأكد من تفعيل المصادقة في Hostinger

## الدعم
راجع `EMAIL_SETUP_GUIDE.md` للحصول على تفاصيل أكثر.
