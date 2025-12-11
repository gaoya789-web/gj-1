
import React, { useState, useRef } from 'react';
import { Download, Globe, ArrowUpRight, Briefcase, GraduationCap, User, Zap, Wrench, Medal, ChevronDown, FileText, Image as ImageIcon, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RESUME_CONTENT, ICONS } from './constants';
import { BentoCard } from './components/BentoCard';
import { Language } from './types';

// Lightweight inline fallback avatar to avoid CORS/image load failures during export
const FALLBACK_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none"><rect width="160" height="160" rx="24" fill="%23E5E7EB"/><circle cx="80" cy="64" r="32" fill="%239CA3AF"/><path d="M32 144c0-26.51 21.49-48 48-48s48 21.49 48 48" stroke="%239CA3AF" stroke-width="12" stroke-linecap="round"/></svg>';

// Export tuning to keep PDF/PNG consistent with on-screen preview
const EXPORT_WIDTH = 1280;   // force a stable desktop layout width
const EXPORT_PADDING = 50;   // generous whitespace to match preview background
const EXPORT_SCALE = 2;      // hi-dpi without blowing up memory

// Helper component for copyable contact rows
const CopyRow = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Gracefully handle browsers/contexts without clipboard permission
    if (!navigator.clipboard?.writeText) {
      window.prompt('复制失败：当前环境不支持自动复制，请手动复制', text);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
      window.prompt('复制失败：请手动复制', text);
    }
  };

  return (
    <div className="flex items-center justify-between group h-8">
       <div className="flex items-center gap-3 text-base text-neutral-600">
         <span className="p-1.5 bg-neutral-50 rounded-md text-neutral-400">{icon}</span> 
         <span className="select-all">{text}</span>
       </div>
       <button 
         onClick={handleCopy}
         className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-95"
         title="Copy to clipboard"
       >
         {copied ? <Check size={16} /> : <Copy size={16} />}
       </button>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const data = RESUME_CONTENT[lang];

  const handleExport = async (type: 'pdf' | 'png') => {
    if (isExporting) return; // Prevent re-entry
    if (!contentRef.current) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure UI is stable
      await new Promise(resolve => setTimeout(resolve, 100));
      // Wait for webfonts to be ready to avoid fallback fonts in export
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }

      const exportWidth = EXPORT_WIDTH;

      const canvas = await html2canvas(contentRef.current, {
        scale: EXPORT_SCALE,
        useCORS: true,
        backgroundColor: '#F5F5F7', // Preserve the gray background of the resume layout
        logging: false,
        windowWidth: exportWidth, // lock layout width for consistent rendering
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('resume-content');
          clonedDoc.body.style.backgroundColor = '#F5F5F7';
          if (element) {
             // Add generous padding to the cloned element to create natural whitespace
             // This expands the background area without adding a "fake" border
             element.style.width = `${exportWidth}px`;
             element.style.margin = '0 auto';
             element.style.padding = `${EXPORT_PADDING}px`;
             element.style.maxWidth = 'none'; // Ensure it can expand if needed
          }
        }
      });

      if (type === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        
        // Use the actual canvas dimensions to create a custom page size
        // This ensures the PDF is exactly the size of the captured content (no A4 cropping/scaling)
        // and matches the visual fidelity of the PNG export perfectly.
        const pdfWidth = canvas.width;
        const pdfHeight = canvas.height;
        
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [pdfWidth, pdfHeight]
        });

        // Fill background matches app theme to prevent any white edges
        pdf.setFillColor(245, 245, 247);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Gao_Jie_Resume_${lang}.pdf`);

      } else {
        // PNG Export (use Blob + object URL to avoid blank-tab navigation issues on some hosts)
        const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Failed to generate PNG blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Gao_Jie_Resume_${lang}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Helper to parse "Title: Content" strings for Education details
  const renderDetailText = (text: string) => {
    // Check for Chinese colon or English colon
    const separators = ['：', ':'];
    let splitIndex = -1;
    let separatorUsed = '';

    for (const sep of separators) {
      const idx = text.indexOf(sep);
      if (idx !== -1) {
        // Only consider it a label separator if it appears early in the string (e.g. first 20 chars)
        // to avoid splitting sentences that contain colons later.
        if (splitIndex === -1 || idx < splitIndex) {
          splitIndex = idx;
          separatorUsed = sep;
        }
      }
    }

    if (splitIndex !== -1 && splitIndex < 20) {
      const label = text.substring(0, splitIndex);
      const value = text.substring(splitIndex + 1);
      return (
        <>
          <span className="font-semibold text-neutral-900">{label}{separatorUsed}</span>
          {value}
        </>
      );
    }
    return text;
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#F5F5F7]/80 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl mb-8">
        <h1 className="text-sm font-semibold tracking-wide text-neutral-500">
          GTM PORTFOLIO / {lang === 'zh' ? '简历' : 'RESUME'}
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium hover:bg-neutral-50 transition-colors border border-neutral-200 text-neutral-700"
          >
            <Globe size={14} />
            {lang === 'zh' ? 'English' : '中文'}
          </button>
          
          {/* Export Dropdown */}
            <div className={`relative group ${isExporting ? 'pointer-events-none opacity-70' : ''}`}>
            <button 
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#1D1D1F] text-white rounded-full shadow-sm text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              {isExporting ? 'Exporting...' : (
                <>
                  <Download size={14} />
                  {lang === 'zh' ? '导出' : 'Export'}
                  <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <button
                disabled={isExporting}
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="p-1.5 bg-neutral-100 rounded-md text-neutral-500 group-hover:text-blue-600 group-hover:bg-blue-100/50 transition-colors">
                  <FileText size={16} />
                </div>
                {lang === 'zh' ? '导出 PDF' : 'Save as PDF'}
              </button>
              <button
                disabled={isExporting}
                onClick={() => handleExport('png')}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-left mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="p-1.5 bg-neutral-100 rounded-md text-neutral-500 group-hover:text-blue-600 group-hover:bg-blue-100/50 transition-colors">
                  <ImageIcon size={16} />
                </div>
                {lang === 'zh' ? '导出 图片' : 'Save as Image'}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      {/* Added ID for html2canvas targeting */}
      <main id="resume-content" className="max-w-7xl mx-auto px-4 sm:px-6" ref={contentRef}>
        
        {/* Grid Container with items-stretch to ensure equal height columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= LEFT COLUMN (Profile, Education, Skills) ================= */}
          {/* Increased column span from 4 to 5 for better balance with larger fonts */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            
            {/* 1. Profile Card - Tightened gaps */}
            <BentoCard icon={<User className="w-5 h-5" />} title={lang === 'zh' ? '个人信息' : 'Profile'}>
              <div className="flex flex-col gap-5"> {/* Reduced gap from 6 to 5 */}
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-neutral-100 overflow-hidden shadow-inner border border-white shrink-0">
                     <img 
                       src={data.profile.avatarUrl} 
                       alt={data.profile.name} 
                       className="w-full h-full object-cover object-top"
                       crossOrigin="anonymous"
                       onError={(e) => {
                         const target = e.currentTarget;
                         target.onerror = null;
                         target.src = FALLBACK_AVATAR;
                       }}
                     />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                      {data.profile.name}
                    </h2>
                    <p className="text-base text-neutral-500 font-medium mt-1">
                      {data.profile.role}
                    </p>
                  </div>
                </div>
                
                <p className="text-base leading-relaxed text-neutral-600">
                  {data.profile.summary}
                </p>

                <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100"> {/* Reduced gap from 4 to 3 */}
                   <CopyRow icon={ICONS.Phone} text={data.profile.phone} />
                   <CopyRow icon={ICONS.Mail} text={data.profile.email} />
                   <CopyRow icon={ICONS.WeChat} text={data.profile.wechat} />
                </div>
              </div>
            </BentoCard>

            {/* 2. Education Group - Consolidated & Tightened */}
            <BentoCard title={lang === 'zh' ? '教育背景' : 'Education'} icon={<GraduationCap className="w-5 h-5"/>}>
               <div className="flex flex-col gap-6"> {/* Reduced gap from 8 to 6 */}
                 {data.education.map((edu, idx) => (
                   <div key={idx} className={idx !== data.education.length - 1 ? "border-b border-neutral-100 pb-6" : ""}>
                     <div className="flex flex-col gap-2 mb-3">
                       <div className="flex justify-between items-start gap-2">
                          <h4 className="text-lg font-bold text-neutral-900">{edu.school}</h4>
                          <span className="text-sm font-mono text-neutral-400 bg-neutral-50 px-2 py-1 rounded whitespace-nowrap">{edu.period}</span>
                       </div>
                       <p className="text-base font-medium text-blue-600">{edu.degree}</p>
                     </div>
                     
                     {/* Details & Honors - Consolidated into single blue container with 80% opacity */}
                     <div className="mt-3 bg-blue-50/80 rounded-xl px-4 py-3 flex flex-col gap-2 text-base leading-relaxed text-neutral-700">
                       {edu.details.map((d, i) => (
                         <div key={i}>
                           {renderDetailText(d)}
                         </div>
                       ))}
                       <div>
                         <span className="font-semibold text-neutral-900">{lang === 'zh' ? '荣誉' : 'Honors'}{lang === 'zh' ? '：' : ': '}</span> 
                         {edu.honors}
                       </div>
                     </div>

                   </div>
                 ))}
               </div>
            </BentoCard>

            {/* 3. Core Advantages & Skills (Merged) - Loosened */}
            <BentoCard 
              className="flex-grow"
              title={lang === 'zh' ? '核心优势与技能' : 'Advantages & Skills'} 
              icon={<Zap className="w-5 h-5"/>}
            >
              <div className="flex flex-col gap-10"> {/* Increased gap from 6 to 10 */}
                
                {/* Advantages Section */}
                <div>
                    <div className="flex flex-col gap-6"> {/* Increased gap from 4 to 6 */}
                        {data.skills.advantages.map((adv, idx) => (
                        <div key={idx} className="flex gap-3">
                            <div className="mt-1.5 min-w-[4px] h-[52px] rounded-full bg-blue-500/20 relative">
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-500 rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-base text-neutral-900">{adv.title}</h4>
                                <p className="text-base text-neutral-500 leading-relaxed mt-0.5">
                                    {adv.desc}
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-neutral-100"></div>

                {/* Skills Section */}
                <div>
                    <div className="flex flex-col gap-8"> {/* Increased gap from 5 to 8 */}
                        {data.skills.categories.map((cat, idx) => (
                        <div key={idx}>
                            <div className="flex items-center gap-2 mb-3">
                            <span className="text-neutral-400">
                                {cat.icon === 'Certificate' ? <Medal size={20} /> : <Wrench size={20} />}
                            </span>
                            <span className="text-base text-neutral-600 font-bold">{cat.name}</span>
                            </div>
                            <div className="flex flex-wrap gap-2.5"> {/* Slightly larger gap */}
                            {cat.items.map((item, i) => (
                                <span key={i} className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-base text-blue-800 font-medium">
                                {item}
                                </span>
                            ))}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
              </div>
            </BentoCard>

          </div>

          {/* ================= RIGHT COLUMN (Experience, Projects) ================= */}
          {/* Reduced column span from 8 to 7 */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            
            {/* 4. Work Experience */}
            <BentoCard 
              title={lang === 'zh' ? '工作经历' : 'Work Experience'} 
              icon={<Briefcase className="w-5 h-5" />}
            >
              <div className="flex flex-col gap-10"> {/* Standardized to gap-10 (was 12) */}
                {data.experience.map((exp, idx) => (
                  <div key={idx} className={`flex flex-col ${idx !== data.experience.length - 1 ? 'border-b border-neutral-100 pb-10' : ''}`}>
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 leading-tight">{exp.company}</h3>
                        <div className="mt-2 inline-flex items-center text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                          {exp.role}
                        </div>
                      </div>
                      <span className="font-mono text-sm text-neutral-400 whitespace-nowrap bg-neutral-50 px-2.5 py-1 rounded self-start mt-1 sm:mt-0">
                        {exp.period}
                      </span>
                    </div>

                    {/* Content Body - Unified Vertical List with Inline Title:Desc */}
                    {/* Standardized to gap-6 (was 8) to match Projects */}
                    <div className="flex flex-col gap-6">
                      {exp.achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-base leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2.5"></span>
                          <p className="text-neutral-600">
                             <span className="font-semibold text-neutral-900">{item.title}{lang === 'zh' ? '：' : ': '}</span>
                             {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* 5. Projects (Consolidated) - Flex Grow to align bottom */}
            <BentoCard 
              className="flex-grow"
              title={lang === 'zh' ? '项目经历' : 'Project Experience'} 
              icon={<ArrowUpRight className="w-5 h-5"/>}
            >
              {/* Standardized to gap-10 (was 10) */}
              <div className="flex flex-col gap-10">
                {data.projects.map((project, idx) => (
                  <div key={idx} className={`flex flex-col ${idx !== data.projects.length - 1 ? 'border-b border-neutral-100 pb-10' : ''}`}>
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 leading-tight">{project.name}</h3>
                        <div className="mt-2 inline-flex items-center text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                          {project.role}
                        </div>
                      </div>
                      <span className="font-mono text-sm text-neutral-400 whitespace-nowrap bg-neutral-50 px-2.5 py-1 rounded self-start mt-1 sm:mt-0">
                        {project.period}
                      </span>
                    </div>

                    {/* Content Body - Unified Vertical List with Inline Title:Desc */}
                    {/* Standardized to gap-6 (was 4) to match Work Experience */}
                    <div className="flex flex-col gap-6">
                      
                      {/* Background */}
                      <div className="flex items-start gap-3 text-base leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2.5"></span>
                        <p className="text-neutral-600">
                          <span className="font-semibold text-neutral-900">{lang === 'zh' ? '项目背景' : 'Background'}{lang === 'zh' ? '：' : ': '}</span>
                          {project.background}
                        </p>
                      </div>

                      {/* Responsibilities */}
                      <div className="flex items-start gap-3 text-base leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2.5"></span>
                        <p className="text-neutral-600">
                          <span className="font-semibold text-neutral-900">{lang === 'zh' ? '项目职责' : 'Responsibilities'}{lang === 'zh' ? '：' : ': '}</span>
                          {project.responsibilities}
                        </p>
                      </div>

                      {/* Result */}
                      <div className="flex items-start gap-3 text-base leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2.5"></span>
                        <p className="text-neutral-600">
                          <span className="font-semibold text-neutral-900">{lang === 'zh' ? '项目成果' : 'Results'}{lang === 'zh' ? '：' : ': '}</span>
                          {project.result}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </BentoCard>
            
          </div>

        </div>

        {/* Footer Moved Outside of Grid Columns */}
        <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-400">
            Created by Gao Jie
            </p>
        </div>

      </main>
    </div>
  );
};

export default App;
