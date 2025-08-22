import { DataTypes, Sequelize } from "sequelize";
import { ProjectModel } from "../project_models";
import {
  TrackItemModel,
  AssetModel,
  VideoFrameModel,
} from "../track_items_models";
import { TrackModel } from "../track_models";

const primaryKey = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
};

export const initializeTrackModels = (sequelize: Sequelize) => {
  TrackModel.init(
    {
      ...primaryKey,
      type: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      tableName: "tracks",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  TrackItemModel.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      project_id: DataTypes.INTEGER,
      asset_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      start_time: DataTypes.FLOAT,
      end_time: DataTypes.FLOAT,
      config: DataTypes.JSONB,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    { sequelize, tableName: "track_items", underscored: true }
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
      type: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      mime_type: { type: DataTypes.STRING },
      thumbnail: { type: DataTypes.STRING },
      size: { type: DataTypes.STRING },
      server_path: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: "assets",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  VideoFrameModel.init(
    {
      ...primaryKey,
      track_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "track_items", key: "id" },
        onDelete: "CASCADE",
      },
      url: { type: DataTypes.STRING },
    },
    {
      sequelize,
      tableName: "video_frames",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
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
  TrackItemModel.hasMany(VideoFrameModel, {
    foreignKey: "track_item_id",
    as: "video_frames",
  });
  VideoFrameModel.belongsTo(TrackItemModel, {
    foreignKey: "track_item_id",
    as: "trackItem",
  });
};
