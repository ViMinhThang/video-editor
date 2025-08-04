import { BaseRepo } from "./core";
import { AddQueries } from "./queries";

const VideoRepo = AddQueries(BaseRepo);

export const VideoRepoImpl = VideoRepo;
