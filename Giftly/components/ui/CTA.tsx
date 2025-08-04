import Link from 'next/link';

export function CTA() {
  return (
    <section className="bg-primary-600 text-white py-16">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Selling?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of sellers already earning on Giftly
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Start Selling Today
          </Link>
          <Link
            href="/public/how-it-works"
            className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}