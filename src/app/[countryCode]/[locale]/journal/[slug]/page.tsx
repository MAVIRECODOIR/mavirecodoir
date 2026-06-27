import { sanityFetch, TAGS } from "@/lib/sanity/client";
import { journalPostBySlugQuery, journalPathsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  body: any[] | null;
  publishedAt: string | null;
  mainImage: any;
  categories: Array<{ title: string }> | null;
}

async function getPost(slug: string): Promise<Post | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "your-project-id") return null;
  return sanityFetch.run<Post | null>(journalPostBySlugQuery, { slug }, [TAGS.post]);
}

export async function generateStaticParams() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "your-project-id") return [];
  const slugs = await sanityFetch.run<Array<{ slug: string }>>(journalPathsQuery, {}, [TAGS.post]);
  return slugs.map((s) => ({ slug: s.slug }));
}

export const dynamic = "force-static";

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article>
      {/* Hero image */}
      {post.mainImage && (
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <img
            src={urlFor(post.mainImage).width(1920).height(1080).url()}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      {/* Article header */}
      <header className="luxury-container pt-12 pb-8 md:pt-16 md:pb-10">
        {post.categories && post.categories.length > 0 && (
          <span className="luxury-caption block mb-3">
            {post.categories.map((c) => c.title).join(", ")}
          </span>
        )}

        <h1 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[0.04em] leading-[1.05] mb-4 max-w-3xl">
          {post.title}
        </h1>

        {publishedDate && (
          <time className="luxury-caption block opacity-60">{publishedDate}</time>
        )}

        {post.excerpt && (
          <p className="luxury-body text-brand-grey-500 mt-6 max-w-2xl text-lg leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Article body */}
      {post.body && post.body.length > 0 && (
        <div className="luxury-container pb-24 md:pb-32">
          <div className="max-w-2xl mx-auto prose">
            <PortableText
              value={post.body}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="luxury-body mb-6 leading-relaxed">{children}</p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-display text-xl md:text-2xl font-medium tracking-[0.02em] mt-12 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-display text-lg md:text-xl font-medium tracking-[0.02em] mt-10 mb-3">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-brand-black/20 pl-6 my-8 italic font-display text-lg opacity-80">
                      {children}
                    </blockquote>
                  ),
                },
                types: {
                  image: ({ value }: any) => (
                    <figure className="my-10">
                      <img
                        src={urlFor(value).width(1200).height(800).url()}
                        alt={value.alt || ""}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                      {value.alt && (
                        <figcaption className="luxury-caption text-center mt-3 opacity-60">
                          {value.alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                },
                marks: {
                  link: ({ children, value }: any) => (
                    <a
                      href={value.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:opacity-60 transition-opacity"
                    >
                      {children}
                    </a>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="luxury-body list-disc pl-6 mb-6 space-y-2">{children}</ul>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => <li>{children}</li>,
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="luxury-container pb-16">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] luxury-link"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 6L9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Journal
        </Link>
      </div>
    </article>
  );
}
