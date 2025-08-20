import { Sequelize } from "sequelize";
import { associateProjectModels, initializeProjectModel } from "./helpers/project_helper";
import { associateUserModels, initializeUserModels } from "./helpers/user_helpers";
import { associateTrackModels, initializeTrackModels } from "./helpers/track_helper";


export const initializeModels = (sequelize: Sequelize) => {
  initializeUserModels(sequelize);
  initializeProjectModel(sequelize);
  initializeTrackModels(sequelize);

  associateUserModels();
  associateProjectModels();
  associateTrackModels();
};
