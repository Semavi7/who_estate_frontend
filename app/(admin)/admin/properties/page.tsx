'use client'
import { useEffect, useState } from "react";
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
import api from "@/lib/axios";
import PropertyGetData from "@/dto/getproperty.dto";


export default function AdminProperties() {
  const [properties, setProperties] = useState<PropertyGetData[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties')
      setProperties(res.data)
    } catch (error) {
      toast.error("Veri alınırken bir hata oluştu.")
    }
  }

  useEffect(() => {
    fetchProperties()
  },[])

  const handleDeleteProperty = (id: string) => {
    if (confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      setProperties(properties.filter(p => p._id !== id));
      toast.success("İlan başarıyla silindi");
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
                {/* <p className="text-2xl">{properties.filter(p => p.status === 'aktif').length}</p> */}
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
                <p className="text-2xl">{properties.filter(p => p.propertyType === 'Konut').length}</p>
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
                  <TableRow key={property._id}>
                    <TableCell>
                      <div className="max-w-48">
                        <div className="text-sm truncate">{property.title}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${property.listingType === 'Satılık' ? 'bg-green-500' : 'bg-blue-500'
                            }`}></span>
                          {property.listingType === 'Satılık' ? 'Satılık' : 'Kiralık'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.propertyType}
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.subType}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatPrice(property.price, property.listingType)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.net} m²
                    </TableCell>
                    <TableCell className="text-sm">
                      {property.numberOfRoom}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {property.location.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.location.city}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(property.createdAt).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`editproperty/${property._id}`}>
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
                          onClick={() => handleDeleteProperty(property._id)}
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