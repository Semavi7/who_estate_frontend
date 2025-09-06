'use client'
import { useEffect, useState } from "react";
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
    X,
    UserPen
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/lib/redux/authSlice";
import { persistor } from "@/lib/redux/store";
import { ModeToggle } from "@/components/ui/darkmode";
import NotificationButton from "@/components/admin/NotificationButton";
import { useTheme } from "next-themes";
import { Tooltip } from 'react-tooltip';
import Image from "next/image";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname()
    const user = useSelector(selectUser)
    const { theme } = useTheme()
    const [isMobile, setIsMobile] = useState(false)
    const menuItems = [
        { id: "admin-dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { id: "admin-properties", icon: Building2, label: "İlanlar", path: "/admin/properties" },
        { id: "admin-clientintake", icon: UserPen, label: "Müşteri Takip", path: "/admin/clientintake" },
        { id: "admin-features", icon: Settings, label: "Özellik Yönetimi", path: "/admin/features" },
        { id: "admin-profile", icon: User, label: "Kullanıcı Bilgileri", path: "/admin/profile" },
        { id: "admin-users", icon: Users, label: "Kullanıcılar", path: "/admin/users" },
        { id: "admin-messages", icon: MessageSquare, label: "Mesajlar", path: "/admin/messages" },
        { id: "home", icon: Globe, label: "Siteye Git", path: "/" },
    ]

    const filteredMenuItems = menuItems.filter(item => {
        if (item.id === "admin-users" || item.id === "admin-features") {
            return user?.role === 'admin'
        }
        return true
    })

    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        dispatch(logout())
        await persistor.purge()
        router.push('/')
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsMobile(mediaQuery.matches);

        const handleMediaQueryChange = (e: any) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden">
            {/* Sidebar */}
            <div className={`
                bg-sidebar text-sidebar-foreground border-r border-accent 
                transition-[width,transform,box-shadow] 
                duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                ${sidebarCollapsed ? 'w-16' : 'w-51'} 
                flex flex-col
                will-change-[width]
`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-accent">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex pl-15 md:pl-0 items-center space-x-2">
                                <Image
                                    alt=""
                                    width={32}
                                    height={32}
                                    src={theme === "dark" ? "/arkasıbosbeyazyazı.png" : "/e76e564c-c0ae-4241-97a0-4df87dec2b07.png"}
                                    className="h-8 w-8"
                                />
                                <span className="text-md text-sidebar-foreground hidden md:block">Admin Panel</span>
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
                        {filteredMenuItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    id={item.id}
                                    href={item.path}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.path
                                        ? 'bg-sidebar text-sidebar-foreground'
                                        : 'text-gray-500 hover:bg-gray-700'
                                        } ${sidebarCollapsed ? "justify-center" : ""}`}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                                {sidebarCollapsed && (
                                    <Tooltip anchorSelect={`#${item.id}`} place="right" content={item.label} />
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="border-t border-accent">
                    <NotificationButton prop={sidebarCollapsed} />
                    <button
                        className={`w-full flex items-center  px-3 py-2 rounded-lg text-gray-500  hover:bg-gray-700 hover:text-red-600 transition-colors ${!sidebarCollapsed ? "space-x-3" : "justify-center"}`}
                        onClick={handleLogout}
                        id="logout-button"
                    >
                        <LogOut className="h-5 w-5" />
                        {!sidebarCollapsed && <span className="text-sm">Çıkış Yap</span>}
                    </button>
                    {sidebarCollapsed && (
                        <Tooltip anchorSelect="#logout-button" place="right" content="Çıkış Yap" />
                    )}

                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-sidebar border-b border-accent px-4 sm:px-6 py-35">
                    <div className="flex items-center justify-between">
                        <div>
                            {isMobile ? (sidebarCollapsed && (<h1 className="text-[14px]">
                                {menuItems.find(item => item.path === pathname)?.label || "Dashboard"}
                            </h1>)) : <h1 className="text-xl ">
                                {menuItems.find(item => item.path === pathname)?.label || "Dashboard"}
                            </h1>}
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                {isMobile ? (sidebarCollapsed && (<div className="text-right">
                                    <div className="text-sm">{user?.name} {user?.surname}</div>
                                </div>)) : <div className="text-right">
                                    <div className="text-sm">{user?.name} {user?.surname}</div>
                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                </div>}
                                <Avatar>
                                    <AvatarImage src={user?.image} />
                                    <AvatarFallback>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                                        {user?.surname ? user.surname.charAt(0).toUpperCase() : ''}
                                    </AvatarFallback>
                                </Avatar>
                                <ModeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

