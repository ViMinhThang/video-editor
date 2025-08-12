import { EditorProvider } from "@/context/editor-context";
import WorkspacePage from "@/pages/workspacePage";

export default function ProjectPage() {
  return (
    <EditorProvider>
      <WorkspacePage />
    </EditorProvider>
  );
}
