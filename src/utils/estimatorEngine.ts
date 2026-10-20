/**
 * Project Requirements Estimator Engine
 * (مساعد تقدير متطلبات المشروع)
 * 
 * Sits between customer input and formal engineering assessment.
 * Helps facility managers, contractors, and consultants articulate project scope
 * without naive, ungrounded formulas or false camera/detector counts.
 */

export type FacilityType =
  | 'office'
  | 'industrial'
  | 'healthcare'
  | 'commercial'
  | 'educational'
  | 'residential'
  | 'logistics';

export type SystemCode =
  | 'cctv'
  | 'fire'
  | 'access'
  | 'cabling'
  | 'pbx'
  | 'pa'
  | 'bms'
  | 'sla';

export interface ProjectEstimatorInput {
  facilityType: FacilityType;
  areaM2: number;
  selectedSystems: SystemCode[];
  // Progressive Disclosure Fields
  floorsCount?: number;
  buildingsCount?: number;
  projectType?: 'new_construction' | 'existing_facility';
  infrastructureStatus?: 'ready' | 'needs_full_containment' | 'under_assessment';
  estimatedEntrances?: number;
  estimatedNetworkUsers?: number;
  engineeringDrawingsAvailable?: 'yes' | 'in_progress' | 'no';
  cityOrGovernorate?: string;
  notes?: string;
}

export interface SystemAssessmentItem {
  code: SystemCode;
  titleAr: string;
  titleEn: string;
  scopeSummaryAr: string;
  scopeSummaryEn: string;
  considerationsAr: string[];
  considerationsEn: string[];
}

export interface ProjectEstimatorOutput {
  referenceNumber: string;
  generatedAt: string;
  facilityLabelAr: string;
  facilityLabelEn: string;
  areaM2: number;
  projectTypeLabelAr: string;
  projectTypeLabelEn: string;
  selectedSystemsCount: number;
  systemAssessments: SystemAssessmentItem[];
  missingDataRequiredAr: string[];
  missingDataRequiredEn: string[];
  recommendedNextStepAr: string;
  recommendedNextStepEn: string;
  formalDisclaimerAr: string;
  formalDisclaimerEn: string;
}

export const FACILITY_LABELS: Record<FacilityType, { ar: string; en: string }> = {
  office: { ar: 'مبنى إداري / مقر شركات', en: 'Commercial Office Building' },
  industrial: { ar: 'منشأة صناعية / مصنع', en: 'Industrial Manufacturing Plant' },
  healthcare: { ar: 'مستشفى / مجمع طبي', en: 'Hospital / Healthcare Facility' },
  commercial: { ar: 'مركز تجاري / مول', en: 'Commercial Shopping Mall' },
  educational: { ar: 'مؤسسة تعليمية / مدرسة / جامعة', en: 'Educational Institution' },
  residential: { ar: 'مجمع سكني / كمبوند', en: 'Residential Compound' },
  logistics: { ar: 'مستودع لوجستي / مركز توزيع', en: 'Logistics Distribution Warehouse' },
};

export const SYSTEM_DETAILS: Record<SystemCode, { titleAr: string; titleEn: string; scopeAr: string; scopeEn: string }> = {
  cctv: {
    titleAr: 'أنظمة المراقبة التلفزيونية (CCTV)',
    titleEn: 'Video Surveillance Systems (CCTV)',
    scopeAr: 'مراقبة المحيط الخارجي والمداخل والممرات وغرف الخوادم مع وسائط تسجيل مركزي.',
    scopeEn: 'Perimeter, entrance, corridor, and server room coverage with central recording.',
  },
  fire: {
    titleAr: 'أنظمة إنذار الحريق (Fire Alarm)',
    titleEn: 'Fire Alarm Systems',
    scopeAr: 'شبكة كشف معنونة ولوحة تحكم ذكية متوافقة مع اشتراطات الحماية المدنية والكود المصري.',
    scopeEn: 'Addressable detection network and control panels complying with life safety codes.',
  },
  access: {
    titleAr: 'أنظمة التحكم في الدخول (Access Control)',
    titleEn: 'Access Control Systems',
    scopeAr: 'تأمين المداخل والبوابات والأبواب الإدارية بقارئات إلكترونية وبوابات مرور أفراد.',
    scopeEn: 'Securing access points, executive areas, and gates via electronic readers and speed gates.',
  },
  cabling: {
    titleAr: 'أنظمة الكابلات الهيكلية والشبكات (Structured Cabling)',
    titleEn: 'Structured Cabling & Networking',
    scopeAr: 'تمديد كابلات الشبكات المعتمدة، كبائن السيرفرات، والروابط الضوئية العمودية.',
    scopeEn: 'Certified copper data drops, rack enclosures, and vertical fiber backbones.',
  },
  pbx: {
    titleAr: 'السنترالات والاتصالات الموحدة (IP PBX)',
    titleEn: 'IP PBX Telephony',
    scopeAr: 'شبكة اتصالات هاتفية عبر بروتوكول الإنترنت مع هواتف مكتبية ورد آلي.',
    scopeEn: 'IP telephony network with executive desk phones and interactive voice response.',
  },
  pa: {
    titleAr: 'أنظمة الإذاعة والنداء الداخلي (Public Address)',
    titleEn: 'Public Address & Acoustic Paging',
    scopeAr: 'توزيع صوتي سقفى وحائطي متعدد المناطق متوافق مع سيناريوهات إخلاء الطوارئ.',
    scopeEn: 'Multi-zone ceiling and horn acoustic distribution linked with emergency protocols.',
  },
  bms: {
    titleAr: 'أنظمة إدارة المباني (BMS)',
    titleEn: 'Building Management Systems (BMS)',
    scopeAr: 'لوحات تحكم برمجية ومستشعرات لمراقبة التكييف والإنارة ولوحات التوزيع واستهلاك الطاقة.',
    scopeEn: 'Software telemetry and sensor arrays to monitor HVAC, lighting, and power distribution.',
  },
  sla: {
    titleAr: 'عقود الصيانة واتفاقيات مستوى الخدمة (SLA)',
    titleEn: 'Maintenance & Service Level Agreements (SLA)',
    scopeAr: 'صيانة وقائية دورية ودعم فني مبرمج وفق نطاق التغطية والشروط المتفق عليها.',
    scopeEn: 'Periodic preventive maintenance and dispatched support as per contractual SLA terms.',
  },
};

