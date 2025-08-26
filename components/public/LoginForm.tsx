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

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenForgotPassword: () => void
}

export default function LoginForm({ open, onOpenChange, onOpenForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Geçerli bir e-posta adresi girin");
      return;
    }

    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })

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
    } finally{
      setIsLoading(false)
    }
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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