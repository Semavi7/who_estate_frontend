import About from "@/components/public/About";
import FeaturedProperties from "@/components/public/FeaturedProperties";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import Services from "@/components/public/Services";

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
