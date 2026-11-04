/**
 * Curated High-Fidelity Engineering & Low-Current Stock Assets
 * Ready-to-use professional photos for CCTV, Data Centers, Fiber Optics,
 * Access Control, Fire Alarm, BMS Automation, and Renewable Energy.
 */

export interface StockEngineeringImage {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'cctv' | 'networks' | 'access' | 'fire' | 'bms' | 'datacenter' | 'solar' | 'hero';
  url: string;
  tags: string[];
}

export const STOCK_ENGINEERING_IMAGES: StockEngineeringImage[] = [
  // 1. CCTV & Surveillance
  {
    id: 'stock-cctv-1',
    titleAr: 'كاميرات مراقبة IP بانورامية ذكية',
    titleEn: 'Smart Panoramic IP CCTV Cameras',
    category: 'cctv',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1280&q=80',
    tags: ['cctv', 'surveillance', 'ip-camera', 'security'],
  },
  {
    id: 'stock-cctv-2',
    titleAr: 'غرفة تحكم ومراقبة أمنية متكاملة (Security SOC)',
    titleEn: 'Security Operations & Monitoring Room (SOC)',
    category: 'cctv',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80',
    tags: ['cctv', 'control-room', 'monitoring', 'screens'],
  },
  {
    id: 'stock-cctv-3',
    titleAr: 'كاميرات القبة الخارجية المقاومة للعوامل الجوية',
    titleEn: 'Vandal-proof Outdoor Dome Cameras',
    category: 'cctv',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1280&q=80',
    tags: ['cctv', 'dome', 'outdoor', 'security'],
  },

  // 2. Structured Cabling & Fiber Optics
  {
    id: 'stock-fiber-1',
    titleAr: 'كابلات ألياف ضوئية فائقة السرعة ولوحات توزيع',
    titleEn: 'High-Speed Fiber Optic Distribution & Patching',
    category: 'networks',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1280&q=80',
    tags: ['cabling', 'fiber-optic', 'network', 'telecom'],
  },
  {
    id: 'stock-network-2',
    titleAr: 'كابلات شبكات نحاسية Cat6A وترتيب احترافي',
    titleEn: 'Structured Copper Cabling Cat6A Management',
    category: 'networks',
    url: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?auto=format&fit=crop&w=1280&q=80',
    tags: ['cabling', 'cat6a', 'ethernet', 'patch-panel'],
  },

  // 3. Data Centers & Server Racks
  {
    id: 'stock-dc-1',
    titleAr: 'مركز بيانات وخوادم سحابية مؤمنة (Tier III)',
    titleEn: 'Tier III Cloud Data Center & Server Infrastructure',
    category: 'datacenter',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&q=80',
    tags: ['datacenter', 'servers', 'racks', 'infrastructure'],
  },
  {
    id: 'stock-dc-2',
    titleAr: 'ممرات تبريد كبائن السيرفرات والبنية التحتية',
    titleEn: 'Cold Aisle Server Cabinets & Cooling Corridor',
    category: 'datacenter',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1280&q=80',
    tags: ['datacenter', 'cabinets', 'servers'],
  },

  // 4. Access Control & Smart Gates
  {
    id: 'stock-access-1',
    titleAr: 'بوابات عبور إلكترونية ومصادقة بيومترية',
    titleEn: 'Biometric Turnstiles & Access Control Gates',
    category: 'access',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1280&q=80',
    tags: ['access-control', 'turnstile', 'biometric', 'rfid'],
  },
  {
    id: 'stock-access-2',
    titleAr: 'قارئات بصمة وبطاقات ذكية للأبواب الأمنية',
    titleEn: 'Smart Card & Fingerprint Door Access Readers',
    category: 'access',
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1280&q=80',
    tags: ['access-control', 'smart-lock', 'rfid'],
  },

  // 5. Fire Alarm & Life Safety
  {
    id: 'stock-fire-1',
    titleAr: 'لوحات إنذار حريق معنونة وحساسات استشعار',
    titleEn: 'Addressable Fire Alarm Panels & Optical Detectors',
    category: 'fire',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1280&q=80',
    tags: ['fire-alarm', 'smoke-detector', 'safety'],
  },

  // 6. BMS Automation & Smart Buildings
  {
    id: 'stock-bms-1',
    titleAr: 'أنظمة إدارة المباني الذكية ولوحات التحكم الآلي (BMS)',
    titleEn: 'Building Management Systems (BMS) Automation & IoT',
    category: 'bms',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80',
    tags: ['bms', 'smart-building', 'automation', 'iot'],
  },

  // 7. Renewable Energy & Solar Microgrids
  {
    id: 'stock-solar-1',
    titleAr: 'محطات طاقة كهروضوئية وميكروجريد متقدمة',
    titleEn: 'Advanced PV Solar Microgrids & Clean Power',
    category: 'solar',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1280&q=80',
    tags: ['solar', 'photovoltaic', 'renewable-energy', 'clean-power'],
  },
  {
    id: 'stock-solar-2',
    titleAr: 'منظومات الطاقة الشمسية وضخ المياه الصحراوية',
    titleEn: 'Solar Water Pumping & Desert Infrastructure',
    category: 'solar',
    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1280&q=80',
    tags: ['solar', 'water-pumping', 'desert-wells'],
  },

  // 8. Hero & Corporate Identity
  {
    id: 'stock-hero-1',
    titleAr: 'أبراج ذكية وتكنولوجيا المباني الحديثة (Corporate Hero)',
    titleEn: 'Smart Towers & Modern Corporate Architecture',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    tags: ['hero', 'architecture', 'smart-buildings'],
  },
  {
    id: 'stock-hero-2',
    titleAr: 'أفق تكنولوجي وأبراج العاصمة الإدارية الذكية',
    titleEn: 'High-Tech Urban Skyline & Intelligent Buildings',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80',
    tags: ['hero', 'skyline', 'technology'],
  },
];
