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
  declare start_time?: number | undefined;
  declare end_time: number | undefined;
  declare asset_id?: number | undefined;
  declare width?: number | undefined;
  declare height?: number | undefined;
  declare x?: number | undefined;
  declare y?: number | undefined;
  declare scale?: number | undefined;
  declare rotation?: number | undefined;
  declare text_content?: string | undefined;
  declare created_at?: Date | undefined;
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
  declare url: string;
  declare created_at: Date;
}
