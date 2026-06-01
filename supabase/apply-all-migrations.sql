-- Collez dans Supabase → SQL Editor → Run (migration templates premium)

ALTER TABLE cvs DROP CONSTRAINT IF EXISTS cvs_template_check;
ALTER TABLE cvs DROP CONSTRAINT IF EXISTS cvs_color_theme_check;

UPDATE cvs SET template = 'resumeIoStyle' WHERE template IN (
  'modern', 'europeenModerne', 'atsMinimaliste', 'corporateAmerica', 'ats', 'minimal'
);
UPDATE cvs SET template = 'canvaPremium' WHERE template IN (
  'executive', 'executifSenior', 'africainProfessionnel', 'moderneSidebar'
);
UPDATE cvs SET template = 'novoresume' WHERE template IN (
  'classic', 'classiqueSobre', 'internationalMulticolonne'
);
UPDATE cvs SET template = 'enhancv' WHERE template IN (
  'elegantCreatif', 'creativDesignMarketing', 'moderneTimeline'
);
UPDATE cvs SET template = 'reactiveResume' WHERE template = 'developpeurTech';

UPDATE cvs SET color_theme = 'bleuModerne' WHERE color_theme IN ('blue', 'bleuClassique');
UPDATE cvs SET color_theme = 'anthracite' WHERE color_theme IN ('gray', 'grisAnthracite');
UPDATE cvs SET color_theme = 'vertEmeraude' WHERE color_theme IN ('green', 'teal', 'turquoise');
UPDATE cvs SET color_theme = 'bordeaux' WHERE color_theme IN ('red', 'orangeProfessionnel');
UPDATE cvs SET color_theme = 'beigePremium' WHERE color_theme = 'beige';
UPDATE cvs SET color_theme = 'violetProfessionnel' WHERE color_theme IN ('violet', 'indigoModerne');

ALTER TABLE cvs ALTER COLUMN template SET DEFAULT 'resumeIoStyle';
ALTER TABLE cvs ALTER COLUMN color_theme SET DEFAULT 'bleuModerne';

ALTER TABLE cvs ADD CONSTRAINT cvs_template_check CHECK (
  template IN ('resumeIoStyle', 'canvaPremium', 'novoresume', 'enhancv', 'reactiveResume')
);

ALTER TABLE cvs ADD CONSTRAINT cvs_color_theme_check CHECK (
  color_theme IN (
    'bleuModerne', 'bleuMarine', 'noirBlanc', 'vertEmeraude',
    'bordeaux', 'anthracite', 'beigePremium', 'violetProfessionnel'
  )
);
