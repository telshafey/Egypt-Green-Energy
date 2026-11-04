/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, NavSection, LightCurrentSystem, ProjectItem, VendorBrandItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { AboutSection } from './components/AboutSection';
import { HeritageOverview } from './components/HeritageOverview';
import { SystemsSection } from './components/SystemsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { BOQConfigurator } from './components/BOQConfigurator';
import { PartnersSection } from './components/PartnersSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { SubpageHeader } from './components/SubpageHeader';
import {
  SiteSettingsData,
  getSiteSettings,
  subscribeToSiteSettings,
  getSystems,
  subscribeToSystems,
  getProjects,
  subscribeToProjects,
  getVendors,
  subscribeToVendors,
} from './services/firebaseService';
import {
  Calculator,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Network,
  Eye,
  DoorClosed,
  Flame,
} from 'lucide-react';

// Obscure, non-guessable admin portal slug without any hash
export const ADMIN_SECRET_SLUG = 'portal-ege-8492';
export const ADMIN_SECRET_PATH = `/${ADMIN_SECRET_SLUG}`;

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [liveSettings, setLiveSettings] = useState<SiteSettingsData | null>(null);
  const [liveSystems, setLiveSystems] = useState<LightCurrentSystem[] | null>(null);
  const [liveProjects, setLiveProjects] = useState<ProjectItem[] | null>(null);
  const [liveVendors, setLiveVendors] = useState<VendorBrandItem[] | null>(null);

  // Path routing without hash - check on initial load & popstate
  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
      const hash = window.location.hash;

      // 1. Secret unguessable admin portal
      if (
        pathname === ADMIN_SECRET_SLUG ||
        pathname === 'portal-ege-8492' ||
        pathname === 'ege-portal-9472'
      ) {
        setIsAdminOpen(true);
        if (hash) {
          window.history.replaceState(null, '', `/${pathname}`);
        }
        return;
      }

      // 2. If visiting old /admin or #admin, clean up and redirect to home
      if (pathname === 'admin' || hash === '#admin' || hash === '#admin-portal') {
        window.history.replaceState(null, '', '/');
        setIsAdminOpen(false);
        setActiveSection('home');
        return;
      }

      // 3. Dedicated sub-pages
      const validSections: NavSection[] = [
        'about',
        'systems',
        'projects',
        'configurator',
        'brands',
        'contact',
      ];
      if (validSections.includes(pathname as NavSection)) {
        setActiveSection(pathname as NavSection);
        setIsAdminOpen(false);
        return;
      }

      // 4. Default: Public Home view
      setActiveSection('home');
      setIsAdminOpen(false);
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Fetch & Subscribe to live settings, systems, projects, and vendors from Firebase
  useEffect(() => {
    getSiteSettings().then(setLiveSettings).catch(console.warn);
    getSystems().then((s) => s.length > 0 && setLiveSystems(s)).catch(console.warn);
    getProjects().then((p) => p.length > 0 && setLiveProjects(p)).catch(console.warn);
    getVendors().then((v) => v.length > 0 && setLiveVendors(v)).catch(console.warn);

    const unsubSettings = subscribeToSiteSettings((s) => setLiveSettings(s));
    const unsubSystems = subscribeToSystems((sys) => {
      if (sys && sys.length > 0) setLiveSystems(sys);
    });
    const unsubProjects = subscribeToProjects((projs) => {
      if (projs && projs.length > 0) setLiveProjects(projs);
    });
    const unsubVendors = subscribeToVendors((vens) => {
      if (vens && vens.length > 0) setLiveVendors(vens);
    });

    return () => {
      unsubSettings();
      unsubSystems();
      unsubProjects();
      unsubVendors();
    };
  }, []);

  // Dynamically update document dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const handleToggleLang = () => {
    setCurrentLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    const path = section === 'home' ? '/' : `/${section}`;
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSystemForBOQ = (systemTitle: string) => {
    setPrefilledService(systemTitle);
    setPrefilledMessage(
      currentLang === 'ar'
        ? `أرغب في الحصول على مقايسة فنية ومعاينة موقع لتوريد وتركيب وبرمجة: ${systemTitle}.`
        : `I would like to request a technical BOQ and site inspection for: ${systemTitle}.`
    );
  };

  const handlePrefillInquiryFromConfigurator = (details: string) => {
    setPrefilledService(
      currentLang === 'ar'
        ? 'مقايسة أنظمة تيار خفيف متكاملة'
        : 'Turnkey Low Current Systems BOQ'
    );
    setPrefilledMessage(details);
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminOpen(false);
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // If Admin portal is activated, render the dedicated zero-popup dashboard
  if (isAdminOpen) {
    return (
      <AdminDashboard
        currentLang={currentLang}
        onExit={handleExitAdmin}
        onSettingsUpdated={(newSettings) => {
          setLiveSettings(newSettings);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        customLogoUrl={liveSettings?.logoUrl}
        companyNameAr={liveSettings?.companyNameAr}
        companyNameEn={liveSettings?.companyNameEn}
        sectionVisibility={liveSettings || undefined}
      />

      <main className="flex-1">
        {/* ==============================================================
            ROUTE 1: HOME PAGE (Curated executive landing page)
            User requirement: "وترفع جزء التعريف فى الاول"
            -> About section is placed directly at the top after Hero!
            ============================================================== */}
        {activeSection === 'home' && (
          <>
            {/* 1. Hero Section with Command Center & Operations Video Wall */}
            <Hero
              currentLang={currentLang}
              onNavigate={handleNavigate}
              customTitle={
                currentLang === 'ar'
                  ? liveSettings?.heroTitleAr
                  : liveSettings?.heroTitleEn
              }
              customSubtitle={
                currentLang === 'ar'
                  ? liveSettings?.heroSubtitleAr
                  : liveSettings?.heroSubtitleEn
              }
              customKicker={
                currentLang === 'ar'
                  ? liveSettings?.heroKickerAr
                  : liveSettings?.heroKickerEn
              }
              customCtaPrimary={
                currentLang === 'ar'
                  ? liveSettings?.heroCtaPrimaryAr
                  : undefined
              }
              customCtaSecondary={
                currentLang === 'ar'
                  ? liveSettings?.heroCtaSecondaryAr
                  : undefined
              }
              customHeroImage={liveSettings?.heroImageUrl}
              customLogoUrl={liveSettings?.logoUrl}
            />

            {/* 2. RAISED TO TOP: Corporate Definition & Heritage (Since 2014) */}
            {liveSettings?.showAbout !== false && (
              <AboutSection currentLang={currentLang} customSettings={liveSettings} />
            )}

            {/* 3. Engineering Fundamentals Strip (Stats & Credibility Metrics) */}
            {liveSettings?.showStats !== false && (
              <StatsStrip currentLang={currentLang} customSettings={liveSettings} />
            )}

            {/* 4. Curated Systems Showcase (Top flagship systems with link to full /systems) */}
            {liveSettings?.showSystems !== false && (
              <SystemsSection
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onSelectSystemForBOQ={handleSelectSystemForBOQ}
                customSystems={liveSystems || undefined}
                customSettings={liveSettings}
                isCuratedPreview={true}
              />
            )}

            {/* 5. Curated Landmark Projects (Top field installations with link to full /projects) */}
            {liveSettings?.showProjects !== false && (
              <ProjectsSection
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onSelectProjectForBOQ={handleSelectSystemForBOQ}
                customProjects={liveProjects || undefined}
                customSettings={liveSettings}
                isCuratedPreview={true}
              />
            )}

            {/* 6. Smart Estimator Teaser Banner (Highlights room count + area with link to /configurator) */}
            {liveSettings?.showConfigurator !== false && (
              <section className="py-16 sm:py-20 bg-[#070d1a] text-white border-b border-[#1e2e50] relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-at-c from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="rounded-3xl bg-gradient-to-br from-[#0f1a34] to-[#070d1a] border border-[#22c55e]/40 p-8 sm:p-12 lg:p-14 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      
                      <div className="lg:col-span-7 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132347] border border-[#22c55e]/30 text-xs font-mono text-[#38bdf8]">
                          <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span>
                            {isRtl
                              ? 'مساعد التقدير الهندسي المحدث • يدعم المساحة وعدد الغرف'
                              : 'Upgraded Engineering Estimator • Area & Room Count Aware'}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white leading-tight">
                          {isRtl
                            ? 'احسب مقايسة أنظمة التيار الخفيف التقديرية لمنشأتك في 60 ثانية'
                            : 'Calculate Low-Current Facility Requirements & BOQ in 60 Seconds'}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                          {isRtl
                            ? 'أداة هندسية تفاعلية تحسب احتياجات شبكات الداتا، كاميرات المراقبة، حساسات إنذار الحريق، وبوابات التحكم في الدخول وفقاً للمساحة الإجمالية وعدد الغرف والمكاتب المنفصلة مع تصدير المقايسة PDF ومشاركتها عبر واتساب.'
                            : 'An interactive engineering tool that calculates data drops, CCTV cameras, fire smoke detectors, and access control doors according to facility area and discrete room count with instant PDF and WhatsApp export.'}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-[#080e1c] border border-[#1e2e50] text-center">
                            <Eye className="w-4 h-4 text-[#38bdf8] mx-auto mb-1" />
                            <div className="text-[11px] font-mono text-slate-300">
                              {isRtl ? 'كاميرات IP' : 'IP Cameras'}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080e1c] border border-[#1e2e50] text-center">
                            <Flame className="w-4 h-4 text-[#22c55e] mx-auto mb-1" />
                            <div className="text-[11px] font-mono text-slate-300">
                              {isRtl ? 'إنذار الحريق' : 'Fire Alarm'}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080e1c] border border-[#1e2e50] text-center">
                            <Network className="w-4 h-4 text-[#38bdf8] mx-auto mb-1" />
                            <div className="text-[11px] font-mono text-slate-300">
                              {isRtl ? 'شبكات وفايبر' : 'Cabling & Fiber'}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080e1c] border border-[#1e2e50] text-center">
                            <DoorClosed className="w-4 h-4 text-[#22c55e] mx-auto mb-1" />
                            <div className="text-[11px] font-mono text-slate-300">
                              {isRtl ? 'تحكم بالدخول' : 'Access Control'}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-4">
                          <button
                            onClick={() => handleNavigate('configurator')}
                            className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#0a1122] bg-[#22c55e] hover:bg-[#16a34a] hover:text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 group"
                          >
                            <Calculator className="w-4 h-4" />
                            <span>
                              {isRtl
                                ? 'فتح حاسبة المقايسة والتقدير الهندسي (BOQ)'
                                : 'Launch Full Engineering Estimator'}
                            </span>
                            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                          </button>

                          <button
                            onClick={() => handleNavigate('contact')}
                            className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-[#132347] border border-[#1e2e50] rounded-xl transition-colors cursor-pointer"
                          >
                            <span>{isRtl ? 'طلب معاينة موقع' : 'Request Site Survey'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-[#080e1c]/80 rounded-2xl border border-[#1e2e50] p-6 space-y-4 font-mono text-xs text-slate-300">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2e50]">
                          <span className="text-[#38bdf8] font-bold">
                            {isRtl ? 'مؤشرات التقدير الذكي' : 'Smart Parameters'}
                          </span>
                          <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded">
                            {isRtl ? 'كودات TIA/EIA وحريق' : 'Code Compliant'}
                          </span>
                        </div>
                        <div className="space-y-2.5 text-slate-300">
                          <div className="flex justify-between items-center">
                            <span>{isRtl ? 'مساحة المنشأة' : 'Facility Area'}:</span>
                            <span className="text-white font-bold">1,000 م²</span>
                          </div>
                          <div className="flex justify-between items-center text-[#22c55e]">
                            <span>{isRtl ? 'عدد الغرف والمكاتب' : 'Room Count'}:</span>
                            <span className="font-bold">25 غرفة</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>{isRtl ? 'نقاط الداتا المقدرة' : 'Est. Data Drops'}:</span>
                            <span className="text-white font-bold">~50 نقطة</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>{isRtl ? 'حساسات إنذار الحريق' : 'Fire Smoke Detectors'}:</span>
                            <span className="text-white font-bold">~32 جهاز</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>{isRtl ? 'أبواب التحكم بالدخول' : 'Access Control Doors'}:</span>
                            <span className="text-white font-bold">~5 أبواب</span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-[#1e2e50] text-[11px] text-slate-400">
                          {isRtl
                            ? 'اضغط بالأسفل لتخصيص المساحة وعدد الغرف واختيار الأنظمة المطلوبة بدقة.'
                            : 'Click below to adjust area, room count, and customize selected systems.'}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 7. Technology Partners Preview (Top brands with link to full /brands) */}
            {liveSettings?.showPartners !== false && (
              <PartnersSection
                currentLang={currentLang}
                onNavigate={handleNavigate}
                customVendors={liveVendors || undefined}
                customSettings={liveSettings}
                isCuratedPreview={true}
              />
            )}

            {/* 8. Direct Contact Section on Homepage */}
            {liveSettings?.showContact !== false && (
              <ContactSection
                currentLang={currentLang}
                prefilledMessage={prefilledMessage}
                prefilledService={prefilledService}
                customSettings={liveSettings}
              />
            )}
          </>
        )}

        {/* ==============================================================
            ROUTE 2: /about (من نحن والتعريف والريادة منذ 2014)
            ============================================================== */}
        {activeSection === 'about' && (
          <div className="space-y-0">
            <SubpageHeader
              currentLang={currentLang}
              activeSection="about"
              onNavigate={handleNavigate}
            />
            {liveSettings?.showAbout !== false && (
              <AboutSection currentLang={currentLang} customSettings={liveSettings} />
            )}
            {liveSettings?.showHeritage === true && (
              <HeritageOverview currentLang={currentLang} customSettings={liveSettings} />
            )}
            <SubpageBottomCTA currentLang={currentLang} onNavigate={handleNavigate} />
          </div>
        )}

        {/* ==============================================================
            ROUTE 3: /systems (أنظمة التيار الخفيف والحلول التكنولوجية الكاملة)
            ============================================================== */}
        {activeSection === 'systems' && (
          <div className="space-y-0">
            <SubpageHeader
              currentLang={currentLang}
              activeSection="systems"
              onNavigate={handleNavigate}
            />
            {liveSettings?.showSystems !== false && (
              <SystemsSection
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onSelectSystemForBOQ={handleSelectSystemForBOQ}
                customSystems={liveSystems || undefined}
                customSettings={liveSettings}
                isCuratedPreview={false}
              />
            )}
            <SubpageBottomCTA currentLang={currentLang} onNavigate={handleNavigate} />
          </div>
        )}

        {/* ==============================================================
            ROUTE 4: /projects (سابقة الأعمال والمشاريع الحقلية المعتمدة)
            ============================================================== */}
        {activeSection === 'projects' && (
          <div className="space-y-0">
            <SubpageHeader
              currentLang={currentLang}
              activeSection="projects"
              onNavigate={handleNavigate}
            />
            {liveSettings?.showProjects !== false && (
              <ProjectsSection
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onSelectProjectForBOQ={handleSelectSystemForBOQ}
                customProjects={liveProjects || undefined}
                customSettings={liveSettings}
                isCuratedPreview={false}
              />
            )}
            <SubpageBottomCTA currentLang={currentLang} onNavigate={handleNavigate} />
          </div>
        )}

        {/* ==============================================================
            ROUTE 5: /configurator (مساعد التقدير الهندسي المحدث مع عدد الغرف)
            ============================================================== */}
        {activeSection === 'configurator' && (
          <div className="space-y-0">
            <SubpageHeader
              currentLang={currentLang}
              activeSection="configurator"
              onNavigate={handleNavigate}
            />
            {liveSettings?.showConfigurator !== false && (
              <BOQConfigurator
                currentLang={currentLang}
                onNavigate={handleNavigate}
                onPrefillInquiry={handlePrefillInquiryFromConfigurator}
                customSettings={liveSettings}
              />
            )}
            <SubpageBottomCTA currentLang={currentLang} onNavigate={handleNavigate} />
          </div>
        )}

        {/* ==============================================================
            ROUTE 6: /brands (الشركاء التقنيون والعلامات التجارية المعتمدة)
            ============================================================== */}
        {activeSection === 'brands' && (
          <div className="space-y-0">
            <SubpageHeader
              currentLang={currentLang}
              activeSection="brands"
              onNavigate={handleNavigate}
            />
            {liveSettings?.showPartners !== false && (
              <PartnersSection
                currentLang={currentLang}
                onNavigate={handleNavigate}
                customVendors={liveVendors || undefined}
                customSettings={liveSettings}
                isCuratedPreview={false}
              />
            )}
            <SubpageBottomCTA currentLang={currentLang} onNavigate={handleNavigate} />
          </div>
        )}

        {/* ==============================================================
            ROUTE 7: /contact (اتصل بنا وطلب المعاينة والزيارة الميدانية)
            ============================================================== */}
        {activeSection === 'contact' && (
          <div className="space-y-0">
            <SubpageHeader
              currentLang={currentLang}
              activeSection="contact"
              onNavigate={handleNavigate}
            />
            {liveSettings?.showContact !== false && (
              <ContactSection
                currentLang={currentLang}
                prefilledMessage={prefilledMessage}
                prefilledService={prefilledService}
                customSettings={liveSettings}
              />
            )}
          </div>
        )}
      </main>

      {/* Quiet Corporate Footer with page-aware navigation links */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        customSettings={liveSettings}
        sectionVisibility={liveSettings || undefined}
      />
    </div>
  );
}

/**
 * Reusable Bottom CTA Banner for Subpages
 */
function SubpageBottomCTA({
  currentLang,
  onNavigate,
}: {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
}) {
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#070d1a] border-t border-[#1e2e50] py-14 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132347] border border-[#1e2e50] text-xs font-mono text-[#38bdf8] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span>
            {isRtl
              ? 'دراسة فنية ومعاينة موقع مجانية'
              : 'Complimentary Site Inspection & Technical Study'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-white mb-3">
          {isRtl
            ? 'هل ترغب في دراسة هندسية أو مقايسة متكاملة لمنشأتك؟'
            : 'Looking for a Turnkey Engineering BOQ or Site Survey for Your Facility?'}
        </h3>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {isRtl
            ? 'فريقنا الهندسي في مصر للطاقة الخضراء جاهز لإجراء المعاينة الحقلية وتقديم عروض أسعار تفصيلية ومخططات معتمدة وفقاً لكودات الحريق وتوزيع الكابلات.'
            : 'Our engineering team at Egypt Green Energy is ready to perform site inspections and provide itemized proposals complying with Egyptian fire and structured cabling codes.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('configurator')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-[#0a1122] bg-[#22c55e] hover:bg-[#16a34a] hover:text-white transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <span>{isRtl ? 'حاسبة التقدير الهندسي المبدئي' : 'Engineering BOQ Estimator'}</span>
            <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#0f1a34] hover:bg-[#16254a] border border-[#1e2e50] hover:border-slate-400 transition-all cursor-pointer"
          >
            <span>{isRtl ? 'طلب معاينة موقع وتواصل مباشر' : 'Request Site Survey & Consultation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
