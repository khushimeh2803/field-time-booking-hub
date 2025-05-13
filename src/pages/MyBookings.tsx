
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BookingCard from "@/components/booking/BookingCard";
import BookingFilters from "@/components/booking/BookingFilters";
import RecentBookings from "@/components/booking/RecentBookings";
import EmptyBookingState from "@/components/booking/EmptyBookingState";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingList from "@/components/booking/BookingList";
import { useBookings } from "@/hooks/useBookings";

const MyBookings = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedSport,
    setSelectedSport,
    statusFilter,
    setStatusFilter,
    filteredBookings,
    recentBookings,
    sports,
    isLoading,
    getSportName,
    handleRateBooking,
    handleCancelBooking
  } = useBookings();

  return (
    <MainLayout>
      <BookingHeader 
        title="My Bookings" 
        description="Manage and track all your sports facility bookings." 
      />

      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          {/* Recent Bookings Component */}
          <RecentBookings bookings={recentBookings} />

          {/* Filters Component */}
          <BookingFilters
            sports={sports}
            searchTerm={searchTerm}
            selectedSport={selectedSport}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onSportChange={setSelectedSport}
            onStatusChange={setStatusFilter}
          />

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? "Loading your bookings..." : `Showing ${filteredBookings.length} bookings`}
            </p>
          </div>

          {/* Bookings List */}
          <BookingList 
            bookings={filteredBookings}
            sportName={getSportName}
            onRateBooking={handleRateBooking}
            onCancellationRequest={handleCancelBooking}
            isLoading={isLoading}
          />

          {/* Empty State */}
          {!isLoading && filteredBookings.length === 0 && (
            <EmptyBookingState />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default MyBookings;
