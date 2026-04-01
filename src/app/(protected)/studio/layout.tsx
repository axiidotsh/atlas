import { ChatInput } from '../chat/components/chat-input';

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <div className="flex justify-center">
        <ChatInput
          caption="Provide specific details and attach references for better results"
          placeholder="Describe what you want to create"
          config={{
            adaccountSelector: false,
            modeSelector: false,
            tokenCounter: true,
            attachment: true,
          }}
        />
      </div>
    </div>
  );
}
