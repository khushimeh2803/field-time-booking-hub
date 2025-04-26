
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GroundSearch from "@/components/grounds/GroundSearch";
import GroundsList from "@/components/grounds/GroundsList";

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

  // Fetch grounds and sports data
  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        setIsLoading(true);
        
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*');
          
        if (sportsError) throw sportsError;
        setSports(sportsData || []);
        
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
          rating: 4.5,
          totalRatings: 50,
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
    
    if (selectedSport) {
      filtered = filtered.filter(ground => ground.sport === selectedSport);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(ground => 
        ground.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ground.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
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
          <GroundSearch
            searchTerm={searchTerm}
            selectedSport={selectedSport}
            priceRange={priceRange}
            showFilters={showFilters}
            sports={sports}
            onSearchChange={setSearchTerm}
            onSportChange={setSelectedSport}
            onPriceRangeChange={setPriceRange}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading 
                ? "Loading grounds..." 
                : `Showing ${filteredGrounds.length} grounds ${selectedSport ? `for ${selectedSport}` : ""}`
              }
            </p>
          </div>

          <GroundsList grounds={filteredGrounds} isLoading={isLoading} />
        </div>
      </section>
    </MainLayout>
  );
};

export default Grounds;
