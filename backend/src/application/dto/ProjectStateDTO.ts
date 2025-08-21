// src/application/dto/ProjectStateDTO.ts
import { Asset } from "../../domain/models/asset_models";
import { assetsWithTrackItems } from "../../domain/models/video_frame_models";

export interface VideoFrameDTO {
  id?: number;
  url: string;
  track_item_id?: number;
}

export interface VideoConfigDTO {
  scale?: number;
  rotation?: number;
  opacity?: number;
  crop?: { x: number; y: number; w: number; h: number };
}

export interface AudioConfigDTO {
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface TextConfigDTO {
  text?: string;
  font?: string;
  fontSize?: number;
  color?: string;
  x?: number;
  y?: number;
  rotation?: number;
}

export type TrackItemConfigDTO =
  | VideoConfigDTO
  | AudioConfigDTO
  | TextConfigDTO;

export interface TrackItemDTO {
  id?: number;
  assetId?: number;
  projectId: number;
  type: "video" | "audio" | "text" | "image";
  startTime?: number;
  endTime?: number;
  config?: TrackItemConfigDTO;
  video_frames?: VideoFrameDTO[];
}

export interface AssetDTO {
  id?: number;
  name: string;
  type: "video" | "image" | "audio";
  url?: string;
  trackItems: TrackItemDTO[];
  mime_type: string;
  thumbnail?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProjectStateDTO {
  id: number;
  name: string;
  assets: AssetDTO[];
}

// Mapper
export class ProjectStateMapper {
  static toTrackItemDTO(trackItem: assetsWithTrackItems): TrackItemDTO {
    return {
      id: trackItem.id,
      assetId: trackItem.asset_id,
      projectId: trackItem.project_id,
      type: trackItem.type as "video" | "audio" | "text" | "image",
      startTime: trackItem.start_time,
      endTime: trackItem.end_time,
      config: trackItem.config ?? undefined, // lấy config từ DB
      video_frames: trackItem.video_frames?.map((vf) => ({
        id: vf.id,
        url: vf.url,
        track_item_id: trackItem.id,
      })),
    };
  }

  static toAssetDTO(
    asset: Asset,
    trackItems: assetsWithTrackItems[]
  ): AssetDTO {
    return {
      id: asset.id,
      name: asset.original_name,
      type: asset.type as "video" | "image" | "audio",
      url: asset.url ?? undefined,
      trackItems: trackItems.map((ti) => this.toTrackItemDTO(ti)),
      mime_type: asset.mime_type,
      thumbnail: asset.thumbnail,
      created_at: asset.created_at,
      updated_at: asset.updated_at,
    };
  }

  static toProjectStateDTO(
    project: any,
    assets: Asset[],
    trackItemsWithFrames: assetsWithTrackItems[]
  ): ProjectStateDTO {
    return {
      id: project.id,
      name: project.name,
      assets: assets.map((asset) => {
        const relatedTrackItems = trackItemsWithFrames.filter(
          (ti) => ti.asset_id === asset.id
        );
        return this.toAssetDTO(asset, relatedTrackItems);
      }),
    };
  }
}
