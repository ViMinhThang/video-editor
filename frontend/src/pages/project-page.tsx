import WorkspacePage from "@/pages/workspacePage";
import { useParams } from "react-router-dom";

export default function ProjectPage() {
  const { id } = useParams();
  return <WorkspacePage projectId={id} />;
}
