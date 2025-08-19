import About from "@/components/public/About";
import FeaturedProperties from "@/components/public/FeaturedProperties";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import Services from "@/components/public/Services";

export default function Home() {
  return (
    <>
      <main>
        <div className="relative">
          <HeroSection />
          <div className="absolute bottom-0 left-0 right-0 w-auto h-20 bg-gradient-to-b from-transparent to-green-50"></div>
        </div>

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
