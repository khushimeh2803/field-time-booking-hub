
import { useState } from "react";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Sport {
  id: string;
  name: string;
}

interface BookingFiltersProps {
  sports: Sport[];
  searchTerm: string;
  selectedSport: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onSportChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const BookingFilters = ({
  sports,
  searchTerm,
  selectedSport,
  statusFilter,
  onSearchChange,
  onSportChange,
  onStatusChange,
}: BookingFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

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
            onClick={() => setShowFilters(!showFilters)}
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
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <Select 
              value={statusFilter} 
              onValueChange={onStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;
