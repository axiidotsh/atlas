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
        <ChatInput />
      </div>
    </div>
  );
}
