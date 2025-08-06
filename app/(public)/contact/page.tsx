"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Lütfen gerekli alanları doldurun");
      return;
    }

    // Simulate form submission
    toast.success("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      details: [
        "+90 (212) 555 0123",
        "+90 (212) 555 0124"
      ],
      description: "7/24 Destek Hattı"
    },
    {
      icon: Mail,
      title: "E-posta",
      details: [
        "info@emlakpro.com",
        "destek@emlakpro.com"
      ],
      description: "24 saat içinde yanıt"
    },
    {
      icon: MapPin,
      title: "Adres",
      details: [
        "Levent Mah. Büyükdere Cad.",
        "No: 123 Beşiktaş/İstanbul"
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

  const departments = [
    { value: "satis", label: "Satış Departmanı" },
    { value: "kiralama", label: "Kiralama Departmanı" },
    { value: "degerleme", label: "Değerleme Departmanı" },
    { value: "musteri-hizmetleri", label: "Müşteri Hizmetleri" },
    { value: "teknik-destek", label: "Teknik Destek" },
    { value: "genel", label: "Genel Sorular" }
  ];

  return (
    <div className="pt-16 md:pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">İletişim</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Emlak ihtiyaçlarınız için bizimle iletişime geçin.
            Uzman ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
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
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input
                          id="name"
                          placeholder="Adınız ve soyadınız"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          placeholder="+90 (555) 123 4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Departman</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Departman seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mesaj *</Label>
                      <Textarea
                        id="message"
                        placeholder="Mesajınızı buraya yazın..."
                        className="min-h-32"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
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
                    Ana ofisimiz Levent'te merkezi bir konumda bulunmaktadır.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Harita burada görünecek</p>
                      <p className="text-sm">Google Maps entegrasyonu</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg">Ana Ofis</h4>
                      <p className="text-gray-600">Levent Mah. Büyükdere Cad. No: 123<br />Beşiktaş/İstanbul</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        Yol Tarifi Al
                      </Button>
                      <Button variant="outline" size="sm">
                        Randevu Al
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
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
                <h4 className="mb-3">Emlak danışmanı nasıl ararım?</h4>
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
                <h4 className="mb-3">Online ilan verebilir miyim?</h4>
                <p className="text-gray-600 text-sm">
                  Tabii ki! Web sitemizden kolayca ilan verebilir,
                  fotoğraf yükleyebilir ve ilanınızı yönetebilirsiniz.
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