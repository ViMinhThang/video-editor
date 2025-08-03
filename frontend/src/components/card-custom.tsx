import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis } from "lucide-react";

const Cardmodi = () => {
  return (
    <Card className="w-[300px] mt-5">
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="flex-row justify-center items-center">
        <h1 className="font-bold">asdasd.mp4</h1>
        <div className="ml-auto my-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-gray-200 p-2 rounded-sm">
              <Ellipsis className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50">
              <DropdownMenuLabel className="text-sm text-red-500">Xoa</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Cardmodi;
