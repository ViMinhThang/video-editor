import { Sequelize } from "sequelize";
import { associateProjectModels, initializeProjectModel } from "./helpers/project_helper";
import { associateUserModels, initializeUserModels } from "./helpers/user_helpers";
import { associateTrackModels, initializeTrackModels } from "./helpers/track_helper";

export {UserModel} from "./user_models"
export {ProjectModel} from "../../../data/orm/models/project_models"
export {TrackModel} from "../../../data/orm/models/track_models"
export {TrackItemModel} from "../../../data/orm/models/track_items_models"

export const initializeModels = (sequelize: Sequelize) => {
  initializeUserModels(sequelize);
  initializeProjectModel(sequelize);
  initializeTrackModels(sequelize);

  associateUserModels();
  associateProjectModels();
  associateTrackModels();
};
