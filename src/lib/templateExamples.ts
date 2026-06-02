import { Database } from './supabase';

type CV = Database['public']['Tables']['cvs']['Row'];

export const templateExamples: Record<string, Partial<CV>> = {
  sidebarMode: {
    title: 'Exemple - Sidebar Mode',
    template: 'sidebarMode',
    color_theme: 'roseMarron',
    language: 'fr',
    personal_info: {
      full_name: 'Jean Diarassouba',
      email: 'jean.diarassouba@email.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      summary: 'Ingénieur logiciel passionné par la création de solutions innovantes. Spécialiste en développement web et mobile avec 5 ans d\'expérience.',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      qualities: ['Leadership', 'Innovation', 'Collaboration'],
      languages: ['Français - Natif', 'Anglais - Courant', 'Espagnol - Intermédiaire'],
      interests: ['Technologie', 'Voyages', 'Photographie']
    }
  },
  sidebarElegant: {
    title: 'Exemple - Sidebar Elegant',
    template: 'sidebarElegant',
    color_theme: 'ocreBeige',
    language: 'fr',
    personal_info: {
      full_name: 'Elvire Marchand',
      email: 'elvire.marchand@email.com',
      phone: '+33 6 98 76 54 32',
      location: 'Lyon, France',
      summary: 'Directrice marketing avec 8 ans d\'expérience. Spécialiste en stratégie digitale et branding.',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      qualities: ['Stratégie', 'Créativité', 'Gestion de projets'],
      languages: ['Français - Natif', 'Anglais - Courant'],
      interests: ['Marketing', 'Design', 'Entrepreneuriat']
    }
  },
  modern: {
    title: 'Exemple - Modern',
    template: 'modern',
    color_theme: 'blue',
    language: 'fr',
    personal_info: {
      full_name: 'Sophie Leclerc',
      email: 'sophie.leclerc@email.com',
      phone: '+33 6 11 22 33 44',
      location: 'Toulouse, France',
      summary: 'Développeuse full-stack créative. Passionnée par le design et le code de qualité.',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    }
  },
  classic: {
    title: 'Exemple - Classic',
    template: 'classic',
    color_theme: 'gray',
    language: 'fr',
    personal_info: {
      full_name: 'Marc Bernard',
      email: 'marc.bernard@email.com',
      phone: '+33 6 55 66 77 88',
      location: 'Bordeaux, France',
      summary: 'Consultant en management avec 12 ans d\'expérience dans les cabinets du top 3.'
    }
  },
  minimal: {
    title: 'Exemple - Minimal',
    template: 'minimal',
    color_theme: 'teal',
    language: 'fr',
    personal_info: {
      full_name: 'Thomas Dupont',
      email: 'thomas.dupont@email.com',
      phone: '+33 6 44 55 66 77',
      location: 'Lille, France',
      summary: 'Ingénieur data spécialisé en machine learning et big data.'
    }
  }
};

export const getTemplateExampleData = (template: string) => {
  return templateExamples[template] || templateExamples.sidebarMode;
};
