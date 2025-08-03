import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell } from "lucide-react";
import React from "react";

const Notification = () => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-gray-200 p-2 rounded-sm">
        <Bell />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        <DropdownMenuLabel className="font-bold text-lg">Notification</DropdownMenuLabel>
        <DropdownMenuItem>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis,
          similique hic rerum doloremque sapiente quas, quisquam unde officiis
          aut deleniti voluptatem. Modi officia obcaecati eos molestias
          perferendis excepturi voluptatibus aut.
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
