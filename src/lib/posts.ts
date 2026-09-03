import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Published posts, newest first. Drafts are kept in dev and dropped from the build. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  // Frontmatter dates parse as midnight UTC; without this the build machine's
  // timezone can render the previous day.
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return formatter.format(date);
}

/** Machine-readable date for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
