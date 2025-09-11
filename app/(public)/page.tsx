import About from "@/components/public/About";
import FeaturedProperties from "@/components/public/FeaturedProperties";
import HeroSection from "@/components/public/HeroSection";
import Services from "@/components/public/Services";
import { URI } from "@/components/structured-data/url";
import { Metadata } from "next";
import { WebsiteSchema } from '@/components/structured-data/WebsiteSchema'
import { OrganizationSchema } from '@/components/structured-data/OrganizationSchema'

export const metadata: Metadata = {
  title: 'Derya Emlak - Türkiye\'nin En Güvenilir Emlak Platformu | Ana Sayfa',
  description: 'Türkiye\'nin dört bir yanında satılık ve kiralık emlak ilanları. Ev, daire, villa, arsa, işyeri ve daha fazlası için hemen arayın!',
  keywords: ['emlak ilanları', 'satılık ev', 'kiralık daire', 'emlak sitesi', 'gayrimenkul', 'türkiye emlak'],
  openGraph: {
    title: 'Derya Emlak - Ana Sayfa',
    description: 'Türkiye\'nin dört bir yanında satılık ve kiralık emlak ilanları.',
    url: URI,
    siteName: 'Derya Emlak Who Estate',
    images: 'favicon.png'
  },
  alternates: {
    canonical: URI,
  },
}

export default function Home() {
  return (
    <>
      <main >
        <div className="relative ">
          <HeroSection />
          <div className="absolute bottom-0 left-0 right-0 w-auto h-20 bg-gradient-to-b from-transparent to-background"></div>
        </div>

        <div data-aos="fade-up" data-aos-offset="300">
          <FeaturedProperties />
        </div>

        <div data-aos="fade-up">
          <Services />
        </div>

        <div data-aos="fade-up">
          <About />
        </div>
      </main>
      <WebsiteSchema />
      <OrganizationSchema />
    </>
  );
}
