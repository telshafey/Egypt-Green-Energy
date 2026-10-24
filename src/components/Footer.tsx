import React from 'react';
import { Language, NavSection } from '../types';
import { content } from '../data/translations';
import { ArrowUp, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

import { SiteSettingsData } from '../services/firebaseService';

interface FooterProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  customSettings?: SiteSettingsData | null;
  sectionVisibility?: {
    showAbout?: boolean;
    showSystems?: boolean;
    showProjects?: boolean;
    showConfigurator?: boolean;
    showContact?: boolean;
  };
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate, customSettings, sectionVisibility }) => {
  const t = content[currentLang];
  const activeAddress = customSettings?.address || t.contact.officeAddress;
  const activePhonePrimary = customSettings?.phonePrimary || t.contact.phonePrimary;
  const activePhoneSecondary = customSettings?.phoneSecondary || t.contact.phoneSecondary;
  const activeEmail = customSettings?.email || t.contact.emailAddress;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/201007196485?text=${encodeURIComponent(
    currentLang === 'ar'
      ? 'مرحباً، أود الاستفسار عن توريد وتركيب أنظمة التيار الخفيف وطلب مقايسة فنية لمنشأتنا.'
      : 'Hello, I would like to inquire about low current systems installation and request a technical BOQ for our facility.'
  )}`;

  return (
    <footer className="bg-[#060b17] text-slate-300 border-t border-[#1e2e50] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo
              size="lg"
              variant="horizontal"
              textColor="white"
              logoUrl={customSettings?.logoUrl}
              companyNameAr={customSettings?.companyNameAr}
              companyNameEn={customSettings?.companyNameEn}
            />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              {(currentLang === 'ar' && customSettings?.footerAboutAr) || t.footer.about}
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>{t.footer.crNumber}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-medium text-white uppercase tracking-wider font-mono">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              {sectionVisibility?.showAbout !== false && (
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {t.nav.about}
                  </button>
                </li>
              )}
              {sectionVisibility?.showSystems !== false && (
                <li>
                  <button
                    onClick={() => onNavigate('systems')}
                    className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {t.nav.systems}
                  </button>
                </li>
              )}
              {sectionVisibility?.showProjects !== false && (
                <li>
                  <button
                    onClick={() => onNavigate('projects')}
                    className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {t.nav.projects}
                  </button>
                </li>
              )}
              {sectionVisibility?.showConfigurator !== false && (
                <li>
                  <button
                    onClick={() => onNavigate('configurator')}
                    className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {t.nav.configurator}
                  </button>
                </li>
              )}
              {sectionVisibility?.showContact !== false && (
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {t.nav.contact}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-medium text-white uppercase tracking-wider font-mono">
              {t.contact.heading}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>{activeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#22c55e] shrink-0" />
                <a
                  href={`tel:${activePhonePrimary.replace(/\s+/g, '')}`}
                  className="hover:text-white font-mono dir-ltr"
                >
                  {activePhonePrimary} {activePhoneSecondary ? `/ ${activePhoneSecondary}` : ''}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <a
                  href={`mailto:${activeEmail}`}
                  className="hover:text-white font-mono"
                >
                  {activeEmail}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1e2e50] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>{t.footer.rights}</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white hover:text-[#22c55e] transition-colors cursor-pointer"
          >
            <span>{t.footer.backToTop}</span>
            <div className="w-7 h-7 bg-[#0f1a34] border border-[#1e2e50] flex items-center justify-center text-[#22c55e]">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Message"
        className="fixed bottom-6 end-6 z-40 w-12 h-12 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer flat-card"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </footer>
  );
};
