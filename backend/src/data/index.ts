import { VideoRepoImpl } from "./orm";
import { VideoRepository } from "./video_repository";

const repo = new VideoRepoImpl();

export const video_repo: VideoRepository = repo;
