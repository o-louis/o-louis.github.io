import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: 'Oriane - Blog',
    description:
      'Notes on frontend engineering, Vue, TypeScript, and building UI under constraints.',
    // `site` comes from astro.config.mjs and is guaranteed here.
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/posts/${post.id}/`,
    })),
  });
}
