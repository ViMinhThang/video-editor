import { BaseRepo } from "./core";
import { AddQueries } from "./queries";
import { AddStorage } from "./storage";
const VideoRepo = AddStorage(AddQueries(BaseRepo));

export const VideoRepoImpl = VideoRepo;
