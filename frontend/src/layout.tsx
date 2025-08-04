import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState([]);
  const fetchProjects = async () => {
    try {
      const response: any = await axios.get("/api/projects?user_id=1");
      console.log(response);
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
      <main>{children}</main>
    </SidebarProvider>
  );
}
