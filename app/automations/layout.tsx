import { SidebarLayout } from "@/components/sidebar-layout"

export default function AutomationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  )
}
