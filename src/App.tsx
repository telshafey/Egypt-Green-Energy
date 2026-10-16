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
import { SiteSettingsData, getSiteSettings } from './services/firebaseService';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [liveSettings, setLiveSettings] = useState<SiteSettingsData | null>(null);

  // Check URL hash or query for admin route on boot & listen to hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#admin' || hash === '#admin-portal' || search.includes('admin=true')) {
        setIsAdminOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Fetch live settings from Firebase on startup
  useEffect(() => {
    async function loadInitialSettings() {
      try {
        const s = await getSiteSettings();
        setLiveSettings(s);
      } catch (err) {
        console.warn('App: Initial settings fallback:', err);
      }
    }
    loadInitialSettings();
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

  // If Admin portal is activated, render the dedicated zero-popup dashboard
  if (isAdminOpen) {
    return (
      <AdminDashboard
        currentLang={currentLang}
        onExit={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin' || window.location.hash === '#admin-portal') {
            history.pushState(null, '', window.location.pathname);
          }
        }}
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
        />

        {/* 5. Landmark Low Current Projects & Field Installations */}
        <ProjectsSection
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onSelectProjectForBOQ={handleSelectSystemForBOQ}
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
        />
      </main>

      {/* 9. Quiet Corporate Footer with discreet admin portal link */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
      />
    </div>
  );
}
