import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, MapPin } from "lucide-react";

interface HeroSectionProps {
  showContent?: boolean;
}

export default function HeroSection({
  showContent = true,
}: HeroSectionProps) {
  return (
    <section
      className="hero-background relative min-h-screen bg-cover bg-center bg-no-repeat pt-16 md:pt-24"
    >
      {/* Dark overlay for better text readability */}
      <div
        className={`absolute inset-0 bg-black/40 ${showContent ? "animate-hero-overlay" : "animate-hero-overlay-initial"
          }`}
      />

      {showContent && (
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <h1
              className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-white"
            >
              <span
                className="block animate-slide-in-left"
                style={{ animationDelay: "3.7s" }}
              >
                Hayalinizdeki
              </span>
              <span
                className="block text-primary drop-shadow-lg animate-slide-in-right"
                style={{ animationDelay: "3.9s" }}
              >
                Evi Bulun
              </span>
            </h1>
            <p
              className="text-base md:text-lg lg:text-xl text-white mb-6 md:mb-8 max-w-2xl mx-auto px-4 drop-shadow-lg animate-slide-in-up"
              style={{ animationDelay: "4.1s" }}
            >
              Binlerce emlak ilanı arasından size en uygun
              olanını keşfedin. Satılık ve kiralık evler,
              işyerleri ve daha fazlası.
            </p>
          </div>

          {/* Search Form */}
          <div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 max-w-4xl mx-auto animate-slide-in-up"
            style={{ animationDelay: "4.3s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className="text-sm text-gray-600">
                  İl/İlçe
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Şehir seçin"
                    className="pl-10 border-gray-200 focus:border-primary h-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-sm text-gray-600">
                  İlan Tipi
                </label>
                <Select>
                  <SelectTrigger className="border-gray-200 focus:border-primary h-10">
                    <SelectValue placeholder="Satılık/Kiralık" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satilik">
                      Satılık
                    </SelectItem>
                    <SelectItem value="kiralik">
                      Kiralık
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="text-sm text-gray-600">
                  Emlak Tipi
                </label>
                <Select>
                  <SelectTrigger className="border-gray-200 focus:border-primary h-10">
                    <SelectValue placeholder="Konut/İşyeri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daire">Daire</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="ofis">Ofis</SelectItem>
                    <SelectItem value="dukkkan">
                      Dükkan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="text-sm text-gray-600 lg:invisible">
                  Ara
                </label>
                <Button className="w-full h-10 bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4 mr-2" />
                  Ara
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
              <span className="text-sm text-gray-600 w-full md:w-auto mb-2 md:mb-0">
                Popüler Aramalar:
              </span>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Beşiktaş Kiralık
              </button>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Kadıköy Satılık
              </button>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Şişli Daire
              </button>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Bakırköy Villa
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 max-w-3xl mx-auto animate-slide-in-up"
            style={{ animationDelay: "4.5s" }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg mb-2">
                15,000+
              </div>
              <div className="text-white/90 text-sm md:text-base drop-shadow">
                Aktif İlan
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg mb-2">
                25,000+
              </div>
              <div className="text-white/90 text-sm md:text-base drop-shadow">
                Mutlu Müşteri
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg mb-2">
                500+
              </div>
              <div className="text-white/90 text-sm md:text-base drop-shadow">
                Emlak Danışmanı
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}