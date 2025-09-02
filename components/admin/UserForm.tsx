'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/app/(admin)/admin/users/page";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import api from "@/lib/axios";
import z from "zod";

interface UserFormProps {
  user: IUser | null
  onCancel: () => void
  onSuccess: () => void
  onClose: () => void
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const userFormSchema = z.object({
  name: z.string().min(2, "Kullanıcı adı zorunludur."),
  surname: z.string().min(2, "Kullanıcı soyadı zorunludur."),
  email: z.email("Lütfen email formatı giriniz.").nonempty("Email alanı zorunludur."),
  phonenumber: z.string().min(1, "Telefon numarası zorunludur.")
})

type UserFormData = z.infer<typeof userFormSchema>

type FieldErrors<T> = {
  [K in keyof T]?: {
    errors: string[];
  }
}

export default function UserForm({ user, onCancel, onSuccess, onClose, open, onOpenChange }: UserFormProps) {
  const [errors, setErrors] = useState<FieldErrors<UserFormData> | null>()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value }

      const result = userFormSchema.safeParse(newState)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = userFormSchema.safeParse(formData)

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

    if (!user) {
      try {
        await api.post('/user', formData)
        onSuccess()
        onClose()
      } catch (error) {
        toast.error('Kullanıcı oluşturulurken bir hata oluştu.')
      }
    }
    else {
      try {
        await api.put(`/user/${user._id}`, formData)
        onSuccess()
        onClose()
      } catch (error) {
        toast.error('Kullanıcı güncellenirken bir hata oluştu.')
      }
    }
    toast.success(user ? "Kullanıcı başarıyla güncellendi" : "Kullanıcı başarıyla oluşturuldu")

  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'Mevcut kullanıcının bilgilerini düzenleyebilirsiniz.'
              : 'Yeni bir kullanıcı oluşturmak için aşağıdaki formu doldurun.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h4 className="text-base leading-none font-semibold">Temel Bilgiler</h4>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad </Label>
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
                {errors?.name?.errors && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.errors[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad </Label>
                <Input
                  id="lastName"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  required
                />
                {errors?.surname?.errors && (
                  <p className="text-red-500 text-sm mt-1">{errors.surname.errors[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta </Label>
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
              {errors?.email?.errors && (
                <p className="text-red-500 text-sm mt-1">{errors.email.errors[0]}</p>
              )}
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
              {errors?.phonenumber?.errors && (
                <p className="text-red-500 text-sm mt-1">{errors.phonenumber.errors[0]}</p>
              )}
            </div>
          </div>




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
      </DialogContent>
    </Dialog>

  );
}