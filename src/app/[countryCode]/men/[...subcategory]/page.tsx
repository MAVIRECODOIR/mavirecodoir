// This file was a wrapper for the deleted [gender] route
// It needs to be recreated with proper collection logic
export default async function MenCollectionPage({ params }: { params: Promise<{ subcategory?: string[] }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Men collection page - subcategory: {resolvedParams.subcategory?.join('/') || 'all'}</p>
    </div>
  );
}
