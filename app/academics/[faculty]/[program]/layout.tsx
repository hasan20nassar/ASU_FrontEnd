export function generateStaticParams() {
  return [];
}

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
