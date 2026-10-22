// filepath: app/about/page.tsx
import { siteConfig } from "../../config/site";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section */}
      <section className="bg-ocean-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About {siteConfig.shortName}</h1>
        <p className="text-lg md:text-xl text-sand-200 max-w-2xl mx-auto">
          More than just a place to sleep. A community for surfers, travelers, and adventure seekers.
        </p>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-ocean-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Welcome to {siteConfig.name}! We created this space to share our passion for the ocean, 
              local culture, and meeting people from all over the world. 
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Whether you are catching your first wave, looking for a comfortable bed after a long day of exploring, 
              or wanting to share stories around the evening fire, you will find your home here.
            </p>
            <Link href="/#rooms" className="inline-block bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md">
              Stay With Us
            </Link>
          </div>
          <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/about-us.png" 
              alt="People surfing and hanging out" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}