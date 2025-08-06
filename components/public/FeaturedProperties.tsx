import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Bed, Bath, Square, Heart, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function FeaturedProperties() {
  const properties = [
    {
      id: 1,
      title: "Modern 3+1 Daire",
      location: "Beşiktaş, İstanbul",
      price: "2.850.000",
      type: "Satılık",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      beds: 3,
      baths: 2,
      area: 150,
      views: 245
    },
    {
      id: 2,
      title: "Deniz Manzaralı Villa",
      location: "Büyükçekmece, İstanbul",
      price: "8.500.000",
      type: "Satılık",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
      beds: 5,
      baths: 3,
      area: 350,
      views: 189
    },
    {
      id: 3,
      title: "Merkezi Konumda Ofis",
      location: "Şişli, İstanbul",
      price: "15.000",
      type: "Kiralık",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      beds: 0,
      baths: 2,
      area: 120,
      views: 167
    },
    {
      id: 4,
      title: "Yeni 2+1 Rezidans",
      location: "Kadıköy, İstanbul",
      price: "7.500",
      type: "Kiralık",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      beds: 2,
      baths: 1,
      area: 95,
      views: 321
    },
    {
      id: 5,
      title: "Lüks Penthouse",
      location: "Nişantaşı, İstanbul",
      price: "12.000.000",
      type: "Satılık",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
      beds: 4,
      baths: 3,
      area: 280,
      views: 156
    },
    {
      id: 6,
      title: "Bahçeli Müstakil Ev",
      location: "Zekeriyaköy, İstanbul",
      price: "6.750.000",
      type: "Satılık",
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
      beds: 4,
      baths: 2,
      area: 220,
      views: 298
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-gray-900">Öne Çıkan İlanlar</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            En popüler ve kaliteli emlak ilanlarımızı keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={property.image}
                  alt={property.title}
                  className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 md:top-4 left-3 md:left-4">
                  <Badge
                    variant={property.type === 'Satılık' ? 'default' : 'secondary'}
                    className="bg-white/90 text-gray-900 hover:bg-white text-xs"
                  >
                    {property.type}
                  </Badge>
                </div>
                <div className="absolute top-3 md:top-4 right-3 md:right-4 flex space-x-2">
                  <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white h-7 w-7 md:h-8 md:w-8">
                    <Heart className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1">
                  <Eye className="h-3 w-3 text-white" />
                  <span className="text-xs text-white">{property.views}</span>
                </div>
              </div>

              <CardContent className="p-4 md:p-6">
                <div className="mb-4">
                  <h3 className="text-base md:text-lg mb-2 text-gray-900 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{property.location}</span>
                  </div>
                  <div className="text-lg md:text-2xl text-primary">
                    {parseInt(property.price).toLocaleString('tr-TR')} {property.type === 'Satılık' ? '₺' : '₺/ay'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-4 gap-2">
                  {property.beds > 0 && (
                    <div className="flex items-center min-w-0">
                      <Bed className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.beds} oda</span>
                    </div>
                  )}
                  <div className="flex items-center min-w-0">
                    <Bath className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.baths} banyo</span>
                  </div>
                  <div className="flex items-center min-w-0">
                    <Square className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.area} m²</span>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-sm md:text-base">
                  Detayları Gör
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
            Tüm İlanları Gör
          </Button>
        </div>
      </div>
    </section>
  );
}