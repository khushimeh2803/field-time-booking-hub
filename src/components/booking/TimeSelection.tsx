
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSelectionProps {
  selectedStartTime: string;
  selectedEndTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  selectedStartTime,
  selectedEndTime,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="start-time">Start Time</Label>
        <Input
          id="start-time"
          type="time"
          value={selectedStartTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="end-time">End Time</Label>
        <Input
          id="end-time"
          type="time"
          value={selectedEndTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default TimeSelection;
