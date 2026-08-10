-- ============================================
-- NOSTOS — Add visibility column (public/unlisted/private)
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add visibility column to all 3 tables
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' NOT NULL;

ALTER TABLE public.topics
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' NOT NULL;

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' NOT NULL;

-- 2. Migrate existing data from is_private
UPDATE public.categories SET visibility = 'private' WHERE is_private = true;
UPDATE public.topics SET visibility = 'private' WHERE is_private = true;
UPDATE public.posts SET visibility = 'private' WHERE is_private = true;

-- 3. Add CHECK constraints
ALTER TABLE public.categories
  ADD CONSTRAINT categories_visibility_check
  CHECK (visibility IN ('public', 'private', 'unlisted'));

ALTER TABLE public.topics
  ADD CONSTRAINT topics_visibility_check
  CHECK (visibility IN ('public', 'private', 'unlisted'));

ALTER TABLE public.posts
  ADD CONSTRAINT posts_visibility_check
  CHECK (visibility IN ('public', 'private', 'unlisted'));

-- 4. Create indexes for visibility
CREATE INDEX IF NOT EXISTS idx_categories_visibility ON public.categories(visibility);
CREATE INDEX IF NOT EXISTS idx_topics_visibility ON public.topics(visibility);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON public.posts(visibility);

-- 5. Update RLS policies
-- Drop old SELECT policies
DROP POLICY IF EXISTS "Public categories visible to all" ON public.categories;
DROP POLICY IF EXISTS "Public topics visible to all" ON public.topics;
DROP POLICY IF EXISTS "Public posts visible to all" ON public.posts;

-- Create new SELECT policies:
-- public → everyone can see
-- unlisted → everyone can see (filtering from listings is done in app code)
-- private → only admin
CREATE POLICY "Categories visible by visibility"
  ON public.categories FOR SELECT
  USING (visibility IN ('public', 'unlisted') OR public.is_admin());

CREATE POLICY "Topics visible by visibility"
  ON public.topics FOR SELECT
  USING (visibility IN ('public', 'unlisted') OR public.is_admin());

CREATE POLICY "Posts visible by visibility"
  ON public.posts FOR SELECT
  USING (visibility IN ('public', 'unlisted') OR public.is_admin());
