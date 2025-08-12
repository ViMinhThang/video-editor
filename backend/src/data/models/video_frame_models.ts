export interface videoFrame {
  id?: number;
  track_item_id: number;
  frame_index: number;
  group_index: number;
  url: string;
  created_at?: Date;
  updated_at?: Date;
}
