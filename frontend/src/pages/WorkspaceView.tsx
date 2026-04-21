/**
 * @what Page component that renders the detailed workspace for a specific project.
 * @why Acts as a route-level container that provides necessary context (ProjectProvider) to the dashboard.
 * @how Wraps the 'WorkspaceDashboard' feature component within the project-specific context provider.
 */

import React from "react";
import { ProjectProvider } from "@/context/project-context";
import WorkspaceDashboard from "@/features/workspace/components/WorkspaceDashboard";

export default function WorkspaceView() {
  return (
    <ProjectProvider>
      <WorkspaceDashboard />
    </ProjectProvider>
  );
}
