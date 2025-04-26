
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Clock, Users, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Grounds = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [filteredGrounds, setFilteredGrounds] = useState<any[]>([]);
  const [grounds, setGrounds] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sports, setSports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Extract sport from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sportParam = params.get('sport');
    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [location.search]);

  // Fetch all grounds from Supabase
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        setIsLoading(true);
        
        // Fetch sports first to get their IDs
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*');
          
        if (sportsError) throw sportsError;
        setSports(sportsData || []);
        
        // Fetch all active grounds
        const { data: groundsData, error: groundsError } = await supabase
          .from('grounds')
          .select(`
            *,
            sport_id (
              id, name
            )
          `)
          .eq('is_active', true);
          
        if (groundsError) throw groundsError;
        
        const formattedGrounds = groundsData.map(ground => ({
          id: ground.id,
          name: ground.name,
          sport: ground.sport_id?.name?.toLowerCase() || 'unknown',
          price: ground.price_per_hour,
          image: ground.images && ground.images.length > 0 ? ground.images[0] : 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80',
          address: ground.address,
          rating: 4.5, // Default rating, you might want to implement a real rating system
          totalRatings: 50, // Default number of ratings
          type: ground.amenities && ground.amenities.includes("Indoor") ? "Indoor" : "Outdoor",
          capacity: `${ground.capacity} players`,
          amenities: ground.amenities || [],
          availability: `${ground.opening_time} - ${ground.closing_time}`
        }));
        
        setGrounds(formattedGrounds);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching grounds:", error);
        toast({
          title: "Error",
          description: "Failed to load grounds. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchGrounds();
  }, [toast]);

  // Filter grounds based on selected filters
  useEffect(() => {
    let filtered = grounds;
    
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
  }, [selectedSport, searchTerm, priceRange, grounds]);

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
                    {sports.map(sport => (
                      <SelectItem key={sport.id} value={sport.name.toLowerCase()}>
                        {sport.name}
                      </SelectItem>
                    ))}
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
              {isLoading 
                ? "Loading grounds..." 
                : `Showing ${filteredGrounds.length} grounds ${selectedSport ? `for ${selectedSport}` : ""}`
              }
            </p>
          </div>

          {/* Grounds Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
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
          )}

          {/* Empty State */}
          {!isLoading && filteredGrounds.length === 0 && (
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
