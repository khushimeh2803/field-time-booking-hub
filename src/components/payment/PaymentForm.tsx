
import React from 'react';
import { Button } from "@/components/ui/button";
import BookingSummary from "./BookingSummary";
import PaymentModeSelector from "./PaymentModeSelector";
import CardDetailsForm from "./CardDetailsForm";
import PromoCodeForm from "./PromoCodeForm";
import MembershipDiscount from "./MembershipDiscount";
import TermsAndConditions from "./TermsAndConditions";
import PriceSummary from "./PriceSummary";

interface PaymentFormProps {
  booking: any;
  user: any;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  promoDiscount: number;
  membershipDiscount: number;
  promoCode: string;
  membershipName: string;
  processing: boolean;
  handlePromoApplied: (discount: number, code: string) => void;
  handleMembershipApplied: (discount: number, name: string) => void;
  calculateFinalPrice: () => number;
  handleCompletePayment: () => void;
}

const PaymentForm = ({ 
  booking,
  user,
  paymentMethod,
  setPaymentMethod,
  termsAccepted,
  setTermsAccepted,
  promoDiscount,
  membershipDiscount,
  promoCode,
  membershipName,
  processing,
  handlePromoApplied,
  handleMembershipApplied,
  calculateFinalPrice,
  handleCompletePayment
}: PaymentFormProps) => {
  if (!booking) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Booking Summary */}
      <BookingSummary 
        booking={{
          groundName: booking.groundName,
          date: booking.formattedDate,
          time: booking.formattedTime,
          address: booking.address
        }}
      />
      
      {/* Payment Method Selection */}
      <PaymentModeSelector
        value={paymentMethod} 
        onChange={setPaymentMethod}
      />
      
      {/* Card Details Form (only shown when credit card is selected) */}
      <CardDetailsForm visible={paymentMethod === 'card'} />
      
      {/* Membership Discount - Auto applied if available */}
      {user && (
        <MembershipDiscount 
          userId={user.id}
          onMembershipApplied={handleMembershipApplied}
        />
      )}
      
      {/* Promo Code Input */}
      <PromoCodeForm onPromoApplied={handlePromoApplied} />
      
      {/* Price Summary */}
      <PriceSummary
        subtotal={booking ? booking.total_amount : 0}
        promoDiscount={promoDiscount}
        membershipDiscount={membershipDiscount}
        promoCode={promoCode}
        membershipName={membershipName}
        total={calculateFinalPrice()}
      />
      
      {/* Terms and Conditions */}
      <TermsAndConditions 
        accepted={termsAccepted}
        onAcceptChange={setTermsAccepted}
      />
      
      {/* Complete Payment Button */}
      <Button 
        onClick={handleCompletePayment} 
        className="w-full"
        disabled={processing || !termsAccepted}
      >
        {processing ? "Processing..." : `Complete Payment ($${calculateFinalPrice().toFixed(2)})`}
      </Button>
    </div>
  );
};

export default PaymentForm;
