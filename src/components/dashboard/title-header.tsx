import { ReactNode } from "react";

interface TitleHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function TitleHeader({ title, description, icon }: TitleHeaderProps) {
  if (icon) {
    return (
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <div className="text-primary [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
