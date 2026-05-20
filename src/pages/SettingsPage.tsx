import React, { useState } from "react"
import { Settings, Shield, Server, User, Moon, Sun, CheckCircle, Key, Copy, Check, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface TokenItem {
  id: string
  name: string
  token: string
  created: string
}

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "api" | "security">("profile")
  const [profileName, setProfileName] = useState("Harsh Vardhan")
  const [profileEmail, setProfileEmail] = useState("harsh@example.com")
  const [apiUrl, setApiUrl] = useState(
    () => (import.meta.env.VITE_API_URL as string) || "http://localhost:3001"
  )
  const [strictTransitions, setStrictTransitions] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("crm_theme") as "light" | "dark") || "light"
  )

  // Security tokens state
  const [tokens, setTokens] = useState<TokenItem[]>([
    { id: "t-1", name: "Production Webhook", token: "crm_live_8f3d...2a9e", created: "20 May 2026" },
  ])
  const [newTokenName, setNewTokenName] = useState("")
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null)

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Administrator profile settings saved successfully.")
  }

  const handleSystemSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("System configurations updated and flushed to cache.")
  }

  const handleThemeChange = (selectedTheme: "light" | "dark") => {
    setTheme(selectedTheme)
    const root = window.document.documentElement
    if (selectedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("crm_theme", selectedTheme)
    toast.success(`Theme switched to ${selectedTheme === "dark" ? "Dark" : "Light"} mode`)
  }

  // Generate a mock API token
  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTokenName.trim()) {
      toast.error("Please provide a name for the API Token")
      return
    }
    const randHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
    const tokenVal = `crm_live_${randHex}`
    const nt: TokenItem = {
      id: `t-${Date.now()}`,
      name: newTokenName,
      token: tokenVal,
      created: "Today",
    }
    setTokens((prev) => [...prev, nt])
    setNewTokenName("")
    toast.success(`API Token "${nt.name}" generated successfully!`)
  }

  const handleDeleteToken = (id: string, name: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id))
    toast.info(`Token "${name}" revoked.`)
  }

  const handleCopyToken = (id: string, fullToken: string) => {
    navigator.clipboard.writeText(fullToken)
    setCopiedTokenId(id)
    toast.success("Token copied to clipboard")
    setTimeout(() => setCopiedTokenId(null), 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="h-8 w-8 text-primary" />
          System Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Customize administrator options, manage integrations, and config theme settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Navigation settings anchors */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">Settings Sections</h4>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <User className="h-4 w-4" />
              Profile & Themes
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "api"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <Server className="h-4 w-4" />
              API & Integrations
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "security"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <Shield className="h-4 w-4" />
              Security Tokens
            </button>
          </div>
        </div>

        {/* Dynamic active tab pane */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Profile options */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information and roles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button type="submit">Save Profile</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Appearance & Themes</CardTitle>
                  <CardDescription>Customize active portal stylesheet modes.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-2xl gap-2 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-xs font-semibold">Light Mode</span>
                    {theme === "light" && <CheckCircle className="h-3.5 w-3.5 fill-primary text-white" />}
                  </button>

                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-2xl gap-2 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-xs font-semibold">Dark Mode</span>
                    {theme === "dark" && <CheckCircle className="h-3.5 w-3.5 fill-primary text-white" />}
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* System configuration */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>System & API Configuration</CardTitle>
                  <CardDescription>Manage active endpoint paths and workflow enforcements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSystemSave} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mock API Endpoint Host URL</label>
                      <input
                        type="url"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                      <div>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Strict Status Transition Enforcements</h5>
                        <p className="text-xs text-muted-foreground">Block illegal drops inside the Kanban Board dynamically</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStrictTransitions(!strictTransitions)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          strictTransitions ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            strictTransitions ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit">Save Configuration</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Security and Mock Bearer Key manager */}
              <Card className="border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Security Tokens Manager
                  </CardTitle>
                  <CardDescription>
                    Generate and manage client API bearer tokens for external lead ingestions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Token generator input */}
                  <form onSubmit={handleGenerateToken} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Token Label (e.g. Website Contact Form)"
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none text-slate-900 dark:text-white"
                    />
                    <Button type="submit">Generate Token</Button>
                  </form>

                  {/* Active Tokens Table */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Credentials</h5>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                      {tokens.map((t) => (
                        <div key={t.id} className="p-3 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{t.name}</span>
                            <div className="flex items-center gap-2 text-slate-500 font-mono select-all">
                              {t.token}
                              <button
                                type="button"
                                onClick={() => handleCopyToken(t.id, t.token)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                aria-label="Copy token"
                              >
                                {copiedTokenId === t.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-muted-foreground">{t.created}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteToken(t.id, t.name)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              aria-label="Revoke token"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {tokens.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-8">No developer keys generated yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
