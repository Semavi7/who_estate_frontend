import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { loginSuccess } from "@/lib/redux/authSlice";
import z from "zod";

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenForgotPassword: () => void
}

const loginFormSchema = z.object({
  email: z.email('Doğru formatta mail adresi giriniz.').nonempty('Email zorunludur.'),
  password: z.string().nonempty('Şifre zorunludur.')
})

type LoginFormData = z.infer<typeof loginFormSchema>

type FieldErrors<T> = {
  [K in keyof T]?: {
    errors: string[];
  }
}

export default function LoginForm({ open, onOpenChange, onOpenForgotPassword }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors<LoginFormData> | null>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginFormSchema.safeParse(formData)

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


    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', formData)

      const userData = response.data

      const user = {
        _id: userData._id,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phonenumber: userData.phonenumber,
        role: userData.role,
        image: userData.image
      }

      dispatch(loginSuccess({ user }))

      router.push('/admin/dashboard')
    } catch (error) {
      toast.error('Giriş Yapılamadı. Lütfen Bilgileriniizi Kontrol Ediniz.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeInput = (field: string, value: any) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value }

      const result = loginFormSchema.safeParse(newState)

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <LogIn className="h-5 w-5 text-primary" />
            <span>Giriş Yap</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            E-posta adresiniz ve şifrenizle giriş yapabilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => handleChangeInput('email', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {errors?.email?.errors && (
              <p className="text-red-500 text-sm mt-1">{errors.email.errors[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrenizi girin"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => handleChangeInput('password', e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors?.password?.errors && (
              <p className="text-red-500 text-sm mt-1">{errors.password.errors[0]}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-600">Beni hatırla</span>
            </label>
            <button
              type="button"
              className="text-primary hover:underline"
              disabled={isLoading}
              onClick={onOpenForgotPassword}
            >
              Şifremi unuttum
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Giriş yapılıyor...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Giriş Yap
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}