
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TermsAndConditionsProps {
  accepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
}

const TermsAndConditions = ({ accepted, onAcceptChange }: TermsAndConditionsProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={accepted}
          onCheckedChange={(checked) => onAcceptChange(!!checked)}
          className="mt-1"
        />
        <div>
          <Label 
            htmlFor="terms" 
            className="font-normal"
          >
            I accept the {' '}
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-primary cursor-pointer underline underline-offset-4">
                  Terms and Conditions
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Terms and Conditions</DialogTitle>
                  <DialogDescription>
                    Please read these terms carefully before completing your booking.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4 text-sm">
                  <h3 className="font-semibold text-base">1. Booking and Payment Terms</h3>
                  <p>
                    1.1. All bookings are subject to availability of the sports ground at the time of booking.
                  </p>
                  <p>
                    1.2. Payment must be completed at the time of booking to secure the reservation.
                  </p>
                  <p>
                    1.3. Prices displayed are inclusive of all applicable taxes and charges.
                  </p>
                  <p>
                    1.4. The membership discounts are applicable only to valid and active membership holders.
                  </p>
                  
                  <h3 className="font-semibold text-base">2. Cancellation and Refund Policy</h3>
                  <p>
                    2.1. Cancellations made more than 48 hours before the booking time will receive a full refund.
                  </p>
                  <p>
                    2.2. Cancellations made between 24-48 hours before the booking time will receive a 50% refund.
                  </p>
                  <p>
                    2.3. Cancellations made less than 24 hours before the booking time will not be eligible for a refund.
                  </p>
                  <p>
                    2.4. In case of adverse weather conditions or facility maintenance issues, bookings will be eligible for rescheduling or a full refund.
                  </p>
                  
                  <h3 className="font-semibold text-base">3. Usage Rules and Regulations</h3>
                  <p>
                    3.1. Users must adhere to the specific rules and regulations of each sports ground.
                  </p>
                  <p>
                    3.2. Users are responsible for any damage caused to the facility or equipment during their booking period.
                  </p>
                  <p>
                    3.3. The management reserves the right to refuse service or cancel bookings for users who violate the usage rules.
                  </p>
                  
                  <h3 className="font-semibold text-base">4. Liability and Insurance</h3>
                  <p>
                    4.1. Users participate in sports activities at their own risk.
                  </p>
                  <p>
                    4.2. The facility is not liable for any personal injury, loss, or damage to personal belongings occurring during the use of the sports ground.
                  </p>
                  <p>
                    4.3. Users are advised to have appropriate insurance coverage for their sporting activities.
                  </p>
                  
                  <h3 className="font-semibold text-base">5. Changes to Bookings</h3>
                  <p>
                    5.1. Changes to existing bookings are subject to availability and must be requested at least 24 hours before the original booking time.
                  </p>
                  <p>
                    5.2. Additional charges may apply for changes in booking duration or facility type.
                  </p>
                  
                  <h3 className="font-semibold text-base">6. Miscellaneous</h3>
                  <p>
                    6.1. The management reserves the right to modify these terms and conditions at any time.
                  </p>
                  <p>
                    6.2. Any disputes arising from bookings will be resolved according to the laws and regulations of the jurisdiction where the facility is located.
                  </p>
                  
                  <p className="pt-4 font-medium">
                    By accepting these terms and conditions, you acknowledge that you have read, understood, and agree to be bound by all the provisions stated herein.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
