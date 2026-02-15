export default function MainSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-full w-full flex flex-col gap-6">
      {children}
    </section>
  );
}
