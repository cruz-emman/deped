"use client"

import { Home ,  Users2, FileUser, User, Lock } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SignOutButton from "./signout"
import Link from "next/link"
import { useCurrentRole } from "@/hooks/user-role"
import { useQuery } from "@tanstack/react-query"
import { useCurrentSessionId } from "@/hooks/user-sessionId"




export function AppSidebar() {

  const role = useCurrentRole()
  const sessionId = useCurrentSessionId()

  const { data } = useQuery({
    queryKey: ['user', sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/authorizeAccount/${sessionId}`)
      return res.json()
    }
  })



  //This is admin side wherein may CRUD for Division Office and Admin
  if (role === 'super_admin') {
    return <UserAdminAccount />
  }

  //Main division Office admin
  if (role === 'division_office_admin') {
    return <DivisionOfficeAdminSideBar />
  }

  //For School Admn
  if (role === 'school_admin') {
    return <SchoolOfficeAdminSideBar />
  }

  //Under division office but not admin

  if (role === 'division_office') {
    return <UserAccount id={sessionId} />
  }

  //Under school admin office but not admin

  if(role === 'teacher'){
    return <UserAccount id={sessionId} />

  }

  // Otherwise, show regular user account based on data
  return data !== null ? <UserWithAccount id={sessionId} /> : <UserWithoutAccount />
}

//This is admin wherein I have DO and ADMIN side
function UserAdminAccount() {
  const items = [
    {
      title: "Home",
      url: "/main",
      icon: Home,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: Users2,
    },
    // {
    //   title: "Result",
    //   url: "/result",
    //   icon: ChartBar,
    // },
  ]
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )


}

function UserAccount({ id }: { id: string | undefined }) {
  const items = [
    {
      title: "Home",
      url: "/main",
      icon: Home,
    },

    {
      title: "My Account",
      url: `/myaccount/${id}`,
      icon: Users2,
    },
    {
      title: "Certificates",
      url: `/certificates/${id}`,
      icon: FileUser
    },
    {
      title: "Change Password",
      url: `/mycredentials/${id}`,
      icon: Lock,
    },
  ]
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )


}



//NOt null
function UserWithAccount({ id }: { id: string | undefined }) {

  //User with account
  const userItem = [
    {
      title: "Home",
      url: "/main",
      icon: Home,
    },
    {
      title: "Change Password",
      url: `/mycredentials/${id}`,
      icon: User,
    },
    {
      title: "My Account",
      url: `/myaccount/${id}`,
      icon: Users2,
    },
    {
      title: "Certificates",
      url: `/certificates`,
      icon: FileUser
    }
  ]


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <>
                {userItem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )

}

//NULL
function UserWithoutAccount() {
  const userItem = [
    {
      title: "Home",
      url: "/main",
      icon: Home,
    },
    {
      title: "My Account",
      url: `/newaccount`,
      icon: Users2,
    },
  ]


  return (

    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <>
                {userItem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )

}


function DivisionOfficeAdminSideBar() {
  const items = [
    {
      title: "Home",
      url: "/main",
      icon: Home,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: Users2,
    },
    // {
    //   title: "Result",
    //   url: "/result",
    //   icon: ChartBar,
    // },
  ]
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )
}


function SchoolOfficeAdminSideBar() {
  const items = [
    {
      title: "Home",
      url: "/main",
      icon: Home,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: Users2,
    },
    // {
    //   title: "Result",
    //   url: "/result",
    //   icon: ChartBar,
    // },
  ]
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )
}