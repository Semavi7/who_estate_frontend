'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Plus,
    Search,
    Edit,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";
import z from "zod";
import AlertDialogComp from "@/components/admin/AlertDialog";
import { Textarea } from "@/components/ui/textarea";

interface Clientintake {
    _id: string
    namesurname: string
    phone: number,
    description: string
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

export default function AdminFeaturesPage() {
    const [clientintake, setClientintake] = useState<Clientintake[]>([])
    const [clientintakeId, setClientintakeId] = useState("")
    const [errors, setErrors] = useState<FieldErrors<CatgoryFormData> | null>()
    const [searchTerm, setSearchTerm] = useState("")
    const [editingClientintake, setEditingClientintake] = useState<Clientintake | null>(null)
    const [showClientintakeDialog, setShowClientintakeDialog] = useState(false)
    const [showAlertDialog, setShowAlertDialog] = useState(false)

    // Form states
    const [clientintakeForm, setClientintakeForm] = useState({
        namesurname: "",
        phone: "",
        description: ""
    })

    // Filter clientintake and features based on search
    const filteredclientintake = clientintake.filter(category =>
        category.namesurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()
        )
    )

    const fetchclientintake = async () => {
        try {
            const res = await api.get('/client-intake')
            setClientintake(res.data)
        } catch (error) {
            toast.error("Veri alınırken bir hata oluştu.")
        }
    }

    useEffect(() => {
        fetchclientintake()
    }, [])

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

    // Category CRUD operations
    const handleAddCategory = () => {
        setEditingClientintake(null);
        setClientintakeForm({ namesurname: "", phone: "", description:"" });
        setShowClientintakeDialog(true);
    }

    const handleEditCategory = (category: Clientintake) => {
        setEditingClientintake(category);
        setClientintakeForm({
            namesurname: category.namesurname,
            phone: (category.phone).toString(),
            description: category.description
        })
        setShowClientintakeDialog(true);
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
                await api.put(`/client-intake/${editingClientintake._id}`, clientintakeForm)
                toast.success("Kayıt güncellendi");
            } else {
                // Add new category
                const newClientintake: createClientintake = {
                    namesurname: clientintakeForm.namesurname,
                    phone: Number(clientintakeForm.phone),
                    description: clientintakeForm.description
                }
                await api.post('/client-intake', newClientintake)
                toast.success("Kayıt eklendi");
            }

            setShowClientintakeDialog(false);
            setClientintakeForm({ namesurname: "", description: "", phone: "" });
            setEditingClientintake(null);
            fetchclientintake();
        } catch (error) {
            toast.error("İşlem sırasında bir hata oluştu.");
        }
    }

    const handleDeleteCategory = async (clientintakeId: string) => {
        try {
            await api.delete(`/client-intake/${clientintakeId}`)
            await fetchclientintake()
            toast.success("Kayıt silindi")
        } catch (error) {
            toast.error("Silme işlemi sırasında bir hata oluştu.")
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl flex items-center space-x-2">
                            <span>Müşteri Takip</span>
                        </h2>
                        <p className="text-gray-600">Müşterileri takip etmek için bu paneli kullanabilirsiniz.</p>
                    </div>
                    <Button onClick={handleAddCategory} className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Müşteri Ekle</span>
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Kategori veya özellik ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* clientintake and Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Müşteri Listesi ({filteredclientintake.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ad Soyad</TableHead>
                                        <TableHead>Telefon</TableHead>
                                        <TableHead>Açıklama</TableHead>
                                        <TableHead>işlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredclientintake.map((clientintake) => (
                                        <TableRow key={clientintake._id}>
                                            <TableCell>
                                                <div className="max-w-48">
                                                    <div className="text-sm truncate">{clientintake.namesurname}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {clientintake.phone}
                                            </TableCell>
                                            <TableCell>
                                                {clientintake.description}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditCategory(clientintake)}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowAlertDialog(true)
                                                            setClientintakeId(clientintake._id)
                                                        }}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredclientintake.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-2">Müşteri bulunamadı</div>
                                <p className="text-sm text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <AlertDialogComp
                    open={showAlertDialog}
                    onOpenChange={setShowAlertDialog}
                    onCancel={() => setShowAlertDialog(false)}
                    onOk={() => handleDeleteCategory(clientintakeId)}
                />

                {/* Category Dialog */}
                <Dialog open={showClientintakeDialog} onOpenChange={setShowClientintakeDialog}>
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
                                <Button variant="outline" onClick={() => setShowClientintakeDialog(false)}>
                                    İptal
                                </Button>
                                <Button onClick={handleSaveCategory}>
                                    {editingClientintake ? "Güncelle" : "Ekle"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}