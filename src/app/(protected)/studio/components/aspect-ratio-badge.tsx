import { Badge } from '@/components/ui/badge';
import { type LucideIcon } from 'lucide-react';

interface AspectRatioBadgeProps {
  icon: LucideIcon;
  label: string;
}

export const AspectRatioBadge = ({ icon, label }: AspectRatioBadgeProps) => {
  const Icon = icon;

  return (
    <Badge variant="secondary" className="border-border/50 border">
      <Icon />
      {label}
    </Badge>
  );
};
