// app/about/page.tsx
import AboutContent from "@/components/AboutContent";
import MainTemplate from "@/components/templates/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Focus Beat",
  description: "Learn how Focus Beat combines timed focus sessions and background music for concentration.",
};

export default function AboutPage() {
  return (
    <MainTemplate>
      <AboutContent />
    </MainTemplate>
  );
}
