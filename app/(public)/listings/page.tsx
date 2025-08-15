"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, Bath, Square, Filter, Heart, Camera, HousePlus, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import PropertyGetData from "@/dto/getproperty.dto";
import { toast } from "sonner";
import api from "@/lib/axios";


export default function PropertyListings() {
  const [filters, setFilters] = useState({
    city: "",
    listingType: "",
    subType: "",
    numberOfRoom: "",
    priceRange: [0, 50000000],
    areaRange: [0, 1000],
    buildingAge: "all",
    floor: ""
  });
  const [properties, setProperties] = useState<PropertyGetData[]>([])
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams()

      if(filters.city) queryParams.append('city', filters.city)
      if(filters.numberOfRoom) queryParams.append('numberOfRoom', filters.numberOfRoom)

      const res = await api.get(`/properties/query?${queryParams.toString()}`)
      setFilteredProperties(res.data)
      if(res.data.length === 0) toast.info('Bu kriterlere uygun ilan bulunamadı.')        
    } catch (error) {
      toast.error('Filtreleme sırasında bir hata oluştu.')
    }

    
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties')
      setProperties(res.data)
      console.log('res.data', res.data)
    } catch (error) {
      toast.error("Veri alınırken bir hata oluştu.")
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
  setFilteredProperties(properties);
}, [properties])

  const PropertyCard = ({ property }: { property: PropertyGetData }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={property.propertyType === 'satilik' ? 'default' : 'secondary'}>
            {property.propertyType === 'satilik' ? 'Satılık' : 'Kiralık'}
          </Badge>
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
          <span className="text-sm">{property.location.city}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-1" />
            <span>{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>

          <div className="flex items-center">
            <HousePlus className="h-4 w-4 mr-1" />
            <span>{property.numberOfRoom}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.net}m²</span>
          </div>
        </div>

        <Link href={`listings/${property._id}`}><Button className="w-full">Detayları Görüntüle</Button></Link>
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
                    placeholder="Şehir ara..."
                    className="pl-10"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">İlan Tipi</label>
                <Select value={filters.listingType} onValueChange={(value) => setFilters({ ...filters, listingType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Satilik">Satılık</SelectItem>
                    <SelectItem value="Kiralik">Kiralık</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Category */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Emlak Tipi</label>
                <Select value={filters.subType} onValueChange={(value) => setFilters({ ...filters, subType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select value={filters.numberOfRoom} onValueChange={(value) => setFilters({ ...filters, numberOfRoom: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Farketmez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1+1">1+1</SelectItem>
                    <SelectItem value="2+1">2+1</SelectItem>
                    <SelectItem value="3+1">3+1</SelectItem>
                    <SelectItem value="4+1">4+1</SelectItem>
                    <SelectItem value="5+1">5+1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm text-gray-600">Fiyat Aralığı (₺)</label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value: number[]) => setFilters({ ...filters, priceRange: value })}
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
                  onValueChange={(value: number[]) => setFilters({ ...filters, areaRange: value })}
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
                <Select value={filters.buildingAge} onValueChange={(value) => setFilters({ ...filters, buildingAge: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Farketmez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Yaş</SelectItem>
                    <SelectItem value="2">2 Yaş</SelectItem>
                    <SelectItem value="3">3 Yaş</SelectItem>
                    <SelectItem value="4">4 Yaş</SelectItem>
                    <SelectItem value="5">5 Yaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Floor */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Bulunduğu Kat</label>
                <Input
                  placeholder="örn: 3, Zemin, Villa"
                  value={filters.floor}
                  onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
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
                <PropertyCard key={property._id} property={property} />
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