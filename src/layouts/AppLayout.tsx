import React, { useState, useEffect, useRef } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  Kanban,
  LogOut,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NotificationItem {
  id: string
  title: string
  time: string
  read: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline Board", href: "/board", icon: Kanban },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
]

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("crm_theme") as "light" | "dark") || "light"
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("crm_auth_token")
  )
  const [loginEmail, setLoginEmail] = useState("harsh@example.com")
  const [loginPassword, setLoginPassword] = useState("admin123")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Dynamic notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "n-1", title: "Sophia Martinez was moved to 'CONTACTED'", time: "10 mins ago", read: false },
    { id: "n-2", title: "New prospect dossier ingested: David Vance", time: "2 hours ago", read: false },
    { id: "n-3", title: "Elena Rostova verified to QUALIFIED status", time: "5 hours ago", read: true },
  ])

  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("crm_theme", theme)
  }, [theme])

  // Click outside to close notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setTimeout(() => {
      localStorage.setItem("crm_auth_token", "mock_secret_token_12345")
      setIsAuthenticated(true)
      setIsLoggingIn(false)
      toast.success("Successfully logged in as Harsh Vardhan!")
    }, 800)
  }

  const handleLogout = () => {
    localStorage.removeItem("crm_auth_token")
    setIsAuthenticated(false)
    toast.info("Logged out successfully.")
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // If the user is not authenticated, show a state-of-the-art SaaS login portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-xs text-muted-foreground mt-1">Sign in to manage your CRM pipeline</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 text-slate-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign In as Administrator
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
            <p className="text-[11px] text-muted-foreground">
              Mock environment active. Use any email and password credentials.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-2.5">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 dark:text-white leading-tight">Mini CRM</h1>
            <span className="text-xs text-muted-foreground font-medium">Lead Management</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User profile section with fully functional LOGOUT button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex-shrink-0">
              HV
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">Harsh Vardhan</h4>
              <p className="text-xs text-muted-foreground truncate">harsh@example.com</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl flex-shrink-0"
              onClick={handleLogout}
              aria-label="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="font-semibold text-slate-900 dark:text-white leading-tight">Mini CRM</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile logout option */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
              HV
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Harsh Vardhan</h4>
              <p className="text-xs text-muted-foreground">harsh@example.com</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl flex-shrink-0"
              onClick={handleLogout}
              aria-label="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search CRM..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-lg border-0 focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl text-slate-600 dark:text-slate-400"
              aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Dynamic Interactive Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-xl text-slate-600 dark:text-slate-400"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </Button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className={`pt-2 cursor-pointer first:pt-0 group flex flex-col`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-xs text-slate-700 dark:text-slate-300 transition-colors ${!n.read ? "font-semibold text-slate-900 dark:text-white" : ""}`}>
                            {n.title}
                          </p>
                          {!n.read && <span className="h-1.5 w-1.5 bg-rose-500 rounded-full flex-shrink-0 mt-1.5" />}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{n.time}</span>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No notifications yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

            <div className="flex items-center gap-2.5">
              <div className="text-right hidden md:block">
                <span className="block text-xs font-semibold text-slate-900 dark:text-white leading-none">
                  Harsh Vardhan
                </span>
                <span className="text-[10px] text-emerald-500 font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
