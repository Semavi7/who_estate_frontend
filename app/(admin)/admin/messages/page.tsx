'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/ui/dialog";
import { Textarea } from "../../../../components/ui/textarea";
import { 
  Search, 
  Filter,
  Mail,
  MailOpen,
  Eye,
  Reply,
  Trash2,
  User,
  Calendar,
  Phone
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
  repliedAt?: string;
  replyMessage?: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: "Ali Yılmaz",
      email: "ali@example.com",
      phone: "+90 (532) 123 4567",
      subject: "Beşiktaş'taki villa hakkında bilgi",
      message: "Merhaba, sitenizdeki Beşiktaş'ta yer alan villa hakkında detaylı bilgi almak istiyorum. Görüş ayarlanabilir mi?",
      status: "unread",
      createdAt: "2024-01-25T10:30:00"
    },
    {
      id: 2,
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      subject: "Şişli daire fiyat sorgusu",
      message: "Şişli'deki 3+1 dairenin fiyat detaylarını öğrenebilir miyim? Kredi imkanı var mı?",
      status: "read",
      createdAt: "2024-01-24T14:15:00"
    },
    {
      id: 3,
      name: "Mehmet Özkan",
      email: "mehmet@example.com",
      phone: "+90 (535) 987 6543",
      subject: "Ofis kiralaması",
      message: "Levent'teki ofis kiralaması için detayları öğrenmek istiyorum. Aylık kira bedeli nedir?",
      status: "replied",
      createdAt: "2024-01-23T09:45:00",
      repliedAt: "2024-01-23T16:20:00",
      replyMessage: "Merhaba Mehmet Bey, ofis kiralaması için size detaylı bilgi gönderiyoruz. Aylık kira bedeli 45.000 TL'dir."
    },
    {
      id: 4,
      name: "Ayşe Demir",
      email: "ayse@example.com",
      subject: "Site tanıtım videosu",
      message: "Sitenizde tanıtım videoları çok güzel. Benzer evler var mı?",
      status: "read",
      createdAt: "2024-01-22T11:20:00"
    },
    {
      id: 5,
      name: "Fatih Yıldız",
      email: "fatih@example.com",
      phone: "+90 (533) 456 7890",
      subject: "Yatırım fırsatları",
      message: "Yatırım amaçlı emlak alımı yapmak istiyorum. Hangi bölgeleri önerirsiniz?",
      status: "unread",
      createdAt: "2024-01-21T16:30:00"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
    
    // Mark as read if unread
    if (message.status === "unread") {
      setMessages(messages.map(m => 
        m.id === message.id 
          ? { ...m, status: "read" as const }
          : m
      ));
    }
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setReplyMessage("");
    setShowReplyDialog(true);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyMessage.trim()) {
      toast.error("Lütfen yanıt mesajını yazın");
      return;
    }

    setMessages(messages.map(m => 
      m.id === selectedMessage.id 
        ? { 
            ...m, 
            status: "replied" as const, 
            repliedAt: new Date().toISOString(),
            replyMessage: replyMessage.trim()
          }
        : m
    ));

    toast.success("Yanıt başarıyla gönderildi");
    setShowReplyDialog(false);
    setReplyMessage("");
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
      setMessages(messages.filter(m => m.id !== id));
      toast.success("Mesaj silindi");
    }
  };

  const getStatusBadge = (status: Message['status']) => {
    switch (status) {
      case 'unread':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Okunmamış</Badge>;
      case 'read':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Okundu</Badge>;
      case 'replied':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Yanıtlandı</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;
  const repliedCount = messages.filter(m => m.status === "replied").length;

  return (
    <div className="space-y-6">
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
              <Mail className="h-8 w-8 text-blue-600" />
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
              <MailOpen className="h-8 w-8 text-orange-600" />
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
              <Reply className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Yanıtlandı</p>
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
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtreler</span>
            </Button>
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
                  <TableHead>Konu</TableHead>
                  <TableHead>Mesaj Önizleme</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id} className={message.status === 'unread' ? 'bg-blue-50/50' : ''}>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm">{message.name}</div>
                            <div className="text-xs text-gray-500">{message.email}</div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-48">
                      <div className="truncate">{message.subject}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-64">
                      <div className="truncate">{message.message}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(message.status)}
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
                          onClick={() => handleReply(message)}
                          className="text-blue-600"
                        >
                          <Reply className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMessage(message.id)}
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
                  <strong>Durum:</strong> {getStatusBadge(selectedMessage.status)}
                </div>
                <div>
                  <strong>E-posta:</strong> {selectedMessage.email}
                </div>
                <div>
                  <strong>Tarih:</strong> {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
                </div>
                {selectedMessage.phone && (
                  <div className="col-span-2">
                    <strong>Telefon:</strong> {selectedMessage.phone}
                  </div>
                )}
              </div>
              
              <div>
                <strong>Konu:</strong>
                <div className="mt-1 p-2 bg-gray-50 rounded">{selectedMessage.subject}</div>
              </div>
              
              <div>
                <strong>Mesaj:</strong>
                <div className="mt-1 p-4 bg-gray-50 rounded whitespace-pre-wrap">{selectedMessage.message}</div>
              </div>

              {selectedMessage.replyMessage && (
                <div>
                  <strong>Yanıtınız ({selectedMessage.repliedAt && new Date(selectedMessage.repliedAt).toLocaleString('tr-TR')}):</strong>
                  <div className="mt-1 p-4 bg-green-50 rounded whitespace-pre-wrap">{selectedMessage.replyMessage}</div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowMessageDetail(false)}>
                  Kapat
                </Button>
                <Button onClick={() => {
                  setShowMessageDetail(false);
                  handleReply(selectedMessage);
                }}>
                  Yanıtla
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mesajı Yanıtla</DialogTitle>
            <DialogDescription>
              {selectedMessage ? `${selectedMessage.name} adlı kişiye yanıt gönderiyorsunuz. Yanıtınız e-posta ile iletilecektir.` : "Mesaj yanıtlama formu"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm bg-gray-50 p-3 rounded">
              <strong>Orijinal Mesaj:</strong>
              <div className="mt-1">{selectedMessage?.message}</div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Yanıtınız:</label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Yanıt mesajınızı yazın..."
                className="min-h-32"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                İptal
              </Button>
              <Button onClick={handleSendReply}>
                Yanıt Gönder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
