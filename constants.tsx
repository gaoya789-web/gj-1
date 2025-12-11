import { ResumeData } from './types';
import { Mail, Phone, MessageCircle, Award, Code, PenTool, TrendingUp, Cpu, Battery, Zap } from 'lucide-react';
import React from 'react';

export const RESUME_CONTENT: Record<'zh' | 'en', ResumeData> = {
  zh: {
    profile: {
      name: "高洁",
      role: "GTM (Go-To-Market) 岗位",
      phone: "17854275370",
      email: "gaojie5370@163.com",
      wechat: "Jane_5370",
      avatarUrl: "https://i.postimg.cc/MpYMYCpz/wei-xin-tu-pian-20251211002755.png",
      summary: "拥有项目全流程管理经验，擅长跨部门资源整合与客户需求对接。具备数据驱动决策思维与营销策划能力。"
    },
    education: [
      {
        school: "华中科技大学 & 巴黎文理研究大学 (QS24)",
        degree: "硕士 - 新能源科学与工程",
        period: "2021.09 -- 2024.06",
        details: ["研究方向：神经网络、机器学习、优化算法、建筑节能"],
        honors: "校一等奖学金、二等奖学金、三好学生等"
      },
      {
        school: "山东科技大学",
        degree: "本科 - 建筑学",
        period: "2016.09 -- 2021.06",
        details: ["专业成绩：前10%；系统学习设计方法，形成设计理念"],
        honors: "山东省优秀毕业生、一等奖学金、三好学生等"
      }
    ],
    experience: [
      {
        company: "汇川联合动力有限公司",
        role: "商用车事业部 - 电机项目经理",
        period: "2024.07 -- 2025.08",
        achievements: [
          {
            title: "项目获取与需求对接",
            description: "深度参与3个年度重点客户（含1个海外）项目前期获取，精准匹配客户性能需求；组织跨部门核价，制定差异化报价策略，成功获取战略客户平台项目，累计斩获全生命周期订单30万台。"
          },
          {
            title: "跨部门协作与资源整合",
            description: "搭建项目沟通机制，推进4个商用车电机项目（含1个海外），覆盖轻卡、重卡等车型，对接宇通、福田、奇瑞等客户，保障按期交付，团队效率提升50%。"
          },
          {
            title: "客户维护与策略落地",
            description: "作为项目接口人维护关键客户，协同销售团队完成合同条款谈判，建立长期战略合作框架，客户满意度达90%；实现降低单项目成本30%的目标。"
          },
          {
            title: "风险管控与进度保障",
            description: "识别采购风险、技术瓶颈等潜在问题，制定应急预案，项目进度偏差率<10%。"
          }
        ]
      }
    ],
    projects: [
      {
        name: "一场基于社群与热点的快闪饮品营销实验",
        role: "策划人",
        period: "2024.03 -- 2024.06",
        background: "为探索“社群运营+热点营销”的轻量化商业落地模式，独立策划并执行快闪饮品营销实验。",
        responsibilities: "洞察在校生用户痛点（情绪代偿、群体认同）。设计“周主题”饮品，结合热点定制配方；通过小红书内容引流建立700+人垂直社群；与周边商铺谈判“品牌联名+流量置换”。",
        result: "单次活动2小时内售罄150+单，降低采购成本30%，形成可复制的社群营销模式。"
      },
      {
        name: "国网电力科学研究院武汉能效测评有限公司",
        role: "研究助理",
        period: "2023.06 -- 2023.08",
        background: "参与国网纵向科技项目及地方能效测评项目，支撑建筑节能与低碳园区技术研究。",
        responsibilities: "统筹编制建筑精细化能耗仿真与智慧运营技术可研报告；调研青岛企业可调负荷情况；参与智慧低碳供电所方案编制。",
        result: "形成多份技术报告与方案文件，支撑项目落地与学术研究。"
      },
      {
        name: "中欧清洁与可再生能源学院学生工作",
        role: "副部长 & 副主席",
        period: "2021.09 -- 2022.08",
        background: "负责新媒体运营及活动策划。",
        responsibilities: "独立负责学院官方公众号“ICARE红色小站”全面运营；深度策划并主导执行3场线上/线下整合活动。",
        result: "一年内主导发布推文30余篇，有效提升了组织的品牌影响力与信息覆盖率；锻炼了出色的跨部门协作与多任务管理能力。"
      }
    ],
    skills: {
      categories: [
        {
          name: "证书与语言",
          icon: "Certificate",
          items: ["PMP证书", "英语CET-6"]
        },
        {
          name: "软件与工具",
          icon: "Tool",
          items: ["Office办公软件", "Python编程", "CAD制图", "PS设计"]
        }
      ],
      advantages: [
        { title: "项目管理", desc: "拥有项目全流程管理经验，擅长跨部门资源整合与客户需求对接，高效推进策略落地与目标达成。" },
        { title: "数据分析", desc: "掌握数据分析与机器学习方法，熟练运用软件工具，具备数据驱动决策思维与报告撰写能力。" },
        { title: "营销思维", desc: "有营销策划与社群运营实践，具备创新思维与内容表达能力，能结合热点与需求设计差异化方案。" }
      ]
    }
  },
  en: {
    profile: {
      name: "Gao Jie",
      role: "GTM (Go-To-Market) Specialist",
      phone: "17854275370",
      email: "gaojie5370@163.com",
      wechat: "Jane_5370",
      avatarUrl: "https://i.postimg.cc/MpYMYCpz/wei-xin-tu-pian-20251211002755.png",
      summary: "Experienced in full-cycle project management, specializing in cross-functional resource integration and client requirement alignment. Skilled in data-driven decision making and marketing strategy."
    },
    education: [
      {
        school: "Huazhong Univ. of Sci. & Tech. & PSL Research Univ. (QS24)",
        degree: "Master - New Energy Science & Engineering",
        period: "2021.09 -- 2024.06",
        details: ["Focus: Neural Networks, Machine Learning, Optimization Algorithms, Building Energy Efficiency"],
        honors: "First Class Scholarship, Merit Student, etc."
      },
      {
        school: "Shandong University of Science and Technology",
        degree: "Bachelor - Architecture",
        period: "2016.09 -- 2021.06",
        details: ["Top 10% Academic Performance; Systematically learned design methodologies."],
        honors: "Outstanding Graduate of Shandong Province, First Class Scholarship, etc."
      }
    ],
    experience: [
      {
        company: "Inovance United Dynamics",
        role: "Commercial Vehicle Division - Motor Project Manager",
        period: "2024.07 -- 2025.08",
        achievements: [
          {
            title: "Project Acquisition & Requirement Alignment",
            description: "Deeply involved in acquiring 3 key annual accounts (1 overseas). Precisely matched client performance needs. Orchestrated cross-functional pricing (R&D/Mfg/Finance), securing lifecycle orders of 300,000 units."
          },
          {
            title: "Cross-Functional Collaboration",
            description: "Established project communication mechanisms, driving 4 commercial vehicle motor projects (Light/Heavy Trucks). Interfaced with Yutong, Foton, Chery, etc., ensuring on-time delivery and boosting team efficiency by 50%."
          },
          {
            title: "Client Retention & Strategy Execution",
            description: "Served as the key client interface. Negotiated contract terms achieving 90% client satisfaction. Implemented R&D/Procurement strategies to reduce single-project costs by 30%."
          },
          {
            title: "Risk Management",
            description: "Identified procurement risks and technical bottlenecks early. Developed contingency plans, keeping project schedule deviation <10%."
          }
        ]
      }
    ],
    projects: [
      {
        name: "Pop-up Drink Marketing Experiment",
        role: "Planner",
        period: "2024.03 -- 2024.06",
        background: "Explored 'Community Operations + Hotspot Marketing' via a pop-up drink stall.",
        responsibilities: "Addressed student emotional needs. Designed 'Weekly Theme' drinks. Built a 700+ person vertical community via Xiaohongshu. Negotiated 'Brand Co-branding' with local shops.",
        result: "Sold out 150+ orders in 2 hours per event. Reduced procurement costs by 30%. Created a replicable community marketing model."
      },
      {
        name: "State Grid EPRI Wuhan Efficiency Evaluation Co.",
        role: "Research Assistant",
        period: "2023.06 -- 2023.08",
        background: "Participated in State Grid technology projects and local energy efficiency evaluations.",
        responsibilities: "Compiled feasibility reports for building energy simulation. Surveyed load conditions in Qingdao enterprises. Drafted low-carbon power supply station proposals.",
        result: "Produced multiple technical reports supporting project implementation and academic research."
      },
      {
        name: "ICARE Institute Student Union",
        role: "Vice Minister & Vice President",
        period: "2021.09 -- 2022.08",
        background: "Responsible for new media operations and event planning.",
        responsibilities: "Managed official account 'ICARE Red Station'. Planned and executed 3 integrated online/offline events.",
        result: "Published 30+ articles in one year, significantly boosting brand influence. Honed cross-functional collaboration skills."
      }
    ],
    skills: {
      categories: [
        {
          name: "Certifications & Languages",
          icon: "Certificate",
          items: ["PMP Certified", "English CET-6"]
        },
        {
          name: "Software & Tools",
          icon: "Tool",
          items: ["Office Suite", "Python", "CAD", "Photoshop"]
        }
      ],
      advantages: [
        { title: "Project Management", desc: "Full-cycle management experience. Expert in resource integration & client alignment." },
        { title: "Data Analysis", desc: "Skilled in ML methods, analytical tools, and data-driven decision making." },
        { title: "Marketing Mindset", desc: "Experience in community operations, creative thinking, and differentiated solution design." }
      ]
    }
  }
};

export const ICONS = {
  Mail: <Mail className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  WeChat: <MessageCircle className="w-5 h-5" />,
  Award: <Award className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Design: <PenTool className="w-6 h-6" />,
  Growth: <TrendingUp className="w-6 h-6" />,
  Tech: <Cpu className="w-6 h-6" />,
  Energy: <Zap className="w-6 h-6" />,
  Power: <Battery className="w-6 h-6" />
};