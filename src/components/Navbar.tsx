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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[currentLang];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 single-line nav links) — Zone 3 (1 primary action + lang switcher) */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark with Official Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="group cursor-pointer shrink-0"
          >
            <BrandLogo size="md" variant="horizontal" textColor="white" />
          </button>

          {/* Zone 2: Single-line Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeSection === 'home' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeSection === 'about' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleNavClick('systems')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeSection === 'systems' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.systems}
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeSection === 'projects' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => handleNavClick('configurator')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeSection === 'configurator' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.configurator}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeSection === 'contact' ? 'text-emerald-400 font-semibold' : ''
              }`}
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Language Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              aria-label="Toggle Language"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.nav.langToggle}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              {t.nav.ctaButton}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3 text-base font-medium text-slate-200">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleNavClick('systems')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            >
              {t.nav.systems}
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => handleNavClick('configurator')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            >
              {t.nav.configurator}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left rtl:text-right py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-colors"
            >
              {t.nav.contact}
            </button>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full py-2.5 px-4 text-center font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
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
