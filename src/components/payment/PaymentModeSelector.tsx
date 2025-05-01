
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark } from "lucide-react";

interface PaymentModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentModeSelector = ({ value, onChange }: PaymentModeSelectorProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3">Payment Method</h3>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="venue" id="venue" />
          <Label htmlFor="venue" className="flex items-center cursor-pointer">
            <Landmark className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Pay at Venue</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center cursor-pointer">
            <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Credit/Debit Card</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentModeSelector;
