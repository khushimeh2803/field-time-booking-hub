
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface BookingFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

const BookingFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSport,
  setSelectedSport,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters
}: BookingFiltersProps) => {
  return (
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
        <div className="mt-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
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
