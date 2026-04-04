'use client';

import { AdAccountSelector } from '@/app/(protected)/chat/components/ad-account-selector';
import { DateRangePicker } from '@/components/date-range-picker';
import { MOCK_AD_ACCOUNTS } from '@/mock-data/ad-data';
import { useState } from 'react';

export const MetricToolbar = () => {
  const [selectedAdAccountIds, setSelectedAdAccountIds] = useState<string[]>(
    MOCK_AD_ACCOUNTS.map((adAccount) => adAccount.id)
  );

  return (
    <div className="bg-background/95 sticky top-14 z-10 -mx-0.5 rounded-b-xl pt-4 backdrop-blur lg:top-0">
      <div className="bg-muted grid grid-cols-2 gap-2 rounded-xl border p-2 sm:flex sm:justify-between">
        <AdAccountSelector
          selectedAdAccountIds={selectedAdAccountIds}
          onSelectedAdAccountIdsChange={setSelectedAdAccountIds}
          variant="outline"
          size="default"
        />
        <DateRangePicker className="w-full sm:w-fit" />
      </div>
    </div>
  );
};
