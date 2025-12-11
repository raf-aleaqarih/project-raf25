import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs'
import nodemailer from 'nodemailer';
import WebsiteDataService from '@/lib/website-data';
import { getSMTPConfig, validateEmailConfig } from '@/lib/email-config';

// تكوين الناقل للبريد الإلكتروني (Hostinger)
const createTransporter = () => {
  // التحقق من صحة الإعدادات
  if (!validateEmailConfig()) {
    console.warn('⚠️ إعدادات البريد الإلكتروني غير مكتملة، سيتم استخدام القيم الافتراضية');
  }
  
  return nodemailer.createTransport(getSMTPConfig());
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, notes, source, socialMedia } = body;
    
    // الحصول على معلومات إضافية من الطلب
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') || 'غير معروف';

    // تحديد المنصة بناءً على الرابط المرجعي
    const getPlatformFromReferer = (referer: string): string => {
      if (!referer) return 'موقع الويب المباشر';
      
      const url = new URL(referer);
      const hostname = url.hostname.toLowerCase();
      
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
        return 'فيسبوك';
      } else if (hostname.includes('instagram.com')) {
        return 'إنستغرام';
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return 'تويتر';
      } else if (hostname.includes('tiktok.com')) {
        return 'تيك توك';
      } else if (hostname.includes('snapchat.com')) {
        return 'سناب شات';
      } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return 'يوتيوب';
      } else if (hostname.includes('linkedin.com')) {
        return 'لينكد إن';
      } else if (hostname.includes('whatsapp.com') || hostname.includes('wa.me')) {
        return 'واتساب';
      } else if (hostname.includes('telegram.org') || hostname.includes('t.me')) {
        return 'تليجرام';
      } else {
        return 'موقع آخر';
      }
    };

    const platform = getPlatformFromReferer(referer);

    // التحقق من البيانات المطلوبة
    if (!phone) {
      return NextResponse.json(
        { error: 'رقم الجوال مطلوب' },
        { status: 400 }
      );
    }

    // الحصول على بيانات المشروع
    const projectData = WebsiteDataService.getProjectInfo();
    const projectName = projectData?.name || 'مشروع راف 25';

    // إعداد محتوى البريد الإلكتروني
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER, // بريد المستلم
      subject: `طلب حجز جديد - ${projectName}`,
      html: `
        <div dir="rtl" lang="ar" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; direction: rtl; text-align: right;">
          <div style="background: linear-gradient(135deg, #540f6b 0%, #7c1f9a 100%); color: white; padding: 25px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 15px rgba(84, 15, 107, 0.3);">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">طلب حجز جديد</h1>
            <p style="margin: 12px 0 0 0; opacity: 0.95; font-size: 16px;">${projectName}</p>
          </div>
          
          <div style="background-color: white; padding: 35px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #540f6b; margin-bottom: 25px; border-bottom: 3px solid #c48765; padding-bottom: 15px; font-size: 22px; font-weight: 600; text-align: right">
              تفاصيل الطلب
            </h2>
            
            <div style="margin-bottom: 20px; display: flex; align-items: center; background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-right: 4px solid #540f6b;">
              <strong style="color: #2c2c2c; min-width: 80px; font-size: 16px; text-align: right">الاسم:</strong>
              <span style="color: #6b7280; margin-right: 15px; font-size: 16px; text-align: right">${name || 'غير محدد'}</span>
            </div>
            
            <div style="margin-bottom: 20px; display: flex; align-items: center; background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-right: 4px solid #540f6b;">
              <strong style="color: #2c2c2c; min-width: 80px; font-size: 16px; text-align: right">رقم الجوال:</strong>
              <span style="color: #6b7280; margin-right: 15px; font-size: 16px; text-align: right">${phone}</span>
            </div>
            
            ${notes ? `
            <div style="margin-bottom: 20px;">
              <strong style="color: #2c2c2c; display: block; margin-bottom: 10px; font-size: 16px; text-align: right">ملاحظات إضافية:</strong>
              <div style="color: #6b7280; padding: 20px; background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%); border-radius: 10px; border-right: 4px solid #c48765; font-size: 15px; line-height: 1.6;">
                ${notes}
              </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 35px; padding: 25px; background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%); border-radius: 12px; border-right: 4px solid #c48765; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <h3 style="margin: 0 0 15px 0; color: #540f6b; font-size: 18px; font-weight: 600; text-align: right">معلومات إضافية:</h3>
              <div style="color: #6b7280; font-size: 14px; line-height: 1.8;">
                <div style="margin-bottom: 8px; display: flex; align-items: center;">
                  <span style="color: #c48765; margin-left: 10px; font-weight: bold;">•</span>
                  <strong style="color: #2c2c2c; margin-left: 8px; text-align: right">تاريخ الطلب:</strong>
                  <span style="margin-right: 10px; text-align: right">${new Date().toLocaleString('ar-SA')}</span>
                </div>
          
                ${source && source !== platform ? `
            
                ` : ''}
                ${socialMedia ? `
                <div style="margin-bottom: 8px; display: flex; align-items: center;">
                  <span style="color: #c48765; margin-left: 10px; font-weight: bold;">•</span>
                  <strong style="color: #2c2c2c; margin-left: 8px; text-align: right">وسيلة التواصل الاجتماعي:</strong>
                  <span style="margin-right: 10px; text-align: right">${socialMedia}</span>
                </div>
                ` : ''}
         
      
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 13px; padding: 15px; background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="margin: 0; text-align: right;">هذا البريد تم إرساله تلقائياً من نظام الحجز الإلكتروني</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8; text-align: right;">مشروع 25 - حي الزهراء في جدة - جميع الحقوق محفوظة</p>
          </div>
        </div>
      `,
    };

    // إرسال البريد الإلكتروني
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'تم إرسال طلبك بنجاح' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error);
    
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى' 
      },
      { status: 500 }
    );
  }
}
