
import MainLayout from "@/components/layout/MainLayout";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingForm from "@/components/booking/BookingForm";
import OrderSummary from "@/components/booking/OrderSummary";
import { useBookingForm, timeSlotMap } from "@/hooks/useBookingForm";

const Booking = () => {
  const bookingForm = useBookingForm();
  
  return (
    <MainLayout>
      <BookingHeader 
        title="Complete Your Booking" 
        description="You're just a few steps away from securing your sports venue."
      />

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <BookingForm 
                bookingForm={bookingForm} 
                timeSlotMap={timeSlotMap} 
              />
            </div>
            
            {/* Order Summary */}
            <div>
              <OrderSummary 
                groundData={bookingForm.groundData}
                subtotal={bookingForm.subtotal}
                total={bookingForm.total}
                totalHours={bookingForm.totalHours}
                appliedPromo={bookingForm.appliedPromo}
                applyMembership={bookingForm.applyMembership}
                membershipDiscount={bookingForm.membershipDiscount}
                membershipDetails={bookingForm.membershipDetails}
                applyFeedbackDiscount={bookingForm.applyFeedbackDiscount}
                feedbackDiscount={bookingForm.feedbackDiscount}
                paymentMethod={bookingForm.paymentMethod}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Booking;
