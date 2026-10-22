// filepath: app/contact/page.tsx
import { siteConfig } from "../../config/site";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-sand-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-turquoise-500 py-10 px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Get in Touch</h1>
          <p className="text-ocean-900 font-medium text-lg">We would love to hear from you.</p>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">📍 Location</h3>
              <p className="text-ocean-900 font-semibold text-lg">{siteConfig.contact.address}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">✉️ Email</h3>
              <p className="text-ocean-900 font-semibold text-lg">{siteConfig.contact.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">📱 WhatsApp / Phone</h3>
              {siteConfig.whatsappNumber ? (
                <p className="text-ocean-900 font-semibold text-lg">+{siteConfig.whatsappNumber}</p>
              ) : (
                <p className="text-red-500 text-sm">Number not configured yet.</p>
              )}
            </div>
          </div>

          {/* Contact Action */}
          <div className="bg-sand-100 p-8 rounded-xl flex flex-col justify-center text-center">
            <h3 className="text-xl font-bold text-ocean-900 mb-4">Ready to Book?</h3>
            <p className="text-gray-600 mb-6">
              The fastest way to reach us and check availability is through our booking inquiry form.
            </p>
            <a 
              href="/#rooms" 
              className="bg-ocean-800 hover:bg-ocean-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Rooms
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}