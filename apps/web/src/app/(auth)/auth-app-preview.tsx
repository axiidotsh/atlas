import { PlaceholderLogo } from '@/components/icons';
import { cn } from '@/utils/utils';
import {
  ArrowUpRightIcon,
  BarChart3Icon,
  ClipboardListIcon,
  HomeIcon,
  ImageIcon,
  MessageSquareTextIcon,
  SendIcon,
  SettingsIcon,
  SparklesIcon,
  type LucideIcon,
} from 'lucide-react';

const PREVIEW_NAV_ITEMS: Array<{
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}> = [
  { label: 'Home', icon: HomeIcon },
  { label: 'Chat', icon: MessageSquareTextIcon, isActive: true },
  { label: 'Metrics', icon: BarChart3Icon },
  { label: 'Reports', icon: ClipboardListIcon },
  { label: 'Studio', icon: ImageIcon },
  { label: 'Settings', icon: SettingsIcon },
];

const PREVIEW_METRICS = [
  {
    label: 'Spend',
    value: '$128.4K',
    change: '3.2%',
    tone: 'text-destructive',
  },
  { label: 'ROAS', value: '3.21x', change: '6.1%', tone: 'text-chart-2' },
  { label: 'Clicks', value: '94.2K', change: '8.7%', tone: 'text-chart-2' },
];

const PREVIEW_CAMPAIGNS = [
  { name: 'Retargeting US', value: '4.04x' },
  { name: 'Summer Launch', value: '3.21x' },
  { name: 'Lookalike 1%', value: '2.71x' },
];

const REPORT_BARS = [
  'h-11',
  'h-16',
  'h-8',
  'h-14',
  'h-10',
  'h-6',
  'h-12',
  'h-9',
  'h-16',
  'h-7',
];

