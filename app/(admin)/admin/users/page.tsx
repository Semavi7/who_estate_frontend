'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  User,
  Mail,
  Shield,
  Calendar
} from "lucide-react";
import UserForm from "../../../../components/admin/UserForm";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "agent";
  status: "active" | "inactive" | "pending";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: "Admin",
      lastName: "Kullanıcı",
      email: "admin@emlakpro.com",
      role: "admin",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      createdAt: "2024-01-01",
      lastLogin: "2024-01-25",
      phone: "+90 (212) 555 0123"
    },
    {
      id: 2,
      firstName: "Ahmet",
      lastName: "Yılmaz",
      email: "ahmet@example.com",
      role: "agent",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-24",
      phone: "+90 (532) 123 4567"
    },
    {
      id: 3,
      firstName: "Fatma",
      lastName: "Demir",
      email: "fatma@example.com",
      role: "user",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-23"
    },
    {
      id: 4,
      firstName: "Mehmet",
      lastName: "Kaya",
      email: "mehmet@example.com",
      role: "user",
      status: "pending",
      createdAt: "2024-01-20"
    },
    {
      id: 5,
      firstName: "Ayşe",
      lastName: "Öztürk",
      email: "ayse@example.com",
      role: "agent",
      status: "inactive",
      createdAt: "2024-01-12",
      lastLogin: "2024-01-18"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userData }
          : u
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now(),
        ...userData,
        status: "active" as const,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setShowUserForm(false);
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-red-100 text-red-800">Admin</Badge>;
      case 'agent':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Emlak Danışmanı</Badge>;
      case 'user':
        return <Badge variant="outline">Kullanıcı</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Pasif</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Beklemede</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">Kullanıcı Yönetimi</h2>
          <p className="text-gray-600">Sistem kullanıcılarını yönetin ve düzenleyin</p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Yeni Kullanıcı</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
                <p className="text-2xl">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Aktif Kullanıcı</p>
                <p className="text-2xl">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Emlak Danışmanı</p>
                <p className="text-2xl">{users.filter(u => u.role === 'agent').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Beklemede</p>
                <p className="text-2xl">{users.filter(u => u.status === 'pending').length}</p>
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
                placeholder="Kullanıcı adı veya e-posta ile ara..."
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Üye Tarihi</TableHead>
                  <TableHead>Son Giriş</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.phone || "-"}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {user.id !== 1 && ( // Prevent deleting admin user
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">Kullanıcı bulunamadı</div>
              <p className="text-sm text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Mevcut kullanıcının bilgilerini düzenleyebilirsiniz.' 
                : 'Yeni bir kullanıcı oluşturmak için aşağıdaki formu doldurun.'
              }
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={() => setShowUserForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
