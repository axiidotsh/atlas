import { Kbd } from '@/components/ui/kbd';
import { ChatInput } from './components/chat-input';

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <div className="flex justify-center">
        <ChatInput
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
