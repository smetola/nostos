-- ============================================
-- NOSTOS — Database Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. HELPER FUNCTION: is_admin()
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- 3. CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_emoji TEXT DEFAULT '📁',
  color_hex TEXT DEFAULT '#6366f1',
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  is_private BOOLEAN DEFAULT false NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_private ON public.categories(is_private);

-- ============================================
-- 4. TOPICS
-- ============================================
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  is_private BOOLEAN DEFAULT false NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(category_id, slug)
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_topics_category ON public.topics(category_id);
CREATE INDEX idx_topics_slug ON public.topics(slug);
CREATE INDEX idx_topics_private ON public.topics(is_private);

-- ============================================
-- 5. POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_md TEXT DEFAULT '' NOT NULL,
  excerpt TEXT,
  is_private BOOLEAN DEFAULT false NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_posts_topic ON public.posts(topic_id);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_private ON public.posts(is_private);
CREATE INDEX idx_posts_published ON public.posts(published_at DESC);
CREATE INDEX idx_posts_featured ON public.posts(is_featured) WHERE is_featured = true;

-- ============================================
-- 6. TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color_hex TEXT DEFAULT '#8b5cf6'
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_tags_slug ON public.tags(slug);

-- ============================================
-- 7. POST_TAGS (Junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_post_tags_post ON public.post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON public.post_tags(tag_id);

-- ============================================
-- 8. RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated USING (public.is_admin());

-- CATEGORIES
CREATE POLICY "Public categories visible to all"
  ON public.categories FOR SELECT
  USING (is_private = false OR public.is_admin());

CREATE POLICY "Admin full access to categories"
  ON public.categories FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admin update categories"
  ON public.categories FOR UPDATE
  TO authenticated USING (public.is_admin());

CREATE POLICY "Admin delete categories"
  ON public.categories FOR DELETE
  TO authenticated USING (public.is_admin());

-- TOPICS
CREATE POLICY "Public topics visible to all"
  ON public.topics FOR SELECT
  USING (is_private = false OR public.is_admin());

CREATE POLICY "Admin full access to topics"
  ON public.topics FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admin update topics"
  ON public.topics FOR UPDATE
  TO authenticated USING (public.is_admin());

CREATE POLICY "Admin delete topics"
  ON public.topics FOR DELETE
  TO authenticated USING (public.is_admin());

-- POSTS
CREATE POLICY "Public posts visible to all"
  ON public.posts FOR SELECT
  USING (is_private = false OR public.is_admin());

CREATE POLICY "Admin full access to posts"
  ON public.posts FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admin update posts"
  ON public.posts FOR UPDATE
  TO authenticated USING (public.is_admin());

CREATE POLICY "Admin delete posts"
  ON public.posts FOR DELETE
  TO authenticated USING (public.is_admin());

-- TAGS
CREATE POLICY "Tags visible to all"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to tags"
  ON public.tags FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admin update tags"
  ON public.tags FOR UPDATE
  TO authenticated USING (public.is_admin());

CREATE POLICY "Admin delete tags"
  ON public.tags FOR DELETE
  TO authenticated USING (public.is_admin());

-- POST_TAGS
CREATE POLICY "Post tags visible to all"
  ON public.post_tags FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to post_tags"
  ON public.post_tags FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete post_tags"
  ON public.post_tags FOR DELETE
  TO authenticated USING (public.is_admin());

-- ============================================
-- 9. AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_topics
  BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_posts
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 10. SEED DATA (Optional — example categories)
-- ============================================
-- Uncomment and run after setting up your admin user:
/*
INSERT INTO public.categories (name, slug, icon_emoji, color_hex, position_x, position_y) VALUES
  ('Filosofía', 'filosofia', '🏛️', '#8b5cf6', -300, -200),
  ('Salud', 'salud', '💪', '#10b981', 300, -100),
  ('Geopolítica', 'geopolitica', '🌍', '#f59e0b', 0, 300),
  ('Tecnología', 'tecnologia', '⚡', '#3b82f6', -200, 200),
  ('Fe y Espiritualidad', 'fe', '✝️', '#ec4899', 200, -300);
*/
