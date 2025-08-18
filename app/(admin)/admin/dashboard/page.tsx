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
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface PieChart {
  name: string,
  value: number,
  color: string
}

export default function AdminDashboard() {
  const [monthlyData, setMonthlyData] = useState<
    { name: string; ilanlar: number; aylıkGörüntülenme: number }[]
  >([])
  const [propertyCount, setpropertyCount] = useState({ total: 0 })
  const [monthlyView, setMonthlyView] = useState(0)
  const [pieChart, setPieChart] = useState<PieChart[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ilanRes, viewsRes, toplamRes, monthlyViewRes, pieChartRes] = await Promise.all([
          api.get("/properties/yearlistings"),
          api.get("/track-view"),
          api.get("/properties/count"),
          api.get("/track-view/month"),
          api.get('/properties/piechart')
        ]);

        const ilanData = ilanRes.data
        const viewsData = viewsRes.data

        const mergedData = ilanData.map((ilan: any) => {
          const match = viewsData.find((v: any) => v.month === ilan.month)
          return {
            name: getMonthName(ilan.month),
            ilanlar: ilan.count,
            aylıkGörüntülenme: match ? match.views : 0,
          }
        })

        const filteredPieChartData: PieChart[] = pieChartRes.data
        const filteredPieChart = filteredPieChartData.filter((item: PieChart)=> item.value > 0)

        setMonthlyData(mergedData)
        setpropertyCount(toplamRes.data)
        setMonthlyView(monthlyViewRes.data)
        setPieChart(filteredPieChart)
      } catch (error) {
       toast.error('Veriler çekilirken bir hata oluştu.')
      }
    }

    fetchData();
  }, [])

  const getMonthName = (month: string) => {
    const months = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Ekm", "Kas", "Ara"
    ];
    return months[parseInt(month.split("-")[1], 10) - 1];
  }

  const stats = [
    {
      title: "Aktif Kullanıcılar",
      value: "8,459",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "Aylık Gelir",
      value: "₺125,000",
      change: "-3%",
      changeType: "negative" as const,
      icon: DollarSign
    }
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Toplam İlanlar</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{propertyCount.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Aylık Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{monthlyView}</div>
          </CardContent>
        </Card>

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
                <Bar dataKey="aylıkGörüntülenme" fill="#82ca9d" name="Aylık Görüntülenme" />
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
                  data={pieChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => (value !== undefined && value > 0) ? `${name}: %${Math.floor(value)}` : null}
                >
                  {pieChart.map((entry, index) => (
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