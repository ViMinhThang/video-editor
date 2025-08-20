import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Project } from "../../models/project_models";

export class ProjectModel
  extends Model<
    InferAttributes<ProjectModel>,
    InferCreationAttributes<ProjectModel>
  >
  implements Project
{
  declare id?: CreationOptional<number>;
  declare user_id: number;
  declare title: string;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
}
