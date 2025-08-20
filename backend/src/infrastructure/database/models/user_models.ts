import {
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "../../../domain/models/user_models";

export class UserModel
  extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>
  implements User
{
  declare id?: CreationOptional<number>;
  declare name: string;
  declare password: string;
  declare email: string;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
}
