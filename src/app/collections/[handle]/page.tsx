import { redirect } from "next/navigation";

const handleToFriendly: Record<string, string> = {
  // Men
  "men": "/men",
  "men-outerwear": "/men/outerwear",
  "men-jackets": "/men/jackets",
  "men-shirts": "/men/shirts",
  "men-t-shirts": "/men/t-shirts",
  "men-denim": "/men/denim",
  "men-knitwear": "/men/knitwear",
  "men-trousers": "/men/trousers",
  "men-new-arrivals": "/men/new",
  // Women
  "women": "/women",
  "women-outerwear": "/women/outerwear",
  "women-dresses": "/women/dresses",
  "women-tops": "/women/tops",
  "women-knitwear": "/women/knitwear",
  "women-trousers": "/women/trousers",
  "women-skirts": "/women/skirts",
  "women-denim": "/women/denim",
  "women-new-arrivals": "/women/new",
  // Unisex
  "unisex": "/unisex",
  "unisex-outerwear": "/unisex/outerwear",
  "unisex-knitwear": "/unisex/knitwear",
  // Accessories shared
  "accessories": "/accessories",
  // Archive
  "archive": "/archive",
};

export default async function CollectionsHandlePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const friendly = handleToFriendly[handle];
  if (friendly) {
    redirect(friendly);
  }
  // If unknown handle, send home for now; could also notFound()
  redirect("/");
}
