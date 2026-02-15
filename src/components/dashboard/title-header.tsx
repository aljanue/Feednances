interface TitleHeaderProps {
  title: string;
  description?: string;
}

export default function TitleHeader({ title, description }: TitleHeaderProps) {
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
