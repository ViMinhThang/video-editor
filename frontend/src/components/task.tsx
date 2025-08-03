import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LaptopMinimalCheck } from "lucide-react";
const Task = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-gray-200 p-2 rounded-sm">
        <LaptopMinimalCheck />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Tabs defaultValue="export" className="w-[400px]">
          <TabsList className="flex border-b border-gray-20 w-full">
            <TabsTrigger
              value="export"
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-black"
            >
              Xuất
              <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-transparent data-[state=active]:bg-cyan-400" />
            </TabsTrigger>

            <TabsTrigger
              value="sync"
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-black"
            >
              Đồng bộ hóa
              <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-transparent data-[state=active]:bg-cyan-400" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="sync">Change your password here.</TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Task;
