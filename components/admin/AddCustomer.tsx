import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import z from 'zod';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Clientintake } from '@/app/(admin)/admin/clientintake/page';
import axios from 'axios';

interface AddCostumer {
    open: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
    setShowClientintakeDialog: () => void
    setEditingClientintake?: () => void
    editingClientintake?: Clientintake | null
    fetchclientintake?: () => void
}

interface createClientintake {
    namesurname: string
    phone: number,
    description: string
}

const clientintakeFormSchema = z.object({
    namesurname: z.string().nonempty('As soyad zorunludur.'),
    phone: z.string().min(1, 'Telefon alanı zorunludur.'),
    description: z.string().nonempty('Açıklama zorunludur.')
})

type CatgoryFormData = z.infer<typeof clientintakeFormSchema>

type FieldErrors<T> = {
    [K in keyof T]?: {
        errors: string[];
    }
}

const AddCustomer = ({ open, onOpenChange, editingClientintake, setShowClientintakeDialog, setEditingClientintake, fetchclientintake }: AddCostumer) => {
    const [errors, setErrors] = useState<FieldErrors<CatgoryFormData> | null>()
    const [clientintakeForm, setClientintakeForm] = useState({
        namesurname: "",
        phone: "",
        description: ""
    })



    useEffect(() => {
        if (editingClientintake) {
            setClientintakeForm({
                namesurname: editingClientintake.namesurname,
                phone: (editingClientintake.phone).toString(),
                description: editingClientintake.description
            })
        }
        else {
            setClientintakeForm({ namesurname: "", phone: "", description: "" })
        }
    }, [editingClientintake])


    const sendNotification = async () => {

        try {
            const response = await axios.post("/api/send-notification", { title: "Yeni Müşteri Eklendi", message: `${clientintakeForm.namesurname} isimli müşteri eklendi.` });
            console.log('Bildirim başarıyla gönderildi:', response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Bildirim gönderme hatası:', error.response?.data || error.message);
            } else {
                console.error('Beklenmedik bir hata oluştu:', error);
            }
        }
    }

    const handleChangeInput = (field: string, value: any) => {
        setClientintakeForm(prev => {
            const newState = { ...prev, [field]: value }

            const result = clientintakeFormSchema.safeParse(newState)

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

    const handleSaveCategory = async () => {
        const result = clientintakeFormSchema.safeParse(clientintakeForm)

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
            if (editingClientintake) {
                // Update existing category
                await api.patch(`/client-intake/${editingClientintake._id}`, clientintakeForm)
                toast.success("Kayıt güncellendi");
            } else {
                // Add new category
                const newClientintake: createClientintake = {
                    namesurname: clientintakeForm.namesurname,
                    phone: Number(clientintakeForm.phone),
                    description: clientintakeForm.description
                }
                await api.post('/client-intake', newClientintake)
                toast.success("Kayıt eklendi")
                sendNotification()
            }

            setShowClientintakeDialog();
            setClientintakeForm({ namesurname: "", description: "", phone: "" });
            if (setEditingClientintake) {
                setEditingClientintake();
            }
            if (fetchclientintake) {
                fetchclientintake();
            }
        } catch (error) {
            toast.error("İşlem sırasında bir hata oluştu.");
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingClientintake ? "Müşteri Düzenle" : "Müşteri Ekle"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nameSurname">Ad Soyad</Label>
                            <Input
                                id="nameSurname"
                                value={clientintakeForm.namesurname}
                                onChange={(e) => handleChangeInput('namesurname', e.target.value)}
                                placeholder="Örn: Zeki Gürses"
                            />
                            {errors?.namesurname?.errors && (
                                <p className="text-red-500 text-sm mt-1">{errors.namesurname.errors[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                value={clientintakeForm.phone}
                                onChange={(e) => handleChangeInput('phone', e.target.value)}
                                placeholder="05364444444"
                                type="number"
                            />
                            {errors?.phone?.errors && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.errors[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                value={clientintakeForm.description}
                                onChange={(e) => handleChangeInput('description', e.target.value)}
                                placeholder="Müteri talepleri"
                                className="w-full"
                            />
                            {errors?.description?.errors && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.errors[0]}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={setShowClientintakeDialog}>
                                İptal
                            </Button>
                            <Button onClick={handleSaveCategory}>
                                {editingClientintake ? "Güncelle" : "Ekle"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddCustomer