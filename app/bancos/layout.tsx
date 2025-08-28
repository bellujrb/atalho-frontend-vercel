import { SidebarLayout } from "@/components/sidebar-layout"

export default function BancosLayout({
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
