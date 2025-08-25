'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Mail, Phone, Shield, Camera } from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/app/(admin)/admin/users/page";
import api from "@/lib/axios";

interface UserFormProps {
  user: IUser | null;
  onCancel: () => void
  onSuccess: () => void
  onClose: () => void
}

export default function UserForm({ user, onCancel, onSuccess, onClose }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.email) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Geçerli bir e-posta adresi girin");
      return;
    }

    if (!user) {
      try {
        api.post('/user', formData)
        onSuccess()
        onClose()
      } catch (error) {
        toast.error('Kullanıcı oluşturulurken bir hata oluştu.')
      }
    }
    else{
      try {
        api.put(`/user/${user._id}`,formData)
        onSuccess()
        onClose()
      } catch (error) {
        toast.error('Kullanıcı güncellenirken bir hata oluştu.')
      }
    }
    toast.success(user ? "Kullanıcı başarıyla güncellendi" : "Kullanıcı başarıyla oluşturuldu")
    
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad *</Label>
              <Input
                id="lastName"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phonenumber}
                onChange={(e) => handleInputChange('phonenumber', e.target.value)}
                className="pl-10"
                placeholder="(5XX) XXX XX XX"
              />
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          {user ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  );
}