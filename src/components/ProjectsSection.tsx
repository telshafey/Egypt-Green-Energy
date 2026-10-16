import React, { useState, useRef } from 'react';
import { Language, NavSection, ProjectItem } from '../types';
import { content } from '../data/translations';
import {
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';

interface ProjectsSectionProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  onSelectProjectForBOQ?: (projectTitle: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  currentLang,
  onNavigate,
  onSelectProjectForBOQ,
}) => {
  const t = content[currentLang].projects;
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeFilter, setActiveFilter] = useState<'all' | 'surveillance' | 'networks' | 'safety' | 'smart-bms'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Ref to project technical dossier to transport visitor directly to reading the content
  const projectDossierRef = useRef<HTMLDivElement | null>(null);

  const filteredProjects = activeFilter === 'all'
    ? t.items
    : t.items.filter((item) => item.category === activeFilter);

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
    // Transport visitor directly to reading the content immediately
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
    <section id="projects" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2 font-mono">
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

        {/* Filter Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveFilter('surveillance')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'surveillance'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterSurveillance}
            </button>
            <button
              onClick={() => setActiveFilter('networks')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'networks'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterNetworks}
            </button>
            <button
              onClick={() => setActiveFilter('safety')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'safety'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterSafety}
            </button>
            <button
              onClick={() => setActiveFilter('smart-bms')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === 'smart-bms'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterSmartBms}
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {filteredProjects.length} {currentLang === 'ar' ? 'مشروعاً معتمداً' : 'Verified Installations'}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md bg-emerald-50/10'
                    : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Visual Thumbnail */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Category label */}
                    <div className="absolute bottom-3 start-3 text-xs font-semibold text-white drop-shadow-sm">
                      {project.categoryLabel}
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{currentLang === 'ar' ? 'قيد القراءة بالأسفل' : 'Open Below'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Location & Year */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {project.location.split('،')[0].trim()}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {project.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Top Impact Highlight */}
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between">
                      <span className="text-xs text-emerald-950 font-medium">
                        {project.impactMetrics[0].label}:
                      </span>
                      <span className="text-sm font-bold text-emerald-800 font-mono tabular-nums">
                        {project.impactMetrics[0].value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors border-t border-slate-100 mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{isSelected ? (currentLang === 'ar' ? 'انتقل للتفاصيل بالأسفل ↓' : 'Read Below ↓') : t.viewDetails}</span>
                  </span>
                  <ArrowIcon className="w-4 h-4 rtl:rotate-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline In-Page Project Dossier (ZERO POPUPS - DIRECT IN-PAGE TRANSPORT) */}
        {selectedProject && (
          <div
            ref={projectDossierRef}
            id="project-technical-dossier"
            tabIndex={-1}
            className="mt-14 bg-white rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-10 shadow-2xl scroll-mt-28 transition-all relative overflow-hidden"
          >
            {/* Direct Notice Bar to assure visitor they have been transported directly to the content */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800">
                  {currentLang === 'ar'
                    ? `جاري قراءة تفاصيل ومواصفات المشروع: ${selectedProject.title}`
                    : `Currently Reviewing Project Specs: ${selectedProject.title}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseProjectDossier}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ar' ? 'العودة لقائمة المشروعات' : 'Back to Projects'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Media Column */}
              <div className="w-full lg:w-5/12">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6">
                    <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                      {selectedProject.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-500">{t.locationLabel}:</span>
                    <span className="font-semibold text-slate-900">{selectedProject.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-500">{t.yearLabel}:</span>
                    <span className="font-semibold text-slate-900 font-mono">{selectedProject.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-500">{t.clientLabel}:</span>
                    <span className="font-semibold text-slate-900">{selectedProject.clientType}</span>
                  </div>
                </div>
              </div>

              {/* Description & Technical Specs */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                    {selectedProject.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>

                  {/* Impact Metrics Grid */}
                  <div className="mb-6">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 font-mono">
                      {currentLang === 'ar' ? 'مؤشرات الأداء ومقاييس المشروع المنفذة' : 'Impact & Key Installation Metrics'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedProject.impactMetrics.map((metric, mIdx) => (
                        <div key={mIdx} className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center sm:text-start">
                          <span className="block text-[11px] text-emerald-900 font-medium mb-1">
                            {metric.label}
                          </span>
                          <span className="block text-base sm:text-lg font-bold text-emerald-800 font-mono tabular-nums">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="mb-8">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 font-mono">
                      {currentLang === 'ar' ? 'المواصفات الفنية المعتمدة للمشروع' : 'Approved Technical Specifications'}
                    </h4>
                    <div className="space-y-2.5">
                      {selectedProject.technicalSpecs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm">
                          <span className="font-semibold text-slate-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{spec.label}:</span>
                          </span>
                          <span className="font-mono text-slate-900 font-medium text-end">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => handleInquireFromProject(selectedProject.title)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{currentLang === 'ar' ? 'طلب دراسة ومقايسة مماثلة لهذا المشروع' : 'Request Similar Project BOQ'}</span>
                  </button>

                  <button
                    onClick={handleCloseProjectDossier}
                    className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
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
