export interface INavMain {
  groups: {
    title: string;
    url: string;
    items: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}

import { Link } from "@tanstack/react-router";
import { getSidebarData } from "../data";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@skillsmatch/ui";
const data = getSidebarData();
export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.groups.map((group) => (
          <SidebarMenuItem key={group.title}>
            <SidebarMenuButton asChild>
              <Link to ={"/app/"+group.url} href={group.url} className="font-medium">
                {group.title}
              </Link>
            </SidebarMenuButton>
            {group.items?.length ? (
              <SidebarMenuSub>
                {group.items.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={item.isActive}
                      className="relative"
                    >
                      <Link to={"/app/" + item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
