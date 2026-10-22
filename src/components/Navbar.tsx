import React, { useState } from 'react';
import { Language, NavSection } from '../types';
import { content } from '../data/translations';
import { Menu, X, Globe, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentLang: Language;
  onToggleLang: () => void;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  customLogoUrl?: string;
  companyNameAr?: string;
  companyNameEn?: string;
  sectionVisibility?: {
    showAbout?: boolean;
    showSystems?: boolean;
    showProjects?: boolean;
    showConfigurator?: boolean;
    showContact?: boolean;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  activeSection,
  onNavigate,
  customLogoUrl,
  companyNameAr,
  companyNameEn,
  sectionVisibility,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[currentLang];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#222f30] border-b border-[#4d5757]/60 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar: Zone 1 (Wordmark) — Zone 2 (Clean nav links) — Zone 3 (Primary action + lang switcher) */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark with Official Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="group cursor-pointer shrink-0"
          >
            <BrandLogo
              size="md"
              variant="horizontal"
              textColor="white"
              logoUrl={customLogoUrl}
              companyNameAr={companyNameAr}
              companyNameEn={companyNameEn}
            />
          </button>

          {/* Zone 2: Single-line Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-[#c9cbbe]">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                activeSection === 'home' ? 'text-white font-semibold' : ''
              }`}
            >
              {activeSection === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] inline-block" />}
              <span>{t.nav.home}</span>
            </button>
            {sectionVisibility?.showAbout !== false && (
              <button
                onClick={() => handleNavClick('about')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeSection === 'about' ? 'text-white font-semibold' : ''
                }`}
              >
                {activeSection === 'about' && <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] inline-block" />}
                <span>{t.nav.about}</span>
              </button>
            )}
            {sectionVisibility?.showSystems !== false && (
              <button
                onClick={() => handleNavClick('systems')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeSection === 'systems' ? 'text-white font-semibold' : ''
                }`}
              >
                {activeSection === 'systems' && <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] inline-block" />}
                <span>{t.nav.systems}</span>
              </button>
            )}
            {sectionVisibility?.showProjects !== false && (
              <button
                onClick={() => handleNavClick('projects')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeSection === 'projects' ? 'text-white font-semibold' : ''
                }`}
              >
                {activeSection === 'projects' && <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] inline-block" />}
                <span>{t.nav.projects}</span>
              </button>
            )}
            {sectionVisibility?.showConfigurator !== false && (
              <button
                onClick={() => handleNavClick('configurator')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeSection === 'configurator' ? 'text-white font-semibold' : ''
                }`}
              >
                {activeSection === 'configurator' && <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] inline-block" />}
                <span>{t.nav.configurator}</span>
              </button>
            )}
            {sectionVisibility?.showContact !== false && (
              <button
                onClick={() => handleNavClick('contact')}
                className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  activeSection === 'contact' ? 'text-white font-semibold' : ''
                }`}
              >
                {activeSection === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] inline-block" />}
                <span>{t.nav.contact}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action + Language Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              aria-label="Toggle Language"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-[#c9cbbe] bg-transparent hover:text-white border border-[#4d5757] hover:border-[#c9cbbe] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#c9cbbe]" />
              <span>{t.nav.langToggle}</span>
            </button>

            {/* Primary Action Button: White button on dark surface with 8px radius */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#222f30] bg-white hover:bg-[#f7f7f5] active:scale-[0.99] rounded-lg transition-all whitespace-nowrap cursor-pointer"
            >
              {t.nav.ctaButton}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className="lg:hidden p-2 text-[#c9cbbe] hover:text-white rounded-lg border border-[#4d5757] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#4d5757] bg-[#222f30] px-4 pt-3 pb-6 animate-in fade-in duration-150">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#c9cbbe]">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-[#2a3a3b] hover:text-white transition-colors"
            >
              {t.nav.home}
            </button>
            {sectionVisibility?.showAbout !== false && (
              <button
                onClick={() => handleNavClick('about')}
                className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-[#2a3a3b] hover:text-white transition-colors"
              >
                {t.nav.about}
              </button>
            )}
            {sectionVisibility?.showSystems !== false && (
              <button
                onClick={() => handleNavClick('systems')}
                className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-[#2a3a3b] hover:text-white transition-colors"
              >
                {t.nav.systems}
              </button>
            )}
            {sectionVisibility?.showProjects !== false && (
              <button
                onClick={() => handleNavClick('projects')}
                className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-[#2a3a3b] hover:text-white transition-colors"
              >
                {t.nav.projects}
              </button>
            )}
            {sectionVisibility?.showConfigurator !== false && (
              <button
                onClick={() => handleNavClick('configurator')}
                className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-[#2a3a3b] hover:text-white transition-colors"
              >
                {t.nav.configurator}
              </button>
            )}
            {sectionVisibility?.showContact !== false && (
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-[#2a3a3b] hover:text-white transition-colors"
              >
                {t.nav.contact}
              </button>
            )}
            <div className="pt-2 border-t border-[#4d5757] flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full py-2.5 px-4 text-center font-semibold text-[#222f30] bg-white hover:bg-[#f7f7f5] rounded-lg transition-colors"
              >
                {t.nav.ctaButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
