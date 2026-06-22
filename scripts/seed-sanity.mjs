import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "9m5mm3gf",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function createDoc(doc) {
  const result = await client.create(doc);
  console.log(`  Created: ${doc._type} "${doc.title || doc.name}" -> ${result._id}`);
  return result;
}

async function main() {
  console.log("Seeding Sanity...\n");

  const categories = await Promise.all([
    createDoc({
      _type: "category",
      title: "Craft",
      description: "Articles on craftsmanship, making, and material practice.",
    }),
    createDoc({
      _type: "category",
      title: "Philosophy",
      description: "The ideas and cultural references behind the collection.",
    }),
    createDoc({
      _type: "category",
      title: "Textiles",
      description: "Exploring fabric heritage, techniques, and innovation.",
    }),
    createDoc({
      _type: "category",
      title: "Culture",
      description: "Essays on the intersections of Japanese and Ghanaian design.",
    }),
  ]);

  const [craft, philosophy, textiles, culture] = categories;

  console.log("\nCreating posts...\n");

  await createDoc({
    _type: "post",
    title: "Slow Fashion in a Fast World",
    slug: { _type: "slug", current: "slow-fashion-in-a-fast-world" },
    excerpt:
      "On the urgency of returning to considered making, limited runs, and the stories that justify each stitch.",
    publishedAt: "2026-06-10T08:00:00Z",
    categories: [{ _type: "reference", _ref: craft._id }],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The fashion industry produces over 100 billion garments annually. Most will be discarded within a year. Slow fashion proposes a radical alternative — not as a rejection of style, but as a return to meaning.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "The Case for Fewer, Better Things" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "At MAVIRE CODOIR, we believe luxury is not abundance but discernment. Each piece is conceived in limited runs — not as artificial scarcity, but as a commitment to intentionality. When you know that only a small number of a given design will ever exist, the act of acquiring becomes more deliberate, and the garment itself more treasured.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Stories in Every Stitch" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Every garment in our collection carries a reference — a Kente pattern reimagined, a Japanese indigo dye technique, a silhouette drawn from archival research. We document these references because they matter. They transform a piece of clothing from a commodity into a conversation across cultures and generations.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This is what we mean by slow fashion: not a trend, but a temperament. An insistence that what we wear should be worthy of the time it took to make, and the time we will spend in it.",
          },
        ],
      },
    ],
  });

  await createDoc({
    _type: "post",
    title: "Sankofa: Looking Back to Move Forward",
    slug: { _type: "slug", current: "sankofa-looking-back-to-move-forward" },
    excerpt:
      "The Akan symbol that animates our approach to heritage — recovering what matters before reimagining it.",
    publishedAt: "2026-06-08T08:00:00Z",
    categories: [{ _type: "reference", _ref: philosophy._id }],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Sankofa is an Akan word from Ghana, represented by a bird with its feet planted forward and its head turned backward, carrying an egg in its beak. It means: 'It is not taboo to go back and fetch what you forgot.'",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "The Egg as Possibility" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The egg in the Sankofa bird's beak represents the future — fragile, unhatched, full of potential. The bird's backward glance is not nostalgia; it is retrieval. It is the act of recovering the knowledge, techniques, and cultural expressions that can nourish something new.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This philosophy animates everything we make. When we work with Ghanaian weavers or reference Japanese boro stitching, we are not appropriating — we are learning. We are turning our heads back to see what wisdom the past holds for the future we are building.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Design as Retrieval" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "In practice, Sankofa means that every collection begins with research. We study the material cultures of Ghana and Japan — two traditions defined by patience, precision, and a reverence for material. We ask: what can be carried forward? What deserves to survive?",
          },
        ],
      },
      {
        "_type": "block",
        "style": "blockquote",
        "children": [
          {
            "_type": "span",
            "text": "\"The past is not a burden. It is a seed bank.\" — MAVIRE CODOIR",
          },
        ],
      },
    ],
  });

  await createDoc({
    _type: "post",
    title: "Kente & the Language of Cloth",
    slug: { _type: "slug", current: "kente-and-the-language-of-cloth" },
    excerpt:
      "How Ghana's woven stories inform the textures, patterns, and intentionality of the collection.",
    publishedAt: "2026-06-05T08:00:00Z",
    categories: [
      { _type: "reference", _ref: textiles._id },
      { _type: "reference", _ref: culture._id },
    ],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Kente is not merely a textile. It is a system of communication — a woven language in which every pattern, colour, and arrangement carries specific meaning. Originating with the Asante people of Ghana, Kente cloth was traditionally worn by royalty and reserved for occasions of great significance.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Reading the Cloth" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Gold represents royalty and spiritual purity. Green signifies growth and renewal. Blue speaks to the sky and the divine. Black, the colour of the earth, represents spiritual energy and the ancestors. When these colours are woven together in specific patterns, the cloth becomes a statement — a visual philosophy encoded in thread.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Kente in the Collection" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "In our collections, we do not reproduce Kente patterns literally. Instead, we translate their logic — the intentionality of colour, the rhythm of repetition, the relationship between thread and meaning. A stripe in a MAVIRE CODOIR jacket may carry the same interval as an Adwinasa pattern, rendered in the vocabulary of Japanese cotton.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This is the language of cloth as we understand it: a dialogue between traditions, separated by geography but united in their reverence for the made object.",
          },
        ],
      },
    ],
  });

  await createDoc({
    _type: "post",
    title: "Wabi-Sabi and the Beauty of Imperfection",
    slug: { _type: "slug", current: "wabi-sabi-and-the-beauty-of-imperfection" },
    excerpt:
      "The Japanese aesthetic that finds beauty in impermanence, imperfection, and the incomplete — and its resonance with Ghanaian design philosophy.",
    publishedAt: "2026-06-03T08:00:00Z",
    categories: [
      { _type: "reference", _ref: philosophy._id },
      { _type: "reference", _ref: culture._id },
    ],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Wabi-sabi is the Japanese worldview centred on the acceptance of transience and imperfection. Derived from Buddhist teachings, it sees beauty in the asymmetrical, the cracked, the weathered — in objects that bear the evidence of time.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Two Traditions, One Insight" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Remarkably, this philosophy finds a parallel in Ghanaian aesthetics, where the concept of 'ntoro' — the spiritual essence passed through generations — values the marks of use and age as evidence of a life well lived. A worn leather bag, a frayed hem, the patina on brass: these are not flaws but inscriptions.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "At MAVIRE CODOIR, wabi-sabi guides our approach to material selection and finishing. We favour natural fibres that age gracefully. We design for longevity, knowing that the garment will become more beautiful as it accumulates the marks of its wearer's life.",
          },
        ],
      },
    ],
  });

  console.log("\nDone! Created 4 posts and 4 categories.");
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
