/**
 * @what Root layout component for the project dashboard and workspace.
 * @why Provides the global scaffolding (Sidebar, TopBar) and manages project-level data fetching.
 * @how Combines the Shadcn/UI 'SidebarProvider' with 'AppSidebar' and 'TopBar' to create a consistent shell for all sub-views.
 */

import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bars/app-sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Calendar, Loader2 } from "lucide-react";
import TopBar from "../nav/TopBar";

export default function MainLayout() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response: any = await axios.get("/api/projects?user_id=1");
      const formattedProjects = response.data.map((project: any) => ({
        title: project.title,
        url: `/projects/${project.id}`,
        icon: Calendar,
      }));
      setProjects(formattedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-zinc-400 bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Initializing your workspace...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} refetchProjects={fetchProjects} />
      
      <div className="flex flex-col flex-1 min-w-0 min-h-screen relative">
        <div className="fixed top-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-end px-6 transition-all" style={{ left: 'var(--sidebar-width)' }}>
          <TopBar />
        </div>
        
        <main className="flex-1 pt-24 px-8 pb-10 overflow-y-auto bg-zinc-50/50">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
