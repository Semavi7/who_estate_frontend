'use client'
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import {
    LayoutDashboard,
    Building2,
    User,
    Users,
    MessageSquare,
    Settings,
    Globe,
    LogOut,
    Menu,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/lib/redux/authSlice";
import { persistor } from "@/lib/redux/store";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname()
    const user = useSelector(selectUser)
    const menuItems = [
        { id: "admin-dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { id: "admin-properties", icon: Building2, label: "İlanlar", path: "/admin/properties" },
        { id: "admin-features", icon: Settings, label: "Özellik Yönetimi", path: "/admin/features" },
        { id: "admin-profile", icon: User, label: "Kullanıcı Bilgileri", path: "/admin/profile" },
        { id: "admin-users", icon: Users, label: "Kullanıcılar", path: "/admin/users" },
        { id: "admin-messages", icon: MessageSquare, label: "Mesajlar", path: "/admin/messages" },
        { id: "home", icon: Globe, label: "Siteye Git", path: "/" },
    ]

    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        dispatch(logout())
        await persistor.purge()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center space-x-2">
                                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                                    <div className="h-5 w-5 flex items-center justify-center text-sm">🏠</div>
                                </div>
                                <span className="text-lg">Admin Panel</span>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="py-45"
                        >
                            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.path}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                        // Artık burası hata vermeyecek çünkü 'pathname' yukarıda tanımlı.
                                        pathname === item.path
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        } ${sidebarCollapsed ? "justify-center" : ""}`}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        {!sidebarCollapsed && <span>Çıkış Yap</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-35">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl text-gray-900">
                                {menuItems.find(item => item.path === pathname)?.label || "Dashboard"}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <div className="text-sm">{user?.name} {user?.surname}</div>
                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                </div>
                                <Avatar>
                                    <AvatarImage src={user?.image} />
                                    <AvatarFallback>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                                        {user?.surname ? user.surname.charAt(0).toUpperCase() : ''}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
            <Toaster richColors position="top-right" />
        </div>
    );
}

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
