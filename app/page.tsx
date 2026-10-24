// filepath: app/page.tsx
import { db } from "../lib/db";
import { siteConfig } from "../config/site"; // We keep this for static stuff like currency
import BookingForm from "../components/BookingForm";
import Link from "next/link";

export const instant = false;

export default async function Home() {
  // Fetch data from our new database!
  const dbConfig = await db.config.findFirst({ where: { id: 1 } });
  const dbRooms = await db.room.findMany();

  // If DB is empty, use the fallback config
  const siteName = dbConfig?.name || siteConfig.name;
  const whatsapp = dbConfig?.whatsappNumber || siteConfig.whatsappNumber;
  const rooms = dbRooms.length > 0 ? dbRooms : siteConfig.rooms;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative h-[60vh] min-h-[500px] flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=2000')" }}
      >
        <div className="absolute inset-0 bg-ocean-900/40"></div>
        <div className="relative z-10 space-y-4 mt-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight">
            {siteName}
          </h1>
          <p className="text-xl md:text-2xl text-sand-50 font-medium drop-shadow-md">
            Comfort Stay, Better Waves
          </p>
        </div>
      </section>

      {/* 2. FLOATING BOOKING FORM */}
      <div className="px-4 -mt-16 relative z-20">
        <BookingForm rooms={rooms} whatsappNumber={whatsapp} shortName={siteConfig.shortName} />
      </div>

      {/* 3. OUR ROOMS SECTION */}
      <section id="rooms" className="py-20 px-4 max-w-7xl mx-auto w-full mt-10">
        <h2 className="text-4xl font-bold text-ocean-900 mb-10 text-center">
          Our Rooms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300">
              <div className="h-64 overflow-hidden relative">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-ocean-900">{room.name}</h3>
                <p className="text-gray-600 mt-2 mb-4 flex-grow">{room.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>🛏️ {room.beds}</span>
                  <span>•</span>
                  <span>👤 Up to {room.capacity} Guests</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="text-xl">
                    <span className="font-bold text-turquoise-600">{room.pricePerNight} {siteConfig.currency}</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <Link 
                    href={`/rooms/${room.id}`}
                    className="bg-ocean-800 hover:bg-ocean-900 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}