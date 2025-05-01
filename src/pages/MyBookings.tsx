
import MainLayout from "@/components/layout/MainLayout";
import BookingFilters from "@/components/bookings/BookingFilters";
import BookingList from "@/components/bookings/BookingList";
import { useMyBookings } from "@/hooks/useMyBookings";
import { useBookingFilters } from "@/hooks/useBookingFilters";

const MyBookings = () => {
  const { bookings, loading, handleRateBooking, handleCancellationRequest } = useMyBookings();
  const {
    searchTerm,
    setSearchTerm,
    selectedSport,
    setSelectedSport,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    filteredBookings
  } = useBookingFilters({ bookings });

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Manage and track all your sports facility bookings.
          </p>
        </div>
      </section>

      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <BookingFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredBookings.length} bookings
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">Loading your bookings...</div>
          ) : (
            <BookingList
              bookings={filteredBookings}
              onRateBooking={handleRateBooking}
              onCancellationRequest={handleCancellationRequest}
            />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default MyBookings;
