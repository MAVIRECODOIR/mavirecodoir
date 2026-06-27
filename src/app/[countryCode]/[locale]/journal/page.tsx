import { sanityFetch, TAGS } from "@/lib/sanity/client";
import { journalPostsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  publishedAt: string | null;
  mainImage: any;
  categories: Array<{ title: string }> | null;
}

async function getPosts(): Promise<Post[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "your-project-id") return [];
  return sanityFetch.run<Post[]>(journalPostsQuery, {}, [TAGS.post, TAGS.journal]);
}

export const dynamic = "force-static";

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-16 md:pb-20">
        <div className="luxury-container">
          <div className="text-center max-w-2xl mx-auto">
            <span className="luxury-caption block mb-4">(Journal)</span>
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-medium tracking-[0.04em] leading-[1.05] mb-5">
              The Archive
            </h1>
            <p className="luxury-body text-brand-grey-500">
              Stories of craft, lineage, and the spaces between cultures.
            </p>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="pb-24 md:pb-32">
        <div className="luxury-container">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="luxury-body text-brand-grey-400">No journal entries yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/journal/${post.slug.current}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream mb-5">
                    {post.mainImage ? (
                      <img
                        src={urlFor(post.mainImage).width(800).height(600).url()}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-brand-grey-300">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      </div>
                    )}
                  </div>

                  {post.categories && post.categories.length > 0 && (
                    <span className="luxury-caption block mb-2">
                      {post.categories.map((c) => c.title).join(", ")}
                    </span>
                  )}

                  <h2 className="font-display text-lg md:text-xl font-medium tracking-[0.02em] leading-snug mb-2">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="luxury-body text-brand-grey-500 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] luxury-link">
                    Read More
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
