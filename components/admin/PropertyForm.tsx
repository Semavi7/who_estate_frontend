'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { X, Upload, Bold, Italic, List, Link } from "lucide-react";
import { toast } from "sonner";

interface PropertyFormProps {
  property?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    location: property?.location || "",
    price: property?.price || "",
    type: property?.type || "satilik",
    category: property?.category || "",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area: property?.area || 0,
    grossArea: property?.grossArea || 0,
    age: property?.age || 0,
    floor: property?.floor || "",
    description: property?.description || "",
    features: property?.features || [],
    images: property?.images || []
  });

  const [newFeature, setNewFeature] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [descriptionFormatting, setDescriptionFormatting] = useState({
    bold: false,
    italic: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((f:any) => f !== feature)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.price) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }

    onSave({
      ...formData,
      bedrooms: parseInt(formData.bedrooms.toString()),
      bathrooms: parseInt(formData.bathrooms.toString()),
      area: parseInt(formData.area.toString()),
      grossArea: parseInt(formData.grossArea.toString()),
      age: parseInt(formData.age.toString())
    });

    toast.success(property ? "İlan başarıyla güncellendi" : "İlan başarıyla oluşturuldu");
  };

  // Simple text editor functions
  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = selectedText;

    switch (format) {
      case 'bold':
        replacement = `**${selectedText}**`;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        break;
      case 'list':
        replacement = selectedText.split('\n').map(line => `• ${line}`).join('\n');
        break;
      case 'link':
        replacement = `[${selectedText || 'Link metni'}](URL_buraya)`;
        break;
    }

    const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    handleInputChange('description', newText);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">İlan Başlığı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Örn: Deniz manzaralı villa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Konum *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Örn: Beşiktaş, İstanbul"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Örn: ₺2,500,000 veya ₺8,500/ay"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">İlan Tipi</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satilik">Satılık</SelectItem>
                  <SelectItem value="kiralik">Kiralık</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Emlak Tipi</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daire">Daire</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Ofis">Ofis</SelectItem>
                  <SelectItem value="Dükkan">Dükkan</SelectItem>
                  <SelectItem value="Arsa">Arsa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Emlak Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Yatak Odası</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banyo</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Net m²</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossArea">Brüt m²</Label>
              <Input
                id="grossArea"
                type="number"
                value={formData.grossArea}
                onChange={(e) => handleInputChange('grossArea', e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Bina Yaşı</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">Bulunduğu Kat</Label>
            <Input
              id="floor"
              value={formData.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
              placeholder="Örn: 3/8, Zemin, Villa"
            />
          </div>
        </CardContent>
      </Card>

      {/* Description with Simple Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Açıklama</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simple Editor Toolbar */}
          <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-t-md bg-gray-50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('bold')}
              className="p-1"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('italic')}
              className="p-1"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('list')}
              className="p-1"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('link')}
              className="p-1"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Emlak açıklamasını buraya yazın. **kalın**, *italik*, • liste formatlarını kullanabilirsiniz."
            className="min-h-32 border-t-0 rounded-t-none"
          />
          <div className="text-sm text-gray-600">
            <strong>Formatlar:</strong> **kalın**, *italik*, • liste, [link metni](URL)
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Özellikler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Yeni özellik ekle"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            />
            <Button type="button" onClick={handleAddFeature}>
              Ekle
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature:any, index:any) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Fotoğraflar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-600 mb-2">Fotoğrafları sürükleyip bırakın veya seçin</div>
            <Button type="button" variant="outline">
              Dosya Seç
            </Button>
            <div className="text-sm text-gray-500 mt-2">
              PNG, JPG, GIF desteklenir (Maks. 10MB)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          {property ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  );
}