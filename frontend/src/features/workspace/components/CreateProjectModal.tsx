/**
 * @what A dialog modal that allows users to create new video projects.
 * @why Provides a focused, isolated interface for starting a new project without navigating away from the current view.
 * @how Wraps a form input in a Shadcn/UI 'Dialog' component and triggers a POST request to the project API.
 */

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import axios from "axios";

interface CreateProjectModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetchProjects: () => Promise<void>;
}

export default function CreateProjectModal({ 
  isOpen, 
  setIsOpen, 
  refetchProjects 
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await axios.post("/api/projects", { 
        title: projectName, 
        user_id: 1 
      });
      setIsOpen(false);
      setProjectName("");
      await refetchProjects();
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
        <DialogHeader>
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
             <PlusCircle className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-zinc-900">Create New Project</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Enter a name for your video masterpiece to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <label htmlFor="name" className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
             Project Name
          </label>
          <Input
            id="name"
            placeholder="e.g. Summer Vacation 2026"
            className="h-12 px-4 rounded-xl border-zinc-200 focus:ring-blue-500 focus:border-blue-500"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={isSubmitting}
            onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
            autoFocus
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="rounded-xl h-12 font-semibold"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={!projectName.trim() || isSubmitting}
            className="rounded-xl h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
