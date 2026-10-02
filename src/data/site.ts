// src/data/site.ts — names, links and navigation in one place.
// Edit text here and it updates in the header, footer and twin pages.

export const SITE = {
  name: 'Iremi Twins',
  url: 'https://iremitwins.com',
  email: 'hello@iremitwins.com',
  github: 'https://github.com/IremiTwins',
  repo: 'https://github.com/IremiTwins/iremitwins.github.io',
  description: 'Two brothers, one website: science, software, games and a lot of side projects.',
};

export type TwinId = 'nika' | 'gio';

export const TWINS: Record<TwinId, {
  id: TwinId;
  name: string;
  fullName: string;
  role: string;
  tagline: string;
  emoji: string;
  nav: { label: string; href: string }[];
}> = {
  nika: {
    id: 'nika',
    name: 'Nika',
    fullName: 'Nika Iremadze',
    role: 'Sequencing scientist & weekend maker',
    tagline: 'I turn chemistry into sequencing data by day and PLA into questionable gadgets by night.',
    emoji: '🧬',
    nav: [
      { label: 'Home', href: '/nika' },
      { label: 'Science', href: '/nika/science' },
      { label: 'Maker', href: '/nika/maker' },
      { label: 'Reviews', href: '/nika/reviews' },
      { label: 'Winery', href: '/nika/winery' },
      { label: 'Games', href: '/nika/games' },
      { label: 'About', href: '/nika/about' },
    ],
  },
  gio: {
    id: 'gio',
    name: 'Gio',
    fullName: 'Gio',
    role: 'Full-stack developer',
    tagline: 'Senior software engineer building .NET systems, desktop UI and fun side projects.',
    emoji: '🎮',
    nav: [
      { label: 'Home', href: '/gio' },
      { label: 'Reviews', href: '/gio/reviews' },
    ],
  },
};

export const MAIN_NAV = [
  { label: 'Nika', href: '/nika', twin: 'nika' as TwinId },
  { label: 'Gio', href: '/gio', twin: 'gio' as TwinId },
  { label: 'Blog', href: '/blog' },
];

// Nika's public profiles — shown on About and in structured data for search engines
export const NIKA_LINKS = {
  orcid: 'https://orcid.org/0000-0002-4977-204X',
  linkedin: 'https://www.linkedin.com/in/nika-iremadze-753846128',
  scholar: 'https://scholar.google.com/citations?user=ZhZt7vkAAAAJ',
};
