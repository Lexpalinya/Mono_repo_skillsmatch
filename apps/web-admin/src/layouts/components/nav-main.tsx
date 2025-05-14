import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@skillsmatch/ui";
import { Link, useRouterState } from "@tanstack/react-router";

export type INavMain = {
  groups: {
    title: string;
    url: string;

    items: {
      title: string;
      url: string;
    }[];
  }[];
};

export function NavMain({ groups }: INavMain) {
  const location = useRouterState({ select: (s) => s.location });

  const isActive = (path: string) => {
    return location.pathname.startsWith("/app" + path);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {groups.map((item,idx) => (
          <SidebarMenuItem key={idx}>
            <SidebarMenuButton asChild>
              <Link to={"/app/" + item.url} className="font-medium">
                {item.title}
              </Link>
            </SidebarMenuButton>
            {item.items?.length ? (
              <SidebarMenuSub>
                {item.items.map((item,idx) => (
                  <SidebarMenuSubItem key={idx}>
                    <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
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
