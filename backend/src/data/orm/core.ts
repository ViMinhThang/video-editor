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

export class BaseRepo {
  sequelize: Sequelize;
  constructor() {
    this.sequelize = new Sequelize({ ...config.settings, ...logging });
    this.initModelsAndDatabase();
  }
  async initModelsAndDatabase(): Promise<void> {
    initializeModels(this.sequelize);

    //     if (config.reset_db) {
    //       await this.sequelize.query(`

    // SELECT 'SELECT SETVAL(' ||
    //        quote_literal(quote_ident(PGT.schemaname) || '.' || quote_ident(S.relname)) ||
    //        ', COALESCE(MAX(' ||quote_ident(C.attname)|| '), 1) ) FROM ' ||
    //        quote_ident(PGT.schemaname)|| '.'||quote_ident(T.relname)|| ';'
    // FROM pg_class AS S,
    //      pg_depend AS D,
    //      pg_class AS T,
    //      pg_attribute AS C,
    //      pg_tables AS PGT
    // WHERE S.relkind = 'S'
    //     AND S.oid = D.objid
    //     AND D.refobjid = T.oid
    //     AND D.refobjid = C.attrelid
    //     AND D.refobjsubid = C.attnum
    //     AND T.relname = PGT.tablename
    // ORDER BY S.relname;

    //         `);
    //       await this.sequelize.drop();
    //       await this.sequelize.sync();
    //       await this.addSeedData();
    //     } else {
          await this.sequelize.sync();
    //     }
  }
  async addSeedData() {
    const data = JSON.parse(readFileSync(config.seed_file).toString());
    await this.sequelize.transaction(async (transaction) => {
      await UserModel.bulkCreate(data.users, { transaction });
      await ProjectModel.bulkCreate(data.projects, { transaction });
      await TrackModel.bulkCreate(data.tracks, { transaction });
      await TrackItemModel.bulkCreate(data.track_items, { transaction });
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
