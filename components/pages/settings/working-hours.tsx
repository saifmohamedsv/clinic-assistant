import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

export function WorkingHours() {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  return (
    <div className="flex flex-col gap-3 max-w-fit">
      <Label htmlFor="time-picker-start" className="px-1">
        Working Hours
      </Label>
      <div className="flex gap-3">
        <Input
          type="time"
          id="time-picker-start"
          step="1"
          defaultValue={startTime}
          onClick={() => {
            const time = new Date();
            time.setHours(time.getHours() - 1);
            setStartTime(time.toLocaleTimeString());
          }}
          className="w-[180px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
        <Input
          type="time"
          id="time-picker-end"
          step="1"
          defaultValue={endTime}
          className="w-[180px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onClick={() => {
            const time = new Date();
            time.setHours(time.getHours() + 1);
            setEndTime(time.toLocaleTimeString());
          }}
        />
      </div>
    </div>
  );
}
