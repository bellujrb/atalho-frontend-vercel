"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSelectedCompany } from "@/hooks/companies/use-selected-company"
import { formatCNPJ } from "@/lib/validation"
import { SidebarHistory } from "@/components/chat/sidebar-history"
import { UserButton, UserProfile, useUser } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeNav, setActiveNav] = useState<string>("home")
  const { selectedCompany } = useSelectedCompany()
  const { user } = useUser()

  useEffect(() => {
    if (pathname === "/") {
      setActiveNav("home")
    } else if (pathname === "/automations") {
      setActiveNav("automations")
    } else if (pathname === "/erp") {
      setActiveNav("erp")
    } else if (pathname === "/bancos") {
      setActiveNav("bancos")
    } else if (pathname === "/whatsapp") {
      setActiveNav("whatsapp")
    } else if (pathname.startsWith("/chat/")) {
      setActiveNav("")
    }
  }, [pathname])

  const handleCompanyClick = () => {
    if (selectedCompany) {
      router.push("/")
    } else {
      router.push("/companies")
    }
  }

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-col gap-2 p-2">
            <div 
              className="flex flex-col cursor-pointer hover:bg-accent p-2 rounded-md transition-colors"
              onClick={handleCompanyClick}
            >
              {selectedCompany ? (
                <>
                  <span className="text-lg font-semibold text-foreground">{selectedCompany.displayName}</span>
                  <span className="text-xs text-muted-foreground">{formatCNPJ(selectedCompany.taxId)}</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-semibold text-muted-foreground">Selecionar Empresa</span>
                  <span className="text-xs text-muted-foreground">Clique para escolher</span>
                </>
              )}
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    router.push("/")
                  }}
                  className={activeNav === "home" ? "text-black  bg-sidebar-accent" : ""}
                >
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    router.push("/automations")
                  }}
                  className={activeNav === "automations" ? "text-black  bg-sidebar-accent" : ""}
                >
                  <span>Automações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat History */}
        {selectedCompany && (
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarHistory />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Integrações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    router.push("/erp")
                  }}
                  className={activeNav === "erp" ? "text-black  bg-sidebar-accent" : ""}
                >
                  <span>ERP</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    router.push("/bancos")
                  }}
                  className={activeNav === "bancos" ? "text-black  bg-sidebar-accent" : ""}
                >
                  <span>Bancos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    router.push("/whatsapp")
                  }}
                  className={activeNav === "whatsapp" ? "text-black  bg-sidebar-accent" : ""}
                >
                  <span>WhatsApp</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <div className="flex items-center gap-3 hover:bg-accent rounded-md p-2 transition-colors">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonAvatarBox: "h-8 w-8",
                }
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                @{user?.username || 'usuario'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress || 'email@exemplo.com'}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
