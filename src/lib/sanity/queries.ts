export const journalPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->{title}
}`;

export const journalPostBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  body,
  publishedAt,
  mainImage,
  categories[]->{title}
}`;

export const journalPathsQuery = `*[_type == "post" && defined(slug.current)][] {
  "slug": slug.current
}`;