export const AuthAppPreview = () => {
  return (
    <div
      className="bg-muted/40 relative hidden min-h-0 flex-1 overflow-hidden rounded-2xl border lg:block"
      aria-hidden="true"
    >
      <div className="bg-primary/10 absolute -top-24 -right-28 size-72 rounded-full blur-3xl" />
      <div className="bg-accent/70 absolute -bottom-32 -left-24 size-96 rounded-full blur-3xl" />
      <div className="from-background to-primary/10 absolute inset-0 bg-gradient-to-br via-transparent" />

      <div className="relative flex size-full min-h-0 flex-col p-8 xl:p-10">
        <div className="mb-6 max-w-xl shrink-0">
          <div className="bg-primary/10 text-primary border-primary/20 mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase">
            <SparklesIcon className="size-3.5" />
            AI-powered ad manager
          </div>
          <h1 className="max-w-md text-2xl leading-tight font-semibold tracking-tight text-balance xl:text-3xl">
            Turn scattered ad data into clearer decisions.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-6">
            Chat through performance, spot changes, shape creative ideas, and
            package the story into reports.
          </p>
        </div>

        <div className="relative mx-auto min-h-0 w-full max-w-[960px] flex-1">
          <div className="border-primary/35 absolute top-1/2 left-[4%] h-80 w-[76%] -translate-y-1/2 rounded-full border border-dashed" />
          <div className="bg-card/85 relative z-10 h-[calc(100%-5rem)] overflow-hidden rounded-xl border shadow-2xl backdrop-blur">
            <div className="flex h-full min-h-0">
              <aside className="border-border/70 bg-sidebar/80 flex w-16 flex-col items-center gap-4 border-r px-3 py-5">
                <PlaceholderLogo className="mb-2 size-7" />
                {PREVIEW_NAV_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      'flex size-10 items-center justify-center rounded-lg',
                      item.isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="size-5" />
                  </div>
                ))}
              </aside>

              <div className="flex min-w-0 flex-1 flex-col p-5 xl:p-7">
                <div className="border-border/80 flex items-center justify-between border-b pb-5">
                  <div>
                    <p className="text-sm font-medium">
                      Ask anything about your ads
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Meta, Google, reports, and creative history connected
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
                    <span className="bg-primary size-2 rounded-full" />
                    Live
                  </div>
                </div>

                <div className="border-primary/20 bg-primary/10 text-primary mt-5 ml-auto max-w-sm rounded-xl border px-4 py-3 text-sm">
                  Which campaigns drove the most ROAS this week?
                  <div className="text-primary/70 mt-2 flex items-center justify-end gap-1 text-xs">
                    2:45 PM
                    <ArrowUpRightIcon className="size-3.5" />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
                  <div className="bg-background/70 rounded-xl border p-4">
                    <p className="text-sm font-medium">Top ROAS signals</p>
                    <div className="mt-4 space-y-4">
                      {PREVIEW_CAMPAIGNS.map((campaign, index) => (
                        <div
                          key={campaign.name}
                          className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-3 text-sm"
                        >
                          <span className="text-muted-foreground text-xs">
                            {index + 1}
                          </span>
                          <span className="min-w-0 truncate">
                            {campaign.name}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            {campaign.value}
                            <ArrowUpRightIcon className="text-chart-2 size-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-background/70 rounded-xl border p-4">
                    <p className="text-sm font-medium">Performance overview</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {PREVIEW_METRICS.map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-card/70 min-w-0 rounded-lg border p-2.5 xl:p-3"
                        >
                          <p className="text-muted-foreground truncate text-[0.68rem]">
                            {metric.label}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold xl:text-sm">
                            {metric.value}
                          </p>
                          <p
                            className={cn(
                              'mt-1 truncate text-[0.68rem]',
                              metric.tone
                            )}
                          >
                            {metric.change}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="from-chart-1/15 to-chart-2/15 mt-4 flex h-20 items-end gap-1.5 overflow-hidden rounded-lg bg-gradient-to-b p-3 xl:h-28">
                      {REPORT_BARS.slice(0, 8).map((height, index) => (
                        <div
                          key={`${height}-${index}`}
                          className={`${height} bg-chart-1/80 flex-1 rounded-t-sm`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 hidden flex-col gap-2 xl:flex">
                  <div className="bg-background/70 max-w-[72%] rounded-xl border px-4 py-3 text-sm leading-6">
                    Creative fatigue is starting on the Summer Launch ads. I
                    queued three new angles and marked the strongest one for the
                    weekly report.
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-chart-2/10 text-chart-2 rounded-full px-2.5 py-1 text-[0.68rem] font-medium">
                        6 drafts ready
                      </span>
                      <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[0.68rem] font-medium">
                        Report updated
                      </span>
                    </div>
                  </div>

                  <div className="border-primary/20 bg-primary/10 text-primary mt-2 ml-auto max-w-[58%] rounded-xl border px-4 py-3 text-sm">
                    Nice, turn that into a client-ready summary.
                    <div className="text-primary/70 mt-2 flex items-center justify-end gap-1 text-xs">
                      2:48 PM
                      <ArrowUpRightIcon className="size-3.5" />
                    </div>
                  </div>
                </div>

                <div className="bg-background/80 mt-auto flex items-center gap-3 rounded-xl border p-3">
                  <span className="text-muted-foreground flex-1 px-2 text-sm">
                    Ask a follow-up...
                  </span>
                  <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
                    <SendIcon className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 hidden -translate-x-1/2 translate-y-[38%] items-start justify-center gap-6 xl:flex">
            <div className="bg-card/95 w-72 -rotate-3 rounded-xl border p-4 shadow-xl backdrop-blur">
              <p className="text-sm font-medium">Creative variations</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {['bg-chart-3/30', 'bg-chart-2/30', 'bg-muted'].map(
                  (className, index) => (
                    <div key={className} className="space-y-2">
                      <div
                        className={cn(
                          'h-20 rounded-lg border',
                          className,
                          index === 1 && 'ring-primary/20 ring-2'
                        )}
                      />
                      <div className="bg-muted h-2 rounded-full" />
                      <div className="bg-muted h-2 w-2/3 rounded-full" />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-card/95 w-80 rotate-3 rounded-xl border p-5 shadow-xl backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Weekly report</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Apr 6 - Apr 12, 2026
                  </p>
                </div>
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <ClipboardListIcon className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6">
                Retargeting ROAS crossed 4x for the first time since launch.
              </p>
              <div className="mt-4 flex h-20 items-end gap-2">
                {REPORT_BARS.map((height, index) => (
                  <div
                    key={`${height}-${index}`}
                    className={`${height} bg-primary/85 flex-1 rounded-t-sm`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
