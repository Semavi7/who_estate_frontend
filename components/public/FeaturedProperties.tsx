'use client'
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Square, CalendarClock, HousePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PropertyGetData from "@/dto/getproperty.dto";
import api from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<PropertyGetData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await api.get('/properties/lastsix')
        setProperties(res.data)
      } catch (error) {
        toast.error("Veri alınırken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-foreground">Öne Çıkan İlanlar</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            En popüler ve kaliteli emlak ilanlarımızı keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {!loading ? properties.map((property) => (
            <Card key={property._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative w-full h-44 md:h-48">
                <Image
                  fill
                  src={property.images[0]}
                  alt={property.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 md:top-4 left-3 md:left-4">
                  <Badge
                    variant={property.listingType === 'Satılık' ? 'default' : 'secondary'}
                  >
                    {property.listingType}
                  </Badge>
                </div>

              </div>

              <CardContent className="p-4 md:p-6">
                <div className="mb-4">
                  <h3 className="text-base md:text-lg mb-2 text-primary line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{property.location.city}</span>
                  </div>
                  <div className="text-lg md:text-2xl text-primary">
                    {property.price.toLocaleString('tr-TR')} {property.propertyType === 'Satılık' ? '₺' : '₺/ay'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-4 gap-2">
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
          )) : (
            Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} className="w-[423px] h-[391px]" />
            ))
          )}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href={'/listings'}>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              Tüm İlanları Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}