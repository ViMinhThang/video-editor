import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Task from "@/components/task";
import Notification from "@/components/notification";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between w-full mr-5">
      <div className="flex items-center">
        <span className="text-lg font-bold text-black">MyLogo</span>
      </div>

      <div className="flex items-center gap-4">
        <Button className="bg-gradient-to-r from-cyan-300 to-purple-400 text-black font-semibold px-4 py-2 rounded-lg">
          Nâng cấp
        </Button>

        <Task />
        <Notification />
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
