import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import {
  TrackItem,
  TrackItemConfig,
} from "../../../domain/models/track_items_models";
import { videoFrame } from "../../../domain/models/video_frame_models";
import { Asset } from "../../../domain/models/asset_models";

export class TrackItemModel
  extends Model<
    InferAttributes<TrackItemModel>,
    InferCreationAttributes<TrackItemModel>
  >
  implements TrackItem
{
  declare id: CreationOptional<number>;
  declare project_id: number;
  declare asset_id?: number | undefined;
  declare start_time: number;
  declare end_time: number;
  declare config?: TrackItemConfig | undefined;
  declare created_at?: Date | undefined;
  declare updated_at?: Date | undefined;
  declare type: "text" | "video" | "audio" | "image";
  declare video_frames?: VideoFrameModel[] | undefined;
}

export class AssetModel
  extends Model<
    InferAttributes<AssetModel>,
    InferCreationAttributes<AssetModel>
  >
  implements Asset
{
  declare id: CreationOptional<number>;
  declare file_name: string;
  declare original_name: string;
  declare project_id: number;
  declare type: string;
  declare mime_type: string;
  declare server_path: string;
  declare size: number;
  declare thumbnail?: string | undefined;
  declare url: string;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
}
export class VideoFrameModel
  extends Model<
    InferAttributes<VideoFrameModel>,
    InferCreationAttributes<VideoFrameModel>
  >
  implements videoFrame
{
  declare id: CreationOptional<number>;
  declare track_item_id: number;
  declare url: string;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
}
