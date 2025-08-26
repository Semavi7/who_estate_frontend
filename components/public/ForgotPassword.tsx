"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { LogIn, Mail } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import api from "@/lib/axios";

interface ForgotPasswordProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ForgotPassword({ open, onOpenChange }: ForgotPasswordProps) {

    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await api.post('/auth/forgot-password', {email: email})
        setMsg(res.data.message)
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center flex items-center justify-center space-x-2">
                        <LogIn className="h-5 w-5 text-primary" />
                        <span>Şifremi Unuttum</span>
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        E-posta adresiniz ile şifre yenilemeyi başlatabilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 mt-4">
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
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            <LogIn className="h-4 w-4 mr-2" />
                            Gönder
                        </Button>
                    </form>
                    {msg && <p className="mt-3 text-green-700">{msg}</p>}
                
            </DialogContent>
        </Dialog>
    );
}