// ============================================
// NOSTOS — Utility Functions
// ============================================

/**
 * Generate a URL-safe slug from a string.
 * Handles Spanish characters (ñ, accents, etc.)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');         // Remove leading/trailing hyphens
}

/**
 * Format a date string to a human-readable Spanish format.
 * Example: "3 ago 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date to a full format.
 * Example: "3 de agosto de 2026"
 */
export function formatDateFull(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date to relative time (hace X días, etc.)
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

/**
 * Generate an excerpt from Markdown content.
 * Strips markdown syntax and truncates.
 */
export function generateExcerpt(markdown: string, maxLength: number = 160): string {
  const plainText = markdown
    .replace(/#{1,6}\s+/g, '')          // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1')     // Bold
    .replace(/\*(.+?)\*/g, '$1')         // Italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // Links
    .replace(/`{1,3}[^`]*`{1,3}/g, '')  // Code
    .replace(/>\s+/g, '')                // Blockquotes
    .replace(/[-*+]\s+/g, '')            // Lists
    .replace(/\n+/g, ' ')               // Newlines
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * Conditional CSS class joiner (like clsx but tiny)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
