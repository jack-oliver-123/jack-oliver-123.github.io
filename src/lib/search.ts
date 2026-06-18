export type SearchDocument = {
  title: string;
  description: string;
  tags: string[];
  body: string;
  url: string;
  pubDate: string;
  dateLabel: string;
};

export type SearchResult = SearchDocument & {
  score: number;
  snippet: string;
};

export function normalizeSearchText(value = '') {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ').trim();
}

export function getSearchTerms(query: string) {
  return normalizeSearchText(query).split(' ').filter(Boolean);
}

export function cleanMarkdownForSearch(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, (codeBlock) => codeBlock.replace(/```\w*/g, ' '))
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~>#-]/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesTerm(value: string, term: string) {
  return normalizeSearchText(value).includes(term);
}

function scoreDocument(document: SearchDocument, terms: string[]) {
  const tagText = document.tags.join(' ');
  const bodyText = `${document.title} ${document.description} ${tagText} ${document.body}`;
  const matchedTerms = terms.filter((term) => includesTerm(bodyText, term));

  if (matchedTerms.length === 0) return 0;

  let score = 0;

  for (const term of matchedTerms) {
    if (includesTerm(document.title, term)) score += 18;
    if (document.tags.some((tag) => includesTerm(tag, term))) score += 12;
    if (includesTerm(document.description, term)) score += 8;
    if (includesTerm(document.body, term)) score += 3;
  }

  if (matchedTerms.length === terms.length) score += 10;
  if (includesTerm(document.title, terms.join(' '))) score += 8;

  return score;
}

export function createSearchSnippet(document: SearchDocument, terms: string[]) {
  const fallback = document.description || document.body;
  const source = document.description && terms.some((term) => includesTerm(document.description, term))
    ? document.description
    : document.body || document.description;
  const normalizedSource = normalizeSearchText(source);
  const firstMatch = terms
    .map((term) => normalizedSource.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstMatch === undefined) return fallback.slice(0, 96);

  const start = Math.max(0, firstMatch - 42);
  const end = Math.min(source.length, firstMatch + 86);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < source.length ? '…' : '';

  return `${prefix}${source.slice(start, end).trim()}${suffix}`;
}

export function searchDocuments(documents: SearchDocument[], query: string) {
  const terms = getSearchTerms(query);
  if (terms.length === 0) return [];

  return documents
    .map((document) => ({
      ...document,
      score: scoreDocument(document, terms),
      snippet: createSearchSnippet(document, terms),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.pubDate) - Date.parse(a.pubDate));
}
