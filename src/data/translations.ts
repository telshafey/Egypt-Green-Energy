import { Language, LightCurrentSystem, ProjectItem } from '../types';
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_CCTV_IMAGE,
  DEFAULT_CABLING_IMAGE,
  DEFAULT_ACCESS_IMAGE,
  DEFAULT_DATACENTER_IMAGE,
  DEFAULT_ENERGY_IMAGE,
  DEFAULT_BIOTECH_IMAGE,
  DEFAULT_JOJOBA_IMAGE,
  DEFAULT_FIRE_ALARM_IMAGE,
  DEFAULT_BMS_IMAGE,
  PROJECT_CCTV_SITE_IMAGE,
  PROJECT_CABLING_SITE_IMAGE,
  PROJECT_FIRE_SITE_IMAGE,
  PROJECT_BMS_SITE_IMAGE,
  PROJECT_SOUND_SITE_IMAGE,
  PROJECT_SIWA_SITE_IMAGE,
} from '../utils/imageHelper';

export const HERO_IMAGE = DEFAULT_HERO_IMAGE;
export const CCTV_IMAGE = DEFAULT_CCTV_IMAGE;
export const CABLING_IMAGE = DEFAULT_CABLING_IMAGE;
export const ACCESS_IMAGE = DEFAULT_ACCESS_IMAGE;
export const DATACENTER_IMAGE = DEFAULT_DATACENTER_IMAGE;
export const ENERGY_IMAGE = DEFAULT_ENERGY_IMAGE;
export const BIOTECH_IMAGE = DEFAULT_BIOTECH_IMAGE;
export const JOJOBA_IMAGE = DEFAULT_JOJOBA_IMAGE;
export const FIRE_ALARM_IMAGE = DEFAULT_FIRE_ALARM_IMAGE;
export const BMS_IMAGE = DEFAULT_BMS_IMAGE;

export const PROJECT_CCTV_SITE = PROJECT_CCTV_SITE_IMAGE;
export const PROJECT_CABLING_SITE = PROJECT_CABLING_SITE_IMAGE;
export const PROJECT_FIRE_SITE = PROJECT_FIRE_SITE_IMAGE;
export const PROJECT_BMS_SITE = PROJECT_BMS_SITE_IMAGE;
export const PROJECT_SOUND_SITE = PROJECT_SOUND_SITE_IMAGE;
export const PROJECT_SIWA_SITE = PROJECT_SIWA_SITE_IMAGE;

export interface TranslationContent {
  meta: {
    title: string;
    description: string;
  };
  brand: {
    name: string;
    tagline: string;
    subtext: string;
  };
  nav: {
    home: string;
    about: string;
    systems: string;
    projects: string;
    configurator: string;
    brands: string;
    contact: string;
    ctaButton: string;
    langToggle: string;
  };
  hero: {
    kicker: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustBullet1: string;
    trustBullet2: string;
    trustBullet3: string;
  };
  stats: {
    projectsCount: string;
    projectsLabel: string;
    projectsDesc: string;
    satisfactionRate: string;
    satisfactionLabel: string;
    satisfactionDesc: string;
    heritageYears: string;
    heritageLabel: string;
    heritageDesc: string;
    systemsCount: string;
    systemsLabel: string;
    systemsDesc: string;
  };
  about: {
    sectionKicker: string;
    heading: string;
    subheading: string;
    p1: string;
    p2: string;
    visionTitle: string;
    visionText: string;
    missionTitle: string;
    missionText: string;
    timelineTitle: string;
    timelineSub: string;
    timeline: any[];
    valuesTitle: string;
    values: { title: string; desc: string }[];
  };
  systems: {
    sectionKicker: string;
    heading: string;
    subheading: string;
    exploreDetails: string;
    backToList: string;
    requestQuote: string;
    categories: {
      all: string;
      security: string;
      safety: string;
      connectivity: string;
      audioBms: string;
      maintenance: string;
    };
    items: LightCurrentSystem[];
  };
  projects: {
    sectionKicker: string;
    heading: string;
    subheading: string;
    privacyNotice: string;
    filterAll: string;
    filterSurveillance: string;
    filterNetworks: string;
    filterSafety: string;
    filterSmartBms: string;
    viewDetails: string;
    closeModal: string;
    locationLabel: string;
    yearLabel: string;
    clientLabel: string;
    items: ProjectItem[];
  };
  configurator: {
    sectionKicker: string;
    heading: string;
    subheading: string;
    facilityTypeLabel: string;
    facilityTypes: { id: string; label: string }[];
    scaleLabel: string;
    scaleUnit: string;
    modulesTitle: string;
    modules: { id: string; label: string; desc: string }[];
    resultTitle: string;
    estCablingPoints: string;
    estCameras: string;
    estDoors: string;
    estTimeline: string;
    applyCta: string;
    disclaimer: string;
  };
  partners: {
    sectionKicker: string;
    heading: string;
    subheading: string;
    brands: string[];
  };
  contact: {
    sectionKicker: string;
    heading: string;
    subheading: string;
    officeTitle: string;
    officeAddress: string;
    phonesTitle: string;
    phonePrimary: string;
    phoneSecondary: string;
    emailTitle: string;
    emailAddress: string;
    hoursTitle: string;
    hoursValue: string;
    whatsAppAction: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      serviceLabel: string;
      servicePlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitBtn: string;
      submitting: string;
      successTitle: string;
      successMsg: string;
      errorRequired: string;
      errorEmail: string;
      errorPhone: string;
    };
    mapTitle: string;
    mapDesc: string;
    openInMaps: string;
  };
  footer: {
    about: string;
    quickLinks: string;
    systemsTitle: string;
    rights: string;
    crNumber: string;
    backToTop: string;
  };
}

const currentYear = new Date().getFullYear();

