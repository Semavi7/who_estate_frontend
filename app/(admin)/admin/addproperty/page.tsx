'use client'
import { useState, useEffect } from "react"
import { Descendant, Span } from "slate"
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
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Checkbox } from "../../../../components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion"
import { Badge } from "../../../../components/ui/badge"
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
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/redux/authSlice"

interface ImageObject {
  id: string
  file: File
  preview: string
}

interface City {
  code: string
  name: string
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

export default function AddPropertyPage() {
  const router = useRouter()
  const user = useSelector(selectUser)
  const [cities, setCities] = useState<City[]>([])
  const [districtsAndNeighborhoods, setDistrictsAndNeighborhoods] = useState<Record<string, string[]>>({})
  const [categoryConfig, setCategoryConfig] = useState<Record<string, any>>({})
  const [featureOptions, setFeatureOptions] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Kategori
    propertyType: "",
    listingType: "",
    subType: "",

    // İlan Detayları
    title: "",
    description: [{ type: 'paragraph', children: [{ text: '' }] }] as Descendant[],
    price: "",
    grossArea: "",
    netArea: "",
    rooms: "",
    buildingAge: "",
    floor: "",
    totalFloors: "",
    heating: "",
    bathrooms: "",
    kitchen: "",
    balcony: "",
    elevator: "",
    parking: "",
    availability: "",
    deedStatus: "",
    furnished: "",
    dues: "",
    eligibleForLoan: "",

    // Adres
    city: "",
    district: "",
    neighborhood: "",
    address: "",
    coordinates: { lat: 0, lng: 0 },

    // Detay Bilgi
    features: [] as string[],

    // Fotoğraflar
    images: [] as ImageObject[]
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
    setFormData(prev => {
      const newState = { ...prev, [field]: value }

      // Şehir değişirse, ilçe ve mahalleyi sıfırla
      if (field === 'city') {
        newState.district = ""
        newState.neighborhood = ""
        setDistrictsAndNeighborhoods({}) // İlçe listesini de temizle
      }
      // İlçe değişirse, mahalleyi sıfırla
      if (field === 'district') {
        newState.neighborhood = ""
      }

      return newState
    })
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages: ImageObject[] = Array.from(files).map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file)
      }))
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const handleImageRemove = (id: string) => {
    setFormData(prev => {
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

  const handleSubmit = async () => {
    // Form validation
    if (!formData.title || !formData.propertyType || !formData.listingType) {
      toast.error("Lütfen zorunlu alanları doldurun")
      return
    }

    const toastId = toast.loading("İlan kaydediliyor...")

    try {
      const dataForApi: PropertySubmitData = {
        title: formData.title,
        description: JSON.stringify(formData.description),
        price: Number(formData.price),
        gross: Number(formData.grossArea),
        net: Number(formData.netArea),
        numberOfRoom: formData.rooms,
        buildingAge: Number(formData.buildingAge),
        floor: Number(formData.floor),
        numberOfFloors: Number(formData.totalFloors),
        heating: formData.heating,
        numberOfBathrooms: Number(formData.bathrooms),
        kitchen: formData.kitchen,
        balcony: Number(formData.balcony),
        lift: formData.elevator,
        parking: formData.parking,
        furnished: formData.furnished,
        availability: formData.availability,
        dues: Number(formData.dues),
        eligibleForLoan: formData.eligibleForLoan,
        titleDeedStatus: formData.deedStatus,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        subType: formData.subType,
        location: JSON.stringify({
          city: formData.city,
          district: formData.district,
          neighborhood: formData.neighborhood,
          geo: {
            type: 'Point',
            coordinates: [
              formData.coordinates.lng,
              formData.coordinates.lat
            ]
          }
        }),
        userId: user?._id || '',
        userName: user?.name || '',
        userSurname: user?.surname || '',
        userImage: user?.image || '',
        userPhone: user?.phonenumber || 0,
        selectedFeatures: JSON.stringify(groupFeatures(formData.features, featureOptions))
      }

      // Create FormData for API submission
      const submitData = new FormData()

      // Add all form fields
      Object.keys(dataForApi).forEach(key => {
        const formKey = key as keyof PropertySubmitData
        const value = dataForApi[formKey]
        if (value !== undefined && value !== null) {
          submitData.append(formKey, String(value))
        }
      })

      formData.images.forEach((imageObj) => {
        submitData.append('images', imageObj.file, imageObj.file.name)
      })

      await api.post('/properties', submitData)
      toast.success("İlan başarıyla oluşturuldu", { id: toastId })

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
    // Cleanup object URLs on component unmount
    return () => {
      formData.images.forEach(image => URL.revokeObjectURL(image.preview))
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
    if (!formData.city) return

    const fetchDistricts = async () => {
      const selectedCity = cities.find(c => c.name === formData.city)
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
  }, [formData.city, cities])

  useEffect(() => {
    // Sadece il, ilçe ve mahalle seçiliyse devam et
    if (!formData.city || !formData.district || !formData.neighborhood) {
      return
    }

    const geocodeAddress = async () => {
      const address = `${formData.neighborhood}, ${formData.district}, ${formData.city}, Turkey`

      const url = `/api/geocode?address=${encodeURIComponent(address)}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok && data.location) {
          handleInputChange('coordinates', data.location)
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
    const timer = setTimeout(() => {
      geocodeAddress()
    }, 500)
    return () => clearTimeout(timer)

  }, [formData.neighborhood])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.images.findIndex(img => img.id === active.id)
        const newIndex = prev.images.findIndex(img => img.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return prev
        return {
          ...prev,
          images: arrayMove(prev.images, oldIndex, newIndex),
        }
      })
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Emlak Tipi *</Label>
          <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
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
          <Select value={formData.listingType} onValueChange={(value) => handleInputChange('listingType', value)} disabled={!formData.propertyType}>
            <SelectTrigger>
              <SelectValue placeholder="İlan tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              {getListingTypes(formData.propertyType).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.subType}
            onValueChange={(value) => handleInputChange('subType', value)}
            disabled={!formData.propertyType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {getSubTypes(formData.propertyType, formData.listingType).map((type: any) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.propertyType && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-900">
            <strong>Seçilen Kategori:</strong>
            <span>{formData.propertyType}</span>
            {formData.listingType && <span> & {formData.listingType}</span>}
            {formData.subType && <span> & {formData.subType}</span>}
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
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Örn: Deniz Manzaralı Lüks Villa"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">İlan Açıklaması *</Label>
          <RichTextEditor
            value={formData.description}
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
            type="text"
            value={Number(formData.price).toLocaleString('tr-TR')}
            onChange={(e) => {
              const unformattedValue = e.target.value.replace(/\./g, '')
              handleInputChange('price', unformattedValue)
            }}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grossArea">Brüt M² *</Label>
          <Input
            id="grossArea"
            type="number"
            value={formData.grossArea}
            onChange={(e) => handleInputChange('grossArea', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="netArea">Net M²</Label>
          <Input
            id="netArea"
            type="number"
            value={formData.netArea}
            onChange={(e) => handleInputChange('netArea', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buildingAge">Bina Yaşı</Label>
          <Input
            id="buildingAge"
            type="number"
            value={formData.buildingAge}
            onChange={(e) => handleInputChange('buildingAge', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dues">Aidat</Label>
          <Input
            id="dues"
            type="number"
            value={formData.dues}
            onChange={(e) => handleInputChange('dues', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rooms">Oda Sayısı</Label>
          <Select value={formData.rooms} onValueChange={(value) => handleInputChange('rooms', value)}>
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
          <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
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
          <Select value={formData.eligibleForLoan} onValueChange={(value) => handleInputChange('eligibleForLoan', value)}>
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
          <Select value={formData.furnished} onValueChange={(value) => handleInputChange('furnished', value)}>
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
          <Select value={formData.kitchen} onValueChange={(value) => handleInputChange('kitchen', value)}>
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
          <Select value={formData.deedStatus} onValueChange={(value) => handleInputChange('deedStatus', value)}>
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
          <Select value={formData.balcony} onValueChange={(value) => handleInputChange('balcony', value)}>
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
            value={formData.floor}
            onChange={(e) => handleInputChange('floor', e.target.value)}
            placeholder="Örn: 3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalFloors">Toplam Kat Sayısı</Label>
          <Input
            id="totalFloors"
            value={formData.totalFloors}
            onChange={(e) => handleInputChange('totalFloors', e.target.value)}
            placeholder="Örn: 8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heating">Isıtma</Label>
          <Select value={formData.heating} onValueChange={(value) => handleInputChange('heating', value)}>
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
          <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Banyo sayısını seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5+">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="elevator">Asansör</Label>
          <Select value={formData.elevator} onValueChange={(value) => handleInputChange('elevator', value)}>
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
          <Select value={formData.parking} onValueChange={(value) => handleInputChange('parking', value)}>
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
          <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
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
          <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)} disabled={!formData.city}>
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
          <Select value={formData.neighborhood} onValueChange={(value) => handleInputChange('neighborhood', value)} disabled={!formData.district}>
            <SelectTrigger>
              <SelectValue placeholder="Mahalle seçin" />
            </SelectTrigger>
            <SelectContent>
              {formData.district && districtsAndNeighborhoods[formData.district]?.map(neighborhood => (
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
          <div className="bg-gray-100 h-50 md:h-180 rounded-lg flex items-center justify-center">
            <MapPicker
              center={formData.coordinates.lat === 0
                ? { lat: 41.0082, lng: 28.9784 }
                : formData.coordinates}
              onLocationChange={(coords) => handleInputChange('coordinates', coords)}
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
                  {features.filter(f => formData.features.includes(f)).length}/{features.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                {features.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
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
          <CardTitle>Seçilen Özellikler ({formData.features.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.features.map(feature => (
              <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                <span>{feature}</span>
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFeatureToggle(feature)}
                />
              </Badge>
            ))}
            {formData.features.length === 0 && (
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

      {formData.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yüklenen Fotoğraflar ({formData.images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.images.map(i => i.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image) => (
                    <SortableImageItem key={image.id} id={image.id} image={image} onRemove={handleImageRemove} />
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
      <div className="grid grid-cols-1 gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col items-start  md:items-center md:flex-row gap-4">
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
            <span>İlanı Kaydet</span>
          </Button>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-start md:justify-between overflow-x-auto py-4 scrollbar-hide">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
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
                  <span>İlanı Kaydet</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}