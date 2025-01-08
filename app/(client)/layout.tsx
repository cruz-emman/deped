import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Suspense } from "react"
import Loading from "../loading"



export default function SidebarProviderLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <Suspense fallback={<Loading />}>
      <SidebarProvider>
        <AppSidebar />
        <main className="px-2 w-full ">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </Suspense>
  )
}
