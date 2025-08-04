import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Project } from "../../project_models";



export class ProjectModel extends Model<InferAttributes<ProjectModel>,InferCreationAttributes<ProjectModel>> implements Project{
    declare id?:CreationOptional<number>;
    declare user_id:number
    declare title:string
    declare create_at?: CreationOptional<Date>;
    declare update_at?: CreationOptional<Date>;
}