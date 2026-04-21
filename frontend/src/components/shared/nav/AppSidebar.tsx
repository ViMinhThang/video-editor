/**
 * @what Persistent sidebar for navigating between different video projects and global settings.
 * @why Provides a high-level context switcher for the user's workspace.
 * @how Utilizes Shadcn/UI sidebar components and integrates the 'CreateProjectModal' for quick workspace expansion.
 */

import React, { useState } from "react";
import { Settings, Video, LayoutDashboard, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import CreateProjectModal from "@/features/workspace/components/CreateProjectModal";
import { Link, useLocation } from "react-router-dom";
import type { Project } from "@/types";

interface AppSidebarProps {
  projects: Project[];
  refetchProjects: () => Promise<void>;
}

export function AppSidebar({
  projects,
  refetchProjects,
}: AppSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ...projects.map(p => ({ ...p, icon: Video })),
    { title: "Settings", url: "#", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-zinc-100 shadow-sm">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-zinc-900 tracking-tight">VidEditor</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <div className="px-2 mb-4">
             <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Navigation</h4>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`h-10 px-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              <div className="mt-6 px-2 mb-4">
                 <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</h4>
              </div>

              <SidebarMenuItem>
                <button
                   onClick={() => setIsModalOpen(true)}
                   className="w-full flex items-center gap-3 h-10 px-3 rounded-xl text-zinc-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm hover:ring-1 hover:ring-blue-100 transition-all duration-200 group"
                >
                   <div className="bg-zinc-100 p-1 rounded-md group-hover:bg-blue-100 transition-colors">
                     <Plus className="w-3.5 h-3.5 group-hover:text-blue-600" />
                   </div>
                   <span className="text-sm font-medium">New Project</span>
                </button>
                <CreateProjectModal
                   isOpen={isModalOpen}
                   setIsOpen={setIsModalOpen}
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
