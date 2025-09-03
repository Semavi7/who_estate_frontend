'use client'
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { User, Mail, Phone, Lock, Camera, PictureInPicture, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, selectUser } from "@/lib/redux/authSlice";
import api from "@/lib/axios";
import z from "zod";
import PropertyGetData from "@/dto/getproperty.dto";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/tr";

const profileFormSchema = z.object({
  name: z.string().min(2, "İsim alanı zorunludur."),
  surname: z.string().min(2, "Soyisim alanı zorunludur."),
  email: z.email("Email formatı zorunludur").nonempty("Email boş bırakılamaz"),
  phonenumber: z.string().min(1, "Telefon numarası zorunludur.")
})

type ProfileFormSchema = z.infer<typeof profileFormSchema>

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  confirmPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır.")
}).refine((data) => data.confirmPassword === data.newPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"]
})

type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>

type FieldErrors<T> = {
  [K in keyof T]?: {
    errors: string[];
  }
}

export default function AdminProfile() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<FieldErrors<ProfileFormSchema> | null>()
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors<PasswordChangeSchema> | null>()
  const [properties, setPropertis] = useState<PropertyGetData[]>([])
  const [profileData, setProfileData] = useState({
    name: user?.name,
    surname: user?.surname,
    email: user?.email,
    phonenumber: '0' + user?.phonenumber?.toString()
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const fecthProperties = async () => {
      try {
        const res = await api.get(`/properties/query?userId=${user?._id}`)
        setPropertis(res.data)
      } catch (error) {
        toast.error('İlanları çekerken bir hata oluştu')
      }
    }
    fecthProperties()
  }, [])

  const handleChangeInput = (field: string, value: any) => {
    setProfileData(prev => {
      const newState = { ...prev, [field]: value }

      const result = profileFormSchema.safeParse(newState)

      if (!result.success) {
        const errorTree = z.treeifyError(result.error)
        const fieldErrors = errorTree.properties

        setErrors(fieldErrors)
      } else {
        setErrors(null)
      }

      return newState
    })

    if (field === 'currentPassword' || field === 'newPassword' || field === 'confirmPassword') {
      setPasswordData(prev => {
        const newState = { ...prev, [field]: value }

        const result = passwordChangeSchema.safeParse(newState)

        if (!result.success) {
          const errorTree = z.treeifyError(result.error)
          const fieldErrors = errorTree.properties

          setPasswordErrors(fieldErrors)
        } else {
          setPasswordErrors(null)
        }

        return newState
      })
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = profileFormSchema.safeParse(profileData)

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
      const newUser = await api.put(`/user/${user?._id}`, profileData)
      toast.success("Profil bilgileri güncellendi")
      dispatch(loginSuccess({ user: newUser.data }))
      console.log(newUser)
    } catch {
      toast.error("Profil bilgileri güncellenirken bir hata oluştu")
    }


  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    const result = passwordChangeSchema.safeParse(profileData)

    if (!result.success) {
      const errorTree = z.treeifyError(result.error)
      const fieldErrors = errorTree.properties

      setPasswordErrors(fieldErrors) // Tüm hataları state'e kaydet
      toast.error("Lütfen zorunlu alanları doldurun ve hataları düzeltin.")
      console.error("Form validasyon hataları:", fieldErrors)
      return
    }

    // Validasyon başarılıysa, hataları temizle
    setErrors(null)

    const req = {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.confirmPassword
    }

    try {
      api.patch(`/user/${user?._id}/password`, req)
      toast.success("Şifre başarıyla değiştirildi")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch {
      toast.success("Şifre değiştirilirken bir hata meydana geldi")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    }


  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  const handleSelectImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("Lütfen bir fotoğraf seçin.")
      return
    }

    if (!user?._id) {
      toast.error("Kullanıcı bilgisi bulunamadı.");
      return
    }

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await api.patch(`/user/${user._id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success("Profil fotoğrafı başarıyla güncellendi.");
      dispatch(loginSuccess({ user: response.data }))
      setSelectedFile(null)
    } catch (error) {
      toast.error("Profil fotoğrafı güncellenirken bir hata oluştu.")
    }
  }

  dayjs.extend(relativeTime);
  dayjs.locale("tr")

  const propertyfour =  properties.slice(0, 4)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Kullanıcı Bilgileri</h2>
        <p className="text-gray-600">Profil bilgilerinizi ve şifrenizi yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Fotoğrafı</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="text-2xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                {user?.surname ? user.surname.charAt(0).toUpperCase() : ''}
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {selectedFile && (
              <p className="text-sm text-gray-500 mb-2">{selectedFile.name}</p>
            )}
            <Button variant="outline" className="flex items-center space-x-2 mx-auto mb-2 w-41" onClick={handleSelectImageClick}>
              <PictureInPicture className="h-4 w-4" />
              <span>Fotoğraf Seç</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 mx-auto" onClick={handleUploadImage}>
              <Camera className="h-4 w-4" />
              <span>Fotoğraf Değiştir</span>
            </Button>
          </CardContent>
        </Card>
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      value={profileData.name}
                      onChange={(e) => handleChangeInput('name', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors?.name?.errors && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.errors[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={profileData.surname}
                    onChange={(e) => handleChangeInput('surname', e.target.value)}
                  />
                </div>
                {errors?.surname?.errors && (
                  <p className="text-red-500 text-sm mt-1">{errors.surname.errors[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleChangeInput('email', e.target.value)}
                    className="pl-10"
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
                    value={profileData.phonenumber}
                    onChange={(e) => handleChangeInput('phonenumber', e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors?.phonenumber?.errors && (
                  <p className="text-red-500 text-sm mt-1">{errors.phonenumber.errors[0]}</p>
                )}
              </div>



              <Button type="submit" className="w-full">
                Bilgileri Güncelle
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>Şifre Değiştir</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handleChangeInput('currentPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {passwordErrors?.currentPassword?.errors && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.errors[0]}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handleChangeInput('newPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {passwordErrors?.newPassword?.errors && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.errors[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handleChangeInput('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {passwordErrors?.confirmPassword?.errors && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.errors[0]}</p>
                )}
              </div>

              <Button type="submit">Şifreyi Değiştir</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son Eklenen İlanlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyfour.map((property) => (
                <div key={property._id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="text-primary">{user?.name} {user?.surname}</span> yeni ilan ekledi
                      <span className="text-muted-foreground"> - {property.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{dayjs(property.createdAt).fromNow()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}