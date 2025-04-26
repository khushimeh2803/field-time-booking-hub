
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface GroundSearchProps {
  searchTerm: string;
  selectedSport: string;
  priceRange: string;
  showFilters: boolean;
  sports: any[];
  onSearchChange: (value: string) => void;
  onSportChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onToggleFilters: () => void;
}

const GroundSearch = ({
  searchTerm,
  selectedSport,
  priceRange,
  showFilters,
  sports,
  onSearchChange,
  onSportChange,
  onPriceRangeChange,
  onToggleFilters,
}: GroundSearchProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-4 pr-10 py-2 rounded-lg"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onToggleFilters}
          >
            <Filter size={18} />
            Filters
          </Button>
          
          <Select 
            value={selectedSport} 
            onValueChange={onSportChange}
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
              onValueChange={onPriceRangeChange}
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
  );
};

export default GroundSearch;
