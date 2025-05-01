
import React from 'react';

interface PriceSummaryProps {
  subtotal: number;
  promoDiscount: number;
  membershipDiscount: number;
  promoCode: string;
  membershipName: string;
  total: number;
  useCurrencySymbol?: string;
}

const PriceSummary = ({
  subtotal,
  promoDiscount,
  membershipDiscount,
  promoCode,
  membershipName,
  total,
  useCurrencySymbol = "$"
}: PriceSummaryProps) => {
  // Calculate the discount amounts
  const promoDiscountAmount = (subtotal * promoDiscount) / 100;
  const membershipDiscountAmount = (subtotal * membershipDiscount) / 100;

  return (
    <div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Price:</span>
          <span>{useCurrencySymbol}{subtotal.toFixed(2)}</span>
        </div>
        
        {promoDiscount > 0 && (
          <div className="flex justify-between text-green-500">
            <span>Discount ({promoDiscount}%):</span>
            <span>-{useCurrencySymbol}{promoDiscountAmount.toFixed(2)}</span>
          </div>
        )}
        
        {membershipDiscount > 0 && (
          <div className="flex justify-between text-green-500">
            <span>Membership ({membershipDiscount}%):</span>
            <span>-{useCurrencySymbol}{membershipDiscountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="border-t pt-3 mt-2 flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>{useCurrencySymbol}{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
