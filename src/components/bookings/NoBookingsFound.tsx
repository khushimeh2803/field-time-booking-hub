
import { Button } from "@/components/ui/button";

const NoBookingsFound = () => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
      <p className="text-muted-foreground mb-6">You don't have any bookings matching your filters.</p>
      <Button asChild>
        <a href="/grounds">Book a Ground Now</a>
      </Button>
    </div>
  );
};

export default NoBookingsFound;
