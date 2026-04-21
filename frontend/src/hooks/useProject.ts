import { ProjectContext } from "@/context/project-context";
import { useContext } from "react";


export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
};