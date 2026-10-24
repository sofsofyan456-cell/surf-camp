
// filepath: app/about/page.tsx

import { Suspense } from "react";
import { db } from "../../lib/db";
import { siteConfig } from "../../config/site";
import Link from "next/link";

async function AboutContent() {
  const dbConfig = await db.config.findFirst({
    where: { id: 1 },
  });

  const siteName = dbConfig?.name || siteConfig.name;
  const title = dbConfig?.aboutTitle || "Our Story";
  const text1 = dbConfig?.aboutText1 || "Welcome to our camp!";
  const text2 = dbConfig?.aboutText2 || "We are happy to host you.";
  const image = dbConfig?.aboutImage || "/about-us.png";

  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-ocean-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          About {siteName}
        </h1>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-ocean-900 mb-6">
              {title}
            </h2>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {text1}
            </p>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {text2}
            </p>

            <Link
              href="/#rooms"
              className="inline-block bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
            >
              Stay With Us
            </Link>
          </div>

          <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={image}
              alt="About us"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sand-50 flex items-center justify-center">
          <p className="text-ocean-900">Loading about page...</p>
        </div>
      }
    >
      <AboutContent />
    </Suspense>
  );
}
