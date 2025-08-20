import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Asset, TrackItem } from "../../models/track_items_models";
import { videoFrame } from "../../models/video_frame_models";

export class TrackItemModel
  extends Model<
    InferAttributes<TrackItemModel>,
    InferCreationAttributes<TrackItemModel>
  >
  implements TrackItem
{
  declare id: CreationOptional<number>;
  declare track_id: number;
  declare start_time?: number | undefined;
  declare end_time: number | undefined;
  declare asset_id?: number | undefined;
  declare project_id: number;
  declare width?: number | undefined;
  declare height?: number | undefined;
  declare x?: number | undefined;
  declare y?: number | undefined;
  declare scale?: number | undefined;
  declare rotation?: number | undefined;
  declare text_content?: string | undefined;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
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
