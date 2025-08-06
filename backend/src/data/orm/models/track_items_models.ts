import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Asset, TrackItem } from "../../models/track_items_models";

export class TrackItemModel
  extends Model<
    InferAttributes<TrackItemModel>,
    InferCreationAttributes<TrackItemModel>
  >
  implements TrackItem
{
  declare id: CreationOptional<number>;
  declare track_id: number;
  declare start_time: number;
  declare asset_id?: number | undefined;
  declare url?: string | undefined;
  declare end_time: number;
  declare x: number;
  declare y: number;
  declare scale: number;
  declare rotation: number;
  declare text_content: string;
  declare create_at?: Date;
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
  declare mime_type: string;
  declare size: number;
  declare thumbnail?: string | undefined;
  declare duration?: number | undefined;
  declare width?: number | undefined;
  declare height?: number | undefined;
  declare url: string;
  declare created_at: Date;
}
