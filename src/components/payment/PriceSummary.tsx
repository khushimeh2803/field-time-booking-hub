
import React from 'react';

interface PriceSummaryProps {
  subtotal: number;
  promoDiscount: number;
  membershipDiscount: number;
  promoCode: string;
  membershipName: string;
  total: number;
}

const PriceSummary = ({
  subtotal,
  promoDiscount,
  membershipDiscount,
  promoCode,
  membershipName,
  total
}: PriceSummaryProps) => {
  return (
    <div className="mb-6 bg-muted p-4 rounded-lg">
      <h3 className="font-medium mb-3">Price Summary</h3>
      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {promoDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Promo Code: {promoCode}</span>
            <span>-${((subtotal * promoDiscount) / 100).toFixed(2)}</span>
          </div>
        )}
        
        {membershipDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{membershipName} Membership</span>
            <span>-${((subtotal * membershipDiscount) / 100).toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-border pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
