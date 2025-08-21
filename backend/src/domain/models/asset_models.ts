
export interface Asset {
  id?: number;
  original_name: string;
  url: string;
  server_path: string;
  type: string;
  thumbnail?: string;
  file_name: string;
  project_id: number;
  mime_type: string;
  size: number;
  created_at?: Date;
  updated_at?: Date;
}
