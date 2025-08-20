import { Sequelize } from "sequelize";
import { getConfig } from "../../config";

import {
  initializeModels,
} from "../database/models";

import { readFileSync } from "fs";
import { ProjectModel } from "../database/models/project_models";
import { TrackItemModel } from "../database/models/track_items_models";
import { TrackModel } from "../database/models/track_models";
import { UserModel } from "../database/models/user_models";

const config = getConfig("videos:orm_repo");

const logging = config.logging
  ? { logging: console.log, logQueryParameters: true }
  : { logging: false };

export class BaseRepo {
  sequelize: Sequelize;
  constructor() {
    this.sequelize = new Sequelize({ ...config.settings, ...logging });
    this.initModelsAndDatabase();
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
  private async dropAllModels(): Promise<void> {
    await TrackItemModel.drop({ cascade: true });
    await TrackModel.drop({ cascade: true });
    await ProjectModel.drop({ cascade: true });
    await UserModel.drop({ cascade: true });
  }
}
export type Constructor<T = {}> = new (...args: any[]) => T;
