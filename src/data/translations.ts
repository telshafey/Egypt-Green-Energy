import { Language, LightCurrentSystem, ProjectItem, TimelineEvent } from '../types';
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

// Real Field Execution Photos for verified projects
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
    timeline: TimelineEvent[];
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

export const content: Record<Language, TranslationContent> = {
  ar: {
    meta: {
      title: "شركة مصر للطاقة الخضراء ذ.م.م | قطاع أنظمة التيار الخفيف والتكنولوجيا المتكاملة",
      description: "المتخصصون المعتمدون في أنظمة التيار الخفيف (Low Current Systems)، كاميرات المراقبة CCTV، إنذار الحريق، التحكم في الدخول، الشبكات، والسنترالات في مصر."
    },
    brand: {
      name: "شركة مصر للطاقة الخضراء ذ.م.م",
      tagline: "Egypt Green Energy L.L.C",
      subtext: "قطاع أنظمة التيار الخفيف والحلول التكنولوجية المتكاملة"
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      systems: "أنظمة التيار الخفيف",
      projects: "أعمالنا ومشاريعنا",
      configurator: "حاسبة المقايسة",
      contact: "اتصل بنا",
      ctaButton: "طلب مقايسة فنية",
      langToggle: "English"
    },
    hero: {
      kicker: "خبرة هندسية تراكمية ممتدة منذ عام 1980 في مصر (أكثر من 46 عاماً وتأسيس الكيان في 2014)",
      title: "أنظمة التيار الخفيف والحلول التكنولوجية الذكية للمباني والشركات",
      highlight: "أنظمة التيار الخفيف",
      subtitle: "نصمم وننفذ حلول التيار الخفيف المتكاملة: شبكات المراقبة بالكاميرات (CCTV)، إنذار الحريق، التحكم في الأبواب (Access Control)، الكابلات الهيكلية والألياف الضوئية، السنترالات الموحدة، مع عقود صيانة معتمدة 24/7.",
      ctaPrimary: "طلب مقايسة ودراسة فنية",
      ctaSecondary: "استكشف أنظمة التيار الخفيف",
      trustBullet1: "68+ منشأة ومبنى مجهز بالكامل",
      trustBullet2: "معايير NFPA و TIA-942 والكود المصري",
      trustBullet3: "دعم فني واستجابة طوارئ 24/7"
    },
    stats: {
      projectsCount: "68+",
      projectsLabel: "مشروع تيار خفيف منجز",
      projectsDesc: "في المباني الإدارية، المصانع، المستشفيات، والمجمعات السكنية مع محاضر استلام",
      satisfactionRate: "92%",
      satisfactionLabel: "نسبة رضا العملاء الموثقة",
      satisfactionDesc: "التزام كامل بالمواصفات الفنية والجداول الزمنية للتسليم بدون تأخير",
      heritageYears: "46+",
      heritageLabel: "عاماً من الخبرة الهندسية المتراكمة",
      heritageDesc: "خبرات إدارة وتنفيذ المشروعات منذ 1980 مع التأسيس المؤسسي للكيان في 2014",
      systemsCount: "8+",
      systemsLabel: "أنظمة تخصصية متكاملة",
      systemsDesc: "من الكاميرات والإنذار إلى الشبكات، السنترالات، وأنظمة المباني BMS"
    },
    about: {
      sectionKicker: "عن الشركة وخبرتنا الميدانية",
      heading: "الريادة في هندسة التيار الخفيف والبنية التحتية الذكية",
      subheading: "تأسست الشركة رسمياً ككيان تقني متخصص عام 2014، مستندة إلى إرث هندسي متين في إدارة المشاريع والتنفيذ يمتد منذ عام 1980 (أكثر من 46 عاماً من الخبرة المتراكمة لدى المؤسسين وفريق العمل).",
      p1: "نحن في شركة مصر للطاقة الخضراء ذ.م.م — قطاع أنظمة التيار الخفيف والحلول التكنولوجية المتكاملة — نعد شريك النجاح التقني للمؤسسات، المطورين العقاريين، والمصانع في جمهورية مصر العربية. نوفر حلولاً هندسية شاملة (Turnkey Solutions) تبدأ من مرحلة التخطيط والدراسة، مروراً بالتوريد والتركيب والبرمجة، وصولاً إلى التسليم المعتمد وعقود الصيانة الدورية.",
      p2: "نركز بشكل أساسي على دمج جميع أنظمة التيار الخفيف (Low Current / ELV Systems) في منصة إدارة موحدة تضمن أعلى مستويات الأمان وسرعة نقل البيانات وكفاءة التشغيل، مع توفير حلول التغذية الكهربائية الاحتياطية والطاقة النظيفة للمنشآت الحيوية.",
      visionTitle: "رؤيتنا (Our Vision)",
      visionText: "أن نكون الكيان الهندسي الأول والأكثر موثوقية في مصر والشرق الأوسط لتقديم أنظمة التيار الخفيف والأمن الإلكتروني والشبكات الذكية للمدن والمباني الحديثة.",
      missionTitle: "رسالتنا (Our Mission)",
      missionText: "تأمين وربط المنشآت بأحدث تقنيات التيار الخفيف العالمية، مع الالتزام الصارم بمعايير الجودة وتقديم خدمات الدعم الفني والصيانة المدارة (SLA) التي تضمن استمرارية الأعمال دون انقطاع.",
      timelineTitle: "محطات تطورنا الهندسي",
      timelineSub: "مسيرة 46 عاماً من الخبرة الهندسية الممتدة (1980 - 2026) وصولاً لريادة تكنولوجيا التيار الخفيف",
      timeline: [
        {
          year: "1980",
          title: "التأسيس الهندسي والتجاري",
          description: "انطلاق العمل في قطاعات الهندسة الكهربائية والمقاولات المتخصصة وإدارة المشروعات في مصر.",
          highlight: "أكثر من 46 عاماً من الخبرة التنفيذية المتوارثة"
        },
        {
          year: "2005",
          title: "التوسع في أنظمة الاتصالات والأمن",
          description: "تأسيس قسم متخصص في شبكات البيانات السلكية واللاسلكية وأنظمة الاتصال التناظري والرقمي.",
          highlight: "بناء أولى شبكات الألياف الضوئية للمجمعات"
        },
        {
          year: "2014",
          title: "تأسيس الكيان المؤسسي المستقل",
          description: "إطلاق الكيان الرسمي المستقل لدمج حلول التكنولوجيا والأنظمة الذكية المتطورة وحلول الطاقة.",
          highlight: "انطلاقة شاملة لخدمة القطاع المؤسسي والصناعي"
        },
        {
          year: "2018",
          title: "تكامل أنظمة المراقبة والتحكم المركزي",
          description: "تنفيذ مشروعات كبرى لأنظمة المراقبة بالكاميرات CCTV الرقمية IP وأنظمة إنذار الحريق المعنونة.",
          highlight: "شهادات اعتماد عالمية وشراكات مع كبار المصنعين"
        },
        {
          year: "2021",
          title: "مشروعات البنية التحتية الذكية وسيوة ومطروح",
          description: "تجهيز المنشآت الحيوية في المحافظات والمواقع الإقليمية بغرف تحكم ومراقبة وبنية اتصالات مستقلة.",
          highlight: "حلول التيار الخفيف للمواقع النائية والصناعية"
        },
        {
          year: "2026",
          title: "أنظمة المباني الذكية BMS وإنترنت الأشياء",
          description: "تكامل أنظمة المباني الذكية مع أنظمة المراقبة والتحكم في الدخول وتوفير عقود SLA رقمية 24/7.",
          highlight: "68+ مشروعاً معتمداً وحضور تقني رائد"
        }
      ],
      valuesTitle: "المعايير الهندسية الحاكمة لأعمالنا",
      values: [
        {
          title: "المطابقة القياسية",
          desc: "نلتزم بكودات الحريق والسلامة (NFPA) ومعايير الشبكات الدولية (TIA/EIA و ISO) في كافة التمديدات."
        },
        {
          title: "التكامل الرقمي الشامل",
          desc: "ربط الكاميرات، بوابات الدخول، الإنذار، والشبكة في لوحة تحكم مركزية واحدة سهلة الإدارة."
        },
        {
          title: "الموثوقية وتأمين الطوارئ",
          desc: "أنظمتنا مصممة لتعمل باستمرارية تامة مع وحدات تغذية احتياطية وعوازل ضد التشويش والارتفاع المفاجئ للجهد."
        },
        {
          title: "سرعة الاستجابة الميدانية",
          desc: "فرق دعم هندسي متخصصة تتدخل في أقل من ساعتين للأعطال الحرجة بموجب عقود الصيانة المدارة."
        }
      ]
    },
    systems: {
      sectionKicker: "مجالات التخصص الأساسية",
      heading: "أنظمة التيار الخفيف المتكاملة (Low Current Systems)",
      subheading: "حزمة متكاملة من الحلول التكنولوجية الذكية لتأمين وتشغيل المنشآت الإدارية، التجارية، والمصانع بأعلى دقة.",
      exploreDetails: "المواصفات الفنية ومكونات النظام",
      backToList: "العودة للأنظمة",
      requestQuote: "طلب مقايسة لهذا النظام",
      categories: {
        all: "جميع الأنظمة",
        security: "الأمن والمراقبة",
        safety: "السلامة وإنذار الحريق",
        connectivity: "الشبكات والسنترالات",
        audioBms: "الصوتيات والمباني الذكية",
        maintenance: "عقود الصيانة SLA"
      },
      items: [
        {
          id: "cctv-surveillance",
          category: "security",
          title: "أنظمة المراقبة بالكاميرات الأمنية (CCTV & IP Video)",
          subtitle: "كاميرات IP فائقة الدقة 4K مع تحليلات الفيديو الذكية والتعرف على الوجوه",
          description: "تصميم وتنفيذ شبكات المراقبة المرئية للمباني والمصانع والمستودعات. نوفر كاميرات داخلية وخارجية مقاومة للعوامل الجوية، مع أجهزة تسجيل شبكية NVR، وسيرفرات تخزين ضخمة، وغرف مراقبة مجهزة بشاشات حائطية (Video Wall).",
          features: [
            "كاميرات IP بدقة تبدأ من 4MP وحتى 4K مع خاصية الرؤية الليلية بالألوان الكاملة",
            "تحليلات الذكاء الاصطناعي: التعرف على لوحات السيارات (LPR)، كشف التسلل، وتتبع الحركة",
            "سيرفرات تخزين RAID لضمان الاحتفاظ بالتسجيلات لفترات ممتدة (30-180 يوماً)",
            "إمكانية المراقبة اللحظية والتحكم عن بعد عبر تطبيقات الهواتف الذكية وأجهزة الكمبيوتر"
          ],
          specs: [
            { label: "دقة التصوير", value: "4K UHD / Ultra Low-Light" },
            { label: "كود الضغط", value: "H.265+ لتوفير 70% من التخزين" },
            { label: "معايير الحماية", value: "IP67 ضد الماء والأتربة / IK10 ضد الصدمات" }
          ],
          image: CCTV_IMAGE,
          badge: "4K VCA / CCTV"
        },
        {
          id: "fire-alarm",
          category: "safety",
          title: "أنظمة إنذار ومكافحة الحريق (Fire Alarm Systems)",
          subtitle: "لوحات معنونة ذكية (Addressable) وحساسات كشف مبكر معتمدة من الدفاع المدني",
          description: "حماية الأرواح والمنشآت من خلال شبكات إنذار حريق مبكر متطورة. نقوم بتوريد وتركيب وبرمجة اللوحات المعنونة، كواشف الدخان والحرارة والغاز، وأجهزة السارينة والفلاش، ونظام الإخلاء الصوتي المبرمج التلقائي.",
          features: [
            "لوحات تحكم معنونة (Addressable Panels) تحدد موقع الحريق بدقة رقم الغرفة والقاطع",
            "كواشف ذكية متعددة الحساسية تمنع الإنذارات الكاذبة مع فحص ذاتي دوري",
            "ربط فوري وتلقائي مع أنظمة الإطفاء الآلي، لوحات الكهرباء، والمصاعد لفتحها في الطوارئ",
            "مطابقة كاملة لمواصفات الكود الأمريكي NFPA 72 واشتراطات الحماية المدنية المصرية"
          ],
          specs: [
            { label: "نوع النظام", value: "Analogue Addressable Fire Alarm" },
            { label: "زمن الاستجابة للإنذار", value: "أقل من 3 ثوانٍ" },
            { label: "الشهادات المعتمدة", value: "UL Listed / FM Approved / LPCB" }
          ],
          image: HERO_IMAGE,
          badge: "NFPA 72 Certified"
        },
        {
          id: "access-control",
          category: "security",
          title: "أنظمة التحكم في الدخول والبوابات الذكية (Access Control)",
          subtitle: "أجهزة البصمة والتعرف على الوجه، الكروت المشفرة، وبوابات مواقف السيارات",
          description: "إدارة حركة الأفراد والزوار وتأمين الأبواب والمناطق الحساسة (غرف الخوادم، الخزائن، والإدارات). تشمل المنظومة أقفالاً كهرومغناطيسية، قراء بصمة ووجه سريعة، وبوابات مرور زجاجية ذكية (Turnstiles & Speed Gates).",
          features: [
            "محطات التعرف على الوجه دون لمس مع قياس حرارة وسرعة تحقق أقل من 0.2 ثانية",
            "بوابات دخول أمنية زجاجية فاخرة لمداخل المقرات الإدارية والشركات",
            "بوابات مواقف سيارات هيدروليكية ذكية (Barrier Gates) مع قارئات المدى البعيد RFID",
            "برنامج إدارة سحابي / محلي لإصدار تقارير الحضور والانصراف والصلاحيات اللحظية"
          ],
          specs: [
            { label: "سعة المستخدمين", value: "حتى 50,000 مستخدم وبصمة وجه" },
            { label: "نوع الأقفال", value: "Magnetic Locks 600-1200 lbs / Drop Bolts" },
            { label: "بروتوكول الاتصال", value: "TCP/IP / Wiegand / OSDP Secure" }
          ],
          image: ACCESS_IMAGE,
          badge: "Biometric Access"
        },
        {
          id: "structured-cabling",
          category: "connectivity",
          title: "الشبكات والكابلات الهيكلية والألياف الضوئية (Structured Cabling)",
          subtitle: "تمديدات شبكات Cat6 / Cat6A / Cat7 وكابلات الألياف الضوئية المعتمدة مع اختبارات Fluke",
          description: "تأسيس العمود الفقري لنقل البيانات داخل المنشأة بأعلى سرعات واعتمادية. نقوم بتوريد وتمديد الكابلات، تنظيم كبائن السيرفرات (Racks)، تركيب الـ Patch Panels، وتوصيل كابلات الألياف الضوئية بين الأدوار والمباني.",
          features: [
            "تنظيم واحترافية فائقة في تدكيك الكابلات وترقيمها لتسهيل التتبع والصيانة",
            "تمديد ولحام كابلات الألياف الضوئية (Fiber Optic Splicing) للمسافات البعيدة",
            "تسليم اختبارات فحص معتمدة بتقرير أجهزة Fluke Networks لضمان جودة كل نقطة",
            "كبائن خوادم مجهزة بوحدات تنظيم الكابلات، وحدات توزيع الطاقة PDU، ومراوح تبريد"
          ],
          specs: [
            { label: "فئة الكابلات", value: "Cat6 / Cat6A / Cat7 UTP & FTP" },
            { label: "سرعة نقل البيانات", value: "حتى 10 Gbps Ethernet" },
            { label: "معايير التمديد", value: "TIA/EIA-568-C / ISO 11801" }
          ],
          image: CABLING_IMAGE,
          badge: "Cat6A / Fiber"
        },
        {
          id: "ip-telephony",
          category: "connectivity",
          title: "السنترالات الرقمية والاتصالات الموحدة (IP PBX & Intercom)",
          subtitle: "سنترالات IP للشركات، هواتف مكتبية ذكية، وأنظمة الانتركم المرئي للمباني",
          description: "حلول الاتصال الهاتفي الداخلي والخارجي للمؤسسات والفنادق والمجمعات. سنترالات شبكية تدعم الفروع المتعددة، الرد الآلي IVR، تسجيل المكالمات، وربط الموبايل كخط داخلي بالمكتب.",
          features: [
            "سنترالات رقمية تدعم خطوط الـ SIP Trunk والخطوط الأرضية التناظرية",
            "هواتف IP مكتبية بشاشات ملونة وصوت عالي النقاء HD Voice",
            "أنظمة الانتركم المرئي IP Intercom للشقق والفلل والشركات مع فتح الأبواب عن بعد",
            "ربط الفروع الجغرافية المختلفة في شبكة اتصال داخلية موحدة ومجانية بالكامل"
          ],
          specs: [
            { label: "السعة التشغيلية", value: "من 10 خطوط وحتى 2000 خط داخلي" },
            { label: "البروتوكول", value: "SIP RFC3261 Standard" },
            { label: "التكامل", value: "متوافق مع أنظمة CRM و Outlook" }
          ],
          image: DATACENTER_IMAGE,
          badge: "VoIP / IP-PBX"
        },
        {
          id: "public-address",
          category: "audio-bms",
          title: "أنظمة الإذاعة الداخلية والصوتيات (Public Address & BGM)",
          subtitle: "مكبرات صوت سقفية وحائطية، مضخمات صوت للمصانع، ونظم نداء الطوارئ",
          description: "أنظمة الصوتيات المركزية للمباني الإدارية، المصانع، المستشفيات، والمجمعات التجارية. توفر بث الموسيقى الخلفية (BGM)، إذاعة النداءات والتعليمات الموجهة لكل زون على حدة، وتكامل مباشر مع نظام إنذار الحريق للإخلاء الآلي.",
          features: [
            "سماعات سقفية (Ceiling Speakers) وسماعات عامودية (Column Speakers) عالية النقاء",
            "ميكروفونات نداء مكتبية مع إمكانية توجيه الرسالة لمناطق وزونات محددة (Zoning)",
            "أجهزة تكبير وتوزيع الصوت (Amplifiers) بقدرات متنوعة مع حماية ضد الحمل الزائد",
            "تكامل مع إنذار الحريق لتحويل النظام تلقائياً لإذاعة رسائل الطوارئ الصوتية المسجلة"
          ],
          specs: [
            { label: "فولتية التشغيل", value: "70V / 100V Constant Voltage Line" },
            { label: "المناطق (Zones)", value: "توزيع صوتي متعدد المناطق من 4 إلى 32 زون" },
            { label: "مطابقة الطوارئ", value: "EN 54-24 Voice Alarm Compliant" }
          ],
          image: HERO_IMAGE,
          badge: "PA / Sound System"
        },
        {
          id: "bms-automation",
          category: "audio-bms",
          title: "إدارة المباني الذكية والتحكم (BMS & Smart Building)",
          subtitle: "أتمتة التكييف، الإنارة، ومراقبة استهلاك الطاقة وتغذية الـ UPS الاحتياطية",
          description: "دمج ومراقبة كافة الأنظمة الكهروميكانيكية وأنظمة التيار الخفيف في شاشة تحكم مركزية واحدة. يتيح نظام BMS خفض استهلاك الطاقة بنسبة تصل إلى 30% مع تنبيهات استباقية قبل حدوث الأعطال في لوحات الكهرباء والمضخات.",
          features: [
            "لوحة تحكم مركزية رسومية تعرض حالة التكييف والتهوية والإنارة في كافة الأدوار",
            "مراقبة دقيقة لاستهلاك الكهرباء، ومستويات الديزل، وحالة بطاريات الـ UPS الاحتياطية",
            "برمجة سيناريوهات التشغيل التلقائي بحسب أوقات العمل وجودة الهواء ودرجة الحرارة",
            "تكامل مباشر مع وحدات الطاقة النظيفة الاحتياطية لضمان الاستمرارية"
          ],
          specs: [
            { label: "بروتوكولات الربط", value: "BACnet / Modbus / LonWorks / KNX" },
            { label: "نسبة توفير الطاقة", value: "18% - 32% من فاتورة التشغيل" },
            { label: "الواجهة", value: "Web-Based SCADA & Mobile Dashboard" }
          ],
          image: DATACENTER_IMAGE,
          badge: "BMS / IoT"
        },
        {
          id: "sla-maintenance",
          category: "maintenance",
          title: "عقود الصيانة المدارة واتفاقيات مستوى الخدمة (24/7 SLA)",
          subtitle: "صيانة وقائية دورية، دعم ميداني فوري، واستبدال قطع الغيار لجميع أنظمة التيار الخفيف",
          description: "نقدم للمؤسسات والشركات والمصانع عقود صيانة سنوية شاملة تضمن جاهزية أنظمة التيار الخفيف دون توقف. يشمل العقد زيارات فحص شهرية، استجابة سريعة للبلاغات الطارئة، وتقرير فني معتمد بعد كل زيارة.",
          features: [
            "فريق مهندسين وفنيين متخصصين متواجدين للتدخل السريع على مدار 24 ساعة",
            "فحص دوري وتنظيف للكاميرات، اللوحات، الكواشف، وتنظيم كبائن الشبكات",
            "توفير أجهزة وكاميرات ومعدات بديلة جاهزة لتركيبها فوراً في حالات الأعطال الجسيمة",
            "تقارير صيانة رقمية دورية ترفع للإدارة توضح حالة كل نظام وتوصيات التحديث"
          ],
          specs: [
            { label: "زمن الاستجابة للطوارئ", value: "أقل من ساعتين في نطاق القاهرة الكبرى" },
            { label: "جاهزية الدعم الفني", value: "24/7/365 خط ساخن للدعم" },
            { label: "نسبة التزام الـ SLA", value: "99.4% على مدار الـ 5 سنوات الماضية" }
          ],
          image: CABLING_IMAGE,
          badge: "24/7 SLA Support"
        }
      ]
    },
    projects: {
      sectionKicker: "معرض المشروعات الميدانية",
      heading: "سابقة أعمالنا في أنظمة التيار الخفيف",
      subheading: "أكثر من 68 مشروعاً منجزاً في توريد وتركيب وبرمجة أنظمة التيار الخفيف لكبرى الشركات، المصانع، والمجمعات الإدارية في مصر.",
      filterAll: "جميع المشروعات",
      filterSurveillance: "كاميرات المراقبة والأمن",
      filterNetworks: "الشبكات وكابلات الداتا",
      filterSafety: "إنذار الحريق والسلامة",
      filterSmartBms: "أنظمة التحكم والمباني الذكية",
      viewDetails: "عرض تفاصيل ومواصفات المشروع",
      closeModal: "إغلاق التفاصيل",
      locationLabel: "الموقع الجغرافي",
      yearLabel: "سنة التنفيذ",
      clientLabel: "نوع المنشأة / العميل",
      items: [
        {
          id: "cairo-business-park-cctv",
          title: "منظومة المراقبة والتحكم بالدخول للمقر الإداري المتكامل",
          category: "surveillance",
          categoryLabel: "كاميرات المراقبة والأمن",
          location: "القاهرة الجديدة، مصر",
          year: "2024",
          clientType: "مبنى إداري لشركة استثمارية كبرى",
          clientName: "شركة كابيتال للاستثمار وإدارة الأصول العقارية",
          scopeOfWork: [
            "دراسة المخططات الهندسية وتحديد زوايا الكاميرات وفق معايير وزارة الداخلية",
            "توريد وتركيب 160 كاميرا 4K IP بتقنية التعرف على الوجوه ولوحات السيارات LPR",
            "توريد وتركيب 18 بوابة مرور أفراد زجاجية Speed Gates مع شاشات بصمة وجه",
            "تجهيز غرفة التحكم الرئيسية بشاشة عرض جدارية Video Wall وتخزين مركزي RAID 6",
            "تدريب فريق الأمن الداخلي وتسليم محضر التشغيل الرسمي"
          ],
          deliveryYear: "مارس 2024",
          handoverCertificate: "محضر استلام ابتدائي معتمد ومطابقة أمنية بنسبة 100%",
          consultantName: "إشراف الاستشاري العام للأعمال الكهروميكانيكية (MEP Consultant)",
          isFieldRealPhoto: true,
          description: "توريد وتركيب شبكة مراقبة متكاملة تضم 160 كاميرا 4K IP مع التعرف على الوجوه، و18 بوابة دخول زجاجية Turnstiles، مع ربطها بغرفة تحكم مركزية وشاشات مراقبة جدارية Video Wall.",
          impactMetrics: [
            { label: "عدد الكاميرات الميدانية", value: "160 كاميرا 4K" },
            { label: "بوابات الدخول الذكية", value: "18 بوابة Speed Gate" },
            { label: "مدة التخزين المستمر", value: "90 يوماً RAID 6" }
          ],
          technicalSpecs: [
            { label: "الكاميرات المعتمدة", value: "4K DarkFighter with VCA AI DeepinMind" },
            { label: "نظام التسجيل المركزي", value: "Dual NVR 64-Channel Redundant Hot-Spare" },
            { label: "التحكم في الأبواب", value: "Biometric Face Recognition + Mifare RFID" },
            { label: "شاشات المراقبة", value: "Video Wall 6x 55-inch Ultra-Narrow Bezel" }
          ],
          image: PROJECT_CCTV_SITE
        },
        {
          id: "industrial-cabling-datacenter",
          title: "البنية التحتية للشبكات وكبائن السيرفرات بمجمع المصانع",
          category: "networks",
          categoryLabel: "الشبكات وكابلات الداتا",
          location: "مدينة العاشر من رمضان، مصر",
          year: "2023",
          clientType: "مجمع صناعات هندسية وتصنيع كابلات",
          clientName: "مجموعة الصناعات الهندسية والتصنيع المعدني",
          scopeOfWork: [
            "تخطيط مسارات الكابلات وحوامل الكابلات Cable Trays المعزولة ضد التداخل الكهرومغناطيسي",
            "سحب وتيرمينيشن 950 نقطة داتا Cat6A لربط خطوط الإنتاج والمكاتب الهندسية",
            "تمديد 4.5 كم كابلات ألياف ضوئية مسلحة Armored Single-Mode بين العنابر",
            "تركيب 4 كبائن خوادم 42U مع وحدات توزيع طاقة ذكية Smart PDU",
            "إجراء اختبارات فحص واعتماد النقاط بجهاز Fluke DSX-8000 وتسليم التقارير المعتمدة"
          ],
          deliveryYear: "نوفمبر 2023",
          handoverCertificate: "شهادة اختبار Fluke معتمدة وضمان شبكات 25 عاماً من الوكيل",
          consultantName: "المكتب الاستشاري للهندسة الصناعية والشبكات",
          isFieldRealPhoto: true,
          description: "تنفيذ شبكة كابلات هيكلية Cat6A شملت 950 نقطة داتا، وتمديد كابلات ألياف ضوئية لربط 6 عنابر تصنيع بغرفة السيرفرات الرئيسية، مع اعتماد تقارير الفحص بأجهزة Fluke DSX-8000.",
          impactMetrics: [
            { label: "نقاط الشبكة المنفذة", value: "950 نقطة Cat6A" },
            { label: "مسارات الألياف الضوئية", value: "4.5 كم فايبر مسلح" },
            { label: "جاهزية الشبكة", value: "10 Gbps Backbone" }
          ],
          technicalSpecs: [
            { label: "الكابلات المعتمدة", value: "Cat6A Shielded LSZH Fluke Certified" },
            { label: "الألياف الضوئية", value: "Single-Mode 12-Core Heavy Armored" },
            { label: "كبائن الخوادم", value: "4x 42U Server Racks with Smart Monitored PDU" },
            { label: "سويتشات التوزيع", value: "Managed Layer-3 PoE+ Enterprise Switches" }
          ],
          image: PROJECT_CABLING_SITE
        },
        {
          id: "hospital-fire-addressable",
          title: "شبكة إنذار الحريق المعنونة والإخلاء الصوتي للمستشفى",
          category: "safety",
          categoryLabel: "إنذار الحريق والسلامة",
          location: "مدينة نصر، القاهرة، مصر",
          year: "2023",
          clientType: "صرح طبي ومستشفى جراحي تخصصي",
          clientName: "مستشفى الصفوة التخصصي والصرح الطبي الدولي",
          scopeOfWork: [
            "إعداد المخططات التنفيذية Shop Drawings طبقاً لكود الحريق المصري ومعايير NFPA 72",
            "توريد وتركيب 4 لوحات إنذار حريق معنونة Networked Addressable مع شاشات لمس",
            "تثبيت ومعايرة 850 كاشف حريق وحرارة وليزر في غرف العمليات والعناية المركزة",
            "تنفيذ شبكة إخلاء صوتي تلقائي متعدد الزونات باللغتين العربية والإنجليزية",
            "ربط إشارات الإيقاف التلقائي مع لوحات التكييف ومصاعد الطوارئ وأبواب الهروب",
            "حضور تجربة الإخلاء واستخراج شهادة المطابقة الرسمية من الدفاع المدني"
          ],
          deliveryYear: "أغسطس 2023",
          handoverCertificate: "شهادة مطابقة واعتماد استلام رسمية من الإدارة العامة للحماية المدنية",
          consultantName: "استشاري الوقاية من الحريق والسلامة المهنية المعتمد",
          isFieldRealPhoto: true,
          description: "تصميم وتنفيذ شبكة إنذار حريق معنونة بالكامل تضم 4 لوحات تحكم رئيسية مرتبطة شبكياً، وأكثر من 850 كاشف حريق وحرارة، مع نظام الإخلاء الصوتي التلقائي المعتمد من الدفاع المدني.",
          impactMetrics: [
            { label: "عدد الكواشف المركبة", value: "850+ كاشف معنون" },
            { label: "لوحات التحكم المركزية", value: "4 لوحات Addressable نيتورك" },
            { label: "اعتماد الحماية المدنية", value: "شهادة مطابقة 100% صالحة" }
          ],
          technicalSpecs: [
            { label: "المعيار المطبق", value: "NFPA 72 & Egyptian Fire Code" },
            { label: "الكابلات الحرارية", value: "Fire Rated 2x1.5mm 180 Min Certified" },
            { label: "نظام الإخلاء الصوتي", value: "Multi-Zone Automated Voice Alarm 24V" },
            { label: "التكامل الكهروميكانيكي", value: "Auto HVAC Trip & Emergency Gate Release" }
          ],
          image: PROJECT_FIRE_SITE
        },
        {
          id: "corporate-tower-bms",
          title: "نظام إدارة المبنى الذكي (BMS) والسنترال الموحد للبرج",
          category: "smart-bms",
          categoryLabel: "أنظمة التحكم والمباني الذكية",
          location: "حي المال والأعمال، العاصمة الإدارية / التجمع، مصر",
          year: "2024",
          clientType: "برج إداري وتجاري متطور",
          clientName: "شركة تطوير الأبراج الذكية والمجمعات الإدارية",
          scopeOfWork: [
            "برمجة وحدة التحكم الرئيسية DDC ونظام الـ SCADA على بروتوكول BACnet/IP",
            "ربط وحدات التكييف المركزي AHU/Chillers ولوحات توزيع الكهرباء والمولدات الاحتياطية",
            "تثبيت 2,200 نقطة استشعار لدرجات الحرارة وضغط الهواء ومعدلات استهلاك الكهرباء",
            "توريد وتركيب سنترال IP PBX متكرر يخدم 400 موظف مع تطبيق هواتف ذكية",
            "توقيع عقد صيانة مدارة SLA لمدة 3 سنوات مع مراقبة وتحكم عن بعد"
          ],
          deliveryYear: "مايو 2024",
          handoverCertificate: "محضر تسليم تشغيل تكاملي واختبار كفاءة الطاقة",
          consultantName: "الاستشاري الهندسي العام للأبراج الذكية",
          isFieldRealPhoto: true,
          description: "ربط أنظمة التكييف والتهوية ولوحات الكهرباء وأنظمة الإضاءة بنظام BMS مركزي ببروتوكول BACnet، وتوريد سنترال IP PBX يخدم 400 موظف مع الربط السحابي وعقد صيانة SLA.",
          impactMetrics: [
            { label: "نقاط المراقبة والتحكم", value: "2,200 نقطة استشعار" },
            { label: "توفير الطاقة التشغيلية", value: "24% خفض مثبت بالفواتير" },
            { label: "خطوط السنترال المنفذة", value: "400 هاتف IP" }
          ],
          technicalSpecs: [
            { label: "بروتوكول BMS", value: "Native BACnet/IP Open Architecture" },
            { label: "السنترال الهاتفي", value: "Dual Hot-Standby IP PBX Server" },
            { label: "الاتصال الداخلي", value: "SIP Video Intercom with Access Gateways" },
            { label: "عقد الدعم الفني", value: "24/7 Premium SLA with 2-Hour Response" }
          ],
          image: PROJECT_BMS_SITE
        },
        {
          id: "remote-facility-low-current",
          title: "تجهيز شبكات التيار الخفيف والمراقبة لمشروع واحة سيوة",
          category: "surveillance",
          categoryLabel: "كاميرات المراقبة والأمن",
          location: "واحة سيوة، مطروح، مصر",
          year: "2022",
          clientType: "مجمع خدمات واستصلاح ريفي وزراعي",
          clientName: "شركة استصلاح وتنمية الواحات والزيوت الطبيعية",
          scopeOfWork: [
            "تصميم نظام مراقبة مستقل تماماً عن الشبكة الكهربائية العمومية في عمق الصحراء",
            "تركيب صاري مجلفن بارتفاع 18 متراً مع كاميرات حرارية وضوئية بعيدة المدى",
            "إنشاء وصلة ميكروويف لاسلكية لمسافة 12 كم لنقل البيانات إلى نقطة الربط الرئيسية",
            "تغذية المنظومة بمحطة طاقة شمسية مستقلة مع بطاريات جل وكابينة تحكم مكيفة",
            "ربط المنظومة عبر الأقمار الصناعية للمتابعة من المقر الرئيسي بالقاهرة"
          ],
          deliveryYear: "ديسمبر 2022",
          handoverCertificate: "محضر تسليم وتشغيل مستمر بنسبة جاهزية 99.9% في الظروف المناخية القاسية",
          consultantName: "إشراف هندسي مشترك لإدارة الطاقة والأنظمة الأمنية",
          isFieldRealPhoto: true,
          description: "تنفيذ بنية تيار خفيف مستقلة لموقع صحراوي معزول شملت كاميرات حرارية للمحيط الأمني، شبكة اتصالات لاسلكية بعيدة المدى، ونظام تحكم في الأبواب مع تغذية كهربائية احتياطية بالطاقة الشمسية.",
          impactMetrics: [
            { label: "تغطية المحيط الأمني", value: "360 درجة بكاميرات حرارية" },
            { label: "الربط اللاسلكي الميداني", value: "وصلات ميكروويف 12 كم" },
            { label: "استمرارية التشغيل الذاتي", value: "100% طاقة شمسية مستمرة" }
          ],
          technicalSpecs: [
            { label: "الكاميرات الميدانية", value: "Long-Range Thermal + Optical PTZ 40x" },
            { label: "الاتصال اللاسلكي", value: "Point-to-Point 5GHz Carrier Grade Microwave" },
            { label: "نظام التغذية الكهربائية", value: "Independent Solar DC Array & Smart AGM Pack" },
            { label: "إدارة النظام", value: "Satellite Uplink for Remote Cairo Monitoring" }
          ],
          image: PROJECT_SIWA_SITE
        },
        {
          id: "giza-logistics-pa-sound",
          title: "شبكة الإذاعة الداخلية والصوتيات للمجمع اللوجستي ومستودعات التوزيع",
          category: "smart-bms",
          categoryLabel: "أنظمة التحكم والمباني الذكية",
          location: "المنطقة الصناعية، الجيزة، مصر",
          year: "2023",
          clientType: "شركة لوجستيات وتوزيع دولية",
          clientName: "الوطنية للخدمات اللوجستية ومستودعات التبريد والتخزين",
          scopeOfWork: [
            "دراسة المحاكاة الصوتية وتحديد مواضع السماعات لتجنب الصدى في العنابر العالية",
            "تثبيت 180 سماعة هورن وسقفية عالية الكفاءة على الجمالونات والمسارات المعدنية",
            "توزيع وموازنة 8 مناطق صوتية مستقلة (Zones) مع محطات نداء تعمل باللمس",
            "ربط نظام الإذاعة الصوتية بلوحة إنذار الحريق لتجاوز الصوت العادي فوراً وبث إشارات الإخلاء",
            "معايرة جودة الصوت باستخدام أجهزة قياس مؤشر نقل الكلام STI"
          ],
          deliveryYear: "أكتوبر 2023",
          handoverCertificate: "محضر فحص صوتي معتمد واختبار تكامل مع إنذار الحريق",
          consultantName: "مكتب الاستشارات الهندسية للمستودعات اللوجستية",
          isFieldRealPhoto: true,
          description: "تجهيز 4 مستودعات تخزين كبرى بنظام إذاعة داخلية متعدد الزونات (Multi-Zone Public Address) لنشر التعليمات ونداء العمال، مع تكامل كامل مع لوحة إنذار الحريق المركزية.",
          impactMetrics: [
            { label: "عدد السماعات المنفذة", value: "180 سماعة هورن وسقفية" },
            { label: "المناطق الصوتية المستقلة", value: "8 زونات صوتية منفصلة" },
            { label: "وضوح الصوت والنداء", value: "STI > 0.68 مطابق للمعايير" }
          ],
          technicalSpecs: [
            { label: "نوع السماعات", value: "High-Efficiency Weatherproof Horn & Coaxial" },
            { label: "مضخمات الصوت", value: "Class-D Energy Efficient 100V Amplifiers" },
            { label: "محطات النداء", value: "IP Touchscreen Paging Consoles with Chime" },
            { label: "تكامل الطوارئ", value: "Priority Fire Alarm Voice Override Matrix" }
          ],
          image: PROJECT_SOUND_SITE
        }
      ]
    },
    configurator: {
      sectionKicker: "دراسة وتوصيف المقايسة الأولية",
      heading: "حاسبة ومحدد مقايسة أنظمة التيار الخفيف",
      subheading: "حدد نوع منشأتك ومساحتها واختر الأنظمة المطلوبة للحصول على تقدير فني فوري لبنود ومكونات المشروع.",
      facilityTypeLabel: "نوع المنشأة أو المبنى",
      facilityTypes: [
        { id: "office", label: "مبنى إداري أو مقر شركة" },
        { id: "factory", label: "مصنع أو مستودع لوجستي" },
        { id: "hospital", label: "مستشفى أو مركز طبي" },
        { id: "hotel", label: "فندق أو منتجع سياحي" },
        { id: "compound", label: "مجمع سكني (كومباوند)" },
        { id: "mall", label: "مول أو مركز تجاري" }
      ],
      scaleLabel: "المساحة التقريبية للمنشأة (بالمتر المربع)",
      scaleUnit: "متر مربع (م²)",
      modulesTitle: "الأنظمة المطلوبة بالمشروع (اختر الأنظمة المناسبة):",
      modules: [
        { id: "cctv", label: "كاميرات المراقبة (CCTV)", desc: "كاميرات 4K داخلية وخارجية مع جهاز تسجيل NVR وشاشات" },
        { id: "fire", label: "إنذار الحريق (Fire Alarm)", desc: "لوحة معنونة ذكية، كواشف دخان وحرارة، وسارينة إخلاء" },
        { id: "access", label: "التحكم في الدخول (Access Control)", desc: "بصمة وجه وأبواب مغناطيسية وبوابات مرور أفراد" },
        { id: "cabling", label: "كابلات الشبكات (Structured Cabling)", desc: "نقاط داتا Cat6A، كبائن خوادم، وروابط ألياف فايبر" },
        { id: "pbx", label: "السنترال الداخلي (IP PBX / Intercom)", desc: "هواتف مكتبية IP وشبكة اتصال داخلي موحدة" },
        { id: "pa", label: "الإذاعة الداخلية والصوتيات (PA System)", desc: "سماعات سقفية ومكبرات صوت لنظام النداء والموسيقى" },
        { id: "bms", label: "إدارة المباني الذكية (BMS)", desc: "أتمتة التكييف والإنارة ومراقبة استهلاك الطاقة" },
        { id: "sla", label: "عقد صيانة سنوي مدار (24/7 SLA)", desc: "زيارات وقائية دورية وتدخل طوارئ سريع مع قطع غيار" }
      ],
      resultTitle: "ملخص المواصفات والمقايسة الهندسية المبدئية",
      estCablingPoints: "نقاط الشبكة والبيانات المقترحة",
      estCameras: "كاميرات المراقبة المقترحة",
      estDoors: "الأبواب المؤمنة بالـ Access Control",
      estTimeline: "المدة الزمنية المتوقعة للتنفيذ",
      applyCta: "طلب مقايسة تفصيلية ومعاينة ميدانية مجانية للموقع",
      disclaimer: "* هذه الحسابات استرشادية لتقدير الحجم الهندسي للمشروع؛ يقوم مهندسونا بمعاينة المخططات المعمارية وتفقد الموقع لتقديم عرض أسعار ومقايسة فنية دقيقة."
    },
    partners: {
      sectionKicker: "الموردون وشركاء التكنولوجيا",
      heading: "نتعامل مع كبرى العلامات العالمية المعتمدة في أنظمة التيار الخفيف",
      subheading: "توريد وتكامل معتمد لكبرى الماركات المصنعة لأنظمة الكاميرات والإنذار والشبكات.",
      brands: [
        "Hikvision / Dahua",
        "Schneider / Cisco",
        "Honeywell / Notifier",
        "Legrand / Panduit",
        "ZKTeco / Suprema",
        "Grandstream / Yealink"
      ]
    },
    contact: {
      sectionKicker: "ابدأ مشروعك اليوم",
      heading: "تواصل معنا",
      subheading: "سواء كنت تؤسس مقراً جديداً، أو ترغب في تحديث شبكة الكاميرات والإنذار، أو تحتاج إلى عقد صيانة SLA لمنشأتك، نحن مستعدون لمعاينة الموقع فوراً.",
      officeTitle: "المقر الرئيسي للإدارة الهندسية",
      officeAddress: "مدينة نصر، القاهرة، جمهورية مصر العربية",
      phonesTitle: "أرقام التواصل المباشرة والمهندسين",
      phonePrimary: "+20 100 719 6485",
      phoneSecondary: "+20 120 072 8006",
      emailTitle: "البريد الإلكتروني الرسمي للمقايسات",
      emailAddress: "info@egyptge.com",
      hoursTitle: "مواعيد العمل الرسمية",
      hoursValue: "السبت - الخميس: 9:00 ص - 6:00 م (خدمة الدعم الميداني للطوارئ 24/7 لعملاء عقود الصيانة SLA)",
      whatsAppAction: "تواصل عبر واتساب فوراً لمقايسة سريعة",
      form: {
        nameLabel: "الاسم الكامل / اسم المسؤول",
        namePlaceholder: "م. أحمد عبد الرحمن",
        emailLabel: "البريد الإلكتروني للعمل",
        emailPlaceholder: "name@company.com",
        phoneLabel: "رقم الهاتف / واتساب",
        phonePlaceholder: "010XXXXXXXX",
        serviceLabel: "الأنظمة المطلوبة أو موضوع الاستفسار",
        servicePlaceholder: "مثال: مقايسة كاميرات مراقبة وشبكات لمقر جديد",
        messageLabel: "تفاصيل المشروع وموقع المعاينة",
        messagePlaceholder: "يرجى ذكر موقع المبنى، عدد الأدوار التقريبي، الأنظمة المطلوبة، وأي اشتراطات خاصة بالدفاع المدني أو الجودة...",
        submitBtn: "إرسال طلب المقايسة والمعاينة",
        submitting: "جاري إرسال الطلب...",
        successTitle: "تم استلام طلب المقايسة بنجاح!",
        successMsg: "شكراً لتواصلك مع شركة مصر لأنظمة التيار الخفيف. سيقوم مهندس المشروعات بالتواصل معك هاتفياً خلال ساعات لتحديد موعد المعاينة ومراجعة الرسومات الهندسية.",
        errorRequired: "يرجى ملء هذا الحقل المطلوب",
        errorEmail: "يرجى إدخال عنوان بريد إلكتروني صحيح",
        errorPhone: "يرجى إدخال رقم هاتف صحيح"
      },
      mapTitle: "المقر الرئيسي بمدينة نصر - القاهرة",
      mapDesc: "موقع مركزي بمدينة نصر لسرعة الانتشار وخدمة المشروعات في القاهرة الكبرى والمدن الصناعية الجديدة والمحافظات.",
      openInMaps: "فتح الموقع في خرائط جوجل"
    },
    footer: {
      about: "شركة مصر لأنظمة التيار الخفيف والتكنولوجيا (تأسست 2014، بخبرات هندسية ممتدة منذ 1980) رائدة في تصميم وتوريد وتركيب وصيانة أنظمة التيار الخفيف CCTV، إنذار الحريق، التحكم في الدخول، الشبكات، والسنترالات في مصر.",
      quickLinks: "روابط الموقع",
      systemsTitle: "أنظمة التيار الخفيف",
      rights: "جميع الحقوق محفوظة © شركة مصر لأنظمة التيار الخفيف والتكنولوجيا (Egypt GE) 2026",
      crNumber: "سجل تجاري وبطاقة ضريبية معتمدة | مدينة نصر، القاهرة",
      backToTop: "العودة للأعلى"
    }
  },
  en: {
    meta: {
      title: "Egypt Low Current Systems & Technology Solutions | Egypt GE",
      description: "Leading Low Current Systems contractor in Egypt: IP CCTV surveillance, addressable fire alarm, biometric access control, structured cabling, IP PBX, and 24/7 SLA contracts."
    },
    brand: {
      name: "Egypt Green Energy L.L.C",
      tagline: "Integrated Low Current & ELV Technology Solutions Division",
      subtext: "Turnkey Enterprise Security, Telecommunications & Smart Infrastructure"
    },
    nav: {
      home: "Home",
      about: "About Us",
      systems: "Low Current Systems",
      projects: "Projects",
      configurator: "BOQ Estimator",
      contact: "Contact",
      ctaButton: "Request BOQ",
      langToggle: "العربية"
    },
    hero: {
      kicker: "Engineering & Contracting Heritage Since 1980 Across Egypt (Over 46 Years Legacy, Incorporated 2014)",
      title: "Turnkey Low Current Systems & Smart Infrastructure Engineering",
      highlight: "Low Current Systems",
      subtitle: "We engineer, commission, and maintain end-to-end Low Current (ELV) solutions: 4K IP CCTV surveillance, addressable fire alarm, biometric access control, structured cabling & fiber optics, IP telephony, and building management systems (BMS) with 24/7 managed SLA support.",
      ctaPrimary: "Request Technical BOQ & Site Survey",
      ctaSecondary: "Explore Low Current Systems",
      trustBullet1: "68+ Turnkey Facility Installations with Handover Records",
      trustBullet2: "NFPA 72 & TIA-942 and Egyptian Code Compliant",
      trustBullet3: "24/7 SLA Engineering Support"
    },
    stats: {
      projectsCount: "68+",
      projectsLabel: "Completed ELV Installations",
      projectsDesc: "Across corporate towers, industrial plants, hospitals, and compounds with handover certs",
      satisfactionRate: "92%",
      satisfactionLabel: "Client Approval Rate",
      satisfactionDesc: "Rigorous adherence to technical submittals, testing, and commissioning without delays",
      heritageYears: "46+",
      heritageLabel: "Years Engineering Heritage",
      heritageDesc: "Operational engineering pedigree dating back to 1980, formalized in 2014",
      systemsCount: "8+",
      systemsLabel: "Integrated System Disciplines",
      systemsDesc: "From CCTV & Fire Alarm to Structured Cabling, PBX, and Smart BMS"
    },
    about: {
      sectionKicker: "Corporate Pedigree & Field Experience",
      heading: "Engineering Excellence in Low Current & Smart Building Tech",
      subheading: "Incorporated in 2014 upon four decades of operational engineering, contracting, and project management expertise dating back to 1980 (Over 46 years of cumulative expertise among founders and engineering team).",
      p1: "Egypt Green Energy L.L.C — Low Current & ELV Systems Division serves as the trusted engineering contractor for leading corporations, real estate developers, and industrial operators in Egypt. We deliver complete turnkey solutions: system design, CAD shop drawings, procurement, cabling, device termination, software commissioning, and certified testing.",
      p2: "We specialize in converging all Extra Low Voltage (ELV) disciplines—surveillance, life safety, access gates, enterprise networking, and acoustics—into unified centralized control room architectures backed by high-availability power and managed SLA support.",
      visionTitle: "Our Vision",
      visionText: "To stand as Egypt and the region's benchmark engineering contractor for intelligent low current systems, electronic security, and mission-critical network infrastructure.",
      missionTitle: "Our Mission",
      missionText: "To safeguard, connect, and automate facilities with certified global low current technologies, delivering prompt field engineering response and proactive maintenance that prevents unplanned downtime.",
      timelineTitle: "Historical Milestones",
      timelineSub: "46 years of engineering pedigree (1980 - 2026) to intelligent technology leadership",
      timeline: [
        {
          year: "1980",
          title: "Engineering Foundation",
          description: "Initiated electrical engineering contracting and project management across Egypt.",
          highlight: "Over 46 years of technical discipline and execution integrity"
        },
        {
          year: "2005",
          title: "Telecommunications & Security Division",
          description: "Established dedicated unit for enterprise data networks, telephony, and early analogue CCTV.",
          highlight: "Building early commercial fiber optic backbones"
        },
        {
          year: "2014",
          title: "Formal Corporate Incorporation",
          description: "Incorporated Egypt Green Energy (Egypt GE) as an integrated technological engineering entity.",
          highlight: "Strategic expansion into institutional and enterprise facilities"
        },
        {
          year: "2018",
          title: "IP Video & Addressable Fire Safety Scale",
          description: "Delivered large-scale 4K IP surveillance networks and addressable fire alarm systems across industrial zones.",
          highlight: "Vendor certified partnerships and civil defense approvals"
        },
        {
          year: "2021",
          title: "Remote & Mission-Critical Infrastructure",
          description: "Equipped remote outposts in Siwa, Matrouh, and industrial corridors with autonomous low current and telecom.",
          highlight: "Resilient solutions engineered for demanding desert environments"
        },
        {
          year: "2026",
          title: "Smart BMS & IoT Integration",
          description: "Converged building automation, access speed gates, and cloud-linked 24/7 SLA emergency maintenance.",
          highlight: "68+ landmark installations and growing regional presence"
        }
      ],
      valuesTitle: "Core Engineering Standards",
      values: [
        {
          title: "Code Compliance",
          desc: "Full conformance with NFPA 72 life safety, TIA/EIA cabling standards, and Egyptian Civil Defense codes."
        },
        {
          title: "Complete Convergence",
          desc: "Integrating cameras, access turnstiles, fire alarms, and network data into single-pane management consoles."
        },
        {
          title: "High-Availability Reliability",
          desc: "Industrial-grade hardware with redundant UPS backup and transient surge suppression."
        },
        {
          title: "Rapid Field Response",
          desc: "Dedicated engineering mobile units providing under 2-hour emergency arrival for SLA clients."
        }
      ]
    },
    systems: {
      sectionKicker: "Specialized Disciplines",
      heading: "Comprehensive Low Current (ELV) Systems",
      subheading: "Complete suite of intelligent technologies designed to protect, connect, and automate enterprise environments.",
      exploreDetails: "Technical Specifications & Bill of Materials",
      backToList: "Back to Systems",
      requestQuote: "Request BOQ for this System",
      categories: {
        all: "All Systems",
        security: "Security & Video",
        safety: "Fire Alarm & Safety",
        connectivity: "Networks & Cabling",
        audioBms: "Audio & Smart BMS",
        maintenance: "24/7 SLA Contracts"
      },
      items: [
        {
          id: "cctv-surveillance",
          category: "security",
          title: "CCTV & IP Video Surveillance Systems",
          subtitle: "4K ultra HD IP cameras, AI-driven video content analytics (VCA), and NOC video walls",
          description: "Turnkey IP surveillance networks for enterprise headquarters, factories, logistics parks, and retail centers. Includes high-performance indoor/outdoor cameras, edge AI video analytics, redundant NVR/SAN storage arrays, and control room video walls.",
          features: [
            "4MP to 4K ultra HD resolution with true ColorVu / dark-fighter night clarity",
            "AI edge analytics: License Plate Recognition (LPR), virtual perimeter tripwire, and facial capture",
            "Hardware RAID storage topologies supporting 30 to 180 days of continuous retention",
            "Encrypted multi-client desktop control rooms and mobile viewing clients"
          ],
          specs: [
            { label: "Imaging Resolution", value: "Up to 4K UHD 3840x2160 @ 30fps" },
            { label: "Compression", value: "H.265+ saving up to 70% bandwidth/storage" },
            { label: "Durability Rating", value: "IP67 weather resistance / IK10 vandal-proof" }
          ],
          image: CCTV_IMAGE,
          badge: "4K VCA / CCTV"
        },
        {
          id: "fire-alarm",
          category: "safety",
          title: "Addressable Fire Alarm & Life Safety",
          subtitle: "Intelligent addressable panels, multi-sensor detectors, and voice evacuation systems",
          description: "Life-safety fire detection networks protecting assets and occupants. We engineer, wire, and commission addressable control panels, smoke/heat detectors, manual pull stations, and automated voice alarm evacuation systems compliant with civil defense requirements.",
          features: [
            "Networked addressable panels pin-pointing alarm location by floor, zone, and device number",
            "Advanced multi-criteria detectors minimizing false triggers with self-diagnostic drift compensation",
            "Automatic interfaced relays shutting down HVAC dampers and grounding elevators upon alarm",
            "Strict compliance with NFPA 72 standards and Egyptian Civil Protection authority specifications"
          ],
          specs: [
            { label: "System Architecture", value: "Analogue Addressable Fire Alarm Loop" },
            { label: "Trigger Response", value: "< 3 seconds confirmation" },
            { label: "Certification", value: "UL Listed / FM Approved / LPCB" }
          ],
          image: HERO_IMAGE,
          badge: "NFPA 72 Certified"
        },
        {
          id: "access-control",
          category: "security",
          title: "Access Control & Smart Turnstiles",
          subtitle: "Contactless facial recognition, RFID smart cards, and motorized speed gates",
          description: "Securing access points across corporate perimeters, server rooms, and executive floors. Features glass optical speed gates, high-speed facial recognition terminals, heavy-duty electromagnetic locks, and automated parking barrier gates.",
          features: [
            "Contactless facial recognition under 0.2s with mask and anti-spoofing detection",
            "Architectural optical speed gate turnstiles for corporate lobby entrance control",
            "Automated vehicle barrier gates with long-range UHF RFID tag windshield readers",
            "Centralized web-based management software for multi-level badge issuance and audit trails"
          ],
          specs: [
            { label: "User Database", value: "Up to 50,000 faces / card holders" },
            { label: "Magnetic Locking", value: "600 - 1200 lbs holding force" },
            { label: "Interface Standards", value: "Wiegand / OSDP Secure / TCP/IP" }
          ],
          image: ACCESS_IMAGE,
          badge: "Biometric Access"
        },
        {
          id: "structured-cabling",
          category: "connectivity",
          title: "Structured Cabling & Fiber Optic Networks",
          subtitle: "Certified Cat6 / Cat6A / Cat7 copper cabling and multi-core fiber backbones with Fluke testing",
          description: "The physical backbone for all digital voice, video, and data communication. Turnkey installation of horizontal UTP/FTP cabling, server racks, patch panels, wire managers, and inter-building single-mode/multi-mode fiber optics.",
          features: [
            "Laser-straight cable management and comprehensive labeling for rapid troubleshooting",
            "Fusion splicing and OTDR testing of armored fiber backbones across facilities",
            "Official Fluke DSX-8000 certification test reports supplied for each terminated drop",
            "Server racks equipped with intelligent PDUs, horizontal cable trays, and ventilation"
          ],
          specs: [
            { label: "Cable Categories", value: "Cat6 / Cat6A / Cat7 UTP & S/FTP" },
            { label: "Bandwidth Capacity", value: "Up to 10 Gbps Ethernet throughput" },
            { label: "Design Standards", value: "TIA/EIA-568-C / ISO/IEC 11801" }
          ],
          image: CABLING_IMAGE,
          badge: "Cat6A / Fiber"
        },
        {
          id: "ip-telephony",
          category: "connectivity",
          title: "IP PBX & Unified Voice Telephony",
          subtitle: "Enterprise IP PBX switches, executive desktop phones, and video intercoms",
          description: "Unified enterprise voice communications connecting corporate headquarters, branches, and remote facilities. Features SIP trunking, automated multi-level IVR, call recording, and seamless mobile softphone extension roaming.",
          features: [
            "High-capacity IP PBX servers supporting hybrid analog, ISDN, and native SIP trunks",
            "HD voice desktop IP telephones with Gigabit Ethernet passthrough and PoE",
            "Commercial IP video intercom stations with remote door release via phone or tablet",
            "Zero-cost inter-branch dialing uniting geographically distributed facilities"
          ],
          specs: [
            { label: "System Scalability", value: "From 10 extensions up to 2,000 users" },
            { label: "Protocol Benchmark", value: "SIP RFC3261 Standard" },
            { label: "CRM Integration", value: "Direct click-to-dial for Salesforce & Microsoft" }
          ],
          image: DATACENTER_IMAGE,
          badge: "VoIP / IP-PBX"
        },
        {
          id: "public-address",
          category: "audio-bms",
          title: "Public Address & Background Sound (PA/BGM)",
          subtitle: "Ceiling & column loudspeakers, multi-zone paging matrix, and emergency override",
          description: "Distributed audio infrastructure for commercial offices, hospitals, factories, and retail malls. Supports pleasant background music (BGM), selective multi-zone paging announcements, and automatic emergency fire alarm takeover.",
          features: [
            "Acoustically tuned flush-mount ceiling speakers and rugged outdoor column speakers",
            "Zoned paging microphones enabling announcements to specific production floors or wings",
            "Class-D energy-efficient 100V amplifiers with thermal overload and short-circuit protection",
            "Emergency fire alarm interface that automatically mutes BGM and broadcasts evacuation tones"
          ],
          specs: [
            { label: "Line Voltage", value: "70V / 100V Constant Voltage Line" },
            { label: "Zone Matrix", value: "4 to 32 independent audio zones" },
            { label: "Life Safety Norm", value: "EN 54-24 Voice Alarm Compliant" }
          ],
          image: HERO_IMAGE,
          badge: "PA / Sound System"
        },
        {
          id: "bms-automation",
          category: "audio-bms",
          title: "Building Management Systems (BMS & Smart Building)",
          subtitle: "HVAC automation, lighting control, energy metering, and critical UPS telemetry",
          description: "Centralized monitoring and automation uniting HVAC chillers, air handling units, pumps, lighting, and electrical panels into an intuitive supervisory control dashboard. Cuts facility operating expenses by up to 30%.",
          features: [
            "Graphical web-based supervisor displaying real-time status of all mechanical/electrical assets",
            "Automated scheduling and setpoint adjustments based on occupancy and ambient conditions",
            "Real-time monitoring of main circuit breakers, diesel generator fuel, and UPS batteries",
            "Seamless integration with clean energy microgrids and emergency solar power feeds"
          ],
          specs: [
            { label: "Protocols", value: "Native BACnet / Modbus TCP / KNX / LonWorks" },
            { label: "Energy Reduction", value: "18% - 32% annual utility savings" },
            { label: "User Interface", value: "HTML5 Web SCADA & mobile alerts" }
          ],
          image: DATACENTER_IMAGE,
          badge: "BMS / IoT"
        },
        {
          id: "sla-maintenance",
          category: "maintenance",
          title: "Managed Services & 24/7 Maintenance Contracts (SLA)",
          subtitle: "Preventive health audits, rapid field intervention, and spare parts management",
          description: "Comprehensive annual maintenance agreements ensuring all low current systems operate at peak readiness. Backed by contracted mean-time-to-respond SLAs, monthly scheduled servicing, and on-call field technicians.",
          features: [
            "Certified engineering teams on standby 24/7/365 for emergency dispatches",
            "Scheduled monthly camera cleaning, fire detector testing, and server rack grooming",
            "Readily staged spares and critical hot-swap units deployed immediately during failures",
            "Monthly transparent digital audit reports with health ratings and lifecycle recommendations"
          ],
          specs: [
            { label: "Emergency Response", value: "< 2 hours on-site in Greater Cairo" },
            { label: "Hotline Support", value: "24/7/365 dedicated engineering desk" },
            { label: "Contract SLA Rate", value: "99.4% historical achievement rate" }
          ],
          image: CABLING_IMAGE,
          badge: "24/7 SLA Support"
        }
      ]
    },
    projects: {
      sectionKicker: "Demonstrated Field Track Record",
      heading: "Featured Low Current Projects & Case Studies",
      subheading: "Over 68 completed installations across Egypt demonstrating our turnkey execution capability in commercial, industrial, and healthcare facilities.",
      filterAll: "All Projects",
      filterSurveillance: "CCTV & Security",
      filterNetworks: "Data Networks",
      filterSafety: "Fire Alarm & Safety",
      filterSmartBms: "Smart BMS & Control",
      viewDetails: "View Project Specifications",
      closeModal: "Close Details",
      locationLabel: "Location",
      yearLabel: "Year",
      clientLabel: "Sector",
      items: [
        {
          id: "cairo-business-park-cctv",
          title: "Corporate Headquarters Turnkey CCTV & Access Control",
          category: "surveillance",
          categoryLabel: "CCTV & Security",
          location: "New Cairo, Egypt",
          year: "2024",
          clientType: "Commercial & Investment Complex",
          clientName: "Capital Asset Management & Real Estate Investment Corp.",
          scopeOfWork: [
            "Architectural CAD reviews and camera field-of-view engineering",
            "Procurement and installation of 160 4K IP cameras with edge facial and LPR analytics",
            "Installation of 18 optical speed gates with biometric facial recognition terminals",
            "Central control center outfitting with 6-screen video wall and RAID 6 storage",
            "Operator handover and formal commissioning certification"
          ],
          deliveryYear: "March 2024",
          handoverCertificate: "Approved Preliminary Handover & 100% Security Inspection Certificate",
          consultantName: "General MEP Engineering Consultant",
          isFieldRealPhoto: true,
          description: "Full engineering and installation of 160 4K IP cameras with edge facial analytics, 18 optical turnstile speed gates, redundant NVR server racks, and an ultra-narrow bezel 6-screen video wall.",
          impactMetrics: [
            { label: "Field Cameras Installed", value: "160 4K IP Cameras" },
            { label: "Speed Gate Turnstiles", value: "18 Optical Lanes" },
            { label: "Retention Archive", value: "90 Days Continuous RAID 6" }
          ],
          technicalSpecs: [
            { label: "Video Hardware", value: "4K DarkFighter with VCA AI DeepinMind" },
            { label: "Storage", value: "Dual NVR 64-Channel Redundant Hot-Spare" },
            { label: "Access Verification", value: "Biometric Face Recognition + Mifare RFID" },
            { label: "Monitoring Console", value: "Video Wall 6x 55-inch Ultra-Narrow Bezel" }
          ],
          image: PROJECT_CCTV_SITE
        },
        {
          id: "industrial-cabling-datacenter",
          title: "Industrial Manufacturing Plant Structured Cabling & Fiber",
          category: "networks",
          categoryLabel: "Data Networks",
          location: "10th of Ramadan Industrial City, Egypt",
          year: "2023",
          clientType: "Heavy Manufacturing Facility",
          clientName: "Engineering Industries & Cable Manufacturing Group",
          scopeOfWork: [
            "Electromagnetic interference isolated cable routing and heavy-duty cable trays",
            "Pulling, labeling, and termination of 950 Cat6A drops for manufacturing lines and offices",
            "Laying 4.5 km of single-mode 12-core armored fiber across 6 factory hangars",
            "Mounting 4x 42U server racks with smart monitored PDUs",
            "Comprehensive Fluke DSX-8000 channel testing with official warranty submittals"
          ],
          deliveryYear: "November 2023",
          handoverCertificate: "Certified Fluke Channel Test Report & 25-Year Manufacturer System Warranty",
          consultantName: "Industrial Engineering & Infrastructure Advisory",
          isFieldRealPhoto: true,
          description: "Deployment of an enterprise Cat6A structured network comprising 950 drops across 6 manufacturing hangars connected to a central data room via armored 12-core single-mode fiber with Fluke certification.",
          impactMetrics: [
            { label: "Terminated Drops", value: "950 Cat6A Data Outlets" },
            { label: "Fiber Backbone", value: "4.5 km Armored Fiber" },
            { label: "Network Bandwidth", value: "10 Gbps Redundant Ring" }
          ],
          technicalSpecs: [
            { label: "Horizontal Cable", value: "Cat6A Shielded LSZH Fluke Certified" },
            { label: "Fiber Backbone", value: "Single-Mode 12-Core Heavy Armored" },
            { label: "Enclosures", value: "4x 42U Server Racks with Smart Monitored PDU" },
            { label: "Switching", value: "Managed Layer-3 PoE+ Enterprise Switches" }
          ],
          image: PROJECT_CABLING_SITE
        },
        {
          id: "hospital-fire-addressable",
          title: "Specialized Hospital Addressable Fire Alarm & Voice Evacuation",
          category: "safety",
          categoryLabel: "Fire Alarm & Safety",
          location: "Nasr City, Cairo, Egypt",
          year: "2023",
          clientType: "Healthcare Facility",
          clientName: "Al-Safwa Specialized Surgical Hospital & Medical Complex",
          scopeOfWork: [
            "Preparation of Egyptian Fire Code & NFPA 72 compliant shop drawings",
            "Procurement and installation of 4 networked addressable fire panels with touch displays",
            "Deployment of 850+ smoke, heat, and optical laser sensors across ICU and operating suites",
            "Automated dual-language Arabic/English multi-zone voice alarm evacuation",
            "Tripping interlocks with building HVAC, elevator grounding, and emergency exits",
            "On-site evacuation drill supervision and Civil Defense final approval certificate"
          ],
          deliveryYear: "August 2023",
          handoverCertificate: "Official Egyptian Civil Defense Final Approval & Safety Certificate",
          consultantName: "Certified Fire Protection & Life Safety Consultant",
          isFieldRealPhoto: true,
          description: "Engineering and commissioning of a 4-panel networked addressable fire alarm network monitoring 850 detectors and manual stations, coupled with automated multi-zone voice evacuation meeting Egyptian Civil Defense codes.",
          impactMetrics: [
            { label: "Addressable Devices", value: "850+ Smoke/Heat Detectors" },
            { label: "Control Panels", value: "4 Networked Addressable Units" },
            { label: "Civil Defense", value: "100% Certified Approval Valid" }
          ],
          technicalSpecs: [
            { label: "Standard", value: "NFPA 72 & Egyptian Fire Code" },
            { label: "Cabling", value: "Fire Rated 2x1.5mm 180 Min Certified" },
            { label: "Acoustics", value: "Multi-Zone Automated Voice Alarm 24V" },
            { label: "Interlocks", value: "Automated HVAC shutdown & emergency gate release" }
          ],
          image: PROJECT_FIRE_SITE
        },
        {
          id: "corporate-tower-bms",
          title: "Smart Tower BMS Automation & Unified Cloud PBX",
          category: "smart-bms",
          categoryLabel: "Smart BMS & Control",
          location: "Financial District, Cairo, Egypt",
          year: "2024",
          clientType: "Commercial Smart Tower",
          clientName: "Smart Towers & Integrated Commercial Parks Development",
          scopeOfWork: [
            "DDC controller and SCADA automation programming over BACnet/IP",
            "Full telemetry interface for chillers, AHUs, power distribution, and backup generators",
            "Field installation of 2,200 sensing points for thermal, air pressure, and power meters",
            "Deployment of dual hot-standby IP PBX telephony serving 400 extensions",
            "3-year contracted SLA with 24/7 remote monitoring and rapid dispatched support"
          ],
          deliveryYear: "May 2024",
          handoverCertificate: "Integrated Commissioning & Energy Efficiency Verification Protocol",
          consultantName: "General High-Rise Smart Building Advisory",
          isFieldRealPhoto: true,
          description: "Integration of HVAC, chillers, energy meters, and lighting into a central BACnet BMS console, paired with an IP PBX telephony network serving 400 extensions and a 24/7 SLA maintenance agreement.",
          impactMetrics: [
            { label: "Telemetry Nodes", value: "2,200 Sensor Points" },
            { label: "Energy Conservation", value: "24% Verified Bill Reduction" },
            { label: "VoIP Extensions", value: "400 Enterprise Seats" }
          ],
          technicalSpecs: [
            { label: "BMS Backbone", value: "Native BACnet/IP Open Architecture" },
            { label: "Telephony", value: "Dual Hot-Standby IP PBX Server" },
            { label: "Intercom", value: "SIP Video Intercom with Access Gateways" },
            { label: "Support Model", value: "24/7 Premium SLA with 2-Hour Response" }
          ],
          image: PROJECT_BMS_SITE
        },
        {
          id: "remote-facility-low-current",
          title: "Autonomous Low Current & Remote Perimeter Security in Siwa",
          category: "surveillance",
          categoryLabel: "CCTV & Security",
          location: "Siwa Oasis, Matrouh, Egypt",
          year: "2022",
          clientType: "Agricultural & Water Infrastructure",
          clientName: "Oasis Reclamation, Agro-Investment & Natural Oils Co.",
          scopeOfWork: [
            "Off-grid perimeter surveillance engineering in deep desert terrain",
            "Erection of 18-meter galvanized mast with long-range thermal and optical PTZ cameras",
            "12 km line-of-sight microwave link transmission to primary gateway",
            "Dedicated standalone solar array with gel battery cabinet and temperature control",
            "Satellite link telemetry for remote headquarters access in Cairo"
          ],
          deliveryYear: "December 2022",
          handoverCertificate: "Harsh Environment 99.9% Uptime Handover Report",
          consultantName: "Joint Energy & Security Systems Engineering Board",
          isFieldRealPhoto: true,
          description: "Off-grid low current installation featuring long-range thermal/optical PTZ cameras, wireless microwave data links spanning 12 km, and access gates powered autonomously by integrated solar backup.",
          impactMetrics: [
            { label: "Perimeter Security", value: "360° Thermal & Optical Coverage" },
            { label: "Wireless Reach", value: "12 km Microwave Link" },
            { label: "Power Autonomy", value: "100% Self-Powered Solar Array" }
          ],
          technicalSpecs: [
            { label: "Camera Hardware", value: "Long-Range Thermal + Optical PTZ 40x" },
            { label: "Data Transport", value: "Point-to-Point 5GHz Carrier Grade Microwave" },
            { label: "Power Architecture", value: "Independent Solar DC Array & Smart AGM Pack" },
            { label: "Management", value: "Satellite Uplink for Remote Cairo Monitoring" }
          ],
          image: PROJECT_SIWA_SITE
        },
        {
          id: "giza-logistics-pa-sound",
          title: "Multi-Zone Public Address & Acoustic Paging at Logistics Center",
          category: "smart-bms",
          categoryLabel: "Smart BMS & Control",
          location: "Industrial Zone, Giza, Egypt",
          year: "2023",
          clientType: "International Logistics Center",
          clientName: "National Logistics Services & Cold Storage Distribution",
          scopeOfWork: [
            "Electro-acoustic modeling to prevent echo in high-ceiling distribution bays",
            "Mounting 180 high-efficiency horn and coaxial ceiling speakers on trusses",
            "8-zone matrix configuration with tactile touchscreen paging consoles",
            "Direct priority hardwire relay with fire alarm control panel for emergency evacuation",
            "Acoustic commissioning and speech transmission index (STI) certification"
          ],
          deliveryYear: "October 2023",
          handoverCertificate: "Certified Electro-Acoustic STI Audit & Fire System Integration Protocol",
          consultantName: "Logistics Facilities MEP Advisory",
          isFieldRealPhoto: true,
          description: "Equipping 4 distribution hangars with an 8-zone 100V public address and acoustic paging system with touchscreen paging stations and automatic fire alarm override.",
          impactMetrics: [
            { label: "Installed Speakers", value: "180 Horn & Ceiling Speakers" },
            { label: "Paging Zones", value: "8 Independent Audio Zones" },
            { label: "Speech Clarity", value: "STI > 0.68 Certified Standard" }
          ],
          technicalSpecs: [
            { label: "Transducers", value: "High-Efficiency Weatherproof Horn & Coaxial" },
            { label: "Amplification", value: "Class-D Energy Efficient 100V Amplifiers" },
            { label: "Microphones", value: "IP Touchscreen Paging Consoles with Chime" },
            { label: "Safety Hook", value: "Priority Fire Alarm Voice Override Matrix" }
          ],
          image: PROJECT_SOUND_SITE
        }
      ]
    },
    configurator: {
      sectionKicker: "Technical BOQ Estimator",
      heading: "Low Current System Scope & BOQ Configurator",
      subheading: "Select your facility type, estimated area, and required systems to generate an immediate engineering scope estimate.",
      facilityTypeLabel: "Facility or Property Type",
      facilityTypes: [
        { id: "office", label: "Corporate Office Building" },
        { id: "factory", label: "Factory or Logistics Warehouse" },
        { id: "hospital", label: "Hospital or Medical Center" },
        { id: "hotel", label: "Hotel or Tourist Resort" },
        { id: "compound", label: "Residential Gated Compound" },
        { id: "mall", label: "Shopping Mall / Retail Center" }
      ],
      scaleLabel: "Approximate Facility Floor Area (m²)",
      scaleUnit: "m²",
      modulesTitle: "Select Required Low Current Disciplines:",
      modules: [
        { id: "cctv", label: "IP CCTV Surveillance", desc: "4K indoor/outdoor IP cameras with NVR and display" },
        { id: "fire", label: "Addressable Fire Alarm", desc: "Intelligent panel, smoke/heat detectors, and sirens" },
        { id: "access", label: "Access Control & Turnstiles", desc: "Facial terminals, magnetic locks, and speed gates" },
        { id: "cabling", label: "Structured Cabling", desc: "Cat6A drops, server rack enclosures, and fiber links" },
        { id: "pbx", label: "IP PBX & Intercom", desc: "Desktop IP phones and internal intercom calling" },
        { id: "pa", label: "Public Address (PA/BGM)", desc: "Ceiling speakers, amplifiers, and zoned paging" },
        { id: "bms", label: "Smart BMS Automation", desc: "HVAC and energy monitoring supervisor console" },
        { id: "sla", label: "Managed 24/7 SLA Contract", desc: "Routine preventive maintenance and rapid emergency response" }
      ],
      resultTitle: "Preliminary Engineering Bill of Materials (BOQ)",
      estCablingPoints: "Estimated Data / Voice Drops",
      estCameras: "Estimated IP Camera Density",
      estDoors: "Access Controlled Portals",
      estTimeline: "Estimated Execution Duration",
      applyCta: "Request Full Itemized Technical BOQ & Free Site Survey",
      disclaimer: "* Estimates are generated for initial project scoping. Our engineering team will review your architectural drawings and conduct an on-site survey before issuing a formal quotation."
    },
    partners: {
      sectionKicker: "Certified Technology Brands",
      heading: "We Partner With Global Leaders in Low Current & ELV Systems",
      subheading: "Authorized supply and integration of world-class certified hardware.",
      brands: [
        "Hikvision / Dahua",
        "Schneider / Cisco",
        "Honeywell / Notifier",
        "Legrand / Panduit",
        "ZKTeco / Suprema",
        "Grandstream / Yealink"
      ]
    },
    contact: {
      sectionKicker: "Start Your Project",
      heading: "Contact Us",
      subheading: "Whether you are fitting out a new corporate tower, upgrading surveillance and fire safety, or requiring an SLA maintenance contract, our team is ready to inspect your site.",
      officeTitle: "Engineering Headquarters",
      officeAddress: "Nasr City, Cairo, Arab Republic of Egypt",
      phonesTitle: "Direct Project Line & Engineering Team",
      phonePrimary: "+20 100 719 6485",
      phoneSecondary: "+20 120 072 8006",
      emailTitle: "Official Technical Inquiries Email",
      emailAddress: "info@egyptge.com",
      hoursTitle: "Business Hours",
      hoursValue: "Saturday - Thursday: 9:00 AM - 6:00 PM (24/7 Emergency response for contracted SLA clients)",
      whatsAppAction: "WhatsApp Direct for Fast BOQ",
      form: {
        nameLabel: "Full Name & Designation",
        namePlaceholder: "Eng. Ahmed Abdelrahman",
        emailLabel: "Corporate Email",
        emailPlaceholder: "name@company.com",
        phoneLabel: "Phone / WhatsApp",
        phonePlaceholder: "+20 10XXXXXXXX",
        serviceLabel: "Requested Systems / Inquiry Scope",
        servicePlaceholder: "e.g. Turnkey CCTV, Fire Alarm & Cabling BOQ",
        messageLabel: "Project Scope & Site Details",
        messagePlaceholder: "Please describe your building location, number of floors, target systems, or specific civil defense compliance deadlines...",
        submitBtn: "Submit BOQ & Site Survey Request",
        submitting: "Submitting Request...",
        successTitle: "BOQ Request Successfully Received!",
        successMsg: "Thank you for contacting Egypt Low Current & Tech Systems. An assigned project engineer will call you shortly to schedule an on-site technical inspection.",
        errorRequired: "This field is required",
        errorEmail: "Please provide a valid email address",
        errorPhone: "Please provide a valid phone number"
      },
      mapTitle: "Nasr City Headquarters, Cairo",
      mapDesc: "Centrally positioned in Nasr City for rapid technical dispatch across Greater Cairo, industrial cities, and regional governorates.",
      openInMaps: "Open in Google Maps"
    },
    footer: {
      about: "Egypt Low Current & Tech Systems (Egypt GE, incorporated in 2014 with engineering roots since 1980) is an Egyptian turnkey contractor specializing in IP CCTV, addressable fire alarm, access control, structured cabling, IP telephony, and managed SLA support.",
      quickLinks: "Navigation",
      systemsTitle: "Low Current Disciplines",
      rights: "All Rights Reserved © Egypt Low Current & Tech Systems (Egypt GE) 2026",
      crNumber: "Commercial Registration & Certified Tax Identification | Nasr City, Cairo, Egypt",
      backToTop: "Back to Top"
    }
  }
};
