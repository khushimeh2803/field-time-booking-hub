
import React from 'react';
import { Button } from "@/components/ui/button";
import PaymentReceipt from "./PaymentReceipt";

interface PaymentSuccessProps {
  receiptDetails: any;
  handleViewBookings: () => void;
}

const PaymentSuccess = ({ receiptDetails, handleViewBookings }: PaymentSuccessProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="inline-block mx-auto bg-green-100 text-green-800 p-3 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-muted-foreground mt-2">
          Your booking has been confirmed and is ready for use.
        </p>
      </div>
      
      {/* Payment Receipt */}
      {receiptDetails && <PaymentReceipt bookingDetails={receiptDetails} />}
      
      {/* View Bookings Button */}
      <Button 
        onClick={handleViewBookings} 
        className="w-full"
      >
        View My Bookings
      </Button>
    </div>
  );
};

export default PaymentSuccess;
