'use client';

import { addDays, format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/utils';

interface DateRangePickerProps {
  className?: string;
  id?: string;
  label?: string;
  align?: 'center' | 'start' | 'end';
}

function formatDateRange(date: DateRange) {
  if (!date.from) {
    return null;
  }

  if (!date.to || isSameDay(date.from, date.to)) {
    return format(date.from, 'LLL dd, y');
  }

  if (isSameMonth(date.from, date.to)) {
    return `${format(date.from, 'LLL dd')} - ${format(date.to, 'dd, y')}`;
  }

  if (isSameYear(date.from, date.to)) {
    return `${format(date.from, 'LLL dd')} - ${format(date.to, 'LLL dd, y')}`;
  }

  return `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`;
}

export const DateRangePicker = ({
  className,
  id = 'date-picker-range',
  label = 'Date range',
  align = 'center',
}: DateRangePickerProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });
  const formattedDateRange = date ? formatDateRange(date) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          aria-label={label}
          className={cn('w-fit justify-start px-2.5 font-normal', className)}
        >
          <CalendarIcon />
          {formattedDateRange ? (
            formattedDateRange
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};
