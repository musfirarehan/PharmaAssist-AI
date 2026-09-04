"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Upload,
  Pill,
  MessageSquareText,
  BellRing,
  FileBarChart2,
  FileText,
  Stethoscope,
  LifeBuoy,
  Settings,
  ArrowLeftRight,
  ShieldCheck,
  History,
  ClipboardList,
  Users,
  Search,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Upload Prescription", href: "/upload", icon: Upload },
  { title: "Prescription Review", href: "/medicines", icon: FileText },
  { title: "Patient Management", href: "/patients", icon: Users },
  { title: "AI-Assisted Counseling", href: "/counseling", icon: ClipboardList },
  { title: "Medication Knowledge Search", href: "/knowledge", icon: Search },
  { title: "Interaction & Safety", href: "/safety", icon: ShieldCheck },
  { title: "Patient Communication", href: "/chat", icon: MessageSquareText },
  { title: "Reminders", href: "/reminders", icon: BellRing },
  { title: "Reports", href: "/reports", icon: FileBarChart2 },
]

const supportNav = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help & Support", href: "/support", icon: LifeBuoy },
]

const patientNav = [
  { title: "Prescription Upload", href: "/upload", icon: Upload },
  { title: "My Medicines", href: "/patient", icon: Pill },
  { title: "AI Medication Counseling", href: "/patient/counseling", icon: ClipboardList },
  { title: "AI Pharmacist Chat", href: "/chat", icon: MessageSquareText },
  { title: "Reminders", href: "/reminders", icon: BellRing },
  { title: "Medication Safety", href: "/patient/safety", icon: ShieldCheck },
  { title: "Prescription History", href: "/patient/history", icon: History },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [portal, setPortal] = useState<"pharmacist" | "patient">("pharmacist")

  useEffect(() => {
    const savedPortal = localStorage.getItem("portal")
    if (savedPortal === "patient" || savedPortal === "pharmacist") {
      setPortal(savedPortal)
    }
  }, [])

  const switchPortal = () => {
    const nextPortal = portal === "pharmacist" ? "patient" : "pharmacist"
    localStorage.setItem("portal", nextPortal)
    setPortal(nextPortal)
    window.location.href = nextPortal === "patient" ? "/patient" : "/"
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("portal")
    localStorage.removeItem("registration")
    localStorage.removeItem("profile")
    window.location.href = "/"
  }
  const navigation = portal === "patient" ? patientNav : mainNav

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sidebar-foreground">
              PharmaAssist
            </span>
            <span className="text-xs text-muted-foreground">
              {portal === "patient" ? "Patient Portal" : "Pharmacist Portal"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button
          type="button"
          onClick={switchPortal}
          className="mb-2 flex w-full items-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-left text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <ArrowLeftRight className="size-4" />
          Switch to {portal === "patient" ? "pharmacist" : "patient"} portal
        </button>
        <button
          type="button"
          onClick={logout}
          className="mb-2 flex w-full items-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-left text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="size-4" />
          Log out
        </button>
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">
            {portal === "patient" ? "Your medication space" : "AI Assistant Pro"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {portal === "patient"
              ? "Your prescription information and reminders in one place."
              : "Unlimited prescription analysis and priority processing."}
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
