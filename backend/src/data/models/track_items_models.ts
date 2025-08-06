export interface TrackItem {
  id?: number;
  track_id: number;
  asset_id?: number;
  start_time: number;
  end_time: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  text_content: string;
  created_at?: Date;
}

export interface Asset {
  id?: number;
  original_name: string;
  url:string
  thumbnail?:string
  file_name: string;
  mime_type: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  created_at: Date;
}
