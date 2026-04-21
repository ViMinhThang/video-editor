/**
 * @what Main entry point for the React application.
 * @why It initializes the React root and defines the top-level routing architecture.
 * @how Uses 'react-router-dom' to map URL paths to the newly restructured page components.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeView from "./pages/HomeView";
import WorkspaceView from "./pages/WorkspaceView";
import { EditorWrapper } from "./features/editor/components/EditorLayout";
import MainLayout from "./components/shared/layout/MainLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeView />} />
          <Route path="projects/:projectId" element={<WorkspaceView />} />
        </Route>
        <Route path="projects/:projectId/editor" element={<EditorWrapper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
