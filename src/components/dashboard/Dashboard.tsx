import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, Database } from '../../lib/supabase';
import { FileText, Plus, Edit2, Trash2, Copy, LogOut, Menu, X, Crown, Clock, FileCheck } from 'lucide-react';
import { translations, Language } from '../../lib/translations';
import { templateMetadata } from '../../lib/themes';
import { normalizeTemplate } from '../../lib/cvTypes';

type CV = Database['public']['Tables']['cvs']['Row'];

interface DashboardProps {
  onCreateCV: () => void;
  onEditCV: (cvId: string) => void;
}

export function Dashboard({ onCreateCV, onEditCV }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('fr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[language];

  useEffect(() => {
    loadCVs();
  }, [user]);

  const loadCVs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCVs(data || []);
    } catch (error) {
      console.error('Error loading CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

      if (error) throw error;
      setCVs(cvs.filter(cv => cv.id !== cvId));
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const handleDuplicateCV = async (cv: CV) => {
    try {
      const { data: newCV, error: cvError } = await supabase
        .from('cvs')
        .insert({
          user_id: cv.user_id,
          title: `${cv.title} (Copy)`,
          template: cv.template,
          color_theme: cv.color_theme,
          language: cv.language,
          personal_info: cv.personal_info,
          is_draft: true,
        })
        .select()
        .single();

      if (cvError) throw cvError;

      const [
        { data: experiences },
        { data: education },
        { data: skills }
      ] = await Promise.all([
        supabase.from('experiences').select('*').eq('cv_id', cv.id),
        supabase.from('education').select('*').eq('cv_id', cv.id),
        supabase.from('skills').select('*').eq('cv_id', cv.id),
      ]);

      const insertPromises = [];

      if (experiences?.length) {
        insertPromises.push(
          supabase.from('experiences').insert(
            experiences.map(({ id, created_at, ...rest }) => ({ ...rest, cv_id: newCV.id }))
          )
        );
      }

      if (education?.length) {
        insertPromises.push(
          supabase.from('education').insert(
            education.map(({ id, created_at, ...rest }) => ({ ...rest, cv_id: newCV.id }))
          )
        );
      }

      if (skills?.length) {
        insertPromises.push(
          supabase.from('skills').insert(
            skills.map(({ id, created_at, ...rest }) => ({ ...rest, cv_id: newCV.id }))
          )
        );
      }

      await Promise.all(insertPromises);

      loadCVs();
    } catch (error) {
      console.error('Error duplicating CV:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NovaCV</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <span className="text-gray-600">{t.common.dashboard}</span>
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors text-sm font-medium"
              >
                {language === 'fr' ? 'EN' : 'FR'}
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.common.signOut}</span>
              </button>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {language === 'fr' ? 'Switch to English' : 'Passer en français'}
              </button>
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.common.signOut}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.common.myCVs}</h1>
            <p className="text-gray-600 mt-1">
              {cvs.length === 0
                ? language === 'fr'
                  ? 'Créez votre premier CV professionnel'
                  : 'Create your first professional CV'
                : language === 'fr'
                ? `${cvs.length} CV${cvs.length > 1 ? 's' : ''} créé${cvs.length > 1 ? 's' : ''}`
                : `${cvs.length} CV${cvs.length > 1 ? 's' : ''} created`}
            </p>
          </div>
          <button
            onClick={onCreateCV}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>{t.common.createNewCV}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'fr' ? 'Aucun CV pour le moment' : 'No CVs yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'fr'
                ? 'Créez votre premier CV professionnel en quelques minutes'
                : 'Create your first professional CV in minutes'}
            </p>
            <button
              onClick={onCreateCV}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>{t.common.createNewCV}</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                  <div className="absolute top-3 right-3 flex gap-2">
                    {cv.is_draft ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.common.draft}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <FileCheck className="w-3 h-3" />
                        {t.common.published}
                      </span>
                    )}
                  </div>
                  <div className="text-center p-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      {templateMetadata[normalizeTemplate(cv.template)]?.name ?? cv.template}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {cv.title || t.untitledCV}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {t.common.lastModified}: {formatDate(cv.updated_at)}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditCV(cv.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>{t.editCV}</span>
                    </button>
                    <button
                      onClick={() => handleDuplicateCV(cv)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t.duplicateCV}
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title={t.deleteCV}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {language === 'fr' ? 'Passer à Premium' : 'Upgrade to Premium'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'fr'
                  ? 'Débloquez des modèles premium, l\'export HD et la suppression des filigranes'
                  : 'Unlock premium templates, HD export, and remove watermarks'}
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all">
                {t.premium}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
