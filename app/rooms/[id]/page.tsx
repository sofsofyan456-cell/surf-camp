// filepath: app/rooms/[id]/page.tsx
import { siteConfig } from "../../../config/site";
import BookingForm from "../../../components/BookingForm";
import Link from "next/link";
import { notFound } from "next/navigation";

// --- NEW CODE ---
// This tells Next.js exactly which pages to build in advance!
export function generateStaticParams() {
  return siteConfig.rooms.map((room) => ({
    id: room.id,
  }));
}
// ----------------

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 16, params is a Promise, so we must await it
  const resolvedParams = await params;
  const roomId = resolvedParams.id;
  
  // Find the room data based on the URL id
  const room = siteConfig.rooms.find((r) => r.id === roomId);

  // If the user types a bad URL, show a 404 page
  if (!room) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Back button */}
        <Link href="/#rooms" className="text-turquoise-600 hover:text-turquoise-500 font-semibold flex items-center gap-2 mb-6">
          ← Back to all rooms
        </Link>

        {/* Room Header and Image */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="h-[400px] md:h-[500px] relative">
            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
              <div>
                <h1 className="text-4xl font-bold text-ocean-900">{room.name}</h1>
                <p className="text-gray-500 mt-2 flex items-center gap-4">
                  <span>🛏️ {room.beds}</span>
                  <span>👥 Up to {room.capacity} Guests</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-3xl font-bold text-turquoise-600">
                {room.pricePerNight} <span className="text-lg text-gray-500 font-normal">{siteConfig.currency} / night</span>
              </div>
            </div>
            
            <hr className="my-6 border-gray-100" />
            
            <h2 className="text-2xl font-semibold text-ocean-900 mb-4">About this room</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {room.description}
            </p>
          </div>
        </div>

        {/* Pre-filled Booking Form */}
        <h2 className="text-2xl font-bold text-ocean-900 mb-6 text-center">Book the {room.name}</h2>
        <BookingForm initialRoomId={room.id} />
        
      </div>
    </div>
  );
}