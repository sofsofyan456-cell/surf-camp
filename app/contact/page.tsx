
import { db } from "../../lib/db";
import { siteConfig } from "../../config/site";

export const instant = false;

export default async function ContactPage() {
  const dbConfig = await db.config.findUnique({
    where: { id: 1 },
  });

  const address =
    dbConfig?.address || siteConfig.contact.address;

  const email =
    dbConfig?.contactEmail || siteConfig.contact.email;

  const phone =
    dbConfig?.whatsappNumber || siteConfig.whatsappNumber;

  return (
    <div className="min-h-screen bg-sand-50 px-4 py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-turquoise-500 px-8 py-10 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Get in Touch
          </h1>
          <p className="text-lg font-medium text-ocean-900">
            We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:p-12">
          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                📍 Location
              </h3>
              <p className="text-lg font-semibold text-ocean-900">
                {address}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                ✉️ Email
              </h3>
              <a
                href={`mailto:${email}`}
                className="break-words text-lg font-semibold text-ocean-900 hover:underline"
              >
                {email}
              </a>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-400">
                📱 WhatsApp / Phone
              </h3>
              {phone ? (
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold text-ocean-900 hover:underline"
                >
                  +{phone}
                </a>
              ) : (
                <p className="text-sm text-red-500">
                  Number not configured yet.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl bg-sand-100 p-8 text-center">
            <h3 className="mb-4 text-xl font-bold text-ocean-900">
              Ready to Book?
            </h3>
            <p className="mb-6 text-gray-600">
              The fastest way to reach us and check availability is
              through our booking inquiry form.
            </p>
            <a
              href="/#rooms"
              className="rounded-lg bg-ocean-800 px-6 py-3 font-bold text-white transition-colors hover:bg-ocean-900"
            >
              Browse Rooms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