export const content: Record<Language, TranslationContent> = {
  ar: {
    meta: {
      title: "مصر للطاقة الخضراء ذ.م.م | قطاع أنظمة التيار الخفيف والحلول التكنولوجية",
      description: "حلول هندسية متكاملة لأنظمة التيار الخفيف (ELV): كاميرات المراقبة، إنذار الحريق، التحكم في الدخول، الشبكات والسنترالات، وأنظمة إدارة المباني للمنشآت في مصر."
    },
    brand: {
      name: "مصر للطاقة الخضراء ذ.م.م",
      tagline: "Egypt Green Energy L.L.C",
      subtext: "قطاع أنظمة التيار الخفيف والحلول التكنولوجية"
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      systems: "أنظمة التيار الخفيف",
      projects: "سابقة الأعمال",
      configurator: "مساعد التقدير",
      brands: "العلامات التجارية",
      contact: "اتصل بنا",
      ctaButton: "طلب دراسة فنية",
      langToggle: "English"
    },
    hero: {
      kicker: "قطاع أنظمة التيار الخفيف والحلول التكنولوجية (تأسست عام 2014)",
      title: "أنظمة التيار الخفيف والحلول التكنولوجية للمباني والمنشآت",
      highlight: "أنظمة التيار الخفيف",
      subtitle: "نقدم حلولاً هندسية متكاملة تشمل دراسة المتطلبات والتصميم والتوريد والتركيب والبرمجة والاختبارات والصيانة، وفقاً لطبيعة كل مشروع ومواصفاته الفنية.",
      ctaPrimary: "طلب استشارة ومقايسة فنية",
      ctaSecondary: "استعراض أنظمة التيار الخفيف",
      trustBullet1: "حلول متكاملة للمباني الإدارية والتجارية والصناعية",
      trustBullet2: "مراعاة المواصفات الفنية والكودات الهندسية ذات الصلة",
      trustBullet3: "خدمات الدعم الفني والصيانة وفق اتفاقيات مستوى الخدمة (SLA)"
    },
    stats: {
      projectsCount: "دراسة وتصميم",
      projectsLabel: "التخطيط الهندسي المسبق",
      projectsDesc: "إعداد المخططات وجداول الكميات بناءً على طبيعة المنشأة ومتطلبات العميل",
      satisfactionRate: "توريد معتمد",
      satisfactionLabel: "أجهزة ومكونات أصلية",
      satisfactionDesc: "توريد مباشر من خلال الوكلاء والموزعين المعتمدين في مصر مع شهادات الضمان",
      heritageYears: "تركيب وبرمجة",
      heritageLabel: "تنفيذ ميداني احترافي",
      heritageDesc: "تنفيذ التمديدات وإنهاء النهايات العصبية والبرمجة طبقاً للأصول الهندسية",
      systemsCount: "صيانة ودعم",
      systemsLabel: "اتفاقيات مستوى الخدمة (SLA)",
      systemsDesc: "زيارات فحص دورية ودعم فني مبرمج يضمن استقرار وكفاءة تشغيل الأنظمة"
    },
    about: {
      sectionKicker: "نبذة عن الشركة",
      heading: "حلول هندسية متكاملة لأنظمة التيار الخفيف والتحكم الذكي",
      subheading: "مصر للطاقة الخضراء ذ.م.م شركة مصرية تأسست عام 2014، وتقدم من خلال قطاع أنظمة التيار الخفيف حلولًا هندسية للمباني والمنشآت، تشمل دراسة المتطلبات والتصميم والتوريد والتركيب والبرمجة والاختبارات والصيانة، وفقًا لطبيعة كل مشروع ومواصفاته.",
      p1: "نعمل على تلبية الاحتياجات التقنية للمقاولين، الاستشاريين، والمنشآت الإدارية والصناعية في مصر، من خلال فريق هندسي يراعي متطلبات كل مشروع ومخططاته وجداوله الزمنية بدقة وشفافية.",
      p2: "نركز على تكامل أنظمة التيار الخفيف (ELV) وتوافقها التشغيلي، وتقديم خدمات ما بعد التسليم بما يحافظ على كفاءة واستقرار البنية التحتية للمنشأة وفق الشروط التعاقدية المعتمدة.",
      visionTitle: "رؤيتنا",
      visionText: "تقديم حلول متكاملة في أنظمة التيار الخفيف وتكنولوجيا المباني تلبي متطلبات المنشآت الحديثة بكفاءة واعتمادية.",
      missionTitle: "رسالتنا",
      missionText: "توفير خدمات هندسية تبدأ من دراسة وتصميم الأنظمة وحتى التوريد والتركيب والتشغيل والصيانة التعاقدية، مع الالتزام بالمواصفات الفنية المعتمدة لكل مشروع.",
      timelineTitle: "",
      timelineSub: "",
      timeline: [],
      valuesTitle: "المعايير الهندسية الحاكمة لأعمالنا",
      values: [
        {
          title: "دراسة المتطلبات والمواصفات",
          desc: "نراعي المواصفات الفنية والكودات ذات الصلة وفقاً لطبيعة ومتطلبات كل مشروع."
        },
        {
          title: "التوريد الموثوق",
          desc: "توريد الأجهزة والكابلات والمكونات من الموردين المعتمدين مع شهادات المنشأ والضمان."
        },
        {
          title: "التنفيذ الهندسي المنضبط",
          desc: "تمديد المسارات وإنهاء التوصيلات والبرمجة وفق الأصول الهندسية والمعايير المعتمدة."
        },
        {
          title: "الصيانة والدعم الفني",
          desc: "نوفر خدمات الدعم الفني والصيانة وفقاً لنطاق التغطية وشروط اتفاقية مستوى الخدمة المتفق عليها."
        }
      ]
    },
    systems: {
      sectionKicker: "مجالات التخصص والأنظمة",
      heading: "أنظمة التيار الخفيف والحلول التكنولوجية (ELV Systems)",
      subheading: "حزمة هندسية متكاملة لتجهيز وتشغيل المنشآت الإدارية والتجارية والمصانع وفقاً للمتطلبات الفنية والميزانية المعتمدة.",
      exploreDetails: "تفاصيل النظام ونطاق الأعمال",
      backToList: "العودة لقائمة الأنظمة",
      requestQuote: "طلب استشارة ومقايسة لهذا النظام",
      categories: {
        all: "جميع الأنظمة",
        security: "الأمن والمراقبة",
        safety: "السلامة وإنذار الحريق",
        connectivity: "الشبكات والسنترالات",
        audioBms: "الصوتيات وإدارة المباني",
        maintenance: "عقود الصيانة SLA"
      },
      items: [
        {
          id: "cctv-surveillance",
          category: "security",
          title: "أنظمة المراقبة التلفزيونية (CCTV)",
          subtitle: "كاميرات مراقبة شبكية IP وخوادم تسجيل رقمية NVR للمنشآت",
          description: "دراسة وتصميم وتوريد وتركيب شبكات المراقبة التلفزيونية للمباني والمستودعات والمصانع. تشمل المنظومة الكاميرات الداخلية والخارجية، مسجلات الفيديو الشبكية، وسائط التخزين، وتجهيز غرف المراقبة المركزية.",
          features: [
            "دراسة زوايا الرؤية وتحديد مواقع الكاميرات وفق متطلبات التغطية الأمنية",
            "توريد كاميرات IP ثابتة ومتحركة (PTZ) مناسبة للظروف البيئية للموقع",
            "أجهزة تسجيل شبكية NVR وخوادم تخزين مهيأة لفترات الحفظ المطلوبة",
            "تهيئة المراقبة الموضعية وعبر الشبكة الداخلية مع تدريب مسؤولي التشغيل"
          ],
          specs: [
            { label: "تقنية الكاميرات", value: "كاميرات IP شبكية بدقات متنوعة بحسب زوايا التغطية" },
            { label: "وسائط التسجيل", value: "مسجلات NVR مع وسائط تخزين مهيأة للعمل المستمر" },
            { label: "الحماية البيئية", value: "هياكل حماية خارجية مقاومة للعوامل الجوية والأتربة" }
          ],
          image: CCTV_IMAGE,
          badge: "CCTV / IP Video"
        },
        {
          id: "fire-alarm",
          category: "safety",
          title: "أنظمة إنذار الحريق (Fire Alarm Systems)",
          subtitle: "لوحات تحكم معنونة وكواشف دخان وحرارة ومحطات إنذار صوتي",
          description: "تصميم وتوريد وتركيب شبكات الكشف المبكر والإنذار عن الحريق لحماية المنشآت والأرواح. نراعي الكود المصري للحريق والمعايير الهندسية المنظمة لإجراءات السلامة.",
          features: [
            "لوحات إنذار حريق معنونة (Addressable) تتيح تحديد موقع التنبيه بدقة",
            "كواشف دخان، حرارة، وغازات متعددة الخصائص تلائم بيئات العمل المختلفة",
            "سراين إنذار وفلاشات ضوئية ومحطات نداء يدوي وفق متطلبات الإخلاء",
            "إمكانية التكامل مع أنظمة التكييف والتهوية والمصاعد لإجراءات الطوارئ"
          ],
          specs: [
            { label: "نوع اللوحات", value: "لوحات معنونة Addressable ولوحات تقليدية Conventional" },
            { label: "الكابلات المستخدمة", value: "كابلات مقاومة للحريق Fire Rated معتمدة" },
            { label: "معايير التصميم", value: "يراعى في المخططات اشتراطات الكود المصري وتوصيات الدفاع المدني" }
          ],
          image: FIRE_ALARM_IMAGE,
          badge: "Fire Alarm / NFPA"
        },
        {
          id: "access-control",
          category: "security",
          title: "أنظمة التحكم في الدخول (Access Control)",
          subtitle: "بوابات مرور الأفراد وقارئات الكروت والبصمة والأقفال الكهرومغناطيسية",
          description: "حلول تنظيم حركة الدخول والخروج وتأمين الأبواب والمناطق الحساسة بالمنشآت. تشمل المنظومة أقفال الأبواب، قارئات الدخول، بوابات المرور، وبرمجيات إدارة الصلاحيات.",
          features: [
            "قارئات بصمة، كروت مشفرة RFID، ومحطات تعرف بيومترية",
            "أقفال كهرومغناطيسية ومغاليق كهربائية ملائمة لأنواع الأبواب المختلفة",
            "بوابات مرور أفراد زجاجية ودوّارة (Speed Gates / Turnstiles) للمداخل الرئيسية",
            "برمجيات مركزية لإدارة الصلاحيات وسجلات الدخول وتقارير الحركة"
          ],
          specs: [
            { label: "وسائط التحقق", value: "كروت RFID مشفرة، بصمة الأصبع، وبصمة الوجه" },
            { label: "أنواع البوابات", value: "Speed Gates، Tripod Turnstiles، وبوابات مواقف السيارات" },
            { label: "الإدارة البرمجية", value: "إدارة مركزية للصلاحيات مع إمكانية استخراج التقارير" }
          ],
          image: ACCESS_IMAGE,
          badge: "Access Control"
        },
        {
          id: "structured-cabling",
          category: "connectivity",
          title: "أنظمة الكابلات الهيكلية والشبكات (Structured Cabling)",
          subtitle: "تمديدات شبكات البيانات Cat6 / Cat6A والروابط الضوئية وكبائن الخوادم",
          description: "تأسيس البنية التحتية الفيزيائية لشبكات نقل البيانات والاتصالات داخل المنشآت. نقوم بتوريد وتمديد الكابلات، تنظيم وتجميع كبائن السيرفرات، واختبار نقاط الشبكة.",
          features: [
            "تمديد كابلات الشبكات النحاسية Cat6 و Cat6A المعتمدة داخل المسارات والمواسير",
            "تمديد ولحام كابلات الألياف الضوئية (Fiber Optic) للروابط العمودية والمسافات الطويلة",
            "تركيب وتنظيم كبائن التوزيع والخوادم (Racks) ووحدات الـ Patch Panels",
            "إجراء اختبارات قياس الأداء لكابلات الشبكة وتسليم نتائج الفحص الفني"
          ],
          specs: [
            { label: "تصنيف الكابلات", value: "Cat6 و Cat6A UTP/FTP وكابلات ألياف ضوئية Single/Multi Mode" },
            { label: "كبائن التوزيع", value: "كبائن خوادم جدارية وأرضية بمقاسات تبدأ من 6U وحتى 42U" },
            { label: "المعايير المرجعية", value: "تراعى معايير TIA/EIA المعمول بها في البنية التحتية للشبكات" }
          ],
          image: CABLING_IMAGE,
          badge: "Structured Cabling"
        },
        {
          id: "ip-telephony",
          category: "connectivity",
          title: "السنترالات والاتصالات الموحدة (IP PBX)",
          subtitle: "سنترالات IP للشركات وهواتف مكتبية شبكية وأنظمة الانتركم",
          description: "حلول الاتصال الهاتفي الداخلي والخارجي للشركات والمؤسسات. توفير سنترالات شبكية تدعم الخطوط الأرضية والـ SIP Trunk، مع توزيع الهواتف المكتبية وبرمجة التحويلات.",
          features: [
            "سنترالات رقمية IP PBX تدعم التوسع وفق حجم العمل وعدد الموظفين",
            "هواتف مكتبية شبكية بشاشات عرض ومكبرات صوت رقمية واضحة",
            "برمجة شجرة الرد الآلي (IVR)، البريد الصوتي، وتحويل المكالمات",
            "أنظمة الانتركم الصوتي والمرئي لمداخل المباني والشركات"
          ],
          specs: [
            { label: "بروتوكول التشغيل", value: "بروتوكول SIP القياسي المتوافق مع معظم مزودي الخدمة" },
            { label: "السعات التشغيلية", value: "تحدد سعة السنترال بحسب عدد الخطوط والمستخدمين المطلوبين" },
            { label: "الميزات المتاحة", value: "شجرة رد آلي، تسجيل مكالمات، وتوزيع المكالمات الجماعي" }
          ],
          image: DATACENTER_IMAGE,
          badge: "IP Telephony / PBX"
        },
        {
          id: "public-address",
          category: "audio-bms",
          title: "أنظمة الإذاعة والنداء الداخلي (Public Address)",
          subtitle: "مكبرات صوت سقفية وحائطية، مضخمات صوت، ووحدات نداء متعددة المناطق",
          description: "أنظمة الصوتيات المركزية للمباني الإدارية، المصانع، المستشفيات، والمجمعات التجارية لبث التعليمات والنداءات العامة، مع إمكانية الربط مع نظام إنذار الحريق لحالات الإخلاء.",
          features: [
            "توزيع سماعات سقفية وحائطية وهورن بحسب طبيعة كل فراغ ومستوى الضوضاء",
            "مكبرات صوت ومضخمات بقدرات تتناسب مع الأحمال الصوتية المحسوبة",
            "وحدات تحكم وتقسيم صوتي تتيح النداء لمناطق محددة (Multi-Zone)",
            "إمكانية ربط النظام للتحويل التلقائي لرسائل الطوارئ عند استشعار الحريق"
          ],
          specs: [
            { label: "خطوط التشغيل", value: "أنظمة الفولتية الثابتة 70V / 100V لتوزيع الصوت لمسافات ممتدة" },
            { label: "المناطق الصوتية", value: "تقسيم زونات مرن بحسب المخطط المعماري للمنشأة" },
            { label: "التكامل", value: "مرحلات ربط جافة (Dry Contacts) للتوافق مع لوحات الإنذار" }
          ],
          image: HERO_IMAGE,
          badge: "Public Address"
        },
        {
          id: "bms-automation",
          category: "audio-bms",
          title: "أنظمة إدارة المباني (BMS)",
          subtitle: "مراقبة والتحكم في التكييف والإنارة ولوحات التوزيع واستهلاك الطاقة",
          description: "دمج ومراقبة الأنظمة الكهروميكانيكية في المنشأة عبر واجهة تحكم موحدة، بما يتيح متابعة تشغيل أجهزة التكييف والإنارة ومضخات المياه ولوحات الكهرباء، ورصد كفاءة استهلاك الطاقة.",
          features: [
            "واجهة مراقبة رسومية توضح حالة المعدات والأدوار والإنذارات التشغيلية",
            "مراقبة قراءات درجات الحرارة والرطوبة ومستويات استهلاك الطاقة الكهربائية",
            "برمجة جداول زمنية لتشغيل وإيقاف الأحمال بحسب ساعات العمل بالمنشأة",
            "تنبيهات فورية بحدوث أعطال في المضخات أو وحدات التغذية الكهربائية"
          ],
          specs: [
            { label: "بروتوكولات الاتصال", value: "دعم بروتوكولات التحكم المفتوحة: BACnet و Modbus" },
            { label: "نقاط المراقبة", value: "تحدد نقاط الدخل والخرج (I/O) بحسب جدول المعدات الكهروميكانيكية" },
            { label: "لوحات التحكم", value: "وحدات تحكم رقمية مباشرة (DDC) متصلة بالشبكة" }
          ],
          image: DATACENTER_IMAGE,
          badge: "BMS / Automation"
        },
        {
          id: "sla-maintenance",
          category: "maintenance",
          title: "عقود الصيانة واتفاقيات مستوى الخدمة (SLA)",
          subtitle: "صيانة وقائية دورية ودعم فني مبرمج لأنظمة التيار الخفيف",
          description: "عقود صيانة سنوية مخصصة للمنشآت والشركات لضمان استقرار وجاهزية أنظمة التيار الخفيف. تشمل زيارات صيانة وقائية مجدولة، وفحص التوصيلات، والاستجابة للأعطال وفق شروط الاتفاقية.",
          features: [
            "زيارات فحص دورية منتظمة للكاميرات واللوحات والكبائن والتوصيلات",
            "تنظيف الكواشف وعدسات الكاميرات وتحديث البرمجيات التشغيلية (Firmware)",
            "استجابة فنية للأعطال الطارئة وفق شروط اتفاقية مستوى الخدمة المتفق عليها",
            "إعداد تقارير فنية دورية توضح نتائج الفحص وحالة الأنظمة والتوصيات"
          ],
          specs: [
            { label: "نطاق التغطية", value: "عقود صيانة وقائية دورية وعقود دعم شاملة تشمل قطع الغيار" },
            { label: "آلية الدعم", value: "قنوات تواصل مباشرة لتسجيل البلاغات وجدولة الزيارات الميدانية" },
            { label: "التقارير الفنية", value: "محاضر فحص رسمية تسلم لمسؤولي الصيانة بالمنشأة بعد كل زيارة" }
          ],
          image: CABLING_IMAGE,
          badge: "Maintenance / SLA"
        }
      ]
    },
    projects: {
      sectionKicker: "سابقة الأعمال والخبرة الميدانية",
      heading: "نماذج من مشروعات أنظمة التيار الخفيف",
      subheading: "نستعرض نماذج عامة لطبيعة الأعمال والأنظمة المنفذة في مختلف القطاعات، مع الالتزام التام بخصوصية المنشآت.",
      privacyNotice: "نحترم سرية معلومات عملائنا ومشروعاتهم، لذلك لا ننشر بعض التفاصيل الفنية أو الصور أو أسماء الجهات. وتُتاح المعلومات المسموح بمشاركتها عند الطلب ووفقًا للضوابط المناسبة.",
      filterAll: "جميع المشروعات",
      filterSurveillance: "المراقبة والتحكم",
      filterNetworks: "الشبكات والكابلات",
      filterSafety: "إنذار الحريق",
      filterSmartBms: "إدارة المباني والصوتيات",
      viewDetails: "استعراض تفاصيل نطاق العمل",
      closeModal: "إغلاق التفاصيل",
      locationLabel: "المنطقة / المحافظة",
      yearLabel: "سنة التسليم",
      clientLabel: "قطاع المنشأة",
      items: [
        {
          id: "cairo-business-park-cctv",
          title: "منظومة المراقبة والتحكم في الدخول لمقر إداري",
          category: "surveillance",
          categoryLabel: "المراقبة والتحكم",
          location: "القاهرة الجديدة",
          year: "2024",
          deliveryYear: "2024",
          clientType: "قطاع المباني الإدارية والتجارية",
          sector: "مجمع مقرات إدارية",
          scopeSummary: "توريد وتركيب كاميرات مراقبة شبكية وبوابات مرور أفراد وغرفة تحكم مركزية",
          scopeOfWork: [
            "دراسة المخططات الهندسية وتحديد زوايا الرؤية للمداخل والممرات ومواقف السيارات",
            "توريد وتركيب كاميرات مراقبة IP شبكية داخلية وخارجية",
            "توريد وتركيب بوابات مرور أفراد ذكية Speed Gates وقارئات كروت مشفرة",
            "تجهيز غرفة المراقبة المركزية بوحدات تسجيل وخوادم تخزين وشاشات عرض",
            "إجراء الاختبارات التشغيلية وتسليم المشروع للمهندس المشرف"
          ],
          description: "تنفيذ شبكة مراقبة تلفزيونية متكاملة مع بوابات مرور وتنظيم حركة الأفراد لمبنى إداري، وربطها بمركز تحكم محلي لتوفير إدارة مركزية آمنة.",
          impactMetrics: [
            { label: "طبيعة المنشأة", value: "مقر إداري متعدد الطوابق" },
            { label: "الأنظمة المنفذة", value: "CCTV + Access Control" },
            { label: "حالة المشروع", value: "تم التسليم بنجاح" }
          ],
          technicalSpecs: [
            { label: "الكاميرات", value: "كاميرات IP شبكية بدقات مختلفة" },
            { label: "التخزين", value: "خوادم تسجيل NVR مهيأة للتسجيل المستمر" },
            { label: "التحكم في الدخول", value: "بوابات Speed Gates وقارئات مشفرة" }
          ],
          image: PROJECT_CCTV_SITE
        },
        {
          id: "industrial-cabling-datacenter",
          title: "شبكات البيانات والكابلات الهيكلية لمنشأة صناعية",
          category: "networks",
          categoryLabel: "الشبكات والكابلات",
          location: "العاشر من رمضان",
          year: "2023",
          deliveryYear: "2023",
          clientType: "قطاع الصناعات والمصانع",
          sector: "منشأة صناعية ومستودعات",
          scopeSummary: "تنفيذ شبكة كابلات هيكلية Cat6A وروابط ألياف ضوئية بين العنابر",
          scopeOfWork: [
            "تمديد مسارات الكابلات وحوامل الأسلاك المعزولة عن خطوط القوى الكهربائية",
            "تمديد وإنهاء نقاط شبكة البيانات Cat6A لخطوط الإنتاج والمكاتب الإدارية",
            "تمديد كابلات ألياف ضوئية مدرعة للربط بين هناجر المصنع وغرفة الخوادم الرئيسية",
            "تركيب وتنظيم كبائن التوزيع Racks وتزويدها بوحدات توزيع الطاقة PDU",
            "إجراء اختبارات فحص واعتماد نقاط الشبكة باستخدام أجهزة القياس المتخصصة"
          ],
          description: "تنفيذ البنية التحتية لشبكة البيانات بكابلات Cat6A وروابط ألياف ضوئية لربط هناجر التصنيع والمبنى الإداري بغرفة الخوادم المركزية.",
          impactMetrics: [
            { label: "طبيعة المنشأة", value: "مجمع صناعي متعدد العنابر" },
            { label: "الأنظمة المنفذة", value: "Structured Cabling + Fiber" },
            { label: "حالة المشروع", value: "تم التسليم بنجاح" }
          ],
          technicalSpecs: [
            { label: "كابلات البيانات", value: "كابلات Cat6A محمية ومطابقة للمواصفات" },
            { label: "الروابط الرئيسية", value: "كابلات ألياف ضوئية مدرعة" },
            { label: "كبائن التوزيع", value: "كبائن خوادم مجهزة بوحدات تنظيم وتبريد" }
          ],
          image: PROJECT_CABLING_SITE
        },
        {
          id: "hospital-fire-addressable",
          title: "منظومة إنذار الحريق المعنونة لمجمع رعاية صحية",
          category: "safety",
          categoryLabel: "إنذار الحريق",
          location: "مدينة نصر، القاهرة",
          year: "2023",
          deliveryYear: "2023",
          clientType: "قطاع الرعاية الصحية والمستشفيات",
          sector: "مجمع طبي",
          scopeSummary: "تركيب لوحات إنذار حريق معنونة وكواشف دخان وحرارة ومحطات إنذار صوتي",
          scopeOfWork: [
            "مراجعة المخططات الهندسية بالتنسيق مع الاستشاري لضمان مطابقة الكود",
            "توريد وتركيب لوحات إنذار حريق معنونة ذكية موزعة على المبنى",
            "توزيع كواشف الدخان والحرارة في الأقسام والغرف والممرات",
            "تنفيذ التوصيلات بكابلات مقاومة للحريق مخصصة لأنظمة الإنذار",
            "ربط مرحلات التحكم مع أنظمة التكييف والتهوية للإيقاف التلقائي في الطوارئ",
            "إجراء الاختبارات التشغيلية الشاملة ومحاكاة سيناريوهات الإنذار"
          ],
          description: "تنفيذ شبكة إنذار حريق معنونة لمجمع طبي تراعي حساسية البيئة العلاجية، مع ربط الإشارات التحذيرية بنظام الإخلاء الصوتي ووحدات التكييف.",
          impactMetrics: [
            { label: "طبيعة المنشأة", value: "مجمع طبي ومستشفى" },
            { label: "الأنظمة المنفذة", value: "Addressable Fire Alarm" },
            { label: "حالة المشروع", value: "تم التسليم بنجاح" }
          ],
          technicalSpecs: [
            { label: "النظام", value: "لوحات إنذار حريق معنونة ذكية" },
            { label: "الكابلات", value: "كابلات مقاومة للحريق Fire Rated" },
            { label: "الربط التبادلي", value: "إيقاف تلقائي للتكييف وتحرير أبواب الطوارئ" }
          ],
          image: PROJECT_FIRE_SITE
        },
        {
          id: "corporate-tower-bms",
          title: "نظام إدارة المباني والسنترال الشبكي لبرج تجاري",
          category: "smart-bms",
          categoryLabel: "إدارة المباني والصوتيات",
          location: "القاهرة",
          year: "2024",
          deliveryYear: "2024",
          clientType: "قطاع الأبراج والمباني الذكية",
          sector: "برج إداري وتجاري",
          scopeSummary: "ربط أجهزة التكييف والإنارة ولوحات التوزيع بنظام BMS وسنترال IP PBX",
          scopeOfWork: [
            "برمجة وحدات التحكم الرقمي (DDC) عبر بروتوكولات الشبكة المفتوحة",
            "ربط قراءات استهلاك الكهرباء ولوحات التوزيع وماكينات التكييف",
            "توريد وبرمجة سنترال شبكي IP PBX وتوزيع الهواتف المكتبية للشركات",
            "توفير عقد صيانة دورية (SLA) لمتابعة استقرار المنظومة والبرمجيات"
          ],
          description: "دمج مراقبة استهلاك الطاقة وأجهزة التكييف المركزي في شاشة تحكم واحدة، إلى جانب توفير شبكة اتصالات هاتفية داخلية للشركات العاملة بالبرج.",
          impactMetrics: [
            { label: "طبيعة المنشأة", value: "برج إداري وتجاري" },
            { label: "الأنظمة المنفذة", value: "BMS + IP PBX + SLA" },
            { label: "حالة المشروع", value: "تم التسليم وقيد الصيانة" }
          ],
          technicalSpecs: [
            { label: "بروتوكول الـ BMS", value: "بروتوكول BACnet و Modbus القياسي" },
            { label: "الاتصالات", value: "سنترال IP PBX مع دعم التحويلات الداخلية" },
            { label: "الصيانة", value: "عقد صيانة دورية مجدول" }
          ],
          image: PROJECT_BMS_SITE
        },
        {
          id: "remote-facility-low-current",
          title: "تجهيز المنظومة الأمنية والاتصالات لمنشأة إقليمية",
          category: "surveillance",
          categoryLabel: "المراقبة والتحكم",
          location: "مطروح",
          year: "2022",
          deliveryYear: "2022",
          clientType: "منشآت المواقع الإقليمية والنائية",
          sector: "منشأة بموقع نائي",
          scopeSummary: "تجهيز منظومة المراقبة التلفزيونية والربط اللاسلكي وتأمين المحيط",
          scopeOfWork: [
            "تثبيت كاميرات مراقبة خارجية مجهزة لتحمل الظروف المناخية الصحراوية",
            "إنشاء روابط لاسلكية لنقل إشارات الفيديو إلى نقطة التحكم المركزية",
            "تركيب بوابات تحكم بالدخول للمسارات الرئيسية بالمنشأة",
            "توفير وحدات تغذية كهربائية احتياطية غير منقطعة (UPS) للأجهزة الحساسة"
          ],
          description: "تجهيز منشأة إقليمية بنظام مراقبة تلفزيونية وروابط نقل بيانات لاسلكية ملائمة للمواقع النائية، مع تأمين استمرارية التغذية الكهربائية للأجهزة.",
          impactMetrics: [
            { label: "طبيعة المنشأة", value: "منشأة إقليمية في بيئة صحراوية" },
            { label: "الأنظمة المنفذة", value: "CCTV + Wireless Links + UPS" },
            { label: "حالة المشروع", value: "تم التسليم بنجاح" }
          ],
          technicalSpecs: [
            { label: "الكاميرات", value: "كاميرات خارجية مجهزة للحماية من الأتربة" },
            { label: "نقل البيانات", value: "روابط بيانات لاسلكية للمسافات المفتوحة" },
            { label: "التغذية الاحتياطية", value: "وحدات UPS وبطاريات احتياطية" }
          ],
          image: PROJECT_SIWA_SITE
        },
        {
          id: "giza-logistics-pa-sound",
          title: "شبكة الإذاعة الداخلية والصوتيات لمركز لوجستي",
          category: "smart-bms",
          categoryLabel: "إدارة المباني والصوتيات",
          location: "الجيزة",
          year: "2023",
          deliveryYear: "2023",
          clientType: "قطاع الخدمات اللوجستية والنقل",
          sector: "مركز لوجستي وتوزيع",
          scopeSummary: "توزيع مكبرات صوت سقفية وهورن ومحطات نداء متعددة المناطق",
          scopeOfWork: [
            "دراسة المسافات وشدة الصوت لتوزيع مكبرات الصوت داخل عنابر التخزين المرتفعة",
            "تركيب مكبرات صوت هورن وسماعات سقفية موزعة على مناطق تشغيل مستقلة",
            "تركيب مضخمات صوت مركزية وميكروفونات نداء مكتبي",
            "ربط النظام مع لوحة إنذار الحريق لتحويل البث الصوتي تلقائياً لإشارات الإخلاء"
          ],
          description: "تنفيذ نظام نداء صوتي متعدد الزونات يغطي هناجر التخزين وأرصفة الشحن والمبنى الإداري لمركز لوجستي، مع ربطه بإنذار الحريق لإجراءات الطوارئ.",
          impactMetrics: [
            { label: "طبيعة المنشأة", value: "مستودعات ومركز توزيع لوجستي" },
            { label: "الأنظمة المنفذة", value: "Public Address & Paging" },
            { label: "حالة المشروع", value: "تم التسليم بنجاح" }
          ],
          technicalSpecs: [
            { label: "السماعات", value: "سماعات هورن وسماعات سقفية 100V" },
            { label: "التقسيم الصوتي", value: "زونات صوتية متعددة لتوجيه النداء" },
            { label: "التكامل", value: "ربط مع إنذار الحريق لبث رسائل الإخلاء" }
          ],
          image: PROJECT_SOUND_SITE
        }
      ]
    },
    configurator: {
      sectionKicker: "التقدير الهندسي المبدئي",
      heading: "مساعد تقدير متطلبات المشروع",
      subheading: "أداة لمساعدة مسؤولي المنشآت والمشروعات في توصيف المتطلبات الأولية وتحديد الأنظمة المطلوبة قبل إعداد المقايسة النهائية.",
      facilityTypeLabel: "نوع المنشأة أو المبنى",
      facilityTypes: [
        { id: "office", label: "مبنى إداري / مقر شركات" },
        { id: "industrial", label: "منشأة صناعية / مصنع" },
        { id: "healthcare", label: "مستشفى / مجمع طبي" },
        { id: "commercial", label: "مركز تجاري / مول" },
        { id: "educational", label: "مؤسسة تعليمية / مدرسة" },
        { id: "residential", label: "مجمع سكني / كمبوند" },
        { id: "logistics", label: "مستودع لوجستي / مركز توزيع" }
      ],
      scaleLabel: "المساحة التقريبية للمنشأة",
      scaleUnit: "متر مربع",
      modulesTitle: "الأنظمة المطلوب تقدير نطاق أعمالها",
      modules: [
        { id: "cctv", label: "المراقبة التلفزيونية (CCTV)", desc: "كاميرات مراقبة شبكية وأجهزة تسجيل رقمية NVR" },
        { id: "fire", label: "إنذار الحريق (Fire Alarm)", desc: "لوحات معنونة وكواشف دخان وحرارة ومحطات إنذار صوتي" },
        { id: "access", label: "التحكم في الدخول (Access Control)", desc: "بوابات مرور الأفراد وقارئات الكروت والبصمة والأقفال" },
        { id: "cabling", label: "الكابلات والشبكات (Structured Cabling)", desc: "كابلات بيانات Cat6A والروابط الضوئية وكبائن الخوادم" },
        { id: "pbx", label: "السنترالات والاتصالات (IP PBX)", desc: "سنترال شبكي وهواتف مكتبية وبرمجة التحويلات" },
        { id: "pa", label: "الإذاعة والنداء الداخلي (Public Address)", desc: "توزيع صوتي متعدد المناطق ومكبرات صوت للإخلاء" },
        { id: "bms", label: "إدارة المباني الذكية (BMS)", desc: "مراقبة التكييف والإنارة ولوحات التوزيع واستهلاك الطاقة" },
        { id: "sla", label: "عقود الصيانة المدارة (SLA)", desc: "زيارات فحص دورية ودعم فني وفق شروط الاتفاقية" }
      ],
      resultTitle: "ملخص المتطلبات الأولية للمشروع",
      estCablingPoints: "نقاط الشبكة المقدرة",
      estCameras: "كاميرات المراقبة",
      estDoors: "الأبواب المؤمنة",
      estTimeline: "المدة الزمنية التقديرية",
      applyCta: "إرسال الملخص لطلب دراسة فنية",
      disclaimer: "يتطلب تحديد الكميات بدقة مراجعة المخططات الهندسية والمتطلبات الفنية للمنشأة."
    },
    partners: {
      sectionKicker: "العلامات والتقنيات",
      heading: "العلامات التجارية التي نتعامل معها",
      subheading: "نعمل على توريد وتركيب ودمج حلول من علامات تجارية متعددة، وفقًا للمتطلبات الفنية والميزانية وتوافر المنتجات من الموردين.",
      brands: [
        "Hikvision",
        "Dahua Technology",
        "Cisco Systems",
        "Schneider Electric",
        "Honeywell",
        "Notifier by Honeywell",
        "Legrand",
        "Panduit",
        "ZKTeco",
        "Suprema",
        "Grandstream",
        "Yealink"
      ]
    },
    contact: {
      sectionKicker: "التواصل والاستشارات",
      heading: "طلب دراسة فنية ومقايسة للمشروع",
      subheading: "فريقنا الهندسي متاح لمناقشة المتطلبات الفنية ومراجعة المخططات وتقديم عروض الأسعار طبقاً للمواصفات المعتمدة.",
      officeTitle: "المقر الرئيسي للمتابعة والتعاقدات",
      officeAddress: "مدينة نصر، القاهرة، جمهورية مصر العربية",
      phonesTitle: "أرقام التواصل والاتصال المباشر",
      phonePrimary: "+20 100 719 6485",
      phoneSecondary: "+20 120 072 8006",
      emailTitle: "البريد الإلكتروني المعتمد للمراسلات",
      emailAddress: "info@egypt-ge.com",
      hoursTitle: "مواعيد العمل الرسمية",
      hoursValue: "السبت - الخميس: 9:00 ص - 6:00 م (خدمات الدعم الفني وفق اتفاقيات مستوى الخدمة SLA)",
      whatsAppAction: "تواصل مباشر عبر واتساب",
      form: {
        nameLabel: "الاسم بالكامل / ممثل الجهة",
        namePlaceholder: "الاسم ومسمى الوظيفة (مثال: م. أحمد مصطفى - مدير المشروعات)",
        emailLabel: "البريد الإلكتروني المهني",
        emailPlaceholder: "name@company.com",
        phoneLabel: "رقم الهاتف / الواتساب",
        phonePlaceholder: "010xxxxxxxx",
        serviceLabel: "الأنظمة أو الخدمة المطلوبة",
        servicePlaceholder: "اختر النظام أو اكتب وصفاً للمشروع",
        messageLabel: "تفاصيل المشروع ونطاق الأعمال المطلوب",
        messagePlaceholder: "يرجى ذكر طبيعة المنشأة، المساحة، الأنظمة المطلوبة، وتوفر المخططات الهندسية...",
        submitBtn: "إرسال طلب الدراسة الفنية",
        submitting: "جاري تأكيد وإرسال الطلب...",
        successTitle: "تم استلام طلبكم بنجاح",
        successMsg: "شكراً لتواصلكم مع مصر للطاقة الخضراء ذ.م.م. سيقوم فريقنا الهندسي بمراجعة التفاصيل والتواصل معكم لترتيب الخطوات القادمة.",
        errorRequired: "هذا الحقل مطلوب لإتمام الطلب",
        errorEmail: "يرجى إدخال بريد إلكتروني صحيح",
        errorPhone: "يرجى إدخال رقم هاتف صالح للتواصل"
      },
      mapTitle: "المقر بمدينة نصر - القاهرة",
      mapDesc: "موقع مركزي بمدينة نصر لخدمة المشروعات في القاهرة الكبرى والمدن الصناعية ومحافظات الجمهورية.",
      openInMaps: "فتح الموقع في خرائط جوجل"
    },
    footer: {
      about: "مصر للطاقة الخضراء ذ.م.م (تأسست عام 2014) — قطاع أنظمة التيار الخفيف والحلول التكنولوجية: حلول هندسية متكاملة تشمل التصميم والتوريد والتركيب والبرمجة والصيانة للمنشآت الإدارية والتجارية والصناعية في مصر.",
      quickLinks: "أقسام الموقع",
      systemsTitle: "أنظمة التيار الخفيف",
      rights: `© ${currentYear} مصر للطاقة الخضراء ذ.م.م — جميع الحقوق محفوظة.`,
      crNumber: "سجل تجاري وبطاقة ضريبية معتمدة | مدينة نصر، القاهرة",
      backToTop: "العودة للأعلى"
    }
  },
  en: {
    meta: {
      title: "Egypt Green Energy L.L.C | Low Current Systems & Technology Solutions Division",
      description: "Turnkey engineering solutions for Low Current (ELV) systems: CCTV surveillance, fire alarm, access control, structured cabling, IP telephony, and BMS for facilities across Egypt."
    },
    brand: {
      name: "Egypt Green Energy L.L.C",
      tagline: "مصر للطاقة الخضراء ذ.م.م",
      subtext: "Low Current Systems & Technology Solutions Division"
    },
    nav: {
      home: "Home",
      about: "About Us",
      systems: "Low Current Systems",
      projects: "Projects",
      configurator: "Requirements Estimator",
      brands: "Brands",
      contact: "Contact",
      ctaButton: "Request Technical Proposal",
      langToggle: "العربية"
    },
    hero: {
      kicker: "Low Current Systems & Technology Solutions Division (Founded in 2014)",
      title: "Low Current Systems & Technology Solutions for Facilities",
      highlight: "Low Current Systems",
      subtitle: "We deliver turnkey engineering solutions encompassing requirements assessment, design, procurement, installation, programming, testing, and maintenance tailored to the specific nature and technical specifications of each project.",
      ctaPrimary: "Request Technical BOQ & Consultation",
      ctaSecondary: "Explore Low Current Systems",
      trustBullet1: "Turnkey solutions for commercial, administrative, and industrial facilities",
      trustBullet2: "Observance of relevant engineering codes and technical standards",
      trustBullet3: "Technical support and maintenance services according to agreed SLA terms"
    },
    stats: {
      projectsCount: "Engineering Design",
      projectsLabel: "Preliminary Project Planning",
      projectsDesc: "Preparing detailed layout drawings and BOQs tailored to facility nature and requirements",
      satisfactionRate: "Genuine Sourcing",
      satisfactionLabel: "Authorized Channels",
      satisfactionDesc: "Equipment and cabling procured through authorized agents in Egypt with official warranties",
      heritageYears: "Professional Delivery",
      heritageLabel: "Field Commissioning",
      heritageDesc: "Execution, cable termination, and programming performed according to engineering best practices",
      systemsCount: "Contractual SLA",
      systemsLabel: "Scheduled Technical Support",
      systemsDesc: "Periodic preventative maintenance visits ensuring infrastructure stability and uptime"
    },
    about: {
      sectionKicker: "About the Company",
      heading: "Integrated Engineering Solutions for Low Current Systems",
      subheading: "Egypt Green Energy L.L.C is an Egyptian company founded in 2014. Through its Low Current Systems Division, it delivers engineering solutions for buildings and facilities, encompassing requirements assessment, design, procurement, installation, programming, testing, and maintenance tailored to the specific nature and specifications of each project.",
      p1: "We serve the technical needs of main contractors, engineering consultants, and commercial facilities in Egypt through a dedicated engineering team observing project drawings, technical requirements, and agreed schedules.",
      p2: "We focus on the seamless interoperability of Low Current (ELV) disciplines and provide reliable post-handover support to maintain operational facility efficiency under approved contractual terms.",
      visionTitle: "Our Vision",
      visionText: "To deliver integrated low-current and building technology solutions that meet the requirements of modern facilities with efficiency and reliability.",
      missionTitle: "Our Mission",
      missionText: "To provide engineering services ranging from system assessment and design to procurement, installation, commissioning, and contractual maintenance, adhering to approved technical specifications for each project.",
      timelineTitle: "",
      timelineSub: "",
      timeline: [],
      valuesTitle: "Core Engineering Standards",
      values: [
        {
          title: "Technical Compliance",
          desc: "We observe relevant technical specifications and applicable codes based on individual project requirements."
        },
        {
          title: "Certified Procurement",
          desc: "Hardware, cables, and components are procured from authorized suppliers backed by certificates of origin and warranty."
        },
        {
          title: "Disciplined Execution",
          desc: "Conduit routing, cable termination, and software programming are performed in accordance with engineering standards."
        },
        {
          title: "SLA Technical Support",
          desc: "We provide technical support and maintenance services according to the coverage scope and agreed SLA terms."
        }
      ]
    },
    systems: {
      sectionKicker: "Specialized Disciplines",
      heading: "Low Current & Building Technology Systems (ELV)",
      subheading: "An integrated suite of engineering solutions to equip and operate administrative, commercial, and industrial facilities according to approved technical standards and budgets.",
      exploreDetails: "System Scope & Technical Details",
      backToList: "Back to Systems",
      requestQuote: "Request Proposal for This System",
      categories: {
        all: "All Disciplines",
        security: "Security & Surveillance",
        safety: "Life Safety & Fire Alarm",
        connectivity: "Networks & Telephony",
        audioBms: "Acoustics & BMS",
        maintenance: "SLA Contracts"
      },
      items: [
        {
          id: "cctv-surveillance",
          category: "security",
          title: "Video Surveillance Systems (CCTV)",
          subtitle: "Network IP cameras, digital NVR recorders, and central control room equipment",
          description: "Engineering design, procurement, installation, and commissioning of video surveillance networks for commercial towers, warehouses, and industrial plants. The scope covers indoor and outdoor cameras, NVRs, storage arrays, and control room monitors.",
          features: [
            "Site field-of-view assessment and camera placement based on surveillance requirements",
            "Fixed and PTZ IP cameras engineered for environmental site conditions",
            "Network video recorders (NVR) and storage sized for required retention periods",
            "Local and internal network viewing configuration with operator handover"
          ],
          specs: [
            { label: "Technology", value: "Network IP cameras with versatile focal lengths" },
            { label: "Recording", value: "Enterprise NVR appliances with continuous surveillance storage" },
            { label: "Enclosure Protection", value: "Weatherproof and dust-resistant outdoor housings" }
          ],
          image: CCTV_IMAGE,
          badge: "CCTV / IP Video"
        },
        {
          id: "fire-alarm",
          category: "safety",
          title: "Fire Alarm Systems",
          subtitle: "Addressable control panels, smoke and heat detectors, and voice alarm sounders",
          description: "Engineering design, supply, and installation of early detection fire alarm networks to safeguard lives and facilities, observing the Egyptian Fire Code and relevant life safety engineering standards.",
          features: [
            "Addressable fire alarm control panels identifying the precise location of alerts",
            "Multi-criteria smoke, thermal, and duct sensors suited to different facility zones",
            "Audible horns, optical strobes, and manual call points for evacuation compliance",
            "Integration relays with HVAC shutdown, elevator grounding, and emergency exits"
          ],
          specs: [
            { label: "Panel Architecture", value: "Intelligent Addressable and Conventional configurations" },
            { label: "Cabling", value: "Certified fire-rated cables meeting life safety standards" },
            { label: "Code Alignment", value: "Designed in accordance with Egyptian Fire Code and civil defense guidelines" }
          ],
          image: FIRE_ALARM_IMAGE,
          badge: "Fire Alarm"
        },
        {
          id: "access-control",
          category: "security",
          title: "Access Control Systems",
          subtitle: "Speed gates, RFID cards, biometric terminals, and electromagnetic locks",
          description: "Solutions for managing facility ingress, egress, and securing sensitive zones (server rooms, executive suites, and archive vaults). The scope includes electronic locks, credential readers, turnstiles, and permission management software.",
          features: [
            "Biometric facial recognition, fingerprint readers, and encrypted RFID credentials",
            "Electromagnetic locks, shear locks, and electric strikes suited for varied doors",
            "Optical speed gates and tripod turnstiles for corporate receptions and entrances",
            "Central software for credential provisioning, access schedules, and event audit trails"
          ],
          specs: [
            { label: "Credentials", value: "Encrypted RFID cards, fingerprint, and facial recognition" },
            { label: "Turnstiles", value: "Speed Gates, Tripod Turnstiles, and vehicle barrier arms" },
            { label: "Management", value: "Central access permissions and customizable event logging" }
          ],
          image: ACCESS_IMAGE,
          badge: "Access Control"
        },
        {
          id: "structured-cabling",
          category: "connectivity",
          title: "Structured Cabling & Networks",
          subtitle: "Cat6/Cat6A copper data horizontal runs, vertical fiber backbones, and server racks",
          description: "Deploying the physical Layer-1 network foundation for enterprise data transport and telecommunications. We engineer cable containment pathways, terminate data outlets, assemble distribution racks, and verify channel performance.",
          features: [
            "Pulling and terminating certified Cat6 and Cat6A UTP/FTP horizontal data cabling",
            "Laying and splicing single-mode and multi-mode fiber optic vertical backbones",
            "Assembling server racks, cable organizers, and high-density patch panels",
            "Conducting channel certification tests and delivering formal technical test reports"
          ],
          specs: [
            { label: "Cable Types", value: "Cat6 & Cat6A UTP/FTP and armored indoor/outdoor fiber optic" },
            { label: "Rack Enclosures", value: "Wall-mount and freestanding server racks ranging from 6U to 42U" },
            { label: "Standards", value: "Observing TIA/EIA structured cabling guidelines and containment best practices" }
          ],
          image: CABLING_IMAGE,
          badge: "Structured Cabling"
        },
        {
          id: "ip-telephony",
          category: "connectivity",
          title: "IP PBX Telephony",
          subtitle: "Enterprise IP PBX appliances, IP desktop phones, and intercom gateways",
          description: "Internal and external voice communication solutions for corporations, hotels, and campuses. We configure IP PBX servers supporting analog trunks and SIP lines, deploy IP handsets, and program dial plans.",
          features: [
            "Scalable IP PBX appliances tailored to organization seat count and trunk traffic",
            "High-definition voice desktop IP phones with color displays and programmable keys",
            "Interactive Voice Response (IVR) auto-attendant, voicemail, and ring groups",
            "SIP video intercom stations for corporate lobbies and executive entrances"
          ],
          specs: [
            { label: "Protocol", value: "Standard RFC3261 SIP protocol compatible with telecom carriers" },
            { label: "Capacity", value: "Dimensioned according to required concurrent calls and extensions" },
            { label: "Features", value: "Auto-attendant, call recording, multi-party conferencing, and voicemail" }
          ],
          image: DATACENTER_IMAGE,
          badge: "IP Telephony"
        },
        {
          id: "public-address",
          category: "audio-bms",
          title: "Public Address & Paging Systems",
          subtitle: "Ceiling and wall-mount speakers, amplifiers, and multi-zone acoustic paging",
          description: "Centralized acoustic paging and background sound solutions for corporate headquarters, industrial plants, hospitals, and shopping centers, with emergency override integration linked to fire alarm panels.",
          features: [
            "Acoustic distribution utilizing ceiling, wall-mount, or weatherproof horn speakers",
            "Central 100V power amplifiers dimensioned to calculated acoustic speaker loads",
            "Desktop paging microphones with customizable zone matrix selection",
            "Automated priority relay muting for emergency fire evacuation broadcasts"
          ],
          specs: [
            { label: "Distribution Line", value: "Constant voltage 70V / 100V lines for extended audio runs" },
            { label: "Zoning", value: "Multi-zone audio routing according to facility architectural floor plans" },
            { label: "Safety Hook", value: "Dry contact relays for automated emergency evacuation mute override" }
          ],
          image: HERO_IMAGE,
          badge: "Public Address"
        },
        {
          id: "bms-automation",
          category: "audio-bms",
          title: "Building Management Systems (BMS)",
          subtitle: "Supervisory telemetry and control for HVAC, lighting, and power distribution",
          description: "Converging electromechanical facility assets onto a single software management console, enabling facility engineers to monitor HVAC chillers, lighting schedules, water pumps, and track power efficiency.",
          features: [
            "Graphical SCADA user interface displaying plant schematics, alarms, and temperatures",
            "Real-time monitoring of energy meters, diesel levels, and UPS battery backup banks",
            "Automated operational schedules aligning electromechanical equipment with working hours",
            "Early diagnostic warnings upon abnormal pressure, pump faults, or electrical variance"
          ],
          specs: [
            { label: "Protocols", value: "Open automation standards: Native BACnet/IP and Modbus" },
            { label: "I/O Points", value: "Dimensioned to the schedule of mechanical equipment and electrical panels" },
            { label: "Controllers", value: "Networked Direct Digital Controllers (DDC) with manual overrides" }
          ],
          image: DATACENTER_IMAGE,
          badge: "BMS / Automation"
        },
        {
          id: "sla-maintenance",
          category: "maintenance",
          title: "SLA & Maintenance Contracts",
          subtitle: "Scheduled preventative inspections and dispatched technical support",
          description: "Annual maintenance contracts customized for corporate facilities to ensure low-current infrastructure stability. The scope covers scheduled maintenance visits, cable inspections, and responsive support under agreed SLA terms.",
          features: [
            "Regular preventative inspection visits for cameras, panels, racks, and terminations",
            "Sensor cleaning, camera lens realignment, and firmware security updates",
            "Field technical response for critical faults in accordance with agreed SLA response windows",
            "Detailed technical inspection logs submitted to facility management after every visit"
          ],
          specs: [
            { label: "Coverage Scope", value: "Preventative inspection plans and comprehensive support packages" },
            { label: "Support Workflow", value: "Direct dispatch channels for incident logging and scheduled visits" },
            { label: "Documentation", value: "Formal site service reports provided upon completion of each inspection" }
          ],
          image: CABLING_IMAGE,
          badge: "Maintenance / SLA"
        }
      ]
    },
    projects: {
      sectionKicker: "Portfolio & Field Track Record",
      heading: "Selected Low Current Engineering Projects",
      subheading: "An overview of representative projects and low current systems across various sectors, observing strict client confidentiality.",
      privacyNotice: "We respect the confidentiality of our clients' information and facilities; therefore, certain technical details, site photographs, and entity names are not publicly published. Permissible information is available upon formal request and in accordance with relevant governance.",
      filterAll: "All Projects",
      filterSurveillance: "CCTV & Access",
      filterNetworks: "Data Networks",
      filterSafety: "Fire Alarm",
      filterSmartBms: "BMS & Acoustics",
      viewDetails: "View Scope of Work",
      closeModal: "Close Details",
      locationLabel: "Region / Location",
      yearLabel: "Completion Year",
      clientLabel: "Sector Category",
      items: [
        {
          id: "cairo-business-park-cctv",
          title: "Surveillance & Access Control System for Administrative Headquarters",
          category: "surveillance",
          categoryLabel: "CCTV & Access",
          location: "New Cairo",
          year: "2024",
          deliveryYear: "2024",
          clientType: "Commercial & Administrative Sector",
          sector: "Corporate Headquarters Complex",
          scopeSummary: "Procurement, installation, and commissioning of IP surveillance cameras, speed gates, and central control room",
          scopeOfWork: [
            "Reviewing architectural layouts and defining coverage angles for entrances, corridors, and parking",
            "Procurement and installation of indoor and outdoor network IP cameras",
            "Installation of optical speed gates and encrypted RFID card readers",
            "Equipping the central security control room with NVR storage and monitoring video displays",
            "Conducting system commissioning tests and handing over operational documentation"
          ],
          description: "Turnkey video surveillance and pedestrian access management deployment for an administrative building, linked to a central control console for unified local security oversight.",
          impactMetrics: [
            { label: "Facility Type", value: "Multi-Story Administrative Building" },
            { label: "Disciplines", value: "CCTV + Access Control" },
            { label: "Status", value: "Successfully Handed Over" }
          ],
          technicalSpecs: [
            { label: "Cameras", value: "Network IP cameras with varied focal lengths" },
            { label: "Storage", value: "NVR servers configured for continuous surveillance" },
            { label: "Access", value: "Speed Gates and encrypted card readers" }
          ],
          image: PROJECT_CCTV_SITE
        },
        {
          id: "industrial-cabling-datacenter",
          title: "Structured Cabling & Data Network Infrastructure for Industrial Facility",
          category: "networks",
          categoryLabel: "Data Networks",
          location: "10th of Ramadan",
          year: "2023",
          deliveryYear: "2023",
          clientType: "Manufacturing & Industrial Sector",
          sector: "Industrial Plant & Warehouses",
          scopeSummary: "Deployment of Cat6A structured cabling and inter-building fiber optic backbones",
          scopeOfWork: [
            "Routing heavy-duty cable trays isolated from high-voltage electrical lines",
            "Pulling and terminating Cat6A data drops for manufacturing bays and plant offices",
            "Laying armored fiber optic backbone linking production hangars with central server room",
            "Mounting and organizing server racks equipped with monitored power distribution units",
            "Performing channel certification tests using specialized Fluke test instruments"
          ],
          description: "Structured copper Cat6A and fiber optic network infrastructure linking factory production lines and administrative offices with the central server room.",
          impactMetrics: [
            { label: "Facility Type", value: "Multi-Hangar Industrial Complex" },
            { label: "Disciplines", value: "Structured Cabling + Fiber" },
            { label: "Status", value: "Successfully Handed Over" }
          ],
          technicalSpecs: [
            { label: "Data Cables", value: "Shielded Cat6A standards-compliant copper" },
            { label: "Backbone", value: "Armored outdoor multi-core fiber optic" },
            { label: "Racks", value: "Server racks with cable management and ventilation" }
          ],
          image: PROJECT_CABLING_SITE
        },
        {
          id: "hospital-fire-addressable",
          title: "Addressable Fire Alarm Network for Healthcare Facility",
          category: "safety",
          categoryLabel: "Fire Alarm",
          location: "Nasr City, Cairo",
          year: "2023",
          deliveryYear: "2023",
          clientType: "Healthcare & Medical Sector",
          sector: "Medical Complex",
          scopeSummary: "Installation of addressable fire alarm panels, smoke/heat detectors, and voice alarm sounders",
          scopeOfWork: [
            "Reviewing engineering drawings with MEP consultants to ensure life safety code compliance",
            "Procuring and mounting intelligent addressable fire alarm panels",
            "Distributing smoke, thermal, and optical sensors across clinical rooms and corridors",
            "Wiring using certified fire-rated cables engineered for fire alarm circuits",
            "Configuring automated control relays for HVAC shutdown and emergency door release",
            "Supervising comprehensive system testing and emergency scenario simulations"
          ],
          description: "Engineering and installation of an addressable fire alarm network for a healthcare facility, featuring automated HVAC interlocks and voice alarm notification.",
          impactMetrics: [
            { label: "Facility Type", value: "Hospital & Medical Complex" },
            { label: "Disciplines", value: "Addressable Fire Alarm" },
            { label: "Status", value: "Successfully Handed Over" }
          ],
          technicalSpecs: [
            { label: "Architecture", value: "Intelligent addressable fire alarm panels" },
            { label: "Cables", value: "Certified fire-rated cables" },
            { label: "Interlocks", value: "Automated HVAC shutdown and emergency exit release" }
          ],
          image: PROJECT_FIRE_SITE
        },
        {
          id: "corporate-tower-bms",
          title: "Building Management System & IP Telephony for Commercial Tower",
          category: "smart-bms",
          categoryLabel: "BMS & Acoustics",
          location: "Cairo",
          year: "2024",
          deliveryYear: "2024",
          clientType: "Smart Buildings & Commercial Towers",
          sector: "Commercial & Office Tower",
          scopeSummary: "Integrating HVAC, lighting, and power panels onto a BMS console paired with IP PBX",
          scopeOfWork: [
            "Programming Direct Digital Controllers (DDC) over open building network protocols",
            "Connecting energy metering panels, sub-distribution boards, and central chillers",
            "Configuring an enterprise IP PBX server and deploying desktop handsets for tenant offices",
            "Providing a preventative maintenance SLA contract to monitor software and hardware stability"
          ],
          description: "Integrating HVAC and power telemetry onto a unified supervisory BMS dashboard, combined with an IP PBX internal telephony network for corporate offices.",
          impactMetrics: [
            { label: "Facility Type", value: "Commercial & Office Tower" },
            { label: "Disciplines", value: "BMS + IP PBX + SLA" },
            { label: "Status", value: "Handed Over & Maintained" }
          ],
          technicalSpecs: [
            { label: "BMS Protocol", value: "Standard open BACnet and Modbus" },
            { label: "Telephony", value: "IP PBX server supporting internal extension routing" },
            { label: "Maintenance", value: "Scheduled preventative SLA agreement" }
          ],
          image: PROJECT_BMS_SITE
        },
        {
          id: "remote-facility-low-current",
          title: "Security & Telecommunications System for Regional Outpost",
          category: "surveillance",
          categoryLabel: "CCTV & Access",
          location: "Matrouh",
          year: "2022",
          deliveryYear: "2022",
          clientType: "Regional Infrastructure & Remote Facilities",
          sector: "Regional Remote Outpost",
          scopeSummary: "Installing outdoor CCTV surveillance, point-to-point wireless links, and access gates",
          scopeOfWork: [
            "Mounting ruggedized outdoor surveillance cameras engineered for desert climate conditions",
            "Establishing wireless data transmission links to relay video streams to central monitoring",
            "Installing access control gates for primary facility perimeter entrances",
            "Equipping power backup banks with Uninterruptible Power Supplies (UPS) for hardware protection"
          ],
          description: "Equipping a regional facility with weather-protected video surveillance, wireless data links suited for remote terrain, and redundant UPS power conditioning.",
          impactMetrics: [
            { label: "Facility Type", value: "Regional Desert Outpost" },
            { label: "Disciplines", value: "CCTV + Wireless Links + UPS" },
            { label: "Status", value: "Successfully Handed Over" }
          ],
          technicalSpecs: [
            { label: "Cameras", value: "Dust and temperature-resistant outdoor IP cameras" },
            { label: "Data Transport", value: "Point-to-point wireless transmission links" },
            { label: "Power Backup", value: "UPS power supplies and storage batteries" }
          ],
          image: PROJECT_SIWA_SITE
        },
        {
          id: "giza-logistics-pa-sound",
          title: "Public Address & Paging Acoustic System for Logistics Center",
          category: "smart-bms",
          categoryLabel: "BMS & Acoustics",
          location: "Giza",
          year: "2023",
          deliveryYear: "2023",
          clientType: "Logistics & Distribution Sector",
          sector: "Logistics & Distribution Hub",
          scopeSummary: "Acoustic distribution of ceiling/horn speakers and multi-zone paging stations",
          scopeOfWork: [
            "Conducting acoustic coverage calculations to position speakers within high-ceiling bays",
            "Installing weatherproof horn speakers and ceiling transducers across separate operating zones",
            "Mounting central 100V amplifiers and multi-zone desktop paging stations",
            "Interlocking the audio matrix with fire alarm relays for automated evacuation broadcasting"
          ],
          description: "Multi-zone public address and acoustic paging system covering storage bays, loading docks, and offices, integrated with fire alarm evacuation muting.",
          impactMetrics: [
            { label: "Facility Type", value: "Logistics Warehouse & Depot" },
            { label: "Disciplines", value: "Public Address & Paging" },
            { label: "Status", value: "Successfully Handed Over" }
          ],
          technicalSpecs: [
            { label: "Speakers", value: "High-efficiency horn and ceiling 100V speakers" },
            { label: "Zoning", value: "Multi-zone audio routing matrix" },
            { label: "Integration", value: "Fire alarm voice override relay" }
          ],
          image: PROJECT_SOUND_SITE
        }
      ]
    },
    configurator: {
      sectionKicker: "Preliminary Engineering Scope",
      heading: "Project Requirements Estimator",
      subheading: "An interactive assistant to help project leaders articulate preliminary facility requirements and select systems prior to formal BOQ design.",
      facilityTypeLabel: "Facility or Building Type",
      facilityTypes: [
        { id: "office", label: "Commercial Office Building" },
        { id: "industrial", label: "Industrial Manufacturing Plant" },
        { id: "healthcare", label: "Hospital / Healthcare Facility" },
        { id: "commercial", label: "Commercial Shopping Mall" },
        { id: "educational", label: "Educational Institution" },
        { id: "residential", label: "Residential Compound" },
        { id: "logistics", label: "Logistics Distribution Warehouse" }
      ],
      scaleLabel: "Approximate Facility Area",
      scaleUnit: "square meters",
      modulesTitle: "Systems Required for Initial Assessment",
      modules: [
        { id: "cctv", label: "Video Surveillance (CCTV)", desc: "Network IP cameras, NVRs, and recording arrays" },
        { id: "fire", label: "Fire Alarm Systems", desc: "Addressable panels, smoke/heat sensors, and audio sounders" },
        { id: "access", label: "Access Control Systems", desc: "Speed gates, RFID/biometric readers, and magnetic locks" },
        { id: "cabling", label: "Structured Cabling", desc: "Cat6A horizontal drops, fiber backbones, and server racks" },
        { id: "pbx", label: "IP PBX Telephony", desc: "Network PBX appliance, IP desk phones, and dial plans" },
        { id: "pa", label: "Public Address & Sound", desc: "Multi-zone acoustic distribution and evacuation paging" },
        { id: "bms", label: "Building Management (BMS)", desc: "Supervisory telemetry for HVAC, lighting, and power" },
        { id: "sla", label: "Maintenance Contracts (SLA)", desc: "Scheduled preventative inspections and support" }
      ],
      resultTitle: "Preliminary Project Requirements Summary",
      estCablingPoints: "Estimated Data Drops",
      estCameras: "Surveillance Cameras",
      estDoors: "Secured Access Doors",
      estTimeline: "Estimated Timeline",
      applyCta: "Submit Summary for Technical Review",
      disclaimer: "Precise quantity determination requires review of engineering drawings and site technical specifications."
    },
    partners: {
      sectionKicker: "Brands & Technologies",
      heading: "Technology Brands We Work With",
      subheading: "We supply, install, and integrate solutions from multiple technology brands based on project technical requirements, budget, and supplier product availability.",
      brands: [
        "Hikvision",
        "Dahua Technology",
        "Cisco Systems",
        "Schneider Electric",
        "Honeywell",
        "Notifier by Honeywell",
        "Legrand",
        "Panduit",
        "ZKTeco",
        "Suprema",
        "Grandstream",
        "Yealink"
      ]
    },
    contact: {
      sectionKicker: "Contact & Consultation",
      heading: "Request Technical Consultation & Project BOQ",
      subheading: "Our engineering team is available to discuss project specifications, review drawings, and prepare tailored proposals adhering to approved standards.",
      officeTitle: "Headquarters & Administrative Office",
      officeAddress: "Nasr City, Cairo, Arab Republic of Egypt",
      phonesTitle: "Direct Inquiries & Phone Contacts",
      phonePrimary: "+20 100 719 6485",
      phoneSecondary: "+20 120 072 8006",
      emailTitle: "Official Corporate Email",
      emailAddress: "info@egypt-ge.com",
      hoursTitle: "Working Hours",
      hoursValue: "Saturday - Thursday: 9:00 AM - 6:00 PM (Dispatched support under active SLA terms)",
      whatsAppAction: "Direct WhatsApp Inquiries",
      form: {
        nameLabel: "Full Name / Representative",
        namePlaceholder: "e.g., Eng. Tamer El-Shafey - Projects Director",
        emailLabel: "Corporate / Professional Email",
        emailPlaceholder: "name@company.com",
        phoneLabel: "Phone / WhatsApp Number",
        phonePlaceholder: "+20 10xxxxxxxx",
        serviceLabel: "Target Systems / Discipline",
        servicePlaceholder: "Select systems or specify project requirements",
        messageLabel: "Project Overview & Scope Details",
        messagePlaceholder: "Please describe the facility nature, area, systems required, and drawings availability...",
        submitBtn: "Submit Technical Consultation Request",
        submitting: "Submitting request securely...",
        successTitle: "Inquiry Received Successfully",
        successMsg: "Thank you for reaching out to Egypt Green Energy L.L.C. Our engineering team will review your specifications and follow up with the next steps.",
        errorRequired: "This field is required",
        errorEmail: "Please provide a valid corporate email",
        errorPhone: "Please provide a valid telephone number"
      },
      mapTitle: "Nasr City Headquarters - Cairo",
      mapDesc: "Centrally positioned in Nasr City to serve installations across Greater Cairo, industrial corridors, and regional governorates.",
      openInMaps: "Open in Google Maps"
    },
    footer: {
      about: "Egypt Green Energy L.L.C (Founded 2014) — Low Current Systems & Technology Solutions Division: Turnkey engineering solutions covering design, procurement, installation, programming, and contractual maintenance across Egypt.",
      quickLinks: "Navigation Links",
      systemsTitle: "Low Current Systems",
      rights: `© ${currentYear} Egypt Green Energy L.L.C. All rights reserved.`,
      crNumber: "Commercial Registration & Tax Card | Nasr City, Cairo",
      backToTop: "Back to Top"
    }
  }
};
