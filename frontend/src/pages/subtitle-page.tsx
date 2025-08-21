import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEditorContext } from "@/hooks/use-editor";
import { useParams } from "react-router-dom";
import { importSrt } from "@/api/track-api";
import { Asset } from "@/types";
import { takeLastItemStart } from "@/lib/utils";

const SubtitlePage = () => {
  const { projectId } = useParams<string>();
  const { fetchProject, setTracks, tracks, addTextItem, duration, asset } =
    useEditorContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const texts = tracks.text;
  const handleUploadSrt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    const res = await importSrt(file, projectId, asset.id);
    if (!res) return;
    setTracks((prev) => ({
      ...prev,
      text: [...prev.text, ...res.data.asset],
    }));
    await fetchProject();
  };
  console.log(takeLastItemStart(tracks.video));
  return (
    <div className="border-none bg-black text-white px-5 w-full h-full">
      <div className="text-white font-bold border-b border-gray-800 px-5 py-2">
        <h1>Alice's project</h1>
      </div>
      <div className="flex w-full max-w-lg gap-2 py-2 border-b border-gray-800">
        <input
          type="file"
          className="hidden"
          accept=".srt"
          ref={inputRef}
          onChange={handleUploadSrt}
        />
        <Button
          className="flex-1 h-12 flex items-center justify-center rounded-xs cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Upload /> Tải lên phụ đề
        </Button>
        <Button
          className="flex-1 h-12 flex items-center justify-center rounded-xs cursor-pointer"
          onClick={() => addTextItem(takeLastItemStart(tracks.video), asset.id)}
        >
          Tạo text
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {texts &&
          texts.map((item, idx) => (
            <Button key={idx} className="cursor-pointer rounded-xs w-[31%]">
              {item.startTime} - {item.endTime}
            </Button>
          ))}
      </div>
      <div className="mt-5 flex flex-wrap"></div>
    </div>
  );
};

export default SubtitlePage;
