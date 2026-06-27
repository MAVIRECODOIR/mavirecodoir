import { sanityFetch, TAGS } from "@/lib/sanity/client";
import { journalPostsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import HeroFullBleed from "@/components/sections/HeroFullBleed";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategorySplit from "@/components/sections/CategorySplit";
import EditorialBanner from "@/components/sections/EditorialBanner";
import JournalSection from "@/components/sections/JournalSection";
import ArchiveSection from "@/components/sections/ArchiveSection";

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  mainImage: any;
  categories: Array<{ title: string }> | null;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ countryCode: string; locale: string }>;
}) {
  const { countryCode, locale } = await params;

  async function getJournalEntries() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId || projectId === "your-project-id") return null;

    try {
      const posts: SanityPost[] = await sanityFetch.run(journalPostsQuery, {}, [TAGS.post, TAGS.journal]);
      return posts.slice(0, 3).map((post) => ({
        title: post.title,
        description: post.excerpt || "",
        imageSrc: post.mainImage
          ? urlFor(post.mainImage).width(800).height(600).url()
          : "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&auto=format",
        href: `/${countryCode}/${locale}/journal/${post.slug.current}`,
        category: post.categories?.[0]?.title || undefined,
      }));
    } catch {
      return null;
    }
  }

  const journalEntries = await getJournalEntries();

  const fallbackEntries = [
    {
      title: "Slow Fashion in a Fast World",
      description:
        "On the urgency of returning to considered making, limited runs, and the stories that justify each stitch.",
      imageSrc:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&auto=format",
      href: `/${countryCode}/${locale}/journal/slow-fashion`,
      category: "Craft",
    },
    {
      title: "Sankofa: Looking Back to Move Forward",
      description:
        "The Akan symbol that animates our approach to heritage — recovering what matters before reimagining it.",
      imageSrc:
        "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=85&auto=format",
      href: `/${countryCode}/${locale}/journal/sankofa`,
      category: "Philosophy",
    },
    {
      title: "Kente & the Language of Cloth",
      description:
        "How Ghana's woven stories inform the textures, patterns, and intentionality of the collection.",
      imageSrc:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=85&auto=format",
      href: `/${countryCode}/${locale}/journal/kente`,
      category: "Textiles",
    },
  ];

  return (
    <>
      <HeroFullBleed
        videoSrc="https://videos.pexels.com/video-files/9849786/9849786-uhd_1440_2732_25fps.mp4"
        imageSrc="https://cdn.mavirecodoir.com/brand/web-media/hero/gxGBTFS3NqzRZXXJyF039j1AQs.jpg"
        headline="Discover"
        ctaLabel="Our Story"
        ctaHref={`/${countryCode}/${locale}/about`}
        contentVariant="mavire"
        overlayColor="dark"
        textColor="white"
        textPosition="bottom-center"
      />

      <FeaturedProducts />

      <CategorySplit
        left={{
          title: "Explore Women",
          href: `/${countryCode}/${locale}/women`,
          imageSrc:
            "https://cdn.mavirecodoir.com/content-media/pexels-beniam-447198297-28344511.jpg",
          imageAlt: "Women's collection",
        }}
        right={{
          title: "Explore Men",
          href: `/${countryCode}/${locale}/men`,
          imageSrc:
            "https://cdn.mavirecodoir.com/content-media/pexels-derrick-fencher-1677272333-27915205.jpg",
          imageAlt: "Men's collection",
        }}
      />

      <EditorialBanner
        headline="The World of Mavire"
        description="Japanese calm, Ghanaian soul — stories of craft, lineage, and modern luxury."
        ctaLabel="Discover More"
        ctaHref={`/${countryCode}/${locale}/about`}
        imageSrc="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=85&auto=format"
        layout="full-bleed"
        textColor="white"
      />

      <JournalSection entries={journalEntries ?? fallbackEntries} />

      <ArchiveSection
        entries={[
          {
            title: "Archive 001",
            description:
              "The first numbered collection — a record of beginnings, material trials, and creative intent.",
            imageSrc:
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=85&auto=format",
            href: `/${countryCode}/${locale}/archive/001`,
            number: "001",
          },
          {
            title: "Future Collections",
            description:
              "Notes toward coming seasons: silhouettes in development, fabric research, and cultural reference points.",
            imageSrc:
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85&auto=format",
            href: `/${countryCode}/${locale}/collections/future`,
            number: "002",
          },
          {
            title: "Materials Library",
            description:
              "A living archive of textiles — Japanese cottons, Ghanaian prints, and the joinery between them.",
            imageSrc:
              "https://images.unsplash.com/photo-1776164909194-bad9461153fa?w=800&q=85&auto=format",
            href: `/${countryCode}/${locale}/materials-library`,
            number: "003",
          },
          {
            title: "The Atelier",
            description:
              "A record of process — from early sketches and fabric studies to the evolving language of form, texture, and craft.",
            imageSrc:
              "https://images.unsplash.com/photo-1761808070450-438147124f9b?w=800&q=85&auto=format",
            href: `/${countryCode}/${locale}/journal/cultural-notes`,
            number: "004",
          },
        ]}
      />
    </>
  );
}
