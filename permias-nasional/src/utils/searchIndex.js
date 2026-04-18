import { chapters } from '../data/chapters.js';
import { posts } from '../data/posts.js';
import { flattenResourcesForSearch } from '../data/resources.js';
import { flattenTeamForSearch } from '../data/team.js';

export function buildSearchIndex() {
  const chapterItems = chapters.map((c) => ({
    id: c.id,
    category: 'chapters',
    title: c.chapterName,
    subtitle: `${c.city}, ${c.state}`,
    href: `/chapters?state=${c.stateId}`,
    keywords: [c.chapterName, c.university, c.city, c.state, c.instagram],
  }));

  const postItems = posts.map((p) => ({
    id: p.id,
    category: 'events',
    title: p.title,
    subtitle: p.type,
    href: '/events',
    keywords: [p.title, p.description, ...(p.tags || [])],
  }));

  return [...chapterItems, ...flattenResourcesForSearch(), ...postItems, ...flattenTeamForSearch()];
}

export function searchIndex(query, index) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index.filter((item) => {
    const hay = [item.title, item.subtitle, ...(item.keywords || [])]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}
