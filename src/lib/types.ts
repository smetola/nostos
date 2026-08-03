// ============================================
// NOSTOS — Core Data Types
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_emoji: string | null;
  color_hex: string;
  position_x: number;
  position_y: number;
  is_private: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  position_x: number;
  position_y: number;
  is_private: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  posts_count?: number;
}

export interface Post {
  id: string;
  topic_id: string;
  title: string;
  slug: string;
  content_md: string;
  excerpt: string | null;
  is_private: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  // Joined
  topic?: Topic & { category?: Category };
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color_hex: string | null;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface Profile {
  id: string;
  is_admin: boolean;
  display_name: string | null;
  created_at: string;
}

// ============================================
// API / Query helpers
// ============================================

export interface PostWithRelations extends Post {
  topic: Topic & {
    category: Category;
  };
  tags: Tag[];
}

export interface CategoryWithTopics extends Category {
  topics: (Topic & { posts_count: number })[];
}

export interface TopicWithPosts extends Topic {
  category: Category;
  posts: Post[];
}
