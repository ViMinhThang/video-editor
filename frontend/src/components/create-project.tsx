import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { SidebarMenuButton } from "./ui/sidebar";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetchProjects: () => Promise<void>;
};

const CreateProjectDialog = ({ isOpen, setIsOpen, refetchProjects }: Props) => {
  const [projectName, setProjectName] = useState("");

  const handleCreateProject = async () => {
    try {
      await axios.post("/api/projects", { title: projectName });
      setIsOpen(false);
      setProjectName("");
      refetchProjects();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <SidebarMenuButton asChild>
            <button className="cursor-pointer">
              <Plus /> Create new project
            </button>
          </SidebarMenuButton>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <DialogFooter>
            <Button
              onClick={handleCreateProject}
              disabled={!projectName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateProjectDialog;
