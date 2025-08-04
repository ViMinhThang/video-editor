import { Express } from "express";
import { createVideoRoutes } from "./video";

export const createRoutes = (app: Express) => {
  createVideoRoutes(app);
};
