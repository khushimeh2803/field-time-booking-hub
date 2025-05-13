
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface PaymentOptionProps {
  value: string;
  id: string;
  icon: LucideIcon;
  label: string;
}

const PaymentOption = ({ value, id, icon: Icon, label }: PaymentOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {label}
      </Label>
    </div>
  );
};

export default PaymentOption;
