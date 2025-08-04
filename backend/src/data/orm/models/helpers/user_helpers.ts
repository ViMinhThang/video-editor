import { DataTypes, Sequelize } from "sequelize";
import { UserModel } from "../user_models";
import { ProjectModel } from "../project_models";

export const initializeUserModels = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
    },
    { sequelize }
  );
};
export const associateUserModels = () => {
  UserModel.hasMany(ProjectModel, { foreignKey: "user_id" });
};
