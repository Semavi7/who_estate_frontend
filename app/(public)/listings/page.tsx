"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, Square, Filter, HousePlus, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import PropertyGetData from "@/dto/getproperty.dto";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

interface City {
  code: string
  name: string
}

export default function PropertyListings() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || "",
    district: "",
    neighborhood: "",
    propertyType: "",
    listingType: searchParams.get('listingType') || "",
    subType: searchParams.get('subType') || "",
    numberOfRoom: "",
    minPrice:"",
    maxPrice:"",
    minNet: "",
    maxNet:"",
    buildingAge: "",
    floor: ""
  });
  const [properties, setProperties] = useState<PropertyGetData[]>([])
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [districtsAndNeighborhoods, setDistrictsAndNeighborhoods] = useState<Record<string, string[]>>({})
  const [sortedAndFilteredProperties, setSortedAndFilteredProperties] = useState<PropertyGetData[]>([])
  const [sortBy, setSortBy] = useState("newest")


  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams()

      if (filters.city) queryParams.append('city', filters.city)
      if (filters.district) queryParams.append('district', filters.district)
      if (filters.neighborhood) queryParams.append('neighborhood', filters.neighborhood)
      if (filters.numberOfRoom) queryParams.append('numberOfRoom', filters.numberOfRoom)
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice)
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice)
      if (filters.maxNet) queryParams.append('maxNet', filters.maxNet)
      if (filters.minNet) queryParams.append('minNet', filters.minNet)
      if (filters.buildingAge) queryParams.append('buildingAge', filters.buildingAge)
      if (filters.floor) queryParams.append('floor', filters.floor)

      const res = await api.get(`/properties/query?${queryParams.toString()}`)
      setFilteredProperties(res.data)
      if (res.data.length === 0) toast.info('Bu kriterlere uygun ilan bulunamadı.')
    } catch (error) {
      toast.error('Filtreleme sırasında bir hata oluştu.')
    }


  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties')
      setProperties(res.data)
      setFilteredProperties(res.data)
    } catch (error) {
      toast.error("Veri alınırken bir hata oluştu.")
    }
  }

  useEffect(() => {
    const fetchAdressInCities = async () => {
      try {
        const res = await api.get('/properties/adress')
        setCities(res.data)
      } catch (error) {

      }
    }
    fetchAdressInCities()
  }, [])

  useEffect(() => {
    if (!filters.city) return

    const fetchDistricts = async () => {
      const selectedCity = cities.find(c => c.name === filters.city)
      if (!selectedCity) return
      try {
        const res = await api.get(`/properties/adress/${selectedCity.code}`)
        setDistrictsAndNeighborhoods(res.data)
      } catch (error) {
        console.error("İlçe verileri çekilirken hata oluştu:", error)
        toast.error("İlçe verileri yüklenemedi.")
        setDistrictsAndNeighborhoods({})
      }
    }
    fetchDistricts()
  }, [filters.city, cities])

  useEffect(() => {
    const hasSearchParams = Array.from(searchParams.keys()).length > 0
    if(hasSearchParams){
      applyFilters()
    }
    else{
      fetchProperties()
    }
  }, [])

  useEffect(() => {
  let sortedProperties = [...filteredProperties]
  switch (sortBy) {
    case 'newest':
      sortedProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      sortedProperties.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'price-low':
      sortedProperties.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      sortedProperties.sort((a, b) => b.price - a.price)
      break
    case 'area-small':
      sortedProperties.sort((a, b) => a.net - b.net)
      break
    case 'area-large':
      sortedProperties.sort((a, b) => b.net - a.net)
      break
    default:
      break
  }
  setSortedAndFilteredProperties(sortedProperties)
}, [sortBy, filteredProperties])

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
        <div className="text-2xl text-primary mb-2">{property.price.toLocaleString('tr-TR')}₺</div>
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
                <Label htmlFor="city">İl</Label>
                <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="İl seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((citiy) => (
                      <SelectItem key={citiy.code} value={citiy.name}>
                        {citiy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">İlçe</Label>
                <Select value={filters.district} onValueChange={(value) => setFilters({ ...filters, district: value })} disabled={!filters.city}>
                  <SelectTrigger>
                    <SelectValue placeholder="İlçe seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(districtsAndNeighborhoods).map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Mahalle</Label>
                <Select value={filters.neighborhood} onValueChange={(value) => setFilters({ ...filters, neighborhood: value })} disabled={!filters.district}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mahalle seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.district && districtsAndNeighborhoods[filters.district]?.map(neighborhood => (
                      <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Kategori Tipi</label>
                <Select value={filters.subType} onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Konut">Konut</SelectItem>
                    <SelectItem value="İş Yeri">İş Yeri</SelectItem>
                    <SelectItem value="Arsa">Arsa</SelectItem>
                    <SelectItem value="Bina">Bina</SelectItem>
                    <SelectItem value="Devre Mülk">Devre Mülk</SelectItem>
                    <SelectItem value="Turistik Tesis">Turistik Tesis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">İlan Tipi</label>
                <Select value={filters.listingType} onValueChange={(value) => setFilters({ ...filters, listingType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tümü" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Satilik">Satılık</SelectItem>
                    <SelectItem value="Kiralik">Kiralık</SelectItem>
                    <SelectItem value="Turistik Günlük Kiralık">Turistik Günlük Kiralık</SelectItem>
                    <SelectItem value="Devren Satılık Konut">Devren Satılık Konut</SelectItem>
                    <SelectItem value="Devren Satılık">Devren Satılık</SelectItem>
                    <SelectItem value="Devren Kiralık">Devren Kiralık</SelectItem>
                    <SelectItem value="Devren Kiralık">Devren Kiralık</SelectItem>
                    <SelectItem value="Kat Karşılığı Satılık">Kat Karşılığı Satılık</SelectItem>
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
                    <SelectItem value="Daire">Daire</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Ofis">Ofis</SelectItem>
                    <SelectItem value="Dükkkan">Dükkan</SelectItem>
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
                    <SelectItem value="1+0">1+0</SelectItem>
                    <SelectItem value="1+1">1+1</SelectItem>
                    <SelectItem value="2+1">2+1</SelectItem>
                    <SelectItem value="3+1">3+1</SelectItem>
                    <SelectItem value="4+1">4+1</SelectItem>
                    <SelectItem value="4+2">4+2</SelectItem>
                    <SelectItem value="5+1">5+1</SelectItem>
                    <SelectItem value="5+2">5+2</SelectItem>
                    <SelectItem value="6+1">6+1</SelectItem>
                    <SelectItem value="6+2">6+2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Max Fiyat</label>
                <Input
                  value={Number(filters.maxPrice).toLocaleString('tr-TR')}
                  onChange={(e) => {
                    const unformattedValue = e.target.value.replace(/\./g, '')
                    setFilters({ ...filters, maxPrice: unformattedValue })
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Min Fiyat</label>
                <Input
                  value={Number(filters.minPrice).toLocaleString('tr-TR')}
                  onChange={(e) => {
                    const unformattedValue = e.target.value.replace(/\./g, '')
                    setFilters({ ...filters, minPrice: unformattedValue })
                  }}
                />
              </div>

              {/* Area Range */}

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Max Net</label>
                <Input
                  placeholder="örn: 100"
                  value={filters.maxNet}
                  onChange={(e) => {
                    setFilters({ ...filters, maxNet: e.target.value })
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Min Net</label>
                <Input
                  placeholder="örn: 0"
                  value={filters.minNet}
                  onChange={(e) => {
                    setFilters({ ...filters, minNet: e.target.value })
                  }}
                />
              </div>

              {/* Building Age */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Bina Yaşı</label>
                <Input
                  placeholder="örn: 0"
                  value={filters.buildingAge}
                  onChange={(e) => {
                    setFilters({ ...filters, buildingAge: e.target.value })
                  }}
                />
              </div>

              {/* Floor */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Bulunduğu Kat</label>
                <Input
                  placeholder="örn: 3"
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
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
              {sortedAndFilteredProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {sortedAndFilteredProperties.length === 0 && (
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