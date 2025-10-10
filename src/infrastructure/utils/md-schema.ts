// rehype-sanitize の許可スキーマを拡張（table/aside を通す）
export const sanitizeSchema = {
  tagNames: [
    'a', 'b', 'i', 'em', 'strong', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'aside', 'blockquote'
  ],
  attributes: {
    a: ['href', 'title', 'target', 'rel'],
    th: ['colspan', 'rowspan', 'align'],
    td: ['colspan', 'rowspan', 'align'],
    table: ['align'],
    aside: ['className']
  }
};
