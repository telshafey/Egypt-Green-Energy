import React, { useState } from 'react';
import { Language, NavSection, ProjectItem } from '../types';
import { content } from '../data/translations';
import { ProjectModal } from './ProjectModal';
import { MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

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
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filteredProjects = activeFilter === 'all'
    ? t.items
    : t.items.filter((item) => item.category === activeFilter);

  const handleInquireFromModal = (projectTitle: string) => {
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

        {/* Filter Controls: Interactive tabs permitted under Section 1.A */}
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

        {/* Projects Grid: Clean Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
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
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Location & Year (NO PILLS: clean unboxed text) */}
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
                <span>{t.viewDetails}</span>
                <ArrowIcon className="w-4 h-4 rtl:rotate-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Dossier Modal */}
      <ProjectModal
        project={activeModalProject}
        currentLang={currentLang}
        onClose={() => setActiveModalProject(null)}
        onInquire={handleInquireFromModal}
      />
    </section>
  );
};
