import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Suspense } from "react"

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
)


export default function SidebarProviderLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <Suspense fallback={<LoadingFallback />}>
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
