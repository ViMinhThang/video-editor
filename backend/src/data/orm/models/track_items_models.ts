import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { TrackItem } from "../../models/track_items_models";

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
  declare url?: string | undefined;
  declare end_time: number;
  declare x: number;
  declare y: number;
  declare scale: number;
  declare rotation: number;
  declare text_content: string;
  declare create_at?: Date;
}
