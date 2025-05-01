
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";

interface CardDetailsFormProps {
  visible: boolean;
}

const CardDetailsForm = ({ visible }: CardDetailsFormProps) => {
  if (!visible) return null;
  
  return (
    <div className="bg-muted p-4 rounded-lg mb-6 animate-in fade-in-50 duration-300">
      <h3 className="font-medium mb-3">Card Details</h3>
      <p className="text-muted-foreground text-sm mb-4">
        This is a demo - no real payment will be processed.
      </p>
      
      <div className="space-y-4">
        <FormItem>
          <Label htmlFor="cardName">Name on Card</Label>
          <Input id="cardName" placeholder="John Doe" />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456" 
            maxLength={19}
            onChange={(e) => {
              // Format card number with spaces every 4 digits
              const value = e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
              e.target.value = value;
            }}
          />
        </FormItem>
        
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY"
              maxLength={5}
              onChange={(e) => {
                // Format expiry date with slash after 2 digits
                let value = e.target.value.replace(/\//g, "");
                if (value.length > 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2);
                }
                e.target.value = value;
              }}
            />
          </FormItem>
          
          <FormItem>
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" maxLength={3} />
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
