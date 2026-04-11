'use client';

import { AdAccountSelector } from '@/app/(protected)/chat/components/ad-account-selector';
import {
  DateRangePicker,
  getPresetRange,
} from '@/components/date-range-picker';
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

export const MetricToolbar = () => {
  const [selectedAdAccountIds, setSelectedAdAccountIds] = useState<string[]>(
    MOCK_AD_ACCOUNTS.map((adAccount) => adAccount.id)
  );
  const [date, setDate] = useState<DateRange | undefined>(getPresetRange(7));

  return (
    <div className="bg-background/95 sticky top-14 z-10 -mx-0.5 rounded-b-xl pt-4 backdrop-blur lg:top-0">
      <div className="bg-muted grid grid-cols-2 gap-2 rounded-xl border p-2 sm:flex sm:justify-between">
        <AdAccountSelector
          selectedAdAccountIds={selectedAdAccountIds}
          onSelectedAdAccountIdsChange={setSelectedAdAccountIds}
          variant="outline"
          size="default"
        />
        <DateRangePicker
          date={date}
          onDateChange={setDate}
          className="w-full sm:w-fit"
          align="end"
        />
      </div>
    </div>
  );
};
