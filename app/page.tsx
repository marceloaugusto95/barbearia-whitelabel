import { CtaBand } from "@/components/CtaBand";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Units } from "@/components/Units";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Units />
        <Testimonials />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
