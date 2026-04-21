import { EditorContext } from "@/context/editor-context";
import { useContext } from "react";

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditorContext must be used within EditorProvider");
  return context;
};
