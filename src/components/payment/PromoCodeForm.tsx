
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromoCodeFormProps {
  onPromoApplied: (discount: number, code: string) => void;
}

const PromoCodeForm = ({ onPromoApplied }: PromoCodeFormProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setLoading(true);
    try {
      // Check if promo code exists and is valid
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .gte('valid_until', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Invalid Promo Code",
          description: "This code doesn't exist or has expired."
        });
        return;
      }

      // Success! Promo code is valid
      toast({
        title: "Promo Code Applied!",
        description: `${data.discount_percentage}% discount has been applied.`,
      });
      
      onPromoApplied(data.discount_percentage, data.code);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply promo code. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Promo Code</h3>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="uppercase"
        />
        <Button 
          onClick={applyPromoCode} 
          disabled={loading || !promoCode.trim()}
          variant="outline"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeForm;