/**
 * Generate a unique, professional reference ID
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `EGE-${year}-${randomPart}`;
}

/**
 * Pure evaluation engine for calculating preliminary assessment
 */
export function evaluateProjectRequirements(input: ProjectEstimatorInput): ProjectEstimatorOutput {
  const ref = generateReferenceNumber();
  const now = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const facilityMeta = FACILITY_LABELS[input.facilityType] || {
    ar: 'منشأة عامة',
    en: 'General Facility',
  };

  const projectTypeLabelAr =
    input.projectType === 'existing_facility' ? 'منشأة قائمة (تحديث / إحلال)' : 'مشروع جديد قيد الإنشاء';
  const projectTypeLabelEn =
    input.projectType === 'existing_facility' ? 'Existing Facility (Retrofit / Upgrade)' : 'New Construction';

  // System-specific evaluations
  const systemAssessments: SystemAssessmentItem[] = input.selectedSystems.map((sys) => {
    const meta = SYSTEM_DETAILS[sys];
    const considerationsAr: string[] = [];
    const considerationsEn: string[] = [];

    switch (sys) {
      case 'cctv':
        considerationsAr.push('يعتمد تحديد عدد الكاميرات ونقاط التغطية ومواصفات التخزين على المخططات المعمارية ومسارات الحركة ومواصفات الجهات المختصة.');
        considerationsAr.push(`المنشأة بمساحة تقريبية ${input.areaM2.toLocaleString('ar-EG')} م² تتطلب مسحاً ميدانياً لزوايا الرؤية وشدة الإضاءة.`);
        considerationsEn.push('Camera count, focal lengths, and storage capacity depend on architectural layout, traffic corridors, and local regulatory requirements.');
        considerationsEn.push(`The facility (${input.areaM2.toLocaleString()} m²) requires site assessment for field-of-view and lighting conditions.`);
        break;

      case 'fire':
        considerationsAr.push('توزيع كواشف الدخان والحرارة وأجهزة الإنذار الصوتي يحكمه الكود المصري للحرائق واشتراطات الحماية المدنية وارتفاع الأسقف.');
        considerationsAr.push('لا يمكن حساب عدد الكواشف بمجرد المساحة وحدها، بل بناءً على عدد الغرف والممرات والتقسيمات الداخلية.');
        considerationsEn.push('Detector spacing and voice sounders are strictly governed by Egyptian Fire Code, civil defense requirements, and ceiling heights.');
        considerationsEn.push('Detector counts cannot be derived from area alone, but require review of room partitions and corridors.');
        break;

      case 'access':
        considerationsAr.push(`تم رصد الحاجة لتأمين المداخل والمخارج${input.estimatedEntrances ? ` (المقدّر بـ ${input.estimatedEntrances} مدخل/مخرج)` : ''} مع بوابات مرور أو أقفال كهرومغناطيسية.`);
        considerationsAr.push('تحديد قارئات البصمة أو البطاقات يعتمد على تدفق الأفراد ومستويات الأمان المطلوبة.');
        considerationsEn.push(`Securing entrances${input.estimatedEntrances ? ` (~${input.estimatedEntrances} access points noted)` : ''} with speed gates or electromagnetic locks.`);
        considerationsEn.push('Reader selection (biometric vs. RFID) depends on pedestrian flow and security clearance tiers.');
        break;

      case 'cabling':
        considerationsAr.push(`نقاط الشبكة والكابلات الهيكلية ترتبط بعدد محطات العمل${input.estimatedNetworkUsers ? ` (~${input.estimatedNetworkUsers} مستخدم/نقطة)` : ''} ومواقع كبائن التوزيع Racks.`);
        considerationsAr.push('تشمل الدراسة مسارات التمديدات (Cable Trays / Conduits) ومطابقة متطلبات الكابلات لـ Cat6A أو الألياف الضوئية.');
        considerationsEn.push(`Network drop density correlates with workplace seating${input.estimatedNetworkUsers ? ` (~${input.estimatedNetworkUsers} users/drops)` : ''} and IDF rack placements.`);
        considerationsEn.push('The scope includes cable tray routing, containment, and Cat6A / fiber optic specifications.');
        break;

      case 'pbx':
        considerationsAr.push('سعة السنترال تحددها خطوط الاتصال الخارجية (SIP / PRI) وعدد الخطوط الداخلية المكتبية والهواتف الذكية.');
        considerationsEn.push('PBX capacity is dimensioned by external trunk lines (SIP/PRI) and internal extension seats.');
        break;

      case 'pa':
        considerationsAr.push('تحديد قدرات المضخمات وتوزيع السماعات (سقفية / حائطية / هورن) يعتمد على المستوى الصوتي البيئي وأبعاد القاعات والممرات.');
        considerationsEn.push('Amplifier sizing and speaker placement (ceiling/horn) depend on ambient noise levels and room acoustic geometry.');
        break;

      case 'bms':
        considerationsAr.push('نقاط المراقبة والتحكم بالـ BMS تعتمد على عدد ماكينات التكييف المركزي AHU والتشيلرات ولوحات الكهرباء ونقاط القياس.');
        considerationsEn.push('BMS I/O points are determined by the schedule of mechanical HVAC equipment, chillers, and electrical sub-panels.');
        break;

      case 'sla':
        considerationsAr.push('عقد الصيانة والدعم الفني يصاغ وفق شروط اتفاقية مستوى الخدمة وجداول الزيارات الدورية ونطاق التغطية المتفق عليها.');
        considerationsEn.push('Maintenance contracts are tailored to agreed SLA response windows, scheduled inspections, and component coverage.');
        break;
    }

    return {
      code: sys,
      titleAr: meta.titleAr,
      titleEn: meta.titleEn,
      scopeSummaryAr: meta.scopeAr,
      scopeSummaryEn: meta.scopeEn,
      considerationsAr,
      considerationsEn,
    };
  });

  // Compile list of missing data needed for a definitive BOQ
  const missingDataRequiredAr: string[] = [];
  const missingDataRequiredEn: string[] = [];

  if (input.engineeringDrawingsAvailable !== 'yes') {
    missingDataRequiredAr.push('المخططات المعمارية التنفيذية (AutoCAD / PDF) متضمنة التقسيم الداخلي وارتفاع الأسقف.');
    missingDataRequiredEn.push('Architectural drawings (AutoCAD/PDF) showing internal partition layout and ceiling heights.');
  }

  if (input.infrastructureStatus !== 'ready') {
    missingDataRequiredAr.push('بيانات مسارات التمديدات الحالية (حوامل الكابلات والمواسير ومجاري الأسلاك) لتحديد حجم الأعمال التأسيسية.');
    missingDataRequiredEn.push('Containment survey (cable trays, conduits, shafts) to assess required physical civil/MEP path works.');
  }

  if (input.selectedSystems.includes('cctv') || input.selectedSystems.includes('access')) {
    missingDataRequiredAr.push('مخطط توزيع المداخل والمخارج وغرف التحكم ومسارات حركة الزوار والعاملين.');
    missingDataRequiredEn.push('Entrance layout, security control room location, and visitor/staff flow segregation plan.');
  }

  if (input.selectedSystems.includes('fire')) {
    missingDataRequiredAr.push('مخطط الدفاع المدني المعتمد للمبنى أو تقرير الاستشاري للسلامة وتصنيف إشغال المبنى.');
    missingDataRequiredEn.push('Civil defense approved safety scheme or consultant life safety occupancy classification report.');
  }

  return {
    referenceNumber: ref,
    generatedAt: now,
    facilityLabelAr: facilityMeta.ar,
    facilityLabelEn: facilityMeta.en,
    areaM2: input.areaM2,
    projectTypeLabelAr,
    projectTypeLabelEn,
    selectedSystemsCount: input.selectedSystems.length,
    systemAssessments,
    missingDataRequiredAr,
    missingDataRequiredEn,
    recommendedNextStepAr: 'حجز جلسة استشارة فنية واستعراض المخططات الهندسية لإعداد جدول كميات (BOQ) دقيق ومطابق للمواصفات.',
    recommendedNextStepEn: 'Schedule a technical consultation session and review engineering drawings to prepare a compliant and precise BOQ.',
    formalDisclaimerAr: 'هذا الملخص يمثل تقديراً أولياً لمتطلبات المشروع بناءً على المعطيات المدخلة، ولا يُعد تصميماً هندسياً نهائياً أو مقايسة تعاقدية معتمدة دون مراجعة المخططات وفحص الموقع.',
    formalDisclaimerEn: 'This summary represents an initial preliminary assessment based on provided inputs and does not constitute a final engineering design or binding contractual BOQ without drawing review and site verification.',
  };
}
