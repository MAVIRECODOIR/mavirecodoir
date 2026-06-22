import { client } from "@/lib/sanity/client";
import { journalPostsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import HeroFullBleed from "../components/sections/HeroFullBleed";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import CategorySplit from "../components/sections/CategorySplit";
import EditorialBanner from "../components/sections/EditorialBanner";
import JournalSection from "../components/sections/JournalSection";
import ArchiveSection from "../components/sections/ArchiveSection";

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  mainImage: any;
  categories: Array<{ title: string }> | null;
}

async function getJournalEntries() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId || projectId === "your-project-id") return null;

  try {
    const posts: SanityPost[] = await client.fetch(journalPostsQuery);
    return posts.slice(0, 3).map((post) => ({
      title: post.title,
      description: post.excerpt || "",
      imageSrc: post.mainImage
        ? urlFor(post.mainImage).width(800).height(600).url()
        : "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&auto=format",
      href: `/journal/${post.slug.current}`,
      category: post.categories?.[0]?.title || undefined,
    }));
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const journalEntries = await getJournalEntries();

  const fallbackEntries = [
    {
      title: "Slow Fashion in a Fast World",
      description:
        "On the urgency of returning to considered making, limited runs, and the stories that justify each stitch.",
      imageSrc:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&auto=format",
      href: "/journal/slow-fashion",
      category: "Craft",
    },
    {
      title: "Sankofa: Looking Back to Move Forward",
      description:
        "The Akan symbol that animates our approach to heritage — recovering what matters before reimagining it.",
      imageSrc:
        "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=85&auto=format",
      href: "/journal/sankofa",
      category: "Philosophy",
    },
    {
      title: "Kente & the Language of Cloth",
      description:
        "How Ghana's woven stories inform the textures, patterns, and intentionality of the collection.",
      imageSrc:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=85&auto=format",
      href: "/journal/kente",
      category: "Textiles",
    },
  ];

  return (
    <>
      <HeroFullBleed
        imageSrc="https://cdn.mavirecodoir.com/brand/web-media/hero/gxGBTFS3NqzRZXXJyF039j1AQs.jpg"
        headline="Discover"
        ctaLabel="Our Story"
        ctaHref="/about"
        contentVariant="mavire"
        overlayColor="dark"
        textColor="white"
        textPosition="bottom-center"
      />

      <FeaturedProducts />

      <CategorySplit
        left={{
          title: "Explore Women",
          href: "/women",
          imageSrc:
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=85&auto=format",
          imageAlt: "Women's collection",
        }}
        right={{
          title: "Explore Men",
          href: "/men",
          imageSrc:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=85&auto=format",
          imageAlt: "Men's collection",
        }}
      />

      <EditorialBanner
        headline="World of MAVIRE"
        description="Japanese calm, Ghanaian soul — stories of craft, lineage, and modern luxury."
        ctaLabel="Discover More"
        ctaHref="/about"
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
            href: "/archive/001",
            number: "001",
          },
          {
            title: "Future Collections",
            description:
              "Notes toward coming seasons: silhouettes in development, fabric research, and cultural reference points.",
            imageSrc:
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85&auto=format",
            href: "/collections/future",
            number: "002",
          },
          {
            title: "Materials Library",
            description:
              "A living archive of textiles — Japanese cottons, Ghanaian prints, and the joinery between them.",
            imageSrc:
              "https://images.unsplash.com/photo-1604176424472-9d7e2a423e1a?w=800&q=85&auto=format",
            href: "/materials-library",
            number: "003",
          },
          {
            title: "Cultural Notes",
            description:
              "Essays, references, and marginalia on the intersections of Japanese and Ghanaian design philosophy.",
            imageSrc:
              "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=85&auto=format",
            href: "/journal/cultural-notes",
            number: "004",
          },
        ]}
      />
    </>
  );
}
