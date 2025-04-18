
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { Link } from "react-router-dom";

// Define the sports data
const sportsData = [
  {
    id: 1,
    name: "Football",
    description: "Book football grounds for 5-a-side, 7-a-side, or full 11-a-side matches.",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80",
    facilities: ["Indoor", "Outdoor", "Turf", "Grass"],
    popularTimes: ["Weekday Evenings", "Weekend Mornings"]
  },
  {
    id: 2,
    name: "Cricket",
    description: "Find cricket pitches and nets for practice or match play.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1647&q=80",
    facilities: ["Indoor Nets", "Outdoor Pitch", "Training Facility"],
    popularTimes: ["Weekend All Day", "Weekday Afternoons"]
  },
  {
    id: 3,
    name: "Basketball",
    description: "Book indoor or outdoor basketball courts for games or practice.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80",
    facilities: ["Indoor Court", "Outdoor Court", "Half Court"],
    popularTimes: ["After School Hours", "Weekend Evenings"]
  },
  {
    id: 4,
    name: "Badminton",
    description: "Reserve badminton courts for singles or doubles play.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1650&q=80",
    facilities: ["Indoor Courts", "Professional Floors", "Lighting"],
    popularTimes: ["Weekday Evenings", "Weekend Mornings"]
  }
];

const Sports = () => {
  const [selectedSport, setSelectedSport] = useState<number | null>(null);

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sports Categories</h1>
          <p className="text-xl max-w-2xl mx-auto">Choose your favorite sport and find the perfect venue for your game or practice session.</p>
        </div>
      </section>

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {sportsData.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id === selectedSport ? null : sport.id)}
                className={`p-4 rounded-lg shadow-md transition-all duration-200 text-left ${
                  sport.id === selectedSport 
                    ? "bg-primary text-white scale-105" 
                    : "bg-white hover:shadow-lg hover:scale-105"
                }`}
              >
                <img 
                  src={sport.image} 
                  alt={sport.name} 
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold">{sport.name}</h2>
              </button>
            ))}
          </div>

          {selectedSport && (
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 animate-in fade-in">
              {sportsData
                .filter((sport) => sport.id === selectedSport)
                .map((sport) => (
                  <div key={sport.id} className="md:flex gap-8">
                    <img 
                      src={sport.image} 
                      alt={sport.name} 
                      className="rounded-lg w-full md:w-1/3 h-64 object-cover mb-6 md:mb-0"
                    />
                    <div className="md:w-2/3">
                      <h2 className="text-2xl font-bold mb-4">{sport.name}</h2>
                      <p className="text-muted-foreground mb-6">{sport.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Available Facilities</h3>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {sport.facilities.map((facility, index) => (
                              <li key={index}>{facility}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Popular Booking Times</h3>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {sport.popularTimes.map((time, index) => (
                              <li key={index}>{time}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/grounds?sport=${sport.name.toLowerCase()}`}
                        className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg inline-block transition-colors"
                      >
                        View Available Grounds
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Sports;
