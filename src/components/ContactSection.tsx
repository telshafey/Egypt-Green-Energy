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
  const [submitError, setSubmitError] = useState<string>('');

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
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const docId = await createInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service.trim() || (currentLang === 'ar' ? 'استشارة عامة في أنظمة التيار الخفيف' : 'General Low Current Consultation'),
        message: formData.message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      if (docId) {
        setSubmitted(true);
        setSubmitError('');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
        });
      } else {
        throw new Error('Database write did not return document ID');
      }
    } catch (err) {
      console.error('Inquiry dispatch error:', err);
      setSubmitError(
        currentLang === 'ar'
          ? 'تعذر تأكيد إرسال الطلب في الوقت الحالي. يرجى إعادة المحاولة أو التواصل المباشر عبر الهاتف أو واتساب.'
          : 'Unable to confirm your inquiry at this moment. Please try again or reach us directly via Phone or WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/201007196485?text=${encodeURIComponent(
    currentLang === 'ar'
      ? 'مرحباً شركة مصر للطاقة الخضراء (قطاع أنظمة التيار الخفيف)، أود الاستفسار وطلب مقايسة فنية ومعاينة للمشروع.'
      : 'Hello Egypt Green Energy (Low Current Division), I would like to request a technical BOQ and site survey for our project.'
  )}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#f8fafc] text-[#0a1122] border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 inline-block" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#0a1122] mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 2-Column Split: Direct Contact Cards vs Validated Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info & WhatsApp & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] flat-card space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] text-[#0ea5e9] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {t.officeTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#0a1122] leading-relaxed font-medium">
                    {activeAddress}
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#e2e8f0]">
                <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] text-[#22c55e] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {t.phonesTitle}
                  </h4>
                  <div className="space-y-1">
                    <a
                      href={`tel:${activePhonePrimary.replace(/\s+/g, '')}`}
                      className="block text-xs sm:text-sm font-mono font-semibold text-[#0a1122] hover:text-[#0ea5e9] dir-ltr text-start"
                    >
                      {activePhonePrimary}
                    </a>
                    {activePhoneSecondary && (
                      <a
                        href={`tel:${activePhoneSecondary.replace(/\s+/g, '')}`}
                        className="block text-xs sm:text-sm font-mono font-semibold text-[#0a1122] hover:text-[#0ea5e9] dir-ltr text-start"
                      >
                        {activePhoneSecondary}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#e2e8f0]">
                <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] text-[#0ea5e9] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {t.emailTitle}
                  </h4>
                  <a
                    href={`mailto:${activeEmail}`}
                    className="text-xs sm:text-sm font-mono font-semibold text-[#0a1122] hover:text-[#0ea5e9]"
                  >
                    {activeEmail}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-[#e2e8f0]">
                <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] text-slate-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                    {t.hoursTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeHours}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action Button */}
              <div className="pt-4 border-t border-[#e2e8f0]">
                <a
                  href={`https://wa.me/${activeWhatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentLang === 'ar'
                      ? 'مرحباً، أود الاستفسار عن توريد وتركيب أنظمة التيار الخفيف وطلب مقايسة فنية لمنشأتنا.'
                      : 'Hello, I would like to inquire about low current systems installation and request a technical BOQ for our facility.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>{t.whatsAppAction}</span>
                </a>
              </div>
            </div>

            {/* Google Maps Interactive Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] flat-card overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-[#0a1122]">
                  {t.mapTitle}
                </h4>
                <a
                  href="https://maps.google.com/?q=Nasr+City+Cairo+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#0ea5e9] hover:underline"
                >
                  <span>{t.openInMaps}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                {t.mapDesc}
              </p>

              {/* Google Maps Visual Embed Container */}
              <div className="w-full h-44 rounded-xl overflow-hidden border border-[#e2e8f0] relative bg-[#f1f5f9]">
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
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 flat-card">
            <h3 className="text-lg sm:text-xl font-bold text-[#0a1122] mb-6 pb-3 border-b border-[#e2e8f0]">
              {currentLang === 'ar' ? 'نموذج طلب استشارة ومواصفات المشروع' : 'Engineering Consultation & Project Proposal Form'}
            </h3>

            {submitted ? (
              <div className="p-8 text-center bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl flat-card animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-[#0a1122] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
                </div>
                <h4 className="text-xl font-bold text-[#0a1122] mb-2">
                  {t.form.successTitle}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-md mx-auto">
                  {t.form.successMsg}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#0a1122] bg-white border border-[#e2e8f0] hover:border-[#0a1122] transition-colors cursor-pointer"
                >
                  {currentLang === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-1.5 font-mono">
                    {t.form.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.form.namePlaceholder}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm text-[#0a1122] placeholder:text-slate-400 bg-white focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#e2e8f0] focus:border-[#0ea5e9]'
                    }`}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-1.5 font-mono">
                      {t.form.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.form.emailPlaceholder}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-[#0a1122] placeholder:text-slate-400 bg-white focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#e2e8f0] focus:border-[#0ea5e9]'
                      }`}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-1.5 font-mono">
                      {t.form.phoneLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t.form.phonePlaceholder}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm text-[#0a1122] placeholder:text-slate-400 bg-white focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#e2e8f0] focus:border-[#0ea5e9]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-1.5 font-mono">
                    {t.form.serviceLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder={
                      currentLang === 'ar'
                        ? 'مثال: شبكات وكابلات هيكلية، مراقبة CCTV، إنذار حريق، تحكم بالدخول، صيانة SLA'
                        : 'e.g. Structured Cabling, CCTV Surveillance, Fire Alarm, Access Control, SLA Maintenance'
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0a1122] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-1.5 font-mono">
                    {t.form.messageLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.form.messagePlaceholder}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm text-[#0a1122] placeholder:text-slate-400 bg-white focus:outline-none transition-colors ${
                      errors.message
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#e2e8f0] focus:border-[#0ea5e9]'
                    }`}
                  />
                  {errors.message && (
                    <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submission Error Alert */}
                {submitError && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Action: Brand Navy + Brand Green Micro-surface */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full inline-flex items-center justify-between overflow-hidden rounded-lg bg-[#0a1122] hover:bg-[#111d38] text-white disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <span className="py-3.5 px-6 font-semibold text-xs sm:text-sm tracking-wide">
                      {isSubmitting ? t.form.submitting : t.form.submitBtn}
                    </span>
                    <span className="w-12 h-12 bg-[#22c55e] text-[#0a1122] flex items-center justify-center shrink-0 group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                      <Send className="w-4 h-4 rtl:-scale-x-100" />
                    </span>
                  </button>
                </div>

                {/* Security Guarantee Note */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <span>{currentLang === 'ar' ? 'بياناتك مشفرة ومحمية وفق أعلى معايير الخصوصية الهندسية' : 'Encrypted & protected under enterprise NDA engineering standards'}</span>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
