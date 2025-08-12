import { EditorContext } from "@/context/editor-context";
import { useContext } from "react";


export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
};