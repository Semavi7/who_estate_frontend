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
  Trash2,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";

interface Category {
  _id: string
  category: string
  value: string
}

interface createCategory {
  category: string
  value: string
}

export default function AdminFeaturesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    category: "",
    value: ""
  })

  // Filter categories and features based on search
  const filteredCategories = categories.filter(category =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.value.toLowerCase().includes(searchTerm.toLowerCase()
    )
  )

  const fetchCategories = async () => {
    try {
      const res = await api.get('/feature-options/findall')
      setCategories(res.data)
    } catch (error) {
      toast.error("Veri alınırken bir hata oluştu.")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Category CRUD operations
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ category: "", value: "" });
    setShowCategoryDialog(true);
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      category: category.category,
      value: category.value
    })
    setShowCategoryDialog(true);
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.category.trim() || !categoryForm.value.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await api.put(`/feature-options/${editingCategory._id}`, categoryForm)
        toast.success("Kategori güncellendi");
      } else {
        // Add new category
        const newCategory: createCategory = {
          category: categoryForm.category,
          value: categoryForm.value
        }
        await api.post('/feature-options', newCategory)
        toast.success("Kategori eklendi");
      }

      setShowCategoryDialog(false);
      setCategoryForm({ category: "", value: "" });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu.");
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await api.delete(`/feature-options/${categoryId}`)
      toast.success("Kategori silindi");
      fetchCategories();
    } catch (error) {
      toast.error("Silme işlemi sırasında bir hata oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>Özellik Yönetimi</span>
          </h2>
          <p className="text-gray-600">İlan özellik kategorilerini ve özelliklerini yönetin</p>
        </div>
        <Button onClick={handleAddCategory} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Kategori Ekle</span>
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

      {/* Categories and Features */}
      <Card>
        <CardHeader>
          <CardTitle>İlan Listesi ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori Adı</TableHead>
                  <TableHead>Özellik Adı</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="max-w-48">
                        <div className="text-sm truncate">{category.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.value}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">İlan bulunamadı</div>
              <p className="text-sm text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Kategori Düzenle" : "Kategori Ekle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryDisplayName">Kategori Adı</Label>
              <Input
                id="categoryDisplayName"
                value={categoryForm.category}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Örn: Cephe Özellikleri"
              />
              <p className="text-xs text-gray-500">
                Kullanıcılara gösterilecek ad.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDisplayName">Kategori Adı</Label>
              <Input
                id="categoryDisplayName"
                value={categoryForm.value}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Örn: Mantolama"
              />
              <p className="text-xs text-gray-500">
                Kullanıcılara gösterilecek ad.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                İptal
              </Button>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? "Güncelle" : "Ekle"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}