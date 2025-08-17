import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEditorContext } from "@/hooks/use-editor";
import { useParams } from "react-router-dom";
import { importSrt } from "@/api/track-api";
import { Asset } from "@/types";

const SubtitlePage = ({ asset }: { asset: Asset }) => {
  const { projectId } = useParams<string>();
  const { fetchProject } = useEditorContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadSrt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    await importSrt(file, projectId, asset.id);
    await fetchProject();
  };

  return (
    <div className="border-none bg-black text-white px-5 w-full h-full">
      <div className="text-white font-bold border-b border-gray-800 px-5 py-2">
        <h1>Alice's project</h1>
      </div>
      <div className="mt-5">
        <input
          type="file"
          className="hidden"
          accept=".srt"
          ref={inputRef}
          onChange={handleUploadSrt}
        />
        <Button
          className="w-60 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Upload /> Tải lên
        </Button>
      </div>
      <div className="mt-5 flex flex-wrap"></div>
    </div>
  );
};

export default SubtitlePage;
