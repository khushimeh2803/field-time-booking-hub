
import { useState, useMemo } from "react";

interface UseBookingFiltersProps {
  bookings: any[];
}

export const useBookingFilters = ({ bookings }: UseBookingFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = booking.groundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSport = !selectedSport || booking.sport === selectedSport;
      
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      
      return matchesSearch && matchesSport && matchesStatus;
    });
  }, [bookings, searchTerm, selectedSport, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    selectedSport,
    setSelectedSport,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    filteredBookings
  };
};
