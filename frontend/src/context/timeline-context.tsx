import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";

export interface TimelineContextType {
  frames: any[];
  duration: number;
  scale: number;
  setCurrentTime: (time: number) => void;

  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    trackItemId: number | null; // 👈 đổi string -> number
  };
  highlightTrackItemIdRef: React.MutableRefObject<number | null>; // 👈 đổi string -> number
  animLineWidthRef: React.MutableRefObject<number>;

  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  handleContextMenu: (e: MouseEvent, trackItemId: number) => void; // 👈 đổi string -> number
  handleDownload: () => void;
  setContextMenu: Dispatch<
    SetStateAction<{
      visible: boolean;
      x: number;
      y: number;
      trackItemId: number | null; // 👈 đổi string -> number
    }>
  >;
}

export const TimelineContext = createContext<TimelineContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
  frames: any[];
  duration: number;
  scale: number;
  setCurrentTime: (time: number) => void;
}

export const TimelineProvider = ({
  children,
  frames,
  duration,
  scale,
  setCurrentTime,
}: ProviderProps) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    trackItemId: null as number | null, // 👈 đổi
  });

  const highlightTrackItemIdRef = useRef<number | null>(null); // 👈 đổi
  const animLineWidthRef = useRef<number>(2);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // TODO: implement cursor drag logic
  };

  const handleContextMenu = (e: MouseEvent, trackItemId: number) => { // 👈 đổi
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      trackItemId,
    });
  };

  const handleDownload = () => {
    console.log("Download clicked", contextMenu.trackItemId);
  };

  return (
    <TimelineContext.Provider
      value={{
        frames,
        duration,
        scale,
        setCurrentTime,
        contextMenu,
        highlightTrackItemIdRef,
        animLineWidthRef,
        handleMouseDown,
        handleContextMenu,
        handleDownload,
        setContextMenu,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
