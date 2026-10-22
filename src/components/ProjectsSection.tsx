import React, { useState, useRef } from 'react';
import { Language, NavSection, ProjectItem } from '../types';
import { content } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_CABLING_IMAGE } from '../utils/imageHelper';
import {
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  FileCheck2,
  CheckCircle2,
  Send,
} from 'lucide-react';

interface ProjectsSectionProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  onSelectProjectForBOQ?: (projectTitle: string) => void;
  customProjects?: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  currentLang,
  onNavigate,
  onSelectProjectForBOQ,
  customProjects,
}) => {
  const t = content[currentLang].projects;
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeFilter, setActiveFilter] = useState<'all' | 'surveillance' | 'networks' | 'safety' | 'smart-bms'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const projectDossierRef = useRef<HTMLDivElement | null>(null);

  const projectsList = (customProjects && customProjects.length > 0) ? customProjects : t.items;

  const filteredProjects = activeFilter === 'all'
    ? projectsList
    : projectsList.filter((item) => item.category === activeFilter);

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setTimeout(() => {
      if (projectDossierRef.current) {
        projectDossierRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleCloseProjectDossier = () => {
    setSelectedProject(null);
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInquireFromProject = (projectTitle: string) => {
    if (onSelectProjectForBOQ) {
      onSelectProjectForBOQ(projectTitle);
    }
    onNavigate('contact');
  };

  return (
    <section id="projects" className="py-20 lg:py-28 bg-[#f7f7f5] text-[#222f30] border-b border-[#c9cbbe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#4d5757] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222f30] mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-[#4d5757] leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* Filter Controls: Clean segmented tabs on #e7e8e1 */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-4 border-b border-[#c9cbbe]">
          <div className="flex items-center gap-1.5 p-1 bg-[#e7e8e1] border border-[#c9cbbe] rounded-xl overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white text-[#222f30] font-semibold'
                  : 'text-[#4d5757] hover:text-[#222f30]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('surveillance')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'surveillance'
                  ? 'bg-white text-[#222f30] font-semibold'
                  : 'text-[#4d5757] hover:text-[#222f30]'
              }`}
            >
              {t.filterSurveillance}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('networks')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'networks'
                  ? 'bg-white text-[#222f30] font-semibold'
                  : 'text-[#4d5757] hover:text-[#222f30]'
              }`}
            >
              {t.filterNetworks}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('safety')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'safety'
                  ? 'bg-white text-[#222f30] font-semibold'
                  : 'text-[#4d5757] hover:text-[#222f30]'
              }`}
            >
              {t.filterSafety}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('smart-bms')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'smart-bms'
                  ? 'bg-white text-[#222f30] font-semibold'
                  : 'text-[#4d5757] hover:text-[#222f30]'
              }`}
            >
              {t.filterSmartBms}
            </button>
          </div>

          <div className="text-xs text-[#4d5757] font-mono">
            {currentLang === 'ar' ? 'نماذج من الأعمال' : 'Representative Work Samples'}
          </div>
        </div>

        {/* Projects Grid: Flat Paper White Cards with #c9cbbe hairline border */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between flat-card ${
                  isSelected
                    ? 'border-[#222f30] ring-1 ring-[#222f30]'
                    : 'border-[#c9cbbe] hover:border-[#4d5757]'
                }`}
              >
                <div>
                  {/* Visual Thumbnail */}
                  <div className="relative h-52 overflow-hidden bg-[#222f30]">
                    <img
                      src={resolveImageUrl(project.image, DEFAULT_CABLING_IMAGE)}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      onError={handleImageError(DEFAULT_CABLING_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222f30] via-transparent to-transparent" />
                    
                    {/* Category label with 6px lime dot */}
                    <div className="absolute bottom-3 start-3 text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e]" />
                      <span>{project.categoryLabel}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 end-3 px-2 py-0.5 rounded-md bg-[#cef79e] text-[#222f30] text-[10px] font-mono font-bold flex items-center gap-1">
                        <span>{currentLang === 'ar' ? 'معروض بالأسفل' : 'Open Below'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Sector / Facility Type */}
                    <div className="flex items-center gap-1.5 text-xs text-[#4d5757] font-mono mb-2">
                      <Building2 className="w-3.5 h-3.5 text-[#222f30]" />
                      <span>{project.clientType || project.sector || (currentLang === 'ar' ? 'منشأة نموذجية' : 'Case Study Facility')}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-[#222f30] mb-2 group-hover:text-[#4d5757] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4d5757] leading-relaxed mb-5 line-clamp-2 font-normal">
                      {project.description}
                    </p>

                    {/* Top Impact Highlight */}
                    <div className="p-3 bg-[#f7f7f5] rounded-xl border border-[#c9cbbe] flex items-center justify-between text-xs">
                      <span className="text-[#4d5757] font-medium">
                        {project.impactMetrics[0].label}:
                      </span>
                      <span className="font-semibold text-[#222f30] font-mono tabular-nums">
                        {project.impactMetrics[0].value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: 40x40 Lime Arrow button */}
                <div className="px-6 pb-6 pt-3 flex items-center justify-between text-xs font-medium text-[#222f30] border-t border-[#c9cbbe] mt-2">
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <FileCheck2 className="w-4 h-4 text-[#222f30]" />
                    <span>{isSelected ? (currentLang === 'ar' ? 'انتقل للتفاصيل ↓' : 'Read Below ↓') : t.viewDetails}</span>
                  </span>
                  <div className="btn-arrow-lime">
                    <ArrowIcon className="w-3.5 h-3.5 rtl:rotate-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline In-Page Project Dossier */}
        {selectedProject && (
          <div
            ref={projectDossierRef}
            id="project-technical-dossier"
            tabIndex={-1}
            className="mt-14 bg-white rounded-2xl border border-[#222f30] p-6 sm:p-10 flat-card scroll-mt-28 transition-all relative overflow-hidden"
          >
            {/* Direct Notice Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#c9cbbe]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#cef79e] inline-block" />
                <span className="text-xs sm:text-sm font-mono text-[#222f30] font-semibold">
                  {currentLang === 'ar'
                    ? `مواصفات ونطاق أعمال المشروع: ${selectedProject.title}`
                    : `Project Scope & Specs: ${selectedProject.title}`}
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleCloseProjectDossier}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-[#222f30] bg-[#f7f7f5] hover:bg-[#e7e8e1] border border-[#c9cbbe] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{currentLang === 'ar' ? 'العودة للمشروعات' : 'Back to Projects'}</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Media Column */}
              <div className="w-full lg:w-5/12">
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden border border-[#c9cbbe] bg-[#222f30]">
                  <img
                    src={resolveImageUrl(selectedProject.image, DEFAULT_CABLING_IMAGE)}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    onError={handleImageError(DEFAULT_CABLING_IMAGE)}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222f30] via-transparent to-transparent flex items-end p-6">
                    <span className="text-xs font-mono font-medium text-white bg-[#222f30]/90 border border-[#4d5757] px-3 py-1 rounded-md">
                      {selectedProject.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-5 p-5 bg-[#f7f7f5] rounded-xl border border-[#c9cbbe] space-y-2.5">
                  <span className="block text-xs font-mono font-semibold text-[#222f30] uppercase tracking-wider mb-2">
                    {currentLang === 'ar' ? 'المواصفات الفنية المعتمدة' : 'Technical Specifications'}
                  </span>
                  {selectedProject.technicalSpecs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between text-xs py-1 border-b border-[#c9cbbe] last:border-0">
                      <span className="text-[#4d5757]">{spec.label}</span>
                      <span className="font-semibold text-[#222f30] font-mono tabular-nums">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope & Deliverables Column */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-mono text-[#222f30] uppercase tracking-wider bg-[#e7e8e1] border border-[#c9cbbe] px-2.5 py-1 rounded-md inline-block">
                        {selectedProject.clientType || selectedProject.sector}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-semibold text-[#222f30] mt-3">
                        {selectedProject.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-mono text-[#4d5757] mb-4">
                    {selectedProject.scopeSummary}
                  </p>

                  <p className="text-xs sm:text-sm text-[#4d5757] leading-relaxed mb-6 font-normal">
                    {selectedProject.description}
                  </p>

                  <h4 className="text-xs sm:text-sm font-mono text-[#222f30] uppercase tracking-wider mb-3 font-semibold">
                    {currentLang === 'ar' ? 'بنود نطاق الأعمال المنفذة' : 'Scope of Work Deliverables'}
                  </h4>

                  <div className="space-y-2.5 mb-8">
                    {(selectedProject.scopeOfWork || []).map((item, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#4d5757] bg-[#f7f7f5] p-3 rounded-xl border border-[#c9cbbe]">
                        <CheckCircle2 className="w-4 h-4 text-[#222f30] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#c9cbbe]">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInquireFromProject(selectedProject.title)}
                      className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#222f30] hover:bg-[#1a2425] rounded-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>{currentLang === 'ar' ? 'طلب دراسة فنية لمشروع مماثل' : 'Request Technical Study'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInquireFromProject(selectedProject.title)}
                      aria-label="Direct request"
                      className="btn-arrow-lime cursor-pointer"
                    >
                      <ArrowIcon className="w-3.5 h-3.5 rtl:rotate-0" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseProjectDossier}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono text-[#4d5757] hover:text-[#222f30] rounded-lg border border-[#c9cbbe] hover:border-[#4d5757] transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{t.closeModal}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
