import { Button } from "@/components/ui/button";
import { Video, ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  type: "video" | "image" | "media";
  onClick?: () => void;
};

const iconMap = {
  video: <Video className="w-5 h-5 text-cyan-600" />,
  image: <ImageIcon className="w-5 h-5 text-violet-600" />,
};

const textMap = {
  video: "Tạo video",
  image: "Tạo hình ảnh",
};

const bgMap = {
  video: "bg-cyan-100 hover:bg-cyan-200",
  image: "bg-violet-100 hover:bg-violet-200",
};
const fontMap = {
  video: "text-lg",
  image: "text-lg",
};
export function CreateCardButton({ type, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "flex items-center justify-between px-4 py-3 w-60 h-20 rounded-2xl transition cursor-pointer",
        bgMap[type]
      )}
    >
      <div className="flex items-center gap-2">
        {iconMap[type]}
        <span className={cn("font-semibold text-black", fontMap[type])}>
          {textMap[type]}
        </span>
      </div>
      <span className="flex items-center justify-center w-6 h-6 rounded-full border text-lg font-bold text-black">
        <Plus className="w-4 h-4" />
      </span>
    </Button>
  );
}
