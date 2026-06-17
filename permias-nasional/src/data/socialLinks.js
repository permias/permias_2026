import { SUPPORT_EMAIL } from './contactEmails.js';

export const socialLinks = [
  {
    id: 'instagram',
    href: 'https://www.instagram.com/permias.nasional/',
    titleKey: 'social.ig.title',
    handleKey: 'social.ig.handle',
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/permias.nasional',
    titleKey: 'social.fb.title',
    handleKey: 'social.fb.handle',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/company/permiasnasional',
    titleKey: 'social.li.title',
    handleKey: 'social.li.handle',
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw',
    titleKey: 'social.yt.title',
    handleKey: 'social.yt.handle',
  },
  {
    id: 'google-groups',
    href: 'https://groups.google.com/g/permias-nasional',
    titleKey: 'social.gg.title',
    handleKey: 'social.gg.handle',
  },
  {
    id: 'email',
    href: `mailto:${SUPPORT_EMAIL}`,
    titleKey: 'social.mail.title',
    handleKey: 'social.mail.handle',
  },
];
