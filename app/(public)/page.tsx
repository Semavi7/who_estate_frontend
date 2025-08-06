import About from "@/components/About";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />

        <div className="animate-on-load delay-3500ms">
          <FeaturedProperties />
        </div>

        <div className="animate-on-load delay-3700ms">
          <Services />
        </div>

        <div className="animate-on-load delay-3900ms">
          <About />
        </div>

        <div className="animate-on-load delay-4100ms">
          <Footer />
        </div>
      </main>
    </>
  );
}
