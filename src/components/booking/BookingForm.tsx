
import { Button } from "@/components/ui/button";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import DiscountOptions from "@/components/booking/DiscountOptions";
import PromoCodeSection from "@/components/booking/PromoCodeSection";
import TermsAgreement from "@/components/booking/TermsAgreement";

interface BookingFormProps {
  bookingForm: any;
  timeSlotMap: Record<string, string>;
}

const BookingForm = ({ bookingForm, timeSlotMap }: BookingFormProps) => {
  const {
    groundData,
    bookingDate,
    selectedSlots,
    paymentMethod,
    setPaymentMethod,
    promoCode,
    setPromoCode,
    appliedPromo,
    applyPromoCode,
    removePromo,
    hasFeedbackHistory,
    applyFeedbackDiscount,
    toggleFeedbackDiscount,
    feedbackDiscount,
    hasMembership,
    applyMembership,
    toggleMembership,
    membershipDiscount,
    membershipDetails,
    subtotal,
    acceptTerms,
    setAcceptTerms,
    cardDetails,
    setCardDetails,
    handleSubmitBooking
  } = bookingForm;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
      
      {/* Booking Summary Component */}
      <BookingSummary 
        groundData={groundData} 
        bookingDate={bookingDate} 
        selectedSlots={selectedSlots} 
        timeSlotMap={timeSlotMap} 
      />
      
      <form onSubmit={handleSubmitBooking}>
        {/* Payment Method Component */}
        <PaymentMethodSelector 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
        />
        
        {/* Discount Options Component */}
        <DiscountOptions 
          hasFeedbackHistory={hasFeedbackHistory}
          applyFeedbackDiscount={applyFeedbackDiscount}
          toggleFeedbackDiscount={toggleFeedbackDiscount}
          feedbackDiscount={feedbackDiscount}
          hasMembership={hasMembership}
          applyMembership={applyMembership}
          toggleMembership={toggleMembership}
          membershipDiscount={membershipDiscount}
          membershipDetails={membershipDetails}
          subtotal={subtotal}
        />
        
        {/* Promo Code Component */}
        <PromoCodeSection 
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          appliedPromo={appliedPromo}
          applyPromoCode={applyPromoCode}
          removePromo={removePromo}
        />
        
        {/* Terms and Agreement Component */}
        <TermsAgreement 
          acceptTerms={acceptTerms}
          setAcceptTerms={setAcceptTerms}
        />
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
          disabled={!acceptTerms}
        >
          Complete Booking
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
