import { DataTypes, Sequelize } from "sequelize";
import { UserModel } from "../user_models";
import { ProjectModel } from "../../../../data/orm/models/project_models";

export const initializeUserModels = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
export const associateUserModels = () => {
  UserModel.hasMany(ProjectModel, { foreignKey: "user_id" });
};
