/**
 * Instagram-style feature posts (home “Stories” grid). Add post-5.png, post-6.png, … under /public/images/posts/
 */
import { publicUrl } from '../utils/site.js';

export const instagramPosts = [
  {
    id: 'post1',
    image: publicUrl('/images/posts/post-1.png'),
    titleKey: 'home.posts.post1',
    href: 'https://www.instagram.com/permias.nasional/',
  },
  {
    id: 'post2',
    image: publicUrl('/images/posts/post-2.png'),
    titleKey: 'home.posts.post2',
    href: 'https://www.instagram.com/permias.nasional/',
  },
  {
    id: 'post3',
    image: publicUrl('/images/posts/post-3.png'),
    titleKey: 'home.posts.post3',
    href: 'https://www.instagram.com/permias.nasional/',
  },
  {
    id: 'post4',
    image: publicUrl('/images/posts/post-4.png'),
    titleKey: 'home.posts.post4',
    href: 'https://www.instagram.com/permias.nasional/',
  },
];
