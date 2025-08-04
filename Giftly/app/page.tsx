import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CTA } from '@/components/ui/CTA';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">Giftly</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover unique gifts from trusted vendors around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/public/products"
                className="btn-primary text-lg px-8 py-3"
              >
                Shop Now
              </Link>
              <Link
                href="/seller"
                className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Giftly?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We bring together the best vendors to offer you an amazing shopping experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping from our trusted vendors</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All products are verified for quality and authenticity</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Selection</h3>
              <p className="text-gray-600">Discover one-of-a-kind gifts you won\'t find anywhere else</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most loved product categories
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', image: '/api/placeholder/300/200' },
              { name: 'Fashion', image: '/api/placeholder/300/200' },
              { name: 'Home & Garden', image: '/api/placeholder/300/200' },
              { name: 'Sports', image: '/api/placeholder/300/200' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/public/categories?category=${category.name.toLowerCase()}`}
                className="group block"
              >
                <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 group-hover:bg-gray-300 transition-colors flex items-center justify-center">
                    <span className="text-gray-500">Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}