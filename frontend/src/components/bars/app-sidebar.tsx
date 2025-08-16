import { Calendar, Home, Inbox, Plus, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CreateProjectDialog from "../create-project";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "@/types";

export function AppSidebar({
  projects,
  refetchProjects,
}: {
  projects: Project[];
  refetchProjects: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    ...projects,
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  return (
    <Sidebar className="bg-white">
      <SidebarContent className="fixed top-18">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="w-60">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <CreateProjectDialog
                  isOpen={open}
                  setIsOpen={setOpen}
                  refetchProjects={refetchProjects}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
