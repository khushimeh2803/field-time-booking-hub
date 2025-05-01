
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CardDetailsFormProps {
  visible: boolean;
}

const CardDetailsForm = ({ visible }: CardDetailsFormProps) => {
  if (!visible) return null;
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Card Details</h3>
      <p className="text-gray-600 mb-4">Enter your card information securely</p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Name on Card</Label>
          <Input 
            id="cardName" 
            placeholder="John Doe" 
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456" 
            maxLength={19}
            className="w-full"
            onChange={(e) => {
              // Format card number with spaces every 4 digits
              const value = e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
              e.target.value = value;
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY"
              maxLength={5}
              className="w-full"
              onChange={(e) => {
                // Format expiry date with slash after 2 digits
                let value = e.target.value.replace(/\//g, "");
                if (value.length > 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2);
                }
                e.target.value = value;
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv" 
              placeholder="123" 
              maxLength={3}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
