
import React from 'react';
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark } from "lucide-react";

interface PaymentModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentModeSelector = ({ value, onChange }: PaymentModeSelectorProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer" 
           onClick={() => onChange("card")}>
        <input 
          type="radio" 
          checked={value === "card"} 
          onChange={() => {}} 
          className="h-5 w-5 text-primary accent-primary" 
        />
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
          <Label className="cursor-pointer">Credit/Debit Card</Label>
        </div>
      </div>
      <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
           onClick={() => onChange("venue")}>
        <input 
          type="radio" 
          checked={value === "venue"} 
          onChange={() => {}} 
          className="h-5 w-5 text-primary accent-primary" 
        />
        <div className="flex items-center">
          <Landmark className="h-5 w-5 mr-2 text-gray-600" />
          <Label className="cursor-pointer">Pay at Venue</Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default PaymentModeSelector;
