export interface HeroData {
  city_meta: string;
  year_meta: string;
  index_meta: string;
  eyebrow: string;
  name: string;
  discipline: string;
  lead: string;
  status: string;
  explore_btn_text: string;
  contact_btn_text: string;
}

export interface AboutData {
  index_meta: string;
  label: string;
  title: string;
  portrait_url: string;
  portrait_alt: string;
  portrait_caption: string;
  body_1: string;
  body_2: string;
  quote: string;
  quote_cite: string;
}

export interface StatItem {
  id?: string;
  number: string;
  label: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  upwork: string;
  telegram: string;
}

export interface PracticeItem {
  num: string;
  title: string;
  text: string;
}

export interface CurrentlyItem {
  kicker: string;
  text: string;
}

export interface ProjectItem {
  id: string;
  order: number;
  title: string;
  card_title: string;
  categories: string[];
  category_label: string;
  role: string;
  year?: string;
  description: string;
  card_desc?: string;
  image_url: string;
  images?: string[]; // Multiple images for smart auto-collages
  collage_layout?: 'auto' | 'split' | 'grid' | 'bento' | 'mosaic' | 'stack';
  focal_point?: string;
  badge?: string;
  award?: string;
  visible: boolean;
}

export interface CertificateItem {
  id: string;
  order: number;
  title: string;
  issuer: string;
  year: string;
  pdf_url: string;
  credential_url?: string;
  visible: boolean;
}

export interface LabItem {
  id: string;
  order: number;
  kicker: string;
  title: string;
  description: string;
}

export interface EducationItem {
  id: string;
  order: number;
  status: 'In progress' | 'Completed';
  dates?: string;
  degree: string;
  institution?: string;
  description?: string;
  list_items?: string[];
}

export interface SkillGroup {
  id: string;
  order: number;
  name: string;
  skills: string;
}

export interface ContactData {
  index_meta: string;
  label: string;
  title: string;
  intro: string;
  email: string;
  location: string;
  linkedin_label: string;
  looking_for_title: string;
  looking_for_items: string[];
  cta_button_text: string;
}

export interface SeoData {
  title: string;
  description: string;
  site_url: string;
  og_image: string;
}

export interface CvData {
  title: string;
  description: string;
  button_text: string;
  file_url: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link?: string;
}

export interface CustomSection {
  id: string;
  order: number;
  title: string;
  items: CustomSectionItem[];
}

export interface AnalyticsMetric {
  views: number;
  top_projects: { id: string; title: string; views: number }[];
  referrers: { source: string; count: number }[];
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  stats: StatItem[];
  socials: SocialLinks;
  practice: {
    index_meta: string;
    label: string;
    title: string;
    lede: string;
    items: PracticeItem[];
  };
  currently: {
    index_meta: string;
    label: string;
    title: string;
    items: CurrentlyItem[];
  };
  work_header: {
    index_meta: string;
    label: string;
    title: string;
    lede: string;
    upwork_text: string;
    upwork_btn_text: string;
  };
  projects: ProjectItem[];
  certificates: {
    index_meta: string;
    label: string;
    title: string;
    lede: string;
    items: CertificateItem[];
  };
  lab: {
    index_meta: string;
    label: string;
    title: string;
    lede: string;
    items: LabItem[];
  };
  education: {
    index_meta: string;
    label: string;
    title: string;
    items: EducationItem[];
    cv: CvData;
  };
  skills: {
    index_meta: string;
    label: string;
    title: string;
    lede: string;
    groups: SkillGroup[];
    note: string;
  };
  contact: ContactData;
  footer: {
    name: string;
    description: string;
    signature: string;
    copyright: string;
  };
  custom_sections: CustomSection[];
}
