import { Sequelize } from "sequelize";
import { getConfig } from "../../config";

import {
  initializeModels,
  ProjectModel,
  TrackItemModel,
  TrackModel,
  UserModel,
} from "./models";

import { readFileSync } from "fs";

const config = getConfig("videos:orm_repo");

const logging = config.logging
  ? { logging: console.log, logQueryParameters: true }
  : { logging: false };

export class Database {
  private static instance: Database;
  sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize({ ...config.settings, ...logging });
    this.initModelsAndDatabase();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async initModelsAndDatabase(): Promise<void> {
    initializeModels(this.sequelize);

    if (config.reset_db) {
      await this.sequelize.drop();
      await this.sequelize.sync();
      await this.addSeedData();
    } else {
      await this.sequelize.sync();
    }
  }

  async addSeedData() {
    const data = JSON.parse(readFileSync(config.seed_file).toString());
    await this.sequelize.transaction(async (transaction) => {
      await UserModel.bulkCreate(data.users, { transaction });
      await ProjectModel.bulkCreate(data.projects, { transaction });
      await TrackModel.bulkCreate(data.tracks, { transaction });
    });
  }
}

export const db = Database.getInstance();
