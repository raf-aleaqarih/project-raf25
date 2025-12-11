# إعداد GTM للتتبع التلقائي 🔧

## المطلوب إعداده في Google Tag Manager

### 1. 📝 **Form Submission Trigger**

#### إعداد Trigger:
```
Trigger Name: Form Submit - Booking Form
Trigger Type: Form Submission
Wait for Tags: False
Check Validation: False

Trigger Conditions:
- Event equals gtm.formSubmit
- Form ID equals booking-form-element
OR
- Form Data Attribute: data-gtm-form equals booking-form
```

#### Variables المطلوبة:
```
1. Form Source Variable:
   - Variable Name: Form Source
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: gtm.elementDataset.gtmSource

2. Form Name Variable:
   - Variable Name: Form Name  
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: gtm.elementDataset.gtmForm
```

### 2. 📄 **Page View Trigger (Thank You)**

#### إعداد Trigger:
```
Trigger Name: Page View - Thank You
Trigger Type: Page View
Page Path: /thank-you

Additional Conditions:
- Page Path contains /thank-you
```

#### Variables المطلوبة:
```
1. Page Source Variable:
   - Variable Name: Page Source
   - Variable Type: Custom JavaScript
   - Code: 
     function() {
       var elements = document.querySelectorAll('[data-gtm-source]');
       return elements.length > 0 ? elements[0].getAttribute('data-gtm-source') : 'direct';
     }

2. Page Type Variable:
   - Variable Name: Page Type
   - Variable Type: Custom JavaScript  
   - Code:
     function() {
       var elements = document.querySelectorAll('[data-gtm-page]');
       return elements.length > 0 ? elements[0].getAttribute('data-gtm-page') : 'unknown';
     }
```

### 3. 🏷️ **Tags المطلوبة**

#### Tag 1: Form Submit Event
```
Tag Name: GA4 - Form Submit Event
Tag Type: Google Analytics: GA4 Event

Configuration:
- Measurement ID: [Your GA4 ID]
- Event Name: form_submit
- Parameters:
  - form_type: {{Form Name}}
  - traffic_source: {{Form Source}}
  - page_location: {{Page URL}}

Triggering: Form Submit - Booking Form
```

#### Tag 2: Thank You Page View
```
Tag Name: GA4 - Thank You Page View  
Tag Type: Google Analytics: GA4 Event

Configuration:
- Measurement ID: [Your GA4 ID]
- Event Name: page_view
- Parameters:
  - page_title: Thank You
  - page_type: {{Page Type}}
  - traffic_source: {{Page Source}}
  - page_location: {{Page URL}}

Triggering: Page View - Thank You
```

#### Tag 3: Form Conversion Event
```
Tag Name: GA4 - Form Conversion
Tag Type: Google Analytics: GA4 Event

Configuration:
- Measurement ID: [Your GA4 ID]
- Event Name: generate_lead
- Parameters:
  - currency: SAR
  - value: 870000
  - form_type: {{Form Name}}
  - traffic_source: {{Form Source}}

Triggering: Form Submit - Booking Form
```

## 🔍 **إعداد Debug Mode**

### في GTM:
1. انتقل لـ GTM Container
2. اضغط على "Preview"
3. أدخل URL الموقع
4. افتح الموقع في tab جديد

### ما ستراه:
```
📊 Events Expected:
1. gtm.formSubmit (عند إرسال النموذج)
2. gtm.dom (عند تحميل DOM)  
3. page_view (في صفحة thank-you)

📝 Variables Expected:
- Form Source: facebook/instagram/direct
- Form Name: booking-form
- Page Type: thank-you
- Page Source: facebook/instagram/direct
```

## 📋 **HTML Attributes المُضافة للتتبع**

### في النموذج:
```html
<form 
  data-gtm-form="booking-form"
  data-gtm-source="facebook"
  id="booking-form-element"
>
  <input name="name" data-gtm-field="name" />
  <input name="phone" data-gtm-field="phone" />
  <textarea name="notes" data-gtm-field="notes" />
  <button type="submit" data-gtm-button="submit-booking">
</form>
```

### في صفحة الشكر:
```html
<div 
  data-gtm-page="thank-you"
  data-gtm-source="facebook"
>
```

## 🎯 **Events التلقائية المُرسلة**

### عند إرسال النموذج:
1. **gtm.formSubmit** (built-in GTM event)
2. **form_submit** (custom event via tag)
3. **generate_lead** (conversion event via tag)

### في صفحة الشكر:
1. **gtm.dom** (built-in GTM event)
2. **page_view** (custom event via tag)

## ✅ **اختبار التتبع**

### 1. في GTM Preview:
- تأكد من تشغيل Tags عند الأحداث المطلوبة
- تحقق من Variables values

### 2. في Google Analytics:
- Events → Form Submit
- Events → Generate Lead  
- Events → Page View (Thank You)

### 3. في Browser Console:
- لن تظهر رسائل console لأن التتبع تلقائي
- التتبع يحدث عبر GTM dataLayer

## 🔧 **خطوات الإعداد السريع**

1. **في GTM Dashboard:**
   - أنشئ الـ 2 Triggers المذكورة أعلاه
   - أنشئ الـ 4 Variables المذكورة أعلاه  
   - أنشئ الـ 3 Tags المذكورة أعلاه

2. **اختبر في Preview Mode:**
   - املأ النموذج وأرسله
   - تأكد من تشغيل form_submit event
   - اذهب لصفحة /thank-you
   - تأكد من تشغيل page_view event

3. **انشر التغييرات:**
   - اضغط "Submit" في GTM
   - أضف Version Name: "Automatic Form Tracking"
   - اضغط "Publish"

## 📊 **النتيجة المتوقعة**

```
✅ التتبع تلقائي بالكامل
✅ لا يوجد كود JavaScript مطلوب
✅ يعمل مع جميع النماذج التي لها data-gtm-form
✅ يتتبع المصدر تلقائياً (facebook, instagram, etc.)
✅ يرسل conversion events للـ GA4
```

هذا الإعداد يجعل التتبع تلقائي 100% عبر GTM! 🚀
