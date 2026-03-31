import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broks Vision | 360 Marketing Services",
  description: "Broks Vision - Quality, Trust, Innovation, Professionalism. Full-service 360 marketing agency.",
};

export default function BroksVisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
