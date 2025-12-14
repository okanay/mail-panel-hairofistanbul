import DOMPurify from 'dompurify'

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'br', 'span', 'b', 'i', 'mark', 'sub', 'sup', 's', 'del'],
    ALLOWED_ATTR: ['class', 'data-style', 'style'],
    KEEP_CONTENT: true,
  })
}
