/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, NavSection } from './types';
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
import {
  SiteSettingsData,
  getSiteSettings,
  subscribeToSiteSettings,
  getSystems,
  subscribeToSystems,
  getProjects,
  subscribeToProjects,
} from './services/firebaseService';
import { LightCurrentSystem, ProjectItem } from './types';

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
        // Strip any residual hash from URL
        if (hash) {
          window.history.replaceState(null, '', `/${pathname}`);
        }
        return;
      }

      // 2. If visiting old /admin or #admin, clean up and redirect to home
      if (pathname === 'admin' || hash === '#admin' || hash === '#admin-portal') {
        window.history.replaceState(null, '', '/');
        setIsAdminOpen(false);
        return;
      }

      // Default: Public visitor view
      setIsAdminOpen(false);
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Fetch & Subscribe to live settings, systems, and projects from Firebase
  useEffect(() => {
    // Initial fetch
    getSiteSettings().then(setLiveSettings).catch(console.warn);
    getSystems().then((s) => s.length > 0 && setLiveSystems(s)).catch(console.warn);
    getProjects().then((p) => p.length > 0 && setLiveProjects(p)).catch(console.warn);

    // Real-time Firestore subscriptions
    const unsubSettings = subscribeToSiteSettings((s) => setLiveSettings(s));
    const unsubSystems = subscribeToSystems((sys) => {
      if (sys && sys.length > 0) setLiveSystems(sys);
    });
    const unsubProjects = subscribeToProjects((projs) => {
      if (projs && projs.length > 0) setLiveProjects(projs);
    });

    return () => {
      unsubSettings();
      unsubSystems();
      unsubProjects();
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
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleOpenAdmin = () => {
    window.history.pushState(null, '', ADMIN_SECRET_PATH);
    setIsAdminOpen(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      />

      <main className="flex-1">
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
          customHeroImage={liveSettings?.heroImageUrl}
          customLogoUrl={liveSettings?.logoUrl}
        />

        {/* 2. Quantified Stats & Heritage Strip */}
        <StatsStrip currentLang={currentLang} />

        {/* 3. About Us with 44-year Heritage & Interactive Timeline */}
        <AboutSection currentLang={currentLang} />

        {/* 4. Historical Track Record in Energy, Water & Biotechnology */}
        <HeritageOverview currentLang={currentLang} />

        {/* 5. Flagship: Comprehensive Low Current (ELV) Systems Showcase */}
        <SystemsSection
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onSelectSystemForBOQ={handleSelectSystemForBOQ}
          customSystems={liveSystems || undefined}
        />

        {/* 5. Landmark Low Current Projects & Field Installations */}
        <ProjectsSection
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onSelectProjectForBOQ={handleSelectSystemForBOQ}
          customProjects={liveProjects || undefined}
        />

        {/* 6. Interactive Low Current Scope & BOQ Configurator */}
        <BOQConfigurator
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onPrefillInquiry={handlePrefillInquiryFromConfigurator}
        />

        {/* 7. Technology Partners & Certified Vendors */}
        <PartnersSection currentLang={currentLang} />

        {/* 8. Engineering Contact Section with Validation, WhatsApp, and Nasr City Location */}
        <ContactSection
          currentLang={currentLang}
          prefilledMessage={prefilledMessage}
          prefilledService={prefilledService}
          customSettings={liveSettings}
        />
      </main>

      {/* 9. Quiet Corporate Footer without public admin link */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        customSettings={liveSettings}
      />
    </div>
  );
}
