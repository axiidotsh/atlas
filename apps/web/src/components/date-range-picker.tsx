'use client';

import {
  addDays,
  endOfDay,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
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
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/utils';

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
  id?: string;
  label?: string;
  align?: 'center' | 'start' | 'end';
}

interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
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

export function getPresetRange(days: number): DateRange {
  return {
    from: startOfDay(subDays(new Date(), days - 1)),
    to: endOfDay(new Date()),
  };
}

function getMonthPresetRange(months: number): DateRange {
  return {
    from: startOfDay(addDays(subMonths(new Date(), months), 1)),
    to: endOfDay(new Date()),
  };
}

function getYearPresetRange(years: number): DateRange {
  return {
    from: startOfDay(addDays(subYears(new Date(), years), 1)),
    to: endOfDay(new Date()),
  };
}

function areRangesEqual(first?: DateRange, second?: DateRange) {
  if (!first?.from || !first?.to || !second?.from || !second?.to) {
    return false;
  }

  return isSameDay(first.from, second.from) && isSameDay(first.to, second.to);
}

const PRESETS: DateRangePreset[] = [
  {
    label: 'Last 7 days',
    getValue: () => getPresetRange(7),
  },
  {
    label: 'Last 14 days',
    getValue: () => getPresetRange(14),
  },
  {
    label: 'Last 30 days',
    getValue: () => getPresetRange(30),
  },
  {
    label: 'Last 3 months',
    getValue: () => getMonthPresetRange(3),
  },
  {
    label: 'Last 6 months',
    getValue: () => getMonthPresetRange(6),
  },
  {
    label: 'Last 1 year',
    getValue: () => getYearPresetRange(1),
  },
];

export const DateRangePicker = ({
  date,
  onDateChange,
  className,
  id = 'date-picker-range',
  label = 'Date range',
  align = 'center',
}: DateRangePickerProps) => {
  const formattedDateRange = date ? formatDateRange(date) : null;
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<DateRange | undefined>(date);

  function handleOpenChange(nextOpen: boolean) {
    setDraftDate(date);

    if (!nextOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  }

  function handleCancel() {
    setDraftDate(date);
    setIsOpen(false);
  }

  function handleSave() {
    onDateChange(draftDate);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          aria-label={label}
          className={cn('w-fit justify-start px-2.5 font-normal', className)}
        >
          <CalendarIcon />
          {formattedDateRange ? (
            <span className="truncate">{formattedDateRange}</span>
          ) : (
            <span className="truncate">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align={align}>
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row">
            <div className="bg-muted/40 border-b p-2 sm:w-44 sm:border-r sm:border-b-0">
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1 sm:gap-1">
                {PRESETS.map((preset) => {
                  const presetRange = preset.getValue();
                  const isActive = areRangesEqual(draftDate, presetRange);

                  return (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      aria-label={preset.label}
                      className={cn(
                        'h-auto min-h-8 rounded-2xl px-3 py-1.5 text-center text-[11px] leading-tight font-medium whitespace-normal sm:h-9 sm:justify-start sm:rounded-md sm:px-3 sm:py-0 sm:text-sm sm:font-normal',
                        isActive && 'bg-accent text-accent-foreground'
                      )}
                      onClick={() => setDraftDate(presetRange)}
                    >
                      {preset.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <Calendar
              mode="range"
              defaultMonth={draftDate?.from}
              selected={draftDate}
              onSelect={setDraftDate}
              disabled={(calendarDate) =>
                isAfter(calendarDate, endOfDay(new Date()))
              }
              numberOfMonths={isMobile ? 1 : 2}
            />
          </div>
          <Separator />
          <div className="flex justify-end gap-2 p-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
