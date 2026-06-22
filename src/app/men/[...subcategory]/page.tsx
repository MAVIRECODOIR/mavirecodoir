import CollectionPage from "../../[gender]/[[...subcategory]]/page";

export default async function MenCollectionPage({ params, searchParams }: { params: Promise<{ subcategory?: string[] }>; searchParams?: Promise<{ sort?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const wrappedParams = Promise.resolve({ gender: "men", subcategory: resolvedParams.subcategory });
  const wrappedSearchParams = resolvedSearchParams ? Promise.resolve(resolvedSearchParams) : undefined;
  return <CollectionPage params={wrappedParams} searchParams={wrappedSearchParams} />;
}
