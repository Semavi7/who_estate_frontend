'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  User,
  Calendar,
  Mails,
  MailCheck,
  MailMinus
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import AlertDialogComp from "@/components/admin/AlertDialog";

interface Message {
  _id: string
  name: string
  email: string
  phone: number
  surname: string
  message: string
  isread: boolean
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [messageId, setMessageId] = useState("")

  const fetchData = async () => {
    try {
      const res = await api.get('/messages')
      setMessages(res.data)
    } catch (error) {
      toast.error("Mesajlar çekilirken bir hata oluştu.")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(message.createdAt).toLocaleDateString('tr-TR').includes(searchTerm.toLowerCase())
  );

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message)
    setShowMessageDetail(true)
  }

  const handleReply = async (id: string) => {
    try {
      await api.patch(`/messages/${id}`)
      toast.success('Okundu bilgisi güncellendi')
      fetchData()
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu.')
    }
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      await api.delete(`/messages/${id}`)
      await fetchData()
      toast.success("Mesaj silindi")
    } catch (error) {
      toast.error("Silme işlemi sırasında bir hata oluştu.")
    }
  }

  const getStatusBadge = (status: Message['isread']) => {
    switch (status) {
      case false:
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Okunmamış</Badge>
      case true:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Okundu</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const unreadCount = messages.filter(m => m.isread === false).length;
  const repliedCount = messages.filter(m => m.isread === true).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl">Mesajlar</h2>
            <p className="text-gray-600">İletişim formundan gelen mesajları yönetin</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Mails className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Toplam Mesaj</p>
                  <p className="text-2xl">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MailMinus className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Okunmamış</p>
                  <p className="text-2xl">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MailCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Okunmuş</p>
                  <p className="text-2xl">{repliedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Bu Hafta</p>
                  <p className="text-2xl">
                    {messages.filter(m => {
                      const messageDate = new Date(m.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return messageDate >= weekAgo;
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
                  placeholder="İsim, e-posta veya konu ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mesaj Listesi ({filteredMessages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gönderen</TableHead>
                    <TableHead>Mesaj Önizleme</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message._id} className={message.isread === false ? 'bg-blue-50/50' : ''}>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm">{message.name} {message.surname}</div>
                              <div className="text-xs text-gray-500">{message.email}</div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-64">
                        <div className="truncate">{message.message}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(message.isread)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowAlertDialog(true)
                              setMessageId(message._id)
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

            {filteredMessages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">Mesaj bulunamadı</div>
                <p className="text-sm text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail Dialog */}
        <Dialog open={showMessageDetail} onOpenChange={setShowMessageDetail}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Mesaj Detayı</DialogTitle>
              <DialogDescription>
                {selectedMessage ? `${selectedMessage.name} tarafından gönderilen mesajı görüntülüyorsunuz.` : "Mesaj detayları"}
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Gönderen:</strong> {selectedMessage.name}
                  </div>
                  <div>
                    <strong>Durum:</strong> {getStatusBadge(selectedMessage.isread)}
                  </div>
                  <div>
                    <strong>E-posta:</strong> {selectedMessage.email}
                  </div>
                  <div>
                    <strong>Tarih:</strong> {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
                  </div>
                  {selectedMessage.phone && (
                    <div className="col-span-2">
                      <strong>Telefon:</strong> 0{selectedMessage.phone}
                    </div>
                  )}
                </div>

                <div>
                  <strong>Mesaj:</strong>
                  <div className="mt-1 p-4 bg-gray-50 rounded whitespace-pre-wrap">{selectedMessage.message}</div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowMessageDetail(false)}>
                    Kapat
                  </Button>
                  <Button onClick={() => {
                    setShowMessageDetail(false);
                    handleReply(selectedMessage._id);
                  }}>
                    Okundu Yap
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialogComp
          open={showAlertDialog}
          onOpenChange={setShowAlertDialog}
          onCancel={() => setShowAlertDialog(false)}
          onOk={() => handleDeleteMessage(messageId)}
        />

      </div>
    </div>
  );
}
