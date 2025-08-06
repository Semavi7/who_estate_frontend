'use client'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Building2, 
  Users, 
  Eye, 
  TrendingUp, 
  MessageSquare, 
  DollarSign 
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Toplam İlanlar",
      value: "1,245",
      change: "+12%",
      changeType: "positive" as const,
      icon: Building2
    },
    {
      title: "Aktif Kullanıcılar",
      value: "8,459",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "Aylık Görüntülenme",
      value: "45.2K",
      change: "+15%",
      changeType: "positive" as const,
      icon: Eye
    },
    {
      title: "Aylık Gelir",
      value: "₺125,000",
      change: "-3%",
      changeType: "negative" as const,
      icon: DollarSign
    }
  ];

  const monthlyData = [
    { name: "Oca", ilanlar: 120, kullanicilar: 800 },
    { name: "Şub", ilanlar: 140, kullanicilar: 900 },
    { name: "Mar", ilanlar: 180, kullanicilar: 1100 },
    { name: "Nis", ilanlar: 160, kullanicilar: 1000 },
    { name: "May", ilanlar: 200, kullanicilar: 1200 },
    { name: "Haz", ilanlar: 220, kullanicilar: 1300 }
  ];

  const propertyTypes = [
    { name: "Daire", value: 45, color: "#0088FE" },
    { name: "Villa", value: 30, color: "#00C49F" },
    { name: "Ofis", value: 15, color: "#FFBB28" },
    { name: "Dükkan", value: 10, color: "#FF8042" }
  ];

  const recentActivities = [
    { id: 1, user: "Ahmet Yılmaz", action: "Yeni ilan ekledi", property: "Beşiktaş'ta Villa", time: "2 saat önce" },
    { id: 2, user: "Fatma Demir", action: "Üyelik oluşturdu", property: "", time: "4 saat önce" },
    { id: 3, user: "Mehmet Kaya", action: "İlan güncelledi", property: "Şişli'de Ofis", time: "6 saat önce" },
    { id: 4, user: "Ayşe Öztürk", action: "Mesaj gönderdi", property: "", time: "8 saat önce" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <div className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} geçen aya göre
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ilanlar" fill="#030213" name="İlanlar" />
                <Bar dataKey="kullanicilar" fill="#82ca9d" name="Kullanıcılar" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>İlan Tipleri Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: %${value}`}
                >
                  {propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="text-primary">{activity.user}</span> {activity.action}
                      {activity.property && (
                        <span className="text-muted-foreground"> - {activity.property}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <div className="text-sm">Yeni İlan</div>
                <div className="text-xs text-muted-foreground">İlan ekle</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-sm">Yeni Kullanıcı</div>
                <div className="text-xs text-muted-foreground">Kullanıcı ekle</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-sm">Mesajları Görüntüle</div>
                <div className="text-xs text-muted-foreground">12 yeni mesaj</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Eye className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-sm">Raporları Görüntüle</div>
                <div className="text-xs text-muted-foreground">Analiz raporları</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}