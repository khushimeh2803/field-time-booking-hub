
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardDetailSetters } from "@/hooks/usePaymentMethod";

interface CardDetailsFormProps {
  cardDetails: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  };
  setCardDetails: CardDetailSetters;
  required: boolean;
}

const CardDetailsForm = ({ cardDetails, setCardDetails, required }: CardDetailsFormProps) => {
  return (
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
            required={required}
          />
        </div>
        <div>
          <Label htmlFor="card-number">Card Number</Label>
          <Input 
            id="card-number"
            placeholder="1234 5678 9012 3456" 
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails.setCardNumber(e.target.value)}
            required={required}
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
              required={required}
            />
          </div>
          <div>
            <Label htmlFor="card-cvc">CVC</Label>
            <Input 
              id="card-cvc"
              placeholder="123" 
              value={cardDetails.cardCvc}
              onChange={(e) => setCardDetails.setCvc(e.target.value)}
              required={required}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
