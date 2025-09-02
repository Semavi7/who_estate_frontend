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
import PropertyGetData from "@/dto/getproperty.dto";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/tr";
import Link from "next/link";
import AddCustomer from "@/components/admin/AddCustomer";
import { Clientintake } from "../clientintake/page";

interface PieChart {
  name: string,
  value: number,
  color: string
}

export default function AdminDashboard() {
  const [monthlyData, setMonthlyData] = useState<
    { name: string; ilanlar: number; aylıkGörüntülenme: number; müşteri: number }[]
  >([])
  const [propertyCount, setpropertyCount] = useState({ total: 0 })
  const [properties, setPropertis] = useState<PropertyGetData[]>([])
  const [monthlyView, setMonthlyView] = useState(0)
  const [pieChart, setPieChart] = useState<PieChart[]>([])
  const [showClientintakeDialog, setShowClientintakeDialog] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [clienIntake, setClientintake] = useState<Clientintake[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ilanRes, viewsRes, toplamRes, monthlyViewRes, pieChartRes, resMessages, resUsers, resClientIntake] = await Promise.all([
          api.get("/properties/yearlistings"),
          api.get("/track-view"),
          api.get("/properties/count"),
          api.get("/track-view/month"),
          api.get('/properties/piechart'),
          api.get('/messages'),
          api.get('/user'),
          api.get('/client-intake')
        ]);

        const ilanData = ilanRes.data
        const viewsData = viewsRes.data

        const mergedData = ilanData.map((ilan: any) => {
          const match = viewsData.find((v: any) => v.month === ilan.month)
          const ilanMonthIndex = parseInt(ilan.month.split("-")[1], 10) - 1
          const monthlyClients = resClientIntake.data.filter((ci: any) => {
            const d = new Date(ci.createdAt);
            return d.getMonth() === ilanMonthIndex;
          })
          return {
            name: getMonthName(ilan.month),
            ilanlar: ilan.count,
            aylıkGörüntülenme: match ? match.views : 0,
            müşteri: monthlyClients ? monthlyClients.length : 0
          }
        })



        const filteredPieChartData: PieChart[] = pieChartRes.data
        const filteredPieChart = filteredPieChartData.filter((item: PieChart) => item.value > 0)

        setMonthlyData(mergedData)
        setpropertyCount(toplamRes.data)
        setMonthlyView(monthlyViewRes.data)
        setPieChart(filteredPieChart)
        setMessageCount(resMessages.data.length)
        setUserCount(resUsers.data.length)
        setClientintake(resClientIntake.data)
      } catch (error) {
        toast.error('Veriler çekilirken bir hata oluştu.')
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    const fecthProperties = async () => {
      try {
        const res = await api.get('/properties/lastsix')
        setPropertis(res.data)
      } catch (error) {
        toast.error('İlanları çekerken bir hata oluştu')
      }
    }
    fecthProperties()
  }, [])

  const getMonthName = (month: string) => {
    const months = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Ekm", "Kas", "Ara"
    ];
    return months[parseInt(month.split("-")[1], 10) - 1];
  }

  dayjs.extend(relativeTime);
  dayjs.locale("tr")

  const propertyfour = properties.slice(0, 4)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const clientIntakeCount = clienIntake.filter(item => {
    const d = new Date(item.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Aktif Kullanıcılar</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Aylık Müşteri Sayısır</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{clientIntakeCount}</div>
          </CardContent>
        </Card>
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
                <Bar dataKey="müşteri" fill="#4f659c" name="Aylık Müşteri" />
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
              {propertyfour.map((property) => (
                <div key={property._id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="text-primary">{property.user?.name} {property.user?.surname}</span> yeni ilan ekledi
                      <span className="text-muted-foreground"> - {property.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{dayjs(property.createdAt).fromNow()}</div>
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
              <Link href={'addproperty'}>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Building2 className="h-8 w-8 text-primary mb-2" />
                  <div className="text-sm">Yeni İlan</div>
                  <div className="text-xs text-muted-foreground">İlan ekle</div>
                </div>
              </Link>
              <div onClick={() => setShowClientintakeDialog(true)} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-sm">Yeni Müşteri</div>
                <div className="text-xs text-muted-foreground">Kullanıcı ekle</div>
              </div>
              <Link href={'messages'}>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-sm">Mesajları Görüntüle</div>
                  <div className="text-xs text-muted-foreground">{messageCount} yeni mesaj</div>
                </div>
              </Link>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Eye className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-sm">Raporları Görüntüle</div>
                <div className="text-xs text-muted-foreground">Analiz raporları</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AddCustomer
          open={showClientintakeDialog}
          onOpenChange={setShowClientintakeDialog}
          setShowClientintakeDialog={() => setShowClientintakeDialog(false)}
        />

      </div>
    </div>
  );
}