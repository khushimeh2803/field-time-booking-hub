
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { useFetchBooking } from "@/hooks/useFetchBooking";
import { usePayment } from "@/hooks/usePayment";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

const Payment = () => {
  const { loading, booking, user } = useFetchBooking();
  const {
    processing,
    paymentComplete,
    paymentMethod,
    setPaymentMethod,
    termsAccepted,
    setTermsAccepted,
    promoDiscount,
    membershipDiscount,
    promoCode,
    membershipName,
    receiptDetails,
    handlePromoApplied,
    handleMembershipApplied,
    calculateFinalPrice,
    handleCompletePayment,
    handleViewBookings
  } = usePayment(booking);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {paymentComplete ? "Payment Complete" : "Complete Payment"}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {paymentComplete 
              ? "Thank you for your payment. Your booking is confirmed!" 
              : "Review your booking details and complete the payment process."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {!paymentComplete ? (
            <PaymentForm 
              booking={booking}
              user={user}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              promoDiscount={promoDiscount}
              membershipDiscount={membershipDiscount}
              promoCode={promoCode}
              membershipName={membershipName}
              processing={processing}
              handlePromoApplied={handlePromoApplied}
              handleMembershipApplied={handleMembershipApplied}
              calculateFinalPrice={calculateFinalPrice}
              handleCompletePayment={handleCompletePayment}
            />
          ) : (
            <PaymentSuccess 
              receiptDetails={receiptDetails}
              handleViewBookings={handleViewBookings}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Payment;
