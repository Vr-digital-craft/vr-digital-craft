-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: the very first signed-in user can claim admin while no admin exists
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SITE TEXTS
CREATE TABLE public.site_texts (
  key text PRIMARY KEY,
  group_name text NOT NULL DEFAULT 'Général',
  label text NOT NULL,
  help text,
  value text NOT NULL DEFAULT '',
  field_type text NOT NULL DEFAULT 'text',
  position integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_texts TO authenticated;
GRANT ALL ON public.site_texts TO service_role;
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site texts are public" ON public.site_texts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site texts" ON public.site_texts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_texts_updated_at BEFORE UPDATE ON public.site_texts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SECTIONS
CREATE TABLE public.site_sections (
  key text PRIMARY KEY,
  label text NOT NULL,
  visible boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_sections TO authenticated;
GRANT ALL ON public.site_sections TO service_role;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sections are public" ON public.site_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage sections" ON public.site_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_sections_updated_at BEFORE UPDATE ON public.site_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Monitor',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are public" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '#contact',
  image_url text NOT NULL DEFAULT '',
  image_alt text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are public" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROCESS STEPS
CREATE TABLE public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number text NOT NULL DEFAULT '01',
  icon text NOT NULL DEFAULT 'MessagesSquare',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.process_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.process_steps TO authenticated;
GRANT ALL ON public.process_steps TO service_role;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Steps are public" ON public.process_steps FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage steps" ON public.process_steps FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER process_steps_updated_at BEFORE UPDATE ON public.process_steps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- WHY POINTS
CREATE TABLE public.why_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.why_points TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.why_points TO authenticated;
GRANT ALL ON public.why_points TO service_role;
ALTER TABLE public.why_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Points are public" ON public.why_points FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage points" ON public.why_points FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER why_points_updated_at BEFORE UPDATE ON public.why_points FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- STATS
CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL,
  label text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stats TO authenticated;
GRANT ALL ON public.stats TO service_role;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stats are public" ON public.stats FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage stats" ON public.stats FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER stats_updated_at BEFORE UPDATE ON public.stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BEFORE / AFTER
CREATE TABLE public.comparison_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  side text NOT NULL DEFAULT 'before',
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comparison_items_side_check CHECK (side IN ('before','after'))
);
GRANT SELECT ON public.comparison_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comparison_items TO authenticated;
GRANT ALL ON public.comparison_items TO service_role;
ALTER TABLE public.comparison_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comparison is public" ON public.comparison_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage comparison" ON public.comparison_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER comparison_items_updated_at BEFORE UPDATE ON public.comparison_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRICING
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  cta text NOT NULL DEFAULT 'Choisir',
  featured boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
GRANT ALL ON public.pricing_plans TO service_role;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pricing is public" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage pricing" ON public.pricing_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are public" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAQ
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faq is public" ON public.faq_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage faq" ON public.faq_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONTACT REQUESTS
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  project_type text,
  budget text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'nouveau',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a request" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage requests" ON public.contact_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER contact_requests_updated_at BEFORE UPDATE ON public.contact_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MEDIA
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  path text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage media" ON public.media_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SEED CONTENT
INSERT INTO public.site_sections (key, label, visible, position) VALUES
  ('hero','Accroche (Hero)',true,1),
  ('services','Services',true,2),
  ('work','Réalisations',true,3),
  ('before_after','Avant / Après',true,4),
  ('process','Comment ça marche',true,5),
  ('why','À propos / Chiffres clés',true,6),
  ('pricing','Tarifs',true,7),
  ('testimonials','Témoignages',true,8),
  ('contact','Contact',true,9),
  ('faq','FAQ',true,10);

INSERT INTO public.site_texts (key, group_name, label, help, value, field_type, position) VALUES
  ('brand_name','Identité','Nom (partie 1)','Affiché en gros dans le logo','VR','text',1),
  ('brand_suffix','Identité','Nom (partie 2)','Affiché à côté du logo','Studio','text',2),
  ('footer_tagline','Identité','Phrase du pied de page',NULL,'Créateur de sites web pour les professionnels.','text',3),
  ('footer_legal','Identité','Mention de copyright',NULL,'© VR Studio — Tous droits réservés','text',4),
  ('hero_eyebrow','Accroche','Petit titre au-dessus',NULL,'Création de sites web','text',1),
  ('hero_title_line1','Accroche','Titre — ligne 1',NULL,'Besoin d''un','text',2),
  ('hero_title_line2','Accroche','Titre — ligne 2 (en jaune)',NULL,'site web ?','text',3),
  ('hero_subtitle','Accroche','Texte d''introduction',NULL,'Je crée des sites modernes, rapides et efficaces pour les entreprises, artisans, restaurants et commerces.','textarea',4),
  ('hero_cta','Accroche','Texte du bouton',NULL,'Contactez-moi','text',5),
  ('hero_image_url','Accroche','Image principale','Adresse de l''image (médiathèque)','/img/hero-devices.jpg','image',6),
  ('hero_image_alt','Accroche','Description de l''image','Utile pour Google et l''accessibilité','Site internet responsive affiché sur un ordinateur portable, une tablette et un smartphone','text',7),
  ('services_eyebrow','Services','Petit titre',NULL,'Mes services','text',1),
  ('services_title_line1','Services','Titre — ligne 1',NULL,'Des solutions web','text',2),
  ('services_title_line2','Services','Titre — ligne 2 (en gris)',NULL,'adaptées à votre activité','text',3),
  ('services_link_label','Services','Texte du lien en bas',NULL,'Découvrir tous les services','text',4),
  ('work_eyebrow','Réalisations','Petit titre',NULL,'Réalisations','text',1),
  ('work_title','Réalisations','Titre',NULL,'Ils m''ont fait confiance','text',2),
  ('ba_eyebrow','Avant / Après','Petit titre',NULL,'Avant / Après','text',1),
  ('ba_title_line1','Avant / Après','Titre — ligne 1',NULL,'Votre activité mérite mieux','text',2),
  ('ba_title_line2','Avant / Après','Titre — ligne 2 (en gris)',NULL,'qu''une simple présence en ligne.','text',3),
  ('ba_before_label','Avant / Après','Libellé colonne gauche',NULL,'Avant','text',4),
  ('ba_after_label','Avant / Après','Libellé colonne droite',NULL,'Après','text',5),
  ('ba_before_image','Avant / Après','Image « avant »',NULL,'/img/before-old.jpg','image',6),
  ('ba_after_image','Avant / Après','Image « après »',NULL,'/img/after-new.jpg','image',7),
  ('process_eyebrow','Comment ça marche','Petit titre',NULL,'Comment ça marche ?','text',1),
  ('process_title','Comment ça marche','Titre',NULL,'Cinq étapes, zéro surprise.','text',2),
  ('why_eyebrow','À propos','Petit titre',NULL,'À propos','text',1),
  ('why_title','À propos','Titre',NULL,'Un site pensé pour votre activité.','text',2),
  ('pricing_eyebrow','Tarifs','Petit titre',NULL,'Tarifs','text',1),
  ('pricing_title','Tarifs','Titre',NULL,'Des offres simples et transparentes.','text',2),
  ('pricing_note','Tarifs','Note sous les offres',NULL,'Chaque projet étant différent, un devis personnalisé est réalisé avant le début de la création.','textarea',3),
  ('pricing_badge','Tarifs','Badge de l''offre mise en avant',NULL,'Populaire','text',4),
  ('testimonials_eyebrow','Témoignages','Petit titre',NULL,'Témoignages','text',1),
  ('testimonials_title','Témoignages','Titre',NULL,'Ils en parlent mieux que moi.','text',2),
  ('contact_eyebrow','Contact','Petit titre',NULL,'Contact','text',1),
  ('contact_title','Contact','Titre',NULL,'Vous avez un projet ?','text',2),
  ('contact_title_neon','Contact','Titre en jaune',NULL,'Parlons-en.','text',3),
  ('contact_subtitle','Contact','Texte d''introduction',NULL,'Expliquez-moi votre projet et je vous répondrai rapidement.','textarea',4),
  ('contact_button','Contact','Texte du bouton d''envoi',NULL,'Envoyer ma demande','text',5),
  ('contact_success','Contact','Message de confirmation',NULL,'Merci ! Je vous réponds très rapidement.','textarea',6),
  ('faq_eyebrow','FAQ','Petit titre',NULL,'FAQ','text',1),
  ('faq_title','FAQ','Titre',NULL,'Les questions fréquentes.','text',2),
  ('contact_phone','Coordonnées','Téléphone affiché',NULL,'06 00 00 00 00','text',1),
  ('contact_phone_link','Coordonnées','Téléphone (format lien)','Sans espaces, ex. +33600000000','+33600000000','text',2),
  ('contact_email','Coordonnées','Adresse e-mail',NULL,'contact@vrstudio.fr','text',3),
  ('contact_zone','Coordonnées','Zone d''intervention',NULL,'Toulouse et alentours','text',4),
  ('contact_zone_note','Coordonnées','Précision sous la zone',NULL,'France à distance','text',5),
  ('footer_cta','Coordonnées','Bouton du pied de page',NULL,'Demander un devis','text',6),
  ('social_instagram','Réseaux sociaux','Lien Instagram','Laissez vide pour masquer','https://instagram.com','text',1),
  ('social_facebook','Réseaux sociaux','Lien Facebook','Laissez vide pour masquer','https://facebook.com','text',2),
  ('social_linkedin','Réseaux sociaux','Lien LinkedIn','Laissez vide pour masquer','https://linkedin.com','text',3),
  ('seo_title','SEO','Titre Google (60 caractères max)',NULL,'Création Site Internet Toulouse | VR Studio','text',1),
  ('seo_description','SEO','Description Google (160 caractères max)',NULL,'Création de sites internet modernes pour artisans, restaurants, commerçants et entreprises. Sites vitrines, refonte et solutions web sur mesure.','textarea',2),
  ('seo_og_image','SEO','Image de partage','Adresse complète en https pour les réseaux sociaux','','image',3),
  ('seo_area','SEO','Zone géographique',NULL,'Toulouse, France','text',4);

INSERT INTO public.services (icon, title, description, position) VALUES
  ('Monitor','Sites vitrines','Présentez votre activité avec un site professionnel, moderne et efficace.',1),
  ('UtensilsCrossed','Restaurants','Menus en ligne, réservation, présentation de votre établissement et de vos spécialités.',2),
  ('Hammer','Artisans & commerçants','Mettez en avant votre savoir-faire et attirez plus de clients localement.',3),
  ('Code2','Web apps & outils','Des solutions web sur mesure pour automatiser et simplifier votre quotidien.',4);

INSERT INTO public.projects (name, category, description, url, image_url, image_alt, position) VALUES
  ('La Fée Maison','Restaurant','Menu en ligne, réservation et présentation de la maison.','#contact','/img/work-restaurant.jpg','Site internet de restaurant',1),
  ('Bâtiment Toulousain','Artisan Maçon','Vitrine de chantiers, savoir-faire et demandes de devis.','#contact','/img/work-macon.jpg','Site internet d''artisan maçon',2),
  ('Jardin d''Éden','Paysagiste','Galerie de réalisations et prise de contact simplifiée.','#contact','/img/work-paysagiste.jpg','Site internet de paysagiste',3),
  ('Ô Douceur','Institut de beauté','Prestations, tarifs et réservation en quelques clics.','#contact','/img/work-beaute.jpg','Site internet d''institut de beauté',4);

INSERT INTO public.process_steps (step_number, icon, title, description, position) VALUES
  ('01','MessagesSquare','Échange','Nous discutons de votre projet, de vos besoins et de vos objectifs.',1),
  ('02','PenTool','Maquette','Je crée une maquette adaptée à votre activité et à votre image.',2),
  ('03','Code2','Développement','Je développe votre site avec soin, rapidité et optimisation.',3),
  ('04','CheckCircle2','Validation','Vous validez le site et j''apporte les derniers ajustements.',4),
  ('05','Rocket','Mise en ligne','Votre site est en ligne. Je reste disponible pour la suite.',5);

INSERT INTO public.why_points (label, position) VALUES
  ('Design personnalisé',1),('Compatible mobile',2),('Site rapide',3),('Référencement local',4),
  ('Accompagnement humain',5),('Modifications possibles',6),('Maintenance disponible',7),('Site adapté à votre métier',8);

INSERT INTO public.stats (value, label, position) VALUES
  ('100 %','Responsive',1),
  ('24/7','Votre site travaille pour vous',2),
  ('< 3 sec','Objectif de chargement',3);

INSERT INTO public.comparison_items (side, label, position) VALUES
  ('before','Page Facebook uniquement',1),
  ('before','Informations difficiles à trouver',2),
  ('before','Design non professionnel',3),
  ('before','Mauvaise expérience mobile',4),
  ('before','Peu visible sur Google',5),
  ('after','Site professionnel',1),
  ('after','Informations accessibles immédiatement',2),
  ('after','Design moderne',3),
  ('after','Compatible mobile',4),
  ('after','Référencement local',5),
  ('after','Contact en un clic',6);

INSERT INTO public.pricing_plans (name, price, features, cta, featured, position) VALUES
  ('Essentiel','À partir de 490 €',ARRAY['Site vitrine','Jusqu''à 5 pages','Responsive','Formulaire de contact','Mise en ligne'],'Choisir Essentiel',false,1),
  ('Premium','À partir de 890 €',ARRAY['Jusqu''à 10 pages','Design personnalisé','Responsive','Référencement local','Formulaire avancé','Animations','Mise en ligne'],'Choisir Premium',true,2),
  ('Sur mesure','Sur devis',ARRAY['Fonctionnalités personnalisées','Web App','Réservation','Automatisation','Interface d''administration','Accompagnement personnalisé'],'Parler de mon projet',false,3);

INSERT INTO public.testimonials (quote, author, role, position) VALUES
  ('Valentin a créé notre site en comprenant immédiatement notre univers. Le résultat est moderne, simple et exactement comme nous le souhaitions.','La Fée Maison','Restaurant',1),
  ('Un accompagnement clair du début à la fin. Je reçois aujourd''hui des demandes de devis directement depuis le site.','Bâtiment Toulousain','Artisan Maçon',2),
  ('Le site est rapide, très beau sur téléphone, et mes clientes trouvent enfin les informations sans m''appeler.','Ô Douceur','Institut de beauté',3);

INSERT INTO public.faq_items (question, answer, position) VALUES
  ('Combien coûte la création d''un site internet ?','Un site vitrine démarre à 490 €. Le tarif dépend du nombre de pages, du design et des fonctionnalités souhaitées. Un devis clair est réalisé avant de commencer.',1),
  ('Combien de temps faut-il pour créer un site ?','Comptez en général 1 à 3 semaines pour un site vitrine, selon la rapidité de transmission de vos contenus (textes, photos, logo).',2),
  ('Puis-je modifier mon site moi-même ?','Oui. Je peux mettre en place une interface simple pour modifier vos textes, photos, horaires ou menus, et je vous forme à son utilisation.',3),
  ('Mon site sera-t-il compatible avec les téléphones ?','Toujours. Chaque site est conçu d''abord pour le mobile, puis adapté à la tablette et à l''ordinateur.',4),
  ('Pouvez-vous refaire mon site actuel ?','Oui, la refonte est l''une de mes prestations principales : nouveau design, meilleures performances, et conservation de votre référencement existant.',5),
  ('Est-ce que vous vous occupez de la mise en ligne ?','Oui : nom de domaine, hébergement, certificat de sécurité et mise en ligne sont gérés de A à Z.',6),
  ('Proposez-vous la maintenance du site ?','Oui, une formule de maintenance est disponible : mises à jour, sauvegardes, sécurité et petites modifications.',7),
  ('Est-ce que mon site sera visible sur Google ?','Chaque site est optimisé pour le référencement local : structure propre, balises, vitesse et fiche établissement.',8);