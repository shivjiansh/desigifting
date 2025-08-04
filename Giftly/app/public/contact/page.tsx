import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-center text-gray-600 mb-8">
              Get in touch with our support team
            </p>
            <div className="space-y-4">
              <p><strong>Email:</strong> support@giftly.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Commerce St, Business City, BC 12345</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}