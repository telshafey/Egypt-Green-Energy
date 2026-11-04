import React, { useState } from 'react';
import {
  X,
  Search,
  Upload,
  Check,
  ImageIcon,
  Sparkles,
  Database,
  ExternalLink,
  Edit3,
  Sliders,
} from 'lucide-react';
import { MediaAssetData } from '../services/firebaseService';
import { STOCK_ENGINEERING_IMAGES, StockEngineeringImage } from '../data/stockEngineeringImages';
import { resolveImageUrl, handleImageError, DEFAULT_HERO_IMAGE } from '../utils/imageHelper';

interface MediaPickerModalProps {
  isOpen: boolean;
  currentSelectedUrl?: string;
  mediaAssets: MediaAssetData[];
  title?: string;
  onClose: () => void;
  onSelect: (url: string, title?: string) => void;
  onUploadNew?: (file: File) => void;
  onOpenEditorForImage?: (url: string, title?: string) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  currentSelectedUrl,
  mediaAssets,
  title = 'اختيار صورة من المكتبة والوسائط',
  onClose,
  onSelect,
  onUploadNew,
  onOpenEditorForImage,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'stock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Filtered custom assets from Firestore
  const filteredCustomAssets = mediaAssets.filter((asset) => {
    const matchesSearch =
      !searchQuery.trim() ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.category && asset.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' ||
      asset.category === selectedCategory ||
      (selectedCategory === 'hero' && asset.category === 'hero') ||
      (selectedCategory === 'systems' && asset.category === 'systems') ||
      (selectedCategory === 'projects' && asset.category === 'projects');

    return matchesSearch && matchesCat;
  });

  // Filtered stock assets
  const filteredStockAssets = STOCK_ENGINEERING_IMAGES.filter((stock) => {
    const matchesSearch =
      !searchQuery.trim() ||
      stock.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' || stock.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadNew) {
      onUploadNew(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {mediaAssets.length + STOCK_ENGINEERING_IMAGES.length} صورة متوفرة
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                اختر من صورك المرفوعة بقاعدة البيانات، أو من مكتبة الصور الهندسية الجاهزة، أو ارفع صورة جديدة فوراً
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Category Filters & Upload Button */}
        <div className="p-4 sm:px-6 bg-slate-950/50 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم أو التخصص (CCTV، فايبر، سيرفرات، إنذار حريق، بوابات...)"
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Source Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                الكل ({mediaAssets.length + STOCK_ENGINEERING_IMAGES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مرفوعاتي ({mediaAssets.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'stock'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                معرض هندسي جاهز ({STOCK_ENGINEERING_IMAGES.length})
              </button>
            </div>

            {/* Quick Upload from Device */}
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>رفع من جهازك</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Discipline Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'all', label: 'جميع التخصصات' },
              { id: 'cctv', label: 'المراقبة والأمن (CCTV)' },
              { id: 'networks', label: 'الشبكات والكابلات (Cabling)' },
              { id: 'datacenter', label: 'مراكز البيانات (Data Centers)' },
              { id: 'access', label: 'التحكم بالدخول (Access Control)' },
              { id: 'fire', label: 'إنذار الحريق (Fire Alarm)' },
              { id: 'bms', label: 'إدارة المباني الذكية (BMS)' },
              { id: 'solar', label: 'الطاقة المتجددة (Solar)' },
              { id: 'hero', label: 'واجهة الموقع (Hero)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Custom Assets Section */}
            {(activeTab === 'all' || activeTab === 'custom') &&
              filteredCustomAssets.map((asset) => {
                const isSelected = currentSelectedUrl === asset.url;
                return (
                  <div
                    key={asset.id}
                    className={`group relative rounded-2xl overflow-hidden border bg-slate-950 flex flex-col transition-all text-start ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                      <img
                        src={resolveImageUrl(asset.url, DEFAULT_HERO_IMAGE)}
                        alt={asset.title}
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Source & Size Badge */}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                        <Database className="w-2.5 h-2.5" />
                        <span>محفوظ بالداتا بيز</span>
                      </span>

                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5" />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{asset.title}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span className="font-mono">{asset.category || 'عام'}</span>
                          {asset.sizeKb ? <span className="font-mono">{asset.sizeKb} KB</span> : null}
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-900 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(asset.url, asset.title);
                            onClose();
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer text-center"
                        >
                          اختيار هذه الصورة
                        </button>

                        {onOpenEditorForImage && (
                          <button
                            type="button"
                            onClick={() => onOpenEditorForImage(asset.url, asset.title)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="تعديل وضبط الصورة"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Curated Stock Assets Section */}
            {(activeTab === 'all' || activeTab === 'stock') &&
              filteredStockAssets.map((stock) => {
                const isSelected = currentSelectedUrl === stock.url;
                return (
                  <div
                    key={stock.id}
                    className={`group relative rounded-2xl overflow-hidden border bg-slate-950 flex flex-col transition-all text-start ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                      <img
                        src={stock.url}
                        alt={stock.titleAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Stock Quality Badge */}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-950/90 text-blue-300 border border-blue-500/50 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>جاهز هندسي</span>
                      </span>

                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5" />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{stock.titleAr}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span className="font-mono uppercase">{stock.category}</span>
                          <span className="text-slate-500 font-mono text-[9px]">High Res</span>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-900 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(stock.url, stock.titleAr);
                            onClose();
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer text-center"
                        >
                          اختيار هذه الصورة
                        </button>

                        {onOpenEditorForImage && (
                          <button
                            type="button"
                            onClick={() => onOpenEditorForImage(stock.url, stock.titleAr)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="تعديل وقص الصورة"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Empty state if nothing matches */}
          {((activeTab === 'custom' && filteredCustomAssets.length === 0) ||
            (activeTab === 'stock' && filteredStockAssets.length === 0) ||
            (activeTab === 'all' && filteredCustomAssets.length === 0 && filteredStockAssets.length === 0)) && (
            <div className="py-16 text-center text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">لم يتم العثور على صور مطابقة لخيارات البحث</p>
              <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو ارفع صورة جديدة من جهازك</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            يتم تطبيق ضغط فائق الكفاءة وحفظ النسخ في قاعدة بيانات فايربيز تلقائياً
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
