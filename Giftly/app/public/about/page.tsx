import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Giftly</h1>
        <div className="max-w-3xl mx-auto text-lg text-gray-600 space-y-6">
          <p>
            Giftly is a multi-vendor marketplace that connects unique sellers with customers 
            looking for special gifts and products.
          </p>
          <p>
            Our platform enables sellers to showcase their products while providing buyers 
            with a seamless shopping experience.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}