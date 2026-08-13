import BrandStatement from "@/components/BrandStatement";
import Collection from "@/components/Collection";
import Concierge from "@/components/Concierge";
import DetailStory from "@/components/DetailStory";
import DressDetailProvider from "@/components/DressDetailProvider";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ModelShowcase from "@/components/ModelShowcase";
import Navbar from "@/components/Navbar";
import SocialProof from "@/components/SocialProof";

export default function Home() {
  return (
    <DressDetailProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ivory focus:px-5 focus:py-2.5 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <BrandStatement />
        <Collection />
        <ModelShowcase />
        <DetailStory />
        <SocialProof />
        <Concierge />
      </main>
      <Footer />
    </DressDetailProvider>
);
}
