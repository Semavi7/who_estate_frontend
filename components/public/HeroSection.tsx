'use client'
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from 'next/image'


interface City {
  code: string
  name: string
}

export default function HeroSection() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [listingType, setListingType] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [cities, setCities] = useState<City[]>([])

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

  const handleSearch = () => {
    const queryParams = new URLSearchParams()

    if (location) queryParams.append("city", location)
    if (listingType) queryParams.append("listingType", listingType)
    if (propertyType) queryParams.append("subType", propertyType)

    router.push(`/listings?${queryParams.toString()}`)
  }
  return (
    <section className="relative min-h-screen pt-16 md:pt-24">
      {/* Background Image */}
      <Image
        src="/hero-background.jpg"
        alt="Hero Background"
        fill
        className="object-cover object-center"
        priority
        quality={85}
      />
      <div className={`absolute inset-0 bg-black/35 animate-fadeIn`} />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 text-white"
          >
            <span
              className="block animate-slide-in-left"
              style={{ animationDelay: "2s" }}
            >
              Hayalinizdeki
            </span>
            <span
              className="block text-primary drop-shadow-lg animate-slide-in-right"
              style={{ animationDelay: "2s" }}
            >
              Evi Bulun
            </span>
          </h1>
          <p
            className="text-base md:text-lg lg:text-xl text-white mb-6 md:mb-8 max-w-2xl mx-auto px-4 drop-shadow-lg animate-slide-in-up"
            style={{ animationDelay: "2s" }}
          >
            Binlerce emlak ilanı arasından size en uygun
            olanını keşfedin. Satılık ve kiralık evler,
            işyerleri ve daha fazlası.
          </p>
        </div>

        {/* Search Form */}
        <div
          className="bg-card backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 max-w-4xl mx-auto animate-slide-in-up"
          style={{ animationDelay: "2s" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm text-foreground">
                İl
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger >
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

            <div className="space-y-2 md:col-span-1">
              <label className="text-sm text-foreground">
                İlan Tipi
              </label>
              <Select onValueChange={setListingType} value={listingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Satılık/Kiralık" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Satilik">
                    Satılık
                  </SelectItem>
                  <SelectItem value="Kiralik">
                    Kiralık
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-sm text-foreground">
                Emlak Tipi
              </label>
              <Select onValueChange={setPropertyType} value={propertyType}>
                <SelectTrigger className="shadow-md">
                  <SelectValue placeholder="Konut/İşyeri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daire">Daire</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Ofis">Ofis</SelectItem>
                  <SelectItem value="Dükkkan">
                    Dükkan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="text-sm text-gray-600 lg:invisible">
                Ara
              </label>
              <Button className="w-full h-10 bg-primary hover:bg-primary/90"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Ara
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-accent">
            <span className="text-sm text-foreground w-full md:w-auto mb-2 md:mb-0">
              Popüler Aramalar:
            </span>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Ankara Kiralık
            </button>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              İzmir Satılık
            </button>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Bursa Daire
            </button>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Antalya Villa
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 max-w-3xl mx-auto animate-slide-in-up"
          style={{ animationDelay: "2s" }}
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg mb-2">
              100+
            </div>
            <div className="text-white/90 text-sm md:text-base drop-shadow">
              Aktif İlan
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg mb-2">
              2,500+
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
              Başarılı Satış
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}