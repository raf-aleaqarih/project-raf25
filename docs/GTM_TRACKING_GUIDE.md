# دليل تتبع Google Tag Manager - تلقائي 📊

## إعداد GTM

✅ **Google Tag Manager مُعد بالفعل** مع ID: `GTM-MGMC6KSC`  
✅ **تتبع تلقائي بالكامل** - بدون كود JavaScript مطلوب  
✅ **حل مشكلة Hydration Mismatch** - GTM يتم تحميله بعد الـ hydration
✅ **اعتماد على GTM Triggers** - التتبع يحدث تلقائياً

## حل مشكلة Hydration Mismatch

### المشكلة:
```
Error: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

### السبب:
Google Tag Manager يضيف attributes للـ `<html>` element على الـ client side:
- `data-tag-assistant-prod-present=""`
- `data-tag-assistant-present=""`

### الحل المطبق:
1. **نقل GTM script** من `<head>` إلى component منفصل في `<body>`
2. **استخدام `useEffect`** لتحميل GTM بعد hydration
3. **إضافة `suppressHydrationWarning`** للـ `<html>` element

### الملفات المعدلة:
- `app/layout.tsx`: إضافة `suppressHydrationWarning` للـ `<html>`
- `components/gtm-script.tsx`: تحميل GTM بعد hydration

## تدفق التتبع التلقائي

### 1. النموذج (clean-hero.tsx)
```
DOM Ready → إرسال form_submission event
المستخدم يرسل النموذج → إرسال form_submission event
```

### 2. صفحة الشكر (thank-you/page.tsx)
```
تحميل صفحة الشكر → إرسال form_submission event
```

## GTM Events التلقائية

### عند تحميل الصفحة (DOM Ready):

#### Form Submission Event
```javascript
{
  event: 'form_submission',
  form_type: 'booking_form',
  traffic_source: 'facebook',
  page: 'home',
  section: 'hero',
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

### عند إرسال النموذج:

#### Form Submission Event
```javascript
{
  event: 'form_submission',
  form_type: 'booking_form',
  traffic_source: 'facebook',
  phone_number: '0501234567',
  name: 'أحمد محمد',
  notes: 'ملاحظات المستخدم',
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

### في صفحة الشكر:

#### Form Submission Event
```javascript
{
  event: 'form_submission',
  form_type: 'booking_form',
  traffic_source: 'facebook',
  page: 'thank_you',
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

## كيفية مراقبة التتبع

### 1. في Developer Console
افتح F12 واذهب لـ Console، ستجد الرسائل التالية:

**عند تحميل الصفحة (DOM Ready):**
```
🏷️ GTM loaded post-hydration
📋 DOM Ready - form_submission event sent for platform: facebook
📊 GTM Event: form_submission (DOM Ready)
```

**عند إرسال النموذج:**
```
📋 Form submitted successfully
📞 Phone: 0501234567, Name: أحمد محمد
📊 GTM Event: form_submission sent to dataLayer
```

**في صفحة الشكر:**
```
🎯 Thank You Page - form_submission event sent for platform: facebook
📊 GTM Event: form_submission (Thank You Page)
```

### 2. في GTM Debug Mode
1. ادخل على GTM container: `GTM-MGMC6KSC`
2. فعّل Preview mode
3. اختبر النموذج وراقب الـ events

### 3. في Google Analytics (إذا كان متصل بـ GTM)
ستجد الأحداث تحت:
- Conversions → Events
- Enhanced Ecommerce → Purchases

## Events الأهم للـ Conversions

### للإعلانات:
1. **`purchase`** - الحدث الأساسي للـ conversion
2. **`generate_lead`** - لتتبع الـ leads
3. **`conversion`** مع `conversion_type: 'form_completion'`

### للتحليلات:
1. **`form_submit`** - لمعرفة معدل إرسال النماذج
2. **`page_view`** على صفحة الشكر - لمعرفة معدل الوصول للشكر

## المنصات المُتتبعة

يتم تتبع المنصة التالية بدقة:
- `facebook`
- `instagram` 
- `whatsapp`
- `google`
- `tiktok`
- `snapchat`
- `twitter`
- `direct` (مباشر)

## ملاحظات مهمة

✅ **تتبع تلقائي بالكامل عبر GTM**  
✅ **لا يوجد كود JavaScript مطلوب في الموقع**  
✅ **form_submit event يُرسل عند إرسال النموذج**  
✅ **page_view event يُرسل عند زيارة صفحة الشكر**  
✅ **تتبع المنصة المصدر تلقائياً (فيسبوك، انستغرام، إلخ)**  
✅ **conversion events (generate_lead) تُرسل تلقائياً**  
✅ **مناسب للإعلانات والتحليلات**

## 📋 **HTML Attributes المُضافة**

### النموذج:
- `data-gtm-form="booking-form"`
- `data-gtm-source="facebook"`
- `id="booking-form-element"`

### صفحة الشكر:
- `data-gtm-page="thank-you"`
- `data-gtm-source="facebook"`

## للمطورين

### إضافة حدث جديد:
```javascript
import { pushToDataLayer } from '@/lib/gtm'

pushToDataLayer({
  event: 'custom_event',
  custom_data: 'value'
})
```

### تعديل قيمة الشقة:
في `lib/gtm.ts` → `trackPurchaseConversion()`:
```javascript
value: 870000, // عدّل هنا
```
