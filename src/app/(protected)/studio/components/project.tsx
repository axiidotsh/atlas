import { StudioComposer } from './studio-composer';

interface ProjectProps {
  id: string;
  title: string;
  coverImage: string;
  images: {
    id: string;
    title: string;
    src: string;
  }[];
}

export const Project = ({ title, coverImage }: ProjectProps) => {
  return (
    <div className="flex flex-1 flex-col gap-8 pt-6 sm:pt-10 2xl:pt-20">
      <div className="flex-1 space-y-10">
        <h1 className="text-xl font-semibold">{title}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={title}
          width={1600}
          height={1000}
          className="h-auto w-full rounded-xl"
        />
      </div>
      <div className="sticky bottom-0 flex justify-center">
        <StudioComposer placeholder="Describe what you want to create" />
      </div>
    </div>
  );
};
