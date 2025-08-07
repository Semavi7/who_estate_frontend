'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Building2,
  MapPin,
  Calendar,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Property {
  id: number;
  title: string;
  type: "konut" | "isyeri" | "arsa";
  listingType: "satilik" | "kiralik";
  category: string;
  price: number;
  area: number;
  rooms: string;
  location: string;
  status: "aktif" | "pasif" | "beklemede";
  createdAt: string;
  images: string[];
}

interface AdminPropertiesProps {
  onNavigate?: (page: string, propertyId?: number) => void;
}

export default function AdminProperties({ onNavigate }: AdminPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Deniz Manzaralı Lüks Villa",
      type: "konut",
      listingType: "satilik",
      category: "Villa",
      price: 2500000,
      area: 350,
      rooms: "4+2",
      location: "Beşiktaş, İstanbul",
      status: "aktif",
      createdAt: "2024-01-20",
      images: ["image1.jpg", "image2.jpg"]
    },
    {
      id: 2,
      title: "Merkezi Konumda Ofis",
      type: "isyeri",
      listingType: "kiralik",
      category: "Ofis",
      price: 45000,
      area: 180,
      rooms: "Açık ofis",
      location: "Şişli, İstanbul",
      status: "aktif",
      createdAt: "2024-01-18",
      images: ["image3.jpg"]
    },
    {
      id: 3,
      title: "Modern Daire",
      type: "konut",
      listingType: "satilik",
      category: "Daire",
      price: 850000,
      area: 120,
      rooms: "3+1",
      location: "Kadıköy, İstanbul",
      status: "beklemede",
      createdAt: "2024-01-15",
      images: ["image4.jpg", "image5.jpg", "image6.jpg"]
    },
    {
      id: 4,
      title: "Yatırım Amaçlı Arsa",
      type: "arsa",
      listingType: "satilik",
      category: "İmarlı Arsa",
      price: 1200000,
      area: 800,
      rooms: "-",
      location: "Sarıyer, İstanbul",
      status: "aktif",
      createdAt: "2024-01-10",
      images: ["image7.jpg"]
    },
    {
      id: 5,
      title: "Rezidans Daire",
      type: "konut",
      listingType: "kiralik",
      category: "Rezidans",
      price: 25000,
      area: 140,
      rooms: "2+1",
      location: "Etiler, İstanbul",
      status: "pasif",
      createdAt: "2024-01-05",
      images: ["image8.jpg", "image9.jpg"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    if (onNavigate) {
      onNavigate("admin-add-property");
    }
  };

  const handleEditProperty = (propertyId: number) => {
    if (onNavigate) {
      onNavigate("admin-edit-property", propertyId);
    }
  };

  const handleDeleteProperty = (id: number) => {
    if (confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      setProperties(properties.filter(p => p.id !== id));
      toast.success("İlan başarıyla silindi");
    }
  };

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'aktif':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'pasif':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Pasif</Badge>;
      case 'beklemede':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Beklemede</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getTypeBadge = (type: Property['type']) => {
    switch (type) {
      case 'konut':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Konut</Badge>;
      case 'isyeri':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">İşyeri</Badge>;
      case 'arsa':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Arsa</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const formatPrice = (price: number, listingType: string) => {
    return `${price.toLocaleString('tr-TR')} TL${listingType === 'kiralik' ? '/ay' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">İlan Yönetimi</h2>
          <p className="text-gray-600">Emlak ilanlarınızı yönetin ve düzenleyin</p>
        </div>
        <Link href={'addproperty'}>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Yeni İlan</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Toplam İlan</p>
                <p className="text-2xl">{properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Aktif İlan</p>
                <p className="text-2xl">{properties.filter(p => p.status === 'aktif').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Konut İlanı</p>
                <p className="text-2xl">{properties.filter(p => p.type === 'konut').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Bu Ay Eklenen</p>
                <p className="text-2xl">
                  {properties.filter(p => {
                    const propertyDate = new Date(p.createdAt);
                    const currentDate = new Date();
                    return propertyDate.getMonth() === currentDate.getMonth();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <TableHead>İlan Başlığı</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Alan (m²)</TableHead>
                  <TableHead>Oda</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="max-w-48">
                        <div className="text-sm truncate">{property.title}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            property.listingType === 'satilik' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></span>
                          {property.listingType === 'satilik' ? 'Satılık' : 'Kiralık'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(property.type)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.category}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatPrice(property.price, property.listingType)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.area} m²
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.rooms}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {property.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(property.status)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(property.createdAt).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`editproperty/${property.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                          <Edit className="h-3 w-3" />
                        </Button>
                        </Link>
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
    </div>
  );
}