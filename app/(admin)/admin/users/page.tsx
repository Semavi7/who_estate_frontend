'use client'
import { useEffect, useState } from "react";
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
import api from "@/lib/axios";
import { toast } from "sonner";

export interface IUser {
  _id: string
  name: string
  surname: string
  email: string
  roles: "admin" | "member"
  image?: string
  phonenumber?: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const getUser = async () => {
      try {
        const res = await api.get('/user')
        setUsers(res.data)
      } catch (error) {
        
      }
    }

  useEffect(() => {
    getUser()
  },[])

  const filteredUsers = users.filter(user =>
    `${user.name} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    toast('Kullanıcıyı Silmek İstediğinizden Eminmisiniz?', {
      action: {
        label: 'Sil',
        onClick: async () => {
          try {
            await api.delete(`/user/${id}`)
            setUsers(users.filter(u => u._id !== id))
            toast.success("Kullanıcı başarıyla silindi")
          } catch {
            toast.error("Kullanıcı silinirken bir hata oluştu.")
          }
        }
      },
      cancel: {
        label: 'iptal',
        onClick: () => toast.info("Kullanıcı silme işlemi iptal edildi.")
      }
    })
  };


  const getRoleBadge = (role: IUser['roles']) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-red-100 text-red-800">Admin</Badge>;
      case 'member':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Emlak Danışmanı</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

 

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
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
                  <p className="text-2xl">{users.filter(u => u.roles === 'member').length}</p>
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
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{getInitials(user.name, user.surname)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">{user.name} {user.surname}</div>
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
                        {user.phonenumber || "-"}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.roles)}
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
                          {user.roles !== 'admin' && ( // Prevent deleting admin user
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
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
              onCancel={() => setShowUserForm(false)}
              onClose={() => setShowUserForm(false)}
              onSuccess={getUser}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
