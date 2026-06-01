-- Extension des templates et palettes NovaCV

ALTER TABLE cvs DROP CONSTRAINT IF EXISTS cvs_template_check;
ALTER TABLE cvs DROP CONSTRAINT IF EXISTS cvs_color_theme_check;

-- Migration des anciennes valeurs
UPDATE cvs SET template = 'europeenModerne' WHERE template = 'modern';
UPDATE cvs SET template = 'classiqueSobre' WHERE template = 'classic';
UPDATE cvs SET template = 'executifSenior' WHERE template = 'executive';
UPDATE cvs SET template = 'atsMinimaliste' WHERE template IN ('minimal', 'ats');

UPDATE cvs SET color_theme = 'bleuClassique' WHERE color_theme = 'blue';
UPDATE cvs SET color_theme = 'grisAnthracite' WHERE color_theme = 'gray';
UPDATE cvs SET color_theme = 'turquoise' WHERE color_theme = 'teal';
UPDATE cvs SET color_theme = 'vertEmeraude' WHERE color_theme = 'green';
UPDATE cvs SET color_theme = 'bordeaux' WHERE color_theme = 'red';

ALTER TABLE cvs ALTER COLUMN template SET DEFAULT 'europeenModerne';
ALTER TABLE cvs ALTER COLUMN color_theme SET DEFAULT 'bleuClassique';

ALTER TABLE cvs ADD CONSTRAINT cvs_template_check CHECK (
  template IN (
    'europeenModerne',
    'atsMinimaliste',
    'corporateAmerica',
    'developpeurTech',
    'elegantCreatif',
    'classiqueSobre',
    'africainProfessionnel',
    'moderneSidebar',
    'executifSenior',
    'moderneTimeline',
    'creativDesignMarketing',
    'internationalMulticolonne'
  )
);

ALTER TABLE cvs ADD CONSTRAINT cvs_color_theme_check CHECK (
  color_theme IN (
    'bleuClassique',
    'bleuMarine',
    'vertEmeraude',
    'noirBlanc',
    'bordeaux',
    'grisAnthracite',
    'violet',
    'beige',
    'turquoise',
    'orangeProfessionnel',
    'indigoModerne'
  )
);
