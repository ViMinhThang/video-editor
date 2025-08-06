import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmptyPage from "./pages/emty-page";
import ProjectPage from "./pages/project-page";
createRoot(document.getElementById("root")!).render(
 <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmptyPage />} />
          <Route path="projects/:id" element={<ProjectPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
