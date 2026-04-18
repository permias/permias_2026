/** Department tabs + members — photos use initials circles; optional imageUrl for future */

function m({ name, role, linkedin, bio, imageUrl, initials }) {
  const parts = name.split(' ');
  const ini =
    initials ||
    parts
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  return { name, role, linkedin: linkedin || null, bio: bio || '', imageUrl: imageUrl || null, initials: ini };
}

export const teamDepartments = [
  {
    id: 'executive',
    titleKey: 'team.dept.executive',
    members: [
      m({
        name: 'Axel Hutapea',
        role: 'President',
        linkedin: 'https://www.linkedin.com/',
        bio: 'Leads national strategy and chapter coordination.',
        imageUrl: 'https://placehold.co/320x320/CE1126/FFFFFF?text=AH',
      }),
      m({
        name: 'Kelly Soegiantoro',
        role: 'Vice President',
        linkedin: 'https://www.linkedin.com/',
        bio: 'Supports presidents council and internal operations.',
        imageUrl: 'https://placehold.co/320x320/CE1126/FFFFFF?text=KS',
      }),
      m({
        name: 'Raka Pratama',
        role: 'Secretary General',
        bio: 'Documentation, meetings, and chapter onboarding.',
        imageUrl: 'https://placehold.co/320x320/1A1A1A/FFFFFF?text=RP',
      }),
      m({
        name: 'Dewi Anggraini',
        role: 'Treasurer',
        bio: 'Budgeting, reimbursements, and fiscal compliance.',
        imageUrl: 'https://placehold.co/320x320/1A1A1A/FFFFFF?text=DA',
      }),
    ],
  },
  {
    id: 'academics',
    titleKey: 'team.dept.academics',
    members: [
      m({
        name: 'Bima Sakti',
        role: 'Director of Academics',
        bio: 'Scholarships, study skills, and faculty partnerships.',
        imageUrl: 'https://placehold.co/320x320/CE1126/FFFFFF?text=BS',
      }),
      m({
        name: 'Clarissa Wijaya',
        role: 'Academic Programs Lead',
        bio: 'Workshops and peer tutoring networks.',
        imageUrl: 'https://placehold.co/320x320/1A1A1A/FFFFFF?text=CW',
      }),
    ],
  },
  {
    id: 'orgdev',
    titleKey: 'team.dept.orgdev',
    members: [
      m({
        name: 'Farhan Malik',
        role: 'Director of Organizational Development',
        bio: 'Chapter health metrics and leadership pipelines.',
        imageUrl: 'https://placehold.co/320x320/CE1126/FFFFFF?text=FM',
      }),
      m({
        name: 'Siti Rahma',
        role: 'Chapter Success Manager',
        bio: 'Onboarding playbooks and regional meetups.',
        imageUrl: 'https://placehold.co/320x320/1A1A1A/FFFFFF?text=SR',
      }),
    ],
  },
  {
    id: 'prodev',
    titleKey: 'team.dept.prodev',
    members: [
      m({
        name: 'Nadia Kusuma',
        role: 'Director of Professional Development',
        bio: 'Career treks, employer relations, and alumni.',
        imageUrl: 'https://placehold.co/320x320/CE1126/FFFFFF?text=NK',
      }),
      m({
        name: 'Eko Prasetyo',
        role: 'Industry Partnerships Lead',
        bio: 'Sponsors and hiring partner programs.',
        imageUrl: 'https://placehold.co/320x320/1A1A1A/FFFFFF?text=EP',
      }),
    ],
  },
  {
    id: 'pubpromo',
    titleKey: 'team.dept.pubpromo',
    members: [
      m({
        name: 'Maya Putri',
        role: 'Director of Publications & Promotions',
        bio: 'Brand, campaigns, and creative direction.',
        imageUrl: 'https://placehold.co/320x320/CE1126/FFFFFF?text=MP',
      }),
      m({
        name: 'Jonatan Lim',
        role: 'Social Media Lead',
        bio: 'Content calendar and chapter spotlights.',
        imageUrl: 'https://placehold.co/320x320/1A1A1A/FFFFFF?text=JL',
      }),
    ],
  },
];

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
