
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Clock, Users, Filter } from "lucide-react";

// Simulated grounds data
const groundsData = [
  {
    id: 1,
    name: "Green Valley Stadium",
    sport: "football",
    price: 80,
    image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
    address: "123 Sports Avenue, Stadium District",
    rating: 4.8,
    totalRatings: 156,
    type: "Outdoor Grass",
    capacity: "22 players",
    amenities: ["Changing Rooms", "Floodlights", "Parking", "Spectator Seating"],
    availability: "8:00 AM - 10:00 PM"
  },
  {
    id: 2,
    name: "Central Sports Hub",
    sport: "football",
    price: 65,
    image: "https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "45 Central Park Road, Downtown",
    rating: 4.5,
    totalRatings: 89,
    type: "Indoor Turf",
    capacity: "12 players",
    amenities: ["Air Conditioning", "Changing Rooms", "Water Dispenser"],
    availability: "6:00 AM - 11:00 PM"
  },
  {
    id: 3,
    name: "Urban 5-a-side Arena",
    sport: "football",
    price: 50,
    image: "https://images.unsplash.com/photo-1565373677923-479921fb77d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "78 Urban Lane, City Center",
    rating: 4.2,
    totalRatings: 64,
    type: "Outdoor Turf",
    capacity: "10 players",
    amenities: ["Floodlights", "Parking"],
    availability: "4:00 PM - 10:00 PM"
  },
  {
    id: 4,
    name: "Cricket Oval",
    sport: "cricket",
    price: 120,
    image: "https://images.unsplash.com/photo-1554178286-2d4133387b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "256 Boundary Road, Sports Village",
    rating: 4.9,
    totalRatings: 112,
    type: "Outdoor Grass",
    capacity: "30 players",
    amenities: ["Changing Rooms", "Scoreboard", "Pavilion", "Equipment Rental"],
    availability: "9:00 AM - 6:00 PM"
  },
  {
    id: 5,
    name: "Indoor Cricket Nets",
    sport: "cricket",
    price: 40,
    image: "https://images.unsplash.com/photo-1599391398131-c82b569a773b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
    address: "101 Training Complex, East District",
    rating: 4.3,
    totalRatings: 78,
    type: "Indoor",
    capacity: "6 players per net",
    amenities: ["Bowling Machine", "Ball Speed Monitor", "Water Cooler"],
    availability: "7:00 AM - 9:00 PM"
  },
  {
    id: 6,
    name: "Downtown Basketball Court",
    sport: "basketball",
    price: 55,
    image: "https://images.unsplash.com/photo-1505666287802-931a7e7b0f28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
    address: "320 Hoops Street, West Side",
    rating: 4.6,
    totalRatings: 93,
    type: "Indoor Court",
    capacity: "10 players",
    amenities: ["Scoreboard", "Locker Rooms", "Shower Facilities"],
    availability: "8:00 AM - 10:00 PM"
  },
  {
    id: 7,
    name: "Elite Badminton Center",
    sport: "badminton",
    price: 35,
    image: "https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "47 Racquet Avenue, Sportsville",
    rating: 4.7,
    totalRatings: 124,
    type: "Indoor Court",
    capacity: "4 players per court",
    amenities: ["Professional Flooring", "Equipment Rental", "Coaching Available", "Air Conditioning"],
    availability: "6:00 AM - 11:00 PM"
  },
  {
    id: 8,
    name: "Community Basketball Park",
    sport: "basketball",
    price: 0,
    image: "https://images.unsplash.com/photo-1613312328068-c9b6b76c9b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    address: "500 Community Drive, Public Park",
    rating: 4.1,
    totalRatings: 205,
    type: "Outdoor Court",
    capacity: "10 players",
    amenities: ["Free Access", "Multiple Courts", "Public Restrooms"],
    availability: "24/7"
  }
];

const Grounds = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [filteredGrounds, setFilteredGrounds] = useState(groundsData);
  const [showFilters, setShowFilters] = useState(false);

  // Extract sport from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sportParam = params.get('sport');
    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [location.search]);

  // Filter grounds based on selected filters
  useEffect(() => {
    let filtered = groundsData;
    
    // Filter by sport
    if (selectedSport) {
      filtered = filtered.filter(ground => ground.sport === selectedSport);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ground => 
        ground.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ground.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    if (priceRange !== 'all') {
      switch(priceRange) {
        case 'free':
          filtered = filtered.filter(ground => ground.price === 0);
          break;
        case 'under50':
          filtered = filtered.filter(ground => ground.price < 50);
          break;
        case '50to100':
          filtered = filtered.filter(ground => ground.price >= 50 && ground.price <= 100);
          break;
        case 'over100':
          filtered = filtered.filter(ground => ground.price > 100);
          break;
      }
    }
    
    setFilteredGrounds(filtered);
  }, [selectedSport, searchTerm, priceRange]);

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sports Grounds</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {selectedSport ? `Browse available ${selectedSport} facilities` : "Browse all available sports facilities"}
          </p>
        </div>
      </section>

      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-2 rounded-lg"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  Filters
                </Button>
                
                <Select 
                  value={selectedSport} 
                  onValueChange={setSelectedSport}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sports</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <Select 
                    value={priceRange} 
                    onValueChange={setPriceRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="under50">Under $50</SelectItem>
                      <SelectItem value="50to100">$50 - $100</SelectItem>
                      <SelectItem value="over100">Over $100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredGrounds.length} grounds {selectedSport ? `for ${selectedSport}` : ""}
            </p>
          </div>

          {/* Grounds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrounds.map((ground) => (
              <div key={ground.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={ground.image} 
                    alt={ground.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-accent text-white m-2 px-2 py-1 rounded text-sm font-medium">
                    {ground.type}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{ground.name}</h3>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span>{ground.rating} ({ground.totalRatings})</span>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{ground.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="truncate">{ground.availability}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{ground.capacity}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-lg">
                      {ground.price === 0 ? "Free" : `$${ground.price}/hr`}
                    </span>
                    <Link to={`/grounds/${ground.id}`}>
                      <Button className="bg-primary hover:bg-primary/90">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGrounds.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No Grounds Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find more results.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Grounds;
