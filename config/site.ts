// filepath: config/site.ts

export const siteConfig = {
  name: "Surf & Sand Camp",
  shortName: "Surf & Sand",
  description: "Experience the ultimate surf stay on the coast. Comfortable rooms, great vibes, and epic waves.",
  // We will leave the WhatsApp number empty for now. You can add it later!
  whatsappNumber: "212650224546", 
  currency: "MAD",
  contact: {
    email: "youssefalhyan@gmail.com",
    address: "123 Coastal Road, Taghazout, Morocco", 
  },
  rooms: [
    {
      id: "double-room",
      name: "Double Room",
      description: "A comfortable private room featuring one large double bed, perfect for couples or solo travelers wanting extra privacy.",
      capacity: 2,
      beds: "1 Double Bed",
      pricePerNight: 450,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "twin-room",
      name: "Twin Room",
      description: "A private room with two separate single beds, ideal for friends traveling together.",
      capacity: 2,
      beds: "2 Single Beds",
      pricePerNight: 450,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "dorm-5",
      name: "Dorm for 5",
      description: "Shared dormitory with 5 beds. A great way to meet fellow surfers and travelers.",
      capacity: 5,
      beds: "5 Single/Bunk Beds",
      pricePerNight: 150,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "dorm-6",
      name: "Dorm for 6",
      description: "Spacious shared dormitory with 6 beds. Lockers provided for secure storage.",
      capacity: 6,
      beds: "6 Single/Bunk Beds",
      pricePerNight: 140,
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
    }
  ]
};
