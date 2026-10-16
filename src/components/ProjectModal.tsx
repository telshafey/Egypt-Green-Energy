import React from 'react';
import { Language, ProjectItem } from '../types';
import { content } from '../data/translations';
import { X, MapPin, Calendar, Building2, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  currentLang: Language;
  onClose: () => void;
  onInquire: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  currentLang,
  onClose,
  onInquire,
}) => {
  if (!project) return null;

  const t = content[currentLang].projects;
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-900">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 end-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay Info */}
          <div className="absolute bottom-4 start-6 end-6 text-white">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white mb-2 inline-block">
              {project.categoryLabel}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-mono">{project.year}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{project.clientType}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              {currentLang === 'ar' ? 'نطاق الأعمال والمواصفات' : 'Scope of Work & Engineering'}
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technical Specs & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">
                {currentLang === 'ar' ? 'مؤشرات الأداء والإنجاز' : 'Impact & Metrics'}
              </h5>
              <div className="space-y-2">
                {project.impactMetrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-emerald-900">{m.label}</span>
                    <span className="font-bold text-emerald-800 font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                {currentLang === 'ar' ? 'المعايير الهندسية المطبقة' : 'Engineering Standards'}
              </h5>
              <div className="space-y-2">
                {project.technicalSpecs.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s.label}: <strong>{s.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            {currentLang === 'ar' ? 'إغلاق' : 'Close'}
          </button>

          <button
            onClick={() => {
              onInquire(project.title);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <span>{currentLang === 'ar' ? 'طلب مقايسة لهذا النوع من المشروعات' : 'Request Proposal For Similar Project'}</span>
            <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
