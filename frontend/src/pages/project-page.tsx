import { ProjectProvider } from "@/context/editor-context";
import WorkspacePage from "@/pages/workspacePage";

export default function ProjectPage() {
  return (
    <ProjectProvider>
      <WorkspacePage />
    </ProjectProvider>
  );
}
