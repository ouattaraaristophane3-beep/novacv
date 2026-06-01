import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { translations, Language } from '../../lib/translations';
import {
  FileText,
  ArrowLeft,
  Download,
  Edit2,
  Printer,
  Eye,
  EyeOff,
  Globe,
  Save,
  Loader2,
  Check,
  AlertCircle,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  LogOut,
} from 'lucide-react';
import { PersonalInfoEditor } from './PersonalInfoEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import CVPreview from './CVPreview';
import { TemplatePalettePanel } from './TemplatePalettePanel';
import { CustomizationPanel } from './CustomizationPanel';

interface CVEditorProps {
  cvId: string;
}

const languageOptions = [
  { value: 'fr', label: 'Français', flag: 'FR' },
  { value: 'en', label: 'English', flag: 'EN' },
];

const steps = [
  { id: 'info', label: 'Personal Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
];

export function CVEditor({ cvId }: CVEditorProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { cvData, loading, loadCV, updateCVLocal, saveAll, saving, hasUnsavedChanges } = useCV();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const previewContentRef = useRef<HTMLDivElement>(null);

  const language = (cvData.cv?.language as Language) || 'fr';
  const t = translations[language];

  useEffect(() => {
    loadCV(cvId);
  }, [cvId, loadCV]);

  useEffect(() => {
    // Responsive layout handling
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowPreview(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      await saveAll();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 1000);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleExportPDF = async () => {
    const element = previewContentRef.current;
    if (!element || !cvData.cv) return;
    const cvInfo = cvData.cv.personal_info as {
      firstName?: string;
      lastName?: string;
    };
    const filename = `${cvData.cv.title || 'CV'}_${cvInfo?.firstName || ''}_${cvInfo?.lastName || ''}.pdf`.replace(/\s+/g, '_');

    // Create a clone for PDF generation
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'png' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        width: 794,
        height: 1123,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const
      },
    } as any;

    // Dynamic import for html2pdf
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set(opt).from(clone).save();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !cvData.cv) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  const currentStepId = steps[currentStep].id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:bg-white">
      {/* Header - Hidden on print */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (hasUnsavedChanges) {
                    const confirm = window.confirm(
                      language === 'fr'
                        ? 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter?'
                        : 'You have unsaved changes. Are you sure you want to leave?'
                    );
                    if (!confirm) return;
                  }
                  navigate('/dashboard');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  value={cvData.cv.title}
                  onChange={(e) => updateCVLocal({ title: e.target.value })}
                  className="font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder={t.untitledCV}
                />
                {hasUnsavedChanges && (
                  <span className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    {language === 'fr' ? 'Non sauvegardé' : 'Unsaved'}
                  </span>
                )}
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    {language === 'fr' ? 'Sauvegardé' : 'Saved'}
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showPreview ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm font-medium">{t.preview}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'fr' ? 'Imprimer' : 'Print'}</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">{t.downloadPDF}</span>
              </button>
              <button
                onClick={signOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </nav>

            {/* Mobile/Tablet Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-200"
            >
              {showPreview ? <EyeOff className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
              <span className="text-sm font-medium">
                {showPreview ? (language === 'fr' ? 'Éditer' : 'Edit') : t.preview}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Editor Side */}
        <div className={`${showPreview ? 'hidden lg:flex lg:w-1/2' : 'w-full flex'} flex-col print:hidden h-full`}>
          {/* Steps Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => setCurrentStep(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : isCompleted
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="text-sm">{step.label}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 self-center hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <TemplatePalettePanel language={language} />
              <CustomizationPanel language={language} />

              {/* Language Selection */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{t.languageTab}</h3>
                </div>
                <div className="flex gap-3">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => updateCVLocal({ language: lang.value as Language })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        cvData.cv!.language === lang.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-bold">{lang.flag}</span>
                      <span className="text-sm font-medium text-gray-900">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                {currentStepId === 'info' && (
                  <PersonalInfoEditor language={language} />
                )}
                {currentStepId === 'experience' && (
                  <ExperienceEditor language={language} />
                )}
                {currentStepId === 'education' && (
                  <EducationEditor language={language} />
                )}
                {currentStepId === 'skills' && (
                  <SkillsEditor language={language} />
                )}
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-6 bg-white rounded-xl border border-gray-200 p-6">
                <button
                  onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Précédent' : 'Previous'}</span>
                </button>

                <button
                  onClick={handleSaveAndContinue}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.common.loading}</span>
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t.common.save}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'fr' ? 'Sauvegarder et continuer' : 'Save and Continue'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        {showPreview && (
          <div id="cv-preview" className="flex w-full lg:w-1/2 h-full bg-gray-100 border-l border-gray-200 print:block print:w-full overflow-hidden relative">
            {/* Mobile Back to Edit FAB */}
            <button
              onClick={() => setShowPreview(false)}
              className="lg:hidden absolute bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/50 font-bold active:scale-95 transition-transform"
            >
              <Edit2 className="w-5 h-5" />
              <span>{language === 'fr' ? 'Modifier le CV' : 'Edit CV'}</span>
            </button>

            <CVPreview
              ref={previewContentRef}
              cv={cvData.cv}
              experiences={cvData.experiences}
              education={cvData.education}
              skills={cvData.skills}
            />
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #cv-preview, #cv-preview * {
            visibility: visible;
          }

          #cv-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            transform: none !important;
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
