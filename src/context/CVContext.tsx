import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';

type CV = Database['public']['Tables']['cvs']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

interface CVData {
  cv: CV | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

interface CVContextType {
  cvData: CVData;
  loading: boolean;
  saving: boolean;
  hasUnsavedChanges: boolean;
  loadCV: (cvId: string) => Promise<void>;
  createCV: (userId: string) => Promise<string | null>;
  updateCVLocal: (updates: Partial<CV>) => void;
  saveCV: () => Promise<void>;
  addExperience: (experience: Partial<Experience>) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  saveExperiences: () => Promise<void>;
  addEducation: (education: Partial<Education>) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  saveEducation: () => Promise<void>;
  addSkill: (skill: Partial<Skill>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  saveSkills: () => Promise<void>;
  saveAll: () => Promise<void>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: ReactNode }) {
  const [cvData, setCVData] = useState<CVData>({
    cv: null,
    experiences: [],
    education: [],
    skills: [],
  });
  const [originalData, setOriginalData] = useState<CVData>({
    cv: null,
    experiences: [],
    education: [],
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadCV = useCallback(async (cvId: string) => {
    setLoading(true);
    try {
      const { data: cv, error: cvError } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .maybeSingle();

      if (cvError) throw cvError;

      const { data: experiences, error: expError } = await supabase
        .from('experiences')
        .select('*')
        .eq('cv_id', cvId)
        .order('display_order', { ascending: true });

      if (expError) throw expError;

      const { data: education, error: eduError } = await supabase
        .from('education')
        .select('*')
        .eq('cv_id', cvId)
        .order('display_order', { ascending: true });

      if (eduError) throw eduError;

      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('cv_id', cvId)
        .order('display_order', { ascending: true });

      if (skillsError) throw skillsError;

      const loadedData = {
        cv,
        experiences: experiences || [],
        education: education || [],
        skills: skills || [],
      };

      setCVData(loadedData);
      setOriginalData(loadedData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCV = useCallback(async (userId: string): Promise<string | null> => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('cvs')
        .insert({ user_id: userId })
        .select()
        .single();

      if (error) throw error;

      const newData = {
        cv: data,
        experiences: [],
        education: [],
        skills: [],
      };

      setCVData(newData);
      setOriginalData(newData);
      setHasUnsavedChanges(false);

      return data.id;
    } catch (error) {
      console.error('Error creating CV:', error);
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateCVLocal = useCallback((updates: Partial<CV>) => {
    setCVData(prev => ({
      ...prev,
      cv: prev.cv ? { ...prev.cv, ...updates } : null,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const saveCV = useCallback(async () => {
    if (!cvData.cv) return;
    setSaving(true);
    try {
      const { id, user_id, created_at, ...updatable } = cvData.cv;
      const { error } = await supabase
        .from('cvs')
        .update({ ...updatable, updated_at: new Date().toISOString() })
        .eq('id', cvData.cv.id);

      if (error) throw error;

      setOriginalData(prevData => ({
        ...prevData,
        cv: cvData.cv,
      }));
      setHasUnsavedChanges(() => {
        const expChanged = JSON.stringify(cvData.experiences) !== JSON.stringify(originalData.experiences);
        const eduChanged = JSON.stringify(cvData.education) !== JSON.stringify(originalData.education);
        const skillsChanged = JSON.stringify(cvData.skills) !== JSON.stringify(originalData.skills);
        return expChanged || eduChanged || skillsChanged;
      });
    } catch (error) {
      console.error('Error saving CV:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [cvData.cv, originalData]);

  const addExperience = useCallback((experience: Partial<Experience>) => {
    if (!cvData.cv) return;
    const newExperience = {
      id: `temp-${Date.now()}`,
      cv_id: cvData.cv.id,
      company: experience.company || '',
      position: experience.position || '',
      location: experience.location || '',
      start_date: experience.start_date || null,
      end_date: experience.end_date || null,
      is_current: experience.is_current || false,
      description: experience.description || '',
      achievements: experience.achievements || [],
      display_order: cvData.experiences.length,
      created_at: new Date().toISOString(),
    } as Experience;

    setCVData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
    setHasUnsavedChanges(true);
  }, [cvData.cv, cvData.experiences.length]);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const saveExperiences = useCallback(async () => {
    if (!cvData.cv) return;
    setSaving(true);
    try {
      // Delete experiences that no longer exist
      const currentIds = cvData.experiences.filter(e => !e.id.startsWith('temp-')).map(e => e.id);
      const originalIds = originalData.experiences.map(e => e.id);
      const toDelete = originalIds.filter(id => !currentIds.includes(id));

      for (const id of toDelete) {
        await supabase.from('experiences').delete().eq('id', id);
      }

      // Create or update experiences
      for (const exp of cvData.experiences) {
        if (exp.id.startsWith('temp-')) {
          // New experience - insert
          const { id, created_at, ...expData } = exp;
          await supabase.from('experiences').insert({
            ...expData,
            cv_id: cvData.cv.id,
          });
        } else {
          // Existing experience - update
          const { id, created_at, ...expData } = exp;
          await supabase.from('experiences').update(expData).eq('id', id);
        }
      }

      // Reload experiences to get proper IDs
      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('cv_id', cvData.cv.id)
        .order('display_order', { ascending: true });

      setCVData(prev => ({
        ...prev,
        experiences: experiences || [],
      }));
      setOriginalData(prevData => ({
        ...prevData,
        experiences: experiences || [],
      }));
      setHasUnsavedChanges(() => {
        const cvChanged = JSON.stringify(cvData.cv) !== JSON.stringify(originalData.cv);
        const eduChanged = JSON.stringify(cvData.education) !== JSON.stringify(originalData.education);
        const skillsChanged = JSON.stringify(cvData.skills) !== JSON.stringify(originalData.skills);
        return cvChanged || eduChanged || skillsChanged;
      });
    } catch (error) {
      console.error('Error saving experiences:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [cvData.cv, cvData.experiences, originalData.experiences, originalData.cv, originalData.education, originalData.skills]);

  const addEducation = useCallback((education: Partial<Education>) => {
    if (!cvData.cv) return;
    const newEducation = {
      id: `temp-${Date.now()}`,
      cv_id: cvData.cv.id,
      institution: education.institution || '',
      degree: education.degree || '',
      field: education.field || '',
      location: education.location || '',
      start_date: education.start_date || null,
      end_date: education.end_date || null,
      is_current: education.is_current || false,
      description: education.description || '',
      achievements: education.achievements || [],
      display_order: cvData.education.length,
      created_at: new Date().toISOString(),
    } as Education;

    setCVData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
    setHasUnsavedChanges(true);
  }, [cvData.cv, cvData.education.length]);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const saveEducation = useCallback(async () => {
    if (!cvData.cv) return;
    setSaving(true);
    try {
      const currentIds = cvData.education.filter(e => !e.id.startsWith('temp-')).map(e => e.id);
      const originalIds = originalData.education.map(e => e.id);
      const toDelete = originalIds.filter(id => !currentIds.includes(id));

      for (const id of toDelete) {
        await supabase.from('education').delete().eq('id', id);
      }

      for (const edu of cvData.education) {
        if (edu.id.startsWith('temp-')) {
          const { id, created_at, ...eduData } = edu;
          await supabase.from('education').insert({
            ...eduData,
            cv_id: cvData.cv.id,
          });
        } else {
          const { id, created_at, ...eduData } = edu;
          await supabase.from('education').update(eduData).eq('id', id);
        }
      }

      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('cv_id', cvData.cv.id)
        .order('display_order', { ascending: true });

      setCVData(prev => ({
        ...prev,
        education: education || [],
      }));
      setOriginalData(prevData => ({
        ...prevData,
        education: education || [],
      }));
      setHasUnsavedChanges(() => {
        const cvChanged = JSON.stringify(cvData.cv) !== JSON.stringify(originalData.cv);
        const expChanged = JSON.stringify(cvData.experiences) !== JSON.stringify(originalData.experiences);
        const skillsChanged = JSON.stringify(cvData.skills) !== JSON.stringify(originalData.skills);
        return cvChanged || expChanged || skillsChanged;
      });
    } catch (error) {
      console.error('Error saving education:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [cvData.cv, cvData.education, originalData.education, originalData.cv, originalData.experiences, originalData.skills]);

  const addSkill = useCallback((skill: Partial<Skill>) => {
    if (!cvData.cv) return;
    const newSkill = {
      id: `temp-${Date.now()}`,
      cv_id: cvData.cv.id,
      name: skill.name || '',
      level: skill.level || 3,
      category: skill.category || 'Technical',
      display_order: cvData.skills.length,
      created_at: new Date().toISOString(),
    } as Skill;

    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
    setHasUnsavedChanges(true);
  }, [cvData.cv, cvData.skills.length]);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const saveSkills = useCallback(async () => {
    if (!cvData.cv) return;
    setSaving(true);
    try {
      const currentIds = cvData.skills.filter(s => !s.id.startsWith('temp-')).map(s => s.id);
      const originalIds = originalData.skills.map(s => s.id);
      const toDelete = originalIds.filter(id => !currentIds.includes(id));

      for (const id of toDelete) {
        await supabase.from('skills').delete().eq('id', id);
      }

      for (const skill of cvData.skills) {
        if (skill.id.startsWith('temp-')) {
          const { id, created_at, ...skillData } = skill;
          await supabase.from('skills').insert({
            ...skillData,
            cv_id: cvData.cv.id,
          });
        } else {
          const { id, created_at, ...skillData } = skill;
          await supabase.from('skills').update(skillData).eq('id', id);
        }
      }

      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('cv_id', cvData.cv.id)
        .order('display_order', { ascending: true });

      setCVData(prev => ({
        ...prev,
        skills: skills || [],
      }));
      setOriginalData(prevData => ({
        ...prevData,
        skills: skills || [],
      }));
      setHasUnsavedChanges(() => {
        const cvChanged = JSON.stringify(cvData.cv) !== JSON.stringify(originalData.cv);
        const expChanged = JSON.stringify(cvData.experiences) !== JSON.stringify(originalData.experiences);
        const eduChanged = JSON.stringify(cvData.education) !== JSON.stringify(originalData.education);
        return cvChanged || expChanged || eduChanged;
      });
    } catch (error) {
      console.error('Error saving skills:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [cvData.cv, cvData.skills, originalData.skills, originalData.cv, originalData.experiences, originalData.education]);

  const saveAll = useCallback(async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveCV(),
        saveExperiences(),
        saveEducation(),
        saveSkills(),
      ]);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving all:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [saveCV, saveExperiences, saveEducation, saveSkills]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <CVContext.Provider
      value={{
        cvData,
        loading,
        saving,
        hasUnsavedChanges,
        loadCV,
        createCV,
        updateCVLocal,
        saveCV,
        addExperience,
        updateExperience,
        deleteExperience,
        saveExperiences,
        addEducation,
        updateEducation,
        deleteEducation,
        saveEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        saveSkills,
        saveAll,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}
