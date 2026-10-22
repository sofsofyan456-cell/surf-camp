// filepath: app/activities/page.tsx
import { siteConfig } from "../../config/site";

// We define a small list of activities here
const activities = [
  {
    title: "Surf Lessons & Guiding",
    description: "From beginners to advanced surfers, our local instructors will take you to the best waves of the day.",
    image: "/surf-lesson.jpeg"
  },
  {
    title: "Sandboarding",
    description: "Slide down the massive coastal sand dunes. An unforgettable experience for adrenaline lovers.",
    image: "/sandboard.jpeg"
  },
  {
    title: "Sunset Quad Biking",
    description: "Explore the rugged coastline and beaches on a quad bike as the sun sets over the ocean.",
    image: "/quad.jpeg"
  },
  {
    title: "Souk El Had Visits",
    description: "Experience the vibrant local culture, spices, and crafts at one of the biggest traditional markets.",
    image: "/souk.jpeg"
  }
];

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      <section className="bg-ocean-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Adventures & Activities</h1>
        <p className="text-lg md:text-xl text-sand-200 max-w-2xl mx-auto">
          Make the most of your trip. Ask our team at the reception to book these experiences for you!
        </p>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-2/5 h-48 md:h-auto relative">
                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-ocean-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}