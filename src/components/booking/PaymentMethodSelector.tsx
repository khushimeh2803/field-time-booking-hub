
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cardDetails: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  };
  setCardDetails: {
    setCardName: (name: string) => void;
    setCardNumber: (number: string) => void;
    setCardExpiry: (expiry: string) => void;
    setCardCvc: (cvc: string) => void;
  };
}

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
  cardDetails,
  setCardDetails,
}: PaymentMethodSelectorProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
      <RadioGroup 
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="venue" id="pay-venue" />
          <Label htmlFor="pay-venue" className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Pay at Venue
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="pay-card" />
          <Label htmlFor="pay-card" className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credit/Debit Card
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === "card" && (
        <div className="mt-6 border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-name">Name on Card</Label>
              <Input 
                id="card-name"
                placeholder="John Smith" 
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails.setCardName(e.target.value)}
                required={paymentMethod === "card"}
              />
            </div>
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input 
                id="card-number"
                placeholder="1234 5678 9012 3456" 
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails.setCardNumber(e.target.value)}
                required={paymentMethod === "card"}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Expiration Date</Label>
                <Input 
                  id="card-expiry"
                  placeholder="MM/YY" 
                  value={cardDetails.cardExpiry}
                  onChange={(e) => setCardDetails.setCardExpiry(e.target.value)}
                  required={paymentMethod === "card"}
                />
              </div>
              <div>
                <Label htmlFor="card-cvc">CVC</Label>
                <Input 
                  id="card-cvc"
                  placeholder="123" 
                  value={cardDetails.cardCvc}
                  onChange={(e) => setCardDetails.setCardCvc(e.target.value)}
                  required={paymentMethod === "card"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
