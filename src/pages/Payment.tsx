
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">
          {paymentComplete ? "Payment Complete" : "Complete Your Payment"}
        </h1>

        <div className="mb-12">
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
