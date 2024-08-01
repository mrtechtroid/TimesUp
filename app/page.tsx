import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { ServicesSection } from "@/components/layout/sections/services";
import { Navbar } from "@/components/layout/navbar";
export default function Home() {
  return (
    <>
    <Navbar />
      <HeroSection />
      {/* <BenefitsSection /> */}
      <FeaturesSection />
      {/* <ServicesSection /> */}
      <FAQSection />
      <FooterSection />
    </>
  );
}