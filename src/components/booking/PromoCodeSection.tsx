
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromoCodeSectionProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedPromo: { code: string, discount: number } | null;
  applyPromoCode: () => void;
  removePromo: () => void;
}

const PromoCodeSection = ({ 
  promoCode, 
  setPromoCode, 
  appliedPromo, 
  applyPromoCode, 
  removePromo 
}: PromoCodeSectionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Promo Code</h3>
      {appliedPromo ? (
        <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span>
              <span className="font-medium">{appliedPromo.code}</span> - {appliedPromo.discount}% off
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            type="button"
            onClick={removePromo}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Input 
            placeholder="Enter promo code" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button 
            type="button"
            onClick={applyPromoCode}
            disabled={!promoCode}
            className="whitespace-nowrap"
          >
            Apply Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromoCodeSection;
