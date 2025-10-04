import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-lg text-center">
        <h1 className="mb-4 font-heading text-9xl font-bold tracking-wider text-gray-900">
          404
        </h1>
        <h2 className="mb-6 font-heading text-3xl font-bold uppercase tracking-wider text-gray-900 md:text-4xl">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg text-gray-700">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link href="/collections/new-arrivals">
            <Button variant="secondary" size="lg">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
