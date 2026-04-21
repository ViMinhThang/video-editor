export interface SrtItem {
  index: number;
  start: number;
  end: number;
  text: string;
}

export const timeToSec = (time: string) => {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
};

export const parseSrt = (content: string): SrtItem[] => {
  const items: SrtItem[] = [];
  const blocks = content.split(/\r?\n\r?\n/);
  blocks.forEach((block) => {
    const lines = block.split(/\r?\n/);
    if (lines.length >= 3) {
      const index = Number(lines[0]);
      const times = lines[1].split(" --> ");
      const text = lines.slice(2).join("\n");
      items.push({
        index,
        start: timeToSec(times[0]),
        end: timeToSec(times[1]),
        text,
      });
    }
  });
  return items;
};

export const calculateNumbFrames = (duration: number, frameSpacing = 2) => {
  return Math.ceil(duration / frameSpacing);
};

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds - Math.floor(seconds)) * 100);
  return `${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
}
