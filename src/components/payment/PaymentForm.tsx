
import React from 'react';
import { Button } from "@/components/ui/button";
import BookingSummary from "./BookingSummary";
import PaymentModeSelector from "./PaymentModeSelector";
import CardDetailsForm from "./CardDetailsForm";
import PromoCodeForm from "./PromoCodeForm";
import MembershipDiscount from "./MembershipDiscount";
import TermsAndConditions from "./TermsAndConditions";
import PriceSummary from "./PriceSummary";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

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
  
  const finalPrice = calculateFinalPrice();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side: Payment options */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Payment Method</h3>
          </div>
          <PaymentModeSelector
            value={paymentMethod} 
            onChange={setPaymentMethod}
          />
        </div>
        
        {/* Card Details Form (only shown when credit card is selected) */}
        {paymentMethod === 'card' && (
          <div className="bg-white rounded-lg border p-6">
            <CardDetailsForm visible={true} />
          </div>
        )}

        {/* Pay at Venue Information (only shown when venue is selected) */}
        {paymentMethod === 'venue' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Pay at Venue</h3>
            <p className="text-gray-600 mb-4">Payment will be collected at the venue before your slot begins</p>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-md">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Important Information</p>
                  <ul className="mt-1 text-amber-700 space-y-1">
                    <li>Please arrive at least 15 minutes before your slot time for payment processing.</li>
                    <li>We accept cash, card, and UPI payments at the venue.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Promo Code Input */}
        <div className="bg-white rounded-lg border p-6">
          <PromoCodeForm onPromoApplied={handlePromoApplied} />
        </div>
        
        {/* Membership Discount - Auto applied if available */}
        {user && (
          <MembershipDiscount 
            userId={user.id}
            onMembershipApplied={handleMembershipApplied}
          />
        )}
        
        {/* Terms and Conditions */}
        <div className="bg-white rounded-lg border p-6">
          <TermsAndConditions 
            accepted={termsAccepted}
            onAcceptChange={setTermsAccepted}
          />
        </div>
        
        {/* Complete Payment Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleCompletePayment} 
            className="w-full h-12 text-base bg-green-400 hover:bg-green-500"
            disabled={processing || !termsAccepted}
          >
            {processing ? "Processing..." : `Pay ₹${finalPrice.toFixed(2)}`}
          </Button>
          
          <Link to="/membership">
            <Button
              variant="outline"
              className="w-full h-12 text-base text-blue-700 border-blue-300"
            >
              View Membership Plans & Save More
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Right side: Booking Summary */}
      <div>
        <div className="bg-white rounded-lg border p-6 sticky top-20">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <BookingSummary booking={booking} />
          <div className="mt-6">
            <PriceSummary
              subtotal={booking ? booking.total_amount : 0}
              promoDiscount={promoDiscount}
              membershipDiscount={membershipDiscount}
              promoCode={promoCode}
              membershipName={membershipName}
              total={finalPrice}
              useCurrencySymbol="₹"
            />
          </div>
          
          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <div className="flex gap-2">
              <div className="text-blue-700">
                <Info className="h-5 w-5" />
              </div>
              <p className="text-blue-700 text-sm">
                Secure Payment Guarantee<br/>
                Your payment information is processed securely. We do not store credit card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
