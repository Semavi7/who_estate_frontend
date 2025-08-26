import { Card, CardContent } from "../ui/card";
import { Home, Users, Calculator, Shield, Search, TrendingUp } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Search className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Gayrimenkul Arama",
      description: "Geniş portföyümüzde hayalinizdeki mülkü kolayca bulun. Gelişmiş filtreleme seçenekleri ile arama yapın."
    },
    {
      icon: <Home className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Emlak Danışmanlığı",
      description: "Uzman emlak danışmanlarımızdan profesyonel destek alın. Size en uygun seçenekleri sunarız."
    },
    {
      icon: <Calculator className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Kredi Hesaplama",
      description: "Konut kredisi hesaplamaları yapın. En uygun kredi seçeneklerini karşılaştırın ve analiz edin."
    },
    {
      icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Güvenli İşlemler",
      description: "Tüm emlak işlemlerinizi güvenle gerçekleştirin. Yasal süreçlerde tam destek sağlıyoruz."
    },
    {
      icon: <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Piyasa Analizi",
      description: "Güncel piyasa raporları ve trend analizleri ile doğru yatırım kararları verin."
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Müşteri Desteği",
      description: "7/24 müşteri destek hizmetimizle her zaman yanınızdayız. Sorularınızı çözüme kavuştururuz."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground">Hizmetlerimiz</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Emlak sektöründe kapsamlı çözümler sunarak hayalinizdeki mülke ulaşmanızı sağlıyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-accent">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-full mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg md:text-xl mb-3 md:mb-4 text-foreground">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}