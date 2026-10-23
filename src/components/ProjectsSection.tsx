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
    <section id="projects" className="py-20 lg:py-28 bg-[#f8fafc] text-[#0a1122] border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
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

        {/* Filter Controls: Clean segmented tabs on #f1f5f9 */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 p-1 bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#0a1122] text-white font-semibold'
                  : 'text-slate-600 hover:text-[#0a1122]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('surveillance')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'surveillance'
                  ? 'bg-[#0a1122] text-white font-semibold'
                  : 'text-slate-600 hover:text-[#0a1122]'
              }`}
            >
              {t.filterSurveillance}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('networks')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'networks'
                  ? 'bg-[#0a1122] text-white font-semibold'
                  : 'text-slate-600 hover:text-[#0a1122]'
              }`}
            >
              {t.filterNetworks}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('safety')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'safety'
                  ? 'bg-[#0a1122] text-white font-semibold'
                  : 'text-slate-600 hover:text-[#0a1122]'
              }`}
            >
              {t.filterSafety}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('smart-bms')}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'smart-bms'
                  ? 'bg-[#0a1122] text-white font-semibold'
                  : 'text-slate-600 hover:text-[#0a1122]'
              }`}
            >
              {t.filterSmartBms}
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {currentLang === 'ar' ? 'نماذج من الأعمال' : 'Representative Work Samples'}
          </div>
        </div>

        {/* Projects Grid: Flat Paper White Cards with #e2e8f0 hairline border */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between flat-card ${
                  isSelected
                    ? 'border-[#0ea5e9] ring-1 ring-[#0ea5e9]'
                    : 'border-[#e2e8f0] hover:border-slate-400'
                }`}
              >
                <div>
                  {/* Visual Thumbnail */}
                  <div className="relative h-52 overflow-hidden bg-[#0a1122]">
                    <img
                      src={resolveImageUrl(project.image, DEFAULT_CABLING_IMAGE)}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      onError={handleImageError(DEFAULT_CABLING_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1122] via-transparent to-transparent" />
                    
                    {/* Category label with brand green dot */}
                    <div className="absolute bottom-3 start-3 text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      <span>{project.categoryLabel}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 end-3 px-2 py-0.5 rounded-md bg-[#22c55e] text-[#0a1122] text-[10px] font-mono font-bold flex items-center gap-1">
                        <span>{currentLang === 'ar' ? 'معروض بالأسفل' : 'Open Below'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Sector / Facility Type */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mb-2">
                      <Building2 className="w-3.5 h-3.5 text-[#0ea5e9]" />
                      <span>{project.clientType || project.sector || (currentLang === 'ar' ? 'منشأة نموذجية' : 'Case Study Facility')}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-[#0a1122] mb-2 group-hover:text-[#0ea5e9] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2 font-normal">
                      {project.description}
                    </p>

                    {/* Top Impact Highlight */}
                    <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        {project.impactMetrics[0].label}:
                      </span>
                      <span className="font-semibold text-[#0a1122] font-mono tabular-nums">
                        {project.impactMetrics[0].value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="px-6 pb-6 pt-3 flex items-center justify-between text-xs font-medium text-[#0a1122] border-t border-[#e2e8f0] mt-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-slate-600">
                    <FileCheck2 className="w-4 h-4 text-[#0ea5e9]" />
                    <span>{isSelected ? (currentLang === 'ar' ? 'انتقل للتفاصيل ↓' : 'Read Below ↓') : t.viewDetails}</span>
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center transition-colors">
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
            className="mt-14 bg-white rounded-2xl border border-[#0a1122] p-6 sm:p-10 flat-card scroll-mt-28 transition-all relative overflow-hidden"
          >
            {/* Direct Notice Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                <span className="text-xs sm:text-sm font-mono text-[#0a1122] font-semibold">
                  {currentLang === 'ar'
                    ? `مواصفات ونطاق أعمال المشروع: ${selectedProject.title}`
                    : `Project Scope & Specs: ${selectedProject.title}`}
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleCloseProjectDossier}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-[#0a1122] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{currentLang === 'ar' ? 'العودة للمشروعات' : 'Back to Projects'}</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Media Column */}
              <div className="w-full lg:w-5/12">
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#0a1122]">
                  <img
                    src={resolveImageUrl(selectedProject.image, DEFAULT_CABLING_IMAGE)}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    onError={handleImageError(DEFAULT_CABLING_IMAGE)}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1122] via-transparent to-transparent flex items-end p-6">
                    <span className="text-xs font-mono font-medium text-white bg-[#0a1122]/90 border border-[#1e2e50] px-3 py-1 rounded-md">
                      {selectedProject.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-5 p-5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-2.5">
                  <span className="block text-xs font-mono font-semibold text-[#0a1122] uppercase tracking-wider mb-2">
                    {currentLang === 'ar' ? 'المواصفات الفنية المعتمدة' : 'Technical Specifications'}
                  </span>
                  {selectedProject.technicalSpecs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between text-xs py-1 border-b border-[#e2e8f0] last:border-0">
                      <span className="text-slate-600">{spec.label}</span>
                      <span className="font-semibold text-[#0a1122] font-mono tabular-nums">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope & Deliverables Column */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-mono text-[#0a1122] uppercase tracking-wider bg-[#f1f5f9] border border-[#e2e8f0] px-2.5 py-1 rounded-md inline-block">
                        {selectedProject.clientType || selectedProject.sector}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-semibold text-[#0a1122] mt-3">
                        {selectedProject.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-mono text-slate-500 mb-4">
                    {selectedProject.scopeSummary}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {selectedProject.description}
                  </p>

                  <h4 className="text-xs sm:text-sm font-mono text-[#0a1122] uppercase tracking-wider mb-3 font-semibold">
                    {currentLang === 'ar' ? 'بنود نطاق الأعمال المنفذة' : 'Scope of Work Deliverables'}
                  </h4>

                  <div className="space-y-2.5 mb-8">
                    {(selectedProject.scopeOfWork || []).map((item, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
                        <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#e2e8f0]">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInquireFromProject(selectedProject.title)}
                      className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0a1122] hover:bg-[#111d38] rounded-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>{currentLang === 'ar' ? 'طلب دراسة فنية لمشروع مماثل' : 'Request Technical Study'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInquireFromProject(selectedProject.title)}
                      aria-label="Direct request"
                      className="w-11 h-11 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <ArrowIcon className="w-3.5 h-3.5 rtl:rotate-0" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseProjectDossier}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono text-slate-600 hover:text-[#0a1122] rounded-lg border border-[#e2e8f0] hover:border-slate-400 transition-colors cursor-pointer"
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
