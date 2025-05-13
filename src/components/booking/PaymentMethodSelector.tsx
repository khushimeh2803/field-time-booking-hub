
import { RadioGroup } from "@/components/ui/radio-group";
import { Building, CreditCard } from "lucide-react";
import PaymentOption from "./payment/PaymentOption";
import CardDetailsForm from "./payment/CardDetailsForm";

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
    setCvc: (cvc: string) => void;
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
        <PaymentOption 
          value="venue" 
          id="pay-venue" 
          icon={Building} 
          label="Pay at Venue" 
        />
        <PaymentOption 
          value="card" 
          id="pay-card" 
          icon={CreditCard} 
          label="Credit/Debit Card" 
        />
      </RadioGroup>

      {paymentMethod === "card" && (
        <CardDetailsForm 
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
          required={paymentMethod === "card"}
        />
      )}
    </div>
  );
};

export default PaymentMethodSelector;
