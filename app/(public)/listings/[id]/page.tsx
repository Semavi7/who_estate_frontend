'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Car, 
  ArrowUpDown, 
  Phone, 
  Mail, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";
import Link from "next/link";

interface PropertyDetailPageProps {
  propertyId?: number;
  onNavigate?: (page: string) => void;
}

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: "konut" | "isyeri" | "arsa";
  listingType: "satilik" | "kiralik";
  category: string;
  grossArea: number;
  netArea: number;
  rooms: string;
  buildingAge: string;
  floor: string;
  totalFloors: string;
  bathrooms: string;
  heating: string;
  elevator: string;
  parking: string;
  description: string;
  address: string;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const loadProperty = async () => {
      setTimeout(() => {
        const mockProperty: Property = {
          id: propertyId || 1,
          title: "Deniz Manzaralı Lüks Villa",
          price: 2500000,
          location: "Beşiktaş, İstanbul",
          type: "konut",
          listingType: "satilik",
          category: "Villa",
          grossArea: 350,
          netArea: 300,
          rooms: "4+2",
          buildingAge: "1-5",
          floor: "3",
          totalFloors: "3",
          bathrooms: "3",
          heating: "Merkezi Sistem",
          elevator: "Yok",
          parking: "Kapalı Otopark",
          description: "Muhteşem deniz manzaralı, modern donanımlı villa. Özel bahçe ve havuz mevcut. Beşiktaş'ın en prestijli semtinde, denize sıfır konumda. Tüm odalar deniz manzaralı olup, geniş terasları mevcuttur. Ankastre mutfak, klima, güvenlik sistemi gibi tüm modern konforlar bulunmaktadır.",
          address: "Bebek Mahallesi, Deniz Caddesi No: 15, Beşiktaş/İstanbul",
          features: [
            "Deniz Manzarası", "Güney Cephe", "Havuz", "Bahçe", 
            "Ankastre Mutfak", "Klima", "Güvenlik", "Teras",
            "Kapıcı", "Sosyal Tesis", "Spor Salonu"
          ],
          images: [
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          ],
          agent: {
            name: "Ahmet Yılmaz",
            phone: "+90 (532) 123 4567",
            email: "ahmet@emlakpro.com"
          }
        };

        setProperty(mockProperty);
        setLoading(false);
      }, 1000);
    };

    loadProperty();
  }, [propertyId]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm);
    alert("Mesajınız gönderildi. En kısa sürede size dönüş yapacağız.");
    setContactForm({ name: "", phone: "", email: "", message: "" });
  };

  const formatPrice = (price: number, listingType: string) => {
    return `${price.toLocaleString('tr-TR')} TL${listingType === 'kiralik' ? '/ay' : ''}`;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'konut':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Konut</Badge>;
      case 'isyeri':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">İşyeri</Badge>;
      case 'arsa':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Arsa</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const nextImage = () => {
    if (property) {
      setSelectedImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">İlan detayları yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 mt-5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl mb-4">İlan bulunamadı</h2>
            <Link href={'/listings'}>
              <Button>
                İlan Listesine Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 mt-5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={'/listings'}>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>İlan Listesine Dön</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <ImageWithFallback
                      src={property.images[selectedImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {property.images.length}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {property.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                            selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`${property.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(property.type)}
                      <Badge variant="secondary" className={
                        property.listingType === 'satilik' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }>
                        {property.listingType === 'satilik' ? 'Satılık' : 'Kiralık'}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-primary">
                      {formatPrice(property.price, property.listingType)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Brüt Alan</div>
                    <div>{property.grossArea} m²</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Oda Sayısı</div>
                    <div>{property.rooms}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Banyo</div>
                    <div>{property.bathrooms}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Bina Yaşı</div>
                    <div>{property.buildingAge}</div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg mb-3">İlan Açıklaması</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                <Separator />

                {/* Property Details */}
                <div>
                  <h3 className="text-lg mb-3">Emlak Detayları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kategori:</span>
                        <span>{property.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brüt Alan:</span>
                        <span>{property.grossArea} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Alan:</span>
                        <span>{property.netArea} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kat:</span>
                        <span>{property.floor} / {property.totalFloors}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Isıtma:</span>
                        <span>{property.heating}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Asansör:</span>
                        <span className="flex items-center">
                          <ArrowUpDown className="h-4 w-4 mr-1" />
                          {property.elevator}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Otopark:</span>
                        <span className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          {property.parking}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h3 className="text-lg mb-3">Özellikler</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Address */}
                <div>
                  <h3 className="text-lg mb-3">Adres</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <p className="text-gray-700">{property.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact */}
          <div className="space-y-6">
            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle>Emlak Danışmanı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-lg">{property.agent.name}</div>
                  <div className="text-sm text-gray-600">Emlak Uzmanı</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>{property.agent.email}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Ara
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    E-posta
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Adınız Soyadınız"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Telefon Numaranız"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="E-posta Adresiniz"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Mesajınız..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="min-h-24"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Fiyat Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Fiyat</span>
                    <span className="text-xl">{formatPrice(property.price, property.listingType)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>m² Başına</span>
                    <span>{Math.round(property.price / property.grossArea).toLocaleString('tr-TR')} TL/m²</span>
                  </div>
                  <Separator />
                  <Button className="w-full" size="lg">
                    Finansman Hesapla
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}