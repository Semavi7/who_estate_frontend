'use client'
import { useState, useEffect, use } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Checkbox } from "../../../../../components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../../components/ui/accordion"
import { Badge } from "../../../../../components/ui/badge"
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  MapPin,
  GripVertical,
  Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import PropertySubmitData from "@/dto/createproperty.dto"
import { MapPicker } from "@/components/ui/mappicker"
import PropertyGetData from "@/dto/getproperty.dto"

interface ImageObject {
  id: string
  file: File
  preview: string
}

interface City {
  code: string
  name: string
}

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

function SortableImageItem({ id, image, onRemove }: { id: any; image: ImageObject; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img src={image.preview} alt={image.file.name} className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div
        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 p-1 rounded-md cursor-grab"
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>
      <p className="text-xs text-center mt-1 truncate">{image.file.name}</p>
    </div>
  )
}

function SortableUrlImageItem({ id, image, onRemove }: { id: string; image: string; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img src={image} alt="Property Image" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div
        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 p-1 rounded-md cursor-grab"
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [cities, setCities] = useState<City[]>([])
  const [districtsAndNeighborhoods, setDistrictsAndNeighborhoods] = useState<Record<string, string[]>>({})
  const [categoryConfig, setCategoryConfig] = useState<Record<string, any>>({})
  const [featureOptions, setFeatureOptions] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState({ images: [] as ImageObject[] })
  const [coord, setCoord] = useState({ coordinates: { lat: 0, lng: 0 } })
  const [properties, setProperties] = useState<PropertyGetData>({
    _id: "",
    title: "",
    description: "",
    price: 0,
    gross: 0,
    net: 0,
    numberOfRoom: "",
    buildingAge: 0,
    floor: 0,
    numberOfFloors: 0,
    heating: "",
    numberOfBathrooms: 0,
    kitchen: "",
    balcony: 0,
    lift: "",
    parking: "",
    furnished: "",
    availability: "",
    dues: 0,
    eligibleForLoan: "",
    titleDeedStatus: "",
    location: {
      city: "",
      district: "",
      neighborhood: "",
      geo: {
        type: "",
        coordinates: []
      }
    },
    propertyType: "",
    listingType: "",
    subType: "",
    selectedFeatures: [],
    images: [],
    createdAt: "",
  })


  const groupFeatures = (selected: string[], allOptions: Record<string, string[]>): Record<string, string[]> => {
    const grouped: Record<string, string[]> = {}

    for (const category in allOptions) {
      if (Object.prototype.hasOwnProperty.call(allOptions, category)) {
        const categoryFeatures = allOptions[category]
        const selectedInCategory = selected.filter(feature => categoryFeatures.includes(feature))

        if (selectedInCategory.length > 0) {
          grouped[category] = selectedInCategory
        }
      }
    }
    return grouped
  }

  const getPropertyTypes = () => Object.keys(categoryConfig)

  const getListingTypes = (propertyType: string) => {
    if (!categoryConfig[propertyType]) return []
    return Object.keys(categoryConfig[propertyType])
  }

  const getSubTypes = (propertyType: string, listingType: string) => {
    if (!propertyType || !listingType || !categoryConfig[propertyType]?.[listingType]) return []
    return categoryConfig[propertyType][listingType]

  }

  const handleInputChange = (field: string, value: any) => {
    setProperties(prev => {
      const fields = field.split('.');

      // Derin kopyalama ve güncelleme için yardımcı fonksiyon
      const updateNestedState = (obj: any, path: string[], val: any): any => {
        const key = path[0]
        if (path.length === 1) {
          return { ...obj, [key]: val }
        }

        const nextObj = obj[key] ? { ...obj[key] } : {}
        return {
          ...obj,
          [key]: updateNestedState(nextObj, path.slice(1), val)
        }
      }

      const newState = updateNestedState(prev, fields, value)

      // Şehir veya ilçe değiştiğinde ilgili alanları sıfırlama mantığı
      if (field === 'location.city') {
        newState.location.district = ""
        newState.location.neighborhood = ""
        setDistrictsAndNeighborhoods({})
      }
      if (field === 'location.district') {
        newState.location.neighborhood = ""
      }
      if (field === 'description') {
        newState.description = JSON.stringify(value);
      }
      return newState
    })
  }

  const handleFeatureToggle = (feature: string) => {
    setProperties(prev => ({
      ...prev,
      features: properties.selectedFeatures.includes(feature)
        ? properties.selectedFeatures.filter(f => f !== feature)
        : [...prev.selectedFeatures, feature]
    }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages: ImageObject[] = Array.from(files).map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file)
      }))
      setImages(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const handleImageRemove = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.images.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return {
        ...prev,
        images: prev.images.filter((img) => img.id !== id)
      }
    })
  }

  const handleExistingImageRemove = (imageUrlToRemove: string) => {
    setProperties(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== imageUrlToRemove)
    }))
  }

  const handleSubmit = async () => {
    // Form validation
    if (!properties.title || !properties.propertyType || !properties.listingType) {
      toast.error("Lütfen zorunlu alanları doldurun")
      return
    }

    const toastId = toast.loading("İlan kaydediliyor...")

    try {
      const dataForApi: PropertySubmitData = {
        title: properties.title,
        description: properties.description,
        price: Number(properties.price),
        gross: Number(properties.gross),
        net: Number(properties.net),
        numberOfRoom: properties.numberOfRoom,
        buildingAge: Number(properties.buildingAge),
        floor: Number(properties.floor),
        numberOfFloors: Number(properties.numberOfFloors),
        heating: properties.heating,
        numberOfBathrooms: Number(properties.numberOfBathrooms),
        kitchen: properties.kitchen,
        balcony: Number(properties.balcony),
        lift: properties.lift,
        parking: properties.parking,
        furnished: properties.furnished,
        availability: properties.availability,
        dues: Number(properties.dues),
        eligibleForLoan: properties.eligibleForLoan,
        titleDeedStatus: properties.titleDeedStatus,
        propertyType: properties.propertyType,
        listingType: properties.listingType,
        subType: properties.subType,
        location: JSON.stringify({
          city: properties.location.city,
          district: properties.location.district,
          neighborhood: properties.location.neighborhood,
          geo: {
            type: 'Point',
            coordinates: [
              coord.coordinates.lng,
              coord.coordinates.lat
            ]
          }
        }),
        selectedFeatures: JSON.stringify(groupFeatures(properties.selectedFeatures, featureOptions))
      }


      const submitData = new FormData()


      Object.keys(dataForApi).forEach(key => {
        const formKey = key as keyof PropertySubmitData
        const value = dataForApi[formKey]
        if (value !== undefined && value !== null) {
          submitData.append(formKey, String(value))
        }
      })
      if (images.images.length > 0) {
        images.images.forEach((imageObj) => {
          submitData.append('newImages', imageObj.file, imageObj.file.name)
        })
      }

      submitData.append('existingImageUrls', JSON.stringify(properties.images))
      await api.put(`/properties/${id}`, submitData)
      toast.success("İlan başarıyla güncellendi", { id: toastId })

      router.push('/admin/properties')
    } catch (error) {
      toast.error("İlan oluşturulurken hata oluştu", { id: toastId })
    }
  }

  const steps = [
    { id: 1, title: "Kategori", description: "Emlak türü ve kategorisi" },
    { id: 2, title: "İlan Detayları", description: "Başlık, açıklama ve özellikler" },
    { id: 3, title: "Adres Bilgileri", description: "Konum ve adres" },
    { id: 4, title: "Detay Bilgi", description: "Ek özellikler" },
    { id: 5, title: "Fotoğraflar", description: "Görseller ve medya" }
  ]

  useEffect(() => {
    if (id) {
      const getPropertyById = async (id: string) => {
        try {
          const res = await api.get(`/properties/${id}`)
          const propertydata = res.data
          propertydata.selectedFeatures = Object.values(propertydata.selectedFeatures).flat()
          setProperties(propertydata)
        } catch (error) {
          toast.error("İlan verileri yüklenirken bir hata oluştu.")
        }
      }
      getPropertyById(id)
    }

  }, [id])

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      images.images.forEach(image => URL.revokeObjectURL(image.preview))
    }
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesResponse, featuresResponse] = await Promise.all([
          api.get('/properties/categories'),
          api.get('/feature-options')
        ])

        setCategoryConfig(categoriesResponse.data)
        setFeatureOptions(featuresResponse.data)
      } catch (error) {
        console.error("Form verileri çekilirken hata oluştu:", error)
        toast.error("Gerekli veriler yüklenemedi. Lütfen sayfayı yenileyin.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

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

    const fetchDistricts = async () => {
      const selectedCity = cities.find(c => c.name === properties.location.city)
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
  }, [properties.location.city, cities])


  const geocodeAddress = async () => {
    if (!properties.location.city || !properties.location.district || !properties.location.neighborhood) {
      return
    }
    const address = `${properties.location.neighborhood}, ${properties.location.district}, ${properties.location.city}, Turkey`;

    const url = `/api/geocode?address=${encodeURIComponent(address)}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log('data', data)

      if (response.ok && data.location) {
        setCoord({ coordinates: { lat: data.location.lat, lng: data.location.lng } })
        toast.info("Adres haritada bulundu ve işaretlendi.")
      } else {
        console.error('Geocoding Başarısız:', data)
        const errorMessage = data.details === 'ZERO_RESULTS'
          ? "Bu adres için haritada sonuç bulunamadı."
          : `Harita Hatası: ${data.error || 'Bilinmeyen bir sorun oluştu.'}`
      }
    } catch (error) {
      console.error('Geocoding request error:', error)
      toast.error("Harita servisine bağlanırken bir hata oluştu.")
    }
  }

  const handleNeighborhoodInputChange = (value: string) => {
    setProperties({...properties, location: {...properties.location, neighborhood: value}})
    geocodeAddress()
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setImages(prev => {
        const oldIndex = prev.images.findIndex(img => img.id === active.id)
        const newIndex = prev.images.findIndex(img => img.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return prev
        return {
          ...prev,
          images: arrayMove(prev.images, oldIndex, newIndex),
        }
      })

      setProperties(prev => {
        const oldIndex = prev.images.findIndex(url => url === active.id)
        const newIndex = prev.images.findIndex(url => url === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
          return {
            ...prev,
            images: arrayMove(prev.images, oldIndex, newIndex),
          }
        }
        return prev
      })
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Emlak Tipi *</Label>
          <Select value={properties.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Emlak tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              {getPropertyTypes().map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="listingType">İlan Tipi *</Label>
          <Select value={properties.listingType} onValueChange={(value) => handleInputChange('listingType', value)} disabled={!properties.propertyType}>
            <SelectTrigger>
              <SelectValue placeholder="İlan tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              {getListingTypes(properties.propertyType).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={properties.subType}
            onValueChange={(value) => handleInputChange('subType', value)}
            disabled={!properties.propertyType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {getSubTypes(properties.propertyType, properties.listingType).map((type: any) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {properties.propertyType && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-900">
            <strong>Seçilen Kategori:</strong>
            <span>{properties.propertyType}</span>
            {properties.listingType && <span> & {properties.listingType}</span>}
            {properties.subType && <span> & {properties.subType}</span>}
          </div>
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title">İlan Başlığı *</Label>
          <Input
            id="title"
            value={properties.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Örn: Deniz Manzaralı Lüks Villa"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">İlan Açıklaması *</Label>
          <RichTextEditor
            value={JSON.parse(properties.description)}
            onChange={(value) => handleInputChange('description', value)}
            placeholder="İlan detaylarını yazın..."
            className="min-h-96"
          />
          <p className="text-xs text-gray-500">
            Zengin metin düzenleyici ile formatlamalar, linkler ve resimler ekleyebilirsiniz.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (TL) *</Label>
          <Input
            id="price"
            type="number"
            value={properties.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grossArea">Brüt M² *</Label>
          <Input
            id="grossArea"
            type="number"
            value={properties.gross}
            onChange={(e) => handleInputChange('gross', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="netArea">Net M²</Label>
          <Input
            id="netArea"
            type="number"
            value={properties.net}
            onChange={(e) => handleInputChange('net', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Bina Yaşı</Label>
          <Input
            id="buildingAge"
            type="number"
            value={properties.buildingAge}
            onChange={(e) => handleInputChange('buildingAge', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dues">Aidat</Label>
          <Input
            id="dues"
            type="number"
            value={properties.dues}
            onChange={(e) => handleInputChange('dues', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rooms">Oda Sayısı</Label>
          <Select value={properties.numberOfRoom} onValueChange={(value) => handleInputChange('numberOfRoom', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Oda sayısını seçin" />
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

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Kullanım Durumu</Label>
          <Select value={properties.availability} onValueChange={(value) => handleInputChange('availability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Kullanım durumunu seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dolu">dolu</SelectItem>
              <SelectItem value="boş">boş</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Kredi Durumu</Label>
          <Select value={properties.eligibleForLoan} onValueChange={(value) => handleInputChange('eligibleForLoan', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Kredi durumunu seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uygun">uygun</SelectItem>
              <SelectItem value="uygun değil">uygun değil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Eşyalı</Label>
          <Select value={properties.furnished} onValueChange={(value) => handleInputChange('furnished', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Eşya durumunu seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="evet">evet</SelectItem>
              <SelectItem value="hayır">hayır</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Mutfak</Label>
          <Select value={properties.kitchen} onValueChange={(value) => handleInputChange('kitchen', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Mutfak durumunu seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="açık">açık</SelectItem>
              <SelectItem value="kapalı">kapalı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Tapu Durumu</Label>
          <Select value={properties.titleDeedStatus} onValueChange={(value) => handleInputChange('titleDeedStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tapu durumunu seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kat Mülküyetli">Kat Mülküyetli</SelectItem>
              <SelectItem value="Kat İrtifaklı">Kat İrtifaklı</SelectItem>
              <SelectItem value="Hisseli Tapu">Hisseli Tapu</SelectItem>
              <SelectItem value="Müstakil Tapulu">Müstakil Tapulu</SelectItem>
              <SelectItem value="Arsa Tapulu">Arsa Tapulu</SelectItem>
              <SelectItem value="Kooperatif Hisseli Tapu">Kooperatif Hisseli Tapu</SelectItem>
              <SelectItem value="İntifa Hakkı Tesisli">İntifa Hakkı Tesisli</SelectItem>
              <SelectItem value="Yurt Dışı Tapulu">Yurt Dışı Tapulu</SelectItem>
              <SelectItem value="Tapu Kaydı Yok">Tapu Kaydı Yok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Balkon</Label>
          <Select value={String(properties.balcony)} onValueChange={(value) => handleInputChange('balcony', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Balkon adedini seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">1</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">Bulunduğu Kat</Label>
          <Input
            id="floor"
            value={properties.floor}
            onChange={(e) => handleInputChange('floor', e.target.value)}
            placeholder="Örn: 3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalFloors">Toplam Kat Sayısı</Label>
          <Input
            id="totalFloors"
            value={properties.numberOfFloors}
            onChange={(e) => handleInputChange('numberOfFloors', e.target.value)}
            placeholder="Örn: 8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heating">Isıtma</Label>
          <Select value={properties.heating} onValueChange={(value) => handleInputChange('heating', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Isıtma tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Merkezi Sistem">Merkezi Sistem</SelectItem>
              <SelectItem value="Kombi">Kombi</SelectItem>
              <SelectItem value="Klima">Klima</SelectItem>
              <SelectItem value="Soba">Soba</SelectItem>
              <SelectItem value="Yok">Yok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Banyo Sayısı</Label>
          <Select value={String(properties.numberOfBathrooms)} onValueChange={(value) => handleInputChange('numberOfBathrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Banyo sayısını seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="elevator">Asansör</Label>
          <Select value={properties.lift} onValueChange={(value) => handleInputChange('lift', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Asansör durumu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="var">Var</SelectItem>
              <SelectItem value="yok">Yok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parking">Otopark</Label>
          <Select value={properties.parking} onValueChange={(value) => handleInputChange('parking', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Otopark durumu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acik">Açık Otopark</SelectItem>
              <SelectItem value="kapali">Kapalı Otopark</SelectItem>
              <SelectItem value="yok">Yok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">İl *</Label>
          <Select value={properties.location.city} onValueChange={(value) => handleInputChange('location.city', value)}>
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
          <Label htmlFor="district">İlçe *</Label>
          <Select value={properties.location.district} onValueChange={(value) => handleInputChange('location.district', value)} disabled={!properties.location.city}>
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
          <Select value={properties.location.neighborhood} onValueChange={(value) => handleNeighborhoodInputChange(value)} disabled={!properties.location.district}>
            <SelectTrigger>
              <SelectValue placeholder="Mahalle seçin" />
            </SelectTrigger>
            <SelectContent>
              {properties.location.district && districtsAndNeighborhoods[properties.location.district]?.map(neighborhood => (
                <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Harita Konumu</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 h-180 rounded-lg flex items-center justify-center">
            <MapPicker
              center={coord.coordinates.lat === 0
                ? { lat: properties.location.geo.coordinates[1], lng: properties.location.geo.coordinates[0] }
                : coord.coordinates}
              onLocationChange={(coords) => setCoord({ ...coord, coordinates: coords })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full">
        {Object.entries(featureOptions).map(([category, features]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span>
                  {category}
                </span>
                <Badge variant="secondary" className="ml-2">
                  {features.filter(f => properties.selectedFeatures.includes(f)).length}/{features.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                {features.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={Array.isArray(properties.selectedFeatures) && properties.selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label
                      htmlFor={feature}
                      className="text-sm cursor-pointer"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Card>
        <CardHeader>
          <CardTitle>Seçilen Özellikler ({Array.isArray(properties.selectedFeatures) && properties.selectedFeatures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(properties.selectedFeatures) && properties.selectedFeatures.map(feature => (
              <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                <span>{feature}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFeatureToggle(feature)}
                />
              </Badge>
            ))}
            {Array.isArray(properties.selectedFeatures) && properties.selectedFeatures.length === 0 && (
              <p className="text-gray-500">Henüz özellik seçilmedi</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fotoğraf Yükleme</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-upload')?.click()}
            onDrop={(e) => {
              e.preventDefault()
              handleImageUpload(e.dataTransfer.files)
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg">Fotoğrafları sürükleyip bırakın</p>
            <p className="text-sm text-gray-500">veya bilgisayarınızdan seçin</p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {images.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yüklenecek Fotoğraflar ({images.images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.images.map(i => i.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.images.map((image) => (
                    <SortableImageItem key={image.id} id={image.id} image={image} onRemove={handleImageRemove} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}

      {properties.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yüklenen Fotoğraflar ({properties.images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={properties.images.map(i => i)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {properties.images.map((image) => (
                    <SortableUrlImageItem key={image} id={image} image={image} onRemove={handleExistingImageRemove} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">İlan verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/properties')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div>
            <h2 className="text-2xl">Yeni İlan Oluştur</h2>
            <p className="text-gray-600">Emlak ilanı bilgilerini girin</p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>İlanı Güncelle</span>
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <div className="text-sm">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-px flex-1 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Önceki Adım
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              >
                Sonraki Adım
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>İlanı Güncelle</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}