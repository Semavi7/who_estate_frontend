"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import api from "@/lib/axios";
import axios from "axios";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const messageSchema = z.object({
  email: z.email('Doğru formatta mail adresi giriniz.').nonempty('Email zorunludur.'),
  name: z.string().nonempty('Ad zorunludur.'),
  surname: z.string().nonempty('Soyad zorunludur.'),
  phone: z.string().min(1, "Telefon numarası zorunludur."),
  message: z.string().nonempty('Mesaj zorunludur.')
})

type Message = z.infer<typeof messageSchema>

type FieldErrors<T> = {
  [K in keyof T]?: {
    errors: string[];
  }
}
const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places']

export default function ContactPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  })
  const [errors, setErrors] = useState<FieldErrors<Message> | null>()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    surname: "",
    message: ""
  })

  const sendNotification = async () => {

    try {
      const response = await axios.post("/api/send-notification", { title: "Yeni Müşteri Mesajı", message: `${formData.name} ${formData.surname} isimli müşteriden mesaj geldi.` });
      console.log('Bildirim başarıyla gönderildi:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Bildirim gönderme hatası:', error.response?.data || error.message);
      } else {
        console.error('Beklenmedik bir hata oluştu:', error);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = messageSchema.safeParse(formData)

    if (!result.success) {
      const errorTree = z.treeifyError(result.error)
      const fieldErrors = errorTree.properties

      setErrors(fieldErrors) // Tüm hataları state'e kaydet
      toast.error("Lütfen zorunlu alanları doldurun ve hataları düzeltin.")
      console.error("Form validasyon hataları:", fieldErrors)
      return
    }

    // Validasyon başarılıysa, hataları temizle
    setErrors(null)

    try {
      await api.post('/messages', formData)
      sendNotification()
      toast.success("Mesaj başarı ile gönderildi.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        surname: "",
        message: ""
      })
    } catch (error) {
      toast.error('Giriş Yapılamadı. Lütfen Bilgileriniizi Kontrol Ediniz.')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value }

      const result = messageSchema.safeParse(newState)

      if (!result.success) {
        const errorTree = z.treeifyError(result.error)
        const fieldErrors = errorTree.properties

        setErrors(fieldErrors)
      } else {
        setErrors(null)
      }

      return newState
    })
  }

  const handleGetDirections = () => {
    const latitude = 40.924026505546635; // Ofis konumunun enlemi
    const longitude = 29.134704567395538; // Ofis konumunun boylamı
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      details: [
        "+90 (216) 399 3443",
        "+90 (356) 810 0880"
      ],
      description: "7/24 Destek Hattı"
    },
    {
      icon: Mail,
      title: "E-posta",
      details: [
        "deryaemlakwhoestate@gmail.com"
      ],
      description: "24 saat içinde yanıt"
    },
    {
      icon: MapPin,
      title: "Adres",
      details: [
        "Bağlarbaşı Mah. Selahattin Bey Sok.",
        "No: 1/A Maltepe/İstanbul"
      ],
      description: "Ana ofisimiz"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      details: [
        "Pazartesi - Cuma: 09:00-18:00",
        "Cumartesi: 10:00-16:00"
      ],
      description: "Pazar kapalı"
    }
  ];

  return (
    <div className="pt-16 md:pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/20 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">İletişim</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Emlak ihtiyaçlarınız için bizimle iletişime geçin.
            Uzman ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-900">{detail}</p>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="h-131">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                    Bizimle İletişime Geçin
                  </CardTitle>
                  <p className="text-gray-600">
                    Formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad</Label>
                        <Input
                          id="name"
                          placeholder="Adınız"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                        {errors?.name?.errors && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.errors[0]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="surname">Soyad</Label>
                        <Input
                          id="surname"
                          placeholder="Soyadınız"
                          value={formData.surname}
                          onChange={(e) => handleInputChange("surname", e.target.value)}
                          required
                        />
                        {errors?.surname?.errors && (
                          <p className="text-red-500 text-sm mt-1">{errors.surname.errors[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          placeholder="05551234567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                        {errors?.phone?.errors && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.errors[0]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Eposta</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                        {errors?.email?.errors && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.errors[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mesaj</Label>
                      <Textarea
                        id="message"
                        placeholder="Mesajınızı buraya yazın..."
                        className="min-h-32"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                      {errors?.message?.errors && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.errors[0]}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Mesaj Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Office Info */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Ofis Konumumuz</CardTitle>
                  <p className="text-gray-600">
                    Ana ofisimiz Maltepe'de merkezi bir konumda bulunmaktadır.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                    {!isLoaded ? <div>Harita yüklenemedi.</div> : <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      zoom={15}
                      center={{ lat: 40.924026505546635, lng: 29.134704567395538 }}
                    >
                      <MarkerF position={{ lat: 40.924026505546635, lng: 29.134704567395538 }} />
                    </GoogleMap>}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg">Ana Ofis</h4>
                      <p className="text-gray-600">Bağlarbaşı Mah. Selahattin Bey Sok. No: 1/A<br />Maltepe/İstanbul</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm" onClick={handleGetDirections}>
                        Yol Tarifi Al
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Şube Ofislerimiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4>Kadıköy Şubesi</h4>
                      <p className="text-gray-600">Bağdat Cad. No: 456 Kadıköy/İstanbul</p>
                      <p className="text-sm text-gray-500">+90 (216) 555 0123</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4>Bakırköy Şubesi</h4>
                      <p className="text-gray-600">Atatürk Cad. No: 789 Bakırköy/İstanbul</p>
                      <p className="text-sm text-gray-500">+90 (212) 555 0456</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h4>Şişli Şubesi</h4>
                      <p className="text-gray-600">Mecidiyeköy Mah. No: 321 Şişli/İstanbul</p>
                      <p className="text-sm text-gray-500">+90 (212) 555 0789</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok merak edilen sorular ve cevapları
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3">Emlak danışmanını nasıl ararım?</h4>
                <p className="text-gray-600 text-sm">
                  Telefon, e-posta veya web sitemizden bizimle iletişime geçerek
                  size en uygun danışmanımızla görüşme ayarlayabilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3">Değerleme hizmeti ücretsiz mi?</h4>
                <p className="text-gray-600 text-sm">
                  Evet, müşterilerimize ücretsiz gayrimenkul değerleme hizmeti sunuyoruz.
                  Randevu almak için iletişime geçin.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3">Satış süreci nasıl ilerliyor?</h4>
                <p className="text-gray-600 text-sm">
                  Satış sürecinde uzman ekibimiz size yol gösterir. İlan hazırlığı, alıcı bulma, pazarlık ve tapu işlemlerinde yanınızdayız.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="mb-3">Kiralama süreci nasıl işliyor?</h4>
                <p className="text-gray-600 text-sm">
                  Kiralama sürecinde size rehberlik ediyoruz. Sözleşme hazırlama,
                  depozito işlemleri ve teslim sürecinde yanınızdayız.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}