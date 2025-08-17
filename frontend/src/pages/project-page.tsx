import { ProjectProvider } from "@/context/project-context";
import WorkspacePage from "@/pages/workspacePage";

export default function ProjectPage() {
  return (
    <ProjectProvider>
      <WorkspacePage />
    </ProjectProvider>
  );
}
