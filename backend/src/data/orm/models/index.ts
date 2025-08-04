import { Sequelize } from "sequelize";
import { associateProjectModels, initializeProjectModel } from "./helpers/project_helper";
import { associateUserModels, initializeUserModels } from "./helpers/user_helpers";
import { associateTrackModels, initializeTrackModels } from "./helpers/track_helper";

export {UserModel} from "./user_models"
export {ProjectModel} from "./project_models"
export {TrackModel} from "./track_models"
export {TrackItemModel} from "./track_items_models"

export const initializeModels = (sequelize: Sequelize) => {
  initializeUserModels(sequelize);
  initializeProjectModel(sequelize);
  initializeTrackModels(sequelize);

  associateUserModels();
  associateProjectModels();
  associateTrackModels();
};
