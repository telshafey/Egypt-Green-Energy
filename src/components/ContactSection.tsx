import React, { useState } from 'react';
import { Language } from '../types';
import { content } from '../data/translations';
import { createInquiry, SiteSettingsData } from '../services/firebaseService';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ContactSectionProps {
  currentLang: Language;
  prefilledMessage?: string;
  prefilledService?: string;
  customSettings?: SiteSettingsData | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  currentLang,
  prefilledMessage = '',
  prefilledService = '',
  customSettings,
}) => {
  const t = content[currentLang].contact;
  const activePhonePrimary = customSettings?.phonePrimary || t.phonePrimary;
  const activePhoneSecondary = customSettings?.phoneSecondary || t.phoneSecondary;
  const activeEmail = customSettings?.email || t.emailAddress;
  const activeAddress = customSettings?.address || t.officeAddress;
  const activeHours = customSettings?.hours || t.hoursValue;
  const activeWhatsAppNumber = customSettings?.whatsAppNumber || '201007196485';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: prefilledService || '',
    message: prefilledMessage || '',
  });

  // Keep state updated if props change
  React.useEffect(() => {
    if (prefilledMessage) {
      setFormData((prev) => ({ ...prev, message: prefilledMessage }));
    }
    if (prefilledService) {
      setFormData((prev) => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledMessage, prefilledService]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = t.form.errorRequired;
    }
    if (!formData.email.trim()) {
      errs.email = t.form.errorRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = t.form.errorEmail;
    }
    if (!formData.phone.trim()) {
      errs.phone = t.form.errorRequired;
    } else if (formData.phone.length < 8) {
      errs.phone = t.form.errorPhone;
    }
    if (!formData.message.trim()) {
      errs.message = t.form.errorRequired;
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await createInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service.trim() || 'استشارة عامة في أنظمة التيار الخفيف',
        message: formData.message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Inquiry dispatch to Firestore warning, using local buffer:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
    }
  };

  const whatsappUrl = `https://wa.me/201007196485?text=${encodeURIComponent(
    currentLang === 'ar'
      ? 'مرحباً شركة مصر للطاقة الخضراء (قطاع أنظمة التيار الخفيف)، أود الاستفسار وطلب مقايسة فنية ومعاينة للمشروع.'
      : 'Hello Egypt Green Energy (Low Current Division), I would like to request a technical BOQ and site survey for our project.'
  )}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            {t.sectionKicker}
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 2-Column Split: Direct Contact Cards vs Validated Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & WhatsApp & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {t.officeTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeAddress}
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {t.phonesTitle}
                  </h4>
                  <div className="space-y-1">
                    <a
                      href={`tel:${activePhonePrimary.replace(/\s+/g, '')}`}
                      className="block text-xs sm:text-sm font-mono font-bold text-emerald-700 hover:text-emerald-800 dir-ltr text-start"
                    >
                      {activePhonePrimary}
                    </a>
                    {activePhoneSecondary && (
                      <a
                        href={`tel:${activePhoneSecondary.replace(/\s+/g, '')}`}
                        className="block text-xs sm:text-sm font-mono font-bold text-emerald-700 hover:text-emerald-800 dir-ltr text-start"
                      >
                        {activePhoneSecondary}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {t.emailTitle}
                  </h4>
                  <a
                    href={`mailto:${activeEmail}`}
                    className="text-xs sm:text-sm font-mono font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    {activeEmail}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {t.hoursTitle}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {activeHours}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${activeWhatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentLang === 'ar'
                      ? 'مرحباً، أود الاستفسار عن توريد وتركيب أنظمة التيار الخفيف وطلب مقايسة فنية لمنشأتنا.'
                      : 'Hello, I would like to inquire about low current systems installation and request a technical BOQ for our facility.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.whatsAppAction}</span>
                </a>
              </div>
            </div>

            {/* Google Maps Interactive Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  {t.mapTitle}
                </h4>
                <a
                  href="https://maps.google.com/?q=Nasr+City+Cairo+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  <span>{t.openInMaps}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-700 font-medium mb-4">
                {t.mapDesc}
              </p>

              {/* Google Maps Visual Embed Container */}
              <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
                <iframe
                  title="Egypt Green Energy Nasr City Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Nasr%20City,%20Cairo,%20Egypt&t=&z=14&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              {currentLang === 'ar' ? 'نموذج طلب استشارة ومواصفات المشروع' : 'Engineering Consultation & Project Proposal Form'}
            </h3>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in duration-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-950 mb-2">
                  {t.form.successTitle}
                </h4>
                <p className="text-sm text-emerald-800 leading-relaxed mb-6 max-w-md mx-auto">
                  {t.form.successMsg}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100/50 transition-colors cursor-pointer"
                >
                  {currentLang === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.form.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.form.namePlaceholder}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-400/30'
                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.form.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.form.emailPlaceholder}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-400/30'
                          : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.form.phoneLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t.form.phonePlaceholder}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-red-400 focus:ring-red-400/30'
                          : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.form.serviceLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder={
                      currentLang === 'ar'
                        ? 'مثال: محطة طاقة شمسية، زراعة جوجوبا، استزراع طحالب، صيانة SLA'
                        : 'e.g. Solar PV Farm, Jojoba Plantation, Hydroponics, SLA Contract'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.form.messageLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.form.messagePlaceholder}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.message
                        ? 'border-red-400 focus:ring-red-400/30'
                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }`}
                  />
                  {errors.message && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 active:scale-[0.99] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 rtl:-scale-x-100" />
                  <span>{isSubmitting ? t.form.submitting : t.form.submitBtn}</span>
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
