// filepath: app/admin/page.tsx
export const instant = false;
import { cookies } from "next/headers";
import { db } from "../../lib/db";
import { siteConfig } from "../../config/site";
import AdminDashboardClient from "./DashboardClient";
import LoginForm from "./LoginForm";
import { defaultActivities } from "../../lib/default-activities";
import { requireAdmin } from "../../lib/admin-auth";
export default async function AdminPage() {
const admin = await requireAdmin();

if (!admin) {
  return <LoginForm />;
}
  // Fetch all data from DB to give to our dashboard
  const dbConfig = await db.config.findFirst({ where: { id: 1 } });
  const dbRooms = await db.room.findMany();
  const dbActivities = await db.activity.findMany();

  const initialActivities =
    dbActivities.length > 0 ? dbActivities : defaultActivities;

  // Create a default config if DB is completely empty

const config = dbConfig || {
  name: siteConfig.name,
  whatsappNumber: siteConfig.whatsappNumber,
  address: siteConfig.contact.address,
  contactEmail: siteConfig.contact.email,
  heroImage:
    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=2000",
  heroText: "Comfort Stay, Better Waves",
  aboutTitle: "Our Story",
  aboutText1:
    "Welcome to Surf & Sand! We created this space to share our passion for the ocean...",
  aboutText2:
    "Whether you are catching your first wave, looking for a comfortable bed...",
  aboutImage: "/about-us.png",
};


  return (
    <AdminDashboardClient 
      initialConfig={config} 
      initialRooms={dbRooms.length > 0 ? dbRooms : siteConfig.rooms} 
      initialActivities={initialActivities} 
    />
  );
}