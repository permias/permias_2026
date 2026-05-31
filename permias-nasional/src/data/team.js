/** Department tabs + members — photos use initials circles; optional imageUrl for future */

import teamData from './team.json';
import { resolveAssetUrl } from '../utils/site.js';

export const teamDepartments = teamData.map((dept) => ({
  ...dept,
  members: dept.members.map((mem) => ({
    ...mem,
    imageUrl: mem.imageUrl ? resolveAssetUrl(mem.imageUrl) : mem.imageUrl,
  })),
}));

export function flattenTeamForSearch() {
  return teamDepartments.flatMap((d) =>
    d.members.map((mem) => ({
      id: `${d.id}-${mem.name}`,
      category: 'team',
      title: mem.name,
      subtitle: mem.role,
      href: '/team',
      keywords: [mem.name, mem.role, d.id, mem.hometown].filter(Boolean),
    })),
  );
}
