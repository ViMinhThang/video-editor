import feathersExpress, { rest } from "@feathersjs/express";
import { feathers } from "@feathersjs/feathers";
import { ProjectWebService } from "./projects_api";
import { FeathersWrapper } from "./feathers_adapter";
import { Express } from "express";

export const createFeathersServices = (app: Express) => {
  const feathersApp = feathersExpress(feathers(), app).configure(rest());

  const projectService = new ProjectWebService();
  feathersApp.use("/api/projects", new FeathersWrapper(projectService));

  feathersApp.hooks({
    error: {
      all: [
        (ctx) => {
          if (ctx.error) {
            ctx.http = { status: 400 };
          }
        },
      ],
    },
  });
};
