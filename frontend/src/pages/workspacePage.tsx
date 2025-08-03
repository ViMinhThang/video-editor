import Cardmodi from "@/components/card-custom";
import { CreateCardButton } from "@/components/CreateButtons";
import React from "react";

export default function WorkspacePage() {
  return (
    <div className="w-[1600px]">
      <div className="flex flex-col mt-[80px] ml-5">
        <h1 className="font-bold text-lg mb-5">My WorkSpace</h1>
        <div className="flex gap-4 mb-5">
          <CreateCardButton type="video" />
          <CreateCardButton type="image" />
        </div>
      </div>
      <hr className="ml-5"/>
      <div className="ml-5">
        <CreateCardButton type="media" />
        <Cardmodi />
      </div>
    </div>
  );
}
