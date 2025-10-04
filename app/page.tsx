export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-bold tracking-tight">
              MAVIRE CODOIR
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#new" className="text-sm tracking-wide hover:text-gray-600 transition-colors">New Arrivals</a>
              <a href="#collections" className="text-sm tracking-wide hover:text-gray-600 transition-colors">Collections</a>
              <a href="#sustainability" className="text-sm tracking-wide hover:text-gray-600 transition-colors">Sustainability</a>
              <a href="#about" className="text-sm tracking-wide hover:text-gray-600 transition-colors">About</a>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-sm tracking-wide hover:text-gray-600 transition-colors">Search</button>
              <button className="text-sm tracking-wide hover:text-gray-600 transition-colors">Cart (0)</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-8">
            Luxury Meets
            <br />
            <span className="text-gray-600">Sustainability</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience premium sustainable fashion that doesn&apos;t compromise on style or ethics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#collections"
              className="px-8 py-4 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              Shop Collections
            </a>
            <a
              href="#sustainability"
              className="px-8 py-4 border border-black text-black text-sm tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mb-4 text-4xl">🌱</div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Materials</h3>
              <p className="text-gray-600">Ethically sourced, eco-conscious fabrics that minimize environmental impact.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">✨</div>
              <h3 className="text-xl font-semibold mb-3">Timeless Design</h3>
              <p className="text-gray-600">Carefully crafted pieces designed to last beyond seasonal trends.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Fair Production</h3>
              <p className="text-gray-600">Supporting fair wages and ethical working conditions throughout our supply chain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section id="collections" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-center">Featured Collections</h2>
          <p className="text-gray-600 text-center mb-16 text-lg">Discover our curated selection of sustainable luxury</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 mb-4 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                <span className="text-6xl">👔</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Spring/Summer 2025</h3>
              <p className="text-gray-600">Lightweight, breathable pieces for warmer days</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-300 to-gray-400 mb-4 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                <span className="text-6xl">🧥</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Essential Wardrobe</h3>
              <p className="text-gray-600">Timeless pieces that form the foundation of sustainable style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Our Commitment</h2>
          <p className="text-xl text-gray-600 mb-12">
            Every piece we create is a step towards a more sustainable future. 
            We believe luxury fashion should nurture both people and planet.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm text-gray-600">Sustainable Materials</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Carbon</div>
              <div className="text-sm text-gray-600">Neutral Shipping</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Fair</div>
              <div className="text-sm text-gray-600">Trade Certified</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Zero</div>
              <div className="text-sm text-gray-600">Waste Production</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Stay Connected</h2>
          <p className="text-gray-400 mb-8">Be the first to know about new collections and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-xl font-bold mb-4">MAVIRE CODOIR</div>
              <p className="text-gray-400 text-sm">Luxury sustainable fashion for the conscious consumer.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider">SHOP</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider">ABOUT</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider">SUPPORT</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 MAVIRE CODOIR. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
