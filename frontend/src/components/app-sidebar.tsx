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
import { Button } from "./ui/button";
import CreateProjectDialog from "./create-project";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

export function AppSidebar({
  projects,
  refetchProjects,
}: {
  projects: SidebarItem[];
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
