/** Department tabs + members — photos use initials circles; optional imageUrl for future */

import teamData from './team.json';

export const teamDepartments = teamData;

export function flattenTeamForSearch() {
  return teamDepartments.flatMap((d) =>
    d.members.map((mem) => ({
      id: `${d.id}-${mem.name}`,
      category: 'team',
      title: mem.name,
      subtitle: mem.role,
      href: '/team',
      keywords: [mem.name, mem.role, d.id],
    })),
  );
}
