'use client'
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { User, Mail, Phone, Lock, Camera, PictureInPicture } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, selectUser } from "@/lib/redux/authSlice";
import api from "@/lib/axios";

export default function AdminProfile() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      return;
    }

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
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={profileData.surname}
                    onChange={(e) => setProfileData({ ...profileData, surname: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={profileData.phonenumber}
                    onChange={(e) => setProfileData({ ...profileData, phonenumber: e.target.value })}
                    className="pl-10"
                  />
                </div>
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
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
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
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit">Şifreyi Değiştir</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}