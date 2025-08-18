import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Award, Users, Building, Clock } from "lucide-react";

export default function About() {
  const stats = [
    {
      icon: <Building className="h-5 w-5 md:h-6 md:w-6" />,
      number: "15,000+",
      label: "Aktif İlan"
    },
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
      number: "25,000+",
      label: "Mutlu Müşteri"
    },
    {
      icon: <Award className="h-5 w-5 md:h-6 md:w-6" />,
      number: "15+",
      label: "Yıllık Tecrübe"
    },
    {
      icon: <Clock className="h-5 w-5 md:h-6 md:w-6" />,
      number: "7/24",
      label: "Müşteri Desteği"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 text-gray-900">
              Neden <span className="text-primary">EmlakPro</span>?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              15 yılı aşkın sektör tecrübemizle, Türkiye'nin en güvenilir emlak platformlarından biri haline geldik.
              Müşteri memnuniyetini her zaman ön planda tutarak, hayalinizdeki mülke ulaşmanızda size rehberlik ediyoruz.
            </p>

            <div className="space-y-4 mb-6 md:mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-base md:text-lg text-gray-900 mb-1">Güvenilir Platform</h4>
                  <p className="text-sm md:text-base text-gray-600">Tüm ilanlarımız doğrulanmış ve güncel bilgiler içerir</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-base md:text-lg text-gray-900 mb-1">Uzman Danışmanlar</h4>
                  <p className="text-sm md:text-base text-gray-600">Sertifikalı emlak uzmanlarından profesyonel destek</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-base md:text-lg text-gray-900 mb-1">Hızlı Süreç</h4>
                  <p className="text-sm md:text-base text-gray-600">Dijital çözümlerle emlak işlemlerinizi hızlandırıyoruz</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              Hakkımızda Daha Fazla
            </Button>
          </div>

          <div className="relative order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
              alt="Emlak Ofisi"
              className="rounded-2xl shadow-xl w-full"
            />

            {/* Stats overlay */}
            <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 right-4 md:right-6">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary/10 text-primary rounded-full mb-2">
                          {stat.icon}
                        </div>
                        <div className="text-sm md:text-lg text-primary mb-1">{stat.number}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}