
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import DiscountOptions from "@/components/booking/DiscountOptions";
import PromoCodeSection from "@/components/booking/PromoCodeSection";
import TermsAgreement from "@/components/booking/TermsAgreement";
import OrderSummary from "@/components/booking/OrderSummary";
import { useBookingForm } from "@/hooks/useBookingForm";
import { useBookingSubmission } from "@/components/booking/BookingFormSubmission";

const Booking = () => {
  const navigate = useNavigate();
  
  // Use our custom hook for booking form state and logic
  const booking = useBookingForm();

  // Use our booking submission handler
  const { handleSubmitBooking, isSubmitting } = useBookingSubmission({
    groundId: booking.groundId,
    bookingDate: booking.bookingDate,
    selectedSlots: booking.selectedSlots,
    total: booking.total,
    appliedPromo: booking.appliedPromo,
    applyMembership: booking.applyMembership,
    paymentMethod: booking.paymentMethod,
    acceptTerms: booking.acceptTerms
  });

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
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
                
                {/* Booking Summary Component */}
                <BookingSummary 
                  groundData={booking.groundData} 
                  bookingDate={booking.bookingDate} 
                  selectedSlots={booking.selectedSlots} 
                  timeSlotMap={booking.timeSlotMap} 
                />
                
                <form onSubmit={handleSubmitBooking}>
                  {/* Payment Method Component */}
                  <PaymentMethodSelector 
                    paymentMethod={booking.paymentMethod}
                    setPaymentMethod={booking.setPaymentMethod}
                    cardDetails={booking.cardDetails}
                    setCardDetails={booking.setCardDetails}
                  />
                  
                  {/* Discount Options Component */}
                  <DiscountOptions 
                    hasFeedbackHistory={booking.hasFeedbackHistory}
                    applyFeedbackDiscount={booking.applyFeedbackDiscount}
                    toggleFeedbackDiscount={booking.toggleFeedbackDiscount}
                    feedbackDiscount={booking.feedbackDiscount}
                    hasMembership={booking.hasMembership}
                    applyMembership={booking.applyMembership}
                    toggleMembership={booking.toggleMembership}
                    membershipDiscount={booking.membershipDiscount}
                    membershipDetails={booking.membershipDetails}
                    subtotal={booking.subtotal}
                  />
                  
                  {/* Promo Code Component */}
                  <PromoCodeSection 
                    promoCode={booking.promoCode}
                    setPromoCode={booking.setPromoCode}
                    appliedPromo={booking.appliedPromo}
                    applyPromoCode={booking.applyPromoCode}
                    removePromo={booking.removePromo}
                  />
                  
                  {/* Terms and Agreement Component */}
                  <TermsAgreement 
                    acceptTerms={booking.acceptTerms}
                    setAcceptTerms={booking.setAcceptTerms}
                  />
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
                    disabled={!booking.acceptTerms || isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Booking"}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Order Summary Component */}
            <div>
              <OrderSummary 
                groundData={booking.groundData}
                subtotal={booking.subtotal}
                total={booking.total}
                totalHours={booking.totalHours}
                appliedPromo={booking.appliedPromo}
                applyMembership={booking.applyMembership}
                membershipDiscount={booking.membershipDiscount}
                membershipDetails={booking.membershipDetails}
                applyFeedbackDiscount={booking.applyFeedbackDiscount}
                feedbackDiscount={booking.feedbackDiscount}
                paymentMethod={booking.paymentMethod}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Booking;
