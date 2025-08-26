"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { Lock, LogIn } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const token = sp.get("token") || "";
    const [pwd, setPwd] = useState("");
    const [msg, setMsg] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await api.post('/auth/reset-password', { token: token, newPassword: pwd })
        if (res.status === 201) {
            setMsg(res.data.message);
            setTimeout(() => router.push("/"), 1500);
        } else {
            setMsg(res.data.message || "Bir hata oluştu");
        }
    };

    return (
        <div className="flex relative h-screen flex-wrap justify-center items-center bg-[url('/hero-background.jpg')] bg-cover bg-center bg-no-repeat">
            <div className={'absolute inset-0 bg-black/40 animate-hero-overlay-initial'}/>
            <div className="relative w-1/5 rounded-2xl shadow-xl/30 p-4 bg-background">
                <form onSubmit={submit} className="space-y-8">
                    <Label htmlFor="email">Yeni Şifre</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Şifrenizi girin"
                            className="pl-10"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer">
                        <LogIn className="h-4 w-4 mr-2" />
                        Güncelle
                    </Button>
                </form>
            </div>
            {msg && <p className="mt-3">{msg}</p>}
        </div>
    );
}