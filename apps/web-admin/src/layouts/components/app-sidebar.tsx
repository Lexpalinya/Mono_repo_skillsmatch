"use client"

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@skillsmatch/ui"
import { Link } from "@tanstack/react-router"
import { SquarePlay } from "lucide-react"
import type React from "react"
import { NavMain } from "./nav-main"
import { getSidebarData } from "../data"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = getSidebarData()

  return (
    <Sidebar collapsible="icon" className="!border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to={"/app"}>
                <SquarePlay className="h-5 w-5" />
                <span className="text-base font-semibold">SkillMatch</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.groups} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
