/**
 * @what Dashboard navigation bar containing breadcrumbs and user profile actions.
 * @why Provides essential wayfinding ('Projects > [Title]') and access to global notifications/tasks.
 * @how Implements a responsive layout with 'lucide-react' icons and English-only UI labels.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Task from "@/components/task";
import Notification from "@/components/notification";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface TopBarProps {
  projectTitle?: string;
}

export default function TopBar({ projectTitle }: TopBarProps) {
  return (
    <div className="flex items-center justify-between w-full px-6 py-3 bg-white border-b border-gray-100">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <Link to="/" className="hover:text-black transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Projects
        </Link>
        {projectTitle && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black font-semibold truncate max-w-[200px]">
              {projectTitle}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all h-9">
          Upgrade
        </Button>

        <Task />
        <Notification />
        
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="User"
            />
            <AvatarFallback>UR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
