'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag, 
  List,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface Feature {
  id: number;
  name: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  displayName: string;
  features: Feature[];
}

export default function AdminFeaturesPage() {
  // Mock data - gerçek uygulamada API'den gelecek
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "cephe",
      displayName: "Cephe Özellikleri",
      features: [
        { id: 1, name: "Kuzey Cephe", categoryId: 1 },
        { id: 2, name: "Güney Cephe", categoryId: 1 },
        { id: 3, name: "Doğu Cephe", categoryId: 1 },
        { id: 4, name: "Batı Cephe", categoryId: 1 },
        { id: 5, name: "Köşe Başı", categoryId: 1 },
        { id: 6, name: "Cadde Üzeri", categoryId: 1 },
        { id: 7, name: "Sokak Arası", categoryId: 1 }
      ]
    },
    {
      id: 2,
      name: "icOzellikler",
      displayName: "İç Özellikler",
      features: [
        { id: 8, name: "Ankastre Mutfak", categoryId: 2 },
        { id: 9, name: "Beyaz Eşya", categoryId: 2 },
        { id: 10, name: "Klima", categoryId: 2 },
        { id: 11, name: "Şömine", categoryId: 2 },
        { id: 12, name: "Jacuzzi", categoryId: 2 },
        { id: 13, name: "Sauna", categoryId: 2 },
        { id: 14, name: "Giyinme Odası", categoryId: 2 },
        { id: 15, name: "Çamaşırlık", categoryId: 2 },
        { id: 16, name: "Kiler", categoryId: 2 },
        { id: 17, name: "Balkon", categoryId: 2 },
        { id: 18, name: "Teras", categoryId: 2 },
        { id: 19, name: "Bahçe", categoryId: 2 }
      ]
    },
    {
      id: 3,
      name: "disOzellikler",
      displayName: "Dış Özellikler",
      features: [
        { id: 20, name: "Havuz", categoryId: 3 },
        { id: 21, name: "Barbekü", categoryId: 3 },
        { id: 22, name: "Garaj", categoryId: 3 },
        { id: 23, name: "Bahçe", categoryId: 3 },
        { id: 24, name: "Güvenlik", categoryId: 3 },
        { id: 25, name: "Kapıcı", categoryId: 3 },
        { id: 26, name: "Spor Salonu", categoryId: 3 },
        { id: 27, name: "Çocuk Parkı", categoryId: 3 },
        { id: 28, name: "Sosyal Tesis", categoryId: 3 },
        { id: 29, name: "İdari Ofis", categoryId: 3 },
        { id: 30, name: "Güvenlik Kamerası", categoryId: 3 },
        { id: 31, name: "Alarm Sistemi", categoryId: 3 }
      ]
    },
    {
      id: 4,
      name: "ulasim",
      displayName: "Ulaşım",
      features: [
        { id: 32, name: "Otobüs Durağı", categoryId: 4 },
        { id: 33, name: "Metro", categoryId: 4 },
        { id: 34, name: "Tramvay", categoryId: 4 },
        { id: 35, name: "Vapur İskelesi", categoryId: 4 },
        { id: 36, name: "Havaalanı", categoryId: 4 },
        { id: 37, name: "E-5 Yakını", categoryId: 4 },
        { id: 38, name: "TEM Yakını", categoryId: 4 },
        { id: 39, name: "Ana Yol Üzeri", categoryId: 4 },
        { id: 40, name: "Sahil Yolu", categoryId: 4 },
        { id: 41, name: "Köprü Bağlantısı", categoryId: 4 }
      ]
    },
    {
      id: 5,
      name: "manzara",
      displayName: "Manzara",
      features: [
        { id: 42, name: "Deniz Manzarası", categoryId: 5 },
        { id: 43, name: "Boğaz Manzarası", categoryId: 5 },
        { id: 44, name: "Orman Manzarası", categoryId: 5 },
        { id: 45, name: "Şehir Manzarası", categoryId: 5 },
        { id: 46, name: "Dağ Manzarası", categoryId: 5 },
        { id: 47, name: "Park Manzarası", categoryId: 5 },
        { id: 48, name: "Havuz Manzarası", categoryId: 5 },
        { id: 49, name: "Bahçe Manzarası", categoryId: 5 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    displayName: ""
  });
  const [featureForm, setFeatureForm] = useState({
    name: "",
    categoryId: 0
  });

  // Filter categories and features based on search
  const filteredCategories = categories.filter(category => 
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.features.some(feature => 
      feature.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Category CRUD operations
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", displayName: "" });
    setShowCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      displayName: category.displayName
    });
    setShowCategoryDialog(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim() || !categoryForm.displayName.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: categoryForm.name.trim(), displayName: categoryForm.displayName.trim() }
          : cat
      ));
      toast.success("Kategori güncellendi");
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: categoryForm.name.trim(),
        displayName: categoryForm.displayName.trim(),
        features: []
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success("Kategori eklendi");
    }

    setShowCategoryDialog(false);
    setCategoryForm({ name: "", displayName: "" });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.features.length > 0) {
      toast.error("Bu kategoride özellikler var. Önce özellikleri silin.");
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success("Kategori silindi");
  };

  // Feature CRUD operations
  const handleAddFeature = (categoryId: number) => {
    setEditingFeature(null);
    setSelectedCategoryId(categoryId);
    setFeatureForm({ name: "", categoryId });
    setShowFeatureDialog(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setSelectedCategoryId(feature.categoryId);
    setFeatureForm({
      name: feature.name,
      categoryId: feature.categoryId
    });
    setShowFeatureDialog(true);
  };

  const handleSaveFeature = () => {
    if (!featureForm.name.trim()) {
      toast.error("Özellik adını girin");
      return;
    }

    if (editingFeature) {
      // Update existing feature
      setCategories(prev => prev.map(cat => ({
        ...cat,
        features: cat.features.map(feature => 
          feature.id === editingFeature.id 
            ? { ...feature, name: featureForm.name.trim() }
            : feature
        )
      })));
      toast.success("Özellik güncellendi");
    } else {
      // Add new feature
      const newFeature: Feature = {
        id: Math.max(...categories.flatMap(c => c.features.map(f => f.id)), 0) + 1,
        name: featureForm.name.trim(),
        categoryId: featureForm.categoryId
      };

      setCategories(prev => prev.map(cat => 
        cat.id === featureForm.categoryId 
          ? { ...cat, features: [...cat.features, newFeature] }
          : cat
      ));
      toast.success("Özellik eklendi");
    }

    setShowFeatureDialog(false);
    setFeatureForm({ name: "", categoryId: 0 });
    setEditingFeature(null);
    setSelectedCategoryId(null);
  };

  const handleDeleteFeature = (featureId: number) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      features: cat.features.filter(feature => feature.id !== featureId)
    })));
    toast.success("Özellik silindi");
  };

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
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Kategoriler ve Özellikler</span>
            <Badge variant="secondary">
              {filteredCategories.length} kategori
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Arama kriterinize uygun kategori bulunamadı</p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {filteredCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <AccordionTrigger className="hover:no-underline flex-1 text-left">
                      <div className="flex items-center space-x-3">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-base">{category.displayName}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                        <Badge variant="secondary">
                          {category.features.length} özellik
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{category.displayName}" kategorisini silmek istediğinizden emin misiniz?
                              Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {/* Add Feature Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFeature(category.id)}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Özellik Ekle</span>
                        </Button>
                      </div>

                      {/* Features Grid */}
                      {category.features.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <List className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Bu kategoride henüz özellik yok</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.features
                            .filter(feature => 
                              searchTerm === "" || 
                              feature.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((feature) => (
                              <div
                                key={feature.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <span className="text-sm">{feature.name}</span>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditFeature(feature)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Özelliği Sil</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          "{feature.name}" özelliğini silmek istediğinizden emin misiniz?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>İptal</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteFeature(feature.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Sil
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
              <Label htmlFor="categoryName">Kategori Kodu</Label>
              <Input
                id="categoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Örn: cephe, icOzellikler"
              />
              <p className="text-xs text-gray-500">
                Sistem içinde kullanılacak kod. Küçük harf ve Türkçe karakter kullanmayın.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDisplayName">Görünen Ad</Label>
              <Input
                id="categoryDisplayName"
                value={categoryForm.displayName}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Örn: Cephe Özellikleri"
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

      {/* Feature Dialog */}
      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? "Özellik Düzenle" : "Özellik Ekle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featureName">Özellik Adı</Label>
              <Input
                id="featureName"
                value={featureForm.name}
                onChange={(e) => setFeatureForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Örn: Deniz Manzarası"
              />
            </div>
            {selectedCategoryId && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Kategori:</strong> {categories.find(c => c.id === selectedCategoryId)?.displayName}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>
                İptal
              </Button>
              <Button onClick={handleSaveFeature}>
                {editingFeature ? "Güncelle" : "Ekle"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}