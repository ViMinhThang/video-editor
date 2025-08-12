import { DataTypes, Sequelize } from "sequelize";
import { TrackModel } from "../track_models";
import {
  AssetModel,
  TrackItemModel,
  VideoFrameModel,
} from "../track_items_models";
import { ProjectModel } from "../project_models";

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
      ...primaryKey,
      project_id: { type: DataTypes.INTEGER },
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
    },
    {
      sequelize,
      tableName: "track_items",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
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
      frame_index: { type: DataTypes.INTEGER },
      group_index: { type: DataTypes.INTEGER },
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
    as: "frames",
  });
  VideoFrameModel.belongsTo(TrackItemModel, {
    foreignKey: "track_item_id",
    as: "trackItem",
  });
};
