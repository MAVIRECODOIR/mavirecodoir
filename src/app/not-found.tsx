import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-brand-cream overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85&auto=format"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center">
        <h1 className="luxury-heading-xl text-white mb-6">404</h1>
        <h2 className="luxury-heading-lg text-white mb-4">Page Not Found</h2>
        <p className="luxury-body text-white/90 max-w-md mb-12">
          The page you are looking for does not exist or has been moved. 
          Let us guide you back to the world of MAVIRE.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/"
            className="luxury-btn-secondary-inversed"
          >
            Return Home
          </Link>
          <Link
            href="/collections"
            className="luxury-btn-secondary-inversed"
          >
            Browse Collections
          </Link>
        </div>
      </div>

      {/* Decorative bottom element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50 z-10"></div>
    </div>
  );
}
