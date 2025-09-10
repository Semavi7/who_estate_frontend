'use client'
import React from 'react'
import { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    ChevronLeft,
    ChevronRight,
    Check,
    X
} from "lucide-react";
import Link from "next/link";
import PropertyGetData from "@/dto/getproperty.dto";
import api from "@/lib/axios";
import { RichTextRenderer } from "@/components/ui/rich-text-renderer";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import Image from "next/image";
import { PropertySchema } from "@/components/structured-data/PropertySchema";

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places']

interface Property {
    id: string
}

const Property = ({ id }: Property) => {
    const [property, setProperty] = useState<PropertyGetData | null>(null)
    const [allFeatures, setAllFeatures] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(true)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyA3iPYujGJLwvxjaJmPzqR0kx_z2nk2FTM",
        libraries,
    })

    useEffect(() => {
        const loadProperty = async (id: string) => {
            try {
                const res = await api.get(`/properties/${id}`)
                setProperty(res.data)
            } catch (error) {
                toast.error("İlan çekilirken hata oluştu")
            } finally {
                setLoading(false)
            }
        }

        const loadAllFeatures = async () => {
            try {
                const res = await api.get('/feature-options')
                setAllFeatures(res.data)
            } catch (error) {
                toast.error("Kategoriler çekilirken hata oluştu")
            }
        }

        loadProperty(id)
        loadAllFeatures()
    }, [id])

    const formatPrice = (price: number, listingType: string) => {
        return `${price.toLocaleString('tr-TR')} TL${listingType === 'kiralik' ? '/ay' : ''}`;
    };

    const formatPhoneNumber = (phoneNumber: string) => {
        // Gelen numara 10 haneli (örn: 5364444444)
        // Çıktı (0XXX) XXX XX XX şeklinde olacak
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `(0${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
        }
        return phoneNumber; // Biçimlendirilemezse orijinalini döndür
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'Konut':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700">Konut</Badge>
            case 'İşyeri':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700">İşyeri</Badge>
            case 'Arsa':
                return <Badge variant="outline" className="bg-orange-50 text-emerald-700">Arsa</Badge>
            case 'Bina':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700">Bina</Badge>
            case 'Devre Mülk':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700">Devre Mülk</Badge>
            case 'Turistik Tesis':
                return <Badge variant="outline" className="bg-orange-50 text-shadow-amber-700">Turistik Tesis</Badge>
            default:
                return <Badge variant="outline">Bilinmiyor</Badge>;
        }
    };

    const nextImage = (e?: React.MouseEvent) => {
        if (property) {
            e?.stopPropagation()
            setSelectedImageIndex((prev) =>
                prev === property.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (property) {
            setSelectedImageIndex((prev) =>
                prev === 0 ? property.images.length - 1 : prev - 1
            );
        }
    };

    const openLightbox = () => setIsLightboxOpen(true)
    const closeLightbox = () => setIsLightboxOpen(false)

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
        <div className="min-h-screen pt-20 mt-7">
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
                                <div className="relative cursor-pointer" onClick={openLightbox}>
                                    <div className="aspect-video bg-background rounded-t-lg overflow-hidden w-full h-full">
                                        <Image
                                            fill
                                            src={property.images[selectedImageIndex]}
                                            alt={property.title}
                                            className=" object-contain object-center"
                                        />
                                    </div>

                                    {/* Image Navigation */}
                                    {property.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => prevImage(e)}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-muted-foreground hover:bg-muted-foreground/80 rounded-full p-2 shadow-lg transition-all"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => nextImage(e)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-muted-foreground hover:bg-muted-foreground/80 rounded-full p-2 shadow-lg transition-all"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {selectedImageIndex + 1} / {property.images.length}
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
                                                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${selectedImageIndex === index ? 'ring-2 ring-primary ' : ''
                                                        }`}
                                                >
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            fill
                                                            src={image}
                                                            alt={`${property.title} - ${index + 1}`}
                                                            className="object-cover"
                                                        />
                                                    </div>
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
                                <div className="flex flex-col md:flex-row items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            {getTypeBadge(property.propertyType)}
                                            <Badge variant="secondary" className={
                                                property.listingType === 'Satilik'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }>
                                                {property.listingType}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl">{property.title}</CardTitle>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {property.location.city} - {property.location.district} - {property.location.neighborhood}
                                        </div>
                                    </div>
                                    <div className="text-right pt-2 md:pt-7">
                                        <div className="text-3xl text-primary">
                                            {formatPrice(property.price, property.listingType)}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="text-center p-3 rounded-lg">
                                        <Square className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm text-gray-600">Brüt Alan</div>
                                        <div>{property.gross} m²</div>
                                    </Card>
                                    <Card className="text-center p-3  rounded-lg">
                                        <Bed className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm text-gray-600">Oda Sayısı</div>
                                        <div>{property.numberOfRoom}</div>
                                    </Card>
                                    <Card className="text-center p-3  rounded-lg">
                                        <Bath className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm text-gray-600">Banyo</div>
                                        <div>{property.numberOfBathrooms}</div>
                                    </Card>
                                    <Card className="text-center p-3  rounded-lg">
                                        <Calendar className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm text-gray-600">Bina Yaşı</div>
                                        <div>{property.buildingAge}</div>
                                    </Card>
                                </div>

                                <Separator />

                                {/* Description */}
                                <Card>
                                    <h3 className="text-lg p-3">İlan Açıklaması</h3>
                                    <div className="text-gray-700 leading-relaxed">
                                        <RichTextRenderer data={property.description} />
                                    </div>
                                </Card>

                                <Separator />

                                {/* Property Details */}
                                <div>
                                    <h3 className="text-lg mb-3">Emlak Detayları</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Kategori:</span>
                                                <span>{property.subType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Brüt Alan:</span>
                                                <span>{property.gross} m²</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Net Alan:</span>
                                                <span>{property.net} m²</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Toplam Kat Sayısı:</span>
                                                <span>{property.numberOfFloors}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Mutfak:</span>
                                                <span>{property.kitchen}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Mobilyalı:</span>
                                                <span>{property.furnished}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Aidat:</span>
                                                <span>{property.dues}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Tapu Durumu:</span>
                                                <span>{property.titleDeedStatus}</span>
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
                                                    {property.lift}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Otopark:</span>
                                                <span className="flex items-center">
                                                    <Car className="h-4 w-4 mr-1" />
                                                    {property.parking}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bulunduğu Kat:</span>
                                                <span>{property.floor}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Balkon Sayısı:</span>
                                                <span>{property.balcony}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Uygunluk Durumu:</span>
                                                <span>{property.availability}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600"> Krediye Uygunluk:</span>
                                                <span>{property.eligibleForLoan}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Features */}
                                <div>
                                    <h3 className="text-lg mb-4">Özellikler</h3>
                                    <div className="space-y-6">
                                        {Object.entries(allFeatures).map(([category, features]: any) => (
                                            <div key={category}>
                                                <h4 className="font-semibold mb-3 text-gray-600 border-b pb-2">{category}</h4>
                                                <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                                                    {features.map((feature: any) => {
                                                        const isSelected = property.selectedFeatures[category]?.includes(feature);
                                                        return (
                                                            <div key={feature} className={`flex items-center text-sm ${isSelected ? 'text-card-foreground' : 'text-gray-500 line-through'}`}>
                                                                <Check className={`h-4 w-4 mr-2 ${isSelected ? 'text-green-500' : 'text-gray-300'}`} />
                                                                <span>{feature}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Address */}
                                <div>
                                    <h3 className="text-lg mb-3">Adres</h3>
                                    <div className="flex items-start space-x-2">
                                        <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                                        <p className="text-gray-700">{property.location.city} - {property.location.district} - {property.location.neighborhood}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-100 h-180 rounded-lg flex items-center justify-center">
                                    {!isLoaded ? <div>Harita yüklenemedi.</div> : <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        zoom={15}
                                        center={{ lat: property.location.geo.coordinates[1], lng: property.location.geo.coordinates[0] }}
                                    >
                                        <MarkerF position={{ lat: property.location.geo.coordinates[1], lng: property.location.geo.coordinates[0] }} />
                                    </GoogleMap>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Contact */}
                    <div className="space-y-6">
                        {/* Agent Info */}
                        <Card className="flex justify-center">
                            <CardHeader className="flex justify-center">
                                <CardTitle>Emlak Danışmanı</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 flex flex-col items-center text-center">
                                <Image alt="User Image" height={144} width={144} src={property.user?.image || '/default-user-image.png'} />
                                <div>
                                    <div className="text-lg">{property.user?.name} {property.user?.surname}</div>
                                    <div className="text-sm text-gray-600">Emlak Uzmanı</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-600" />
                                        <span className="pl-1 pr-2">+90 (216) 399 3443</span>
                                        <span>{formatPhoneNumber(String(property.user?.phonenumber))}</span>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <Button className="w-full" onClick={() => { window.location.href = `tel:${property.user?.phonenumber}` }}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Ara
                                    </Button>
                                </div>
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
                                        <span>{Math.round(property.price / property.gross).toLocaleString('tr-TR')} TL/m²</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            
            <PropertySchema property={property} />

            {isLightboxOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-5 right-5 text-white hover:text-gray-300"
                        onClick={closeLightbox}
                    >
                        <X size={32} />
                    </button>

                    {/* Image Container */}
                    <div className="relative w-full h-full max-w-4xl max-h-4/5 p-4">
                        <Image
                            fill
                            src={property.images[selectedImageIndex]}
                            alt={property.title}
                            className="object-contain"
                        />
                    </div>

                    {/* Lightbox Navigation */}
                    {property.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => prevImage(e)}
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 rounded-full p-3"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={(e) => nextImage(e)}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 rounded-full p-3"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Property