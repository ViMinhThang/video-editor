import { Express, Request, Response } from "express";
import { TrackUseCases } from "../../../../application/usecases/TrackUseCases";

export const createTrackRestApi = (app: Express) => {
  app.get("/api/tracks/:id", async (req: Request, res: Response) => {
    const track = await TrackUseCases.getOne(Number(req.params.id));
    if (!track) return res.status(404).json({ message: "Not found" });
    res.json(track);
  });

  app.get("/api/tracks", async (req: Request, res: Response) => {
    const tracks = await TrackUseCases.getMany(req.query);
    res.json(tracks);
  });

  app.post("/api/tracks", async (req: Request, res: Response) => {
    const created = await TrackUseCases.store(req.body);
    res.status(201).json(created);
  });

  app.put("/api/tracks/:id", async (req: Request, res: Response) => {
    const updated = await TrackUseCases.replace(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Update failed" });
    res.json(updated);
  });

  app.delete("/api/tracks/:id", async (req: Request, res: Response) => {
    const ok = await TrackUseCases.delete(Number(req.params.id));
    if (!ok) return res.status(404).json({ message: "Delete failed" });
    res.json({ success: true });
  });
};
