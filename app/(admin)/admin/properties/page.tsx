'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  MapPin,
  Bed,
  Bath,
  Square
} from "lucide-react";
import PropertyForm from "../../../../components/admin/PropertyForm";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: "satilik" | "kiralik";
  category: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "active" | "pending" | "sold";
  createdAt: string;
  views: number;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Deniz Manzaralı Lüks Villa",
      location: "Beşiktaş, İstanbul",
      price: "₺12,500,000",
      type: "satilik",
      category: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      status: "active",
      createdAt: "2024-01-15",
      views: 1245
    },
    {
      id: 2,
      title: "Merkezi Konumda Modern Daire",
      location: "Şişli, İstanbul",
      price: "₺8,500/ay",
      type: "kiralik",
      category: "Daire",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      status: "active",
      createdAt: "2024-01-20",
      views: 892
    },
    {
      id: 3,
      title: "İş Merkezi Büro",
      location: "Levent, İstanbul",
      price: "₺45,000/ay",
      type: "kiralik",
      category: "Ofis",
      bedrooms: 0,
      bathrooms: 2,
      area: 180,
      status: "pending",
      createdAt: "2024-01-25",
      views: 345
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowPropertyForm(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = (id: number) => {
    if (confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleSaveProperty = (propertyData: any) => {
    if (editingProperty) {
      // Update existing property
      setProperties(properties.map(p => 
        p.id === editingProperty.id 
          ? { ...p, ...propertyData }
          : p
      ));
    } else {
      // Add new property
      const newProperty: Property = {
        id: Date.now(),
        ...propertyData,
        status: "active" as const,
        createdAt: new Date().toISOString().split('T')[0],
        views: 0
      };
      setProperties([...properties, newProperty]);
    }
    setShowPropertyForm(false);
  };

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Beklemede</Badge>;
      case 'sold':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Satıldı</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">İlanlar</h2>
          <p className="text-gray-600">Tüm ilanları yönetin ve düzenleyin</p>
        </div>
        <Button onClick={handleAddProperty} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Yeni İlan</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="İlan başlığı veya konum ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtreler</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>İlan Listesi ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İlan</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Detaylar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Görüntülenme</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div>
                        <div className="line-clamp-1 text-sm">{property.title}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {property.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {property.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-primary">{property.price}</TableCell>
                    <TableCell>
                      <Badge variant={property.type === 'satilik' ? 'default' : 'secondary'}>
                        {property.type === 'satilik' ? 'Satılık' : 'Kiralık'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            {property.bedrooms}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Bath className="h-3 w-3 mr-1" />
                          {property.bathrooms}
                        </div>
                        <div className="flex items-center">
                          <Square className="h-3 w-3 mr-1" />
                          {property.area}m²
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(property.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Eye className="h-3 w-3 mr-1 text-gray-400" />
                        {property.views}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(property.createdAt).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
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

          {filteredProperties.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">İlan bulunamadı</div>
              <p className="text-sm text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Form Dialog */}
      <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'İlan Düzenle' : 'Yeni İlan Oluştur'}
            </DialogTitle>
            <DialogDescription>
              {editingProperty 
                ? 'Mevcut ilanın bilgilerini düzenleyebilirsiniz.' 
                : 'Yeni bir emlak ilanı oluşturmak için aşağıdaki formu doldurun.'
              }
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            property={editingProperty}
            onSave={handleSaveProperty}
            onCancel={() => setShowPropertyForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}