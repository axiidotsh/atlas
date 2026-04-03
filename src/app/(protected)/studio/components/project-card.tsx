import Link from 'next/link';

interface ProjectImageProps {
  id: string;
  title: string;
  src: string;
  aspectRatio: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  coverImage: string;
  images: ProjectImageProps[];
}

export const ProjectCard = ({
  id,
  title,
  coverImage,
  images,
}: ProjectCardProps) => {
  return (
    <Link
      href={`/studio/${id}`}
      className="bg-card border-border/30 group hover:bg-muted flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors duration-300"
    >
      <div className="h-40 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="truncate px-4 py-3 text-sm font-medium">{title}</span>
    </Link>
  );
};
