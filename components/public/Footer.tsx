import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <div className="h-6 w-6 flex items-center justify-center">🏠</div>
              </div>
              <span className="text-xl">EmlakPro</span>
            </div>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              Türkiye'nin güvenilir emlak platformu. Hayalinizdeki mülke ulaşmanızda size rehberlik ediyoruz.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 md:h-10 md:w-10">
                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Ana Sayfa</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Satılık Daireler</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Kiralık Evler</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Yeni Projeler</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Emlak Haberleri</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Kariyer</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Emlak Danışmanlığı</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Değerleme</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Kredi Danışmanlığı</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Sigorta</a></li>
              <li><a href="#" className="text-sm md:text-base text-gray-400 hover:text-white transition-colors">Hukuki Destek</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base md:text-lg">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-400">+90 (212) 555 0123</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-400">info@emlak.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-400">Bağlarbaşı Mah. Selahattin Bey Sok. No: 1/A
                  Maltepe/İstanbul</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 EmlakPro. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}