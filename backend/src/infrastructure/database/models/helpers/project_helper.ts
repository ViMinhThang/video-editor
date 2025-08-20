import { DataTypes, Sequelize } from "sequelize";
import { UserModel } from "../user_models";
import { ProjectModel } from "../project_models";
import { TrackModel } from "../track_models";

export const initializeProjectModel = (sequelize: Sequelize) => {
  ProjectModel.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      title: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: "projects",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
export const associateProjectModels = () => {
  ProjectModel.belongsTo(UserModel, { foreignKey: "user_id" });
  ProjectModel.hasMany(TrackModel, { foreignKey: "project_id", as: "tracks" });
};
