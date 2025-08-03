import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bell, Info, LaptopMinimalCheck } from "lucide-react";
import Task from "@/components/task";
import Notification from "./components/notification";
import Topbar from "./components/topbar";
import WorkspacePage from "./pages/workspacePage";
function App() {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-end gap-4">
        <Topbar />
      </div>
      <WorkspacePage />
    </div>
  );
}

export default App;
