import { Request, Response, NextFunction } from "express";
import { WebService } from "./web_service";

export class ExpressController<T> {
  constructor(private ws: WebService<T>) {}

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.ws.getOne(req.params.id);
      if (!data) return res.status(404).json({ error: "Not Found" });
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  getMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.ws.getMany(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.ws.store(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await this.ws.delete(req.params.id);
      if (!success) return res.status(404).json({ error: "Not Found or already deleted" });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.ws.replace(req.params.id, req.body);
      if (!data) return res.status(404).json({ error: "Not Found" });
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.ws.modify(req.params.id, req.body);
      if (!data) return res.status(404).json({ error: "Not Found" });
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
}
