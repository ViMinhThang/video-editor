import { DataTypes, Sequelize } from "sequelize";
import { TrackModel } from "../track_models";
import { AssetModel, TrackItemModel } from "../track_items_models";
import { ProjectModel } from "../project_models";

const primaryKey = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
};

export const initializeTrackModels = (sequelize: Sequelize) => {
  TrackModel.init(
    {
      ...primaryKey,
      project_id: { type: DataTypes.INTEGER },
      type: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
    },
    { sequelize, tableName: "tracks" }
  );
  TrackItemModel.init(
    {
      ...primaryKey,
      track_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tracks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      asset_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "assets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      start_time: { type: DataTypes.FLOAT },
      end_time: { type: DataTypes.FLOAT },
      x: { type: DataTypes.FLOAT },
      y: { type: DataTypes.FLOAT },
      scale: { type: DataTypes.FLOAT },
      rotation: { type: DataTypes.FLOAT },
      width: { type: DataTypes.FLOAT },
      height: { type: DataTypes.FLOAT },
      text_content: { type: DataTypes.STRING },
      created_at: { type: DataTypes.DATE },
    },
    { sequelize, tableName: "track_items" }
  );
  AssetModel.init(
    {
      ...primaryKey,
      original_name: { type: DataTypes.STRING },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      file_name: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      mime_type: { type: DataTypes.STRING },
      thumbnail: { type: DataTypes.STRING },
      size: { type: DataTypes.STRING },
      created_at: { type: DataTypes.DATE },
    },
    { sequelize, tableName: "assets" }
  );
};
export const associateTrackModels = () => {
  TrackItemModel.belongsTo(AssetModel, { foreignKey: "asset_id" });
  AssetModel.hasMany(TrackItemModel, {
    foreignKey: "asset_id",
    as: "usedInTrackItems",
  });
  TrackModel.belongsTo(ProjectModel, { foreignKey: "project_id" });
  TrackModel.hasMany(TrackItemModel, { foreignKey: "track_id", as: "items" });
  TrackItemModel.belongsTo(TrackModel, { foreignKey: "track_id" });
  ProjectModel.hasMany(AssetModel, { foreignKey: "project_id" });
  AssetModel.belongsTo(ProjectModel, { foreignKey: "project_id" });
};
