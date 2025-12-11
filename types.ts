export type Language = 'zh' | 'en';

export interface ResumeData {
  profile: {
    name: string;
    role: string;
    phone: string;
    email: string;
    wechat: string;
    avatarUrl: string;
    summary: string;
  };
  education: Array<{
    school: string;
    degree: string;
    period: string;
    details: string[];
    honors: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    achievements: Array<{
      title: string;
      description: string;
    }>;
  }>;
  projects: Array<{
    name: string;
    role: string;
    period: string;
    background: string;
    responsibilities: string;
    result: string;
  }>;
  skills: {
    categories: Array<{
      name: string;
      icon: 'Certificate' | 'Tool';
      items: string[];
    }>;
    advantages: Array<{
      title: string;
      desc: string;
    }>;
  };
}