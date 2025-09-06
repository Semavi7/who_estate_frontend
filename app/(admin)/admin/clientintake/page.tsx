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
import axios from "axios";
import AddCustomer from "@/components/admin/AddCustomer";

export interface Clientintake {
    _id: string
    namesurname: string
    phone: number,
    description: string
    createdAt: Date
}





export default function AdminFeaturesPage() {
    const [clientintake, setClientintake] = useState<Clientintake[]>([])
    const [clientintakeId, setClientintakeId] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [editingClientintake, setEditingClientintake] = useState<Clientintake | null>(null)
    const [showClientintakeDialog, setShowClientintakeDialog] = useState(false)
    const [showAlertDialog, setShowAlertDialog] = useState(false)

    // Form states


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



    // Category CRUD operations
    const handleAddCategory = () => {
        setEditingClientintake(null);
        setShowClientintakeDialog(true);
    }

    const handleEditCategory = (category: Clientintake) => {
        setEditingClientintake(category);
        setShowClientintakeDialog(true);
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
            <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
            <div className="grid grid-cols-1 gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">Müşterileri takip etmek için bu paneli kullanabilirsiniz.</p>
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

                {/* customer Dialog */}
                <AddCustomer
                    open={showClientintakeDialog}
                    onOpenChange={setShowClientintakeDialog}
                    editingClientintake={editingClientintake}
                    setShowClientintakeDialog={() => setShowClientintakeDialog(false)}
                    setEditingClientintake={() => setEditingClientintake(null)}
                    fetchclientintake={() => fetchclientintake()}
                />
            </div>
        </div>
    )
}