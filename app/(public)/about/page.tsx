import { Users, Award, MapPin, Clock, Heart, Shield, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Team from "@/components/public/Team";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Mutlu Müşteri", value: "2,500+" },
    { icon: MapPin, label: "Başarılı Satış", value: "500+" },
    { icon: Award, label: "Deneyim Yılı", value: "15+" },
    { icon: Star, label: "Müşteri Desteği", value: "7/24" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Müşteri Memnuniyeti",
      description: "Müşterilerimizin memnuniyeti bizim için en öncelikli konudur. Her adımda yanınızdayız."
    },
    {
      icon: Shield,
      title: "Güvenilirlik",
      description: "15 yıllık deneyimimiz ve güvenilir hizmet anlayışımızla emlak sektörünün lideri."
    },
    {
      icon: TrendingUp,
      title: "Uzman Kadro",
      description: "Alanında uzman emlak danışmanlarımız ile size en iyi hizmeti sunmak için çalışıyoruz."
    },
    {
      icon: Clock,
      title: "Hızlı Hizmet",
      description: "Modern teknoloji altyapımız sayesinde hızlı ve etkili çözümler sunuyoruz."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      role: "Genel Müdür",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "20 yıl deneyim"
    },
    {
      name: "Ayşe Kaya",
      role: "Satış Müdürü",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b29c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "15 yıl deneyim"
    },
    {
      name: "Mehmet Demir",
      role: "Kiralama Uzmanı",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "12 yıl deneyim"
    },
    {
      name: "Fatma Özkan",
      role: "Müşteri Hizmetleri",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      experience: "8 yıl deneyim"
    }
  ];

  return (
    <div className="pt-16 md:pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/50 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">Hakkımızda</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            15 yıllık deneyimimiz ve güvenilir hizmet anlayışımızla 
            emlak sektörünün öncü firmasıyız.
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-2">
            2009'dan bu yana hizmetinizdeyiz
          </Badge>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl text-primary mb-2">{stat.value}</div>
                <div className="text-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl mb-6">Hikayemiz</h2>
                <div className="space-y-4 text-foreground">
                  <p>
                    EmlakPro olarak 2009 yılından bu yana emlak sektöründe faaliyet göstermekteyiz. 
                    Kurulduğumuz günden itibaren müşteri memnuniyetini ön planda tutarak, 
                    güvenilir ve kaliteli hizmet anlayışımızla sektörde öncü konuma geldik.
                  </p>
                  <p>
                    İstanbul'un her bölgesinde geniş portföyümüz ile müşterilerimize 
                    hayallerindeki evi bulma konusunda destek oluyoruz. Modern teknoloji 
                    altyapımız ve uzman kadromuz sayesinde emlak alım-satım süreçlerini 
                    kolaylaştırıyoruz.
                  </p>
                  <p>
                    Bugün 25.000'den fazla mutlu müşteriyle, 500'den fazla uzman emlak 
                    danışmanımızla Türkiye'nin en güvenilir emlak şirketlerinden biri 
                    olmaktan gurur duyuyoruz.
                  </p>
                </div>
                <Link href={'/contact'}><Button className="mt-6">İletişime Geç</Button></Link>
              </div>
              <div className="relative w-full h-96">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="EmlakPro Ofis"
                  className="object-cover rounded-lg shadow-lg"
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Değerlerimiz</h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Müşterilerimize en iyi hizmeti sunabilmek için benimsediğimiz temel değerler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="bg-primary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Ekibimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Deneyimli ve uzman kadromuzla size en iyi emlak hizmetini sunuyoruz
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <Team/>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/50 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Birlikte Çalışalım</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Gayrimenkul ihtiyaçlarınız için bizimle iletişime geçin. 
            Uzman ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center ">
            <Link href={'/contact'}>
              <Button variant="secondary" size="lg" className="cursor-pointer">
                İletişim
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}