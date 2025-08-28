import { SidebarLayout } from "@/components/sidebar-layout"

export default function WhatsAppLayout({
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
