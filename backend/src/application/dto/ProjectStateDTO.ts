// src/application/dto/ProjectStateDTO.ts
import { Asset } from "../../domain/models/track_items_models";
import { assetsWithTrackItems } from "../../domain/models/video_frame_models";

export interface TrackItemDTO {
  id: number | undefined;
  assetId: number | undefined;
  trackId: number | undefined;
  startTime: number | undefined;
  endTime: number | undefined;
  textContent?: string;
  video_frames?: {
    id: number | undefined;
    url: string;
    track_item_id: number | undefined;
  }[];
}

export interface AssetDTO {
  id: number | undefined;
  name: string;
  type: "video" | "image" | "audio";
  url?: string;
  trackItems: TrackItemDTO[];
  mime_type: string;
  thumbnail: string | undefined;
  created_at: Date | undefined;
  updated_at: Date | undefined;
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
      trackId: trackItem.track_id,
      startTime: trackItem.start_time,
      endTime: trackItem.end_time,
      textContent: trackItem.text_content,
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
