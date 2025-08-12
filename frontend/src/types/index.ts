export interface Asset {
  created_at: string;
  id: number;
  mime_type: string;
  thumbnail: string;
  original_name: string;
}
export interface Project {
  title: string;
  url: string;
  icon: React.ElementType;
  id: string;
}
