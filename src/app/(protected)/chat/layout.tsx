import { ChatComposer } from '@/app/(protected)/chat/components/chat-composer';
import { Kbd } from '@/components/ui/kbd';

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <div className="sticky bottom-0 flex justify-center">
        <ChatComposer
          caption={
            <>
              Use <Kbd className="bg-accent/50">@</Kbd> to tag specific ad
              accounts, campaigns, ad sets and ads
            </>
          }
        />
      </div>
    </div>
  );
}
