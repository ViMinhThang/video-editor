// src/infrastructure/webserver/routes/track_item_routes.ts
import { Express, Request, Response } from "express";
import { TrackItemUseCases } from "../../../../../application/usecases/TrackItemUseCases";

export const createTrackItemRestApi = (app: Express) => {
  app.get("/api/track-items/:id", async (req: Request, res: Response) => {
    try {
      const trackItem = await TrackItemUseCases.getTrackItem(Number(req.params.id));
      if (!trackItem) return res.status(404).json({ message: "Not found" });
      res.json(trackItem);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.get("/api/track-items", async (req: Request, res: Response) => {
    try {
      const items = await TrackItemUseCases.getTrackItems(req.query);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.post("/api/track-items", async (req: Request, res: Response) => {
    try {
      const created = await TrackItemUseCases.createTrackItem(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.delete("/api/track-items/:id", async (req: Request, res: Response) => {
    try {
      const ok = await TrackItemUseCases.deleteTrackItem(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: "Delete failed" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });
};
