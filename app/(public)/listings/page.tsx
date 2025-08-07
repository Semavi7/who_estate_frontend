"use client";
import { useState } from "react";
import { Search, MapPin, Bed, Bath, Square, Filter, Heart, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  grossArea: number;
  age: number;
  floor: string;
  images: string[];
  features: string[];
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Deniz Manzaralı Lüks Villa",
    location: "Beşiktaş, İstanbul",
    price: "12.500.000 ₺",
    type: "satilik",
    category: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    grossArea: 280,
    age: 2,
    floor: "Villa",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    features: ["Deniz Manzarası", "Kapalı Garaj", "Bahçe"]
  },
  {
    id: 2,
    title: "Merkezi Konumda Modern Daire",
    location: "Şişli, İstanbul",
    price: "8.500 ₺/ay",
    type: "kiralik",
    category: "daire",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    grossArea: 140,
    age: 5,
    floor: "8/12",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    features: ["Asansör", "Güvenlik", "Otopark"]
  },
  {
    id: 3,
    title: "İş Merkezi Büro",
    location: "Levent, İstanbul",
    price: "45.000 ₺/ay",
    type: "kiralik",
    category: "ofis",
    bedrooms: 0,
    bathrooms: 2,
    area: 180,
    grossArea: 200,
    age: 1,
    floor: "15/25",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    features: ["24/7 Güvenlik", "Vale Hizmeti", "Metro Yakını"]
  },
  {
    id: 4,
    title: "Bağdat Caddesi Üzeri Dükkan",
    location: "Kadıköy, İstanbul",
    price: "2.800.000 ₺",
    type: "satilik",
    category: "dukkkan",
    bedrooms: 0,
    bathrooms: 1,
    area: 80,
    grossArea: 85,
    age: 15,
    floor: "Zemin",
    images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    features: ["Ana Cadde Üzeri", "Yüksek Tavan", "Vitrin"]
  },
  {
    id: 5,
    title: "Boğaz Manzaralı Penthouse",
    location: "Bebek, İstanbul",
    price: "25.000.000 ₺",
    type: "satilik",
    category: "daire",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    grossArea: 400,
    age: 3,
    floor: "20/20",
    images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    features: ["Boğaz Manzarası", "Teras", "Jakuzi"]
  },
  {
    id: 6,
    title: "Aile Dostu Geniş Daire",
    location: "Bakırköy, İstanbul",
    price: "6.200 ₺/ay",
    type: "kiralik",
    category: "daire",
    bedrooms: 2,
    bathrooms: 1,
    area: 100,
    grossArea: 115,
    age: 8,
    floor: "3/8",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    features: ["Balkon", "Asansör", "Doğalgaz"]
  }
];

export default function PropertyListings() {
  const [filters, setFilters] = useState({
    location: "",
    type: "all",
    category: "all",
    bedrooms: "all",
    priceRange: [0, 50000000],
    areaRange: [0, 1000],
    age: "all",
    floor: ""
  });
  
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const applyFilters = () => {
    let filtered = mockProperties.filter(property => {
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.type !== "all" && property.type !== filters.type) return false;
      if (filters.category !== "all" && property.category !== filters.category) return false;
      if (filters.bedrooms !== "all" && property.bedrooms.toString() !== filters.bedrooms) return false;
      
      const price = parseInt(property.price.replace(/[^\d]/g, ''));
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      
      if (property.area < filters.areaRange[0] || property.area > filters.areaRange[1]) return false;
      
      return true;
    });
    
    setFilteredProperties(filtered);
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <ImageWithFallback 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={property.type === 'satilik' ? 'default' : 'secondary'}>
            {property.type === 'satilik' ? 'Satılık' : 'Kiralık'}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
          {property.images.length} Fotoğraf
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="text-2xl text-primary mb-2">{property.price}</div>
        <h3 className="text-lg mb-2 line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area}m²</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {property.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {property.features.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{property.features.length - 2} Özellik
            </Badge>
          )}
        </div>
        
        <Link href={`listings/${property.id}`}><Button className="w-full">Detayları Görüntüle</Button></Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 md:pt-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-4">İlanlar</h1>
          <p className="text-gray-600">Binlerce emlak ilanı arasından size en uygun olanını keşfedin.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtreler
              </Button>
            </div>

            <div className={`bg-white p-6 rounded-lg shadow-sm space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <h3 className="text-lg mb-4">Arama Filtreleri</h3>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">İl/İlçe</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Şehir, ilçe ara..." 
                    className="pl-10"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">İlan Tipi</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="satilik">Satılık</SelectItem>
                    <SelectItem value="kiralik">Kiralık</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Category */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Emlak Tipi</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="daire">Daire</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="ofis">Ofis</SelectItem>
                    <SelectItem value="dukkkan">Dükkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Oda Sayısı</label>
                <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Farketmez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Farketmez</SelectItem>
                    <SelectItem value="1">1+0</SelectItem>
                    <SelectItem value="2">2+1</SelectItem>
                    <SelectItem value="3">3+1</SelectItem>
                    <SelectItem value="4">4+1</SelectItem>
                    <SelectItem value="5">5+1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm text-gray-600">Fiyat Aralığı (₺)</label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value: number[]) => setFilters({...filters, priceRange: value})}
                  max={50000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.priceRange[0].toLocaleString('tr-TR')} ₺</span>
                  <span>{filters.priceRange[1].toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-3">
                <label className="text-sm text-gray-600">Net Metrekare</label>
                <Slider
                  value={filters.areaRange}
                  onValueChange={(value: number[]) => setFilters({...filters, areaRange: value})}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.areaRange[0]} m²</span>
                  <span>{filters.areaRange[1]} m²</span>
                </div>
              </div>

              {/* Building Age */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Bina Yaşı</label>
                <Select value={filters.age} onValueChange={(value) => setFilters({...filters, age: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Farketmez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Farketmez</SelectItem>
                    <SelectItem value="0-2">0-2 Yaş</SelectItem>
                    <SelectItem value="3-5">3-5 Yaş</SelectItem>
                    <SelectItem value="6-10">6-10 Yaş</SelectItem>
                    <SelectItem value="11-15">11-15 Yaş</SelectItem>
                    <SelectItem value="16+">16+ Yaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Floor */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Bulunduğu Kat</label>
                <Input 
                  placeholder="örn: 3, Zemin, Villa" 
                  value={filters.floor}
                  onChange={(e) => setFilters({...filters, floor: e.target.value})}
                />
              </div>

              <Button onClick={applyFilters} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredProperties.length} ilan bulundu
              </p>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">En Yeni</SelectItem>
                  <SelectItem value="oldest">En Eski</SelectItem>
                  <SelectItem value="price-low">Fiyat (Düşük)</SelectItem>
                  <SelectItem value="price-high">Fiyat (Yüksek)</SelectItem>
                  <SelectItem value="area-small">Metrekare (Küçük)</SelectItem>
                  <SelectItem value="area-large">Metrekare (Büyük)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg mb-2">İlan bulunamadı</h3>
                <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
              </div>
            )}

            {/* Pagination would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}