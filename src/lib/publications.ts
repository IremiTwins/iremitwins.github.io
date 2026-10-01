// src/lib/publications.ts — reads src/data/publications.bib at build time.
// A deliberately small BibTeX reader: handles @type{key, field = {value}, ...}
// with nested braces. Custom fields (summary, myrole, collab, ...) are kept.
import bibSource from '../data/publications.bib?raw';

export interface Author { family: string; given: string; isMe: boolean; isOthers: boolean }
export interface Publication {
  key: string;
  type: string;
  title: string;
  authors: Author[];
  authorCount: number;
  myPosition: number;           // 1-based position in the full author list
  journal: string;
  volume?: string;
  number?: string;
  pages?: string;
  year: number;
  doi: string;
  pmcid?: string;
  summary: string;
  myrole: string;
  collab: string;
  license: string;
  status: 'published' | 'preprint' | 'abstract';
  bibtex: string;               // the raw entry, for "copy BibTeX"
}

const ME = 'iremadze';

function readValue(src: string, i: number): [string, number] {
  // value is {…} (nested), "…", or a bare word/number
  if (src[i] === '{') {
    let depth = 0, j = i;
    for (; j < src.length; j++) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') { depth--; if (depth === 0) break; }
    }
    return [src.slice(i + 1, j), j + 1];
  }
  if (src[i] === '"') {
    const j = src.indexOf('"', i + 1);
    return [src.slice(i + 1, j), j + 1];
  }
  const m = /^[^,}\s]+/.exec(src.slice(i));
  return [m ? m[0] : '', i + (m ? m[0].length : 0)];
}

export function parseBibtex(src: string): Record<string, string>[] {
  const out: Record<string, string>[] = [];
  const entryRe = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src))) {
    const entry: Record<string, string> = { _type: m[1].toLowerCase(), _key: m[2] };
    let i = entryRe.lastIndex;
    const start = m.index;
    while (i < src.length) {
      while (/[\s,]/.test(src[i])) i++;
      if (src[i] === '}') { i++; break; }
      const f = /^([\w-]+)\s*=\s*/.exec(src.slice(i));
      if (!f) break;
      i += f[0].length;
      const [val, next] = readValue(src, i);
      entry[f[1].toLowerCase()] = val.replace(/\s+/g, ' ').trim();
      i = next;
    }
    entry._raw = src.slice(start, i).replace(/\n\s*(summary|myrole|collab|license|status|authorcount|myposition)\s*=.*(?=\n)/g, '');
    out.push(entry);
    entryRe.lastIndex = i;
  }
  return out;
}

function parseAuthors(s: string): Author[] {
  return s.split(/\s+and\s+/).map((a) => {
    if (a.trim() === 'others') return { family: 'et al.', given: '', isMe: false, isOthers: true };
    const [family, given = ''] = a.split(',').map((x) => x.trim());
    return { family, given, isMe: family.toLowerCase() === ME, isOthers: false };
  });
}

export const publications: Publication[] = parseBibtex(bibSource)
  .map((e) => {
    const authors = parseAuthors(e.author ?? '');
    const myIdx = authors.findIndex((a) => a.isMe);
    const hasOthers = authors.some((a) => a.isOthers);
    return {
      key: e._key,
      type: e._type,
      title: e.title,
      authors,
      authorCount: e.authorcount ? Number(e.authorcount) : authors.length,
      // when the list is abbreviated, the true position is unknown here
      myPosition: e.myposition ? Number(e.myposition) : hasOthers ? 0 : myIdx + 1,
      journal: e.journal ?? e.booktitle ?? '',
      volume: e.volume,
      number: e.number,
      pages: e.pages?.replace('--', '–'),
      year: Number(e.year),
      doi: e.doi,
      pmcid: e.pmcid,
      summary: e.summary ?? '',
      myrole: e.myrole ?? '',
      collab: e.collab ?? '',
      license: e.license ?? '',
      status: (e.status ?? 'published') as Publication['status'],
      bibtex: e._raw,
    };
  })
  .sort((a, b) => b.year - a.year);

/** Initials + family name, e.g. "S. K. Simmons" */
export const shortName = (a: Author) =>
  a.isOthers ? 'et al.' : `${a.given.split(/[\s.]+/).filter(Boolean).map((p) => p[0] + '.').join(' ')} ${a.family}`.trim();
