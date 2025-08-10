import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Topbar from "../src/components/topbar";

export default function Layout() {
  const [projects, setProjects] = useState([]);
  const fetchProjects = async () => {
    try {
      const response: any = await axios.get("/api/projects?user_id=1");
      const formattedProjects = response.data.map((project: any) => ({
        title: project.title,
        url: `/projects/${project.id}`,
        icon: Calendar,
      }));
      setProjects(formattedProjects);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  if (!projects.length) return <div>Loading sidebar...</div>;

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} refetchProjects={fetchProjects} />
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-end gap-4">
        <Topbar />
      </div>
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
