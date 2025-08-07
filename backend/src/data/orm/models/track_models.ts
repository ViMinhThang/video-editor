import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Track} from "../../models/track_models";



export class TrackModel extends Model<InferAttributes<TrackModel>,InferCreationAttributes<TrackModel>> implements Track{
    declare id:CreationOptional<number>
    declare project_id: number;
    declare type:string;
    declare order: number;
}