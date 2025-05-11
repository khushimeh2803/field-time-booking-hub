
import { Checkbox } from "@/components/ui/checkbox";

interface TermsAgreementProps {
  acceptTerms: boolean;
  setAcceptTerms: (checked: boolean) => void;
}

const TermsAgreement = ({ acceptTerms, setAcceptTerms }: TermsAgreementProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          required
        />
        <label 
          htmlFor="terms" 
          className="text-sm text-muted-foreground"
        >
          I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Cancellation Policy</a>
        </label>
      </div>
    </div>
  );
};

export default TermsAgreement;
