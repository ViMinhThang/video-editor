import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmptyPage from "./pages/emty-page";
import ProjectPage from "./pages/project-page";
import { EditorWrapper } from "./components/layout/editor-layout";
import Layout from "./components/layout/main-layout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmptyPage />} />
          <Route path="projects/:projectId" element={<ProjectPage />} />
        </Route>
        <Route path="projects/:projectId/editor" element={<EditorWrapper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
