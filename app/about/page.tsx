// app/about/page.tsx
import AboutContent from "@/components/AboutContent";
import MainTemplate from "@/components/templates/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Saiba mais sobre a técnica Pomodoro e o uso de música (Lo-fi, clássica, gregoriano) para concentração.",
};

export default function AboutPage() {
  return (
    <MainTemplate>
      <AboutContent />
    </MainTemplate>
  );
}
