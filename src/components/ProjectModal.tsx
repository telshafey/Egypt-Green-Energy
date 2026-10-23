import React from 'react';
import { Language, ProjectItem } from '../types';
import { content } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_CABLING_IMAGE } from '../utils/imageHelper';
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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0a1122]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl flat-card border border-[#e2e8f0] overflow-hidden text-[#0a1122] transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-[#0a1122]">
          <img
            src={resolveImageUrl(project.image, DEFAULT_CABLING_IMAGE)}
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={handleImageError(DEFAULT_CABLING_IMAGE)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1122] via-[#0a1122]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 end-4 w-9 h-9 flex items-center justify-center rounded-lg bg-[#0a1122]/80 hover:bg-[#0a1122] text-white border border-[#1e2e50] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Overlay Info */}
          <div className="absolute bottom-4 start-6 end-6 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0a1122]/90 border border-[#1e2e50] text-xs font-mono text-white mb-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>{project.categoryLabel}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pb-4 border-b border-[#e2e8f0] font-mono">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0ea5e9] shrink-0" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0ea5e9] shrink-0" />
              <span>{project.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#0ea5e9] shrink-0" />
              <span>{project.clientType}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
              {currentLang === 'ar' ? 'نطاق الأعمال والمواصفات' : 'Scope of Work & Engineering'}
            </h4>
            <p className="text-sm sm:text-base text-[#0a1122] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technical Specs & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flat-card">
              <h5 className="text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-3 font-mono">
                {currentLang === 'ar' ? 'مؤشرات الأداء والإنجاز' : 'Impact & Metrics'}
              </h5>
              <div className="space-y-2">
                {project.impactMetrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{m.label}</span>
                    <span className="font-semibold text-[#0a1122] font-mono">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flat-card">
              <h5 className="text-xs font-semibold text-[#0a1122] uppercase tracking-wider mb-3 font-mono">
                {currentLang === 'ar' ? 'المعايير الهندسية المطبقة' : 'Engineering Standards'}
              </h5>
              <div className="space-y-2">
                {project.technicalSpecs.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#0a1122]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                    <span>{s.label}: <strong className="font-mono">{s.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0a1122] transition-colors cursor-pointer"
          >
            {currentLang === 'ar' ? 'إغلاق النافذة' : 'Close'}
          </button>

          <button
            onClick={() => {
              onInquire(project.title);
              onClose();
            }}
            className="group inline-flex items-center overflow-hidden rounded-lg bg-[#0a1122] hover:bg-[#111d38] text-white transition-colors cursor-pointer"
          >
            <span className="py-2.5 px-5 font-semibold text-xs sm:text-sm">
              {currentLang === 'ar' ? 'طلب مقايسة لهذا المشروع' : 'Request Proposal For Similar Project'}
            </span>
            <span className="w-10 h-10 bg-[#22c55e] text-[#0a1122] flex items-center justify-center shrink-0 group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
              <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};


