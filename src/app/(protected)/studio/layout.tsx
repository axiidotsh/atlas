import { StudioComposer } from '@/app/(protected)/studio/components/studio-composer';

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <div className="sticky bottom-0 flex justify-center">
        <StudioComposer
          caption="Provide specific details and attach references for better results"
          placeholder="Describe what you want to create"
        />
      </div>
    </div>
  );
}
