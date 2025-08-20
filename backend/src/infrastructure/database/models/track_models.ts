import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Track } from "../../../domain/models/track_models";

export class TrackModel
  extends Model<
    InferAttributes<TrackModel>,
    InferCreationAttributes<TrackModel>
  >
  implements Track
{
  declare id: CreationOptional<number>;
  declare type: string;
  declare order: number;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
}
