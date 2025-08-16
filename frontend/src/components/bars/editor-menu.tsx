import { Link, useLocation, useParams } from "react-router-dom";
import {
  CaseUpper,
  CassetteTape,
  ClosedCaption,
  Music,
  Type,
  Wand2,
} from "lucide-react";
import { ItemProps } from "../layout/editor-layout";
interface Props {
  item: ItemProps;
  setItem: React.Dispatch<React.SetStateAction<ItemProps>>;
}
export default function EditorMenu({ item, setItem }: Props) {
  const items: ItemProps[] = [
    { title: "Phương tiện", icon: CassetteTape, type: "asset" },
    { title: "Văn bản", icon: CaseUpper, type: "text" },
    { title: "Phụ đề", icon: ClosedCaption, type: "subtitle" },
    { title: "Âm thanh", icon: Music, type: "audio" },
    { title: "Hiệu ứng", icon: Wand2, type: "effect" },
    { title: "Bộ lọc", icon: Type, type: "filter" },
  ];
  return (
    <div className="flex flex-col h-screen w-24 bg-black text-white border-r-1 border-gray-800 pt-5 pe-3 items-center">
      <span className="text-lg font-bold text-white text-center mb-2">
        Logo
      </span>
      {items.map((item) => {
        return (
          <button
            className={`flex flex-col items-center p-3 hover:bg-gray-800 rounded-sm transition cursor-pointer`}
            onClick={() => setItem(item)}
          >
            <item.icon className="w-6 h-6 mb-2" />
            <span className="text-sm text-center break-words">
              {item.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
